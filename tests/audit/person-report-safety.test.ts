/**
 * What the person report may print, and what it holds back.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import { anthropicAnswerText } from "../../src/lib/audit/answer-providers";
import { answersAboutProfile, identityAmbiguous, mentionsOthersTrouble, sourceLabel, verifiedSources } from "../../src/lib/audit/person-report-safety";
import { anchorsFor, isTheProfile, keepSourcesAboutPerson, pageTiedToPerson } from "../../src/lib/audit/person-source-check";
import { answersBlock, answersNotAboutPerson } from "../../src/lib/audit/person-synthesis";
import type { PersonSynthesis } from "../../src/lib/audit/person-synthesis";

const answer = (providerId: string, providerLabel: string, citations: string[]) => ({
  providerId: providerId as "openai",
  providerLabel,
  model: "m",
  askedAt: "2026-09-21T08:00:00Z",
  ok: true,
  text: "An answer.",
  citations,
  usage: [],
});

const CHECK: AnswerCheck = {
  subject: { kind: "person", domain: "", brand: "Sergei Ponomarev", product: "Founder", category: "" },
  checkedAt: "2026-09-21T08:00:00.000Z",
  providers: [
    { id: "openai", label: "OpenAI", model: "gpt-4.1-mini" },
    { id: "anthropic", label: "Anthropic", model: "claude-haiku-4-5-20251001" },
    { id: "xai", label: "Grok", model: "grok-4.3" },
  ],
  results: [
    {
      fact: { id: "who", label: "who", blind: false, question: "Who?" },
      answers: [
        answer("openai", "OpenAI", ["https://aibusiness.vc/about", "https://www.malt.com/profile/sergeiponomarev"]),
        answer("anthropic", "Anthropic", ["https://en.wikipedia.org/wiki/Dmitry_Ponomarev_(businessman)"]),
        answer("xai", "Grok", ["https://aibusiness.vc/sergei-ponomarev", "https://bitcointalk.org/index.php?topic=1898960.0"]),
      ],
    },
  ],
};

function synthesis(overrides: Partial<PersonSynthesis> = {}): PersonSynthesis {
  return {
    identity: { summary: "s", facts: [] },
    professional: { summary: "s", roles: [], activity: [], activityNote: "" },
    redFlags: { flags: [], clear: [], caveats: [], reviews: [] },
    mixups: [],
    disagreements: [],
    coverage: [
      { provider: "OpenAI", questionId: "who", status: "found" },
      { provider: "Anthropic", questionId: "who", status: "mixed" },
      { provider: "Grok", questionId: "who", status: "found" },
    ],
    recommendations: [],
    ...overrides,
  };
}

test("only answers the model tied to the profile are printed; the fixed not-found rule wins", () => {
  const shown = answersAboutProfile(CHECK, synthesis());
  assert.deepEqual([...shown], ["who/openai", "who/xai"]);
  assert.deepEqual([...answersAboutProfile(CHECK, synthesis(), new Set(["who/openai"]))], ["who/xai"]);
});

const ANCHORS = anchorsFor({
  name: "Sergei Ponomarev",
  profileUrl: "https://www.linkedin.com/in/sergei-ponomarev",
  company: "AI Business",
  role: "Founder and editor",
  location: "Sveti Vlas, Bulgaria",
});

test("a page counts only when its text names the person in full next to a detail from the profile", () => {
  assert.equal(pageTiedToPerson("Sergei Ponomarev is the founder and editor of AI Business.", ANCHORS), true);
  assert.equal(pageTiedToPerson("Ponomarev, Sergei. Sveti Vlas, Bulgaria.", ANCHORS), true);
  // The name alone, or the name with another company: not this person.
  assert.equal(pageTiedToPerson("Sergei Ponomarev, kickboxer, won the final.", ANCHORS), false);
  assert.equal(pageTiedToPerson("Sergei Ponomarev of SONM did not pay the contributors.", ANCHORS), false);
  // The details without the full name: not enough either.
  assert.equal(pageTiedToPerson("AI Business is a publication in Sveti Vlas, Bulgaria.", ANCHORS), false);
});

test("a one-word role is too generic to tie a page", () => {
  const anchors = anchorsFor({ name: "Jane Doe", profileUrl: "https://x.com/jane", company: "", role: "Founder" });
  assert.deepEqual(anchors.details, []);
  assert.equal(pageTiedToPerson("Jane Doe, founder.", anchors), false);
});

test("the profile itself is trusted as given, whatever the country subdomain", () => {
  assert.equal(isTheProfile("https://bg.linkedin.com/in/sergei-ponomarev/", ANCHORS.profileUrl), true);
  assert.equal(isTheProfile("https://www.linkedin.com/in/sergei-ponomarev-phd-a629012a", ANCHORS.profileUrl), false);
});

test("sources are cut by what the pages say before anything else sees them, and the cut is counted", async () => {
  const pages: Record<string, string | null> = {
    "https://aibusiness.vc/about": "About. Sergei Ponomarev founded AI Business.",
    "https://www.malt.com/profile/sergeiponomarev": null,
    "https://en.wikipedia.org/wiki/Dmitry_Ponomarev_(businessman)": "Dmitry Ponomarev is a businessman.",
    "https://aibusiness.vc/sergei-ponomarev": "Sergei Ponomarev, Sveti Vlas, Bulgaria.",
    "https://bitcointalk.org/index.php?topic=1898960.0": "Sergei Ponomarev SONM scam warning.",
  };
  const read = async (address: string) => {
    if (address.includes("bitcointalk")) throw new Error("timeout");
    return pages[address] ?? null;
  };
  const checked = await keepSourcesAboutPerson(CHECK, ANCHORS, read);
  const [openai, anthropic, grok] = checked.results[0].answers;
  assert.deepEqual(openai.citations, ["https://aibusiness.vc/about"]);
  assert.equal(openai.heldCitations, 1);
  assert.deepEqual(anthropic.citations, []);
  assert.equal(anthropic.heldCitations, 1);
  assert.deepEqual(grok.citations, ["https://aibusiness.vc/sergei-ponomarev"]);
  assert.equal(grok.heldCitations, 1);
  assert.deepEqual([...verifiedSources(checked, new Set(["who/openai"]))], ["https://aibusiness.vc/about"]);
});

test("an answer whose model could not find the person never reaches the summary", () => {
  const lost: AnswerCheck = {
    ...CHECK,
    results: [
      {
        ...CHECK.results[0],
        answers: [
          { ...CHECK.results[0].answers[0], text: "Sergei Ponomarev founded AI Business." },
          {
            ...CHECK.results[0].answers[1],
            text: "I could not find any information about Sergei Ponomarev. A different Sergei Ponomarev was accused of fraud.",
          },
        ],
      },
    ],
  };
  const held = answersNotAboutPerson(lost);
  assert.ok(held.has("who/anthropic"));
  const block = answersBlock(lost, held);
  assert.doesNotMatch(block, /accused of fraud/);
  assert.doesNotMatch(block, /wikipedia/);
  assert.match(block, /held back/);
  assert.match(block, /founded AI Business/);
});

test("no reputation conclusion when a namesake came up or an answer could not be tied to the profile", () => {
  const all = synthesis({ coverage: CHECK.providers.map((p) => ({ provider: p.label, questionId: "who", status: "found" as const })) });
  assert.equal(identityAmbiguous(CHECK, all, answersAboutProfile(CHECK, all)), false);
  assert.equal(identityAmbiguous(CHECK, synthesis(), answersAboutProfile(CHECK, synthesis())), true);
  const namesake = { ...all, mixups: [{ who: "A kickboxer", saidBy: ["Grok"], links: [] }] };
  assert.equal(identityAmbiguous(CHECK, namesake, answersAboutProfile(CHECK, namesake)), true);
});

test("a cited page gets a human label", () => {
  assert.equal(sourceLabel("https://www.linkedin.com/in/sergei-ponomarev/"), "LinkedIn profile: sergei-ponomarev");
  assert.equal(
    sourceLabel("https://gy.linkedin.com/posts/sergei-ponomarev_impact-marketing-activity-704"),
    "LinkedIn post by sergei-ponomarev"
  );
  assert.equal(sourceLabel("https://aibusiness.vc/sergei-ponomarev"), "aibusiness.vc/sergei-ponomarev");
  assert.equal(sourceLabel("https://www.linkedin.com/in/%D0%B0%D0%BD%D0%B0"), "LinkedIn profile: ана");
});

test("Claude's words before it searches are not part of the answer", () => {
  assert.equal(
    anthropicAnswerText([
      { type: "text", text: "I'll search for information about him." },
      { type: "server_tool_use" },
      { type: "web_search_tool_result" },
      { type: "text", text: "Based on the results, " },
      { type: "text", text: "he is an editor." },
    ]),
    "Based on the results, he is an editor."
  );
  assert.equal(anthropicAnswerText([{ type: "text", text: "No search was needed." }]), "No search was needed.");
});

/** Grok's real answer from the 21.09 test order, the part about namesakes. */
const GROK_NAMESAKES =
  "No significant red flags were found about Sergei Ponomarev of AI Business. Targeted searches for terms like scam, fraud, " +
  "controversy, review, complaint, or dispute primarily surfaced unrelated people sharing similar names (e.g., a 2017 BitcoinTalk " +
  "warning about a different Sergei Ponomarev linked to the SONM crypto project and non-payment/fraud allegations involving others; " +
  "Russian data-broker investigations involving a Ponomaryov; sanctioned missile-industry figures).";

