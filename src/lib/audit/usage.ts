/**
 * What each paid call consumed, journalled before and after every attempt,
 * with two cost estimates beside every finished row.
 *
 * Written after a run spent $15 that nobody could itemise afterwards.
 *
 * Nothing here is the bill. The provider's billing dashboard is the authority.
 * This is a journal to match against it, and every row says how far it can be
 * trusted:
 *
 * - tokenMeasurement "reported": the provider returned usage for the attempt.
 * - "unknown": no usage came back. That covers timeouts, network failures,
 *   attempts interrupted by a crash, and every HTTP error response. Neither
 *   provider documents that an error response is never processed or billed,
 *   so none is treated as free.
 * - "estimated": reserved for a cost derived indirectly from evidence. No path
 *   produces it today. Zero cost will only ever be recorded where a provider
 *   documents that a refused request was not processed.
 *
 * Two sums are kept, because either one alone misleads:
 *
 * - providerReportedEstimateUsd uses only what the provider reported. For an
 *   unknown attempt that is zero, which can be too low.
 * - conservativeEstimateUsd fills every gap from the upper bounds of the call:
 *   the output cap, the search cap, OpenAI's fixed search content block and an
 *   assumed size for Anthropic's search results. It can double count. It is a
 *   figure that should not be exceeded in practice, not a guarantee.
 *
 * The journal has two kinds of line. "started" is written before the request
 * leaves, "finished" after it ends. A crash between the two leaves a started
 * line with no finish, and usageFromJournal counts that attempt as interrupted
 * at its bounds, so a paid request can never vanish from the record.
 */

/** Where the prices below were copied from, and when. */
export const PRICE_SOURCES = [
  "https://developers.openai.com/api/docs/pricing",
  "https://platform.claude.com/docs/en/about-claude/pricing",
  "https://ai.google.dev/gemini-api/docs/pricing",
  "https://docs.perplexity.ai/getting-started/pricing",
  "https://docs.x.ai/developers/pricing",
] as const;
export const PRICES_CHECKED_ON = "2026-09-21";

export type UsageProvider = "openai" | "anthropic" | "google" | "perplexity" | "xai";
export type UsagePurpose = "answer" | "judge" | "writer";

/**
 * How an attempt ended. "interrupted" is never returned by a request: it is
 * inferred afterwards for an attempt the journal saw start but never finish.
 */
export type AttemptOutcome = "ok" | "http_error" | "timeout" | "network_error" | "interrupted";
export type TokenMeasurement = "reported" | "estimated" | "unknown";

/**
 * How the search count on a row was obtained. Anthropic reports it in usage.
 * OpenAI's is inferred by counting search steps in the response. For an
 * attempt with no response, the cap is assumed.
 */
export type SearchMeasurement = "reported" | "inferred" | "assumed" | "none";

interface ModelPrice {
  /** USD per million input tokens. */
  readonly input: number;
  /** USD per million output tokens. */
  readonly output: number;
}

/** Update when the providers change prices, and never compute cost anywhere else. */
const MODEL_PRICES: Readonly<Record<string, ModelPrice>> = {
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },
  "claude-haiku-4-5-20251001": { input: 1.0, output: 5.0 },
  "gemini-3.5-flash-lite": { input: 0.3, output: 2.5 },
  sonar: { input: 1.0, output: 1.0 },
  "grok-4.3": { input: 1.25, output: 2.5 },
};

/**
 * What one billed search costs at each provider.
 *
 * OpenAI and Anthropic charge $10 per 1,000 searches. Google charges $14 per
 * 1,000 search queries after a monthly free allowance, which is ignored here
 * so the estimate errs high. Perplexity charges a fee per request, not per
 * search: $5 per 1,000 at the "low" search context this code always sends, and
 * each request is counted as one search. xAI charges $5 per 1,000 tool calls.
 */
const USD_PER_WEB_SEARCH: Readonly<Record<UsageProvider, number>> = {
  openai: 10 / 1000,
  anthropic: 10 / 1000,
  google: 14 / 1000,
  perplexity: 5 / 1000,
  xai: 5 / 1000,
};

export function searchUsd(provider: UsageProvider, searches: number): number {
  return searches * USD_PER_WEB_SEARCH[provider];
}

/**
 * OpenAI bills search content for gpt-4.1-mini as a fixed block of 8,000 input
 * tokens per search. Whether that block is already inside the reported
 * input_tokens is not documented, so the conservative estimate adds it and the
 * provider-reported estimate does not.
 */
export const OPENAI_SEARCH_CONTENT_TOKENS = 8_000;

