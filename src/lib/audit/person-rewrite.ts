/**
 * The one generative step in the person report: what to publish so the
 * assistants have something correct to read.
 *
 * Everything else in the report is a verdict on someone else's words. This
 * step writes new words, and it is fenced accordingly: one call, the cheap
 * model, only facts from the person's own reference text, and the report
 * labels the result a draft to edit, not a finding.
 *
 * Journalled like every other paid call: a "started" line before the request
 * leaves, a "finished" line when it ends, purpose "writer".
 */

import { randomUUID } from "node:crypto";
import type { AnalysedAnswer, Claim } from "./answer-analysis";
import { contradictions } from "./answer-analysis";
import type { PersonSubject } from "./person-check";
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
export const WRITER_MODEL = "gpt-4.1-mini";
export const WRITER_MAX_OUTPUT_TOKENS = 1_500;
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_REFERENCE_CHARS = 12_000;

export interface PublishDraft {
  /** A LinkedIn headline, under 220 characters. */
  readonly headline: string;
  /** A LinkedIn About section, first person, under 1,500 characters. */
  readonly about: string;
  /** Three post subjects, each tied to a gap the check found. */
  readonly postTopics: readonly { title: string; why: string }[];
  /** Three plain sentences for the person's own site or profile, stating what the assistants got wrong or missed. */
  readonly siteLines: readonly string[];
}

export interface PublishDraftResult {
  readonly draft: PublishDraft | null;
  readonly error?: string;
  readonly usage: CallUsage | null;
}

const INSTRUCTIONS = `You write publishable text for one person, using only the reference text they provided about themselves. You will also see what AI assistants currently say about them, including statements that contradict the reference and questions the reference does not settle.

Write four things:
1. "headline": a LinkedIn headline under 220 characters. Role, who they help, with what. Plain words, no slogans, no emoji.
2. "about": a LinkedIn About section under 1,500 characters, first person, plain English, short paragraphs. State plainly the facts the assistants got wrong or could not verify, so that a machine reading the profile has a correct sentence to quote. Include the role, the company, where they are based if the reference says so, what they do, who for, and how to get in touch if the reference says so.
3. "postTopics": exactly 3 objects with "title" and "why". Each is a post the person could write that would give the assistants a source for something they currently get wrong, miss, or where the person does not come up at all. "why" names the gap in one sentence.
4. "siteLines": exactly 3 plain sentences the person can put on their own site or profile, each stating one fact the assistants got wrong or missed, in the words of the reference.

Rules:
- Use only facts present in the reference text. Never invent a client, a number, a credential, a location or a date. If the reference does not say it, do not write it.
- Do not promise results. Do not write "guaranteed", "leading", "world-class", "passionate" or "innovative".
- Do not mention AI assistants, ChatGPT, Claude, or this check anywhere in the text.
- Never write what the person is not, has not done, or where they have not worked. State only what is true, in the reference's words. A denial repeats the wrong association.
- Do not use em dashes.

Reply as JSON: {"headline":string,"about":string,"postTopics":[{"title":string,"why":string},{"title":string,"why":string},{"title":string,"why":string}],"siteLines":[string,string,string]}`;

function tokensUpperBound(chars: number): number {
  return Math.ceil(chars / 3);
}

export function writerBoundsForChars(chars: number): AttemptBounds {
  return {
    maxInputTokens: tokensUpperBound(chars),
    maxOutputTokens: WRITER_MAX_OUTPUT_TOKENS,
    maxWebSearches: 0,
  };
}

/** The most the writer can consume, before anything exists: instructions plus the reference at its cap plus room for findings. */
export function writerBoundsForPlan(): AttemptBounds {
  return writerBoundsForChars(INSTRUCTIONS.length + MAX_REFERENCE_CHARS + 6_000);
}

