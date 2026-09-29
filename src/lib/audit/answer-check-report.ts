/**
 * The report, as markdown, in the six parts the product page promises, plus
 * the free preview a visitor sees before paying.
 *
 * Order is deliberate. Whether the assistants identified the client at all
 * comes first, because an answer about someone else is not a set of errors to
 * correct one by one. Then the verdicts, then the transcript that backs them.
 *
 * The fix list never contains a "delete this" line, only "replace it with
 * this". A price removed from our own site weeks earlier still came back in an
 * assistant's answer: an index needs a replacing statement, not a gap.
 */

import type { AnswerCheck, FactResult } from "./answer-check";
import type { AnalysedAnswer, Claim } from "./answer-analysis";
import { contradictions, headlineContradiction, ownerQuestions } from "./answer-analysis";
import {
  detectEntityMismatch,
  detectNonAnswer,
  type EntitySignal,
  type NonAnswerSignal,
} from "./answer-signals";
import type { SiteFacts } from "./site-facts";

/** What the deterministic checks found in one answer, before any judge. */
export interface AnswerSignals {
  readonly factId: string;
  readonly providerId: string;
  readonly nonAnswer: NonAnswerSignal;
  readonly entity: EntitySignal;
}

const NO_SIGNAL: NonAnswerSignal = { notFound: false, signals: [] };
const NO_ENTITY: EntitySignal = { ownDomainPresent: false, lookalikeDomains: [], foreignEmailDomains: [] };

/** Runs the deterministic checks over every answer. The blind question is never a non-answer. */
export function computeAnswerSignals(check: AnswerCheck): readonly AnswerSignals[] {
  return check.results.flatMap((row) =>
    row.answers.map((answer) => ({
      factId: row.fact.id,
      providerId: answer.providerId,
      nonAnswer: answer.ok && !row.fact.blind ? detectNonAnswer(answer.text, check.subject) : NO_SIGNAL,
      // A person without a company domain has no domain to look like, and the
      // emails in an answer about them are not evidence of anything.
      entity:
        answer.ok && check.subject.domain.trim().length > 0
          ? detectEntityMismatch(check.subject.domain, answer.text, answer.citations)
          : NO_ENTITY,
    }))
  );
}

const STATUS_LABEL: Record<Claim["status"], string> = {
  confirmed: "confirmed by your site",
  contradicted: "contradicts your site",
  unverified: "could not be verified",
};

export function statusLabel(claim: Claim): string {
  if (claim.status !== "contradicted") return STATUS_LABEL[claim.status];
  return claim.kind === "outdated" ? "contradicts your site (outdated)" : "contradicts your site";
}

export function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\s*\n+\s*/g, " ").trim();
}

export function quote(text: string): string {
  return "> " + text.trim().replace(/\n/g, "\n> ");
}

export function analysisFor(
  analyses: readonly AnalysedAnswer[],
  factId: string,
  providerId: string
): AnalysedAnswer | undefined {
  return analyses.find((a) => a.factId === factId && a.providerId === providerId);
}

export function signalFor(
  signals: readonly AnswerSignals[],
  factId: string,
  providerId: string
): AnswerSignals | undefined {
  return signals.find((s) => s.factId === factId && s.providerId === providerId);
}

export interface OtherEntity {
  readonly label: string;
  readonly evidence: string;
  /** False when the evidence is a domain in the answer; true when it is only the judge's reading. */
  readonly modelAssisted: boolean;
}

/**
 * Whether an answer describes some other entity, and on what evidence.
 *
 * A lookalike domain in the answer is hard evidence and wins. The judge's
 * sameEntity flag is used only when there is no such domain, and is labelled
 * as a model's reading.
 */
/** Labels a judge gives when it cannot name who the answer is about. */
const VAGUE_OTHER =
  /\b(?:no (?:specific )?(?:data|information)|similar names?|unknown|unclear|not (?:found|identified)|unidentified|generic|unspecified)\b/i;

/**
 * The judge read the answer as not about the subject, but named nobody in
 * particular. That is a failure to find the subject, not a confusion with
 * someone: the second person test produced "You are being confused with
 * Person(s) with similar name or no specific data", which is no finding at all.
 */
