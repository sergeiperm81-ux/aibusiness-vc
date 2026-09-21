/**
 * Checks that a request really comes from Upstash QStash, the scheduler that
 * wakes the order worker every five minutes.
 *
 * QStash signs every call with a short JWT (HS256) in the Upstash-Signature
 * header, keyed with the current signing key, or the next one while keys
 * rotate. The token names the address it was sent to and carries a hash of
 * the body, so a signature cannot be replayed on another route or with
 * another body. Nothing here is secret beyond the two keys, which live in the
 * environment only.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function decodeJson(part: string): Record<string, unknown> | null {
  try {
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function signedWith(token: string, key: string): boolean {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return false;
  const expected = base64url(createHmac("sha256", key).update(`${header}.${payload}`).digest());
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function qstashSignatureValid(args: {
  readonly token: string | null;
  readonly keys: readonly (string | undefined)[];
  readonly url: string;
  readonly body: string;
  readonly nowSeconds?: number;
}): boolean {
  const keys = args.keys.map((k) => k?.trim() ?? "").filter((k) => k.length >= 16);
  if (!args.token || keys.length === 0) return false;
  const header = decodeJson(args.token.split(".")[0] ?? "");
  if (header?.alg !== "HS256") return false;
  if (!keys.some((key) => signedWith(args.token as string, key))) return false;

  const claims = decodeJson(args.token.split(".")[1] ?? "");
  if (!claims) return false;
  const now = args.nowSeconds ?? Math.floor(Date.now() / 1000);
  // A minute of leeway for clock drift between QStash and the function.
  if (typeof claims.exp !== "number" || claims.exp + 60 < now) return false;
  if (typeof claims.nbf === "number" && claims.nbf - 60 > now) return false;
  if (claims.iss !== "Upstash") return false;
  if (typeof claims.sub !== "string" || claims.sub.replace(/\/$/, "") !== args.url.replace(/\/$/, "")) return false;
  const bodyHash = base64url(createHash("sha256").update(args.body).digest());
  const claimed = typeof claims.body === "string" ? claims.body.replace(/=+$/, "") : "";
  return claimed === bodyHash;
}