interface WriterResponse {
  id?: string;
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

const DRAFT_META_LANGUAGE =
  /\b(?:some sources (?:miss|do not)|some reports|contrary to|this (?:check|report)|AI assistants?|ChatGPT|Claude|I (?:have|had) (?:not|never) (?:worked|held|been)|not affiliated)\b/i;

/** Words that carry facts: years, figures, and capitalised names. */
const FACT_TOKEN = /\b(?:(?:19|20)\d{2}|\d[\d,.]*|[A-Z][a-zA-Z]+(?:[-\s][A-Z][a-zA-Z]+)*)\b/g;

/** Capitalised words that open sentences or name the platform, never facts about the person. */
const COMMON_CAPITALISED = new Set([
  "I", "My", "The", "A", "An", "If", "You", "Your", "We", "Our", "Currently", "Before", "After",
  "Today", "Now", "This", "These", "That", "It", "In", "On", "For", "With", "And", "But", "Or",
  "LinkedIn", "Founder", "Contact", "Learn", "About", "How", "What", "Why", "When", "Where",
  "Lessons", "Developing", "Applying", "From", "To", "At", "By", "As", "Independent", "Practical",
]);

/**
 * Figures, years and names in the drafts that the reference never uses.
 *
 * The second person test wrote "since 2021", a year the reference never
 * gives. A model told not to invent still does, so the report names every
 * such word for the person to check before publishing.
 */
export function unsupportedTerms(draft: PublishDraft, reference: string): readonly string[] {
  const text = [draft.headline, draft.about, ...draft.siteLines, ...draft.postTopics.map((t) => t.title)].join("\n");
  const haystack = reference.toLowerCase();
  const found = new Set<string>();
  for (const match of text.matchAll(FACT_TOKEN)) {
    const token = match[0].trim();
    if (COMMON_CAPITALISED.has(token)) continue;
    if (/^\d$/.test(token)) continue;
    if (!haystack.includes(token.toLowerCase())) found.add(token);
  }
  return [...found];
}

export function parseDraft(content: string): PublishDraft | null {
  let raw: {
    headline?: unknown;
    about?: unknown;
    postTopics?: unknown;
    siteLines?: unknown;
  };
  try {
    raw = JSON.parse(content) as typeof raw;
  } catch {
    return null;
  }
  const headline = asString(raw.headline);
  const about = asString(raw.about);
  if (!headline || !about || headline.length > 220 || about.length > 1_500) return null;
  const postTopics = Array.isArray(raw.postTopics)
    ? raw.postTopics
        .map((t) => {
          const item = t as { title?: unknown; why?: unknown };
          const title = asString(item.title);
          const why = asString(item.why);
          return title && why ? { title, why } : null;
        })
        .filter((t): t is { title: string; why: string } => t !== null)
        .slice(0, 3)
    : [];
  const siteLines = Array.isArray(raw.siteLines)
    ? raw.siteLines.map(asString).filter((s): s is string => s !== null).slice(0, 3)
    : [];
  if (postTopics.length !== 3 || siteLines.length !== 3) return null;
  if ([headline, about, ...siteLines].some((value) => DRAFT_META_LANGUAGE.test(value))) return null;
  return { headline, about, postTopics, siteLines };
}

function findingsBlock(analyses: readonly AnalysedAnswer[], blindAnswers: readonly string[]): string {
  const wrong = contradictions(analyses);
  const open = analyses
    .flatMap((a) => a.claims)
    .filter((c) => c.status === "unverified")
    .slice(0, 8);
  const lines: string[] = [];
  lines.push("STATEMENTS THE ASSISTANTS MADE THAT CONTRADICT THE REFERENCE");
  lines.push(
    wrong.length > 0
      ? wrong.map((c: Claim) => `- ${c.claim} (the reference says: ${c.siteSays ?? "otherwise"})`).join("\n")
      : "- none"
  );
  lines.push("");
  lines.push("STATEMENTS THE REFERENCE DOES NOT SETTLE");
  lines.push(open.length > 0 ? open.map((c) => `- ${c.claim}`).join("\n") : "- none");
  // The three-question check asks no blind question, so this block is often absent.
  if (blindAnswers.length > 0) {
    lines.push("");
    lines.push("WHO THE ASSISTANTS NAMED WHEN ASKED FOR A RECOMMENDATION WITHOUT THIS PERSON'S NAME");
    lines.push(blindAnswers.map((a) => `- ${a.slice(0, 600)}`).join("\n"));
  }
  return lines.join("\n");
}

export async function draftWhatToPublish(args: {
  readonly person: PersonSubject;
  readonly reference: string;
  readonly analyses: readonly AnalysedAnswer[];
  readonly blindAnswers: readonly string[];
  readonly apiKey: string;
  readonly onJournal?: JournalSink;
}): Promise<PublishDraftResult> {
  const userContent =
    `THE PERSON'S REFERENCE TEXT\n${args.reference.slice(0, MAX_REFERENCE_CHARS)}\n\n` +
    (args.person.category?.trim()
      ? `WHAT THEY WANT TO BE FOUND FOR\n${args.person.category.trim()}${args.person.market ? ` (${args.person.market})` : ""}\n\n`
      : "") +
    findingsBlock(args.analyses, args.blindAnswers);

  const clientRequestId = randomUUID();
  const bounds = writerBoundsForChars(INSTRUCTIONS.length + userContent.length);
  const startedAt = new Date().toISOString();
  const began = Date.now();

  args.onJournal?.({
    event: "started",
    clientRequestId,
    provider: "openai",
    model: WRITER_MODEL,
    purpose: "writer",
    factId: "publish",
    attemptNumber: 1,
    startedAt,
    bounds,
  });

  const result = await postJson(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${args.apiKey}`, "X-Client-Request-Id": clientRequestId },
    {
      model: WRITER_MODEL,
      response_format: { type: "json_object" },
      max_completion_tokens: WRITER_MAX_OUTPUT_TOKENS,
      messages: [
        { role: "system", content: INSTRUCTIONS },
        { role: "user", content: userContent },
      ],
    },
    REQUEST_TIMEOUT_MS
  );

  const record = (measured: MeasuredCounts, bodyId: string | null): CallUsage => {
    const usage = makeUsage({
      clientRequestId,
      provider: "openai",
      model: WRITER_MODEL,
      purpose: "writer",
      factId: "publish",
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

  if (!result.ok) return { draft: null, error: result.error, usage: record(failureMeasurement(), null) };

  const payload = result.json as WriterResponse;
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
  if (!content) return { draft: null, error: "empty writer response", usage };
  const draft = parseDraft(content);
  return draft ? { draft, usage } : { draft: null, error: "the writer returned malformed JSON", usage };
}
