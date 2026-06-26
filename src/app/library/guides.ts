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
