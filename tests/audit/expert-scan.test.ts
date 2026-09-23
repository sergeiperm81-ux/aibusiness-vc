/**
 * The five-provider person check: response shapes, bounds, prices, provider
 * selection and the social profile gate. No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  COMPANY_PROVIDER_IDS,
  PERSON_PROVIDER_IDS,
  PROVIDER_ENV_KEYS,
  PROVIDER_MODELS,
  answerBounds,
  availableProviders,
} from "../../src/lib/audit/answer-providers";
import { parseGemini, parseGrok, parseSonar } from "../../src/lib/audit/answer-providers-search";
import { parseSocialProfile } from "../../src/lib/audit/social-profile";
import { makeUsage, planCost, searchUsd, type PlannedCall } from "../../src/lib/audit/usage";
import { buildPersonQuestions } from "../../src/lib/audit/person-check";

/* ------------------------------------------------------------ response shapes */

test("Gemini: thoughts are left out of the answer, and billed as output", () => {
  const parsed = parseGemini({
    responseId: "r1",
    candidates: [
      {
        content: { parts: [{ text: "thinking...", thought: true }, { text: "Jane Doe is " }, { text: "an auditor." }] },
        groundingMetadata: {
          webSearchQueries: ["jane doe auditor", "jane doe linkedin"],
          groundingChunks: [{ web: { uri: "https://a.example/1" } }, { web: { uri: "https://a.example/1" } }, {}],
        },
      },
    ],
    usageMetadata: { promptTokenCount: 40, toolUsePromptTokenCount: 900, candidatesTokenCount: 60, thoughtsTokenCount: 25 },
  });
  assert.equal(parsed.text, "Jane Doe is an auditor.");
  assert.deepEqual(parsed.citations, ["https://a.example/1"]);
  assert.equal(parsed.bodyId, "r1");
  assert.deepEqual(parsed.measured, {
    tokenMeasurement: "reported",
    searchMeasurement: "inferred",
    inputTokens: 940,
    outputTokens: 85,
    webSearches: 2,
  });
});

test("Gemini: an answer from memory bills no search", () => {
  const parsed = parseGemini({
    candidates: [{ content: { parts: [{ text: "I do not know this person." }] } }],
    usageMetadata: { promptTokenCount: 30, candidatesTokenCount: 8 },
  });
  assert.equal(parsed.measured?.webSearches, 0);
  assert.deepEqual(parsed.citations, []);
});

test("Perplexity: every answered request counts as one billed search", () => {
  const parsed = parseSonar({
    id: "p1",
    choices: [{ message: { content: " Jane Doe runs audits. " } }],
    citations: ["https://b.example/x", 7],
    search_results: [{ url: "https://b.example/x" }, { url: "https://b.example/y" }],
    usage: { prompt_tokens: 25, completion_tokens: 50 },
  });
  assert.equal(parsed.text, "Jane Doe runs audits.");
  assert.deepEqual(parsed.citations, ["https://b.example/x", "https://b.example/y"]);
  assert.equal(parsed.measured?.webSearches, 1);
  assert.equal(parsed.measured?.searchMeasurement, "reported");
});

test("Grok: text is found by block type, searches by the itemised count", () => {
  const parsed = parseGrok({
    id: "g1",
    output: [
      { type: "web_search_call" },
      { type: "message", content: [{ type: "output_text", text: "Jane Doe.", annotations: [{ url: "https://c.example/1" }] }] },
    ],
    citations: ["https://c.example/2"],
    usage: {
      input_tokens: 5000,
      output_tokens: 70,
      num_server_side_tools_used: 3,
      server_side_tool_usage_details: { web_search_calls: 1 },
    },
  });
  assert.equal(parsed.text, "Jane Doe.");
  assert.deepEqual(parsed.citations, ["https://c.example/2", "https://c.example/1"]);
  assert.equal(parsed.measured?.webSearches, 1);
  assert.equal(parsed.measured?.inputTokens, 5000);
});

test("Grok: without the itemised count the total tool count is used, which can only overstate", () => {
  const parsed = parseGrok({ output: [], usage: { input_tokens: 1, output_tokens: 1, num_server_side_tools_used: 2 } });
  assert.equal(parsed.measured?.webSearches, 2);
  assert.equal(parsed.text, "");
});

test("a response with no usage, or no body at all, is measured as unknown by the caller", () => {
  for (const parse of [parseGemini, parseSonar, parseGrok]) {
    assert.equal(parse({}).measured, null);
    assert.equal(parse(null).measured, null);
    assert.equal(parse({}).text, "");
  }
});

/* ------------------------------------------------------------ bounds and prices */

test("every person provider has a model with a price and a key variable", () => {
  for (const id of PERSON_PROVIDER_IDS) {
    const row = makeUsage({
      clientRequestId: "x",
      provider: id,
      model: PROVIDER_MODELS[id],
      purpose: "answer",
      factId: "who",
      attemptNumber: 1,
      startedAt: "t",
      durationMs: 1,
      providerRequestId: null,
      httpStatus: 200,
      outcome: "ok",
      bounds: answerBounds(id, "Who is Jane Doe?"),
      tokenMeasurement: "reported",
      searchMeasurement: "reported",
      inputTokens: 1000,
      outputTokens: 100,
      webSearches: 1,
    });
    assert.equal(row.priced, true, `${id} must be in the price table`);
    assert.ok(row.providerReportedEstimateUsd > 0);
    assert.match(PROVIDER_ENV_KEYS[id], /_API_KEY$/);
  }
});

