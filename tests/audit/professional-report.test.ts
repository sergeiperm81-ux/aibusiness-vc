/**
 * The synthesis guard rails, the citation clean-up and the PDF render.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import { isGoogleRedirect, stripTracking } from "../../src/lib/audit/citation-cleanup";
import { buildPersonReportPdf, groupSources, plainAnswer, rolesNamedByOneModel } from "../../src/lib/audit/person-report-pdf";
import { answersBlock, parseSynthesis, type PersonSynthesis } from "../../src/lib/audit/person-synthesis";

const LABELS = ["OpenAI", "Anthropic", "Gemini"];
const QUESTIONS = ["who", "does", "reputation"];

function check(): AnswerCheck {
  const answer = (providerId: string, providerLabel: string, text: string, citations: string[] = []) => ({
    providerId: providerId as "openai",
    providerLabel,
    model: "m",
    askedAt: "2026-09-21T08:00:00Z",
    ok: text.length > 0,
    text,
    citations,
    error: text ? undefined : "timeout after 90000 ms",
    usage: [],
  });
  return {
    subject: { kind: "person", domain: "", brand: "Jane Doe", product: "Analyst", category: "" },
    checkedAt: "2026-09-21T08:00:00.000Z",
    providers: [
      { id: "openai", label: "OpenAI", model: "gpt-4.1-mini" },
      { id: "anthropic", label: "Anthropic", model: "claude-haiku-4-5-20251001" },
      { id: "google", label: "Gemini", model: "gemini-3.5-flash-lite" },
    ],
    results: QUESTIONS.map((id) => ({
      fact: { id: id as "who", label: id, blind: false, question: `Long wording for ${id}?` },
      answers: [
        answer("openai", "OpenAI", "Jane Doe is an analyst in Dubai. She posted about terraces in March 2026.", ["https://a.example/post"]),
        answer("anthropic", "Anthropic", "I found several people named Jane Doe — including a “physicist”."),
        answer("google", "Gemini", ""),
      ],
    })),
  };
}

function raw(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    identity: {
      summary: "The assistants describe you as an analyst in Dubai.",
      facts: [
        { label: "Based in", value: "Dubai", saidBy: ["openai", "Bing"] },
        { label: "Contact", value: "jane@example.com", saidBy: ["Bing"] },
      ],
    },
    professional: {
      summary: "They see you as a working analyst.",
      roles: [{ label: "Role", value: "Analyst", saidBy: ["OpenAI"] }],
      activity: [
        { what: "A post about terraces", where: "LinkedIn", when: "March 2026", saidBy: ["OpenAI"] },
        { what: "A talk", where: "a conference", when: "June 2019", saidBy: ["OpenAI"] },
      ],
      activityNote: "One assistant named a post from March 2026.",
    },
    redFlags: {
      flags: [],
      clear: ["No disputes found"],
      caveats: ["No independent confirmation was found."],
      reviews: [
        { what: "A client praised a valuation.", link: "https://a.example/post", saidBy: ["OpenAI"] },
        { what: "A glowing review.", link: "https://made-up.example/review", saidBy: ["OpenAI"] },
      ],
    },
    mixups: [
      {
        who: "A physicist with the same name",
        saidBy: ["Anthropic"],
        links: ["https://a.example/post", "https://invented.example/physicist", "javascript:alert(1)"],
      },
    ],
    disagreements: [{ topic: "Employer", versions: [{ saidBy: "OpenAI", says: "A" }] }],
    coverage: [
      { provider: "OpenAI", questionId: "who", status: "found" },
      { provider: "Anthropic", questionId: "who", status: "mixed" },
      { provider: "Anthropic", questionId: "favourite-colour", status: "found" },
      { provider: "OpenAI", questionId: "does", status: "certainly" },
    ],
    recommendations: [
      ...[1, 2, 3, 4, 5, 6].map((n) => ({ title: `Do ${n}`, why: "A gap.", steps: ["Write this there.", "Then publish that."] })),
      { title: "Vague", why: "A gap.", steps: [] },
    ],
    ...overrides,
  });
}

test("a statement is kept only when an assistant that was asked stands behind it", () => {
  const parsed = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(parsed);
  assert.deepEqual(parsed.identity.facts, [{ label: "Based in", value: "Dubai", saidBy: ["OpenAI"] }]);
});

test("a date that is in no answer is dropped, and the activity stays", () => {
  const parsed = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(parsed);
  assert.equal(parsed.professional.activity[0].when, "March 2026");
  assert.equal(parsed.professional.activity[1].what, "A talk");
  assert.equal(parsed.professional.activity[1].when, null);
});

test("coverage rows with an unknown question or status are dropped, one-sided disagreements too", () => {
  const parsed = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(parsed);
  assert.equal(parsed.coverage.length, 2);
  assert.deepEqual(parsed.disagreements, []);
});

test("a synthesis with no summary, too few recommendations, or broken JSON is refused", () => {
  const block = answersBlock(check());
  assert.equal(parseSynthesis("not json", LABELS, QUESTIONS, block), null);
  assert.equal(parseSynthesis(raw({ identity: { summary: "" } }), LABELS, QUESTIONS, block), null);
  assert.equal(parseSynthesis(raw({ recommendations: [] }), LABELS, QUESTIONS, block), null);
});

test("the answers block names every assistant, its sources, and a failed answer as failed", () => {
  const block = answersBlock(check());
  assert.match(block, /=== QUESTION id "reputation"/);
  assert.match(block, /Sources it cited: https:\/\/a\.example\/post/);
  assert.match(block, /--- Gemini\n\(no answer: timeout/);
});

test("tracking is stripped from a source, and only Google's redirect host is ever followed", () => {
  assert.equal(stripTracking("https://www.linkedin.com/in/x?utm_source=openai"), "https://www.linkedin.com/in/x");
  assert.equal(stripTracking("https://a.example/p?id=7&utm_source=openai"), "https://a.example/p?id=7");
  assert.equal(stripTracking("not a url"), "not a url");
  assert.equal(isGoogleRedirect("https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc"), true);
  assert.equal(isGoogleRedirect("https://vertexaisearch.cloud.google.com.evil.example/x"), false);
  assert.equal(isGoogleRedirect("https://a.example/"), false);
});

async function render(synthesis: PersonSynthesis): Promise<Uint8Array> {
  return buildPersonReportPdf({
    name: "Jane Doe",
    profileUrl: "https://www.linkedin.com/in/jane-doe",
    check: check(),
    synthesis,
    notFoundKeys: new Set(["who/anthropic"]),
  });
}

test("the report renders with no red flags, with curly quotes and a failed answer in the appendix", async () => {
  const synthesis = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(synthesis);
  const bytes = await render(synthesis);
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString("latin1"), "%PDF-");
  assert.ok(bytes.length > 5_000);
});

test("the report renders with red flags, including one about a namesake", async () => {
  const synthesis = parseSynthesis(
    raw({
      redFlags: {
        flags: [
          { flag: "A client complaint on a review site.", saidBy: ["OpenAI"], source: "https://a.example/review", possiblyAnotherPerson: false },
          { flag: "A court case in another country.", saidBy: ["Anthropic"], source: null, possiblyAnotherPerson: true },
          { flag: "Something nobody asked said.", saidBy: ["Bing"], source: null, possiblyAnotherPerson: false },
        ],
        clear: [],
        caveats: [],
      },
    }),
    LABELS,
    QUESTIONS,
    answersBlock(check())
  );
  assert.ok(synthesis);
  assert.equal(synthesis.redFlags.flags.length, 2);
  const bytes = await render(synthesis);
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString("latin1"), "%PDF-");
});

test("a link is kept only when it is literally in the answers: namesake pages and reviews are never invented", () => {
  const parsed = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(parsed);
  assert.deepEqual(parsed.mixups[0].links, ["https://a.example/post"]);
  assert.equal(parsed.redFlags.reviews[0].link, "https://a.example/post");
  assert.equal(parsed.redFlags.reviews[1].link, null);
});

test("a recommendation with no concrete step is dropped, and there are never more than five", () => {
  const parsed = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(parsed);
  // At most five, in the model's order: most important first.
  assert.deepEqual(parsed.recommendations.map((r) => r.title), ["Do 1", "Do 2", "Do 3", "Do 4", "Do 5"]);
  assert.equal(parsed.recommendations[0].steps.length, 2);
});

test("an answer is printed as plain paragraphs: marks dropped, words kept, inline links left to the source list", () => {
  const blocks = plainAnswer(
    "## Background\n**Anastasia** works in *Dubai* ([linkedin.com](https://www.linkedin.com/in/x?utm_source=openai)).\n\n- First point with [a page](https://a.example/p)\n2. Second point\n---\n**What I did NOT find:**"
  );
  assert.deepEqual(blocks, [
    { text: "Background", bullet: false, heading: true },
    { text: "Anastasia works in Dubai.", bullet: false, heading: false },
    { text: "First point with a page", bullet: true, heading: false },
    { text: "Second point", bullet: true, heading: false },
    { text: "What I did NOT find:", bullet: false, heading: true },
  ]);
});

test("sources are split into social networks and websites", () => {
  const grouped = groupSources([
    "https://ae.linkedin.com/in/x",
    "https://medium.com/@a/post",
    "https://t.me/channel",
    "https://notlinkedin.com/in/x",
    "https://www.zoominfo.com/p/x",
    "not a url",
  ]);
  assert.deepEqual(grouped.social, ["https://ae.linkedin.com/in/x", "https://medium.com/@a/post", "https://t.me/channel"]);
  assert.deepEqual(grouped.web, ["https://notlinkedin.com/in/x", "https://www.zoominfo.com/p/x", "not a url"]);
});

test("footnote links in an answer are dropped from the text, and encoded addresses are shown readable", () => {
  const blocks = plainAnswer("She works in Dubai.[[1]](https://t.me/dubaiocenka)[2](https://vc.ru/id1) More [1][3].");
  assert.equal(blocks[0].text, "She works in Dubai. More.");
  const grouped = groupSources(["https://www.linkedin.com/in/%D0%B0%D0%BD%D0%B0", "https://a.example/%E0%A4%A"]);
  // Kept as sent, so the link works; the label shown to the reader is decoded separately.
  assert.deepEqual(grouped.social, ["https://www.linkedin.com/in/%D0%B0%D0%BD%D0%B0"]);
  assert.deepEqual(grouped.web, ["https://a.example/%E0%A4%A"]);
});

test("Claude's pre-search sentence glued to a stored answer is dropped when printed", () => {
  const blocks = plainAnswer("I'll search for information about him.Based on the results, he is an editor.");
  assert.equal(blocks[0].text, "Based on the results, he is an editor.");
  assert.equal(plainAnswer("I'll search again. Nothing found.")[0].text, "I'll search again. Nothing found.");
});

test("a role only one model names is an unconfirmed claim, never a contradiction, once three models answered", () => {
  const synthesis = parseSynthesis(raw(), LABELS, QUESTIONS, answersBlock(check()));
  assert.ok(synthesis);
  // In the fixture only OpenAI answers "does": too few to call a lone role unconfirmed.
  assert.deepEqual(rolesNamedByOneModel(synthesis, check()), []);
  const full = check();
  const many = {
    ...full,
    results: full.results.map((row) => ({ ...row, answers: row.answers.map((a) => ({ ...a, ok: true, text: a.text || "x" })) })),
  };
  const extra = {
    ...synthesis,
    professional: { ...synthesis.professional, roles: [...synthesis.professional.roles, { label: "Role", value: "Founder at X", saidBy: ["OpenAI", "Gemini"] }] },
  };
  assert.deepEqual(rolesNamedByOneModel(extra, many).map((r) => r.value), ["Analyst"]);
});

test("an absence is said as what the sources did not show, and a missing value is never one side of a contradiction", () => {
  const parsed = parseSynthesis(
    raw({
      identity: {
        summary: "Doe Ltd is a firm.",
        facts: [{ label: "Legal name", value: "No formal legal company name disclosed", saidBy: ["OpenAI"] }],
      },
      disagreements: [
        { topic: "Founding date", versions: [{ saidBy: "OpenAI", says: "Founded in March 2026" }, { saidBy: "Anthropic", says: "No exact founding date stated" }] },
        { topic: "City", versions: [{ saidBy: "OpenAI", says: "Dubai" }, { saidBy: "Anthropic", says: "Riyadh" }] },
      ],
    }),
    LABELS,
    QUESTIONS,
    answersBlock(check())
  );
  assert.ok(parsed);
  assert.equal(parsed.identity.facts[0].value, "No legal name was identified in the sources reviewed.");
  assert.deepEqual(parsed.disagreements.map((d) => d.topic), ["City"]);
});

test("advice to publish dated news is dropped when the assistants already quote recent dated activity", () => {
  const recent = new Date(Date.now() - 20 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const recs = [
    { title: "Maintain and date recent public activity", why: "Dated announcements help.", steps: ["Continue publishing dated articles."] },
    ...[1, 2, 3].map((n) => ({ title: `Do ${n}`, why: "A gap.", steps: ["Write this there."] })),
  ];
  const block = answersBlock(check()) + ` ${recent}`;
  const parsed = parseSynthesis(
    raw({ professional: { summary: "s", roles: [], activity: [{ what: "A post", where: "LinkedIn", when: recent, saidBy: ["OpenAI"] }], activityNote: "" }, recommendations: recs }),
    LABELS,
    QUESTIONS,
    block
  );
  assert.ok(parsed);
  assert.deepEqual(parsed.recommendations.map((r) => r.title), ["Do 1", "Do 2", "Do 3"]);
});
