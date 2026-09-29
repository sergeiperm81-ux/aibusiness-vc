/**
 * AI Website Visibility, paid part: five assistants asked about the site.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { AnswerProvider, ProviderAnswer } from "../../src/lib/audit/answer-attempt";
import {
  buildVisibilityQuestions,
  isOwnPage,
  reachOf,
  runSiteVisibility,
  splitSources,
  type SiteVisibilityDeps,
} from "../../src/lib/audit/site-visibility";

function answer(label: string, ok: boolean, text: string, citations: readonly string[], error?: string): ProviderAnswer {
  return {
    providerId: "openai",
    providerLabel: label,
    model: `${label}-model`,
    askedAt: "2026-09-29T00:00:00.000Z",
    ok,
    text,
    citations,
    error,
    usage: [],
  };
}

function fake(label: string, reply: () => Promise<ProviderAnswer>): AnswerProvider {
  return { id: "openai", label, model: `${label}-model`, ask: () => reply() };
}

function deps(providers: readonly AnswerProvider[], deadlineMs = 1_000): SiteVisibilityDeps {
  return {
    providers,
    clean: async (c) => c,
    deadlineMs,
    now: () => new Date("2026-09-29T10:00:00.000Z"),
  };
}

test("the questions are about the website, name the domain, and allow 'not found'", () => {
  const qs = buildVisibilityQuestions("acme.com");
  assert.deepEqual(qs.map((q) => q.id), ["site", "pages"]);
  for (const q of qs) {
    assert.match(q.question, /acme\.com/);
    assert.match(q.question, /say so plainly/);
  }
});

test("own pages are the domain and its subdomains, www or not, and nothing else", () => {
  assert.equal(isOwnPage("https://acme.com/pricing", "acme.com"), true);
  assert.equal(isOwnPage("https://www.acme.com/", "acme.com"), true);
  assert.equal(isOwnPage("https://blog.acme.com/post", "www.acme.com"), true);
  assert.equal(isOwnPage("https://notacme.com/", "acme.com"), false);
  assert.equal(isOwnPage("https://acme.com.evil.io/", "acme.com"), false);
  assert.equal(isOwnPage("not a url", "acme.com"), false);
  const { own, other } = splitSources(["https://acme.com/a", "https://g2.com/acme"], "acme.com");
  assert.deepEqual(own, ["https://acme.com/a"]);
  assert.deepEqual(other, ["https://g2.com/acme"]);
});

test("reach: own page wins, then other sources, then none, and silence is its own state", () => {
  const base = { questionId: "site" as const, text: "x" };
  assert.equal(reachOf([{ ...base, ok: true, ownPages: ["https://a.com"], otherSources: [] }]), "read");
  assert.equal(reachOf([{ ...base, ok: true, ownPages: [], otherSources: ["https://b.com"] }]), "elsewhere");
  assert.equal(reachOf([{ ...base, ok: true, ownPages: [], otherSources: [] }]), "nothing");
  assert.equal(reachOf([{ ...base, ok: false, ownPages: [], otherSources: [] }]), "no_answer");
});

test("a silent model and a late model are reported as missing, never dropped", async () => {
  const reads = fake("Reads", async () => answer("Reads", true, "It sells rockets.", ["https://acme.com/", "https://news.io/acme"]));
  const limited = fake("Limited", async () => answer("Limited", false, "", [], "HTTP 429 too many requests"));
  const late = fake("Late", () => new Promise((resolve) => setTimeout(() => resolve(answer("Late", true, "late", [])), 200)));

  const result = await runSiteVisibility("acme.com", deps([reads, limited, late], 50));

  assert.equal(result.providers.length, 3, "every model keeps its row");
  const [r, l, t] = result.providers;
  assert.equal(r.reach, "read");
  assert.deepEqual(r.ownPages, ["https://acme.com/"]);
  assert.deepEqual(r.otherSources, ["https://news.io/acme"]);

  assert.equal(l.reach, "no_answer");
  assert.equal(l.answers[0].missing, "The model was over its rate limit.");

  assert.equal(t.reach, "no_answer");
  assert.equal(t.answers[0].missing, "No answer within the time allowed.");
  assert.equal(result.checkedAt, "2026-09-29T10:00:00.000Z");
});
