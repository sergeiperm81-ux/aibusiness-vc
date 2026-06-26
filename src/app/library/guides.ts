export interface Guide {
  slug: string;
  title: string;
  kicker: string;
  tagline: string;
  cardBlurb: string;
  description: string;
  includes: string[];
  pdf: string;
  pages: number;
  year: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "start-with-your-services",
    title: "Start with Your Services",
    kicker: "AI Service Governance",
    tagline:
      "A leader's 7-step playbook for adopting AI — in business, nonprofits, and public institutions.",
    cardBlurb:
      "You can't digitize chaos. A practical 7-step method for putting your services in order first, then putting AI safely inside them — built around a ready-to-use AI Service Passport.",
    description:
      "Most leaders bring AI into their internal functions first, because it feels like the easy win. This playbook argues the opposite: start with the services your customers actually pay for, describe each one properly, and only then hand it to an AI agent. It's my own system for standardizing AI services, grown out of years of moving government services online during administrative reform — and it fits business, non-profits, and public institutions alike. You get a clear sequence: answer the ten questions every leader should be able to answer before AI faces a customer, pick a safe first pilot, set how far the agent may act on its own, and write an AI Service Passport that doubles as manifesto, storefront, and system prompt. Treat it not as dogma but as a working template — a place to start as you find your footing with AI.",
    includes: [
      "The 10 questions to answer before you put AI in front of customers",
      "Why to start with services, not internal functions — and how to pick a safe first pilot",
      "A 5-level matrix for setting how far an AI agent may act on its own (up to agent-to-agent)",
      "The AI Service Passport — a three-part tool (manifesto, storefront, prompt) you build per service",
      "Rules for AI services at scale + how to monitor quality (mystery shopping, audits, feedback)",
      "EU AI Act disclosure (mandatory from August 2026) built in from the start",
    ],
    pdf: "/library/start-with-your-services.pdf",
    pages: 14,
    year: "2026",
  },
  {
    slug: "consumer-control-of-ai",
    title: "Consumer Control of AI",
    kicker: "Governance from the consumer side",
    tagline:
      "How ordinary people can judge the quality of AI services — and help make them better.",
    cardBlurb:
      "A practical method — plus a ready-to-use assessment card — for judging any AI service from the customer's side of the counter.",
    description:
      "Companies are building internal control over their AI — they call it AI governance. But that control serves the company. The other side of the counter, the consumer's side, stands almost empty. This guide hands you that side: a simple, proven method for judging the quality of any AI service from your own experience, gathering evidence, and pushing to have problems fixed. It is adapted from twenty years of standards, independent quality assessment, and mystery shopping in public services — now pointed at AI. At its heart is a ready-to-use Assessment Card you can apply to any AI bot today.",
    includes: [
      "What consumer control is — and how it differs from corporate AI governance",
      "The four-step method: observe, gather evidence, assess, demand action",
      "A ready-to-use Assessment Card to evaluate any AI service",
      "Your rights under the EU AI Act and GDPR — and where to turn",
    ],
    pdf: "/library/consumer-control-of-ai.pdf",
    pages: 10,
    year: "2026",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