export function judgedNotFound(analysis?: AnalysedAnswer): boolean {
  if (!analysis?.ok || analysis.sameEntity !== false) return false;
  return !analysis.otherEntity || VAGUE_OTHER.test(analysis.otherEntity);
}

export function otherEntityOf(signal?: AnswerSignals, analysis?: AnalysedAnswer): OtherEntity | null {
  if (signal && signal.entity.lookalikeDomains.length > 0 && !signal.entity.ownDomainPresent) {
    const domains = signal.entity.lookalikeDomains.join(", ");
    return {
      label: domains,
      evidence: `the answer cites or quotes ${domains}, which resembles your domain but is not it`,
      modelAssisted: false,
    };
  }
  if (analysis?.ok && analysis.sameEntity === false && !judgedNotFound(analysis)) {
    const label = analysis.otherEntity ?? "a different entity with a similar name";
    return { label, evidence: `the judge read the answer as describing ${label}`, modelAssisted: true };
  }
  return null;
}

/** A wrong lookalike source appeared alongside the client's own domain. */
export function mixedEntityDomains(signal?: AnswerSignals): readonly string[] {
  if (!signal?.entity.ownDomainPresent) return [];
  return signal.entity.lookalikeDomains;
}

export function notIdentified(signal?: AnswerSignals, analysis?: AnalysedAnswer): boolean {
  return Boolean(signal?.nonAnswer.notFound) || judgedNotFound(analysis) || otherEntityOf(signal, analysis) !== null;
}

export function rowVerdict(
  row: FactResult,
  providerId: string,
  analyses: readonly AnalysedAnswer[],
  signals: readonly AnswerSignals[]
): string {
  const answer = row.answers.find((a) => a.providerId === providerId);
  if (!answer?.ok) return "no answer received";
  const signal = signalFor(signals, row.fact.id, providerId);
  if (signal?.nonAnswer.notFound) return "did not find you";
  const analysis = analysisFor(analyses, row.fact.id, providerId);
  if (judgedNotFound(analysis)) return "did not find you";
  if (otherEntityOf(signal, analysis)) return "described another entity";
  if (!analysis?.ok) return "not analysed";
  const contradicted = analysis.claims.filter((c) => c.status === "contradicted").length;
  const unverified = analysis.claims.filter((c) => c.status === "unverified").length;
  if (contradicted > 0) return contradicted === 1 ? "1 contradiction" : `${contradicted} contradictions`;
  if (unverified > 0) return unverified === 1 ? "1 point unverified" : `${unverified} points unverified`;
  return analysis.claims.length > 0 ? "confirmed" : "nothing checkable";
}

function brandPattern(check: AnswerCheck): RegExp {
  return new RegExp(
    [check.subject.brand, check.subject.domain]
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "i"
  );
}

