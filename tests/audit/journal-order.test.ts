/**
 * The journal records an attempt before its request leaves, and ties the two
 * lines together with the id sent to the provider.
 *
 * fetch is replaced with a stub, so nothing reaches the network and no key is
 * used. Run with: npm run test:audit
 */

import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { openAiProvider, anthropicProvider } from "../../src/lib/audit/answer-providers";
import type { JournalEvent } from "../../src/lib/audit/usage";

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

/** A fetch that records when it was called and what headers it got, then fails like a dropped connection. */
function stubFetch(order: string[], seenHeaders: Record<string, string>[]): void {
  globalThis.fetch = (async (_url: unknown, init?: { headers?: Record<string, string> }) => {
    order.push("fetch");
    seenHeaders.push({ ...(init?.headers ?? {}) });
    throw new TypeError("fetch failed");
  }) as typeof fetch;
}

test("OpenAI: the started line is written before the request is sent", async () => {
  const order: string[] = [];
  const headers: Record<string, string>[] = [];
  const events: JournalEvent[] = [];
  stubFetch(order, headers);

  const provider = openAiProvider("test-key-not-real", "gpt-4.1-mini", (event) => {
    order.push(event.event);
    events.push(event);
  });
  const answer = await provider.ask("What does Example do?", "what");

  assert.equal(answer.ok, false);
  // "fetch failed" is not retried, so exactly one attempt.
  assert.deepEqual(order, ["started", "fetch", "finished"]);
});

test("OpenAI: our client request id is sent in the header and matches both journal lines", async () => {
  const order: string[] = [];
  const headers: Record<string, string>[] = [];
  const events: JournalEvent[] = [];
  stubFetch(order, headers);

  const provider = openAiProvider("test-key-not-real", "gpt-4.1-mini", (event) => events.push(event));
  await provider.ask("What does Example do?", "what");

  const started = events.find((e) => e.event === "started");
  const finished = events.find((e) => e.event === "finished");
  assert.ok(started && started.event === "started");
  assert.ok(finished && finished.event === "finished");
  assert.ok(started.clientRequestId.length > 0);
  assert.equal(headers[0]["X-Client-Request-Id"], started.clientRequestId);
  assert.equal(finished.usage.clientRequestId, started.clientRequestId);
});

test("OpenAI: a dropped connection is journalled as unknown, not free", async () => {
  const events: JournalEvent[] = [];
  stubFetch([], []);

  const provider = openAiProvider("test-key-not-real", "gpt-4.1-mini", (event) => events.push(event));
  await provider.ask("What does Example do?", "what");

  const finished = events.find((e) => e.event === "finished");
  assert.ok(finished && finished.event === "finished");
  assert.equal(finished.usage.outcome, "network_error");
  assert.equal(finished.usage.tokenMeasurement, "unknown");
  assert.ok(finished.usage.conservativeEstimateUsd > 0);
});

test("Anthropic: the started line is also written before the request is sent", async () => {
  const order: string[] = [];
  stubFetch(order, []);

  const provider = anthropicProvider("test-key-not-real", "claude-haiku-4-5-20251001", (event) => {
    order.push(event.event);
  });
  await provider.ask("What does Example do?", "what");

  assert.deepEqual(order, ["started", "fetch", "finished"]);
});
