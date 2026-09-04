/**
 * The expert register.
 *
 * Location is stored in two layers on purpose: `region` comes from a fixed list
 * so the catalogue can actually be filtered, while `country` and `city` are free
 * text for display. Filtering on free text alone falls apart the moment two people
 * write "UK" and "United Kingdom".
 */

export const REGIONS = [
  "Europe",
  "North America",
  "Latin America",
  "Middle East & Africa",
  "Asia-Pacific",
] as const;
export type Region = (typeof REGIONS)[number];

export const EXPERTISE = [
  "EU AI Act",
  "ISO/IEC 42001",
  "GDPR & AI",
  "AI governance",
  "AI ethics & fairness",
  "Risk assessment & audit",
  "Evaluation & red teaming",
  "Responsible LLM deployment",
  "AI policy & strategy",
  "Sector expertise",
] as const;
export type Expertise = (typeof EXPERTISE)[number];

export const WORK_TYPES = [
  "Project based",
  "Fractional",
  "Advisory",
  "Full time",
  "Short-term",
] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export interface Expert {
  slug: string;
  name: string;
  headline: string;
  region: Region;
  country: string;
  city?: string;
  languages: string[];
  expertise: Expertise[];
  workTypes: WorkType[];
  remote: boolean;
  about: string;
  services: string[];
  linkedin?: string;
  website?: string;
  /** Placeholder row used while the register is being built. Never shown as a real person. */
  sample?: boolean;
}

export const EXPERTS: Expert[] = [
  {
    slug: "sample-jane-doe",
    name: "Jane Doe",
    headline: "EU AI Act compliance lead for regulated industries",
    region: "Europe",
    country: "Netherlands",
    city: "Amsterdam",
    languages: ["English", "Dutch"],
    expertise: ["EU AI Act", "ISO/IEC 42001", "Risk assessment & audit"],
    workTypes: ["Project based", "Fractional"],
    remote: true,
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
    country: "United States",
    city: "Boston",
    languages: ["English"],
    expertise: ["Evaluation & red teaming", "Responsible LLM deployment", "AI governance"],
    workTypes: ["Project based", "Short-term"],
    remote: true,
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
    country: "Singapore",
    languages: ["English", "Mandarin"],
    expertise: ["GDPR & AI", "AI policy & strategy", "Sector expertise"],
    workTypes: ["Advisory", "Fractional"],
    remote: true,
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
