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
import type { SocialProfile } from "./social-profile";

export const PREVIEW_MODEL = "sonar";
export const PREVIEW_TTL_SECONDS = 7 * 24 * 3600;
export const PREVIEWS_PER_IP_PER_DAY = 3;
export const PREVIEWS_PER_DAY = 150;
const TIMEOUT_MS = 60_000;

export interface Preview {
  readonly id: string;
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

export function parseIdentity(json: unknown, profile: SocialProfile): Omit<Preview, "id" | "createdAt"> {
  const payload = (json ?? {}) as SonarPayload;
  let raw: Record<string, unknown> = {};
  try {
    raw = JSON.parse(payload.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
  } catch {
    raw = {};
  }
  const name = cleanName(raw.name);
  const citations = [
    ...(Array.isArray(payload.citations) ? payload.citations : []),
    ...(Array.isArray(payload.search_results) ? payload.search_results.map((r) => r.url) : []),
  ].filter((c): c is string => typeof c === "string" && /^https:\/\//.test(c));
  const handle = profile.handle.toLowerCase();
  return {
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

async function identify(profile: SocialProfile, apiKey: string): Promise<Omit<Preview, "id" | "createdAt"> | null> {
  const result = await postJson(
    "https://api.perplexity.ai/v1/sonar",
    { Authorization: `Bearer ${apiKey}` },
    {
      model: PREVIEW_MODEL,
      max_tokens: 400,
      web_search_options: { search_context_size: "low" },
      response_format: { type: "json_schema", json_schema: { name: "profile_owner", schema: SCHEMA } },
      messages: [
        { role: "system", content: INSTRUCTIONS },
        { role: "user", content: `Whose ${profile.networkLabel} profile is ${profile.url} ?` },
      ],
    },
    TIMEOUT_MS
  );
  if (!result.ok) {
    console.error(`[pscan/preview] sonar failed: ${result.error}`);
    return null;
  }
  return parseIdentity(result.json, profile);
}

export async function loadPreview(kv: DurableKv, id: string): Promise<Preview | null> {
  if (!/^[a-z0-9]{16,40}$/.test(id)) return null;
  const raw = await kv.get(previewKey(id));
  return raw ? (JSON.parse(raw) as Preview) : null;
}

export async function runPreview(
  kv: DurableKv,
  profile: SocialProfile,
  ip: string,
  apiKey: string | undefined,
  now: Date = new Date()
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
    if (perIp > PREVIEWS_PER_IP_PER_DAY || total > PREVIEWS_PER_DAY) return { ok: false, reason: "rate_limited" };

    const identity = await identify(profile, apiKey);
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
