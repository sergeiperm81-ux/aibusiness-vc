/**
 * The report sent after payment: one PDF, read top to bottom.
 *
 * It is written about the person by name, never as "you": most buyers check
 * themselves, some check a person they are about to work with, and one text
 * has to serve both. The order is the order of the reader's feelings, not of
 * the machinery: who AI says this is, what AI says they do, whether AI raises
 * a red flag about working with them (the tense part, and for most people the
 * relief), where the answers contradict each other, then recommendations. Everything technical, the
 * table of which model found what and every answer word for word with its
 * sources, is an appendix.
 */

import type { AnswerCheck } from "./answer-check";
import { AMBER, AMBER_TINT, GREEN, GREEN_TINT, MUTED, PdfWriter } from "./pdf-kit";
import type { CoverageStatus, PersonSynthesis } from "./person-synthesis";
import {
  answersAboutProfile,
  identityAmbiguous,
  isSocialAddress,
  mentionsOthersTrouble,
  sourceLabel,
  verifiedSources,
} from "./person-report-safety";

/** The name on the cover and in the footer. One place, because it is still being decided. */
export const PRODUCT_NAME = "AI Person Scan";
/** Printed at the top of every page, so the reader can always write back. */
export const CONTACT_EMAIL = "info@aibusiness.vc";

export interface PersonReportInput {
  readonly name: string;
  readonly profileUrl: string;
  readonly check: AnswerCheck;
  readonly synthesis: PersonSynthesis;
  /** "questionId/providerId" for answers the fixed rules marked as not finding the person. */
  readonly notFoundKeys?: ReadonlySet<string>;
}

/** What each question is called on the page. The wording sent to the models is longer; see the appendix. */
const SHORT_QUESTIONS: Readonly<Record<string, (name: string) => string>> = {
  who: (name) => `Who is ${name}?`,
  does: (name) => `What does ${name} do as a professional?`,
  reputation: (name) => `Are there red flags about working with ${name}?`,
};

/** The company scan's names and lines. The person ones are the defaults above and below. */
export const COMPANY_PRODUCT_NAME = "AI Company Scan";

const COMPANY_QUESTIONS: Readonly<Record<string, (name: string) => string>> = {
  who: (name) => `Who is behind ${name}?`,
  does: (name) => `What does ${name} do and sell?`,
  reputation: (name) => `Are there red flags about working with ${name}?`,
};

const HOW_AI_LEARNS_COMPANY: readonly string[] = [
  "AI assistants with web search read what is public and readable without a login: the company's own site, registries, review platforms, news and mentions on other sites.",
  "They look for the same facts in more than one place. A founding year or an owner stated only on the company's own site is a claim; the same fact in a registry and an article is a fact to them.",
  "They prefer dated, recent pages. A site with no dated news in a year reads as a company that may have stopped.",
  "A name shared with other companies is resolved by context: legal name, city, industry. The more pages put the name next to those three, the less often the company is mixed up with another.",
  "Reviews are read where people leave them. Without reviews on a platform the assistants read, the honest answer to 'what do customers say' is 'I found nothing'.",
  "A public way to be reached. If no public page shows an address and a contact, assistants cannot say how to reach the company.",
];

const HOW_AI_LEARNS: readonly string[] = [
  "AI assistants with web search read what is public and readable without a login. Most of a LinkedIn, Instagram or Facebook profile is not. Public posts, articles, talks, interviews and mentions on other sites are.",
  "They look for the same facts in more than one place. A role stated only on a personal profile is a claim; the same role on a company page, an event page and an article is a fact to them.",
  "They prefer dated, recent pages. A profile with no public activity in a year reads as a person who may have moved on.",
  "A name shared with other people is resolved by context: city, employer, field. The more pages put a name next to those three, the less often that person is mixed up with someone else.",
  "One role, written the same way everywhere. Three different job titles on three networks become three different versions of one person.",
  "A public way to be reached. If no public page shows how to contact a person, the honest answer to 'how do I get in touch' is 'I could not find a way'.",
];

