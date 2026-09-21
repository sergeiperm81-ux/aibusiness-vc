/**
 * What the person report may print, and what it holds back.
 * No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { AnswerCheck } from "../../src/lib/audit/answer-check";
import { anthropicAnswerText } from "../../src/lib/audit/answer-providers";
import {
  answersAboutProfile,
  corroboratedHosts,
  identityAmbiguous,
  sourceLabel,
  sourceTiedToProfile,
  splitSources,
} from "../../src/lib/audit/person-report-safety";
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

test("a site counts as this person's only when two models cited it in answers about them", () => {
  const hosts = corroboratedHosts(CHECK, answersAboutProfile(CHECK, synthesis()));
  assert.deepEqual([...hosts], ["aibusiness.vc"]);
});

test("a page is listed only when its address ties it to the profile", () => {
  const filter = { name: "Sergei Ponomarev", profileUrl: "https://www.linkedin.com/in/sergei-ponomarev", hosts: new Set(["aibusiness.vc"]) };
  assert.equal(sourceTiedToProfile("https://aibusiness.vc/notes", filter), true);
  assert.equal(sourceTiedToProfile("https://www.malt.com/profile/sergeiponomarev", filter), true);
  assert.equal(sourceTiedToProfile("https://bg.linkedin.com/in/sergei-ponomarev", filter), true);
  // A namesake's profile, a namesake's scandal, a forum thread: not listed.
  assert.equal(sourceTiedToProfile("https://www.linkedin.com/in/sergey-ponomarev-6033a7219/", filter), false);
  assert.equal(sourceTiedToProfile("https://rabble.ca/politics/ilya-ponomarev-opposing", filter), false);
  assert.equal(sourceTiedToProfile("https://bitcointalk.org/index.php?topic=1898960.0", filter), false);
  // A network is never trusted as a whole.
  assert.equal(sourceTiedToProfile("https://www.linkedin.com/in/someone-else", { ...filter, hosts: new Set(["linkedin.com"]) }), false);
  assert.deepEqual(splitSources(["https://aibusiness.vc/", "https://en.wikipedia.org/wiki/Sergei_Leonov"], filter), {
    shown: ["https://aibusiness.vc/"],
    held: 1,
  });
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
