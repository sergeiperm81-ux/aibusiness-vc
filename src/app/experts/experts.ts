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

/** Marks someone whose work does not depend on the sector. Matches every filter. */
export const ANY_INDUSTRY = "Any industry";

export const INDUSTRIES = [
  ANY_INDUSTRY,
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

export interface Expert {
  slug: string;
  name: string;
  headline: string;
  region: Region;
  /** Free text, shown as given: a city, a country, or both. */
  location: string;
  practiceAreas: string[];
  industries?: string[];
  languages?: string[];
  workFormats?: string[];
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
  industries: ["Public sector", "Retail & consumer", "Technology & software"],
  languages: ["English", "Russian"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration", "Speaking"],
  about:
    "Political scientist with a PhD on e-government. For seven years I led nationwide research and evaluation of public services for government clients, using independent assessments, test purchases, interviews and surveys, and I authored a transparency standard adopted by a city legislature. For the last year and a half I have applied the same craft to AI through aibusiness.vc, publishing original methods on AI transparency and accountability, including a toolkit for EU AI Act Article 50 disclosure and a full test purchase method for customer-facing agents, piloted with a French AI metrology company. I also build AI agents hands-on, which keeps the governance work grounded in how these systems actually behave.",
  services: [
    "Test purchases of AI agents: going through your service as a customer would, then comparing what the agent promised against what the system recorded",
    "The document set for an AI service: public AI policy, AI service passport, AI receipt and the rules that hold them together",
    "Rules for adopting AI: how a service is described, handed over and kept accountable once it runs on an agent",
    "AI visibility audit: how ChatGPT and AI search read and cite your website",
  ],
  linkedin: "https://www.linkedin.com/in/sergei-ponomarev/",
  email: { user: "info", host: "aibusiness.vc" },
};

const AMANDA: Expert = {
  slug: "amanda-cunningham",
  name: "Amanda Cunningham",
  headline: "Responsible AI adoption and AI operating foundations for organisations",
  region: "Europe",
  location: "Ilkley, West Yorkshire, United Kingdom",
  photo: "/images/experts/amanda-cunningham.jpg",
  role: "Founder & AI Adoption Consultant",
  organisation: "Savvy Pixel®",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "AI literacy & training",
    "Change management",
    "Governance operating models & AI policy",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
  ],
  industries: ["Retail & consumer", "Education", "Technology & software", "Media"],
  languages: ["English"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration", "Media commentary"],
  about:
    "I support organisations to adopt AI with clearer business context, practical operating foundations and accountable review. My work focuses on AI strategy, organisational capability, governed adoption and the practical integration of AI into real work, with clearer boundaries around privacy, accuracy, transparency and accountability. Through Savvy Pixel®, I work with organisations that are already experimenting with AI but need greater consistency, confidence and structure around how it is used.",
  services: [
    "AI adoption strategy",
    "AI operating foundations",
    "AI business context and workspace design",
    "AI use-case and workflow review",
    "Responsible AI adoption guidance",
    "AI governance and policy-to-practice guidance",
    "AI capability and role induction",
    "AI responsibility mapping",
    "AI and software sense checks",
    "90-day AI adoption planning",
  ],
  linkedin: "https://www.linkedin.com/in/amandasavvypixel",
  website: "https://www.savvypixel.co.uk/",
  email: { user: "amanda", host: "savvypixel.co.uk" },
};

const SEBASTIEN: Expert = {
  slug: "sebastien-favre-lecca",
  name: "Sébastien Favre-Lecca",
  headline: "Runtime measurement and behavioral stability for AI",
  region: "Europe",
  location: "France",
  photo: "/images/experts/sebastien-favre-lecca.jpg",
  role: "Founder & Research Lead",
  organisation: "NeoMundi",
  practiceAreas: [
    "Data engineering & infrastructure",
    "AI product management",
    "Evaluation & testing",
    "AI risk & impact assessment",
    "AI research & public policy",
  ],
  languages: ["English", "French"],
  about:
    "Founder of NeoMundi, developing an independent runtime measurement layer for AI systems. My work focuses on behavioral stability, variation and drift at execution time, producing measurable context that organizations can use for evaluation, governance and evidence without replacing their existing infrastructure.",
  services: [
    "Runtime AI measurement strategy",
    "Behavioral stability evaluation",
    "Measurement-layer integration and pilot design",
    "AI reliability research collaboration",
    "Executive briefings and speaking",
  ],
  linkedin: "https://www.linkedin.com/in/sebastien-favre-b4611127/",
  website: "https://neomundi.org",
};

const JOZSEF: Expert = {
  slug: "jozsef-fodor",
  name: "Jozsef Fodor",
  headline:
    "Runtime AI governance, evidence of control, human oversight and reconstructability under the EU AI Act",
  region: "Europe",
  location: "Dublin, Ireland",
  photo: "/images/experts/jozsef-fodor.jpg",
  role: "Independent Researcher, Runtime AI Governance",
  organisation: "NextOne",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "AI research & public policy",
  ],
  industries: ["Technology & software", "Public sector"],
  languages: ["English", "Hungarian"],
  workFormats: [
    "Consulting",
    "Research collaboration",
    "Speaking",
    "Media commentary",
    "Employment",
  ],
  about:
    "I work on runtime AI governance: how organisations can demonstrate that AI systems operated under valid authority, effective human oversight and reconstructable conditions when their outputs influenced real-world consequences.\nMy work focuses on the gap between governance as policy and governance as operational evidence. I am particularly interested in evidence of control, authority continuity, human intervention capability, operational validity and the ability to reconstruct the conditions under which an AI-assisted action or decision occurred.\nI am the author of “Article 26 as Runtime Governance: Evidence of Control, Human Oversight and Deployer Responsibility under the EU AI Act”, which examines deployer responsibility from the perspective of runtime evidence and reconstructability.\nThrough NextOne, I also explore practical architectures that connect governance states to technical monitoring and execution records.",
  services: [
    "I help organisations examine whether their AI governance can be demonstrated in operation, not only documented on paper.",
    "This can include reviewing human oversight and deployer-control arrangements, identifying gaps in runtime evidence, designing evidence and reconstructability models, and examining how operational evidence can support EU AI Act deployer responsibilities.",
    "I also explore how governance states can be connected to technical monitoring and execution records so that organisations can later demonstrate the conditions under which AI-assisted actions or decisions took place.",
    "I am open to research collaborations around runtime AI governance, evidence of control, human oversight, operational evidence and deployer responsibility.",
  ],
  linkedin: "https://www.linkedin.com/in/jozsef-fodor-a1a1ab203/",
  website: "https://nextone.ie",
};

const MARIA: Expert = {
  slug: "maria-kollia",
  name: "Maria Kollia",
  headline: "AI governance and compliance, enterprise AI assurance, agentic AI",
  region: "Europe",
  location: "Thessaloniki, Greece",
  photo: "/images/experts/maria-kollia.jpg",
  role: "Co-Chair, Global Advisory Board",
  organisation: "International Artificial Intelligence Committee (STANAIC)",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Assurance, audit & conformity assessment",
    "Evaluation & testing",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "AI research & public policy",
    "Governed AI adoption & process redesign",
    "AI literacy & training",
    "AI engineering & development",
    "AI agents & automation",
  ],
  industries: [
    "Technology & software",
    "Public sector",
    "Manufacturing & industry",
    "Energy & utilities",
  ],
  languages: ["Greek", "English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Training",
    "Employment",
  ],
  about:
    "AI governance and compliance researcher focused on turning governance principles into operational controls for real-world AI systems. My work covers enterprise AI assurance, human authority and oversight, agentic AI governance, runtime controls, evidence and traceability, revalidation, risk assessment, and governance before execution. I also serve as Co-Chair of the STANAIC Global Advisory Board and contribute to research, governance design, and enterprise AI compliance initiatives.",
  services: [
    "AI governance and compliance assessment",
    "Enterprise AI assurance and audit",
    "AI risk and impact assessment",
    "Human oversight and accountability design",
    "Agentic AI governance",
    "Runtime governance and execution controls",
    "Evidence and traceability design",
    "AI governance operating models",
    "Revalidation and remediation frameworks",
    "Governance policy and control mapping",
    "AI research and advisory",
    "AI governance training",
  ],
  linkedin: "https://www.linkedin.com/in/maria-kollia-64520a245/",
  website: "https://stanaic.org",
  email: { user: "karnw79", host: "gmail.com" },
};

