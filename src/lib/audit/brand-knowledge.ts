/**
 * "What does ChatGPT actually know about this company?"
 *
 * Every other check in the audit inspects the site's plumbing. This one asks
 * the question the visitor came with. The answer is shown verbatim and never
 * turned into a score: a model's recall varies between runs, so a number here
 * would imply a precision that does not exist.
 *
 * The model is asked from memory, with no web search. That measures what an
 * assistant already knows — which is the thing a business can be missing from.
 */

const MODEL = "gpt-4.1-mini";
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

/**
 * Counters live in process memory, so they reset on deploy and are per
 * instance. They stop casual hammering, not a determined attacker with a proxy
 * pool — the only hard guarantee is a spend cap set on the OpenAI account
 * itself, which is where the real ceiling belongs.
 */
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

function prompt(domain: string): string {
  return (
    `What do you know about the company or organisation behind the website ${domain}? ` +
    `Describe what they do, who they serve, and anything notable about them. ` +
    `Answer only from what you already know — do not speculate from the domain name. ` +
    `If you do not recognise them, say so plainly. ` +
    `Reply as JSON: {"recognised": boolean, "description": string}. ` +
    `Keep the description under 120 words and write it for the business owner to read.`
  );
}

function unavailable(): BrandKnowledge {
  return {
    status: "unavailable",
    answer: "",
    model: MODEL,
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

export async function getBrandKnowledge(
  rawDomain: string,
  clientIp: string
): Promise<BrandKnowledge> {
  const domain = normalizeDomain(rawDomain);
  if (!domain) return unavailable();

  const cached = cache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, cached: true };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[brand-knowledge] OPENAI_API_KEY missing at runtime");
    return unavailable();
  }

  // Cached answers are free, so limits apply only to calls that cost money.
  if (overGlobalLimit() || overIpLimit(clientIp)) {
    return {
      status: "rate-limited",
      answer: "",
      model: MODEL,
      checkedAt: new Date().toISOString(),
      cached: false,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    recordCall(clientIp);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt(domain) }],
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `[brand-knowledge] OpenAI ${response.status}: ${(await response.text()).slice(0, 300)}`
      );
      return unavailable();
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) return unavailable();

    const parsed = JSON.parse(raw) as { recognised?: boolean; description?: string };
    const description = (parsed.description ?? "").trim();
    if (!description) return unavailable();

    const data: BrandKnowledge = {
      status: parsed.recognised === true ? "recognised" : "unrecognised",
      answer: description,
      model: MODEL,
      checkedAt: new Date().toISOString(),
      cached: false,
    };

    cache.set(domain, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    return data;
  } catch (error) {
    // A missing answer must never take the rest of the audit down with it.
    console.error(
      `[brand-knowledge] failed: ${error instanceof Error ? error.message : String(error)}`
    );
    return unavailable();
  } finally {
    clearTimeout(timer);
  }
}
