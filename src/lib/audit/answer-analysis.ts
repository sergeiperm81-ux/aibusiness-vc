/**
 * The part a buyer is actually paying for: a verdict on each statement.
 *
 * Collecting answers is cheap. Deciding whether a given sentence agrees with
 * the company's own site is the work.
 *
 * The taxonomy is deliberately small, and it took two failed versions to get
 * here. An earlier one had "outdated", "unsupported" and "absent", which split
 * hairs the client could not act on and, worse, filed direct contradictions
 * under "unsupported": an assistant calling a paid service free, on a site that
 * prints the price, came out as merely unverified. Three states remain, and a
 * contradiction is now its own state rather than a shade of doubt.
 *
 * Two lessons from the first paid test are built in.
 *
 * An answer about a different entity with a similar name is not a list of
 * contradictions. The judge first says whether the answer is about this company
 * at all; if it is not, its statements are dropped here and the report shows
 * one finding, "described another entity", instead of ten.
 *
 * No quote, no contradiction. A site that simply does not mention a phone
 * number has not contradicted an answer that gives one. A "contradicted"
 * verdict that cannot quote the site is downgraded to unverified in code.
 *
 * One call per question, with both APIs' answers in it. Ten calls, one per
 * answer, sent the same site text ten times over for nothing. One call for the
 * whole report would let a single bad response wipe out every verdict.
 *
 * The judge sees only the site's own readable text, never what is true in the
 * world. The classification is model-assisted, not hand-verified, and the
 * report says so.
 */

import { randomUUID } from "node:crypto";
import { postJson } from "./paid-http";
import {
  failureMeasurement,
  makeUsage,
  type AttemptBounds,
  type CallUsage,
  type JournalSink,
  type MeasuredCounts,
} from "./usage";

/** Cheap model only. A more expensive one needs the owner's approval twice. */
export const JUDGE_MODEL = "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 120_000;
export const MAX_REFERENCE_CHARS = 24_000;
/** Two answers, up to six statements each. Enough that the JSON is not cut off mid-object. */
export const JUDGE_MAX_OUTPUT_TOKENS = 3_000;
/** The judge makes one attempt. It is never retried. */
export const JUDGE_ATTEMPTS = 1;

const UNSETTLED_OWNER_CHECK =
  "Your site does not settle this. Is it true, and if so, where do you say it?";

export type ClaimStatus =
  /** The site says the same thing. Nothing to do. */
  | "confirmed"
  /** The site says something different, and it can be quoted. This is the one to fix. */
  | "contradicted"
  /** The site does not settle it either way. Only the owner can. */
  | "unverified";

/** Why a statement contradicts the site, when the difference has a shape. */
export type ContradictionKind = "outdated" | "wrong" | null;

export interface Claim {
  /** The statement, in the assistant's own words. */
  readonly claim: string;
  readonly status: ClaimStatus;
  readonly kind: ContradictionKind;
  /** What the site says on the point, quoted, or null when it says nothing. */
  readonly siteSays: string | null;
  /** The reference page where the site addresses it. Not the origin of an error. */
  readonly siteSaysOn: string | null;
  readonly severity: "high" | "medium" | "low";
  /** Replacement wording, taken from what the site already states. Only for a contradiction. */
  readonly replacement: string | null;
  /** The question only the owner can settle. Only for "unverified". */
  readonly ownerCheck: string | null;
}

export interface AnalysedAnswer {
  readonly factId: string;
  readonly providerId: string;
  readonly ok: boolean;
  readonly claims: readonly Claim[];
  /**
   * Whether the judge read the answer as being about this company at all.
   * Null when there was no verdict. When false, claims is always empty.
   */
  readonly sameEntity: boolean | null;
  /** What the judge thinks the answer describes instead, when sameEntity is false. */
  readonly otherEntity: string | null;
  readonly error?: string;
}

export interface AnswerForJudging {
  readonly providerId: string;
  readonly text: string;
}

/**
 * The judge's brief, in two wordings. A person is judged against what they
 * state about themselves, which is not a website, so "website text" and
 * "company" would send the judge looking for the wrong thing.
 */
export function instructionsFor(kind: "company" | "person" = "company"): string {
  if (kind === "person") return PERSON_INSTRUCTIONS;
  return INSTRUCTIONS;
}

