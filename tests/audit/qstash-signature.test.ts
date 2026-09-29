/**
 * The QStash signature check on the worker route.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { qstashSignatureValid } from "../../src/lib/audit/qstash-signature";

const KEY = "sig_test_current_key_0123456789";
const URL = "https://aibusiness.vc/api/cron/professional-scan";
const b64 = (b: Buffer) => b.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

function sign(claims: Record<string, unknown>, key = KEY): string {
  const header = b64(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = b64(Buffer.from(JSON.stringify(claims)));
  return `${header}.${payload}.${b64(createHmac("sha256", key).update(`${header}.${payload}`).digest())}`;
}

const NOW = 1_790_000_000;
const good = { iss: "Upstash", sub: URL, exp: NOW + 300, nbf: NOW - 5, body: b64(createHash("sha256").update("").digest()) };

test("a QStash call signed with the current or next key is accepted", () => {
  assert.equal(qstashSignatureValid({ token: sign(good), keys: [KEY], url: URL, body: "", nowSeconds: NOW }), true);
  assert.equal(qstashSignatureValid({ token: sign(good), keys: ["other_key_that_is_long_enough", KEY], url: URL, body: "", nowSeconds: NOW }), true);
});

test("a forged, expired, misdirected or altered call is refused", () => {
  assert.equal(qstashSignatureValid({ token: sign(good, "wrong_key_that_is_long_enough"), keys: [KEY], url: URL, body: "", nowSeconds: NOW }), false);
  assert.equal(qstashSignatureValid({ token: sign({ ...good, exp: NOW - 120 }), keys: [KEY], url: URL, body: "", nowSeconds: NOW }), false);
  assert.equal(qstashSignatureValid({ token: sign({ ...good, sub: "https://aibusiness.vc/api/other" }), keys: [KEY], url: URL, body: "", nowSeconds: NOW }), false);
  assert.equal(qstashSignatureValid({ token: sign(good), keys: [KEY], url: URL, body: "changed", nowSeconds: NOW }), false);
  assert.equal(qstashSignatureValid({ token: sign({ ...good, iss: "Someone" }), keys: [KEY], url: URL, body: "", nowSeconds: NOW }), false);
  assert.equal(qstashSignatureValid({ token: null, keys: [KEY], url: URL, body: "" }), false);
  assert.equal(qstashSignatureValid({ token: sign(good), keys: [undefined, ""], url: URL, body: "", nowSeconds: NOW }), false);
});
