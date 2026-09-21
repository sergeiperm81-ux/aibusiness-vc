/**
 * What the paid person report may show, and what it must hold back.
 *
 * The report is about one profile. The models also find other people with
 * the same name, and a page about one of them printed in this report would
 * pin that person's record, contacts or troubles on the buyer's subject. So:
 * - an answer the model could not tie to the profile is not printed;
 * - cited pages were already cut, by what each page says, to the ones about
 *   this person (person-source-check.ts), before the summary was written;
 * - when other people with the name came up, or a model could not tell who
 *   the profile is, the report draws no conclusion about reputation.
 */

import type { AnswerCheck } from "./answer-check";
import type { PersonSynthesis } from "./person-synthesis";

const SOCIAL_HOSTS = /(^|\.)(linkedin\.com|x\.com|twitter\.com|instagram\.com|facebook\.com|t\.me|telegram\.me|youtube\.com|tiktok\.com|medium\.com|threads\.net)$/i;

export function isSocialAddress(address: string): boolean {
  try {
    return SOCIAL_HOSTS.test(new URL(address).hostname);
  } catch {
    return false;
  }
}

function decoded(address: string): string {
  try {
    return decodeURI(address).toLowerCase();
  } catch {
    return address.toLowerCase();
  }
}

const TROUBLE = /\b(fraud|scam|lawsuit|sued|court|criminal|arrest|convict|sanction|allegation|alleged|non-payment|bribe|investigat|prosecut|charged|terror|embezzl|money laundering|warning about)/i;
const SOMEONE_ELSE = /\b(different|another|unrelated|similar names?|same name|namesake|other (people|individuals|persons)|not (the same|related|connected))\b/i;

/**
 * True when an answer tells of trouble (fraud, a court case, sanctions) and
 * places it on someone else with the name. Such an answer is withheld whole,
 * from the summary and from the report: hiding its links is not enough, the
 * words themselves pin another person's trouble next to this name.
 */
export function mentionsOthersTrouble(text: string): boolean {
  return TROUBLE.test(text) && SOMEONE_ELSE.test(text);
}

/** "questionId/providerId" of the answers the report may print: the model tied them to this profile. */
export function answersAboutProfile(
  check: AnswerCheck,
  synthesis: PersonSynthesis,
  notFoundKeys: ReadonlySet<string> = new Set()
): ReadonlySet<string> {
  const keys = check.results.flatMap((row) =>
    row.answers
      .filter((answer) => answer.ok)
      .filter((answer) => !notFoundKeys.has(`${row.fact.id}/${answer.providerId}`))
      .filter((answer) => !mentionsOthersTrouble(answer.text))
      .filter(
        (answer) =>
          synthesis.coverage.find((c) => c.questionId === row.fact.id && c.provider === answer.providerLabel)?.status ===
          "found"
      )
      .map((answer) => `${row.fact.id}/${answer.providerId}`)
  );
  return new Set(keys);
}

/** Every page still cited, after the check by content, in an answer the report prints. */
export function verifiedSources(check: AnswerCheck, shown: ReadonlySet<string>): ReadonlySet<string> {
  return new Set(
    check.results.flatMap((row) =>
      row.answers.filter((a) => shown.has(`${row.fact.id}/${a.providerId}`)).flatMap((a) => a.citations)
    )
  );
}

/**
 * True when the report must not conclude anything about reputation: other
 * people with the name came up, or some model could not tie an answer to the
 * profile.
 */
export function identityAmbiguous(
  check: AnswerCheck,
  synthesis: PersonSynthesis,
  shown: ReadonlySet<string>
): boolean {
  const answered = check.results.flatMap((row) =>
    row.answers.filter((a) => a.ok).map((a) => `${row.fact.id}/${a.providerId}`)
  );
  return synthesis.mixups.length > 0 || answered.some((key) => !shown.has(key));
}

/** A cited page as a person reads it: "LinkedIn profile: sergei-ponomarev", "aibusiness.vc/about". */
export function sourceLabel(address: string, max = 80): string {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return address.slice(0, max);
  }
  const host = url.hostname.replace(/^www\./i, "").replace(/^[a-z]{2}\.linkedin\.com$/i, "linkedin.com");
  const path = decoded(url.pathname).replace(/\/+$/, "");
  const linkedIn = /linkedin\.com$/i.test(host) ? path.match(/^\/(in|company|posts|pulse)\/([^/]+)/) : null;
  const label = linkedIn
    ? linkedIn[1] === "in"
      ? `LinkedIn profile: ${linkedIn[2]}`
      : linkedIn[1] === "company"
        ? `LinkedIn company: ${linkedIn[2]}`
        : `LinkedIn post by ${linkedIn[2].split("_")[0]}`
    : `${host}${path}`;
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