const INSTRUCTIONS = `You receive one question, the answers that up to two AI assistants gave to it, and the company's own website text. For each answer separately, compare it against the website text.

Judge every answer on its own. Never use one assistant's answer as evidence about the other's. The only evidence is the website text.

First, for each answer, decide whether it is about this company at all. If it describes a different company, TV channel, game, product, publication or anything else that merely shares a similar name, set "sameEntity" to false, name that other thing in "otherEntity", and return an empty "claims" list for that answer: statements about another entity are not contradictions of this website. Otherwise set "sameEntity" to true and "otherEntity" to null.

Then pull out only statements a buyer could act on wrongly: what the company does, who runs it, where it is, what the product is, who it is for, what it costs, how to reach it. Ignore commentary, advice, hedging, caveats, general background, and anything that is not a checkable claim about this company. If a statement is too vague to mislead anyone, leave it out.

Give each statement exactly one status:
- "confirmed": the website text says the same thing.
- "contradicted": the website text says something different about the same fact, and you can quote the words that say it. A price the website prices differently, a service the website charges for that the answer calls free, a wrong location, a wrong founder, or a renamed product. The website merely not mentioning something is never a contradiction.
- "unverified": the website text does not settle the point either way. It may still be true.

For a contradiction, set "kind":
- "outdated" when the website plainly shows a newer version of the same fact.
- "wrong" when the answer is simply different and there is no sign it was ever right.

Rules you must follow:
- Judge only against the website text given to you. You have no other knowledge of this company and must never use what you may remember about it.
- Status describes the statement against the website. It never means "the answer left something out". An assistant is not required to repeat a page, and a missing mention is not a fault.
- Before calling anything "unverified", search the website text again for the same fact in different words.
- "siteSays": quote the website whenever it agrees or disagrees, otherwise null. A contradiction without a quote is not a contradiction.
- "siteSaysOn": the "--- url ---" header of the section that quote came from, or null.
- "severity": "high" only when acting on the statement costs money or a decision, such as a wrong price, a paid service called free, a wrong country, a wrong contact, or a claim that the company sells nothing. "medium" when it misleads without costing a decision. "low" for detail.
- "replacement": set only for "contradicted", and only using what the website already states. Null otherwise. Never invent a fact.
- "ownerCheck": set only for "unverified". One short question the owner must answer, of the form "is this true, and if so where do you say it". Null otherwise.
- Never write "remove" or "delete" anywhere.
- Do not propose wording the website already uses. If the website already says it, the status is "confirmed".
- At most 6 statements per answer, the most consequential first. Fewer is better than padding.

Return one entry per answer you were given, using the exact provider id shown in its header.

Reply as JSON: {"answers":[{"providerId":string,"sameEntity":boolean,"otherEntity":string|null,"claims":[{"claim":string,"status":string,"kind":string|null,"siteSays":string|null,"siteSaysOn":string|null,"severity":string,"replacement":string|null,"ownerCheck":string|null}]}]}`;

