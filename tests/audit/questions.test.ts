/**
 * The wording of the six questions. No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildQuestions } from "../../src/lib/audit/answer-check";

const subject = {
  domain: "super.tennis",
  brand: "SUPER.TENNIS",
  product: "the SUPER.TENNIS online platform",
  category: "tennis news, player profiles, rankings and records",
};

function question(id: string, extra: Record<string, string> = {}): string {
  const found = buildQuestions({ ...subject, ...extra }).find((q) => q.id === id);
  assert.ok(found, `no question ${id}`);
  return found.question;
}

test("the blind question asks for websites when told to, and never names the client", () => {
  const blind = question("recommendation", { recommendAs: "websites" });
  assert.equal(blind, "Which websites would you recommend for tennis news, player profiles, rankings and records?");
  assert.doesNotMatch(blind, /super\.?tennis/i);
});

test("the blind question still defaults to companies", () => {
  assert.match(question("recommendation"), /^Which companies would you recommend for /);
});

test("the price question does not presuppose that the product is paid for", () => {
  const price = question("price");
  assert.match(price, /free, subscription-based, or paid for in another way/);
  assert.doesNotMatch(price, /\bpriced\b/);
});

test("there are six questions and exactly one blind one", () => {
  const questions = buildQuestions(subject);
  assert.equal(questions.length, 6);
  assert.equal(questions.filter((q) => q.blind).length, 1);
});