export function renderAnswerCheckMarkdown(
  check: AnswerCheck,
  facts: SiteFacts,
  analyses: readonly AnalysedAnswer[],
  signals: readonly AnswerSignals[]
): string {
  const date = check.checkedAt.slice(0, 10);
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

  out.push(`# What AI assistants say about ${check.subject.brand}`);
  out.push("");
  out.push(`**${check.subject.domain} · ${check.subject.brand} · ${check.subject.product} · checked ${date}**`);
  out.push("");

  /* ---------------------------------------------- 1. What was asked, and when */

  out.push("## 1. What was asked, and when");
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
    "**What repeating it means.** You can put the same questions to the same systems again " +
      "with the script in part 6. You will not get the same words back: these systems do " +
      "not answer identically twice. Compare the substance of a later reading, not the wording."
  );
  out.push("");
  out.push(
    "**What is not covered.** Two systems, not a survey of all of them. One reading, dated. " +
      "Nothing after it is measured, so nothing after it is claimed."
  );
  out.push("");
  out.push(
    "**How the verdicts were reached.** Two kinds of check. Whether an answer failed to find " +
      "you, or cited a domain that resembles yours, is detected by fixed rules and shown with " +
      "the evidence. Everything else was compared against the readable text of your own " +
      "pages by a model, not by hand: treat those verdicts as a careful reading, not a ruling."
  );
  out.push("");
  out.push("Pages read as the reference:");
  for (const page of facts.pages) {
    const shortened = facts.shortened.includes(page.url);
    const note = !page.ok ? " (did not respond)" : shortened ? " (shortened to fit)" : "";
    out.push(`- ${page.url}${note}`);
  }
  out.push("");
  out.push("The six questions, verbatim:");
  for (const result of check.results) out.push(`- ${result.fact.question}`);
  out.push("");

  /* ------------------------------------ 2. Where it disagrees with your site */

  out.push("## 2. Where it disagrees with your site");
  out.push("");

  if (misses.length > 0) {
    out.push("### Where you were not identified at all");
    out.push("");
    const others = misses.filter((m) => m.other);
    const notFound = misses.filter((m) => !m.other && (m.signal?.nonAnswer.notFound || m.judged));
    if (others.length > 0) {
      out.push("**Described another entity instead of you:**");
      out.push("");
      for (const m of others) {
        out.push(
          `- ${m.row.fact.label}, ${m.answer.providerLabel}: ${m.other?.evidence}` +
            (m.other?.modelAssisted ? " (a model's reading, not domain evidence)." : ".")
        );
      }
      out.push("");
    }
    if (notFound.length > 0) {
      out.push("**Could not find you by name and asked for more details:**");
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
        "someone else, or about nothing, and correcting them one by one would miss the point."
    );
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
    "*Confirmed by your site*: your pages say the same. *Contradicts your site*: your pages " +
      "say something different, in words that can be quoted; *outdated* means they show a " +
      "newer version. *Could not be verified*: your pages do not settle it, so only you can. " +
      "*Described another entity* and *did not find you*: see above. *No answer received*: " +
      "the request failed after retries."
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
    out.push("| Question | System | Statement | Verdict | Your site says |");
    out.push("| --- | --- | --- | --- | --- |");
    for (const item of flagged) {
      out.push(
        `| ${cell(item.fact)} | ${item.provider} | ${cell(item.claim.claim)} | ${statusLabel(item.claim)} | ${cell(item.claim.siteSays ?? "")} |`
      );
    }
    out.push("");
  } else {
    out.push("No statement in an answer that identified you contradicts your site.");
    out.push("");
  }

  if (blind) {
    out.push("### The question that never says your name");
    out.push("");
    out.push(`Asked: *${blind.fact.question}*`);
    out.push("");
    const pattern = brandPattern(check);
    for (const answer of blind.answers) {
      const verdict = !answer.ok
        ? "no answer received"
        : pattern.test(answer.text)
          ? "you appear"
          : "you do not appear";
      out.push(`**${answer.providerLabel}:** ${verdict}`);
      const lookalikes = signalFor(signals, blind.fact.id, answer.providerId)?.entity.lookalikeDomains ?? [];
      if (answer.ok && lookalikes.length > 0) {
        out.push(`It named ${lookalikes.join(", ")}, which resembles your domain.`);
      }
      out.push("");
    }
    out.push(
      "We measure this and we do not promise to change it. The full answers, including who " +
        "was named instead, are in part 5."
    );
    out.push("");
  }

  /* ------------------------------------ 3. Where each statement comes from */

  out.push("## 3. Where each statement comes from");
  out.push("");
  out.push(
    "An assistant lists the pages it cited for an answer as a whole. That list does not say " +
      "which link produced which sentence, so no single statement below is proven to come " +
      "from any single page. What it does show is whether your own pages were in front of " +
      "the assistant when it answered."
  );
  out.push("");
  const own = new RegExp(check.subject.domain.replace(/\./g, "\\."), "i");
  let anyTrace = false;
  for (const row of named) {
    for (const answer of row.answers) {
      if (!answer.ok) continue;
      const analysis = analysisFor(analyses, row.fact.id, answer.providerId);
      const signal = signalFor(signals, row.fact.id, answer.providerId);
      if (notIdentified(signal, analysis)) continue;
      const contradictedHere = analysis?.claims.filter((c) => c.status === "contradicted") ?? [];
      if (contradictedHere.length === 0) continue;
      anyTrace = true;
      const mine = answer.citations.filter((url) => own.test(url));
      const theirs = answer.citations.filter((url) => !own.test(url));
      out.push(`**${row.fact.label}, ${answer.providerLabel}**`);
      out.push("");
      out.push(
        mine.length > 0
          ? `Your pages it cited for this answer: ${mine.slice(0, 6).join(", ")}`
          : "No supporting source from your site was given in this answer. That does not show where the statement came from: the assistant may have answered from memory, or its search may have returned nothing."
      );
      if (theirs.length > 0) out.push(`Other pages it cited: ${theirs.slice(0, 6).join(", ")}`);
      out.push("");
      for (const claim of contradictedHere) {
        out.push(`- ${cell(claim.claim)} — your site says otherwise on ${claim.siteSaysOn ?? "a page read"}`);
      }
      out.push("");
    }
  }
  if (!anyTrace) {
    out.push("No contradictions in answers that identified you, so there is nothing to trace.");
    out.push("");
  }

  /* ------------------------------------------- 4. What to change, in order */

  out.push("## 4. What to change, in order");
  out.push("");

  const entities = new Map<string, string[]>();
  for (const m of misses) {
    if (!m.other) continue;
    const questions = entities.get(m.other.label) ?? [];
    entities.set(m.other.label, [...questions, `${m.row.fact.label} (${m.answer.providerLabel})`]);
  }
  const aboutPage = facts.pages.find((p) => p.ok && /\/about/i.test(p.url))?.url;

  if (entities.size > 0) {
    out.push("### First: say who you are not");
    out.push("");
    out.push(
      "One correction per entity you are confused with, instead of one per wrong statement. " +
        "Write it only if it is true: this report cannot know whether you have a connection."
    );
    out.push("");
    let index = 0;
    for (const [label, questions] of entities) {
      index += 1;
      out.push(`**${index}. You are being confused with ${label}.**`);
      out.push("");
      out.push(`- Found in: ${questions.join("; ")}`);
      out.push(`- Where: ${aboutPage ?? "the page a reader checks first to learn who you are"}`);
      out.push(
        `- What to write, only if there is no connection: "${check.subject.brand} (${check.subject.domain}) is not affiliated with ${label}."`
      );
      out.push("");
    }
  }

  const notFoundCount = misses.filter((m) => !m.other && (m.signal?.nonAnswer.notFound || m.judged)).length;
  if (notFoundCount > 0) {
    out.push(`### ${notFoundCount === 1 ? "One answer" : `${notFoundCount} answers`} could not find you by name`);
    out.push("");
    out.push(
      "They are listed in part 2. This report does not measure why an assistant fails to find " +
        "a site, so it proposes no correction for it."
    );
    out.push("");
  }

  const identifiedAnalyses = analyses.filter((a) => {
    const signal = signalFor(signals, a.factId, a.providerId);
    return named.some((row) => row.fact.id === a.factId) && !notIdentified(signal, a);
  });
  const fixes = contradictions(identifiedAnalyses).filter((c) => c.replacement);
  const questions = ownerQuestions(identifiedAnalyses);

  out.push("### Contradictions with your own pages");
  out.push("");
  if (fixes.length === 0) {
    out.push("None to correct from your own text.");
  } else {
    out.push(
      "Most consequential first. The replacement wording comes from your site and not from a " +
        "guess. Each is a replacement, never a deletion."
    );
    out.push("");
    fixes.forEach((claim: Claim, i: number) => {
      out.push(`**${i + 1}. ${claim.claim}** (${claim.severity})`);
      out.push("");
      if (claim.siteSays) out.push(`- Your site already says: ${cell(claim.siteSays)}`);
      out.push(`- Where to say it plainly: ${claim.siteSaysOn ?? "the page a reader would check for this"}`);
      out.push(`- What to write: ${claim.replacement}`);
      out.push("");
    });
  }
  out.push("");

  out.push("### What only you can confirm");
  out.push("");
  if (questions.length === 0) {
    out.push("Nothing outstanding.");
  } else {
    out.push(
      "Your site does not settle these either way, so nobody outside your company can say " +
        "whether they are true. No correction is invented for them."
    );
    out.push("");
    for (const claim of questions) {
      out.push(`- **${cell(claim.claim)}** (${claim.severity}) — ${claim.ownerCheck}`);
    }
  }
  out.push("");

  out.push("### One technical note, separate from the above");
  out.push("");
  out.push(
    "Your structured data is the one place a machine reads without interpreting prose. It " +
      "is not the truth about your company, and a gap here is not an error."
  );
  out.push("");
  const markupRows: readonly [string, string | null][] = [
    ["organisation name", facts.markup.name],
    ["description", facts.markup.description],
    ["country", facts.markup.country],
    ["city", facts.markup.locality],
    ["founder", facts.markup.founder],
    ["contact", facts.markup.contact],
    ["an offer of any kind", facts.markup.declaresOffer ? "declared" : null],
  ];
  out.push("| Field | On your home page's structured data |");
  out.push("| --- | --- |");
  for (const [field, value] of markupRows) {
    out.push(`| ${field} | ${value ? cell(value) : "not declared"} |`);
  }
  out.push("");

  /* ------------------------------------- 5. Every answer, word for word */

  out.push("## 5. Every answer, word for word");
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

  /* ------------------------------------------------------- 6. The script */

  out.push("## 6. The script, so you can do it again without me");
  out.push("");
  out.push(
    "Open each assistant in a new chat, paste one question, copy the answer with the date, " +
      "and never ask two questions in the same chat: the first answer feeds the second."
  );
  out.push("");
  check.results.forEach((result, i) => out.push(`${i + 1}. ${result.fact.question}`));
  out.push("");
  out.push(
    "Then check first whether each answer is about you at all. Only for the ones that are, " +
      "put the answer beside your own page and mark it confirmed, contradicts, or could not " +
      "be verified."
  );
  out.push("");
  out.push(`Expect different wording each time. This reading was taken on ${date}.`);
  out.push("");

  return out.join("\n");
}

