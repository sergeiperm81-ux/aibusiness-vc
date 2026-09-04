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
  "AI implementation & business process design",
  "Procurement & vendor assessment",
  "Legal & regulatory advice",
  "Training & AI literacy",
  "Research",
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
  /** Chosen by the person: only what they marked public is rendered. */
  linkedin?: string;
  website?: string;
  /** Published obfuscated so scrapers cannot lift it. */
  email?: string;
  phone?: string;
  /** Optional square portrait, cropped by the applicant. */
  photo?: string;
  /** Placeholder row used while the register is being built. Never a real person. */
  sample?: boolean;
}

/**
 * Placeholder rows while the community is being built.
 *
 * The names are the standard legal placeholders (Doe, Roe, Major, Stiles), never
 * invented people: every card is badged as a sample so nobody mistakes one for a
 * real member.
 */
const SAMPLE_SEED: [string, string, Region, string, string[]][] = [
  ["Jane Doe", "EU AI Act compliance lead for regulated industries", "Europe", "Amsterdam, Netherlands", ["EU AI Act", "ISO/IEC 42001", "Risk assessment & audit"]],
  ["John Roe", "Independent evaluator: red teaming and agent testing", "North America", "Boston, United States", ["Evaluation, testing & red teaming", "AI security"]],
  ["Mary Major", "Data governance for AI in healthcare", "Asia-Pacific", "Singapore", ["GDPR & data protection", "AI governance & policy"]],
  ["Richard Roe", "Turns AI pilots into processes people actually follow", "Europe", "Munich, Germany", ["AI implementation & business process design", "Training & AI literacy"]],
  ["Jane Public", "AI procurement and vendor due diligence", "Europe", "Dublin, Ireland", ["Procurement & vendor assessment", "Risk assessment & audit"]],
  ["John Stiles", "Regulatory counsel for AI products", "North America", "Toronto, Canada", ["Legal & regulatory advice", "EU AI Act"]],
  ["Alan Ample", "Fairness testing and bias audits", "Europe", "Barcelona, Spain", ["AI ethics & fairness", "Evaluation, testing & red teaming"]],
  ["Sam Sample", "Responsible deployment for customer-facing agents", "Latin America", "Sao Paulo, Brazil", ["Responsible AI deployment", "AI governance & policy"]],
  ["Paula Ployer", "ISO/IEC 42001 implementation and internal audit", "Middle East & Africa", "Dubai, United Arab Emirates", ["ISO/IEC 42001", "Risk assessment & audit"]],
  ["Robin Roe", "Security review of LLM applications", "Europe", "Warsaw, Poland", ["AI security", "Responsible AI deployment"]],
  ["Chris Coe", "AI policy research and public consultations", "Europe", "Brussels, Belgium", ["Research", "AI governance & policy"]],
  ["Dana Doe", "AI literacy programmes for non-technical teams", "Asia-Pacific", "Melbourne, Australia", ["Training & AI literacy", "AI implementation & business process design"]],
];

const SAMPLE_ABOUT =
  "Placeholder profile used while the community is being built. It shows how a full entry is laid out: what the person does, who they help and how they can be reached.";

export const EXPERTS: Expert[] = SAMPLE_SEED.map(([name, headline, region, location, expertise]) => ({
  slug: `sample-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
  name,
  headline,
  region,
  location,
  expertise,
  about: SAMPLE_ABOUT,
  services: ["Assessment and gap analysis", "Hands-on implementation support", "Review and second opinion"],
  sample: true,
}));

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

/** What a person gets out of being listed. Used on the community page, the form and the home page. */
export const REGISTER_BENEFITS = [
  {
    title: "Clients find you, not a firm",
    body: "People come here to hire a person. Make sure the person they find is you.",
  },
  {
    title: "ChatGPT can name you",
    body: "Your card is machine-readable. Ask an AI who does this work, and the answer can be your name.",
  },
  {
    title: "Briefs land in your inbox",
    body: "Companies write to us with a task. We send it to the three people who fit. No fee, no bidding.",
  },
  {
    title: "Your peers, in one place",
    body: "This profession is a year old and scattered across the world. Be visible to the others doing it.",
  },
] as const;