const MAX_SOURCES_PER_GROUP = 8;

/** Splits cited pages into social networks and everything else, so a reader sees at a glance where a model looked. */
export function groupSources(citations: readonly string[]): { readonly social: readonly string[]; readonly web: readonly string[] } {
  return {
    social: citations.filter(isSocialAddress).slice(0, MAX_SOURCES_PER_GROUP),
    web: citations.filter((c) => !isSocialAddress(c)).slice(0, MAX_SOURCES_PER_GROUP),
  };
}

/** An address as a person reads it: a Cyrillic path, not %D0%BF%D0%BE. Kept as sent when it does not decode. */
export function readableAddress(address: string): string {
  try {
    return decodeURI(address);
  } catch {
    return address;
  }
}

export interface AnswerBlock {
  readonly text: string;
  readonly bullet: boolean;
  readonly heading: boolean;
}

/** Roles a single model names while at least three models answered what the person does: unconfirmed, not a contradiction. */
export function rolesNamedByOneModel(synthesis: PersonSynthesis, check: AnswerCheck): PersonSynthesis["professional"]["roles"] {
  const answeredDoes = check.results.find((r) => r.fact.id === "does")?.answers.filter((a) => a.ok).length ?? 0;
  return answeredDoes >= 3 ? synthesis.professional.roles.filter((role) => role.saidBy.length === 1) : [];
}

/** What Claude said before searching, glued to its answer in answers stored before that was cut: "...questions.Based on". */
const PRE_SEARCH = /^(?:I'll|I will|Let me) search[^.]*\.(?=[A-Z])/;

/**
 * An answer as plain paragraphs. Models write Markdown; printed as it comes it
 * is a wall of asterisks and bracketed links. The words are kept, the marks
 * are dropped, and inline links lose their address because the same address
 * is in the source list under the answer.
 */
export function plainAnswer(text: string): readonly AnswerBlock[] {
  const clean = (line: string): string =>
    line
      // Footnote links: "[[1]](https://...)" from Grok, "[1](https://...)" from others. The address is in the source list.
      .replace(/\[\[\d+\]\]\((https?:[^)\s]+)\)/g, "")
      .replace(/\[\d+\]\((https?:[^)\s]+)\)/g, "")
      .replace(/\(\[([^\]]+)\]\((https?:[^)\s]+)\)\)/g, "")
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1")
      // Bare footnote marks with no address, "[1][3]" from Perplexity.
      .replace(/\[\d+\]/g, "")
      .replace(/(\*\*|__)/g, "")
      .replace(/(^|\s)\*(\S[^*]*)\*/g, "$1$2")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,;:!?])/g, "$1")
      .trim();
  return text
    .replace(PRE_SEARCH, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^[-*_]{3,}$/.test(line))
    .map((line) => {
      const heading = /^#{1,6}\s+/.test(line) || /^\*\*[^*]+\*\*:?$/.test(line);
      const bullet = !heading && /^([-*\u2022]|\d+[.)])\s+/.test(line);
      const body = clean(line.replace(/^#{1,6}\s+/, "").replace(/^([-*\u2022]|\d+[.)])\s+/, ""));
      return { text: body, bullet, heading };
    })
    .filter((block) => block.text.length > 0);
}

function saidByNote(saidBy: readonly string[], total: number): string {
  return `Said by ${saidBy.length} of ${total}: ${saidBy.join(", ")}`;
}

function longDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const STATUS_WORD: Readonly<Record<CoverageStatus, string>> = {
  found: "Found",
  not_found: "Did not find",
  mixed: "Mixed with a namesake",
};

function coverageWord(input: PersonReportInput, questionId: string, providerId: string, providerLabel: string): string {
  const answer = input.check.results
    .find((r) => r.fact.id === questionId)
    ?.answers.find((a) => a.providerId === providerId);
  if (!answer || !answer.ok) return "No answer";
  if (mentionsOthersTrouble(answer.text)) return "Withheld";
  // The fixed rule wins: it quotes the assistant's own "I could not find" words.
  if (input.notFoundKeys?.has(`${questionId}/${providerId}`)) return STATUS_WORD.not_found;
  const status = input.synthesis.coverage.find((c) => c.questionId === questionId && c.provider === providerLabel)?.status;
  return status ? STATUS_WORD[status] : "Answered";
}

