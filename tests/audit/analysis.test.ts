/**
 * The judge's verdicts after they pass through our own rules.
 *
 * fetch is replaced with a stub that returns a crafted judge reply, so nothing
 * reaches the network and no key is used. Run with: npm run test:audit
 */

import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { analyseQuestion } from "../../src/lib/audit/answer-analysis";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubJudge(verdicts: unknown): void {
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        id: "chatcmpl-test",
        choices: [{ message: { content: JSON.stringify(verdicts) } }],
        usage: { prompt_tokens: 100, completion_tokens: 50 },
      }),
      { status: 200, headers: { "x-request-id": "req_test" } }
    )) as typeof fetch;
}

async function judge() {
  return analyseQuestion({
    factId: "contact",
    question: "How does a customer contact SUPER.TENNIS (super.tennis)?",
    answers: [
      { providerId: "openai", text: "Email redazione@supertennis.tv or call +39 06 58560 616." },
      { providerId: "anthropic", text: "Super Tennis is a 1991 video game for the Super NES." },
    ],
    reference: "--- https://super.tennis/contact/ ---\nSend us a message using the form.",
    apiKey: "test-key-not-real",
  });
}

test("a contradiction the judge cannot quote from the site becomes unverified", async () => {
  stubJudge({
    answers: [
      {
        providerId: "openai",
        sameEntity: true,
        otherEntity: null,
        claims: [
          { claim: "Phone number is +39 06 58560 616.", status: "contradicted", siteSays: null, severity: "high" },
        ],
      },
      { providerId: "anthropic", sameEntity: true, otherEntity: null, claims: [] },
    ],
  });
  const { analyses } = await judge();
  const openai = analyses.find((a) => a.providerId === "openai");
  assert.ok(openai?.ok);
  assert.equal(openai.claims[0].status, "unverified");
  assert.ok(openai.claims[0].ownerCheck);
  assert.equal(openai.claims[0].replacement, null);
});

test("a quoted contradiction stays a contradiction", async () => {
  stubJudge({
    answers: [
      {
        providerId: "openai",
        sameEntity: true,
        otherEntity: null,
        claims: [
          {
            claim: "Customers contact it by phone only.",
            status: "contradicted",
            siteSays: "Send us a message using the form.",
            siteSaysOn: "https://super.tennis/contact/",
            severity: "high",
            replacement: "Send us a message using the form on the contact page.",
          },
        ],
      },
      { providerId: "anthropic", sameEntity: true, otherEntity: null, claims: [] },
    ],
  });
  const { analyses } = await judge();
  const openai = analyses.find((a) => a.providerId === "openai");
  assert.equal(openai?.claims[0].status, "contradicted");
});

test("an answer about another entity keeps no claims, whatever the judge returned", async () => {
  stubJudge({
    answers: [
      { providerId: "openai", sameEntity: true, otherEntity: null, claims: [] },
      {
        providerId: "anthropic",
        sameEntity: false,
        otherEntity: "Super Tennis, the 1991 Super NES video game",
        claims: [{ claim: "It is a video game.", status: "contradicted", siteSays: "a tennis platform", severity: "high" }],
      },
    ],
  });
  const { analyses } = await judge();
  const anthropic = analyses.find((a) => a.providerId === "anthropic");
  assert.ok(anthropic?.ok);
  assert.equal(anthropic.sameEntity, false);
  assert.equal(anthropic.otherEntity, "Super Tennis, the 1991 Super NES video game");
  assert.deepEqual(anthropic.claims, []);
});

test("an empty answer is never sent to the judge", async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    throw new Error("should not be called");
  }) as typeof fetch;
  const { analyses, usage } = await analyseQuestion({
    factId: "price",
    question: "Is it free?",
    answers: [{ providerId: "anthropic", text: "" }],
    reference: "--- https://super.tennis/ ---\nTennis for everyone.",
    apiKey: "test-key-not-real",
  });
  assert.equal(called, false);
  assert.equal(usage, null);
  assert.equal(analyses[0].ok, false);
});
