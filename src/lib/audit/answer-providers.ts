/**
 * OpenAI and Anthropic, the two APIs every check asks. The three the person
 * check adds live in ./answer-providers-search.ts.
 *
 * Both are queried with live web search on, so an answer reflects what the
 * company's site says today and not only what the model remembers from
 * training. That distinction matters commercially: a stale memory is a
 * different problem from a badly written page, and only the second one is
 * fixable by the client.
 *
 * These are API surfaces, not the consumer apps. The consumer products carry
 * their own system prompts and per-user memory, so two people can see two
 * different answers. The API is the instrument that can be re-run, and every
 * report has to say so rather than claim to show "what your customer sees".
 *
 * Every HTTP attempt is journalled twice: once before the request leaves and
 * once when it ends. See ./usage.ts for why.
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
import {
  GEMINI_ANSWER_MODEL,
  GROK_ANSWER_MODEL,
  SONAR_ANSWER_MODEL,
  geminiProvider,
  grokProvider,
  sonarProvider,
} from "./answer-providers-search";
import { failureMeasurement, type JournalSink, type UsageProvider } from "./usage";

export {
  ANSWER_ATTEMPTS,
  ANSWER_MAX_OUTPUT_TOKENS,
  ASSUMED_RESULT_TOKENS_PER_SEARCH,
  GOOGLE_ASSUMED_QUERIES_PER_REQUEST,
  SEARCHES_PER_REQUEST,
  answerBounds,
  worthRetrying,
  type AnswerProvider,
  type ProviderAnswer,
} from "./answer-attempt";
export { GEMINI_ANSWER_MODEL, SONAR_ANSWER_MODEL, GROK_ANSWER_MODEL } from "./answer-providers-search";

/** Cheap models only. A more expensive one needs the owner's approval twice. */
export const OPENAI_ANSWER_MODEL = "gpt-4.1-mini";
export const ANTHROPIC_ANSWER_MODEL = "claude-haiku-4-5-20251001";

/* ------------------------------------------------------------------ OpenAI */

interface OpenAiResponse {
  id?: string;
  output?: {
    type?: string;
    content?: {
      type?: string;
      text?: string;
      annotations?: { url?: string }[];
    }[];
  }[];
  usage?: { input_tokens?: number; output_tokens?: number };
}

export function openAiProvider(apiKey: string, model: string, onJournal?: JournalSink): AnswerProvider {
  const identity: Identity = { id: "openai", label: "OpenAI", model };
  return {
    ...identity,
    ask(question: string, factId: string): Promise<ProviderAnswer> {
      // A parsing surprise in one answer is that answer's failure, never the run's.
      return withRetries((n) =>
        askOpenAiOnce(apiKey, beginAttempt(identity, question, factId, n, onJournal))
      ).catch((error: unknown) =>
        failed(identity, `unreadable response: ${error instanceof Error ? error.message : String(error)}`, [])
      );
    },
  };
}