const MISTY: Expert = {
  slug: "misty-michele-richards",
  name: "Misty Michele Richards",
  headline: "Runtime AI governance, multi-agent infrastructure and continuity engineering",
  region: "North America",
  location: "Pennsylvania",
  photo: "/images/experts/misty-michele-richards.jpg",
  role: "AI Systems Architect & Independent Researcher",
  organisation: "Unified Resonance Research Program (URRP)",
  practiceAreas: [
    "AI engineering & development",
    "AI agents & automation",
    "Governance operating models & AI policy",
    "AI risk & impact assessment",
    "Evaluation & testing",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "AI research & public policy",
  ],
  industries: ["Technology & software"],
  languages: ["English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Employment",
  ],
  about:
    "I am an AI Systems Architect and independent researcher focused on runtime AI governance, multi-agent systems, continuity engineering, and behavioral stability.\nI founded the Unified Resonance Research Program (URRP), an independent research program spanning reasoning architecture, runtime governance, perturbation and continuity evaluation, nonlinear simulation, and human-AI systems.\nMy work includes the Resonance Logic Model (RLM), a multi-agent reasoning architecture with explicit friction detection, escalation, governance gates, and auditable knowledge extraction; the Continuity Harness, which evaluates behavioral and structural continuity under controlled perturbation; and a substrate-general Governance Stack for runtime metrics, gate logic, and observer-independent intervention.\nMy research asks how autonomous and multi-agent systems can preserve coherence, authority boundaries, and meaningful human oversight as behavior unfolds over time.",
  services: [
    "Runtime AI governance architecture",
    "Multi-agent system architecture and evaluation",
    "AI agent behavioral stability assessment",
    "Continuity and trajectory analysis under perturbation",
    "AI governance framework design",
    "Runtime metrics, gates and intervention architecture",
    "Multi-agent reasoning architecture",
    "AI system failure-mode analysis",
    "Agentic AI evaluation and testing",
    "Human oversight and accountability architecture",
    "Research collaboration on AI governance and autonomous systems",
    "Technical advisory on runtime governance and multi-agent systems",
  ],
  linkedin: "https://www.linkedin.com/in/resonancearchitect/",
};

