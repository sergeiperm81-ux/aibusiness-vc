/**
 * What the assistants currently say about a person, not a company.
 *
 * Same machinery as the company check: one fresh request per question to each
 * provider, a blind question that never says the name. What changes is the
 * subject and the questions. A person is identified to the assistants by
 * name, role, company and their public profile address, because "Sergei
 * Ponomarev" alone is several people and the point is to find out what is
 * said about this one.
 *
 * The reference the answers are judged against is what the person states
 * about themselves: the form they filled in, their public profile when it can
 * be read without logging in (rarely), and their company's site when they
 * have one. See person-facts.ts.
 */

import type { AnswerCheckSubject, FactQuestion } from "./answer-check";

export interface PersonSubject {
  readonly name: string;
  readonly role: string;
  readonly company: string;
  /** A personal social profile (see social-profile.ts). It says which person this is; it is never read with a login. */
  readonly profileUrl: string;
  /** One line in the person's own words, optional. Part of the reference. */
  readonly oneLiner?: string;
  /** The company's site, when there is one. Read as part of the reference. */
  readonly companyDomain?: string;
  /** The field the person works in, a few words. Not used by the three questions; kept for the service tier. */
  readonly category?: string;
  readonly market?: string;
  /** What the blind question asks for: "consultants", "experts", "advisors". */
  readonly recommendAs?: string;
}

/** Trims a domain to its bare host, or returns an empty string. */
export function cleanDomain(value: string | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[/?#].*$/, "");
}

/** Normalises a LinkedIn address so two spellings of one profile compare equal. */
export function cleanProfileUrl(value: string): string {
  const trimmed = value.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    const path = url.pathname.replace(/\/+$/, "");
    return `https://${url.hostname.replace(/^www\./, "www.")}${path}`;
  } catch {
    return trimmed;
  }
}

/** How the person is named in every question that names them. */
export function personHandle(person: PersonSubject): string {
  const company = person.company.trim();
  const role = person.role.trim();
  const at = role && company ? `${role} at ${company}` : role || company;
  return `${person.name.trim()}${at ? `, ${at}` : ""} (${cleanProfileUrl(person.profileUrl)})`;
}

/** The person as the generic subject the shared machinery understands. */
export function toAnswerSubject(person: PersonSubject): AnswerCheckSubject {
  return {
    kind: "person",
    domain: cleanDomain(person.companyDomain),
    brand: person.name.trim(),
    product: [person.role.trim(), person.company.trim()].filter(Boolean).join(" at "),
    category: person.category?.trim() ?? "",
    market: person.market?.trim() || undefined,
    recommendAs: person.recommendAs?.trim() || "consultants or experts",
    profileUrl: cleanProfileUrl(person.profileUrl),
  };
}

/**
 * Three questions, asked of five assistants: fifteen answers a person will
 * actually read. All three name the person, because that is how a person is
 * really looked up: by someone who has the name and wants to know who this is,
 * what they do, and whether to deal with them.
 *
 * There is no blind question here. "Who is notable in your field" names a few
 * stars and nobody else, so nine buyers in ten would learn only that they are
 * not one. It belongs to the done-for-you service, measured before and after.
 */
export function buildPersonQuestions(person: PersonSubject): readonly FactQuestion[] {
  const who = personHandle(person);
  return [
    {
      id: "who",
      label: "Who you are",
      blind: false,
      question: `Who is ${who}? Where are they based, what is their background and education, which degrees, certificates or licences do they hold, what are they known for, and how can someone get in touch with them?`,
    },
    {
      id: "does",
      label: "What you do as a professional",
      blind: false,
      // Open on purpose. It offers no list of roles to pick from: a founder, a
      // recruiter, a designer and an advisor are all one question, and which
      // role each assistant settles on is the finding.
      question:
        `What does ${who} do as a professional? What is their role and position today, which companies or projects are they connected to, and what do they offer or work on? ` +
        "What have they published or posted most recently, where, and on what date?",
    },
    {
      id: "reputation",
      label: "Red flags: what someone checking you out is told",
      blind: false,
      // Asked the way it is asked in life: by someone about to deal with the
      // person. Asking for sources and for a plain "nothing found" keeps an
      // assistant from filling the gap with a namesake or a guess.
      question:
        `I am thinking of working with ${who}. Are there any red flags about working with them? Look into them for me. What is their professional reputation? ` +
        "Are there any reviews, public feedback, disputes, controversies or warning signs I should know about, " +
        "and is there any reason not to work with them? Say where each point comes from, and if you find nothing, say so plainly.",
    },
  ];
}
