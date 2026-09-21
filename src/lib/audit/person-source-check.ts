/**
 * Which cited pages are really about the person, checked by what the page
 * says, before any of it reaches the summary model or the report.
 *
 * A page counts only when its text carries the person's full name and at
 * least one stable detail from the profile: the company, the role or the
 * city. A name in an address proves nothing, and two models citing the same
 * page can repeat the same mistake, so neither counts. The profile itself is
 * trusted as given. A page that cannot be read (a login wall, a PDF, a
 * timeout) is not listed: nothing shows it is about this person.
 *
 * Pages are fetched with the same guarded fetch as the site scan: public
 * addresses only, capped in size and time.
 */

import type { AnswerCheck } from "./answer-check";

export interface ProfileAnchors {
  readonly name: string;
  readonly profileUrl: string;
  /** Company, role, city: any one of them next to the full name ties a page to the person. */
  readonly details: readonly string[];
  /** For a company scan: pages on the company's own site are its own words, trusted as given. */
  readonly ownDomain?: string;
}

/** Reads a page's visible text, or null when it cannot be read. */
export type PageReader = (address: string) => Promise<string | null>;

const MAX_PAGES = 80;
const CONCURRENCY = 8;

function normalise(text: string): string {
  return ` ${text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, " ")
    .trim()} `;
}

/** The details worth matching: a role of one generic word ("Founder") ties nothing. */
export function anchorsFor(subject: {
  readonly kind?: "person" | "company";
  readonly name: string;
  readonly profileUrl: string;
  readonly company?: string;
  readonly role?: string;
  readonly location?: string;
  readonly companyDomain?: string;
}): ProfileAnchors {
  if (subject.kind === "company") {
    // A company is tied by its name next to its own domain, its legal name or its city.
    const domain = (subject.companyDomain ?? "").toLowerCase();
    const details = [domain, subject.company, subject.location]
      .map((value) => (value ?? "").trim())
      .filter((value) => normalise(value).trim().length >= 3);
    return { name: subject.name, profileUrl: subject.profileUrl, details, ownDomain: domain || undefined };
  }
  const candidates = [subject.company, subject.location, subject.role]
    .map((value) => (value ?? "").trim())
    .filter((value) => normalise(value).trim().length >= 3);
  const details = candidates.filter((value) => value !== subject.role || normalise(value).trim().split(" ").length >= 2);
  return { name: subject.name, profileUrl: subject.profileUrl, details };
}

export function pageTiedToPerson(pageText: string, anchors: ProfileAnchors): boolean {
  const text = normalise(pageText);
  const name = normalise(anchors.name);
  const reversed = ` ${name.trim().split(" ").reverse().join(" ")} `;
  if (name.trim().length === 0 || (!text.includes(name) && !text.includes(reversed))) return false;
  return anchors.details.some((detail) => text.includes(normalise(detail)));
}

/** The same profile, whatever the country subdomain, "www" or trailing slash. */
export function isTheProfile(address: string, profileUrl: string): boolean {
  const key = (value: string): string | null => {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^[a-z]{2}\.linkedin\.com$/, "linkedin.com");
      return `${host}${decodeURI(url.pathname).toLowerCase().replace(/\/+$/, "")}`;
    } catch {
      return null;
    }
  };
  const a = key(address);
  return a !== null && a === key(profileUrl);
}

function onDomain(address: string, domain: string): boolean {
  try {
    const host = new URL(address).hostname.toLowerCase().replace(/^www\./, "");
    return host === domain || host.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

async function inBatches<T, R>(items: readonly T[], size: number, run: (item: T) => Promise<R>): Promise<readonly R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(run))));
  }
  return out;
}

/**
 * The check with every answer's sources cut to the pages tied to the person.
 * How many were held back is kept on each answer, so the report can say so.
 */
export async function keepSourcesAboutPerson(
  check: AnswerCheck,
  anchors: ProfileAnchors,
  read: PageReader
): Promise<AnswerCheck> {
  const all = [...new Set(check.results.flatMap((row) => row.answers.flatMap((a) => a.citations)))];
  const trusted = (address: string): boolean =>
    isTheProfile(address, anchors.profileUrl) || (anchors.ownDomain !== undefined && onDomain(address, anchors.ownDomain));
  const toRead = all.filter((address) => !trusted(address)).slice(0, MAX_PAGES);
  const verdicts = await inBatches(toRead, CONCURRENCY, async (address) => {
    try {
      const text = await read(address);
      return [address, text !== null && pageTiedToPerson(text, anchors)] as const;
    } catch {
      return [address, false] as const;
    }
  });
  const tied = new Set([
    ...all.filter(trusted),
    ...verdicts.filter(([, ok]) => ok).map(([address]) => address),
  ]);
  return {
    ...check,
    results: check.results.map((row) => ({
      ...row,
      answers: row.answers.map((answer) => {
        const kept = answer.citations.filter((c) => tied.has(c));
        return { ...answer, citations: kept, heldCitations: (answer.heldCitations ?? 0) + answer.citations.length - kept.length };
      }),
    })),
  };
}
