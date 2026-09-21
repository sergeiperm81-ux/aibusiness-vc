/**
 * The owner's view of an order: recorded state, answers and spend.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { memoryKv } from "../../src/lib/audit/durable-kv";
import { answerKey, createOrder, spendKey } from "../../src/lib/audit/professional-order";
import { orderStatus } from "../../src/lib/audit/professional-status";

const SUBJECT = { name: "Jane Doe", role: "Analyst", company: "Doe Ltd", profileUrl: "https://www.linkedin.com/in/jane-doe" };

test("the status shows which model answered which question, and the recorded spend, with no email", async () => {
  const kv = memoryKv();
  await createOrder(
    kv,
    { orderId: "9", variantId: "7", email: "jane@example.com", previewId: "p", subject: SUBJECT, fullPrice: false },
    new Date("2026-09-21T10:00:00Z")
  );
  await kv.set(answerKey("9:7", "who", "openai"), JSON.stringify({ ok: true, text: "secret words" }), 60);
  await kv.set(answerKey("9:7", "who", "anthropic"), JSON.stringify({ ok: false }), 60);
  await kv.incrby(spendKey("9:7"), 412_345, 60);

  const status = await orderStatus(kv, "9:7", ["openai", "anthropic"]);
  assert.ok(status);
  assert.equal(status.state, "queued");
  assert.equal(status.answers.who.openai, "answered");
  assert.equal(status.answers.who.anthropic, "failed");
  assert.equal(status.answers.does.openai, "not asked");
  assert.equal(status.answered, 1);
  assert.equal(status.expected, 6);
  assert.equal(status.spendUsd, 0.412345);
  assert.equal(status.bonusCodeIssued, false);
  assert.doesNotMatch(JSON.stringify(status), /jane@example\.com|secret words/);
  assert.equal(await orderStatus(kv, "1:1", ["openai"]), null);
});