/**
 * What a visitor sees before paying.
 *
 * Both answers to the first question in full, and one finding. Not being
 * identified at all outranks any single contradiction, so it is shown first
 * when it happens. No count of findings: counts moved between runs.
 */
export function renderPreviewMarkdown(
  check: AnswerCheck,
  analyses: readonly AnalysedAnswer[],
  signals: readonly AnswerSignals[]
): string {
  const first = check.results.find((r) => r.fact.id === "what");
  if (!first) return "";
  const out: string[] = [];

  out.push(`## ${first.fact.label}`);
  out.push("");
  out.push(`Asked: *${first.fact.question}*`);
  out.push("");
  for (const answer of first.answers) {
    out.push(`**${answer.providerLabel}**`);
    out.push("");
    out.push(answer.ok ? quote(answer.text) : "No answer received after retries.");
    out.push("");
  }

  const findings = first.answers.map((answer) => {
    const signal = signalFor(signals, first.fact.id, answer.providerId);
    const analysis = analysisFor(analyses, first.fact.id, answer.providerId);
    return { answer, signal, other: otherEntityOf(signal, analysis) };
  });
  const other = findings.find((f) => f.other);
  const notFound = findings.find((f) => f.signal?.nonAnswer.notFound);
  const headline = headlineContradiction(
    analyses.filter((a) => {
      if (a.factId !== first.fact.id) return false;
      return !notIdentified(signalFor(signals, a.factId, a.providerId), a);
    })
  );

  if (other?.other) {
    out.push("### It is not talking about you");
    out.push("");
    out.push(`${other.answer.providerLabel}: ${other.other.evidence}.`);
  } else if (notFound) {
    out.push("### It could not find you");
    out.push("");
    out.push(`${notFound.answer.providerLabel} could not find you by name and asked for more details.`);
  } else if (headline) {
    out.push("### One contradiction with your site");
    out.push("");
    out.push(`The assistant said: ${headline.claim}`);
    if (headline.siteSays) out.push(`\nYour site says: ${headline.siteSays}`);
  } else {
    out.push("No contradiction with your site was found in the first question.");
  }
  out.push("");
  out.push(
    "The other five questions, every verdict, where each statement comes from, and what to " +
      "change, in order, are in the full report."
  );
  out.push("");
  return out.join("\n");
}
