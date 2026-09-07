/**
 * Signed, expiring sessions for the password-protected admin pages.
 *
 * The previous cookies were the credential itself: the stats page stored
 * `STATS_PASSWORD` verbatim for thirty days, and the leads dashboard stored a
 * plain hash of username and password. Either cookie, once seen, was a
 * permanent key — it could not be expired without changing the password, and
 * anything that logged a request header logged the secret.
 *
 * A token here is a signed statement with an expiry. Forging one requires the
 * password; stealing one buys access only until it lapses.
 */

import crypto from "node:crypto";
import { deleteKey, incrWithTtl, readCount } from "@/lib/redis";

const TOKEN_VERSION = "v1";

export interface SessionPayload {
  /** Which area the token is good for; a stats token must not open leads. */
  readonly scope: string;
  /** Expiry, epoch milliseconds. */
  readonly exp: number;
}

function signingKey(scope: string, secret: string): Buffer {
  return crypto.createHash("sha256").update(`aibusiness-admin-session:${scope}:${secret}`).digest();
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded + "=".repeat((4 - (padded.length % 4)) % 4), "base64");
}

function timingSafeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(scope: string, secret: string, ttlSeconds: number): string {
  const payload: SessionPayload = { scope, exp: Date.now() + ttlSeconds * 1000 };
  const body = base64url(JSON.stringify(payload));
  const signature = base64url(
    crypto.createHmac("sha256", signingKey(scope, secret)).update(`${TOKEN_VERSION}.${body}`).digest()
  );
  return `${TOKEN_VERSION}.${body}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined,
  scope: string,
  secret: string | undefined
): boolean {
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, body, signature] = parts;
  if (version !== TOKEN_VERSION) return false;

  const expected = base64url(
    crypto.createHmac("sha256", signingKey(scope, secret)).update(`${version}.${body}`).digest()
  );
  if (!timingSafeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(fromBase64url(body).toString("utf8")) as SessionPayload;
    if (payload.scope !== scope) return false;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Constant-time password comparison, so a wrong guess reveals nothing by timing. */
export function passwordMatches(supplied: string, expected: string | undefined): boolean {
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(supplied).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * Throttles password guessing.
 *
 * Failure counts are shared across instances via Redis, so a brute force
 * cannot dodge the lockout by landing on fresh serverless instances. When
 * Redis is unreachable the per-instance map below still applies, which turns
 * an online brute force from minutes into something no attacker will sit
 * through, even in the degraded case.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 15 * 60 * 1000;
const LOCKOUT_SECONDS = LOCKOUT_MS / 1000;

function failureKey(key: string): string {
  return `admin:fail:${key}`;
}

export async function isLockedOut(key: string): Promise<boolean> {
  const shared = await readCount(failureKey(key));
  if (shared !== null && shared >= MAX_ATTEMPTS) return true;

  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.until < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(key: string): Promise<void> {
  await incrWithTtl(failureKey(key), LOCKOUT_SECONDS);

  const entry = attempts.get(key);
  const now = Date.now();
  if (!entry || entry.until < now) {
    attempts.set(key, { count: 1, until: now + LOCKOUT_MS });
    return;
  }
  attempts.set(key, { count: entry.count + 1, until: entry.until });
}

export async function clearAttempts(key: string): Promise<void> {
  await deleteKey(failureKey(key));
  attempts.delete(key);
}
