/**
 * AI Company Scan: the same five models and the same three questions a person
 * scan asks, turned to a company. Someone about to sign with a supplier or a
 * partner asks who is behind it, what it really does, and whether there are
 * red flags. The ids stay "who", "does" and "reputation", so the worker, the
 * summary and the report treat both scans alike.
 */

import type { AnswerCheckSubject, FactQuestion } from "./answer-check";
import { buildPersonQuestions, cleanDomain, toAnswerSubject, type PersonSubject } from "./person-check";

export type ScanKind = "person" | "company";

export function scanKind(subject: { readonly kind?: ScanKind }): ScanKind {
  return subject.kind === "company" ? "company" : "person";
}

/** How the company is named in every question: name, what it does, its site. */
export function companyHandle(subject: PersonSubject): string {
  const domain = cleanDomain(subject.companyDomain || subject.profileUrl);
  const what = subject.role.trim();
  return `${subject.name.trim()}${what ? `, ${what}` : ""}${domain ? ` (${domain})` : ""}`;
}

export function buildCompanyQuestions(subject: PersonSubject): readonly FactQuestion[] {
  const who = companyHandle(subject);
  return [
    {
      id: "who",
      label: "Who is behind the company",
      blind: false,
      question:
        `Who is behind ${who}? What is its legal name, when and where was it founded, who owns and runs it today, ` +
        "where is it based and registered, and how can someone get in touch with it?",
    },
    {
      id: "does",
      label: "What the company does",
      blind: false,
      question:
        `What does ${who} do? What does it sell or offer, at what prices where they are public, who are its customers, ` +
        "and which companies or projects is it connected to? What has it published or announced most recently, where, and on what date?",
    },
    {
      id: "reputation",
      label: "Red flags about working with the company",
      blind: false,
      question:
        `I am thinking of working with ${who}. Are there any red flags about working with this company? Look into it for me. ` +
        "What is its reputation? Are there customer reviews, complaints, lawsuits, regulatory actions, scam warnings or other warning signs I should know about, " +
        "and is there any reason not to work with it? Say where each point comes from, and if you find nothing, say so plainly.",
    },
  ];
}

/** The three questions for whichever scan the order is. */
export function buildScanQuestions(subject: PersonSubject): readonly FactQuestion[] {
  return scanKind(subject) === "company" ? buildCompanyQuestions(subject) : buildPersonQuestions(subject);
}

/** The subject as the shared machinery understands it. A company is checked as a company. */
export function toScanSubject(subject: PersonSubject): AnswerCheckSubject {
  if (scanKind(subject) === "person") return toAnswerSubject(subject);
  const domain = cleanDomain(subject.companyDomain || subject.profileUrl);
  return {
    kind: "company",
    domain,
    brand: subject.name.trim(),
    product: subject.role.trim(),
    category: subject.category?.trim() ?? "",
    recommendAs: "companies",
    profileUrl: `https://${domain}`,
  };
}
