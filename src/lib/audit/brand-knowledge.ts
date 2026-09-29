/**
 * "What do the assistants actually know about this company?"
 *
 * Every other check in the audit inspects the site's plumbing. This one asks
 * the question the visitor came with, to both providers whose crawlers the
 * scan checks: OpenAI and Anthropic. The answers are shown verbatim and never
 * turned into a score: a model's recall varies between runs, so a number here
 * would imply a precision that does not exist.
 *
 * Each model is asked from memory, with no web search. That measures what an
 * assistant already knows — which is the thing a business can be missing from.
 */

import { incrWithTtl } from "@/lib/redis";

export type BrandProvider = "openai" | "anthropic";

const OPENAI_MODEL = "gpt-4.1-mini";
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PER_IP_PER_DAY = 3;
const GLOBAL_PER_DAY = 200;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_OUTPUT_TOKENS = 400;

export type BrandKnowledgeStatus =
  | "recognised"
  | "unrecognised"
  | "rate-limited"
  | "unavailable";

export interface BrandKnowledge {
  readonly provider: BrandProvider;
  /** Plain label for the reader: who was asked. */
  readonly providerLabel: string;
  readonly status: BrandKnowledgeStatus;
  /** The model's own words. Empty when status is not a real answer. */
  readonly answer: string;
  readonly model: string;
  readonly checkedAt: string;
  readonly cached: boolean;
}

interface CacheEntry {
  readonly data: BrandKnowledge;
  readonly expiresAt: number;
}

interface ProviderSpec {
  readonly id: BrandProvider;
  readonly label: string;
  readonly model: string;
  readonly envKey: string;
}

const PROVIDERS: readonly ProviderSpec[] = [
  { id: "openai", label: "OpenAI", model: OPENAI_MODEL, envKey: "OPENAI_API_KEY" },
  { id: "anthropic", label: "Anthropic", model: ANTHROPIC_MODEL, envKey: "ANTHROPIC_API_KEY" },
];

/**
 * Spend counters live in Redis (shared across instances, surviving deploys)
 * and fall back to process memory only when Redis cannot answer. One claim
 * covers one scan, i.e. one call to each provider. Neither stops a determined
 * attacker with a proxy pool — the only hard guarantee is the spend cap on
 * each provider account, which is where the real ceiling belongs.
 */
const COUNTER_TTL_SECONDS = 2 * 24 * 60 * 60;
const cache = new Map<string, CacheEntry>();
const ipCounter = new Map<string, { day: string; count: number }>();
let globalCounter = { day: "", count: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function overGlobalLimit(): boolean {
  const day = today();
  if (globalCounter.day !== day) globalCounter = { day, count: 0 };
  return globalCounter.count >= GLOBAL_PER_DAY;
}

function overIpLimit(ip: string): boolean {
  const day = today();
  const seen = ipCounter.get(ip);
  if (!seen || seen.day !== day) {
    ipCounter.set(ip, { day, count: 0 });
    return false;
  }
  return seen.count >= PER_IP_PER_DAY;
}

function recordCall(ip: string): void {
  const day = today();
  globalCounter = { day, count: globalCounter.count + 1 };
  const seen = ipCounter.get(ip);
  ipCounter.set(ip, { day, count: seen && seen.day === day ? seen.count + 1 : 1 });
}

/**
 * Claims one scan against today's global and per-IP budgets.
 *
 * Increments first, then compares: a request over the limit still bumps the
 * counter, which only makes the ceiling stricter, never looser. When Redis is
 * unavailable the in-memory counters take over for that instance.
 */
async function claimScan(ip: string): Promise<boolean> {
  const day = today();
  const global = await incrWithTtl(`audit:brand:global:${day}`, COUNTER_TTL_SECONDS);
  const perIp = await incrWithTtl(`audit:brand:ip:${day}:${ip}`, COUNTER_TTL_SECONDS);
  if (global === null || perIp === null) {
    if (overGlobalLimit() || overIpLimit(ip)) return false;
    recordCall(ip);
    return true;
  }
  return global <= GLOBAL_PER_DAY && perIp <= PER_IP_PER_DAY;
}

function prompt(domain: string): string {
  return (
    `What do you know about the company or organisation behind the website ${domain}? ` +
    `Describe what they do, who they serve, and anything notable about them. ` +
    `Answer only from what you already know — do not speculate from the domain name. ` +
    `If you do not recognise them, say so plainly. ` +
    `Reply with JSON only, no prose around it: {"recognised": boolean, "description": string}. ` +
    `Keep the description under 120 words and write it for the business owner to read.`
  );
}

function record(provider: ProviderSpec, status: BrandKnowledgeStatus, answer = ""): BrandKnowledge {
  return {
    provider: provider.id,
    providerLabel: provider.label,
    status,
    answer,
    model: provider.model,
    checkedAt: new Date().toISOString(),
    cached: false,
  };
}

/** Drops obvious cache-key abuse before it reaches the network. */
function normalizeDomain(input: string): string | null {
  const domain = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*/, "");
  if (!domain.includes(".") || domain.length > 253) return null;
  if (!/^[a-z0-9.-]+$/.test(domain)) return null;
  return domain;
}