const AISHA: Expert = {
  slug: "aisha-stargill",
  name: "Aisha Stargill",
  headline:
    "Independent forensic AI bias audits for hiring tools (NYC LL144, Colorado AI Act, EU AI Act)",
  region: "North America",
  location: "Winston-Salem, North Carolina, USA",
  photo: "/images/experts/aisha-stargill.jpg",
  role: "Founder & Principal Consultant",
  organisation: "ALS Consulting",
  practiceAreas: [
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Assurance, audit & conformity assessment",
    "Evaluation & testing",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "Governance operating models & AI policy",
    "Procurement & third-party risk",
  ],
  industries: ["Any industry"],
  languages: ["English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Media commentary",
  ],
  about:
    "I run independent forensic bias audits of algorithmic hiring tools for employers and AEDT vendors. My work covers NYC Local Law 144, the Colorado AI Act, and the EU AI Act: disparate-impact testing, audit reporting, candidate-notice review, and the human-oversight controls that sit around an automated decision. I also build human-on-the-loop review infrastructure so a person can see, question, and document what a hiring system is doing before a rejection goes out. Independence is per-engagement: I audit a tool, or I help a vendor get ready for one, not both for the same client.",
  services: [
    "Independent bias audit for hiring tools (NYC Local Law 144)",
    "Independent bias audit under the Colorado AI Act",
    "EU AI Act conformity readiness for hiring systems",
    "Disparate-impact and adverse-impact testing",
    "Candidate-notice and audit-report review",
    "Human-on-the-loop review infrastructure (build and licensing)",
    "AEDT vendor US-market readiness assessment",
  ],
  linkedin: "https://www.linkedin.com/in/aisha-stargill-668075263/",
  website: "https://alsconsulting.services",
  email: { user: "aishas", host: "alsconsulting.services" },
  phone: "+1 336 573 8426",
};

const JAVIER: Expert = {
  slug: "javier-villarrubia",
  name: "Javier Villarrubia",
  headline: "Strategy, AI, knowledge and transformation",
  region: "Europe",
  location: "Spain",
  photo: "/images/experts/javier-villarrubia.jpg",
  role: "Independent Consultant",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "AI literacy & training",
    "Change management",
    "Governance operating models & AI policy",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "AI research & public policy",
    "AI design & user experience",
    "AI product management",
  ],
  industries: [
    "Financial services",
    "Technology & software",
    "Education",
    "Media",
    "Retail & consumer",
  ],
  languages: ["Spanish", "English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Training",
    "Media commentary",
    "Employment",
  ],
  about:
    "I work at the intersection of strategy, people, knowledge and emerging technologies.\nMy career has combined consulting, university teaching, entrepreneurship and executive learning, helping organizations navigate change, improve performance and prepare for future challenges.\nToday, I focus especially on how Artificial Intelligence can create real business value when combined with human capability, sound strategy and effective organizational design.\nKey areas of interest include:\n• Business transformation\n• AI adoption and human-AI collaboration\n• Knowledge management and learning systems\n• Talent, leadership and organizational development\n• Innovation and growth strategy\nI believe technology alone is never the answer. Sustainable advantage comes from aligning strategy, people and intelligence.",
  linkedin: "https://www.linkedin.com/in/javiervb",
};

