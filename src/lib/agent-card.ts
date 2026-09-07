/**
 * Agent Card — the machine-readable description of an organisation.
 *
 * Two renderings of the same record:
 *   - `toCardMarkdown()`  → the file a company publishes at /agent-card.md
 *   - `toCardJsonLd()`    → schema.org JSON-LD embedded in the page <head>
 *
 * The card answers what an AI agent actually needs before it can recommend or
 * transact with a business: who you are, what you sell, who it is for, what it
 * costs, how a human is reached, and whether AI is involved in serving the
 * customer. That last field is what separates this from a generic schema dump —
 * it carries the disclosure obligation into the machine layer.
 */

export type CardSource = "public" | "verified";

export interface CardOffering {
  readonly name: string;
  readonly summary: string;
  readonly forWhom?: string;
  readonly pricing?: string;
}

export interface AgentCard {
  /** Stable slug used in URLs. */
  readonly id: string;
  readonly name: string;
  /** One sentence. What the organisation does, in plain language. */
  readonly summary: string;
  readonly url: string;
  readonly category?: string;
  readonly offerings: readonly CardOffering[];
  /** Facts an agent can check against the site itself. */
  readonly verifiableFacts?: readonly string[];
  /** How a customer reaches a human being. */
  readonly humanContact?: string;
  /** Whether AI serves customers here, and how. Empty string = not stated. */
  readonly aiDisclosure?: string;
  /**
   * "public"   — assembled by AI Business from publicly available information.
   * "verified" — submitted by the organisation and checked against its site.
   */
  readonly source: CardSource;
  /** ISO date (YYYY-MM-DD). */
  readonly updated: string;
}

const SITE = "https://aibusiness.vc";

function sourceLine(card: AgentCard): string {
  return card.source === "verified"
    ? "Submitted by the organisation and checked against its own website by AI Business."
    : "Assembled by AI Business from publicly available information. The organisation has not reviewed it — details may be incomplete.";
}

/** Escapes pipe characters so a value cannot break out of a markdown table cell. */
function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

export function toCardMarkdown(card: AgentCard, cardUrl: string): string {
  const lines: string[] = [
    `# ${card.name} — Agent Card`,
    "",
    card.summary,
    "",
    "## Identity",
    "",
    `- **Name:** ${card.name}`,
    `- **Website:** ${card.url}`,
  ];

  if (card.category) lines.push(`- **Category:** ${card.category}`);
  lines.push(`- **Card source:** ${card.source}`, `- **Last updated:** ${card.updated}`, "");

  if (card.offerings.length > 0) {
    lines.push("## What is offered", "");
    lines.push("| Offering | What it is | Who it is for | Pricing |");
    lines.push("| --- | --- | --- | --- |");
    for (const o of card.offerings) {
      lines.push(
        `| ${cell(o.name)} | ${cell(o.summary)} | ${cell(o.forWhom ?? "—")} | ${cell(o.pricing ?? "—")} |`
      );
    }
    lines.push("");
  }

  if (card.verifiableFacts && card.verifiableFacts.length > 0) {
    lines.push("## Verifiable facts", "");
    lines.push("Each statement below can be checked against the website above.", "");
    for (const f of card.verifiableFacts) lines.push(`- ${f}`);
    lines.push("");
  }

  lines.push("## Reaching a human", "", card.humanContact ?? "Not stated on the card.", "");
  lines.push(
    "## AI in customer service",
    "",
    card.aiDisclosure && card.aiDisclosure.trim()
      ? card.aiDisclosure
      : "Not stated on the card.",
    ""
  );

  lines.push(
    "## About this card",
    "",
    sourceLine(card),
    "",
    `Card format by AI Business (${SITE}). Canonical copy: ${cardUrl}`,
    ""
  );

  return lines.join("\n");
}

export function toCardJsonLd(card: AgentCard, cardUrl: string): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: card.name,
    description: card.summary,
    url: card.url,
    subjectOf: {
      "@type": "WebPage",
      "@id": cardUrl,
      name: `${card.name} — Agent Card`,
      dateModified: card.updated,
    },
  };

  if (card.offerings.length > 0) {
    jsonLd.makesOffer = card.offerings.map((o) => ({
      "@type": "Offer",
      name: o.name,
      description: o.summary,
      ...(o.pricing ? { priceSpecification: { "@type": "PriceSpecification", description: o.pricing } } : {}),
      ...(o.forWhom ? { eligibleCustomerType: o.forWhom } : {}),
    }));
  }

  if (card.humanContact) {
    jsonLd.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      description: card.humanContact,
    };
  }

  return jsonLd;
}