const PERSON_INSTRUCTIONS = `You receive one question, the answers that up to two AI assistants gave to it, and the reference text about one person: what they state about themselves, their public profile where it could be read, and their company's website where they have one. For each answer separately, compare it against the reference text.

Judge every answer on its own. Never use one assistant's answer as evidence about the other's. The only evidence is the reference text.

First, for each answer, decide whether it is about this person at all. If it describes a different person who merely shares the name, or a company, product or publication with a similar name, set "sameEntity" to false, name that other person or thing in "otherEntity", and return an empty "claims" list for that answer: statements about someone else are not contradictions. Otherwise set "sameEntity" to true and "otherEntity" to null.

Then pull out only statements a potential client could act on wrongly: what the person does, their role and company, where they are based, what services or help they offer, who they work with, what they are known for, how to reach them. Ignore commentary, advice, hedging, caveats, general background, and anything that is not a checkable claim about this person. If a statement is too vague to mislead anyone, leave it out.

Give each statement exactly one status:
- "confirmed": the reference text says the same thing.
- "contradicted": the reference text says something different about the same fact, and you can quote the words that say it. A wrong role, a wrong company, a wrong country, a service the person does not offer, or a former position presented as current. The reference merely not mentioning something is never a contradiction.
- "unverified": the reference text does not settle the point either way. It may still be true.

For a contradiction, set "kind":
- "outdated" when the reference plainly shows a newer version of the same fact, such as a current role that replaced the one named.
- "wrong" when the answer is simply different and there is no sign it was ever right.

Rules you must follow:
- Judge only against the reference text given to you. You have no other knowledge of this person and must never use what you may remember about them.
- Status describes the statement against the reference. It never means "the answer left something out". An assistant is not required to repeat a profile, and a missing mention is not a fault.
- Before calling anything "unverified", search the reference text again for the same fact in different words.
- "siteSays": quote the reference whenever it agrees or disagrees, otherwise null. A contradiction without a quote is not a contradiction.
- "siteSaysOn": the "--- label ---" header of the section that quote came from, or null.
- "severity": "high" only when acting on the statement costs money or a decision, such as a wrong company, a service the person does not offer, a wrong country, a wrong contact, or a claim that the person no longer works in the field. "medium" when it misleads without costing a decision. "low" for detail.
- "replacement": set only for "contradicted", and only using what the reference already states. Null otherwise. Never invent a fact.
- "ownerCheck": set only for "unverified". One short question the person must answer, of the form "is this true, and if so where do you say it publicly". Null otherwise.
- Never write "remove" or "delete" anywhere.
- Do not propose wording the reference already uses. If the reference already says it, the status is "confirmed".
- At most 6 statements per answer, the most consequential first. Fewer is better than padding.

Return one entry per answer you were given, using the exact provider id shown in its header.

Reply as JSON: {"answers":[{"providerId":string,"sameEntity":boolean,"otherEntity":string|null,"claims":[{"claim":string,"status":string,"kind":string|null,"siteSays":string|null,"siteSaysOn":string|null,"severity":string,"replacement":string|null,"ownerCheck":string|null}]}]}`;

/** Characters over three, which overstates tokens for English prose on purpose. */
function tokensUpperBound(chars: number): number {
  return Math.ceil(chars / 3);
}

/** The most a judge call can consume, given exactly what is about to be sent. */
export function judgeBoundsForChars(chars: number): AttemptBounds {
  return {
    maxInputTokens: tokensUpperBound(chars),
    maxOutputTokens: JUDGE_MAX_OUTPUT_TOKENS,
    maxWebSearches: 0,
  };
}

/**
 * The most a judge call can consume, before any answer exists: the
 * instructions, the question, every answer at its output cap, and the site
 * text at its cap.
 */
export function judgeBoundsForPlan(
  question: string,
  answers: number,
  answerMaxTokens: number
): AttemptBounds {
  const fixedChars =
    Math.max(INSTRUCTIONS.length, PERSON_INSTRUCTIONS.length) + question.length + MAX_REFERENCE_CHARS + 400;
  return {
    maxInputTokens: tokensUpperBound(fixedChars) + answers * answerMaxTokens,
    maxOutputTokens: JUDGE_MAX_OUTPUT_TOKENS,
    maxWebSearches: 0,
  };
}

