/**
 * The report groups answers about another entity into one finding instead of
 * listing their statements as contradictions. No network.
 * Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import type { AnalysedAnswer } from "../../src/lib/audit/answer-analysis";
import type { ProviderAnswer } from "../../src/lib/audit/answer-providers";
import type { SiteFacts } from "../../src/lib/audit/site-facts";
import {
  computeAnswerSignals,
  renderAnswerCheckMarkdown,
  renderPreviewMarkdown,
} from "../../src/lib/audit/answer-check-report";
import { buildQuestions } from "../../src/lib/audit/answer-check";

function answer(providerId: "openai" | "anthropic", text: string, citations: string[] = []): ProviderAnswer {
  return {
    providerId,
    providerLabel: providerId === "openai" ? "OpenAI" : "Anthropic",
    model: providerId === "openai" ? "gpt-4.1-mini" : "claude-haiku-4-5-20251001",
    askedAt: "2026-09-12T20:27:00.000Z",
    ok: true,
    text,
    citations,
    usage: [],
  };
}

const subject = {
  domain: "super.tennis",
  brand: "SUPER.TENNIS",
  product: "the SUPER.TENNIS online platform",
  category: "tennis news",
  recommendAs: "websites",
};

const TV =
  "SUPER.TENNIS operates a 24-hour television channel. Email redazione@supertennis.tv for general inquiries.";
const NOT_FOUND =
  "I wasn't able to find specific information about SUPER.TENNIS. Could you provide more details?";
const REAL = "SUPER.TENNIS is an online tennis platform with news and player profiles.";

const check: AnswerCheck = {
  subject,
  checkedAt: "2026-09-12T20:27:00.000Z",
  providers: [
    { id: "openai", label: "OpenAI", model: "gpt-4.1-mini" },
    { id: "anthropic", label: "Anthropic", model: "claude-haiku-4-5-20251001" },
  ],
  results: buildQuestions(subject).map((fact) => ({
    fact,
    answers:
      fact.id === "what"
        ? [answer("openai", TV, ["https://www.supertennis.tv/"]), answer("anthropic", NOT_FOUND)]
        : [answer("openai", REAL, ["https://super.tennis/about/"]), answer("anthropic", REAL)],
  })),
};

const facts: SiteFacts = {
  domain: "super.tennis",
  fetchedAt: "2026-09-12T20:27:00.000Z",
  reachable: true,
  pages: [{ url: "https://super.tennis/about/", ok: true, text: "An online tennis platform." }],
  markup: {
    name: null,
    description: null,
    country: null,
    locality: null,
    founder: null,
    contact: null,
    prices: [],
    schemaTypes: [],
    declaresOffer: false,
  },
  reference: "--- https://super.tennis/about/ ---\nAn online tennis platform.",
  shortened: [],
};

// The judge, had it been asked, returned contradictions for the TV answer.
const analyses: AnalysedAnswer[] = [
  {
    factId: "what",
    providerId: "openai",
    ok: true,
    sameEntity: true,
    otherEntity: null,
    claims: [
      {
        claim: "SUPER.TENNIS operates a 24-hour television channel.",
        status: "contradicted",
        kind: "wrong",
        siteSays: "An online tennis platform.",
        siteSaysOn: "https://super.tennis/about/",
        severity: "high",
        replacement: "An online tennis platform.",
        ownerCheck: null,
      },
    ],
  },
];

const signals = computeAnswerSignals(check);
const report = renderAnswerCheckMarkdown(check, facts, analyses, signals);

test("an answer citing a lookalike domain is reported as another entity, with the domain as evidence", () => {
  assert.match(report, /Described another entity instead of you/);
  assert.match(report, /supertennis\.tv, which resembles your domain but is not it/);
});

test("its statements are not listed as contradictions", () => {
  const contradictionsSection = report.slice(report.indexOf("## 2."), report.indexOf("## 3."));
  assert.doesNotMatch(contradictionsSection, /\| OpenAI \| SUPER\.TENNIS operates a 24-hour television channel/);
});

test("the correction is one conditional disambiguation, not a list", () => {
  const matches = report.match(/is not affiliated with supertennis\.tv/g) ?? [];
  assert.equal(matches.length, 1);
  assert.match(report, /only if there is no connection/);
});

test("a non-answer is reported as not finding the client, with the phrase it used", () => {
  assert.match(report, /Could not find you by name/);
  assert.match(report, /did not find you/);
});

test("the preview leads with the misidentification, not a contradiction", () => {
  const preview = renderPreviewMarkdown(check, analyses, signals);
  assert.match(preview, /It is not talking about you/);
  assert.doesNotMatch(preview, /One contradiction with your site/);
});