const ELENA: Expert = {
  slug: "elena-uzunova",
  name: "Elena Uzunova",
  headline:
    "Proportionate AI governance: EU AI Act, ISO 42001, NIST AI RMF, procurement and due diligence readiness",
  region: "Europe",
  location: "Oxford, United Kingdom",
  photo: "/images/experts/elena-uzunova.jpg",
  role: "AI Governance and Compliance Lead",
  organisation: "CyberLex, AI Compliance Layer",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "Procurement & third-party risk",
    "AI literacy & training",
    "Change management",
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Assurance, audit & conformity assessment",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "AI research & public policy",
    "AI safety, security & incident response",
  ],
  industries: ["Financial services", "Technology & software", "Legal services"],
  languages: ["English", "Bulgarian"],
  workFormats: ["Consulting", "Research collaboration", "Training", "Employment"],
  about:
    "I help organisations adopt AI in a controlled, defensible and proportionate way.\nMy work sits at the intersection of AI governance, compliance, legal risk, procurement readiness and operational documentation. I focus on helping teams move from broad AI policy statements to practical governance evidence: inventories, risk assessments, human oversight workflows, procurement questions, documentation, accountability structures and internal controls.\nI am especially interested in EU AI Act readiness, ISO-style AI governance, responsible AI adoption, human rights, transparency and the governance of AI systems in regulated or scrutiny-sensitive environments.\nI am known for translating complex legal, regulatory and governance requirements into clear, usable compliance infrastructure for founders, SaaS companies, legal teams and organisations adopting AI responsibly.",
  services: [
    "EU AI Act readiness",
    "AI governance documentation",
    "AI risk and impact assessment",
    "AI policy and governance operating models",
    "AI procurement and third-party risk support",
    "AI vendor due diligence questions",
    "Human oversight workflow design",
    "AI transparency and accountability documentation",
    "AI compliance checklists and templates",
    "Governed AI adoption support",
    "AI literacy and internal training",
    "Responsible AI implementation support",
    "AI governance evidence mapping",
    "Data governance, privacy and documentation support",
    "Human rights and fairness review for AI use cases",
  ],
  linkedin: "https://www.linkedin.com/in/uzunova",
  website: "https://www.uzunova.eu",
  email: { user: "elena", host: "uzunova.eu" },
};

const MAHER: Expert = {
  slug: "maher-hassan-moftah",
  name: "Maher Hassan Moftah",
  headline:
    "Political economy, sustainable development, governance and AI decision systems",
  region: "Middle East & Africa",
  location: "Egypt",
  photo: "/images/experts/maher-hassan-moftah.jpg",
  role: "Independent Strategic Thinker",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "Change management",
    "Governance operating models & AI policy",
    "AI risk & impact assessment",
    "Human oversight, transparency & accountability",
    "AI agents & automation",
    "AI product management",
  ],
  industries: [
    "Financial services",
    "Technology & software",
    "Public sector",
    "Education",
    "Energy & utilities",
    "Health & life sciences",
  ],
  languages: ["English", "Arabic"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration", "Speaking"],
  about:
    "Independent strategic development thinker and AI governance analyst working at the intersection of political economy, sustainable development, governance, and the engineering of decision systems. My work explores how human judgment, institutional authority, and intelligent systems can be structured to support accountable, legitimate, and sustainable decision-making.",
  services: [
    "AI governance and strategic analysis",
    "Decision-system design",
    "Human-in-the-loop governance",
    "AI risk and impact assessment",
    "Institutional accountability and oversight",
    "Political economy and sustainable development analysis",
    "Strategic advisory and thought leadership",
  ],
  linkedin: "https://www.linkedin.com/in/maher-moftah-28614b38b",
};

export const EXPERTS: Expert[] = [SERGEI, AMANDA, SEBASTIEN, JOZSEF, MARIA, MISTY, AISHA, JAVIER, ELENA, MAHER];

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