export async function buildPersonReportPdf(input: PersonReportInput): Promise<Uint8Array> {
  const { check, synthesis, name } = input;
  const company = check.subject.kind === "company";
  const productName = company ? COMPANY_PRODUCT_NAME : PRODUCT_NAME;
  const questions = company ? COMPANY_QUESTIONS : SHORT_QUESTIONS;
  const w = company
    ? { subject: "company", given: "the company given", tie: "this company", others: "other companies", other: "Another company", offer: "Offer", offers: "Offers only one model names" }
    : { subject: "person", given: "the profile given", tie: "this profile", others: "other people", other: "One other person", offer: "Role", offers: "Roles only one model names" };
  const total = check.providers.length;
  const answered = check.results.flatMap((r) => r.answers).filter((a) => a.ok).length;
  const asked = check.results.length * total;
  const shown = answersAboutProfile(check, synthesis, input.notFoundKeys);
  const ambiguous = identityAmbiguous(check, synthesis, shown);
  const verified = verifiedSources(check, shown);
  const sourceTiedToThis = (address: string): boolean => verified.has(address);
  const pdf = await PdfWriter.create(`${productName} - ${name}`, `What AI says about ${name}`, {
    left: "aibusiness.vc",
    right: `Questions about this report: ${CONTACT_EMAIL}`,
  });

  /* ---------------------------------------------------------------- cover */
  pdf.kicker(productName);
  pdf.title(`What AI says about ${name}`);
  pdf.muted(input.profileUrl);
  pdf.muted(`Checked ${longDate(check.checkedAt)}. ${total} AI models, ${check.results.length} questions, ${answered} of ${asked} answers received.`);
  const silent = check.providers.filter((p) =>
    check.results.every((row) => !row.answers.find((a) => a.providerId === p.id)?.ok)
  );
  if (silent.length > 0) {
    pdf.muted(`${silent.map((p) => p.label).join(", ")} did not answer when this report was made, so it covers ${total - silent.length} models, not ${total}.`);
  }
  pdf.gap(10);
  pdf.text(
    (company
      ? "Before a purchase, a contract or a partnership, people now ask an AI assistant about the company they are about to deal with. "
      : "Before a meeting, a deal or an interview, people now ask an AI assistant about the person they are about to meet. ") +
      `We asked ${total} of them the three questions people ask, each with live web search on. This is what they said about ${name}.`
  );
  pdf.muted(
    `The report is the pages before the appendices. The appendices are the record: which model found the ${w.subject}, and every answer that could be tied to ${w.tie}, word for word.`
  );
  pdf.rule();

  /* ------------------------------------------------------------ question 1 */
  pdf.kicker("Question 1");
  pdf.heading(questions.who(name));
  pdf.gap(2);
  pdf.text(synthesis.identity.summary, { gapAfter: 8 });
  for (const fact of synthesis.identity.facts) pdf.fact(fact.label, fact.value, saidByNote(fact.saidBy, total));

  /* ------------------------------------------------------------ question 2 */
  pdf.rule();
  pdf.kicker("Question 2");
  pdf.heading(questions.does(name));
  pdf.gap(2);
  pdf.text(synthesis.professional.summary, { gapAfter: 8 });
  for (const role of synthesis.professional.roles) pdf.fact(w.offer, role.value, saidByNote(role.saidBy, total));

  pdf.text("Recent public activity, as AI sees it", { bold: true, gapAfter: 3 });
  if (synthesis.professional.activity.length === 0) {
    pdf.text("No model named a specific post, article or talk.", { color: MUTED });
  }
  for (const item of synthesis.professional.activity) {
    const when = item.when ? `, ${item.when}` : ", no date given";
    pdf.bullet(`${item.what} (${item.where}${when})`);
    pdf.text(saidByNote(item.saidBy, total), { size: 8.5, color: MUTED, indent: 14, gapAfter: 3 });
  }
  if (synthesis.professional.activityNote) pdf.text(synthesis.professional.activityNote, { gapAfter: 4 });

  /* ------------------------------------------------------------ question 3 */
  pdf.rule();
  pdf.kicker("Question 3");
  pdf.heading(questions.reputation(name));
  pdf.gap(4);

  const ownFlags = synthesis.redFlags.flags.filter((f) => !f.possiblyAnotherPerson);
  const heldFlags = synthesis.redFlags.flags.length - ownFlags.length;
  const heldNote =
    heldFlags > 0
      ? ` ${heldFlags} ${heldFlags === 1 ? "point the models tied" : "points the models tied"} to ${w.others} with this name ${heldFlags === 1 ? "is" : "are"} left out: this report is only about ${w.given}.`
      : "";
  if (ownFlags.length === 0 && ambiguous) {
    pdf.banner(
      "Identity ambiguous: no reputation conclusion",
      `${company ? "Other organisations share" : "Other people share"} this name, or not every answer could be tied to ${w.tie} (see Appendix A). This scan draws no conclusion about ${company ? "the organisation's" : "the person's"} reputation.${heldNote}`,
      AMBER,
      AMBER_TINT
    );
  } else if (ownFlags.length === 0) {
    pdf.banner(
      "No public red flags identified",
      `For ${w.given}, in this scan: none of the ${total} models reported a dispute, a complaint, a scandal or a warning sign about ${name}.${heldNote}`,
      GREEN,
      GREEN_TINT
    );
  } else {
    pdf.banner(
      `${ownFlags.length} ${ownFlags.length === 1 ? "point" : "points"} to look at`,
      `This is what someone asking an AI assistant may be told. Each point names the model that said it.${heldNote}`,
      AMBER,
      AMBER_TINT
    );
    for (const flag of ownFlags) {
      pdf.bullet(flag.flag, { bold: true });
      pdf.text(saidByNote(flag.saidBy, total), { size: 8.5, color: MUTED, indent: 14, gapAfter: 4 });
      if (flag.source && sourceTiedToThis(flag.source)) {
        pdf.link(`Source: ${sourceLabel(flag.source)}`, flag.source, { size: 8.5, indent: 14, gapAfter: 4 });
      }
    }
    pdf.text("We repeat what the models said. We do not claim any of it is true.", { size: 9, color: MUTED, gapAfter: 6 });
  }

  if (ambiguous && ownFlags.length === 0) {
    // Listing "no disputes found" under an ambiguous identity would be a verdict after all.
    pdf.text(`The search covered disputes, complaints, reviews and warnings; no result was attributed to ${w.given}.`, { gapAfter: 6 });
  } else if (synthesis.redFlags.clear.length > 0) {
    pdf.text("What the models looked for and did not find", { bold: true, gapAfter: 3 });
    for (const line of synthesis.redFlags.clear) pdf.bullet(line, { color: GREEN });
    pdf.gap(4);
  }
  pdf.text("Reviews and public feedback", { bold: true, gapAfter: 3 });
  if (synthesis.redFlags.reviews.length === 0) {
    pdf.text(company
      ? "No model found a customer review or rating, good or bad. Someone checking has nothing to go on but the company's own words."
      : "No model found a review, a testimonial or a recommendation, good or bad. A person checking has nothing to go on but the profile itself.", { gapAfter: 6 });
  }
  for (const review of synthesis.redFlags.reviews) {
    pdf.bullet(review.what);
    if (review.link && sourceTiedToThis(review.link)) pdf.link(sourceLabel(review.link), review.link, { size: 8.5, indent: 14 });
    pdf.text(saidByNote(review.saidBy, total), { size: 8.5, color: MUTED, indent: 14, gapAfter: 4 });
  }
  if (synthesis.redFlags.caveats.length > 0) {
    pdf.text("What they added", { bold: true, gapAfter: 3 });
    for (const line of synthesis.redFlags.caveats) pdf.bullet(line);
  }

  /* -------------------------------------------------------- contradictions */
  const loneRoles = rolesNamedByOneModel(synthesis, check);
  if (synthesis.disagreements.length > 0) {
    pdf.rule();
    pdf.kicker("Contradictions");
    pdf.heading("Where the answers contradict each other");
    for (const item of synthesis.disagreements) {
      pdf.text(item.topic, { bold: true, gapAfter: 3 });
      for (const version of item.versions) pdf.bullet(`${version.saidBy}: ${version.says}`);
      pdf.gap(5);
    }
  }
  if (loneRoles.length > 0) {
    pdf.rule();
    pdf.kicker("Unconfirmed claims");
    pdf.heading(w.offers);
    for (const role of loneRoles) pdf.bullet(`${role.saidBy[0]}: ${role.value}`);
    pdf.text(
      `The other models describe the ${w.subject} without these. Each is unconfirmed: it may be out of date, a past one told as current, or not about this ${w.subject} at all.`,
      { size: 9.5, color: MUTED, gapAfter: 5 }
    );
  }
  if (synthesis.mixups.length > 0) {
    pdf.rule();
    pdf.kicker("Namesakes");
    pdf.heading(company ? "Other companies with this name" : "Other people with this name");
    pdf.text(
      `${synthesis.mixups.length === 1 ? w.other : `${synthesis.mixups.length} ${w.others}`} with this name appeared in the answers. ` +
        `Their pages, records and contacts are not listed: this report is only about ${w.given}. ` +
        `Anyone who asks an AI assistant about ${name} can be shown them too. ` +
        (company
          ? "What keeps them apart is context: the same legal name, city and industry next to the name on every public page."
          : "What keeps namesakes apart is context: the same city, employer and field next to the name on every public page."),
      { gapAfter: 4 }
    );
  }

  /* ------------------------------------------------------- recommendations */
  pdf.newPage();
  pdf.kicker("Recommendations");
  pdf.heading("What to strengthen");
  pdf.text(
    "Each point closes a gap visible in the answers above. None of them guarantees that a model changes its answer: " +
      "they give the models something correct to read.",
    { gapAfter: 8 }
  );
  synthesis.recommendations.forEach((item, index) => {
    pdf.text(`${index + 1}. ${item.title}`, { bold: true, size: 11.5, gapAfter: 1 });
    pdf.text(item.why, { color: MUTED, size: 10, gapAfter: 1 });
    for (const step of item.steps) pdf.bullet(step, { gapAfter: 2 });
    pdf.gap(8);
  });

  pdf.rule();
  pdf.heading(`How AI learns about a ${w.subject}`);
  for (const line of company ? HOW_AI_LEARNS_COMPANY : HOW_AI_LEARNS) pdf.bullet(line, { gapAfter: 5 });

  /* ------------------------------------------------------------ appendix A */
  pdf.newPage();
  pdf.kicker("Appendix A");
  pdf.heading(`Which model found the ${w.subject}, question by question`);
  pdf.table(
    ["Question", ...check.providers.map((p) => p.label)],
    check.results.map((row) => [
      questions[row.fact.id]?.(name) ?? row.fact.label,
      ...check.providers.map((p) => coverageWord(input, row.fact.id, p.id, p.label)),
    ]),
    150
  );
  pdf.gap(6);
  pdf.text("The models asked", { bold: true, gapAfter: 3 });
  for (const provider of check.providers) pdf.bullet(`${provider.label}: ${provider.model}, through its API, web search on`, { size: 9.5 });

  pdf.gap(8);
  pdf.heading("About this report");
  for (const line of [
    "These are generative models. Ask the same question twice and the wording, and sometimes the facts, will differ. This report is a snapshot taken on the date above.",
    "The answers come from each provider's API with web search on, not from the consumer apps. The apps add their own instructions and remember their users, so what anyone sees in their own ChatGPT or Gemini may differ.",
    "The summaries in this report were written by a model from the answers in Appendix B and checked by fixed rules. Nothing was added from any other source. Where the summary and an answer differ, the answer is the record.",
    "We report what the models said. We do not verify it, and we do not claim it is true.",
    "This report is not a background check and aibusiness.vc is not a consumer reporting agency. Do not use it to decide on employment, tenancy, credit, insurance or any other purpose covered by the US Fair Credit Reporting Act or similar laws. It shows what AI models say, which can be wrong or about someone else.",
  ]) {
    pdf.bullet(line, { size: 9.5, gapAfter: 4 });
  }

  /* ------------------------------------------------------------ appendix B */
  pdf.newPage();
  pdf.kicker("Appendix B");
  pdf.heading("Every answer, with its sources");
  pdf.muted(
    "The words are the models' own. Only formatting marks were removed, and links inside an answer were moved to the list under it. " +
      `An answer the model could not tie to ${w.tie} is not printed. A cited page is listed only when the page itself names the ${w.subject} in full ` +
      (company
        ? "together with its domain, its legal name or its city; pages on its own site are listed as given. The summary was written from these pages only."
        : "together with the company, the role or the city from the profile; the profile itself is listed as given. The summary was written from these pages only.")
  );
  check.results.forEach((row, index) => {
    if (index > 0) pdf.newPage();
    pdf.gap(8);
    pdf.text(`Question ${index + 1}. ${questions[row.fact.id]?.(name) ?? row.fact.label}`, { size: 13, bold: true, gapAfter: 2 });
    pdf.text(`Exact wording sent to every model: ${row.fact.question}`, { size: 8.5, color: MUTED, gapAfter: 10 });
    for (const answer of row.answers) {
      pdf.strip(answer.providerLabel, answer.model);
      if (!answer.ok) {
        pdf.text(`No answer was received: ${answer.error ?? "the request failed"}.`, { color: MUTED, indent: 10, gapAfter: 12 });
        continue;
      }
      if (!shown.has(`${row.fact.id}/${answer.providerId}`)) {
        pdf.text(
          `Not printed: this answer could not be tied to ${w.given}, or it tells of trouble about ${w.others} with the name.`,
          { color: MUTED, indent: 10, gapAfter: 12 }
        );
        continue;
      }
      for (const block of plainAnswer(answer.text)) {
        if (block.bullet) pdf.bullet(block.text, { size: 9.5, indent: 10 });
        else pdf.text(block.text, { size: 9.5, indent: 10, bold: block.heading, gapAfter: 4 });
      }
      const held = answer.heldCitations ?? 0;
      const sources = groupSources(answer.citations);
      pdf.gap(2);
      if (answer.citations.length === 0 && held === 0) {
        pdf.text("Sources: the model cited none for this answer.", { size: 8.5, color: MUTED, indent: 10 });
      }
      if (sources.social.length > 0) {
        pdf.text("Sources: social networks", { size: 8.5, bold: true, color: MUTED, indent: 10 });
        for (const source of sources.social) pdf.link(sourceLabel(source), source, { size: 8, indent: 18 });
      }
      if (sources.web.length > 0) {
        pdf.text("Sources: websites", { size: 8.5, bold: true, color: MUTED, indent: 10 });
        for (const source of sources.web) pdf.link(sourceLabel(source), source, { size: 8, indent: 18 });
      }
      if (held > 0) {
        pdf.text(
          `${held} other ${held === 1 ? "page" : "pages"} it cited ${held === 1 ? "is" : "are"} not listed: nothing on ${held === 1 ? "it" : "them"} ties ${held === 1 ? "it" : "them"} to ${w.tie}, or ${held === 1 ? "it" : "they"} could not be read.`,
          { size: 8.5, color: MUTED, indent: 10 }
        );
      }
      pdf.gap(14);
    }
  });

  return pdf.bytes();
}
