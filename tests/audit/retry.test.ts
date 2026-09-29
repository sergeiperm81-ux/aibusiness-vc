/**
 * Which failures are retried. Agreed rule: a timeout, 408, 429 or 5xx, and
 * nothing else. An empty or malformed answer is a result, not a failure to
 * retry.
 *
 * No network, no keys. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { worthRetrying } from "../../src/lib/audit/answer-providers";

const cases: ReadonlyArray<readonly [string, boolean]> = [
  ["HTTP 408: request timeout", true],
  ["HTTP 429: rate limited", true],
  ["HTTP 500: internal error", true],
  ["HTTP 503: overloaded", true],
  ["timeout after 90000 ms", true],
  ["This operation was aborted", true],
  ["HTTP 400: bad request", false],
  ["HTTP 401: invalid api key", false],
  ["HTTP 404: not found", false],
  ["no text in response", false],
  ["fetch failed", false],
];

for (const [error, expected] of cases) {
  test(`${expected ? "retries" : "does not retry"}: ${error}`, () => {
    assert.equal(worthRetrying(error), expected);
  });
}
