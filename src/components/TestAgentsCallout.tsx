import Link from "next/link";

/**
 * A contextual pointer to the test purchase service.
 *
 * Placed only where the reader is already looking at a customer-facing agent:
 * a chatbot tool page, a support-automation category, an article about
 * agents. The anchor text is varied on purpose, because people and assistants
 * search for this work under many names, and a site that says "AI Service
 * Check" everywhere is findable under exactly one of them.
 */

export type CalloutTone = "light" | "dark";

interface Props {
  readonly tone?: CalloutTone;
  /** Overrides the default copy where a page needs its own wording. */
  readonly heading?: string;
  readonly body?: string;
  readonly anchor?: string;
}

const DEFAULTS = {
  heading: "Testing AI agents and chatbots",
  body: "Before a bot talks to your customers, it is worth knowing what it actually tells them. An independent test purchase compares what you promised, what the bot said, and what your system recorded, with verbatim evidence.",
  anchor: "How AI agent testing works",
};

export function TestAgentsCallout({ tone = "light", heading, body, anchor }: Props) {
  const copy = {
    heading: heading ?? DEFAULTS.heading,
    body: body ?? DEFAULTS.body,
    anchor: anchor ?? DEFAULTS.anchor,
  };

  if (tone === "dark") {
    return (
      <aside className="rounded-2xl border border-card-border bg-card-bg p-6">
        <h2 className="text-lg font-bold text-white">{copy.heading}</h2>
        <p className="mt-2 text-base leading-relaxed text-white/70">{copy.body}</p>
        <Link
          href="/service-check"
          className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
        >
          {copy.anchor} &rarr;
        </Link>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
      <h2 className="text-lg font-bold text-black">{copy.heading}</h2>
      <p className="mt-2 text-base leading-relaxed text-black/75">{copy.body}</p>
      <Link
        href="/service-check"
        className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
      >
        {copy.anchor} &rarr;
      </Link>
    </aside>
  );
}

/** Categories where a reader is plausibly responsible for a customer-facing agent. */
export const AGENT_CATEGORIES: readonly string[] = [
  "Chatbots & Agents",
  "Customer Support",
  "Sales & CRM",
  "No-Code & Low-Code",
];

export function isAgentCategory(category: string): boolean {
  return AGENT_CATEGORIES.includes(category);
}
