/**
 * What the paid person report may show, and what it must hold back.
 *
 * The report is about one profile. The models also find other people with
 * the same name, and a page about one of them printed in this report would
 * pin that person's record, contacts or troubles on the buyer's subject. So:
 * - an answer the model could not tie to the profile is not printed;
 * - a cited page is listed only when something in it ties it to the profile:
 *   the full name in its address, the profile's own address, or a site that at
 *   least two models cited in answers about this person;
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

function hostOf(address: string): string | null {
  try {
    return new URL(address).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

function decoded(address: string): string {
  try {
    return decodeURI(address).toLowerCase();
  } catch {
    return address.toLowerCase();
  }
}

/** Latin letters and digits only, so "Sergei Ponomarev" matches "sergei-ponomarev" and "sergeiponomarev". */
function nameTokens(name: string): readonly string[] {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9Ѐ-ӿ]+/)
    .filter((token) => token.length >= 2);
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
      .filter(
        (answer) =>
          synthesis.coverage.find((c) => c.questionId === row.fact.id && c.provider === answer.providerLabel)?.status ===
          "found"
      )
      .map((answer) => `${row.fact.id}/${answer.providerId}`)
  );
  return new Set(keys);
}

/** Sites, not networks, that at least two models cited in answers about this person. */
export function corroboratedHosts(check: AnswerCheck, shown: ReadonlySet<string>): ReadonlySet<string> {
  const byHost = new Map<string, Set<string>>();
  for (const row of check.results) {
    for (const answer of row.answers) {
      if (!shown.has(`${row.fact.id}/${answer.providerId}`)) continue;
      for (const citation of answer.citations) {
        const host = hostOf(citation);
        if (!host || isSocialAddress(citation)) continue;
        byHost.set(host, new Set([...(byHost.get(host) ?? []), answer.providerId]));
      }
    }
  }
  return new Set([...byHost].filter(([, providers]) => providers.size >= 2).map(([host]) => host));
}

export interface SourceFilter {
  readonly name: string;
  readonly profileUrl: string;
  readonly hosts: ReadonlySet<string>;
}

/** True when something in the address ties the page to this profile. */
export function sourceTiedToProfile(address: string, filter: SourceFilter): boolean {
  const host = hostOf(address);
  if (!host) return false;
  const text = decoded(address);
  const profile = decoded(filter.profileUrl).replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
  if (profile && text.includes(profile)) return true;
  const tokens = nameTokens(filter.name);
  if (tokens.length > 0 && tokens.every((token) => text.includes(token))) return true;
  return !isSocialAddress(address) && filter.hosts.has(host);
}

export function splitSources(
  citations: readonly string[],
  filter: SourceFilter
): { readonly shown: readonly string[]; readonly held: number } {
  const shown = citations.filter((c) => sourceTiedToProfile(c, filter));
  return { shown, held: citations.length - shown.length };
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
