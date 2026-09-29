/**
 * What a person states about themselves, as the reference their answers are
 * judged against.
 *
 * Three sources, in order of certainty. The form entries are the person's own
 * words and always present. The public profile is tried once without a
 * login; LinkedIn answers most such requests with a login wall or a 999, and
 * the report says which happened rather than pretending a profile was read.
 * The company site, when there is one, is read the same way as for a company
 * check.
 *
 * Nothing is fetched with credentials, and nothing is retried against the
 * profile host: one request, then move on.
 */

import { extractTextContent } from "./live";
import { cleanDomain, cleanProfileUrl, type PersonSubject } from "./person-check";
import { fetchSiteFacts, type ReferencePage, type SiteFacts, type SiteMarkup } from "./site-facts";

const PROFILE_TIMEOUT_MS = 12_000;
const MAX_PROFILE_CHARS = 8_000;
const REFERENCE_BUDGET = 24_000;

/** A browser-like agent: LinkedIn refuses the default one outright. */
const PROFILE_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

export type ProfileOutcome =
  /** The page came back and reads like a profile. */
  | "read"
  /** The host answered with a login wall or a bot block. */
  | "blocked"
  /** No usable response: network error, timeout, empty page. */
  | "unreachable";

export interface PublicProfile {
  readonly url: string;
  readonly outcome: ProfileOutcome;
  /** Readable text when read, otherwise empty. */
  readonly text: string;
  /** What happened, in one line, for the report. */
  readonly note: string;
}

export interface PersonFacts extends SiteFacts {
  /** The form entries, as one labelled block. Always present. */
  readonly provided: string;
  readonly profile: PublicProfile;
  /** True when a company site answered. */
  readonly companySiteRead: boolean;
}

/**
 * Whether a response is LinkedIn's login wall or bot block rather than a
 * profile. Pure, so it can be tested without a network.
 */