/** The most one attempt can consume, used wherever nothing was reported. */
export interface AttemptBounds {
  /** Input tokens, excluding OpenAI's search content block, which is added separately. */
  readonly maxInputTokens: number;
  readonly maxOutputTokens: number;
  readonly maxWebSearches: number;
}

export interface CallUsage {
  /**
   * Our own id for the attempt, generated before it is sent. Sent to OpenAI as
   * X-Client-Request-Id, so a request can be traced even when a timeout means
   * no provider id ever came back.
   */
  readonly clientRequestId: string;
  readonly provider: UsageProvider;
  readonly model: string;
  readonly purpose: UsagePurpose;
  readonly factId: string;
  /** 1 for the first try, 2 for the retry. */
  readonly attemptNumber: number;
  readonly startedAt: string;
  readonly durationMs: number;
  /** The provider's own id for this request. Null when none came back. */
  readonly providerRequestId: string | null;
  readonly httpStatus: number | null;
  readonly outcome: AttemptOutcome;
  readonly tokenMeasurement: TokenMeasurement;
  readonly searchMeasurement: SearchMeasurement;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly webSearches: number;
  readonly bounds: AttemptBounds;
  readonly providerReportedEstimateUsd: number;
  readonly conservativeEstimateUsd: number;
  /** False when the model is missing from the price table, so both estimates are too low. */
  readonly priced: boolean;
}

export type UsageFacts = Omit<
  CallUsage,
  "providerReportedEstimateUsd" | "conservativeEstimateUsd" | "priced"
>;

export type MeasuredCounts = Pick<
  UsageFacts,
  "tokenMeasurement" | "searchMeasurement" | "inputTokens" | "outputTokens" | "webSearches"
>;

function tokenUsd(model: string, input: number, output: number): { usd: number; priced: boolean } {
  const price = MODEL_PRICES[model];
  if (!price) return { usd: 0, priced: false };
  return { usd: (input * price.input + output * price.output) / 1_000_000, priced: true };
}

export function makeUsage(facts: UsageFacts): CallUsage {
  const openAiBlock = (searches: number): number =>
    facts.provider === "openai" ? searches * OPENAI_SEARCH_CONTENT_TOKENS : 0;

  const reported = tokenUsd(facts.model, facts.inputTokens, facts.outputTokens);
  const providerReportedEstimateUsd =
    facts.tokenMeasurement === "unknown"
      ? 0
      : reported.usd + searchUsd(facts.provider, facts.webSearches);

  const conservativeEstimateUsd =
    facts.tokenMeasurement === "unknown"
      ? tokenUsd(
          facts.model,
          facts.bounds.maxInputTokens + openAiBlock(facts.bounds.maxWebSearches),
          facts.bounds.maxOutputTokens
        ).usd +
        searchUsd(facts.provider, facts.bounds.maxWebSearches)
      : tokenUsd(
          facts.model,
          facts.inputTokens + openAiBlock(facts.webSearches),
          facts.outputTokens
        ).usd +
        searchUsd(facts.provider, facts.webSearches);

  return { ...facts, providerReportedEstimateUsd, conservativeEstimateUsd, priced: reported.priced };
}

/**
 * The measurement for any attempt that did not return usage: an HTTP error, a
 * timeout, a network failure or an interruption. All are unknown, and the
 * conservative estimate falls back to the attempt's bounds.
 *
 * An earlier version recorded every HTTP error as free. Neither provider
 * documents that, so it was an assumption presented as a fact.
 */
export function failureMeasurement(): MeasuredCounts {
  return { tokenMeasurement: "unknown", searchMeasurement: "assumed", inputTokens: 0, outputTokens: 0, webSearches: 0 };
}

/* ------------------------------------------------------------------ journal */

export interface AttemptStarted {
  readonly event: "started";
  readonly clientRequestId: string;
  readonly provider: UsageProvider;
  readonly model: string;
  readonly purpose: UsagePurpose;
  readonly factId: string;
  readonly attemptNumber: number;
  readonly startedAt: string;
  readonly bounds: AttemptBounds;
}

export interface AttemptFinished {
  readonly event: "finished";
  readonly usage: CallUsage;
}

export type JournalEvent = AttemptStarted | AttemptFinished;
export type JournalSink = (event: JournalEvent) => void;

/**
 * Every attempt in a journal, finished or not.
 *
 * An attempt with a started line and no finished line is counted as
 * interrupted, with unknown usage priced at its bounds.
 */
