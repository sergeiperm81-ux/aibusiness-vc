/**
 * Minimal Upstash Redis client over its REST API.
 *
 * The four abuse counters (webhook idempotency, order usage, rate limits,
 * login lockout) used to live in process memory, which on serverless means per
 * instance and reset on every deploy — a retried payment webhook landing on a
 * fresh instance would send the buyer a second package. Redis makes the
 * counters shared and durable.
 *
 * Plain fetch, no SDK: this project takes no new dependencies, and the REST
 * protocol is a POST of ["SET", "key", "value"] with a bearer token.
 *
 * Every helper degrades gracefully: when the database is not configured or
 * not reachable the caller gets an explicit "unavailable" signal and falls
 * back to its old in-memory behaviour, so an outage never takes the site down.
 */

interface RedisConfig {
  readonly url: string;
  readonly token: string;
}

/** Accepts both Upstash's own names and the KV_* names Vercel Marketplace injects. */
function redisConfig(): RedisConfig | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim() || "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim() || "";
  if (!url || !token) return null;
  return { url, token };
}

export function isRedisConfigured(): boolean {
  return redisConfig() !== null;
}

type RedisOutcome = { readonly ok: true; readonly result: unknown } | { readonly ok: false };

/** Short deadline: a Redis outage must slow a request by 2 seconds, not hang it. */
const COMMAND_TIMEOUT_MS = 2000;

async function redisCommand(command: readonly (string | number)[]): Promise<RedisOutcome> {
  const config = redisConfig();
  if (!config) return { ok: false };

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(COMMAND_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[redis] ${command[0]} failed: HTTP ${response.status}`);
      return { ok: false };
    }
    const data = (await response.json()) as { result?: unknown; error?: string };
    if (data.error) {
      console.error(`[redis] ${command[0]} failed: ${data.error}`);
      return { ok: false };
    }
    return { ok: true, result: data.result };
  } catch (error) {
    console.error(`[redis] ${command[0]} failed:`, error);
    return { ok: false };
  }
}

export type ClaimResult = "claimed" | "duplicate" | "unavailable";

/**
 * Atomically claims a key exactly once (SET NX EX).
 *
 * "claimed" — first time seen, proceed. "duplicate" — someone already claimed
 * it, skip. "unavailable" — Redis cannot answer; the caller decides its own
 * fallback, because the right answer differs per use.
 */
export async function claimOnce(key: string, ttlSeconds: number): Promise<ClaimResult> {
  const outcome = await redisCommand(["SET", key, "1", "NX", "EX", ttlSeconds]);
  if (!outcome.ok) return "unavailable";
  return outcome.result === "OK" ? "claimed" : "duplicate";
}

/** Releases a claim so a failed operation can be retried (best effort). */
export async function releaseClaim(key: string): Promise<void> {
  await redisCommand(["DEL", key]);
}

/**
 * Converts a short-lived "processing" claim into a durable "done" record.
 *
 * The two-step pattern closes a crash window: claim briefly, do the work,
 * then persist. A function that dies mid-work leaves only the short claim,
 * which expires and lets the caller's retry succeed instead of being treated
 * as a duplicate forever.
 */
export async function persistClaim(key: string, ttlSeconds: number): Promise<void> {
  await redisCommand(["SET", key, "done", "EX", ttlSeconds]);
}

/**
 * Increments a counter, setting its lifetime on first use.
 *
 * Returns the new count, or null when Redis is unavailable. The TTL is only
 * applied when the increment created the key, so the window does not slide.
 */
export async function incrWithTtl(key: string, ttlSeconds: number): Promise<number | null> {
  const outcome = await redisCommand(["INCR", key]);
  if (!outcome.ok || typeof outcome.result !== "number") return null;
  if (outcome.result === 1) {
    await redisCommand(["EXPIRE", key, ttlSeconds]);
  }
  return outcome.result;
}

/** Reads a counter. Returns 0 for a missing key, null when Redis is unavailable. */
export async function readCount(key: string): Promise<number | null> {
  const outcome = await redisCommand(["GET", key]);
  if (!outcome.ok) return null;
  if (outcome.result == null) return 0;
  const value = Number(outcome.result);
  return Number.isFinite(value) ? value : null;
}

/**
 * Adds `by` to a permanent counter (no TTL): reader votes accumulate forever.
 * Returns the new total, or null when Redis is unavailable.
 */
export async function incrBy(key: string, by: number): Promise<number | null> {
  const outcome = await redisCommand(["INCRBY", key, by]);
  if (!outcome.ok || typeof outcome.result !== "number") return null;
  return outcome.result;
}

/** Deletes a key (best effort, used for clearing lockouts). */
export async function deleteKey(key: string): Promise<void> {
  await redisCommand(["DEL", key]);
}