async function askOpenAiOnce(apiKey: string, ctx: AttemptContext): Promise<ProviderAnswer> {
  const result = await postJson(
    "https://api.openai.com/v1/responses",
    // Our own id goes with the request, so it can be looked up even if the
    // response, and the provider's id with it, never arrives.
    { Authorization: `Bearer ${apiKey}`, "X-Client-Request-Id": ctx.clientRequestId },
    {
      model: ctx.identity.model,
      tools: [{ type: "web_search" }],
      max_tool_calls: SEARCHES_PER_REQUEST,
      max_output_tokens: ANSWER_MAX_OUTPUT_TOKENS,
      input: ctx.question,
    },
    REQUEST_TIMEOUT_MS
  );
  if (!result.ok) {
    return failed(ctx.identity, result.error, [finishAttempt(ctx, result, failureMeasurement(), null)]);
  }

  const payload = result.json as OpenAiResponse;
  const usage = [
    finishAttempt(
      ctx,
      result,
      payload.usage
        ? {
            tokenMeasurement: "reported",
            // OpenAI does not report a search count; it is counted from the
            // search steps in the response.
            searchMeasurement: "inferred",
            inputTokens: count(payload.usage.input_tokens),
            outputTokens: count(payload.usage.output_tokens),
            webSearches: (payload.output ?? []).filter((item) => item.type === "web_search_call").length,
          }
        : failureMeasurement(),
      payload.id ?? null
    ),
  ];

  // The answer arrives after any number of reasoning and search steps, so the
  // message block is found by type rather than by position.
  const blocks = (payload.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((block) => block.type === "output_text");

  const text = blocks
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();
  const citations = unique(
    blocks.flatMap((block) => (block.annotations ?? []).map((a) => a.url ?? ""))
  );

  if (!text) return failed(ctx.identity, "no text in response", usage);
  return succeeded(ctx.identity, text, citations, usage);
}

/* --------------------------------------------------------------- Anthropic */

interface AnthropicResponse {
  id?: string;
  content?: {
    type?: string;
    text?: string;
    citations?: { url?: string }[];
    content?: { url?: string }[];
  }[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    server_tool_use?: { web_search_requests?: number };
  };
}

export function anthropicProvider(apiKey: string, model: string, onJournal?: JournalSink): AnswerProvider {
  const identity: Identity = { id: "anthropic", label: "Anthropic", model };
  return {
    ...identity,
    ask(question: string, factId: string): Promise<ProviderAnswer> {
      // A parsing surprise in one answer is that answer's failure, never the run's.
      return withRetries((n) =>
        askAnthropicOnce(apiKey, beginAttempt(identity, question, factId, n, onJournal))
      ).catch((error: unknown) =>
        failed(identity, `unreadable response: ${error instanceof Error ? error.message : String(error)}`, [])
      );
    },
  };
}

/**
 * The answer, without what Claude says before it searches ("I'll search for
 * information about..."): only the text after the last search is the answer.
 * Text arrives as many small blocks when citations are attached, so they are
 * joined rather than taking the first one.
 */
export function anthropicAnswerText(parts: readonly { readonly type?: string; readonly text?: string }[]): string {
  const lastSearch = parts.reduce(
    (last, part, index) => (part.type === "server_tool_use" || part.type === "web_search_tool_result" ? index : last),
    -1
  );
  return parts
    .slice(lastSearch + 1)
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
    .trim();
}

async function askAnthropicOnce(apiKey: string, ctx: AttemptContext): Promise<ProviderAnswer> {
  const result = await postJson(
    "https://api.anthropic.com/v1/messages",
    // Anthropic documents no client request id header, so ours is kept only in
    // the journal, where it still ties the started and finished lines together.
    { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    {
      model: ctx.identity.model,
      max_tokens: ANSWER_MAX_OUTPUT_TOKENS,
      tools: [
        { type: "web_search_20250305", name: "web_search", max_uses: SEARCHES_PER_REQUEST },
      ],
      messages: [{ role: "user", content: ctx.question }],
    },
    REQUEST_TIMEOUT_MS
  );
  if (!result.ok) {
    return failed(ctx.identity, result.error, [finishAttempt(ctx, result, failureMeasurement(), null)]);
  }

  const payload = result.json as AnthropicResponse;
  const usage = [
    finishAttempt(
      ctx,
      result,
      payload.usage
        ? {
            tokenMeasurement: "reported",
            searchMeasurement: payload.usage.server_tool_use ? "reported" : "inferred",
            inputTokens: count(payload.usage.input_tokens),
            outputTokens: count(payload.usage.output_tokens),
            webSearches: count(payload.usage.server_tool_use?.web_search_requests),
          }
        : failureMeasurement(),
      payload.id ?? null
    ),
  ];
  const parts = payload.content ?? [];

  const text = anthropicAnswerText(parts);

  const citations = unique([
    ...parts
      .filter((part) => part.type === "web_search_tool_result")
      // A failed search arrives as an object, not a list: {"type":"web_search_tool_result_error",...}.
      .flatMap((part) => (Array.isArray(part.content) ? part.content : []).map((r) => r.url ?? "")),
    ...parts.flatMap((part) => (part.citations ?? []).map((c) => c.url ?? "")),
  ]);

  if (!text) return failed(ctx.identity, "no text in response", usage);
  return succeeded(ctx.identity, text, citations, usage);
}

/** The two providers the company check has always used. */
export const COMPANY_PROVIDER_IDS: readonly UsageProvider[] = ["openai", "anthropic"];
/** The five the person check asks. */
export const PERSON_PROVIDER_IDS: readonly UsageProvider[] = ["openai", "anthropic", "google", "perplexity", "xai"];

/** The model each provider is asked with. Every one is its provider's cheap tier. */
export const PROVIDER_MODELS: Readonly<Record<UsageProvider, string>> = {
  openai: OPENAI_ANSWER_MODEL,
  anthropic: ANTHROPIC_ANSWER_MODEL,
  google: GEMINI_ANSWER_MODEL,
  perplexity: SONAR_ANSWER_MODEL,
  xai: GROK_ANSWER_MODEL,
};

/** Which environment variable holds each provider's key. */
export const PROVIDER_ENV_KEYS: Readonly<Record<UsageProvider, string>> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GEMINI_API_KEY",
  perplexity: "PERPLEXITY_API_KEY",
  xai: "XAI_API_KEY",
};

const FACTORIES: Readonly<Record<UsageProvider, (key: string, onJournal?: JournalSink) => AnswerProvider>> = {
  openai: (key, onJournal) => openAiProvider(key, OPENAI_ANSWER_MODEL, onJournal),
  anthropic: (key, onJournal) => anthropicProvider(key, ANTHROPIC_ANSWER_MODEL, onJournal),
  google: geminiProvider,
  perplexity: sonarProvider,
  xai: grokProvider,
};

/**
 * Whichever of the asked-for providers have a key at runtime. A missing key
 * drops one column, not the report.
 *
 * The default is the company pair, so adding a key for a new provider never
 * widens, or raises the cost of, a run that did not ask for it.
 */
export function availableProviders(
  onJournal?: JournalSink,
  ids: readonly UsageProvider[] = COMPANY_PROVIDER_IDS
): readonly AnswerProvider[] {
  return ids.flatMap((id) => {
    const key = process.env[PROVIDER_ENV_KEYS[id]];
    return key ? [FACTORIES[id](key, onJournal)] : [];
  });
}
