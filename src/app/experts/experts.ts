/**
 * The expert register.
 *
 * Location is deliberately two fields and no more: `region` comes from a fixed
 * list so the catalogue can be filtered, and `location` is whatever the person
 * wants to show (a city, a country, or both). Filtering on free text alone falls
 * apart the moment two people write "UK" and "United Kingdom".
 */

export const REGIONS = [
  "Europe",
  "North America",
  "Latin America",
  "Middle East & Africa",
  "Asia-Pacific",
] as const;
export type Region = (typeof REGIONS)[number];

/**
 * What people in this profession actually do. Labels are written so that nobody
 * has to guess what a category means.
 */
export const EXPERTISE = [
  "EU AI Act",
  "ISO/IEC 42001",
  "GDPR & data protection",
  "AI governance & policy",
  "AI ethics & fairness",
  "Risk assessment & audit",
  "Evaluation, testing & red teaming",
  "AI security",
  "Responsible AI deployment",
  "Procurement & vendor assessment",
  "Legal & regulatory advice",
  "Training & AI literacy",
  "Research",
  "Industry specialist (health, finance, public sector and so on)",
] as const;
export type Expertise = (typeof EXPERTISE)[number];

export interface Expert {
  slug: string;
  name: string;
  headline: string;
  region: Region;
  /** Free text, shown as given: a city, a country, or both. */
  location: string;
  expertise: string[];
  about: string;
  services: string[];
  linkedin?: string;
  website?: string;
  /** Placeholder row used while the register is being built. Never a real person. */
  sample?: boolean;
}

export const EXPERTS: Expert[] = [
  {
    slug: "sample-jane-doe",
    name: "Jane Doe",
    headline: "EU AI Act compliance lead for regulated industries",
    region: "Europe",
    location: "Amsterdam, Netherlands",
    expertise: ["EU AI Act", "ISO/IEC 42001", "Risk assessment & audit"],
    about:
      "Placeholder profile used while the register is under construction. It shows how a full entry is laid out: what the person does, who they help and how they can be reached.",
    services: [
      "Article 50 transparency readiness",
      "ISO/IEC 42001 gap assessment",
      "Vendor AI risk review",
    ],
    sample: true,
  },
  {
    slug: "sample-john-roe",
    name: "John Roe",
    headline: "Independent evaluator: red teaming and agent testing",
    region: "North America",
    location: "Boston, United States",
    expertise: [
      "Evaluation, testing & red teaming",
      "Responsible AI deployment",
      "AI governance & policy",
    ],
    about:
      "Placeholder profile used while the register is under construction. It shows how a full entry is laid out: what the person does, who they help and how they can be reached.",
    services: ["Agent red teaming", "Pre-launch evaluation", "Model release review"],
    sample: true,
  },
  {
    slug: "sample-alex-sample",
    name: "Alex Sample",
    headline: "Data governance for AI in healthcare",
    region: "Asia-Pacific",
    location: "Singapore",
    expertise: [
      "GDPR & data protection",
      "AI governance & policy",
      "Industry specialist (health, finance, public sector and so on)",
    ],
    about:
      "Placeholder profile used while the register is under construction. It shows how a full entry is laid out: what the person does, who they help and how they can be reached.",
    services: ["Data governance design", "Clinical AI oversight", "Policy drafting"],
    sample: true,
  },
];

export function getExpert(slug: string): Expert | undefined {
  return EXPERTS.find((e) => e.slug === slug);
}

/** Initials for the placeholder avatar, so no invented photograph is ever shown. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** What a person gets out of being listed. Used on the register, the form and the home page. */
export const REGISTER_BENEFITS = [
  {
    title: "Clients find a person",
    body: "Companies come here looking for someone who can do the work, not for a consultancy. Your profile is what they read.",
  },
  {
    title: "AI search can cite you",
    body: "Every profile ships as a machine-readable card, so ChatGPT and Perplexity can name you when someone asks who does this work.",
  },
  {
    title: "Briefs come to you",
    body: "When a company writes to us needing help, we point them at the people who fit. No fee, no bidding.",
  },
  {
    title: "You meet your peers",
    body: "The profession is young and scattered. This is where its practitioners become visible to each other.",
  },
] as const;