export function classifyProfileResponse(
  status: number,
  finalUrl: string,
  body: string
): ProfileOutcome {
  if (status === 999 || status === 403 || status === 429) return "blocked";
  if (/\/authwall|\/login|\/checkpoint|\/uas\//i.test(finalUrl)) return "blocked";
  if (status < 200 || status >= 300) return "unreachable";
  const head = body.slice(0, 4000);
  if (/<title>[^<]*(sign in|log in|join linkedin|security verification)/i.test(head)) return "blocked";
  if (/authwall|window\.location\.href\s*=\s*["']https:\/\/www\.linkedin\.com\/(login|checkpoint)/i.test(head)) {
    return "blocked";
  }
  const text = extractTextContent(body);
  return text.trim().length >= 400 ? "read" : "unreachable";
}

export async function fetchPublicProfile(rawUrl: string): Promise<PublicProfile> {
  const url = cleanProfileUrl(rawUrl);
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": PROFILE_UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(PROFILE_TIMEOUT_MS),
    });
    const body = await response.text();
    const outcome = classifyProfileResponse(response.status, response.url || url, body);
    const text = outcome === "read" ? extractTextContent(body).slice(0, MAX_PROFILE_CHARS) : "";
    const note =
      outcome === "read"
        ? "public profile read without a login"
        : outcome === "blocked"
          ? `the profile host answered with a login wall or bot block (HTTP ${response.status}), so the profile was not read`
          : `no usable page came back (HTTP ${response.status})`;
    return { url, outcome, text, note };
  } catch (error) {
    return {
      url,
      outcome: "unreachable",
      text: "",
      note: `the profile could not be fetched: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/** The form entries as the first reference block, in the person's own words. */
export function providedBlock(person: PersonSubject): string {
  const lines = [
    `Name: ${person.name.trim()}`,
    person.role.trim() ? `Role: ${person.role.trim()}` : "",
    person.company.trim() ? `Company: ${person.company.trim()}` : "",
    cleanDomain(person.companyDomain) ? `Company website: ${cleanDomain(person.companyDomain)}` : "",
    `Public profile: ${cleanProfileUrl(person.profileUrl)}`,
    person.oneLiner?.trim() ? `In their own words: ${person.oneLiner.trim()}` : "",
    person.category?.trim()
      ? `Wants to be found for: ${person.category.trim()}${person.market?.trim() ? ` (${person.market.trim()})` : ""}`
      : "",
  ].filter(Boolean);
  return lines.join("\n");
}

const EMPTY_MARKUP: SiteMarkup = {
  name: null,
  description: null,
  country: null,
  locality: null,
  founder: null,
  contact: null,
  prices: [],
  schemaTypes: [],
  declaresOffer: false,
};

/**
 * Joins the reference blocks within the budget. The form entries are never
 * shortened; the profile and the site pages share what is left. Pure, so the
 * assembly can be tested without a network.
 */
export function assembleReference(
  provided: string,
  profile: PublicProfile,
  sitePages: readonly ReferencePage[]
): { readonly reference: string; readonly shortened: readonly string[] } {
  const head = `--- what the person states about themselves ---\n${provided}`;
  const rest: { label: string; text: string }[] = [];
  if (profile.outcome === "read" && profile.text.trim()) {
    rest.push({ label: profile.url, text: profile.text });
  }
  for (const page of sitePages) {
    if (page.ok && page.text.trim()) rest.push({ label: page.url, text: page.text });
  }
  const remaining = Math.max(0, REFERENCE_BUDGET - head.length);
  const share = rest.length > 0 ? Math.floor(remaining / rest.length) : 0;
  const shortened: string[] = [];
  const blocks = rest.map((block) => {
    const text = block.text.slice(0, share);
    if (text.length < block.text.length) shortened.push(block.label);
    return `--- ${block.label} ---\n${text}`;
  });
  return { reference: [head, ...blocks].join("\n\n"), shortened };
}

function slugWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

/**
 * A company site is context, not the person's autobiography. Keep only the
 * pages most likely to state facts about this person; otherwise articles and
 * llms.txt turn editorial subjects into supposed personal claims.
 */
export function selectPersonReferencePages(
  person: PersonSubject,
  pages: readonly ReferencePage[]
): readonly ReferencePage[] {
  const name = person.name.trim().toLowerCase();
  const nameWords = slugWords(person.name);
  const categoryWords = slugWords(person.category ?? "");

  return pages
    .filter((page) => page.ok && page.text.trim() && !/\/(?:llms\.txt|sitemap(?:_index)?\.xml)(?:$|[?#])/i.test(page.url))
    .map((page) => {
      const url = page.url.toLowerCase();
      const text = page.text.toLowerCase();
      const pathHasName = nameWords.length > 0 && nameWords.every((word) => url.includes(word));
      const textHasName = name.length > 0 && text.includes(name);
      const identityPage = /\/(?:about|team|people|person|profile|founder)(?:[/?#-]|$)/i.test(url);
      const categoryHits = categoryWords.filter((word) => text.includes(word)).length;
      const score = (pathHasName ? 100 : 0) + (identityPage ? 60 : 0) + (textHasName ? 40 : 0) + Math.min(categoryHits, 4) * 5;
      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.page.url.localeCompare(b.page.url))
    .slice(0, 3)
    .map((item) => item.page);
}

export async function fetchPersonFacts(person: PersonSubject): Promise<PersonFacts> {
  const provided = providedBlock(person);
  const domain = cleanDomain(person.companyDomain);

  const [profile, site] = await Promise.all([
    fetchPublicProfile(person.profileUrl),
    domain
      ? fetchSiteFacts(domain, [person.name, person.company, person.role, person.category ?? ""])
      : Promise.resolve<SiteFacts | null>(null),
  ]);

  const sitePages = selectPersonReferencePages(person, site?.pages ?? []);
  const { reference, shortened } = assembleReference(provided, profile, sitePages);

  const pages: ReferencePage[] = [
    { url: "what the person states about themselves", ok: true, text: provided },
    { url: profile.url, ok: profile.outcome === "read", text: profile.text },
    ...sitePages,
  ];

  return {
    domain: domain || new URL(profile.url).hostname,
    fetchedAt: new Date().toISOString(),
    reachable: true,
    pages,
    markup: site?.markup ?? EMPTY_MARKUP,
    reference,
    shortened,
    provided,
    profile,
    companySiteRead: Boolean(site?.reachable),
  };
}
