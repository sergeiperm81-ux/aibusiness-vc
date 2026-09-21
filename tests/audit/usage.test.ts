/**
 * The usage journal's arithmetic and bookkeeping.
 *
 * No network, no keys. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  failureMeasurement,
  makeUsage,
  planCost,
  summariseUsage,
  usageFromJournal,
  type JournalEvent,
  type UsageFacts,
} from "../../src/lib/audit/usage";

function near(actual: number, expected: number): void {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${expected}, got ${actual}`);
}

// Prices per the providers' pages: gpt-4.1-mini $0.40 in / $1.60 out, Haiku 4.5
// $1 in / $5 out, $10 per 1,000 searches, OpenAI search content 8,000 tokens.
const OPENAI_1M_IN_1M_OUT = 0.4 + 1.6;
const HAIKU_1M_IN_1M_OUT = 1 + 5;
const ONE_SEARCH = 0.01;
const OPENAI_SEARCH_BLOCK = (8000 * 0.4) / 1e6;

const bounds = { maxInputTokens: 1e6, maxOutputTokens: 1e6, maxWebSearches: 1 };

const base: UsageFacts = {
  clientRequestId: "c-1",
  provider: "openai",
  model: "gpt-4.1-mini",
  purpose: "answer",
  factId: "what",
  attemptNumber: 1,
  startedAt: "2026-09-12T00:00:00.000Z",
  durationMs: 1000,
  providerRequestId: "req_1",
  httpStatus: 200,
  outcome: "ok",
  tokenMeasurement: "reported",
  searchMeasurement: "inferred",
  inputTokens: 1e6,
  outputTokens: 1e6,
  webSearches: 1,
  bounds,
};

test("reported OpenAI row: the provider-reported sum leaves out the search content block", () => {
  near(makeUsage(base).providerReportedEstimateUsd, OPENAI_1M_IN_1M_OUT + ONE_SEARCH);
});

test("reported OpenAI row: the conservative sum adds the search content block", () => {
  near(makeUsage(base).conservativeEstimateUsd, OPENAI_1M_IN_1M_OUT + OPENAI_SEARCH_BLOCK + ONE_SEARCH);
});

test("reported Haiku row: both sums agree, because Anthropic has no fixed block", () => {
  const row = makeUsage({ ...base, provider: "anthropic", model: "claude-haiku-4-5-20251001", searchMeasurement: "reported" });
  near(row.providerReportedEstimateUsd, HAIKU_1M_IN_1M_OUT + ONE_SEARCH);
  near(row.conservativeEstimateUsd, HAIKU_1M_IN_1M_OUT + ONE_SEARCH);
});

test("every failure is measured as unknown, never as free", () => {
  const measured = failureMeasurement();
  assert.equal(measured.tokenMeasurement, "unknown");
  assert.equal(measured.searchMeasurement, "assumed");
});

for (const [label, outcome, httpStatus] of [
  ["HTTP 500", "http_error", 500],
  ["HTTP 400", "http_error", 400],
  ["timeout", "timeout", null],
  ["network failure", "network_error", null],
] as const) {
  test(`${label}: priced at zero by the provider-reported sum and at its bounds by the conservative one`, () => {
    const row = makeUsage({ ...base, outcome, httpStatus, providerRequestId: null, ...failureMeasurement() });
    near(row.providerReportedEstimateUsd, 0);
    near(row.conservativeEstimateUsd, OPENAI_1M_IN_1M_OUT + OPENAI_SEARCH_BLOCK + ONE_SEARCH);
  });
}

test("a model missing from the price table is flagged", () => {
  assert.equal(makeUsage({ ...base, model: "gpt-5.5" }).priced, false);
});

test("an attempt that started and never finished is counted as interrupted at its bounds", () => {
  const events: JournalEvent[] = [
    { event: "started", clientRequestId: "a", provider: "openai", model: "gpt-4.1-mini", purpose: "answer", factId: "what", attemptNumber: 1, startedAt: "t", bounds },
    { event: "finished", usage: makeUsage({ ...base, clientRequestId: "a" }) },
    { event: "started", clientRequestId: "b", provider: "openai", model: "gpt-4.1-mini", purpose: "answer", factId: "price", attemptNumber: 1, startedAt: "t", bounds },
  ];
  const rows = usageFromJournal(events);
  assert.equal(rows.length, 2);
  const orphan = rows.find((r) => r.clientRequestId === "b");
  assert.ok(orphan);
  assert.equal(orphan.outcome, "interrupted");
  assert.equal(orphan.tokenMeasurement, "unknown");
  near(orphan.conservativeEstimateUsd, OPENAI_1M_IN_1M_OUT + OPENAI_SEARCH_BLOCK + ONE_SEARCH);
});

test("a finished attempt is not double counted against its own started line", () => {
  const events: JournalEvent[] = [
    { event: "started", clientRequestId: "a", provider: "openai", model: "gpt-4.1-mini", purpose: "answer", factId: "what", attemptNumber: 1, startedAt: "t", bounds },
    { event: "finished", usage: makeUsage({ ...base, clientRequestId: "a" }) },
  ];
  assert.equal(usageFromJournal(events).length, 1);
});

test("the summary counts outcomes and measurements", () => {
  const summary = summariseUsage([
    makeUsage(base),
    makeUsage({ ...base, clientRequestId: "c-2", outcome: "timeout", httpStatus: null, ...failureMeasurement() }),
    makeUsage({ ...base, clientRequestId: "c-3", outcome: "http_error", httpStatus: 503, ...failureMeasurement() }),
  ]);
  assert.equal(summary.attempts, 3);
  assert.equal(summary.byTokenMeasurement.reported, 1);
  assert.equal(summary.byTokenMeasurement.unknown, 2);
  assert.equal(summary.byOutcome.timeout, 1);
  assert.equal(summary.byOutcome.http_error, 1);
});

test("the plan multiplies only the calls that may be retried", () => {
  const plan = planCost([
    { provider: "openai", model: "gpt-4.1-mini", purpose: "answer", label: "a", maxAttempts: 2, bounds },
    { provider: "openai", model: "gpt-4.1-mini", purpose: "judge", label: "j", maxAttempts: 1, bounds: { ...bounds, maxWebSearches: 0 } },
  ]);
  const answerCall = OPENAI_1M_IN_1M_OUT + OPENAI_SEARCH_BLOCK + ONE_SEARCH;
  assert.equal(plan.calls, 2);
  assert.equal(plan.maxAttempts, 3);
  assert.equal(plan.maxWebSearchesNoRetry, 1);
  assert.equal(plan.maxWebSearchesWithRetries, 2);
  near(plan.conservativeNoRetryUsd, answerCall + OPENAI_1M_IN_1M_OUT);
  near(plan.conservativeWithRetriesUsd, answerCall * 2 + OPENAI_1M_IN_1M_OUT);
});
