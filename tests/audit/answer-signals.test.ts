/**
 * Non-answers and lookalike entities, detected without a model.
 *
 * The positive cases are the real answers from the first paid test on
 * super.tennis, 12 September 2026, quoted in full up to the part that matters.
 * No network, no keys. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  detectEntityMismatch,
  detectNonAnswer,
  isLookalikeDomain,
} from "../../src/lib/audit/answer-signals";

const SUBJECT = { brand: "SUPER.TENNIS", domain: "super.tennis" };

const ANTHROPIC_WHO =
  "I'll search for information about SUPER.TENNIS for you.The search results returned information about classic video games and other tennis-related companies, but not about SUPER.TENNIS (super.tennis) specifically. Could you provide more context about what SUPER.TENNIS is?";

const ANTHROPIC_PRODUCT =
  "I'll search for information about SUPER.TENNIS tennis magazine.I wasn't able to find specific information about a tennis magazine called \"SUPER.TENNIS\" from super.tennis in my search results. Could you provide more details about SUPER.TENNIS?";

const ANTHROPIC_PRICE =
  "I'll search for information about SUPER.TENNIS magazine pricing.I wasn't able to find specific information about \"SUPER.TENNIS\" magazine from super.tennis in my search results. The search results returned information about \"Tennis Magazine,\" which is a different publication published by Miller Publishing Group.\n\nCould you provide more details about SUPER.TENNIS?";

const REAL_ANSWER =
  "SUPER.TENNIS is an online tennis platform covering news, player profiles, rankings, records, gear and lifestyle. It is free to read and supported by advertising.";

const MISSING_DETAIL =
  "SUPER.TENNIS is a tennis news site covering the ATP and WTA tours, with player profiles and records. It appears to be free to read. I could not find a published subscription price, which suggests there is none.";

const GENERIC_OFFER =
  "SUPER.TENNIS is an online tennis platform with news and player profiles. If you are comparing tennis sites for a specific purpose, could you provide more details about what you need?";

for (const [label, text] of [
  ["who runs it", ANTHROPIC_WHO],
  ["what the product does", ANTHROPIC_PRODUCT],
  ["how it is paid for", ANTHROPIC_PRICE],
] as const) {
  test(`recognises the real Anthropic non-answer to "${label}"`, () => {
    const signal = detectNonAnswer(text, SUBJECT);
    assert.equal(signal.notFound, true);
    assert.ok(signal.signals.length > 0);
  });
}

test("does not flag a real answer", () => {
  assert.equal(detectNonAnswer(REAL_ANSWER, SUBJECT).notFound, false);
});

test("does not flag a real answer that says one detail could not be found", () => {
  assert.equal(detectNonAnswer(MISSING_DETAIL, SUBJECT).notFound, false);
});

test("does not flag a generic offer to help further after a real answer", () => {
  assert.equal(detectNonAnswer(GENERIC_OFFER, SUBJECT).notFound, false);
});

test("supertennis.tv is a lookalike of super.tennis", () => {
  assert.equal(isLookalikeDomain("super.tennis", "supertennis.tv"), true);
});

test("aibusiness.com is a lookalike of aibusiness.vc", () => {
  assert.equal(isLookalikeDomain("aibusiness.vc", "aibusiness.com"), true);
});

test("the client's own domain, with or without www, is not a lookalike", () => {
  assert.equal(isLookalikeDomain("super.tennis", "super.tennis"), false);
  assert.equal(isLookalikeDomain("super.tennis", "www.super.tennis"), false);
});

test("an unrelated source is not a lookalike", () => {
  assert.equal(isLookalikeDomain("super.tennis", "en.wikipedia.org"), false);
  assert.equal(isLookalikeDomain("super.tennis", "sega.fandom.com"), false);
});

test("the real OpenAI contact answer is caught as another entity", () => {
  const text =
    "Email for general inquiries is redazione@supertennis.tv and for production-related matters produzione@supertennis.tv. Phone number for contact is +39 06 58560 616/7.";
  const signal = detectEntityMismatch("super.tennis", text, ["https://www.supertennis.tv/contatti"]);
  assert.equal(signal.ownDomainPresent, false);
  assert.deepEqual(signal.lookalikeDomains, ["supertennis.tv"]);
  assert.deepEqual(signal.foreignEmailDomains, ["supertennis.tv"]);
});

test("an answer that only cites the client's own site raises nothing", () => {
  const signal = detectEntityMismatch("super.tennis", REAL_ANSWER, ["https://super.tennis/about/"]);
  assert.equal(signal.ownDomainPresent, true);
  assert.deepEqual(signal.lookalikeDomains, []);
  assert.deepEqual(signal.foreignEmailDomains, []);
});
