/**
 * What every answer provider shares: the shape of an answer, the caps sent
 * with every request, the retry rule, and the two journal lines written around
 * each HTTP attempt.
 *
 * Kept apart from the providers themselves so that adding one is a file of its
 * own and never a change to how attempts are counted.
 */

import { randomUUID } from "node:crypto";
import type { PostResult } from "./paid-http";
import {
  makeUsage,
  type AttemptBounds,
  type CallUsage,
  type JournalSink,
  type MeasuredCounts,
  type UsageProvider,
} from "./usage";

export const REQUEST_TIMEOUT_MS = 90_000;

/**
 * Attempts per question, and why there is more than one.
 *
 * A web-search answer takes tens of seconds and sometimes times out or comes
 * back rate-limited. Without a retry the buyer silently receives eleven answers
 * out of twelve and has no way to know which one is missing or why.
 */
export const ANSWER_ATTEMPTS = 2;
const RETRY_DELAY_MS = 4_000;

/** Hard caps sent to both providers on every request. */
export const SEARCHES_PER_REQUEST = 1;
export const ANSWER_MAX_OUTPUT_TOKENS = 2_000;

/**
 * Anthropic, Google and xAI return search results as input tokens and do not
 * cap their size. This is an assumption for the conservative estimate, not a
 * bound any API enforces.
 */
export const ASSUMED_RESULT_TOKENS_PER_SEARCH = 20_000;
/** Tool system prompt for Haiku 4.5 per Anthropic's pricing page (496 or 588), rounded up. */
const ANTHROPIC_TOOL_PROMPT_TOKENS = 600;
/** The other providers do not publish their tool overhead; an allowance, not a measurement. */
const TOOL_ALLOWANCE_TOKENS = 600;
/**
 * Google bills per search query and lets the model run several for one prompt,
 * with no request field to cap them. Three is an assumption for the estimate.
 */
export const GOOGLE_ASSUMED_QUERIES_PER_REQUEST = 3;

/**
 * xAI accepts max_tool_calls and does not hold to it: the first live request,
 * sent with a cap of 1, was billed 3 web search calls and 18,389 input tokens.
 * Five calls of 10,000 tokens each is an assumption above that measurement.
 */
export const XAI_ASSUMED_TOOL_CALLS = 5;
export const XAI_ASSUMED_RESULT_TOKENS_PER_CALL = 10_000;

