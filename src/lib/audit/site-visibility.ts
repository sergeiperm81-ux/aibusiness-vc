/**
 * AI Website Visibility, the paid part: five assistants with live web search
 * asked about the site itself, not about the company behind it.
 *
 * The free check measures the homepage from outside. It cannot say what an
 * assistant actually finds when it goes looking. This does: every model is
 * asked the same two questions about the domain, and the sources it cites are
 * sorted into pages of the site and pages elsewhere. That split is the
 * measurement; the words are shown verbatim beside it.
 *
 * Paid orders only. Five models times two questions is ten searched answers,
 * a few cents each, which the free check could not carry past bot traffic.
 * An answer that does not come back is reported as missing, never dropped.
 */

import type { AnswerProvider, ProviderAnswer } from "./answer-attempt";
import { availableProviders, PERSON_PROVIDER_IDS } from "./answer-providers";
import { cleanCitations } from "./citation-cleanup";
import { summariseUsage, type CallUsage } from "./usage";

export type VisibilityQuestionId = "site" | "pages";

export interface VisibilityQuestion {
  readonly id: VisibilityQuestionId;
  readonly label: string;
  readonly question: string;
}

/** The two questions, both about the domain as a website. */
export function buildVisibilityQuestions(domain: string): readonly VisibilityQuestion[] {
  return [
    {
      id: "site",
      label: "What the site is",
      question:
        `Look up the website ${domain}. What is this site and what does it offer? ` +
        `Base your answer on pages of ${domain} itself and name the pages you used. ` +
        "If you cannot find or open the site, say so plainly.",
    },
    {
      id: "pages",
      label: "Which pages it can find",
      question:
        `Which pages of the website ${domain} can you find? ` +
        `List the addresses on ${domain} that you can see, with one line on what each page is about. ` +
        "If you find none, say so plainly.",
    },
  ];
}

export interface VisibilityAnswer {
  readonly questionId: VisibilityQuestionId;
  readonly ok: boolean;
  /** The assistant's own words. Empty when it did not answer. */
  readonly text: string;
  /** Why there is no answer, in words a buyer can read. */
  readonly missing?: string;
  readonly ownPages: readonly string[];
  readonly otherSources: readonly string[];
}

/**
 * What one assistant did with the site, across both questions.
 * - read: it cited at least one page of the site
 * - elsewhere: it answered from other sites only
 * - nothing: it answered with no sources at all
 * - no_answer: neither question came back
 */
export type SiteReach = "read" | "elsewhere" | "nothing" | "no_answer";

export interface ProviderVisibility {
  readonly providerLabel: string;
  readonly model: string;
  readonly reach: SiteReach;
  readonly ownPages: readonly string[];
  readonly otherSources: readonly string[];
  readonly answers: readonly VisibilityAnswer[];
}

export interface SiteVisibility {
  readonly domain: string;
  readonly checkedAt: string;
  readonly providers: readonly ProviderVisibility[];
  /** Our cost for the run, for the log. Never shown to the buyer. */
  readonly usd: number;
}

function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

/** True for the domain itself and any of its subdomains. */
export function isOwnPage(address: string, domain: string): boolean {
  try {
    const host = bareHost(new URL(address).hostname);
    const site = bareHost(domain);
    return host === site || host.endsWith(`.${site}`);
  } catch {
    return false;
  }
}

export function splitSources(
  citations: readonly string[],
  domain: string
): { readonly own: readonly string[]; readonly other: readonly string[] } {
  return {
    own: citations.filter((c) => isOwnPage(c, domain)),
    other: citations.filter((c) => !isOwnPage(c, domain)),
  };
}

export function reachOf(answers: readonly VisibilityAnswer[]): SiteReach {
  const answered = answers.filter((a) => a.ok);
  if (answered.length === 0) return "no_answer";
  if (answered.some((a) => a.ownPages.length > 0)) return "read";
  if (answered.some((a) => a.otherSources.length > 0)) return "elsewhere";
  return "nothing";
}