/** Models sometimes wrap JSON in a code fence despite instructions. */
function parseAnswer(raw: string): { recognised: boolean; description: string } | null {
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(stripped) as { recognised?: boolean; description?: string };
    const recognised = parsed.recognised === true;
    const description = (parsed.description ?? "").trim();
    // A model that says "not recognised" with nothing else has still answered.
    if (!description && !recognised) {
      return { recognised: false, description: "The model says it does not recognise the company behind this domain." };
    }
    if (!description) return null;
    return { recognised, description };
  } catch (error) {
    console.error(`[brand-knowledge] unparseable answer: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function askOpenAI(apiKey: string, domain: string, signal: AbortSignal): Promise<string | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt(domain) }],
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: "json_object" },
    }),
    signal,
  });
  if (!response.ok) {
    console.error(`[brand-knowledge] OpenAI ${response.status}: ${(await response.text()).slice(0, 300)}`);
    return null;
  }
  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return payload.choices?.[0]?.message?.content ?? null;
}

async function askAnthropic(apiKey: string, domain: string, signal: AbortSignal): Promise<string | null> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: "user", content: prompt(domain) }],
    }),
    signal,
  });
  if (!response.ok) {
    console.error(`[brand-knowledge] Anthropic ${response.status}: ${(await response.text()).slice(0, 300)}`);
    return null;
  }
  const payload = (await response.json()) as { content?: { type?: string; text?: string }[] };
  return payload.content?.find((block) => block.type === "text")?.text ?? null;
}

async function askProvider(provider: ProviderSpec, domain: string): Promise<BrandKnowledge> {
  const cacheKey = `${provider.id}:${domain}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, cached: true };
  }

  const apiKey = process.env[provider.envKey];
  if (!apiKey) {
    console.error(`[brand-knowledge] ${provider.envKey} missing at runtime`);
    return record(provider, "unavailable");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const raw =
      provider.id === "openai"
        ? await askOpenAI(apiKey, domain, controller.signal)
        : await askAnthropic(apiKey, domain, controller.signal);
    const parsed = raw ? parseAnswer(raw) : null;
    if (!parsed) return record(provider, "unavailable");

    const data = record(provider, parsed.recognised ? "recognised" : "unrecognised", parsed.description);
    cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    return data;
  } catch (error) {
    // A missing answer must never take the rest of the audit down with it.
    console.error(
      `[brand-knowledge] ${provider.label} failed: ${error instanceof Error ? error.message : String(error)}`
    );
    return record(provider, "unavailable");
  } finally {
    clearTimeout(timer);
  }
}

function isCached(provider: ProviderSpec, domain: string): boolean {
  const hit = cache.get(`${provider.id}:${domain}`);
  return hit !== undefined && hit.expiresAt > Date.now();
}

/**
 * Asks both providers about the domain, in parallel. Always returns one entry
 * per provider, in the fixed order OpenAI then Anthropic, so callers can
 * render whatever came back without checking for gaps.
 */
export async function getBrandKnowledge(
  rawDomain: string,
  clientIp: string
): Promise<readonly BrandKnowledge[]> {
  const domain = normalizeDomain(rawDomain);
  if (!domain) return PROVIDERS.map((p) => record(p, "unavailable"));

  // Cached answers are free, so the budget applies only when a call would cost money.
  const allCached = PROVIDERS.every((p) => isCached(p, domain));
  if (!allCached && !(await claimScan(clientIp))) {
    return PROVIDERS.map((p) => record(p, "rate-limited"));
  }

  return Promise.all(PROVIDERS.map((p) => askProvider(p, domain)));
}

/** True when the entry carries a real answer worth showing. */
export function hasAnswer(entry: BrandKnowledge): boolean {
  return entry.status === "recognised" || entry.status === "unrecognised";
}
