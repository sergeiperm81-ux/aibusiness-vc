/**
 * What the assistants currently say about a company.
 *
 * Six facts, asked of each provider in its own request. Five of them name the
 * company; the sixth never does. That last one is the only question a buyer who
 * has never heard of the company would actually type, and it is deliberately
 * kept separate in the output: we measure it, we show who gets named instead,
 * and we promise nothing about changing it.
 *
 * Nothing here is scored. A model's answer varies between runs, so a number
 * would imply a precision that does not exist. The deliverable is the verbatim
 * answer, its sources, and the date.
 *
 * The wording of the questions is part of the method, and the first paid test
 * showed how much it matters. "Which companies would you recommend for a
 * website for tennis news" was read as a request for web agencies. "How is the
 * magazine priced" presupposed a magazine and a price, and sent the models off
 * looking for a subscription. Questions now avoid presupposing what they check.
 */

import {
  availableProviders,
  type AnswerProvider,
  type ProviderAnswer,
} from "./answer-providers";

/** How many requests are in flight at once. Keeps a report under a minute without tripping rate limits. */
const CONCURRENCY = 4;

export type FactId =
  | "what"
  | "who-and-where"
  | "product"
  | "price"
  | "contact"
  | "recommendation"
  // The person variant, see person-check.ts.
  | "who"
  | "does"
  | "services"
  | "expertise"
  | "reputation";

export type SubjectKind = "company" | "person";

export interface FactQuestion {
  readonly id: FactId;
  readonly label: string;
  /** True for the one question that never names the company. */
  readonly blind: boolean;
  readonly question: string;
}

export interface FactResult {
  readonly fact: FactQuestion;
  readonly answers: readonly ProviderAnswer[];
}

export interface AnswerCheckSubject {
  /** Defaults to "company". A person is checked against what they state about themselves. */
  readonly kind?: SubjectKind;
  /**
   * The site read as the reference. For a person this is their company's
   * domain when they have one, and may be empty.
   */
  readonly domain: string;
  /**
   * The name a person would use out loud, which is not always the domain.
   *
   * A site and the thing that owns it are not the same object, and the report
   * keeps them apart: the owner may be a company or a single person with no
   * company at all, and an assistant asked about a domain will answer about
   * whichever of the two it can find.
   */
  readonly brand: string;
  /**
   * The principal product, in the words the site itself uses. Two of the six
   * questions are about it, so a description the site does not use (a
   * "magazine" for a site that calls itself a platform) plants a false premise.
   */
  readonly product: string;
  /** What the client wants to be found for. Used only in the blind question. */
  readonly category: string;
  /** Optional market, appended to the blind question when given. */
  readonly market?: string;
  /**
   * What the blind question asks to be recommended: "companies" for a firm that
   * sells a service, "websites" for a publication, "apps" for an app. Asking a
   * media site's category for "companies" gets web agencies back.
   */
  readonly recommendAs?: string;
  /** A person's public profile address, used only to identify them in the questions. */
  readonly profileUrl?: string;
  /** Where the preview placed the person. An answer that puts them somewhere else by a registry number is about someone else. */
  readonly location?: string;
}

export interface AnswerCheck {
  readonly subject: AnswerCheckSubject;
  readonly checkedAt: string;
  readonly providers: readonly { id: string; label: string; model: string }[];
  readonly results: readonly FactResult[];
}

export function buildQuestions(subject: AnswerCheckSubject): readonly FactQuestion[] {
  const who = `${subject.brand} (${subject.domain})`;
  const market = subject.market ? ` in ${subject.market}` : "";
  const recommendAs = subject.recommendAs?.trim() || "companies";
  return [
    {
      id: "what",
      label: "What the company does",
      blind: false,
      question: `What does ${who} do?`,
    },
    {
      id: "who-and-where",
      label: "Who runs it, and where it is based",
      blind: false,
      question: `Who founded or runs ${who}, and where is it based?`,
    },
    {
      id: "product",
      label: "What the product does, and who it is for",
      blind: false,
      question: `What does ${subject.product}, from ${who}, do, and who is it for?`,
    },
    {
      // Deliberately does not assume a price exists. "How is it priced" sent a
      // model hunting for a subscription to a free site.
      id: "price",
      label: "Whether and how it is paid for",
      blind: false,
      question: `Is ${subject.product}, from ${who}, free, subscription-based, or paid for in another way, and what does it cost?`,
    },
    {
      id: "contact",
      label: "How to contact it",
      blind: false,
      question: `How does a customer contact ${who}?`,
    },
    {
      // The company is never named here. Naming it would tell the model the
      // answer we want, and the whole point is to find out whether it comes up
      // on its own.
      id: "recommendation",
      label: "Whether it comes up unprompted",
      blind: true,
      question: `Which ${recommendAs} would you recommend for ${subject.category}${market}?`,
    },
  ];
}

interface Job {
  readonly fact: FactQuestion;
  readonly provider: AnswerProvider;
}

/** Runs jobs with a fixed number in flight, preserving nothing about order. */
async function runPool(
  jobs: readonly Job[],
  limit: number
): Promise<readonly { job: Job; answer: ProviderAnswer }[]> {
  const out: { job: Job; answer: ProviderAnswer }[] = [];
  let next = 0;
  async function worker(): Promise<void> {
    for (;;) {
      const index = next;
      next += 1;
      const job = jobs[index];
      if (!job) return;
      const answer = await job.provider.ask(job.fact.question, job.fact.id);
      out.push({ job, answer });
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, jobs.length) }, () => worker())
  );
  return out;
}

export async function runAnswerCheck(
  subject: AnswerCheckSubject,
  providers: readonly AnswerProvider[] = availableProviders(),
  /** The questions to ask. Companies use buildQuestions; people use buildPersonQuestions. */
  questions: readonly FactQuestion[] = buildQuestions(subject)
): Promise<AnswerCheck> {
  if (providers.length === 0) {
    throw new Error("No provider keys available: set OPENAI_API_KEY or ANTHROPIC_API_KEY");
  }

  const facts = questions;
  const jobs: Job[] = facts.flatMap((fact) =>
    providers.map((provider) => ({ fact, provider }))
  );
  const completed = await runPool(jobs, CONCURRENCY);

  const results: FactResult[] = facts.map((fact) => ({
    fact,
    // Providers keep their declared order in every row, so the table reads
    // down a column as one assistant rather than as whichever answered first.
    answers: providers.map((provider) => {
      const hit = completed.find(
        (c) => c.job.fact.id === fact.id && c.job.provider.id === provider.id
      );
      return (
        hit?.answer ?? {
          providerId: provider.id,
          providerLabel: provider.label,
          model: provider.model,
          askedAt: new Date().toISOString(),
          ok: false,
          text: "",
          citations: [],
          error: "not run",
          usage: [],
        }
      );
    }),
  }));

  return {
    subject,
    checkedAt: new Date().toISOString(),
    providers: providers.map((p) => ({ id: p.id, label: p.label, model: p.model })),
    results,
  };
}