/** The buyer-facing reason an answer is missing. Provider error strings stay in the log. */
function missingReason(error: string | undefined): string {
  if (!error) return "The model did not answer.";
  if (/deadline/i.test(error)) return "No answer within the time allowed.";
  if (/HTTP 429/.test(error)) return "The model was over its rate limit.";
  if (/abort|timed out|timeout/i.test(error)) return "The request timed out.";
  return "The model returned an error.";
}

const NO_USAGE: readonly CallUsage[] = [];

/** Resolves to the answer, or to a missing one when the deadline passes first. */
function withDeadline(ask: Promise<ProviderAnswer>, ms: number, provider: AnswerProvider): Promise<ProviderAnswer> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<ProviderAnswer>((resolve) => {
    timer = setTimeout(
      () =>
        resolve({
          providerId: provider.id,
          providerLabel: provider.label,
          model: provider.model,
          askedAt: new Date().toISOString(),
          ok: false,
          text: "",
          citations: [],
          error: "deadline passed",
          usage: NO_USAGE,
        }),
      ms
    );
  });
  return Promise.race([ask, late]).finally(() => clearTimeout(timer));
}

export interface SiteVisibilityDeps {
  readonly providers: readonly AnswerProvider[];
  readonly clean: (citations: readonly string[]) => Promise<readonly string[]>;
  /** How long the whole run may take before the missing answers are written up as missing. */
  readonly deadlineMs: number;
  readonly now: () => Date;
}

/**
 * Leaves room inside the payment webhook's 300 seconds for the site check,
 * the Agent Card, the PDF and the email.
 */
export const VISIBILITY_DEADLINE_MS = 150_000;

export function productionVisibilityDeps(): SiteVisibilityDeps {
  return {
    providers: availableProviders(undefined, PERSON_PROVIDER_IDS),
    clean: cleanCitations,
    deadlineMs: VISIBILITY_DEADLINE_MS,
    now: () => new Date(),
  };
}

async function askOne(
  provider: AnswerProvider,
  question: VisibilityQuestion,
  domain: string,
  deps: SiteVisibilityDeps
): Promise<{ readonly answer: VisibilityAnswer; readonly usage: readonly CallUsage[] }> {
  const raw = await withDeadline(provider.ask(question.question, `visibility:${question.id}`), deps.deadlineMs, provider);
  if (!raw.ok) {
    if (raw.error) console.error(`[visibility] ${provider.label} ${question.id} ${domain}: ${raw.error}`);
    return {
      answer: { questionId: question.id, ok: false, text: "", missing: missingReason(raw.error), ownPages: [], otherSources: [] },
      usage: raw.usage,
    };
  }
  const cleaned = await deps.clean(raw.citations);
  const { own, other } = splitSources(cleaned, domain);
  return {
    answer: { questionId: question.id, ok: true, text: raw.text, ownPages: own, otherSources: other },
    usage: raw.usage,
  };
}

function unique(items: readonly string[]): readonly string[] {
  return [...new Set(items)];
}

/** Every provider, both questions, all at once. Never throws: a failed ask is a missing answer. */
export async function runSiteVisibility(domain: string, deps: SiteVisibilityDeps): Promise<SiteVisibility> {
  const checkedAt = deps.now().toISOString();
  const questions = buildVisibilityQuestions(domain);

  const perProvider = await Promise.all(
    deps.providers.map(async (provider) => {
      const results = await Promise.all(questions.map((q) => askOne(provider, q, domain, deps)));
      const answers = results.map((r) => r.answer);
      const row: ProviderVisibility = {
        providerLabel: provider.label,
        model: provider.model,
        reach: reachOf(answers),
        ownPages: unique(answers.flatMap((a) => a.ownPages)),
        otherSources: unique(answers.flatMap((a) => a.otherSources)),
        answers,
      };
      return { row, usage: results.flatMap((r) => r.usage) };
    })
  );

  const usd = summariseUsage(perProvider.flatMap((p) => p.usage)).conservativeEstimateUsd;
  return { domain, checkedAt, providers: perProvider.map((p) => p.row), usd };
}

export const REACH_WORDS: Readonly<Record<SiteReach, string>> = {
  read: "cited pages of the site",
  elsewhere: "answered from other sites only",
  nothing: "answered without citing any source",
  no_answer: "did not answer",
};
