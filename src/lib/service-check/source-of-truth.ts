/**
 * Source-of-truth extraction for the AI Service Check.
 *
 * Before a bot can be caught contradicting its own company, the company's own
 * published claims have to be written down. That is the slowest manual part of
 * a Behaviour Check, and it is entirely mechanical: prices, delivery terms,
 * refund windows, response-time promises and support channels are already on
 * the client's website.
 *
 * This module pulls those claims out of fetched HTML into a flat, quotable
 * table. Every fact keeps the page it came from and the sentence it appeared
 * in, because a finding without a quote is an opinion.
 */

export type FactKind =
  | "price"
  | "refund-window"
  | "delivery"
  | "response-time"
  | "human-contact"
  | "ai-disclosure"
  | "guarantee";

export interface SourceFact {
  readonly kind: FactKind;
  /** The extracted value, e.g. "€49", "14 days", "24 hours". */
  readonly value: string;
  /** The sentence the value appeared in — this is what goes in the report. */
  readonly quote: string;
  /** Page the quote came from. */
  readonly url: string;
}

export interface ExtractionResult {
  readonly facts: readonly SourceFact[];
  readonly pagesScanned: number;
  /** Kinds we looked for but did not find — these become interview questions. */
  readonly missing: readonly FactKind[];
}

const ALL_KINDS: readonly FactKind[] = [
  "price",
  "refund-window",
  "delivery",
  "response-time",
  "human-contact",
  "ai-disclosure",
  "guarantee",
];

/** Block-level tags whose boundaries are real line breaks in the rendered page. */
const BLOCK_BOUNDARY =
  /<\/?(?:p|div|section|article|header|footer|main|aside|nav|ul|ol|li|dl|dt|dd|table|thead|tbody|tr|td|th|h[1-6]|br|hr|blockquote|pre|figure|figcaption|form|label|button)\b[^>]*>/gi;

/**
 * Strips markup to text, preserving block boundaries as newlines.
 *
 * Collapsing the whole document into one line is what breaks quoting: modern
 * markup rarely ends elements with a full stop, so a naive strip yields a
 * single unquotable blob. Block tags carry the structure a reader sees, so they
 * become the line breaks.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(BLOCK_BOUNDARY, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

const MIN_LEN = 15;
const MAX_LEN = 320;

/** Splits an over-long run on clause boundaries so it stays quotable. */
function splitLongRun(run: string): string[] {
  if (run.length <= MAX_LEN) return [run];
  const parts = run.split(/(?<=[;:])\s+|\s+(?=[-—·|])\s*/).filter(Boolean);
  return parts.flatMap((p) =>
    p.length <= MAX_LEN ? [p] : (p.match(new RegExp(`.{1,${MAX_LEN}}(?:\\s|$)`, "g")) ?? [])
  );
}

/** Splits text into fragments short enough to quote verbatim in a report. */
export function toSentences(text: string): string[] {
  return text
    .split("\n")
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-ZА-ЯÄÖÜ0-9])/))
    .flatMap(splitLongRun)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_LEN && s.length <= MAX_LEN);
}

interface Matcher {
  readonly kind: FactKind;
  /** Must match the sentence for it to be considered at all. */
  readonly context: RegExp;
  /** Pulls the quotable value out of the sentence. */
  readonly value: RegExp;
}

const MATCHERS: readonly Matcher[] = [
  {
    kind: "price",
    // A currency amount is its own context — a page rarely writes "price" beside it.
    context: /[$€£]\s?\d|\d[\d.,]*\s?(?:USD|EUR|GBP)|\b(price|pricing|costs?|fee|per month|per year|plan|subscription)\b/i,
    value: /(?:[$€£]\s?\d[\d.,]*(?:\s?(?:\/|per )\s?(?:mo|month|yr|year|user|seat))?|\d[\d.,]*\s?(?:USD|EUR|GBP))/i,
  },
  {
    kind: "refund-window",
    context: /\b(refund|return|money[- ]back|cancel(?:lation)?)\b/i,
    value: /\b\d{1,3}\s?(?:calendar |working |business )?(?:days?|weeks?|months?)\b/i,
  },
  {
    kind: "delivery",
    context: /\b(deliver(?:y|ed)|ship(?:ping|ped)|dispatch|arrives?)\b/i,
    value: /\b(?:\d{1,3}(?:\s?[-–]\s?\d{1,3})?\s?(?:working |business )?(?:days?|weeks?|hours?)|next[- ]day|same[- ]day)\b/i,
  },
  {
    kind: "response-time",
    context: /\b(respond|reply|response time|get back to you|answer within|support)\b/i,
    value: /\b(?:within\s+)?\d{1,3}\s?(?:working |business )?(?:hours?|days?|minutes?)\b/i,
  },
  {
    kind: "human-contact",
    context: /\b(speak to|talk to|contact) (?:a |an )?(?:human|agent|advisor|representative|person)\b|\bcall us\b|\bphone\b/i,
    value: /(?:\+\d[\d\s().-]{6,}\d|\b(?:speak|talk) to (?:a |an )?(?:human|agent|advisor|representative|person)\b|\bcall us\b)/i,
  },
  {
    kind: "ai-disclosure",
    context: /\b(AI|artificial intelligence|chatbot|virtual assistant|automated (?:assistant|agent))\b/i,
    value: /\b(?:AI|artificial intelligence|chatbot|virtual assistant|automated (?:assistant|agent))\b/i,
  },
  {
    kind: "guarantee",
    context: /\b(guarantee[ds]?|warranty|we promise|committed to)\b/i,
    value: /\b(?:guarantee[ds]?|warranty|we promise|committed to)\b/i,
  },
];

/** Keeps the earliest fact per (kind, value) so reports do not repeat themselves. */
function dedupe(facts: readonly SourceFact[]): SourceFact[] {
  const seen = new Set<string>();
  const out: SourceFact[] = [];
  for (const f of facts) {
    const key = `${f.kind}::${f.value.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

export interface PageInput {
  readonly url: string;
  readonly html: string;
}

/**
 * Extracts checkable claims from a set of already-fetched pages.
 *
 * Fetching is left to the caller so this stays pure and testable, and so the
 * same function serves the live scanner and an offline re-run of a saved crawl.
 */
export function extractSourceOfTruth(
  pages: readonly PageInput[],
  options: { readonly maxPerKind?: number } = {}
): ExtractionResult {
  const maxPerKind = options.maxPerKind ?? 12;
  const collected: SourceFact[] = [];

  for (const page of pages) {
    const sentences = toSentences(htmlToText(page.html));
    for (const sentence of sentences) {
      for (const matcher of MATCHERS) {
        if (!matcher.context.test(sentence)) continue;
        const hit = matcher.value.exec(sentence);
        if (!hit) continue;
        collected.push({
          kind: matcher.kind,
          value: hit[0].trim(),
          quote: sentence,
          url: page.url,
        });
      }
    }
  }

  const deduped = dedupe(collected);

  const capped: SourceFact[] = [];
  const counts = new Map<FactKind, number>();
  for (const fact of deduped) {
    const n = counts.get(fact.kind) ?? 0;
    if (n >= maxPerKind) continue;
    counts.set(fact.kind, n + 1);
    capped.push(fact);
  }

  const found = new Set(capped.map((f) => f.kind));
  const missing = ALL_KINDS.filter((k) => !found.has(k));

  return { facts: capped, pagesScanned: pages.length, missing };
}
