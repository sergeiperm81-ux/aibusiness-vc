import "server-only";
import crypto from "crypto";
import snapshot from "@/data/stats-snapshot.json";

export type Stats = typeof snapshot;

const PROPERTY_ID = process.env.GA_PROPERTY_ID || "532602792";
const ALL_TIME_SINCE = "2026-01-01";
const TTL_MS = 1000 * 60 * 30; // 30 minutes

let cache: { at: number; data: Stats } | null = null;

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function getPrivateKey(): string {
  const b64 = process.env.GA_SA_PRIVATE_KEY_B64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  // Allow a raw key with escaped newlines as an alternative
  const raw = process.env.GA_SA_PRIVATE_KEY;
  if (raw) return raw.replace(/\\n/g, "\n");
  throw new Error("GA service-account private key not configured");
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GA_SA_EMAIL;
  if (!email) throw new Error("GA_SA_EMAIL not configured");
  const key = getPrivateKey();

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signingInput = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(signingInput).sign(key);
  const jwt = `${signingInput}.${b64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("no access_token in response");
  return json.access_token;
}

interface GaRow {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}
interface GaReport {
  rows?: GaRow[];
}

async function batchRunReports(token: string): Promise<GaReport[]> {
  const allTime = { startDate: ALL_TIME_SINCE, endDate: "yesterday" };
  const body = {
    requests: [
      {
        dateRanges: [
          { startDate: "7daysAgo", endDate: "yesterday" },
          { startDate: "30daysAgo", endDate: "yesterday" },
          allTime,
        ],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      },
      {
        dateRanges: [allTime],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 8,
      },
      {
        dateRanges: [allTime],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "bounceRate" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      },
      {
        dateRanges: [allTime],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "bounceRate" }],
        metricFilter: {
          filter: {
            fieldName: "screenPageViews",
            numericFilter: { operation: "GREATER_THAN_OR_EQUAL", value: { int64Value: "15" } },
          },
        },
        orderBys: [{ metric: { metricName: "bounceRate" }, desc: true }],
        limit: 5,
      },
      {
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
    ],
  };

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:batchRunReports`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`runReport failed: ${res.status}`);
  const json = (await res.json()) as { reports?: GaReport[] };
  if (!json.reports || json.reports.length < 5) throw new Error("unexpected GA response");
  return json.reports;
}

function num(v?: string): number {
  return Math.round(Number(v ?? 0)) || 0;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// GA returns the `date` dimension as "YYYYMMDD" — format it as "Jun 12".
function fmtGaDate(d: string): string {
  if (d.length !== 8) return d;
  const month = MONTHS[Number(d.slice(4, 6)) - 1] ?? d.slice(4, 6);
  return `${month} ${Number(d.slice(6, 8))}`;
}

async function fetchLiveStats(): Promise<Stats> {
  const token = await getAccessToken();
  const [overview, countriesR, topR, worstR, dailyR] = await batchRunReports(token);

  // Overview: rows = device x dateRange (date_range_0=7d, _1=30d, _2=all-time)
  const totals = [
    { users: 0, sessions: 0, pageviews: 0 },
    { users: 0, sessions: 0, pageviews: 0 },
    { users: 0, sessions: 0, pageviews: 0 },
  ];
  const deviceMap = new Map<string, number>();
  for (const row of overview.rows ?? []) {
    const device = row.dimensionValues?.[0]?.value ?? "";
    const rangeLabel = row.dimensionValues?.[1]?.value ?? "date_range_0";
    const idx = Number(rangeLabel.replace("date_range_", "")) || 0;
    const users = num(row.metricValues?.[0]?.value);
    const sessions = num(row.metricValues?.[1]?.value);
    const views = num(row.metricValues?.[2]?.value);
    if (totals[idx]) {
      totals[idx].users += users;
      totals[idx].sessions += sessions;
      totals[idx].pageviews += views;
    }
    if (idx === 2) deviceMap.set(device, (deviceMap.get(device) ?? 0) + users);
  }

  const deviceLabel: Record<string, string> = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet", "smart tv": "Smart TV" };
  const devices = [...deviceMap.entries()]
    .map(([name, users]) => ({ name: deviceLabel[name] ?? (name.charAt(0).toUpperCase() + name.slice(1)), users }))
    .sort((a, b) => b.users - a.users);

  const countries = (countriesR.rows ?? []).map((row) => {
    const name = row.dimensionValues?.[0]?.value ?? "Unknown";
    return { name: name === "(not set)" ? "Unknown" : name, users: num(row.metricValues?.[0]?.value) };
  });

  const mapPages = (r: GaReport) =>
    (r.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: num(row.metricValues?.[0]?.value),
      bounce: Math.round((Number(row.metricValues?.[1]?.value ?? 0)) * 100),
    }));

  const daily = (dailyR.rows ?? []).map((row) => ({
    date: fmtGaDate(row.dimensionValues?.[0]?.value ?? ""),
    users: num(row.metricValues?.[0]?.value),
    sessions: num(row.metricValues?.[1]?.value),
    pageviews: num(row.metricValues?.[2]?.value),
  }));

  return {
    generatedAt: todayIso(),
    source: snapshot.source,
    allTimeSince: ALL_TIME_SINCE,
    visitors: {
      last7days: totals[0],
      last30days: totals[1],
      allTime: totals[2],
    },
    daily,
    countries,
    devices,
    topPages: mapPages(topR),
    worstPages: mapPages(worstR),
  };
}

/**
 * Returns live GA stats (cached 30 min). Falls back to the baked-in snapshot
 * if credentials are missing or the GA request fails — the page never breaks.
 */
export async function getStats(): Promise<{ data: Stats; live: boolean }> {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return { data: cache.data, live: true };
  }
  try {
    const data = await fetchLiveStats();
    cache = { at: Date.now(), data };
    return { data, live: true };
  } catch {
    return { data: snapshot, live: false };
  }
}