export function usageFromJournal(events: readonly JournalEvent[]): readonly CallUsage[] {
  const finished = events
    .filter((e): e is AttemptFinished => e.event === "finished")
    .map((e) => e.usage);
  const done = new Set(finished.map((u) => u.clientRequestId));
  const interrupted = events
    .filter((e): e is AttemptStarted => e.event === "started" && !done.has(e.clientRequestId))
    .map((s) =>
      makeUsage({
        clientRequestId: s.clientRequestId,
        provider: s.provider,
        model: s.model,
        purpose: s.purpose,
        factId: s.factId,
        attemptNumber: s.attemptNumber,
        startedAt: s.startedAt,
        durationMs: 0,
        providerRequestId: null,
        httpStatus: null,
        outcome: "interrupted",
        bounds: s.bounds,
        ...failureMeasurement(),
      })
    );
  return [...finished, ...interrupted];
}

/* ------------------------------------------------------------------ summary */

export interface UsageSummary {
  readonly attempts: number;
  readonly byOutcome: Readonly<Record<AttemptOutcome, number>>;
  readonly byTokenMeasurement: Readonly<Record<TokenMeasurement, number>>;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly webSearches: number;
  readonly providerReportedEstimateUsd: number;
  readonly conservativeEstimateUsd: number;
  readonly unpricedModels: readonly string[];
}

function tally<K extends string>(keys: readonly K[], values: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, values.filter((v) => v === k).length])) as Record<K, number>;
}

function sum(entries: readonly CallUsage[], pick: (e: CallUsage) => number): number {
  return entries.reduce((total, e) => total + pick(e), 0);
}

export function summariseUsage(entries: readonly CallUsage[]): UsageSummary {
  return {
    attempts: entries.length,
    byOutcome: tally(
      ["ok", "http_error", "timeout", "network_error", "interrupted"],
      entries.map((e) => e.outcome)
    ),
    byTokenMeasurement: tally(["reported", "estimated", "unknown"], entries.map((e) => e.tokenMeasurement)),
    inputTokens: sum(entries, (e) => e.inputTokens),
    outputTokens: sum(entries, (e) => e.outputTokens),
    webSearches: sum(entries, (e) => e.webSearches),
    providerReportedEstimateUsd: sum(entries, (e) => e.providerReportedEstimateUsd),
    conservativeEstimateUsd: sum(entries, (e) => e.conservativeEstimateUsd),
    unpricedModels: [...new Set(entries.filter((e) => !e.priced).map((e) => e.model))],
  };
}

/* --------------------------------------------------------------------- plan */

/** One call a run will make, described before it is made. */
export interface PlannedCall {
  readonly provider: UsageProvider;
  readonly model: string;
  readonly purpose: UsagePurpose;
  readonly label: string;
  readonly maxAttempts: number;
  readonly bounds: AttemptBounds;
}

export interface CostPlan {
  readonly calls: number;
  readonly maxAttempts: number;
  readonly maxWebSearchesNoRetry: number;
  readonly maxWebSearchesWithRetries: number;
  readonly conservativeNoRetryUsd: number;
  readonly conservativeWithRetriesUsd: number;
  readonly unpricedModels: readonly string[];
}

/**
 * What a run can cost, computed from bounds alone, before any call is made.
 *
 * Every call is priced as if it hit every cap. "With retries" assumes every
 * call that may retry does. Neither figure is a guarantee: Anthropic does not
 * cap the size of its search results, so that part rests on an assumption.
 */
export function planCost(calls: readonly PlannedCall[]): CostPlan {
  const priced = calls.map((call) => {
    const row = makeUsage({
      clientRequestId: "",
      provider: call.provider,
      model: call.model,
      purpose: call.purpose,
      factId: call.label,
      attemptNumber: 1,
      startedAt: "",
      durationMs: 0,
      providerRequestId: null,
      httpStatus: null,
      outcome: "interrupted",
      bounds: call.bounds,
      ...failureMeasurement(),
    });
    return { call, usd: row.conservativeEstimateUsd, priced: row.priced };
  });

  return {
    calls: calls.length,
    maxAttempts: calls.reduce((total, c) => total + c.maxAttempts, 0),
    maxWebSearchesNoRetry: calls.reduce((total, c) => total + c.bounds.maxWebSearches, 0),
    maxWebSearchesWithRetries: calls.reduce((total, c) => total + c.bounds.maxWebSearches * c.maxAttempts, 0),
    conservativeNoRetryUsd: priced.reduce((total, p) => total + p.usd, 0),
    conservativeWithRetriesUsd: priced.reduce((total, p) => total + p.usd * p.call.maxAttempts, 0),
    unpricedModels: [...new Set(priced.filter((p) => !p.priced).map((p) => p.call.model))],
  };
}
