/**
 * The person variant of the answer check. No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { instructionsFor } from "../../src/lib/audit/answer-analysis";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import { computeAnswerSignals } from "../../src/lib/audit/answer-check-report";
import {
  buildPersonQuestions,
  cleanProfileUrl,
  personHandle,
  toAnswerSubject,
  type PersonSubject,
} from "../../src/lib/audit/person-check";
import {
  assembleReference,
  classifyProfileResponse,
  providedBlock,
  selectPersonReferencePages,
  type PublicProfile,
} from "../../src/lib/audit/person-facts";
import { parseDraft } from "../../src/lib/audit/person-rewrite";

const sergei: PersonSubject = {
  name: "Sergei Ponomarev",
  role: "Founder",
  company: "AI Business",
  profileUrl: "linkedin.com/in/sergei-ponomarev/",
  companyDomain: "https://aibusiness.vc/",
  category: "an independent test purchase of a company's AI chatbot",
  market: "Europe",
  oneLiner: "I test AI agents the way a mystery shopper tests a shop.",
};

test("the profile address is normalised to one spelling", () => {
  assert.equal(cleanProfileUrl("linkedin.com/in/sergei-ponomarev/"), "https://linkedin.com/in/sergei-ponomarev");
  assert.equal(
    cleanProfileUrl("https://www.linkedin.com/in/sergei-ponomarev/"),
    "https://www.linkedin.com/in/sergei-ponomarev"
  );
});

test("every named question identifies the person by name, role, company and profile", () => {
  const questions = buildPersonQuestions(sergei);
  const handle = personHandle(sergei);
  assert.equal(questions.length, 3);
  for (const q of questions.filter((q) => !q.blind)) {
    assert.ok(q.question.includes(handle), `${q.id} must carry the full handle`);
  }
  assert.ok(handle.includes("Sergei Ponomarev, Founder at AI Business (https://linkedin.com/in/sergei-ponomarev)"));
});

test("all three questions name the person, and the third asks about reputation with sources", () => {
  const questions = buildPersonQuestions(sergei);
  assert.deepEqual(questions.map((q) => q.id), ["who", "does", "reputation"]);
  assert.ok(questions.every((q) => !q.blind));
  assert.match(questions[0].question, /get in touch/);
  assert.match(questions[2].question, /^I am thinking of working with Sergei Ponomarev/);
  assert.match(questions[2].question, /if you find nothing, say so plainly\.$/);
  assert.equal(buildPersonQuestions({ ...sergei, category: undefined }).length, 3);
});

test("the generic subject carries the person's kind, cleaned domain and profile", () => {
  const subject = toAnswerSubject(sergei);
  assert.equal(subject.kind, "person");
  assert.equal(subject.domain, "aibusiness.vc");
  assert.equal(subject.brand, "Sergei Ponomarev");
  assert.equal(subject.product, "Founder at AI Business");
  assert.equal(subject.profileUrl, "https://linkedin.com/in/sergei-ponomarev");
  assert.equal(toAnswerSubject({ ...sergei, companyDomain: undefined }).domain, "");
});

test("LinkedIn's bot block and login wall are not a profile", () => {
  assert.equal(classifyProfileResponse(999, "https://www.linkedin.com/in/x", ""), "blocked");
  assert.equal(classifyProfileResponse(200, "https://www.linkedin.com/authwall?trk=x", "<html>"), "blocked");
  assert.equal(
    classifyProfileResponse(200, "https://www.linkedin.com/in/x", "<html><head><title>Sign In | LinkedIn</title></head></html>"),
    "blocked"
  );
  assert.equal(classifyProfileResponse(404, "https://www.linkedin.com/in/x", "<html>nothing</html>"), "unreachable");
  const long = `<html><body><h1>Sergei Ponomarev</h1><p>${"Methodologist of technology adoption. ".repeat(30)}</p></body></html>`;
  assert.equal(classifyProfileResponse(200, "https://www.linkedin.com/in/x", long), "read");
});

test("the form entries lead the reference and are never shortened; a blocked profile is left out", () => {
  const provided = providedBlock(sergei);
  assert.match(provided, /^Name: Sergei Ponomarev/);
  assert.match(provided, /In their own words: I test AI agents/);
  const blocked: PublicProfile = { url: "https://www.linkedin.com/in/x", outcome: "blocked", text: "", note: "blocked" };
  const pages = [
    { url: "https://aibusiness.vc/", ok: true, text: "x".repeat(30_000) },
    { url: "https://aibusiness.vc/about", ok: true, text: "about page" },
    { url: "https://aibusiness.vc/pricing", ok: false, text: "" },
  ];
  const { reference, shortened } = assembleReference(provided, blocked, pages);
  assert.ok(reference.startsWith("--- what the person states about themselves ---\nName: Sergei Ponomarev"));
  assert.doesNotMatch(reference, /linkedin\.com\/in\/x/);
  assert.match(reference, /--- https:\/\/aibusiness\.vc\/about ---\nabout page/);
  assert.deepEqual(shortened, ["https://aibusiness.vc/"]);
  assert.ok(reference.length <= 24_500);
});

test("a person's reference excludes llms and broad editorial pages", () => {
  const pages = [
    { url: "https://aibusiness.vc/llms.txt", ok: true, text: `Sergei Ponomarev ${"AI topics ".repeat(100)}` },
    { url: "https://aibusiness.vc/solo/one-person-company", ok: true, text: "AI agents for one-person companies" },
    { url: "https://aibusiness.vc/sergei-ponomarev", ok: true, text: "Sergei Ponomarev tests AI agents." },
    { url: "https://aibusiness.vc/about", ok: true, text: "About AI Business and Sergei Ponomarev." },
    { url: "https://aibusiness.vc/service-check", ok: true, text: "Independent test purchase of an AI chatbot." },
  ];
  assert.deepEqual(
    selectPersonReferencePages(sergei, pages).map((page) => page.url),
    [
      "https://aibusiness.vc/sergei-ponomarev",
      "https://aibusiness.vc/about",
      "https://aibusiness.vc/service-check",
    ]
  );
});

test("a person without a company domain gets no lookalike or foreign-email flags", () => {
  const check: AnswerCheck = {
    subject: toAnswerSubject({ ...sergei, companyDomain: undefined }),
    checkedAt: "2026-09-16T00:00:00.000Z",
    providers: [{ id: "openai", label: "OpenAI", model: "gpt-4.1-mini" }],
    results: [
      {
        fact: buildPersonQuestions(sergei)[0],
        answers: [
          {
            providerId: "openai",
            providerLabel: "OpenAI",
            model: "gpt-4.1-mini",
            askedAt: "2026-09-16T00:00:00.000Z",
            ok: true,
            text: "Sergei Ponomarev can be reached at sergei@example.com, see sergei.example.org.",
            citations: ["https://sergei.example.org/"],
            usage: [],
          },
        ],
      },
    ],
  };
  const [signal] = computeAnswerSignals(check);
  assert.deepEqual(signal.entity.lookalikeDomains, []);
  assert.deepEqual(signal.entity.foreignEmailDomains, []);
  assert.equal(signal.nonAnswer.notFound, false);
});

test("the judge's brief for a person never asks for a company website", () => {
  const brief = instructionsFor("person");
  assert.match(brief, /about one person/);
  assert.match(brief, /different person who merely shares the name/);
  assert.doesNotMatch(brief, /company's own website text/);
  assert.match(instructionsFor("company"), /company's own website text/);
});

test("an answer that found only limited information, or would not browse, is a non-answer", async () => {
  const { detectNonAnswer } = await import("../../src/lib/audit/answer-signals");
  const subject = { brand: "Sergei Ponomarev", domain: "aibusiness.vc" };
  assert.equal(
    detectNonAnswer("Based on the search results, I found limited specific information about Sergei Ponomarev at AI Business.", subject).notFound,
    true
  );
  assert.equal(
    detectNonAnswer("I don't have access to browse the specific LinkedIn profile of Sergei Ponomarev, but here is general guidance.", subject).notFound,
    true
  );
  assert.equal(
    detectNonAnswer(
      "I don't have access to browse the specific LinkedIn profile or website you've linked, but I can provide general guidance on how to contact or follow this person.",
      subject
    ).notFound,
    true
  );
  assert.equal(
    detectNonAnswer("Sergei Ponomarev founded AI Business. I could not find a published price for the audit.", subject).notFound,
    false
  );
});

test("a lookalike cited beside the canonical domain is contamination, not full entity substitution", async () => {
  const { detectEntityMismatch } = await import("../../src/lib/audit/answer-signals");
  const signal = detectEntityMismatch(
    "aibusiness.vc",
    "Sergei runs AI Business. One paragraph also borrows a description from aibusiness.com.",
    ["https://aibusiness.vc/sergei-ponomarev", "https://aibusiness.com/about-us"]
  );
  assert.equal(signal.ownDomainPresent, true);
  assert.deepEqual(signal.lookalikeDomains, ["aibusiness.com"]);
});

const validDraft = {
  headline: "Founder at AI Business | Independent AI-agent testing",
  about: "I test customer-facing AI agents against the promises their companies publish.",
  postTopics: [
    { title: "One", why: "Fills one measured gap." },
    { title: "Two", why: "Fills a second measured gap." },
    { title: "Three", why: "Fills a third measured gap." },
  ],
  siteLines: ["Line one.", "Line two.", "Line three."],
};

test("publishable drafts reject diagnostic meta-language", () => {
  assert.ok(parseDraft(JSON.stringify(validDraft)));
  assert.equal(
    parseDraft(JSON.stringify({ ...validDraft, about: "Some sources miss that I am based in Bulgaria." })),
    null
  );
  assert.equal(
    parseDraft(JSON.stringify({ ...validDraft, siteLines: ["ChatGPT gets this wrong.", "Line two.", "Line three."] })),
    null
  );
});

test("second person test: a contradiction must quote the reference, not describe it", async () => {
  const { enforceQuotedContradictions, isQuotedFrom } = await import("../../src/lib/audit/answer-analysis");
  const reference = "--- about ---\nPartner for methodology and development in Central and Eastern Europe at NeoMundi, a French AI metrology company.";
  assert.equal(isQuotedFrom(reference, "The reference text does not mention SAP SuccessFactors or any prior positions."), false);
  assert.equal(isQuotedFrom(reference, "NeoMundi, a French AI metrology company"), true);
  const [out] = enforceQuotedContradictions(
    [
      {
        factId: "does",
        providerId: "openai",
        ok: true,
        sameEntity: true,
        otherEntity: null,
        claims: [
          { claim: "Worked at SAP SuccessFactors.", status: "contradicted", kind: "wrong", siteSays: "The reference text does not mention SAP SuccessFactors.", siteSaysOn: null, severity: "medium", replacement: "x", ownerCheck: null },
          { claim: "NeoMundi is Swiss.", status: "contradicted", kind: "wrong", siteSays: "at NeoMundi, a French AI metrology company", siteSaysOn: "about", severity: "medium", replacement: "NeoMundi is French.", ownerCheck: null },
        ],
      },
    ],
    reference
  );
  assert.equal(out.claims[0].status, "unverified");
  assert.equal(out.claims[0].replacement, null);
  assert.equal(out.claims[1].status, "contradicted");
});

test("second person test: 'search results don't contain information about' is a non-answer", async () => {
  const { detectNonAnswer } = await import("../../src/lib/audit/answer-signals");
  const subject = { brand: "Sergei Ponomarev", domain: "aibusiness.vc" };
  assert.equal(
    detectNonAnswer("The search results don't contain specific information about Sergei Ponomarev as the founder of AI Business.", subject).notFound,
    true
  );
});

test("second person test: a judge that names nobody means 'not found', not 'confused with'", async () => {
  const { judgedNotFound, otherEntityOf, rowVerdict } = await import("../../src/lib/audit/answer-check-report");
  const vague = { factId: "does", providerId: "anthropic", ok: true, sameEntity: false, otherEntity: "Person(s) with similar name or no specific data on Sergei Ponomarev", claims: [] };
  const named = { ...vague, otherEntity: "Sergey Ponomarev, a software engineer at SAP" };
  assert.equal(judgedNotFound(vague), true);
  assert.equal(otherEntityOf(undefined, vague), null);
  assert.equal(judgedNotFound(named), false);
  assert.ok(otherEntityOf(undefined, named));
  const row = { fact: buildPersonQuestions(sergei)[1], answers: [{ providerId: "anthropic" as const, providerLabel: "Anthropic", model: "m", askedAt: "", ok: true, text: "x", citations: [], usage: [] }] };
  assert.equal(rowVerdict(row, "anthropic", [vague], []), "did not find you");
});

test("second person test: drafts may not deny, and invented years are named", async () => {
  const { unsupportedTerms } = await import("../../src/lib/audit/person-rewrite");
  const base = {
    headline: "Founder at AI Business",
    about: "I am Sergei Ponomarev, founder of AI Business.",
    postTopics: [{ title: "a", why: "b" }, { title: "c", why: "d" }, { title: "e", why: "f" }],
    siteLines: ["one", "two", "three"],
  };
  assert.equal(parseDraft(JSON.stringify({ ...base, about: "Contrary to some reports, I have not worked at SAP." })), null);
  const draft = { ...base, siteLines: ["I have tested AI agents hands-on since 2021.", "I work with NeoMundi.", "three"] };
  const terms = unsupportedTerms(draft, "Name: Sergei Ponomarev\nCompany: AI Business\nPartner at NeoMundi");
  assert.deepEqual(terms, ["2021"]);
});
