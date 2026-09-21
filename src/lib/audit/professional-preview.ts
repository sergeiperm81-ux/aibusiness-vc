/**
 * The free step of AI Professional Scan: from one profile link, who is this?
 *
 * One Perplexity request, the only model that identified a person from a bare
 * link in the 21.09 test. It returns the name, role, company and field that
 * every paid question is then built from, so the person types nothing but the
 * link.
 *
 * What comes back is a model's output and is treated as untrusted: every field
 * is cut to a length and stripped of anything that could steer a later prompt
 * or break an email. If the model cannot tell who this is, the page offers no
 * payment.
 *
 * Paid, so it is capped: per address per day, per day in total, and cached per
 * profile, so the same link twice costs once. Storage failures close it.
 */

import { createHash, randomBytes } from "node:crypto";
import { postJson } from "./paid-http";
import type { DurableKv } from "./durable-kv";
import type { ScanKind } from "./company-check";
import type { SocialProfile } from "./social-profile";

/** What a preview is run on: a social profile, or a company's site. */
export type PreviewTarget = Pick<SocialProfile, "url" | "networkLabel" | "handle">;

export const PREVIEW_MODEL = "sonar";
export const PREVIEW_TTL_SECONDS = 7 * 24 * 3600;
export const PREVIEWS_PER_IP_PER_DAY = 3;
export const PREVIEWS_PER_DAY = 150;
const TIMEOUT_MS = 60_000;

export interface Preview {
  readonly id: string;
  /** Absent on previews made before AI Company Scan: those are all people. */
  readonly kind?: ScanKind;
  readonly profileUrl: string;
  readonly network: string;
  readonly found: boolean;
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly field: string;
  readonly location: string;
  /** The page the model cited that best matches the profile, when there is one. */
  readonly source: string | null;
  readonly createdAt: string;
}

export type PreviewResult =
  | { readonly ok: true; readonly preview: Preview }
  | { readonly ok: false; readonly reason: "rate_limited" | "unavailable" | "failed" };

const previewKey = (id: string): string => `pscan:preview:${id}`;
const cacheKey = (url: string): string => `pscan:preview-by-url:${createHash("sha256").update(url).digest("hex").slice(0, 32)}`;

/**
 * Keeps a model's string safe to put into a question, a PDF and an email:
 * one line, no angle brackets or quote marks, no URLs, bounded length.
 */
export function cleanField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[<>"`{}[\]\\|]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
    .trim();
}

