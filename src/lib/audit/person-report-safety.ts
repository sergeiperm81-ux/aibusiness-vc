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

import type { AnswerCheck, AnswerCheckSubject } from "./answer-check";
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

const TROUBLE =
  /\b(fraud|scam|lawsuit|sued|court|criminal|arrest|convict|sanction|allegation|alleged|non-payment|bribe|investigat|prosecut|charged|terror|embezzl|money laundering|warning about|liquidat|insolven|bankrupt|offshore leaks|panama papers|pandora papers|paradise papers)/i;
const SOMEONE_ELSE =
  /\b(different|another|unrelated|similar names?|same name|namesake|other (people|individuals|persons)|not (the same|related|connected))\b|\bwhether (it|this|they) (is|are) (directly )?(tied|linked|connected|related)\b|\brather than a personal\b/i;

/**
 * True when an answer tells of trouble (fraud, a court case, sanctions) and
 * places it on someone else with the name. Such an answer is withheld whole,
 * from the summary and from the report: hiding its links is not enough, the
 * words themselves pin another person's trouble next to this name.
 */
export function mentionsOthersTrouble(text: string): boolean {
  return TROUBLE.test(text) && SOMEONE_ELSE.test(text);
}

/** Parts of a place name that say nothing on their own. */
const PLACE_FILLER = /^(metropolitan|area|region|county|city|greater|district|province|voivodeship|state|oblast|krai)$/i;
/** A number that names one person in a state register: a tax number, a passport, a social security number. */
const PERSON_REGISTRY = /\b(INN|OGRN|OGRNIP|EGRUL|EGRIP|SSN|PESEL|social security|passport)\b|ИНН|ОГРН|ЕГРЮЛ|ЕГРИП/;
/** The model itself says it may have found someone else. */
const SAME_PERSON_DOUBT = /\b(could|may|might|likely) be the same (person|individual|man|woman)\b|\bpossibly the same (person|individual)\b/i;

/**
 * True when an answer merges the person with a namesake: the model wonders
 * aloud whether it found the same person, or it quotes a person's state
 * register entry and names none of the places the preview found. Seen in the
 * 23.09 pilot: a model gave a Polish founder a Russian tax number and a list
 * of Russian companies that belong to someone with the same name. Such an
 * answer is withheld whole, like one that tells of other people's trouble.
 */
export function mergesAnotherIdentity(text: string, location: string | undefined): boolean {
  if (SAME_PERSON_DOUBT.test(text)) return true;
  const places = (location ?? "")
    .split(/[\s,()/]+/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length >= 4 && !PLACE_FILLER.test(word));
  if (places.length === 0 || !PERSON_REGISTRY.test(text)) return false;
  const lower = text.toLowerCase();
  return !places.some((place) => lower.includes(place));
}

/**
 * True when an answer about a person gives a street address. People-search
 * records put an address next to a name, not next to a person: in the 23.09
 * pilot one model placed the founder at a 2015 home address in another
 * country. Whoever it belongs to, a home address has no place in the report,
 * and the answer around it cannot be told apart from a namesake's record.
 */
export function quotesStreetAddress(text: string): boolean {
  return [STREET_FIRST, STREET_SUFFIX, NUMBER_FIRST].some((pattern) => new RegExp(pattern.source, "u").test(text));
}

/** An answer the report never prints and the summary never sees. */
export function withheldAnswer(text: string, subject: Pick<AnswerCheckSubject, "kind" | "location">): boolean {
  if (mentionsOthersTrouble(text)) return true;
  if (subject.kind === "company") return false;
  return mergesAnotherIdentity(text, subject.location) || quotesStreetAddress(text);
}

const REGISTRY_NUMBER =
  /\b(INN|NIP|REGON|KRS|OGRN|OGRNIP|PESEL|SSN|VAT ID|VAT number|tax ID|tax number|passport number)(\s*(?:[:#№]|No\.?)?\s*)[A-Z]{0,2}\d[\d -]{5,}\d/g;
const REGISTRY_NUMBER_RU = /(ИНН|ОГРН|ОГРНИП)(\s*:?\s*)\d{8,15}/g;
const STREET_FIRST =
  /(?<!\p{L})(?:[Uu]l\.|[Uu]lica|[Pp]lac|[Pp]l\.|[Aa]l\.|[Aa]leja|Street|Avenue|Road|Boulevard|Prospekt|улица|ул\.|проспект)\s+(?:\p{Lu}[\p{L}'.-]*\s+){0,4}\d+[\p{L}\d/]*/gu;
const STREET_SUFFIX = /(?<!\p{L})\p{Lu}[\p{L}-]*(?:katu|tie|gatan|vägen|straße|strasse|weg|gasse|straat|laan|utca|iela)\s+\d+[\p{L}\d/]*/gu;
const NUMBER_FIRST = /(?<!\p{L})\d+[A-Za-z]?\s+(?:\p{Lu}[\p{L}'.-]*\s+){1,3}(?:Street|Avenue|Road|Lane|Boulevard|Drive)(?!\p{L})/gu;
const POSTAL_CODE = /(?<![\d-])\d{2}-\d{3}(?=\s+\p{Lu})\s*/gu;
/** A chat model's offer to do more, at the end of an answer. */
const CHAT_OFFER = /^(If you (want|would like|'d like|like)|Would you like|Let me know|I can also|Want me to)\b/i;

/**
 * An answer as it may be printed and summarised. Register numbers and street
 * addresses are cut: the report shows what AI says about a person, not where
 * they live or their tax records, and the number may be a namesake's. A link
 * glued to the first word of a sentence is a search result's title, not the
 * model's words. An offer to do more at the end is chat, not an answer.
 */
export function cleanAnswerText(text: string): string {
  const lines = text
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)(?=\p{L})/gu, "")
    // The same title without its link: a line in one script glued to an answer in another, "...видеоAndrey is".
    .replace(/^[^\n]{15,200}?\p{Script=Cyrillic}(?=[A-Z][a-z])/u, "")
    .replace(/^[^\n]{15,200}?[a-z](?=[А-ЯЁ][а-яё])/u, "")
    .replace(REGISTRY_NUMBER, "$1 withheld")
    .replace(REGISTRY_NUMBER_RU, "$1 withheld")
    .replace(STREET_FIRST, "[address withheld]")
    .replace(STREET_SUFFIX, "[address withheld]")
    .replace(NUMBER_FIRST, "[address withheld]")
    .replace(POSTAL_CODE, "")
    .split("\n");
  const last = lines.findLastIndex((line) => line.trim() !== "" && !CHAT_OFFER.test(line.trim()));
  return lines.slice(0, last + 1).join("\n").trim();
}

const OWN_HOST = /(^|\.)aibusiness\.vc$/i;

/** A page published by aibusiness.vc, which also sells the scan. The report says so next to it. */
export function isOwnSite(address: string): boolean {
  try {
    return OWN_HOST.test(new URL(address).hostname);
  } catch {
    return false;
  }
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
      .filter((answer) => !withheldAnswer(answer.text, check.subject))
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
  const short = label.length > max ? `${label.slice(0, max - 1)}…` : label;
  return isOwnSite(address) ? `${short} (published by aibusiness.vc, the maker of this report)` : short;
}
