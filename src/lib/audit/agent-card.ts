/**
 * Agent Card generator: a machine-readable company card, drafted
 * automatically from the buyer's own site.
 *
 * The Agent Card used to be a separate hand-made product; folding it into the
 * audit package required removing the human from the loop. The honesty rule
 * survives the automation because of where the facts come from: the model is
 * only allowed to restate what the site itself says, and anything the site
 * does not say arrives as an explicit gap for the owner to fill in, never as
 * an invented value.
 *
 * Every failure degrades to null and the package simply ships without a card,
 * consistent with how the report handles unscannable sites.
 */

import { safeFetchText } from "./safe-fetch";
import { extractTextContent } from "./live";

const MODEL = "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 20000;
const MAX_OUTPUT_TOKENS = 700;
/** Homepage text beyond this adds cost, not facts. */
const MAX_SOURCE_CHARS = 9000;

export interface AgentCardFacts {
  readonly companyName: string | null;
  readonly oneLiner: string | null;
  readonly offerings: readonly string[];
  readonly audience: string | null;
  readonly pricingNotes: string | null;
  readonly contactChannels: readonly string[];
}

interface JsonObject {
  [key: string]: unknown;
}

function asCleanString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= 300 ? text : null;
}

function asCleanList(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asCleanString(item))
    .filter((item): item is string => item !== null)
    .slice(0, maxItems);
}

function extractionPrompt(domain: string, pageText: string): string {
  return [
    `Below is the visible text of the homepage of ${domain}.`,
    "Extract ONLY facts that are explicitly stated in this text. Do not guess,",
    "do not use outside knowledge, do not embellish. If the text does not state",
    "a field, return null for it (or an empty array).",
    "",
    "Return JSON with exactly these keys:",
    `- company_name: the name the site calls itself, or null`,
    `- one_liner: one sentence saying what the company does, built strictly from the text, or null`,
    `- offerings: array of up to 6 short strings, each one product or service named in the text`,
    `- audience: who the text says it serves, or null`,
    `- pricing_notes: any concrete prices or pricing model stated in the text, or null`,
    `- contact_channels: array of up to 4 contact routes stated in the text (email, phone, form, chat)`,
    "",
    "HOMEPAGE TEXT:",
    pageText,
  ].join("\n");
}

/**
 * Reads the homepage and asks the model to restate its facts as structured
 * fields. Null when the site is unreachable, the key is missing, or the model
 * fails: the card is a bonus on top of the package, never a blocker.
 */
export async function extractAgentCardFacts(domain: string): Promise<AgentCardFacts | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[agent-card] OPENAI_API_KEY missing at runtime");
    return null;
  }

  let pageText: string;
  try {
    const response = await safeFetchText(`https://${domain}/`, {
      timeoutMs: 12000,
      maxBytes: 1024 * 1024,
    });
    if (!response.ok) {
      console.error(`[agent-card] homepage returned ${response.status} for ${domain}`);
      return null;
    }
    pageText = extractTextContent(response.text).slice(0, MAX_SOURCE_CHARS);
  } catch (error) {
    console.error(`[agent-card] homepage fetch failed for ${domain}:`, error);
    return null;
  }
  if (pageText.length < 100) {
    console.error(`[agent-card] too little text on ${domain} to draft a card`);
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: extractionPrompt(domain, pageText) }],
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error(`[agent-card] OpenAI ${response.status} for ${domain}`);
      return null;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as JsonObject;

    return {
      companyName: asCleanString(parsed.company_name),
      oneLiner: asCleanString(parsed.one_liner),
      offerings: asCleanList(parsed.offerings, 6),
      audience: asCleanString(parsed.audience),
      pricingNotes: asCleanString(parsed.pricing_notes),
      contactChannels: asCleanList(parsed.contact_channels, 4),
    };
  } catch (error) {
    console.error(`[agent-card] extraction failed for ${domain}:`, error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const FILL_IN = "<<FILL IN: your site does not state this on the homepage>>";

function lineOrGap(value: string | null): string {
  return value ?? FILL_IN;
}

/**
 * The card itself: a compact markdown file for the site root, in the spirit
 * of llms.txt. Fields the homepage did not state are explicit gaps, so the
 * owner can see at a glance what an AI agent cannot currently learn about
 * them, which is itself a finding.
 */
export function buildAgentCardMarkdown(
  domain: string,
  facts: AgentCardFacts,
  dateStamp: string
): string {
  const offerings =
    facts.offerings.length > 0 ? facts.offerings.map((o) => `- ${o}`).join("\n") : `- ${FILL_IN}`;
  const contacts =
    facts.contactChannels.length > 0
      ? facts.contactChannels.map((c) => `- ${c}`).join("\n")
      : `- ${FILL_IN}`;

  return `# Agent Card: ${facts.companyName ?? domain}

> ${lineOrGap(facts.oneLiner)}

Every statement in this card was drafted from the public pages of ${domain}
on ${dateStamp}. Lines marked FILL IN are things your own site does not say,
which means AI assistants cannot learn them either. Fill them in, keep the
rest, and publish this file at https://${domain}/agent-card.md (and link it
from your llms.txt).

## What we offer

${offerings}

## Who it is for

${lineOrGap(facts.audience)}

## Pricing

${lineOrGap(facts.pricingNotes)}

## How to reach a human

${contacts}

## Source

Maintained by ${facts.companyName ?? domain}. Drafted with the AI Visibility
Audit by aibusiness.vc on ${dateStamp}. Update this file whenever your
services change: a stale card is worse than none.
`;
}

/** Matching JSON-LD, only carrying fields the homepage actually stated. */
export function buildAgentCardJsonLd(domain: string, facts: AgentCardFacts): string {
  const organization: JsonObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: facts.companyName ?? `<<FILL IN: company name>>`,
    url: `https://${domain}`,
  };
  if (facts.oneLiner) organization.description = facts.oneLiner;
  if (facts.offerings.length > 0) {
    organization.makesOffer = facts.offerings.map((offering) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: offering },
    }));
  }

  return JSON.stringify(
    {
      _readme: [
        "Drafted from the public pages of your site. Review, replace any",
        "<< >> placeholders, then paste into a script tag with",
        'type="application/ld+json" on your homepage.',
      ],
      jsonLd: organization,
    },
    null,
    2
  );
}
