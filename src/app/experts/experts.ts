/**
 * The expert register.
 *
 * Three separate dimensions, deliberately not mixed into one list: what a person
 * does (practice areas), which rulebooks they work against (frameworks), and
 * where they do it (industries, jurisdictions). Putting a law, a standard and a
 * job title in the same dropdown is what made the first version unusable.
 *
 * Location is two fields: `region` comes from a fixed list so the catalogue can
 * be filtered, and `location` is free text shown as given. Filtering on free
 * text alone falls apart the moment two people write "UK" and "United Kingdom".
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
 * Practice areas, grouped.
 *
 * The register covers the whole craft, not one niche: people who build AI,
 * people who put it into a business, and people who govern, test and secure it.
 * A company looking for help asks for "an AI expert", not for a category, and a
 * register that turns away engineers simply sends them somewhere else.
 *
 * Groups exist so a list this long stays readable in a dropdown.
 */
export const PRACTICE_GROUPS = [
  {
    label: "Build & engineer",
    items: [
      "AI engineering & development",
      "Machine learning & data science",
      "AI agents & automation",
      "LLM applications & prompt engineering",
      "Data engineering & infrastructure",
      "AI product management",
      "AI design & user experience",
    ],
  },
  {
    label: "Adopt & operate",
    items: [
      "AI strategy & transformation",
      "Governed AI adoption & process redesign",
      "Procurement & third-party risk",
      "AI literacy & training",
      "Change management",
    ],
  },
  {
    label: "Govern, assure & secure",
    items: [
      "Governance operating models & AI policy",
      "Legal, regulatory & standards compliance",
      "AI risk & impact assessment",
      "Assurance, audit & conformity assessment",
      "Evaluation & testing",
      "Red teaming",
      "AI safety, security & incident response",
      "Data governance, privacy & documentation",
      "Human oversight, transparency & accountability",
      "Ethics, human rights & fairness",
      "AI research & public policy",
    ],
  },
] as const;

export const PRACTICE_AREAS = PRACTICE_GROUPS.flatMap((g) => g.items as readonly string[]);
export type PracticeArea = (typeof PRACTICE_AREAS)[number];

/** The rulebooks a person actually works against. */
export const FRAMEWORKS = [
  "EU AI Act",
  "ISO/IEC 42001",
  "NIST AI RMF",
  "GDPR",
  "Sector regulation",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const INDUSTRIES = [
  "Financial services",
  "Health & life sciences",
  "Public sector",
  "Technology & software",
  "Retail & consumer",
  "Manufacturing & industry",
  "Insurance",
  "Education",
  "Legal services",
  "Media",
  "Energy & utilities",
  "Transport & logistics",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

/**
 * What someone is open to, rather than what they sell.
 *
 * Researchers, policy people and academics belong in this register too, and
 * "services offered" quietly excludes them.
 */
export const WORK_FORMATS = [
  "Consulting",
  "Advisory & board work",
  "Research collaboration",
  "Speaking",
  "Media commentary",
  "Training",
  "Employment",
] as const;
export type WorkFormat = (typeof WORK_FORMATS)[number];

export const AVAILABILITY = ["Open to work now", "Limited availability", "Not available"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export interface Expert {
  slug: string;
  name: string;
  headline: string;
  region: Region;
  /** Free text, shown as given: a city, a country, or both. */
  location: string;
  practiceAreas: string[];
  frameworks?: string[];
  industries?: string[];
  /** Legal orders a person actually advises on, free text: "EU, UK, Switzerland". */
  jurisdictions?: string;
  languages?: string[];
  workFormats?: string[];
  availability?: Availability;
  about: string;
  /** What they do for people. Optional: research and policy work is not a service list. */
  services?: string[];
  role?: string;
  organisation?: string;
  /** Only what the person marked public is ever rendered. */
  linkedin?: string;
  website?: string;
  /** Split in two so the page source never carries a user@domain pattern. */
  email?: { user: string; host: string };
  phone?: string;
  /** Square portrait, cropped by the applicant. */
  photo?: string;
}

const SERGEI: Expert = {
  slug: "sergei-ponomarev",
  name: "Sergei Ponomarev, PhD",
  headline: "Independent test purchases of AI agents",
  region: "Europe",
  location: "Sveti Vlas, Bulgaria",
  photo: "/images/sergei-desk.png",
  role: "Founder and editor",
  organisation: "aibusiness.vc",
  practiceAreas: [
    "Evaluation & testing",
    "Assurance, audit & conformity assessment",
    "Governance operating models & AI policy",
    "Human oversight, transparency & accountability",
    "Governed AI adoption & process redesign",
    "AI research & public policy",
  ],
  frameworks: ["EU AI Act"],
  industries: ["Public sector", "Retail & consumer", "Technology & software"],
  jurisdictions: "EU",
  languages: ["English", "Russian"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration", "Speaking"],
  availability: "Open to work now",
  about:
    "Political scientist with a PhD on e-government. For seven years I led nationwide research and evaluation of public services for government clients, using independent assessments, test purchases, interviews and surveys, and I authored a transparency standard adopted by a city legislature. Since 2024 I have applied the same craft to AI through aibusiness.vc, publishing original methods on AI transparency and accountability, including a toolkit for EU AI Act Article 50 disclosure and a full test purchase method for customer-facing agents, piloted with a Swiss AI metrology company. I also build AI agents hands-on, which keeps the governance work grounded in how these systems actually behave.",
  services: [
    "Test purchases of AI agents: going through your service as a customer would, then comparing what the agent promised against what the system recorded",
    "The document set for an AI service: public AI policy, AI service passport, AI receipt and the rules that hold them together",
    "Rules for adopting AI: how a service is described, handed over and kept accountable once it runs on an agent",
    "AI visibility audit: how ChatGPT and AI search read and cite your website",
  ],
  linkedin: "https://www.linkedin.com/in/sergei-ponomarev/",
  email: { user: "info", host: "aibusiness.vc" },
};

export const EXPERTS: Expert[] = [SERGEI];

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

/** What a person gets out of being listed. Used on the community page and the form. */
export const REGISTER_BENEFITS = [
  {
    title: "Clients find you, not a firm",
    body: "People come here to hire a person. Make sure the person they find is you.",
  },
  {
    title: "Built to be read by machines",
    body: "Your profile ships with structured data, so search engines and AI assistants can read who you are and what you do.",
  },
  {
    title: "Another channel for work",
    body: "Companies already write to us looking for help. The register is where we look first when they do.",
  },
  {
    title: "Your peers, in one place",
    body: "This profession is young and scattered across the world. Be visible to the others doing it.",
  },
] as const;
