/**
 * The three assistants the person check adds: Gemini, Perplexity and Grok.
 *
 * Same contract as the first two: one fresh request per question, live search
 * on, the cheapest model each provider sells, two journal lines around every
 * HTTP attempt. Each response is read by a pure function, so the shapes below
 * are tested without a paid call.
 *
 * What differs is what each API lets us cap:
 * - Google has no field to limit search queries for one prompt. The number it
 *   ran is read back from the response and billed per query.
 * - Perplexity always searches once per request and charges a request fee that
 *   depends on the search context size. "low" is sent on every request.
 * - xAI takes max_tool_calls but ran three searches under a cap of one, so its
 *   bounds assume several. Only web search is switched on;
 *   X search is billed differently and is never requested.
 */

import { postJson } from "./paid-http";
import {
  ANSWER_MAX_OUTPUT_TOKENS,
  REQUEST_TIMEOUT_MS,
  SEARCHES_PER_REQUEST,
  beginAttempt,
  count,
  failed,
  finishAttempt,
  succeeded,
  unique,
  withRetries,
  type AnswerProvider,
  type AttemptContext,
  type Identity,
  type ProviderAnswer,
} from "./answer-attempt";
import { failureMeasurement, type JournalSink, type MeasuredCounts } from "./usage";

/** Cheap models only. A more expensive one needs the owner's approval twice. */
export const GEMINI_ANSWER_MODEL = "gemini-3.5-flash-lite";
export const SONAR_ANSWER_MODEL = "sonar";
/** The cheapest general Grok on sale; the older Fast models were withdrawn. */
export const GROK_ANSWER_MODEL = "grok-4.3";

/** What a response parser hands back. measured is null when the provider sent no usage. */
export interface ParsedAnswer {
  readonly text: string;
  readonly citations: readonly string[];
  readonly measured: MeasuredCounts | null;
  readonly bodyId: string | null;
}

type AskOnce = (apiKey: string, ctx: AttemptContext) => Promise<ProviderAnswer>;

function provider(identity: Identity, askOnce: AskOnce) {
  return (apiKey: string, onJournal?: JournalSink): AnswerProvider => ({
    ...identity,
    ask(question: string, factId: string): Promise<ProviderAnswer> {
      // A parsing surprise in one answer is that answer's failure, never the run's.
      return withRetries((n) => askOnce(apiKey, beginAttempt(identity, question, factId, n, onJournal))).catch(
        (error: unknown) =>
          failed(identity, `unreadable response: ${error instanceof Error ? error.message : String(error)}`, [])
      );
    },
  });
}

/** The part every provider shares once the HTTP call is back. */
async function settle(
  ctx: AttemptContext,
  request: ReturnType<typeof postJson>,
  parse: (json: unknown) => ParsedAnswer
): Promise<ProviderAnswer> {
  const result = await request;
  if (!result.ok) {
    return failed(ctx.identity, result.error, [finishAttempt(ctx, result, failureMeasurement(), null)]);
  }
  const parsed = parse(result.json);
  const usage = [finishAttempt(ctx, result, parsed.measured ?? failureMeasurement(), parsed.bodyId)];
  if (!parsed.text) return failed(ctx.identity, "no text in response", usage);
  return succeeded(ctx.identity, parsed.text, parsed.citations, usage);
}

function strings(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

/* ------------------------------------------------------------------ Google */

interface GeminiResponse {
  responseId?: string;
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    groundingMetadata?: {
      webSearchQueries?: unknown;
      groundingChunks?: { web?: { uri?: string } }[];
    };
  }[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    toolUsePromptTokenCount?: number;
  };
}

export function parseGemini(json: unknown): ParsedAnswer {
  const payload = (json ?? {}) as GeminiResponse;
  const candidate = payload.candidates?.[0];
  const grounding = candidate?.groundingMetadata;
  const chunks = Array.isArray(grounding?.groundingChunks) ? grounding.groundingChunks : [];
  const usage = payload.usageMetadata;
  return {
    text: (candidate?.content?.parts ?? [])
      .filter((part) => !part.thought)
      .map((part) => part.text ?? "")
      .join("")
      .trim(),
    citations: unique(chunks.map((chunk) => chunk.web?.uri ?? "")),
    measured: usage
      ? {
          tokenMeasurement: "reported",
          // Google bills per search query; the count is read from the queries it lists.
          searchMeasurement: "inferred",
          // Search results and thinking are billed as tokens on top of the prompt and the answer.
          inputTokens: count(usage.promptTokenCount) + count(usage.toolUsePromptTokenCount),
          outputTokens: count(usage.candidatesTokenCount) + count(usage.thoughtsTokenCount),
          webSearches: strings(grounding?.webSearchQueries).length,
        }
      : null,
    bodyId: payload.responseId ?? null,
  };
}

