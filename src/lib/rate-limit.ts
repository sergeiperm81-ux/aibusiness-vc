/**
 * Request throttling for the public endpoints that cost money to run.
 *
 * `/api/leads`, `/api/library` and `/api/assurance` all send mail through
 * Brevo. Unthrottled, each is a free relay for a stranger: a loop of requests
 * can flood a mailbox, stuff the contact list with addresses that never opted
 * in, and burn an API budget.
 *
 * Counters are shared across instances via Redis (fixed one-window buckets).
 * When Redis is not configured or not reachable the check falls back to the
 * old per-instance memory window, which bounds casual abuse but not a
 * distributed attack — the hard ceilings still belong upstream, in the Brevo
 * and OpenAI account limits.
 */

import { incrWithTtl } from "@/lib/redis";

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

/** Stops the map growing without bound on a long-lived instance. */
const MAX_TRACKED_KEYS = 5000;

function prune(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  readonly allowed: boolean;
  /** Seconds until the window resets. Suitable for a Retry-After header. */
  readonly retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Distinct name per endpoint, so limits do not bleed into each other. */
  readonly scope: string;
  /** Usually the client IP. */
  readonly key: string;
  readonly limit: number;
  readonly windowSeconds: number;
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();

  // Fixed window: the window number is part of the key, so INCR is atomic per
  // window and the reset moment is computable without a round trip for TTL.
  const windowMs = options.windowSeconds * 1000;
  const windowIndex = Math.floor(now / windowMs);
  const redisKey = `rl:${options.scope}:${options.key}:${windowIndex}`;

  const count = await incrWithTtl(redisKey, options.windowSeconds + 5);
  if (count !== null) {
    if (count > options.limit) {
      const resetAt = (windowIndex + 1) * windowMs;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return checkRateLimitInMemory(options, now);
}

/** The old per-instance window, kept as the fallback when Redis is unreachable. */
function checkRateLimitInMemory(options: RateLimitOptions, now: number): RateLimitResult {
  prune(now);

  const bucketKey = `${options.scope}:${options.key}`;
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + options.windowSeconds * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client address from the proxy headers Vercel sets. */
export function clientIpFrom(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