/** A name is letters, spaces, hyphens, apostrophes and dots, in any script. */
export function cleanName(value: unknown): string {
  const name = cleanField(value, 80).replace(/[^\p{L}\p{M}\s.'-]/gu, "").replace(/\s+/g, " ").trim();
  return name.split(" ").length >= 2 || name.length >= 3 ? name : "";
}

const INSTRUCTIONS =
  "You identify the owner of a public social profile from its address. Search the web. " +
  "Return JSON with: found (true only if you can tell who this specific profile belongs to), name (full name), " +
  "role (professional role today), company (company or project), field (their field in a few words), location (city or country). " +
  "Use empty strings for anything you cannot find. Never guess: if you are not sure it is this profile, set found to false.";

// "Company" alone made the model refuse publications and one-person businesses (21.09 test on aibusiness.vc);
// reading the site's own About and Contact pages is what finds the owner.
const COMPANY_INSTRUCTIONS =
  "You identify who is behind a website: a company, a publication, a studio or a one-person business. " +
  "Search the web and read the site itself, its About and Contact pages. Return JSON with: found (true when the site or other pages say who runs it), " +
  "name (the name it presents itself under), role (what it does, in a few words), company (its legal entity if a page names one, otherwise an empty string), " +
  "field (its industry in a few words), location (city and country of its base, if stated). " +
  "Use empty strings for anything you cannot find. Set found to false only if nothing says who runs the site.";

const SCHEMA = {
  type: "object",
  properties: {
    found: { type: "boolean" },
    name: { type: "string" },
    role: { type: "string" },
    company: { type: "string" },
    field: { type: "string" },
    location: { type: "string" },
  },
  required: ["found", "name", "role", "company", "field", "location"],
};

interface SonarPayload {
  choices?: { message?: { content?: string } }[];
  citations?: unknown;
  search_results?: { url?: string }[];
}

export function parseIdentity(json: unknown, profile: PreviewTarget, kind: ScanKind = "person"): Omit<Preview, "id" | "createdAt"> {
  const payload = (json ?? {}) as SonarPayload;
  let raw: Record<string, unknown> = {};
  try {
    raw = JSON.parse(payload.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
  } catch {
    raw = {};
  }
  // A company name may carry digits and symbols ("3M", "AT&T"); a person's may not.
  const name = kind === "company" ? cleanField(raw.name, 80).replace(/[^\p{L}\p{M}\p{N}\s.&'+-]/gu, "").trim() : cleanName(raw.name);
  const citations = [
    ...(Array.isArray(payload.citations) ? payload.citations : []),
    ...(Array.isArray(payload.search_results) ? payload.search_results.map((r) => r.url) : []),
  ].filter((c): c is string => typeof c === "string" && /^https:\/\//.test(c));
  const handle = profile.handle.toLowerCase();
  return {
    ...(kind === "company" ? { kind } : {}),
    profileUrl: profile.url,
    network: profile.networkLabel,
    found: raw.found === true && name.length > 0,
    name,
    role: cleanField(raw.role, 100),
    company: cleanField(raw.company, 100),
    field: cleanField(raw.field, 100),
    location: cleanField(raw.location, 80),
    source: citations.find((c) => c.toLowerCase().includes(handle)) ?? citations[0] ?? null,
  };
}

async function identify(profile: PreviewTarget, apiKey: string, kind: ScanKind): Promise<Omit<Preview, "id" | "createdAt"> | null> {
  const result = await postJson(
    "https://api.perplexity.ai/v1/sonar",
    { Authorization: `Bearer ${apiKey}` },
    {
      model: PREVIEW_MODEL,
      max_tokens: 400,
      web_search_options: { search_context_size: "low" },
      response_format: { type: "json_schema", json_schema: { name: "profile_owner", schema: SCHEMA } },
      messages: [
        { role: "system", content: kind === "company" ? COMPANY_INSTRUCTIONS : INSTRUCTIONS },
        {
          role: "user",
          content: kind === "company" ? `Who runs the website ${profile.handle} (${profile.url})?` : `Whose ${profile.networkLabel} profile is ${profile.url} ?`,
        },
      ],
    },
    TIMEOUT_MS
  );
  if (!result.ok) {
    console.error(`[pscan/preview] sonar failed: ${result.error}`);
    return null;
  }
  return parseIdentity(result.json, profile, kind);
}

export async function loadPreview(kv: DurableKv, id: string): Promise<Preview | null> {
  if (!/^[a-z0-9]{16,40}$/.test(id)) return null;
  const raw = await kv.get(previewKey(id));
  return raw ? (JSON.parse(raw) as Preview) : null;
}

export async function runPreview(
  kv: DurableKv,
  profile: PreviewTarget,
  ip: string,
  apiKey: string | undefined,
  now: Date = new Date(),
  kind: ScanKind = "person",
  /** The owner testing: the per-address limit is skipped, the daily total still counts. */
  owner = false
): Promise<PreviewResult> {
  try {
    const cached = await kv.get(cacheKey(profile.url));
    if (cached) {
      const preview = await loadPreview(kv, cached);
      if (preview) return { ok: true, preview };
    }
    if (!apiKey) return { ok: false, reason: "unavailable" };
    const day = now.toISOString().slice(0, 10);
    const perIp = await kv.incr(`pscan:preview-ip:${day}:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}`, 2 * 86400);
    const total = await kv.incr(`pscan:preview-day:${day}`, 2 * 86400);
    if ((!owner && perIp > PREVIEWS_PER_IP_PER_DAY) || total > PREVIEWS_PER_DAY) return { ok: false, reason: "rate_limited" };

    const identity = await identify(profile, apiKey, kind);
    if (!identity) return { ok: false, reason: "failed" };
    const preview: Preview = { ...identity, id: randomBytes(12).toString("hex"), createdAt: now.toISOString() };
    await kv.set(previewKey(preview.id), JSON.stringify(preview), PREVIEW_TTL_SECONDS);
    // Only a found person is cached: a miss today may be a hit next week.
    if (preview.found) await kv.set(cacheKey(profile.url), preview.id, PREVIEW_TTL_SECONDS);
    return { ok: true, preview };
  } catch (error) {
    console.error("[pscan/preview] storage unavailable", error);
    return { ok: false, reason: "unavailable" };
  }
}