function askGeminiOnce(apiKey: string, ctx: AttemptContext): Promise<ProviderAnswer> {
  return settle(
    ctx,
    postJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${ctx.identity.model}:generateContent`,
      // The key goes in a header, never in the address, so it cannot end up in a log line.
      { "x-goog-api-key": apiKey },
      {
        contents: [{ role: "user", parts: [{ text: ctx.question }] }],
        tools: [{ google_search: {} }],
        generationConfig: { maxOutputTokens: ANSWER_MAX_OUTPUT_TOKENS },
      },
      REQUEST_TIMEOUT_MS
    ),
    parseGemini
  );
}

export const geminiProvider = provider(
  { id: "google", label: "Gemini", model: GEMINI_ANSWER_MODEL },
  askGeminiOnce
);

/* -------------------------------------------------------------- Perplexity */

interface SonarResponse {
  id?: string;
  choices?: { message?: { content?: string } }[];
  citations?: unknown;
  search_results?: { url?: string }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export function parseSonar(json: unknown): ParsedAnswer {
  const payload = (json ?? {}) as SonarResponse;
  const results = Array.isArray(payload.search_results) ? payload.search_results.map((r) => r.url ?? "") : [];
  return {
    text: (payload.choices?.[0]?.message?.content ?? "").trim(),
    citations: unique([...strings(payload.citations), ...results]),
    measured: payload.usage
      ? {
          tokenMeasurement: "reported",
          // The fee is per request, so every answered request counts as one search.
          searchMeasurement: "reported",
          inputTokens: count(payload.usage.prompt_tokens),
          outputTokens: count(payload.usage.completion_tokens),
          webSearches: 1,
        }
      : null,
    bodyId: payload.id ?? null,
  };
}

function askSonarOnce(apiKey: string, ctx: AttemptContext): Promise<ProviderAnswer> {
  return settle(
    ctx,
    postJson(
      "https://api.perplexity.ai/v1/sonar",
      { Authorization: `Bearer ${apiKey}` },
      {
        model: ctx.identity.model,
        max_tokens: ANSWER_MAX_OUTPUT_TOKENS,
        // The request fee in usage.ts is the "low" one. Change both together.
        web_search_options: { search_context_size: "low" },
        messages: [{ role: "user", content: ctx.question }],
      },
      REQUEST_TIMEOUT_MS
    ),
    parseSonar
  );
}

export const sonarProvider = provider(
  { id: "perplexity", label: "Perplexity", model: SONAR_ANSWER_MODEL },
  askSonarOnce
);

/* --------------------------------------------------------------------- xAI */

interface GrokResponse {
  id?: string;
  output?: {
    type?: string;
    content?: { type?: string; text?: string; annotations?: { url?: string }[] }[];
  }[];
  citations?: unknown;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    num_server_side_tools_used?: number;
    server_side_tool_usage_details?: { web_search_calls?: number };
  };
}

export function parseGrok(json: unknown): ParsedAnswer {
  const payload = (json ?? {}) as GrokResponse;
  const blocks = (Array.isArray(payload.output) ? payload.output : [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((block) => block.type === "output_text");
  const usage = payload.usage;
  const detailed = usage?.server_side_tool_usage_details?.web_search_calls;
  return {
    text: blocks
      .map((block) => block.text ?? "")
      .join("\n")
      .trim(),
    citations: unique([
      ...strings(payload.citations),
      ...blocks.flatMap((block) => (block.annotations ?? []).map((a) => a.url ?? "")),
    ]),
    measured: usage
      ? {
          tokenMeasurement: "reported",
          searchMeasurement: "reported",
          inputTokens: count(usage.input_tokens),
          outputTokens: count(usage.output_tokens),
          // Falls back to the total tool count, which can only overstate: web search is the only tool on.
          webSearches: typeof detailed === "number" ? count(detailed) : count(usage.num_server_side_tools_used),
        }
      : null,
    bodyId: payload.id ?? null,
  };
}

function askGrokOnce(apiKey: string, ctx: AttemptContext): Promise<ProviderAnswer> {
  return settle(
    ctx,
    postJson(
      "https://api.x.ai/v1/responses",
      { Authorization: `Bearer ${apiKey}` },
      {
        model: ctx.identity.model,
        tools: [{ type: "web_search" }],
        max_tool_calls: SEARCHES_PER_REQUEST,
        max_output_tokens: ANSWER_MAX_OUTPUT_TOKENS,
        input: [{ role: "user", content: ctx.question }],
      },
      REQUEST_TIMEOUT_MS
    ),
    parseGrok
  );
}

export const grokProvider = provider({ id: "xai", label: "Grok", model: GROK_ANSWER_MODEL }, askGrokOnce);