interface JudgeResponse {
  id?: string;
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

interface RawClaim {
  claim?: unknown;
  status?: unknown;
  kind?: unknown;
  siteSays?: unknown;
  siteSaysOn?: unknown;
  severity?: unknown;
  replacement?: unknown;
  ownerCheck?: unknown;
}

interface RawAnswerVerdict {
  providerId?: unknown;
  sameEntity?: unknown;
  otherEntity?: unknown;
  claims?: RawClaim[];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asStatus(value: unknown): ClaimStatus {
  return value === "confirmed" || value === "contradicted" ? value : "unverified";
}

function asSeverity(value: unknown): Claim["severity"] {
  return value === "high" || value === "low" ? value : "medium";
}

function normalise(raw: RawClaim): Claim | null {
  const claim = asString(raw.claim);
  if (!claim) return null;
  const siteSays = asString(raw.siteSays);
  const judged = asStatus(raw.status);
  // No quote, no contradiction. Enforced here because the judge broke the rule
  // three times in the first paid test, on contact details the site never
  // denied having.
  const status: ClaimStatus = judged === "contradicted" && !siteSays ? "unverified" : judged;
  const replacement = status === "contradicted" ? asString(raw.replacement) : null;
  const ownerCheck =
    status === "unverified" ? asString(raw.ownerCheck) ?? UNSETTLED_OWNER_CHECK : null;
  const rawKind = asString(raw.kind);
  const kind: ContradictionKind =
    status === "contradicted" && (rawKind === "outdated" || rawKind === "wrong")
      ? rawKind
      : null;
  return {
    claim,
    status,
    kind,
    siteSays,
    siteSaysOn: asString(raw.siteSaysOn),
    severity: asSeverity(raw.severity),
    replacement,
    ownerCheck,
  };
}

export interface QuestionVerdicts {
  readonly analyses: readonly AnalysedAnswer[];
  /** Null when no call was made, because there was nothing to judge. */
  readonly usage: CallUsage | null;
}

/**
 * Judges every answer to one question in a single call.
 *
 * An answer with empty text is not sent: that covers failed requests and the
 * non-answers recognised beforehand. The attempt is journalled before the
 * request leaves and again when it ends.
 */
export async function analyseQuestion(args: {
  readonly factId: string;
  readonly question: string;
  readonly answers: readonly AnswerForJudging[];
  readonly reference: string;
  readonly apiKey: string;
  readonly onJournal?: JournalSink;
  /** Who the reference describes. Defaults to a company. */
  readonly subjectKind?: "company" | "person";
}): Promise<QuestionVerdicts> {
  const instructions = instructionsFor(args.subjectKind);
  const referenceLabel =
    args.subjectKind === "person"
      ? "THE REFERENCE TEXT ABOUT THIS PERSON"
      : "THE COMPANY'S OWN WEBSITE TEXT";
  const notAnalysed = (providerId: string, error: string): AnalysedAnswer => ({
    factId: args.factId,
    providerId,
    ok: false,
    claims: [],
    sameEntity: null,
    otherEntity: null,
    error,
  });
  const failAll = (error: string, usage: CallUsage | null): QuestionVerdicts => ({
    analyses: args.answers.map((a) => notAnalysed(a.providerId, error)),
    usage,
  });

  const judged = args.answers.filter((a) => a.text.trim().length > 0);
  if (judged.length === 0) return failAll("no answer to analyse", null);
  if (!args.reference.trim()) return failAll("no site text to compare against", null);

  const answerBlocks = judged
    .map((a) => `ANSWER FROM PROVIDER "${a.providerId}"\n${a.text}`)
    .join("\n\n");
  const userContent =
    `QUESTION ASKED\n${args.question}\n\n` +
    `${answerBlocks}\n\n` +
    `${referenceLabel}\n${args.reference.slice(0, MAX_REFERENCE_CHARS)}`;

  const clientRequestId = randomUUID();
  const bounds = judgeBoundsForChars(instructions.length + userContent.length);
  const startedAt = new Date().toISOString();
  const began = Date.now();

  // Written before the request leaves, so a crash mid-call still leaves a trace.
  args.onJournal?.({
    event: "started",
    clientRequestId,
    provider: "openai",
    model: JUDGE_MODEL,
    purpose: "judge",
    factId: args.factId,
    attemptNumber: 1,
    startedAt,
    bounds,
  });

  const result = await postJson(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${args.apiKey}`, "X-Client-Request-Id": clientRequestId },
    {
      model: JUDGE_MODEL,
      response_format: { type: "json_object" },
      max_completion_tokens: JUDGE_MAX_OUTPUT_TOKENS,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: userContent },
      ],
    },
    REQUEST_TIMEOUT_MS
  );

  const record = (measured: MeasuredCounts, bodyId: string | null): CallUsage => {
    const usage = makeUsage({
      clientRequestId,
      provider: "openai",
      model: JUDGE_MODEL,
      purpose: "judge",
      factId: args.factId,
      attemptNumber: 1,
      startedAt,
      durationMs: Date.now() - began,
      providerRequestId: result.requestId ?? bodyId,
      httpStatus: result.status,
      outcome: result.ok ? "ok" : result.outcome,
      bounds,
      ...measured,
    });
    args.onJournal?.({ event: "finished", usage });
    return usage;
  };

  if (!result.ok) return failAll(result.error, record(failureMeasurement(), null));

  const payload = result.json as JudgeResponse;
  const usage = record(
    payload.usage
      ? {
          tokenMeasurement: "reported",
          searchMeasurement: "none",
          inputTokens: payload.usage.prompt_tokens ?? 0,
          outputTokens: payload.usage.completion_tokens ?? 0,
          webSearches: 0,
        }
      : failureMeasurement(),
    payload.id ?? null
  );

  const content = payload.choices?.[0]?.message?.content;
  if (!content) return failAll("empty judge response", usage);

  // Parsed on its own so a malformed reply still carries the usage it cost.
  let verdicts: RawAnswerVerdict[];
  try {
    verdicts = (JSON.parse(content) as { answers?: RawAnswerVerdict[] }).answers ?? [];
  } catch {
    return failAll("the judge returned malformed JSON", usage);
  }

  const analyses = args.answers.map((answer): AnalysedAnswer => {
    if (!answer.text.trim()) return notAnalysed(answer.providerId, "no answer to analyse");
    const verdict = verdicts.find((v) => asString(v.providerId) === answer.providerId);
    if (!verdict) {
      return notAnalysed(answer.providerId, "the judge returned no verdict for this answer");
    }
    const sameEntity = typeof verdict.sameEntity === "boolean" ? verdict.sameEntity : null;
    // Statements about another entity are dropped here, whatever the judge
    // returned for them, so they can never be counted as contradictions.
    const claims =
      sameEntity === false
        ? []
        : (verdict.claims ?? []).map(normalise).filter((c): c is Claim => c !== null);
    return {
      factId: args.factId,
      providerId: answer.providerId,
      ok: true,
      claims,
      sameEntity,
      otherEntity: sameEntity === false ? asString(verdict.otherEntity) : null,
    };
  });
  return { analyses: enforceQuotedContradictions(analyses, args.reference), usage };
}

function comparable(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u201c\u201d\u2018\u2019"'`]/g, "")
    .replace(/^\s*(?:\.\.\.|\u2026)\s*|\s*(?:\.\.\.|\u2026)\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Words a judge uses when it describes the reference instead of quoting it. */
const NOT_A_QUOTE = /\b(?:reference text|website text|does not mention|doesn't mention|no mention of|not mentioned|does not say|does not state)\b/i;

/**
 * True when the quoted text actually appears in the reference.
 *
 * The second person test caught the judge filling "siteSays" with "The
 * reference text does not mention SAP SuccessFactors" and calling it a
 * contradiction. That is an absence, and absence is never a contradiction.
 * The start of the quote must be found in the reference, whitespace and
 * quotation marks aside.
 */
export function isQuotedFrom(reference: string, quoted: string | null): boolean {
  if (!quoted || NOT_A_QUOTE.test(quoted)) return false;
  const q = comparable(quoted);
  if (q.length < 8) return false;
  const r = comparable(reference);
  return r.includes(q) || r.includes(q.slice(0, 40));
}

/** Downgrades every contradiction whose quote is not in the reference. */
export function enforceQuotedContradictions(
  analyses: readonly AnalysedAnswer[],
  reference: string
): readonly AnalysedAnswer[] {
  return analyses.map((analysis) => ({
    ...analysis,
    claims: analysis.claims.map((claim): Claim => {
      if (claim.status !== "contradicted" || isQuotedFrom(reference, claim.siteSays)) return claim;
      return {
        ...claim,
        status: "unverified",
        kind: null,
        siteSays: null,
        siteSaysOn: null,
        replacement: null,
        ownerCheck: UNSETTLED_OWNER_CHECK,
      };
    }),
  }));
}

const SEVERITY_RANK: Record<Claim["severity"], number> = { high: 0, medium: 1, low: 2 };

function bySeverity(a: Claim, b: Claim): number {
  return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
}

/** Statements the site itself contradicts, highest consequence first. */
export function contradictions(analyses: readonly AnalysedAnswer[]): readonly Claim[] {
  return analyses
    .flatMap((a) => a.claims)
    .filter((c) => c.status === "contradicted")
    .slice()
    .sort(bySeverity);
}

/** Statements only the owner can settle, because the site is silent on them. */
export function ownerQuestions(analyses: readonly AnalysedAnswer[]): readonly Claim[] {
  return analyses
    .flatMap((a) => a.claims)
    .filter((c) => c.status === "unverified" && c.ownerCheck)
    .slice()
    .sort(bySeverity);
}

/** The single clearest contradiction, for the free preview, when there is no bigger finding. */
export function headlineContradiction(analyses: readonly AnalysedAnswer[]): Claim | null {
  const found = contradictions(analyses);
  return found.find((c) => c.siteSays) ?? found[0] ?? null;
}