/** The most one answer attempt can consume. Characters over three overstates tokens on purpose. */
export function answerBounds(provider: UsageProvider, question: string): AttemptBounds {
  const questionTokens = Math.ceil(question.length / 3) + 50;
  const output = { maxOutputTokens: ANSWER_MAX_OUTPUT_TOKENS };
  switch (provider) {
    case "openai":
      // OpenAI's fixed search content block is added in usage.ts, not here.
      return { ...output, maxInputTokens: questionTokens + TOOL_ALLOWANCE_TOKENS, maxWebSearches: SEARCHES_PER_REQUEST };
    case "perplexity":
      // Sonar bills the prompt and the answer; search results are covered by the request fee.
      return { ...output, maxInputTokens: questionTokens + TOOL_ALLOWANCE_TOKENS, maxWebSearches: 1 };
    case "google":
      return {
        ...output,
        maxInputTokens:
          questionTokens + TOOL_ALLOWANCE_TOKENS + GOOGLE_ASSUMED_QUERIES_PER_REQUEST * ASSUMED_RESULT_TOKENS_PER_SEARCH,
        maxWebSearches: GOOGLE_ASSUMED_QUERIES_PER_REQUEST,
      };
    case "anthropic":
      return {
        ...output,
        maxInputTokens:
          questionTokens + ANTHROPIC_TOOL_PROMPT_TOKENS + SEARCHES_PER_REQUEST * ASSUMED_RESULT_TOKENS_PER_SEARCH,
        maxWebSearches: SEARCHES_PER_REQUEST,
      };
    case "xai":
      return {
        ...output,
        maxInputTokens:
          questionTokens + TOOL_ALLOWANCE_TOKENS + XAI_ASSUMED_TOOL_CALLS * XAI_ASSUMED_RESULT_TOKENS_PER_CALL,
        maxWebSearches: XAI_ASSUMED_TOOL_CALLS,
      };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries only a timeout, 408, 429 or a server error, and nothing else.
 *
 * An empty or malformed answer is not retried. It is itself a result of the
 * check, and asking again would pay a second time to overwrite it.
 *
 * A timeout is retried even though the cut-off request may already have run a
 * billed search. That is why a report's worst case is two searches per
 * question rather than one, and why no hard ceiling on cost is claimed.
 */
export function worthRetrying(error: string): boolean {
  if (/abort|timed out|timeout/i.test(error)) return true;
  return /^HTTP (408|429|5[0-9][0-9])/.test(error);
}

export interface ProviderAnswer {
  readonly providerId: UsageProvider;
  readonly providerLabel: string;
  readonly model: string;
  readonly askedAt: string;
  readonly ok: boolean;
  /** The assistant's own words, verbatim. Empty when ok is false. */
  readonly text: string;
  readonly citations: readonly string[];
  readonly error?: string;
  /** One entry per finished HTTP attempt, retries included. */
  readonly usage: readonly CallUsage[];
}

export interface AnswerProvider {
  readonly id: UsageProvider;
  readonly label: string;
  readonly model: string;
  ask(question: string, factId: string): Promise<ProviderAnswer>;
}

export interface Identity {
  readonly id: UsageProvider;
  readonly label: string;
  readonly model: string;
}

export interface AttemptContext {
  readonly identity: Identity;
  readonly question: string;
  readonly factId: string;
  readonly attemptNumber: number;
  readonly clientRequestId: string;
  readonly startedAt: string;
  readonly began: number;
  readonly bounds: AttemptBounds;
  readonly onJournal?: JournalSink;
}

export async function withRetries(
  attempt: (attemptNumber: number) => Promise<ProviderAnswer>
): Promise<ProviderAnswer> {
  let last = await attempt(1);
  let usage: readonly CallUsage[] = last.usage;
  for (let i = 1; i < ANSWER_ATTEMPTS && !last.ok; i += 1) {
    if (!worthRetrying(last.error ?? "")) break;
    await sleep(RETRY_DELAY_MS * i);
    last = await attempt(i + 1);
    usage = [...usage, ...last.usage];
  }
  return { ...last, usage };
}

/** Writes the "started" line before anything is sent, and returns the context for the attempt. */
export function beginAttempt(
  identity: Identity,
  question: string,
  factId: string,
  attemptNumber: number,
  onJournal?: JournalSink
): AttemptContext {
  const ctx: AttemptContext = {
    identity,
    question,
    factId,
    attemptNumber,
    clientRequestId: randomUUID(),
    startedAt: new Date().toISOString(),
    began: Date.now(),
    bounds: answerBounds(identity.id, question),
    onJournal,
  };
  onJournal?.({
    event: "started",
    clientRequestId: ctx.clientRequestId,
    provider: identity.id,
    model: identity.model,
    purpose: "answer",
    factId,
    attemptNumber,
    startedAt: ctx.startedAt,
    bounds: ctx.bounds,
  });
  return ctx;
}

/** Builds the finished row, writes it, and returns it. */
export function finishAttempt(
  ctx: AttemptContext,
  result: PostResult,
  measured: MeasuredCounts,
  bodyId: string | null
): CallUsage {
  const usage = makeUsage({
    clientRequestId: ctx.clientRequestId,
    provider: ctx.identity.id,
    model: ctx.identity.model,
    purpose: "answer",
    factId: ctx.factId,
    attemptNumber: ctx.attemptNumber,
    startedAt: ctx.startedAt,
    durationMs: Date.now() - ctx.began,
    providerRequestId: result.requestId ?? bodyId,
    httpStatus: result.status,
    outcome: result.ok ? "ok" : result.outcome,
    bounds: ctx.bounds,
    ...measured,
  });
  ctx.onJournal?.({ event: "finished", usage });
  return usage;
}

export function failed(identity: Identity, error: string, usage: readonly CallUsage[]): ProviderAnswer {
  return {
    providerId: identity.id,
    providerLabel: identity.label,
    model: identity.model,
    askedAt: new Date().toISOString(),
    ok: false,
    text: "",
    citations: [],
    error,
    usage,
  };
}

export function succeeded(
  identity: Identity,
  text: string,
  citations: readonly string[],
  usage: readonly CallUsage[]
): ProviderAnswer {
  return {
    providerId: identity.id,
    providerLabel: identity.label,
    model: identity.model,
    askedAt: new Date().toISOString(),
    ok: true,
    text,
    citations,
    usage,
  };
}

export function unique(urls: readonly string[]): readonly string[] {
  return [...new Set(urls.filter((u) => typeof u === "string" && u.length > 0))];
}

export function count(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