test("a search is priced at its own provider's rate", () => {
  assert.equal(searchUsd("openai", 1), 0.01);
  assert.equal(searchUsd("anthropic", 1), 0.01);
  assert.equal(searchUsd("google", 2), 0.028);
  assert.equal(searchUsd("perplexity", 1), 0.005);
  assert.equal(searchUsd("xai", 1), 0.005);
});

test("Google is planned for several queries per question, because no field caps them", () => {
  assert.equal(answerBounds("google", "q").maxWebSearches, 3);
  assert.equal(answerBounds("xai", "q").maxWebSearches, 5, "xAI ignored a cap of 1 in a live call");
  assert.equal(answerBounds("perplexity", "q").maxWebSearches, 1);
  assert.ok(answerBounds("perplexity", "q").maxInputTokens < 1000, "Sonar bills no search result tokens");
});

test("a full person run, every cap hit and every call retried, stays under one dollar fifty", () => {
  const person = {
    name: "Jane Doe",
    role: "AI governance advisor",
    company: "Doe Advisory",
    profileUrl: "https://www.linkedin.com/in/jane-doe",
    category: "AI governance advice for a mid-size company",
  };
  const calls = buildPersonQuestions(person).flatMap((q) =>
    PERSON_PROVIDER_IDS.map(
      (provider): PlannedCall => ({
        provider,
        model: PROVIDER_MODELS[provider],
        purpose: "answer",
        label: `${provider}/${q.id}`,
        maxAttempts: 2,
        bounds: answerBounds(provider, q.question),
      })
    )
  );
  const plan = planCost(calls);
  assert.equal(plan.calls, 15);
  assert.deepEqual(plan.unpricedModels, []);
  assert.ok(plan.conservativeWithRetriesUsd < 1.5, `ceiling was ${plan.conservativeWithRetriesUsd}`);
});

/* ------------------------------------------------------------ provider selection */

test("a new key never widens a company run", () => {
  const saved = { ...process.env };
  try {
    for (const id of PERSON_PROVIDER_IDS) process.env[PROVIDER_ENV_KEYS[id]] = "test-key";
    assert.deepEqual(availableProviders().map((p) => p.id), [...COMPANY_PROVIDER_IDS]);
    assert.deepEqual(availableProviders(undefined, PERSON_PROVIDER_IDS).map((p) => p.id), [...PERSON_PROVIDER_IDS]);
    delete process.env.XAI_API_KEY;
    assert.deepEqual(
      availableProviders(undefined, PERSON_PROVIDER_IDS).map((p) => p.id),
      ["openai", "anthropic", "google", "perplexity"]
    );
  } finally {
    for (const id of PERSON_PROVIDER_IDS) {
      const key = PROVIDER_ENV_KEYS[id];
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});

/* ------------------------------------------------------------ social profile gate */

function url(value: string): string | null {
  const result = parseSocialProfile(value);
  return result.ok ? result.profile.url : null;
}

test("the four networks are taken, in one spelling each", () => {
  assert.equal(url("linkedin.com/in/Sergei-Ponomarev/?utm_source=share"), "https://www.linkedin.com/in/sergei-ponomarev");
  assert.equal(url("https://bg.linkedin.com/in/sergei-ponomarev"), "https://www.linkedin.com/in/sergei-ponomarev");
  assert.equal(url("https://twitter.com/AIBusinessvc"), "https://x.com/AIBusinessvc");
  assert.equal(url("x.com/@AIBusinessvc"), "https://x.com/AIBusinessvc");
  assert.equal(url("https://www.instagram.com/jane.doe/"), "https://www.instagram.com/jane.doe");
  assert.equal(url("https://m.facebook.com/jane.doe.5"), "https://www.facebook.com/jane.doe.5");
  assert.equal(url("https://www.facebook.com/profile.php?id=100012345678"), "https://www.facebook.com/profile.php?id=100012345678");
});

test("a website, a channel, a company page or a post is refused with a sentence to show", () => {
  const refused = [
    "https://aibusiness.vc",
    "https://www.youtube.com/@somechannel",
    "https://www.linkedin.com/company/ai-business",
    "https://www.linkedin.com/posts/someone_activity-123",
    "https://x.com/home",
    "https://x.com/someone/status/123",
    "https://www.instagram.com/p/Cabc123/",
    "https://www.facebook.com/groups/ai-governance",
    "https://www.facebook.com/profile.php?id=abc",
    "https://notlinkedin.com/in/jane",
    "https://linkedin.com.evil.example/in/jane",
    "https://user:pass@linkedin.com/in/jane",
    "just some words",
    "",
  ];
  for (const value of refused) {
    const result = parseSocialProfile(value);
    assert.equal(result.ok, false, `${value} must be refused`);
    if (!result.ok) assert.ok(result.error.length > 20);
  }
  const site = parseSocialProfile("https://aibusiness.vc");
  assert.ok(!site.ok && /AI Company Scan/.test(site.error));
});

test("a LinkedIn internal member link is refused and asks for the public address", () => {
  for (const value of [
    "https://www.linkedin.com/in/ACoAAEkrrT8BxQn2v7wZlJkHn3pQ9fGdLmS0aYc",
    "linkedin.com/in/ACwAAAbCdEfGhIjKlMnOpQrStUvWxYz0123456789/",
  ]) {
    const result = parseSocialProfile(value);
    assert.equal(result.ok, false, `${value} must be refused`);
    if (!result.ok) assert.match(result.error, /public/i);
  }
  // A real name that merely starts with the same letters is still a name.
  assert.equal(url("https://www.linkedin.com/in/acosta-maria"), "https://www.linkedin.com/in/acosta-maria");
});
