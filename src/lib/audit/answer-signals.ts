/**
 * Deterministic checks run on every answer before the judge sees it.
 *
 * The first paid test showed two failures no judge prompt fixes reliably.
 *
 * Non-answers. An assistant that could not identify the company answered "I
 * wasn't able to find information about it, could you provide more details?".
 * The judge filed two such answers as unanalysed and a third as "confirmed".
 * Recognising that is pattern work, so it happens here, and such an answer is
 * never sent to the judge at all.
 *
 * Another entity. One answer described a TV channel on supertennis.tv as if it
 * were super.tennis, and gave that channel's email as the site's contact. A
 * judge comparing statements against the site files that as a list of
 * "contradictions". It is one finding: the assistant is talking about someone
 * else. A domain that looks like the client's but is not the client's is hard
 * evidence of that, and it can be checked without a model.
 *
 * Both checks err toward silence. A signal here means a specific phrase or a
 * specific domain was found, and the report shows which.
 */

export interface NonAnswerSignal {
  readonly notFound: boolean;
  /** The phrases that matched, for the report to show. */
  readonly signals: readonly string[];
}

export interface EntitySignal {
  /** True when the answer also cites or names the client's own domain. */
  readonly ownDomainPresent: boolean;
  /** Domains in the answer that look like the client's but are not it, such as supertennis.tv for super.tennis. */
  readonly lookalikeDomains: readonly string[];
  /** Email domains given in the answer that are not the client's own. */
  readonly foreignEmailDomains: readonly string[];
}

export interface SubjectNames {
  readonly brand: string;
  readonly domain: string;
}

/**
 * How far past a matched phrase the client's name must appear for the phrase
 * to count.
 *
 * An earlier rule counted any "could not find" in the first 400 characters. It
 * flagged a real answer that said, in passing, "I could not find a published
 * subscription price". What marks a non-answer is failing to find the client,
 * not failing to find a detail, so the client's name has to be right there.
 */
const SUBJECT_WINDOW = 80;

const COULD_NOT_FIND: readonly RegExp[] = [
  /\b(?:was|were)(?:n[’']t| not) able to (?:find|locate)\b/gi,
  /\b(?:was|were) unable to (?:find|locate)\b/gi,
  /\b(?:could|can)(?:n[’']t| not) (?:find|locate)\b/gi,
  /\bunable to find\b/gi,
  /\b(?:no|limited|little|very little) (?:specific |reliable |detailed |publicly available )?information (?:about|on)\b/gi,
  // The first person test: "I don't have access to browse the specific LinkedIn profile", then generic advice.
  /\b(?:do|does)(?:n[’']t| not) have access to (?:browse|view|access)\b/gi,
  /\b(?:do|does)(?:n[’']t| not) have (?:any |specific )?information (?:about|on)\b/gi,
  /\bnot about [^.\n]{1,80} specifically\b/gi,
  // The second person test: "The search results don't contain specific information about Sergei Ponomarev".
  /\b(?:do|does)(?:n[\u2019']t| not) contain (?:any |specific |much )?information (?:about|on)\b/gi,
];

const CLARIFICATION: readonly RegExp[] = [
  /\b(?:could|can) you (?:please )?(?:provide|share|give)(?: me)? (?:more|some|additional|a bit more)\b/gi,
  /\bplease (?:provide|share) (?:more|additional)\b/gi,
  /\bcould you clarify\b/gi,
];

// A profile-access refusal often omits the person's name entirely and moves
// straight to generic advice. It is still a non-answer when it identifies the
// specific profile type and offers no person-specific information.
const PROFILE_ACCESS_REFUSAL =
  /\b(?:I\s+)?(?:do|does)(?:n[\u2019']t| not) have access to (?:browse|view|access) (?:the )?(?:specific )?(?:LinkedIn )?profile\b/i;

function mentionsSubject(window: string, subject: SubjectNames): boolean {
  const lower = window.toLowerCase();
  return [subject.brand, subject.domain]
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name.length > 0)
    .some((name) => lower.includes(name));
}

/**
 * An answer counts as "not found" when it says it could not find the client, or
 * asks for more details about the client, with the client's name or domain
 * within a few words of the phrase. A generic "could you tell me more about
 * your needs" after a full answer does not count, and neither does a missing
 * detail. A non-answer that never repeats the client's name is missed, which
 * is the intended direction of error.
 */
export function detectNonAnswer(text: string, subject: SubjectNames): NonAnswerSignal {
  const matched: string[] = [];
  const profileRefusal = text.match(PROFILE_ACCESS_REFUSAL);
  if (profileRefusal) matched.push(profileRefusal[0]);
  for (const pattern of [...CLARIFICATION, ...COULD_NOT_FIND]) {
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const window = text.slice(start, start + match[0].length + SUBJECT_WINDOW);
      if (mentionsSubject(window, subject)) {
        matched.push(match[0]);
        break;
      }
    }
  }
  return { notFound: matched.length > 0, signals: [...new Set(matched)] };
}

function normaliseHost(value: string): string {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}

function hostOfUrl(url: string): string | null {
  try {
    return normaliseHost(new URL(url).hostname);
  } catch {
    return null;
  }
}

function squash(value: string): string {
  return value.replace(/[^a-z0-9]/g, "");
}

function nameParts(host: string): { readonly full: string; readonly core: string } {
  const labels = host.split(".");
  return { full: squash(host), core: squash(labels.slice(0, -1).join(".")) };
}

/**
 * True when another host reads as the client's name under a different domain.
 *
 * super.tennis and supertennis.tv: "supertennis" either way. aibusiness.vc and
 * aibusiness.com: "aibusiness" either way. Very short names are ignored,
 * because "ai.com" resembles half the internet.
 */
export function isLookalikeDomain(subjectDomain: string, otherHost: string): boolean {
  const subject = normaliseHost(subjectDomain);
  const other = normaliseHost(otherHost);
  if (!other || other === subject) return false;
  const s = nameParts(subject);
  const o = nameParts(other);
  if (o.core.length < 4) return false;
  return o.core === s.full || o.core === s.core || o.full === s.full;
}

const EMAIL = /[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,24})/gi;
const URL_IN_TEXT = /https?:\/\/[^\s)<>"']+/gi;
const BARE_DOMAIN = /\b([a-z0-9][a-z0-9-]{0,62}(?:\.[a-z0-9-]{1,62})*\.[a-z]{2,24})\b/gi;

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

export function detectEntityMismatch(
  subjectDomain: string,
  text: string,
  citations: readonly string[]
): EntitySignal {
  const subject = normaliseHost(subjectDomain);
  const emailDomains = [...text.matchAll(EMAIL)].map((m) => normaliseHost(m[1]));
  const linkedHosts = [
    ...citations.map(hostOfUrl),
    ...[...text.matchAll(URL_IN_TEXT)].map((m) => hostOfUrl(m[0])),
    ...emailDomains,
  ].filter((h): h is string => typeof h === "string" && h.length > 0);
  const hosts = [
    ...linkedHosts,
    ...[...text.matchAll(BARE_DOMAIN)].map((m) => normaliseHost(m[1])),
  ];

  return {
    // Plain text such as the brand name "SUPER.TENNIS" can look exactly like
    // a domain. Count the canonical domain only when it is actually linked,
    // cited, or used in an email address.
    ownDomainPresent: linkedHosts.includes(subject),
    lookalikeDomains: unique(hosts.filter((h) => isLookalikeDomain(subject, h))),
    foreignEmailDomains: unique(emailDomains.filter((d) => d !== subject)),
  };
}
