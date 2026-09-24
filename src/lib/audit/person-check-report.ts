/**
 * The person report, as markdown.
 *
 * Same spine as the company report, with the company-only parts left out
 * (structured data has no meaning for a profile) and one part added: what to
 * publish, drafted from the person's own words. The drafts are labelled as
 * drafts. Everything measured stays measured.
 */

import type { AnswerCheck, FactResult } from "./answer-check";
import type { AnalysedAnswer, Claim } from "./answer-analysis";
import { contradictions, ownerQuestions } from "./answer-analysis";
import {
  analysisFor,
  cell,
  mixedEntityDomains,
  judgedNotFound,
  notIdentified,
  otherEntityOf,
  quote,
  rowVerdict,
  signalFor,
  statusLabel,
  type AnswerSignals,
} from "./answer-check-report";
import type { PersonFacts } from "./person-facts";
import { unsupportedTerms, type PublishDraft } from "./person-rewrite";

function namePattern(check: AnswerCheck): RegExp {
  const parts = [check.subject.brand, check.subject.profileUrl ?? ""]
    .filter((s) => s.trim().length > 0)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(parts.join("|"), "i");
}

export function renderPersonCheckMarkdown(
  check: AnswerCheck,
  facts: PersonFacts,
  analyses: readonly AnalysedAnswer[],
  signals: readonly AnswerSignals[],
  draft: PublishDraft | null,
  draftError?: string
): string {
  const date = check.checkedAt.slice(0, 10);
  const name = check.subject.brand;
  const named = check.results.filter((r) => !r.fact.blind);
  const blind = check.results.find((r) => r.fact.blind);
  const received = check.results.flatMap((r) => r.answers).filter((a) => a.ok).length;
  const expected = check.results.length * check.providers.length;
  const out: string[] = [];

  const misses = named.flatMap((row) =>
    row.answers
      .filter((a) => a.ok)
      .map((answer) => {
        const signal = signalFor(signals, row.fact.id, answer.providerId);
        const analysis = analysisFor(analyses, row.fact.id, answer.providerId);
        return { row, answer, signal, other: otherEntityOf(signal, analysis), judged: judgedNotFound(analysis) };
      })
      .filter((m) => m.signal?.nonAnswer.notFound || m.judged || m.other)
  );
  const contaminations = named.flatMap((row) =>
    row.answers.flatMap((answer) => {
      if (!answer.ok) return [];
      const domains = mixedEntityDomains(signalFor(signals, row.fact.id, answer.providerId));
      return domains.length > 0 ? [{ row, answer, domains }] : [];
    })
  );

  out.push(`# What AI assistants say about ${name}`);
  out.push("");
  out.push(`**${name} · ${check.subject.product} · ${check.subject.profileUrl ?? ""} · checked ${date}**`);
  out.push("");

  /* ------------------------------------ 1. What was asked, and what was read */

  out.push("## 1. What was asked, and what was read");
  out.push("");
  out.push(
    `Two assistants, six questions, one fresh request per question. ${received} of ${expected} answers were received.`
  );
  out.push("");
  out.push("| System | Model | Interface |");
  out.push("| --- | --- | --- |");
  for (const provider of check.providers) {
    out.push(`| ${provider.label} | ${provider.model} | API, web search on |`);
  }
  out.push("");
  out.push(
    "**What this is, exactly.** These are the OpenAI and Anthropic APIs with web search " +
      "enabled, not the ChatGPT and Claude apps. The apps add their own instructions and " +
      "remember individual users, so two people can be shown two different answers."
  );
  out.push("");
  out.push(
    "**How you were identified to them.** By name, role, company and your public profile " +
      "address, in every question except the last. That is what a client who has your card " +
      "would type."
  );
  out.push("");
  out.push(
    "**What the answers were compared against.** What you state about yourself: the details " +
      "you gave, your public profile where it could be read without logging in, and your " +
      "company's site where you have one. Nothing was read with a login."
  );
  out.push("");
  out.push("Read as the reference:");
  out.push(`- What you stated in the form: read.`);
  out.push(`- ${facts.profile.url}: ${facts.profile.note}.`);
  const sitePages = facts.pages.filter(
    (p) => p.url !== facts.profile.url && p.url !== "what the person states about themselves"
  );
  if (sitePages.length > 0) {
    for (const page of sitePages) {
      const shortened = facts.shortened.includes(page.url);
      const note = !page.ok ? " (did not respond)" : shortened ? " (shortened to fit)" : "";
      out.push(`- ${page.url}${note}`);
    }
  } else {
    out.push("- No company site was given, so none was read.");
  }
  out.push("");
  out.push(
    "**How the verdicts were reached.** Whether an answer failed to find you is detected by " +
      "fixed rules and shown with the evidence. Everything else was compared against the " +
      "reference by a model, not by hand: treat those verdicts as a careful reading, not a ruling."
  );
  out.push("");
  out.push("The six questions, verbatim:");
  for (const result of check.results) out.push(`- ${result.fact.question}`);
  out.push("");

  /* ---------------------- 2. Whether they found you, and where they disagree */

  out.push("## 2. Whether they found you, and where they disagree with what you state");
  out.push("");

  if (misses.length > 0) {
    out.push("### Where you were not identified at all");
    out.push("");
    const others = misses.filter((m) => m.other);
    const notFound = misses.filter((m) => !m.other && (m.signal?.nonAnswer.notFound || m.judged));
    if (others.length > 0) {
      out.push("**Described someone else instead of you:**");
      out.push("");
      for (const m of others) {
        out.push(
          `- ${m.row.fact.label}, ${m.answer.providerLabel}: ${m.other?.evidence}` +
            (m.other?.modelAssisted ? " (a model's reading)." : ".")
        );
      }
      out.push("");
    }
    if (notFound.length > 0) {
      out.push("**Could not find you and asked for more details:**");
      out.push("");
      for (const m of notFound) {
        out.push(
          m.signal?.nonAnswer.notFound
            ? `- ${m.row.fact.label}, ${m.answer.providerLabel}: it said "${m.signal.nonAnswer.signals[0]}".`
            : `- ${m.row.fact.label}, ${m.answer.providerLabel}: it found no specific information about you (a model's reading).`
        );
      }
      out.push("");
    }
    out.push(
      "Statements from these answers are not listed as contradictions below. They are about " +
        "someone else, or about nothing."
    );
    out.push("");
  }

  if (contaminations.length > 0) {
    out.push("### Where a correct answer also used a lookalike source");
    out.push("");
    for (const item of contaminations) {
      out.push(
        `- ${item.row.fact.label}, ${item.answer.providerLabel}: it cited your own domain and also ${item.domains.join(", ")}. ` +
          "The answer is analysed below; the foreign source is contamination, not proof that the whole answer describes someone else."
      );
    }
    out.push("");
  }

  const header = ["Question", ...check.providers.map((p) => p.label)];
  out.push(`| ${header.join(" | ")} |`);
  out.push(`| ${header.map(() => "---").join(" | ")} |`);
  for (const row of named) {
    out.push(
      `| ${[row.fact.label, ...check.providers.map((p) => rowVerdict(row, p.id, analyses, signals))].join(" | ")} |`
    );
  }
  out.push("");
  out.push(
    "*Confirmed*: what you state says the same. *Contradicts*: what you state says something " +
      "different, in words that can be quoted; *outdated* means a newer version of the same fact. " +
      "*Could not be verified*: what you state does not settle it, so only you can. " +
      "*Described another entity* and *did not find you*: see above."
  );
  out.push("");

  const flagged = named.flatMap((row) =>
    check.providers.flatMap((p) => {
      const analysis = analysisFor(analyses, row.fact.id, p.id);
      const signal = signalFor(signals, row.fact.id, p.id);
      if (!analysis?.ok || notIdentified(signal, analysis)) return [];
      return analysis.claims
        .filter((c) => c.status === "contradicted")
        .map((claim) => ({ fact: row.fact.label, provider: p.label, claim }));
    })
  );

  if (flagged.length > 0) {
    out.push("### Every contradiction");
    out.push("");
    out.push("| Question | System | Statement | Verdict | You state |");
    out.push("| --- | --- | --- | --- | --- |");
    for (const item of flagged) {
      out.push(
        `| ${cell(item.fact)} | ${item.provider} | ${cell(item.claim.claim)} | ${statusLabel(item.claim).replace("your site", "what you state")} | ${cell(item.claim.siteSays ?? "")} |`
      );
    }
    out.push("");
  } else {
    out.push("No statement in an answer that identified you contradicts what you state.");
    out.push("");
  }

  if (blind) {
    out.push("### The question that never says your name");
    out.push("");
    out.push(`Asked: *${blind.fact.question}*`);
    out.push("");
    const pattern = namePattern(check);
    for (const answer of blind.answers) {
      const verdict = !answer.ok
        ? "no answer received"
        : pattern.test(answer.text)
          ? "you appear"
          : "you do not appear";
      out.push(`**${answer.providerLabel}:** ${verdict}`);
      out.push("");
    }
    out.push(
      "This is measured and not promised to change. The full answers, including who was " +
        "named instead, are in part 4. Names returned here are unverified and are not a competitor list."
    );
    out.push("");
  }

  /* ------------------------------------------------------ 3. What to publish */

  out.push("## 3. What to publish");
  out.push("");

  const entities = new Map<string, string[]>();
  for (const m of misses) {
    if (!m.other) continue;
    const questions = entities.get(m.other.label) ?? [];
    entities.set(m.other.label, [...questions, `${m.row.fact.label} (${m.answer.providerLabel})`]);
  }
  if (entities.size > 0) {
    out.push("### First: strengthen the canonical identity");
    out.push("");
    out.push(
      "Do not publish a denial merely because one answer used a similar domain. Put the exact name, role, " +
        "canonical company domain and public-profile links together on the page a reader checks first. " +
        "Only consider an explicit disambiguation after the same full-entity confusion recurs across independent checks."
    );
    out.push("");
    let index = 0;
    for (const [label, questions] of entities) {
      index += 1;
      out.push(`**${index}. You are being confused with ${label}.** Found in: ${questions.join("; ")}.`);
      out.push(`- Canonical identity to reinforce: ${name}, ${check.subject.product}, ${check.subject.domain}.`);
      out.push("");
    }
  }

  const notFoundCount = misses.filter((m) => !m.other && (m.signal?.nonAnswer.notFound || m.judged)).length;
  if (notFoundCount > 0) {
    out.push(`### ${notFoundCount === 1 ? "One answer" : `${notFoundCount} answers`} could not find you`);
    out.push("");
    out.push(
      "An assistant that cannot find you by name, role and profile address has nothing to " +
        "read. The drafts below give it something."
    );
    out.push("");
  }

  const identified = analyses.filter((a) => {
    const signal = signalFor(signals, a.factId, a.providerId);
    return named.some((row) => row.fact.id === a.factId) && !notIdentified(signal, a);
  });
  const fixes = contradictions(identified).filter((c) => c.replacement);
  const questions = ownerQuestions(identified);

  out.push("### Contradictions with what you state");
  out.push("");
  if (fixes.length === 0) {
    out.push("None to correct from your own words.");
  } else {
    out.push("Most consequential first. Each is a replacement, taken from your own words, never a deletion.");
    out.push("");
    fixes.forEach((claim: Claim, i: number) => {
      out.push(`**${i + 1}. ${claim.claim}** (${claim.severity})`);
      out.push("");
      if (claim.siteSays) out.push(`- You already state: ${cell(claim.siteSays)}`);
      out.push(`- What to write, where a client would look first: ${claim.replacement}`);
      out.push("");
    });
  }
  out.push("");

  out.push("### What only you can confirm");
  out.push("");
  if (questions.length === 0) {
    out.push("Nothing outstanding.");
  } else {
    out.push("What you state does not settle these, so nobody else can. No correction is invented for them.");
    out.push("");
    for (const claim of questions) {
      out.push(`- **${cell(claim.claim)}** (${claim.severity}) — ${claim.ownerCheck}`);
    }
  }
  out.push("");

  out.push("### Drafts, from your own words");
  out.push("");
  if (!draft) {
    out.push(`No drafts: the writing step failed (${draftError ?? "unknown error"}). Everything above stands.`);
    out.push("");
  } else {
    out.push(
      "Written by a model from the reference text only, to give the assistants a correct " +
        "sentence to read. Drafts, not findings: edit before publishing, and cut anything that is not true."
    );
    out.push("");
    const unchecked = unsupportedTerms(draft, facts.reference);
    if (unchecked.length > 0) {
      out.push(
        `**Check before publishing.** These words in the drafts do not appear in your own text: ${unchecked.join(", ")}. ` +
          "Keep them only if they are true."
      );
      out.push("");
    }
    out.push("**LinkedIn headline**");
    out.push("");
    out.push(quote(draft.headline));
    out.push("");
    out.push("**LinkedIn About**");
    out.push("");
    out.push(quote(draft.about));
    out.push("");
    if (draft.postTopics.length > 0) {
      out.push("**Three posts that would give the assistants a source**");
      out.push("");
      draft.postTopics.forEach((topic, i) => {
        out.push(`${i + 1}. **${topic.title}.** ${topic.why}`);
      });
      out.push("");
    }
    if (draft.siteLines.length > 0) {
      out.push("**Three lines for your site or profile**");
      out.push("");
      for (const line of draft.siteLines) out.push(`- ${line}`);
      out.push("");
    }
  }

  /* --------------------------------------- 4. Every answer, word for word */

  out.push("## 4. Every answer, word for word");
  out.push("");
  out.push(`${check.results.length} questions x ${check.providers.length} systems. Unedited.`);
  out.push("");
  for (const row of check.results) {
    out.push(`### ${row.fact.label}${row.fact.blind ? " (your name never used)" : ""}`);
    out.push("");
    out.push(`Asked: *${row.fact.question}*`);
    out.push("");
    for (const answer of row.answers) {
      out.push(`**${answer.providerLabel}**, ${answer.model}, ${answer.askedAt.slice(0, 16).replace("T", " ")} UTC`);
      out.push("");
      if (!answer.ok) {
        out.push(`No answer received after retries: ${answer.error ?? "request failed"}`);
        out.push("");
        continue;
      }
      out.push(quote(answer.text));
      out.push("");
      out.push(
        answer.citations.length > 0
          ? `Pages it cited for this answer:\n${answer.citations.slice(0, 12).map((u) => `- ${u}`).join("\n")}`
          : "It cited no pages for this answer."
      );
      out.push("");
    }
  }

  /* ------------------------------------------------------- 5. The script */

  out.push("## 5. The script, so you can do it again without me");
  out.push("");
  out.push(
    "Open each assistant in a new chat, paste one question, copy the answer with the date, " +
      "and never ask two questions in the same chat: the first answer feeds the second."
  );
  out.push("");
  check.results.forEach((result, i) => out.push(`${i + 1}. ${result.fact.question}`));
  out.push("");
  out.push(`Expect different wording each time. This reading was taken on ${date}.`);
  out.push("");

  return out.join("\n");
}

/** The blind-question answers, for the writer to see who was named instead. */
export function blindAnswerTexts(check: AnswerCheck): readonly string[] {
  const blind: FactResult | undefined = check.results.find((r) => r.fact.blind);
  return (blind?.answers ?? []).filter((a) => a.ok).map((a) => `${a.providerLabel}: ${a.text}`);
}