test("an answer that tells of other people's trouble is withheld whole, from the summary and from the report", () => {
  const withGrok: AnswerCheck = {
    ...CHECK,
    results: [
      {
        fact: { id: "reputation", label: "reputation", blind: false, question: "Red flags?" },
        answers: [
          { ...CHECK.results[0].answers[0], text: "No red flags were found about Sergei Ponomarev of AI Business." },
          { ...CHECK.results[0].answers[2], text: GROK_NAMESAKES },
        ],
      },
    ],
  };
  const all = synthesis({
    coverage: [
      { provider: "OpenAI", questionId: "reputation", status: "found" },
      { provider: "Grok", questionId: "reputation", status: "found" },
    ],
  });
  const shown = answersAboutProfile(withGrok, all);
  assert.deepEqual([...shown], ["reputation/openai"]);
  assert.equal(identityAmbiguous(withGrok, all, shown), true, "a withheld answer means no reputation conclusion");
  const block = answersBlock(withGrok, answersNotAboutPerson(withGrok));
  for (const word of ["SONM", "fraud", "non-payment", "BitcoinTalk", "Ponomaryov", "missile"]) {
    assert.doesNotMatch(block, new RegExp(word, "i"), `${word} must not reach the summary`);
  }
  // An answer that only says nothing was found is kept.
  assert.equal(mentionsOthersTrouble("No disputes or scandals were found about her."), false);
});
