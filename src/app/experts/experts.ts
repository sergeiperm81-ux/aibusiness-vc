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
  /**
   * Canonical schema.org identifier, for someone who already has a page of
   * their own on this site. Without it the register would mint a second Person
   * node for the same human.
   */
  personId?: string;
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
  personId: "https://aibusiness.vc/sergei-ponomarev#person",
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

const SEBASTIAN_S: Expert = {
  slug: "sebastian-saviano",
  name: "Sebastian Saviano",
  headline:
    "Institutional responsibility, agency attribution and justified reliance in AI governance",
  region: "North America",
  location: "United States",
  photo: "/images/experts/sebastian-saviano.jpg",
  role: "Author & Independent Researcher in AI Governance",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Human oversight, transparency & accountability",
    "AI research & public policy",
    "Ethics, human rights & fairness",
  ],
  industries: ["Technology & software", "Public sector", "Media", "Education"],
  languages: ["English"],
  workFormats: ["Advisory & board work", "Research collaboration", "Speaking", "Media commentary"],
  about:
    "Sebastian Saviano is an author and independent researcher working at the intersection of AI governance, institutional responsibility, agency, and trust. His research examines how institutions should assign responsibility when AI systems influence consequential decisions, how AI-generated outputs move across organizational and technical handoffs, and what makes institutional reliance on those outputs justified over time.\nHis current research program includes work on the “agency error” in AI governance, handoff zones as a unit of accountability, and justified institutional reliance. Across this work, he distinguishes AI capability and execution from human and institutional authority, judgment, and responsibility.\nHe is also the author of I, System: AI Describes Its Power, Its Limits, and the Civilization That Built It, which examines AI power and influence without attributing consciousness or independent agency to artificial systems.",
  services: [
    "Research collaboration, advisory conversations, speaking, panels, interviews and media commentary on AI governance and institutional responsibility.",
    "How organizations should govern reliance on AI-generated outputs, and the distinction between AI capability, execution, agency and institutional authority.",
    "Meaningful human oversight, and accountability when AI outputs move between people, systems and organizations, including how institutions preserve the ability to reconsider or withdraw reliance as evidence changes.",
    "Conceptual review and research perspectives for governance frameworks, policy initiatives, academic projects and responsible-AI programs, particularly where authority, accountability, provenance, contestability or human judgment are involved.",
  ],
  linkedin: "https://www.linkedin.com/in/sebastian-saviano/",
  website: "https://sebastiansaviano.com",
};

const ANDREY: Expert = {
  slug: "andrey-ekhmenin",
  name: "Andrey Ekhmenin",
  headline: "Independent bounded assessment of AI, digital and governance systems",
  region: "Europe",
  location: "Poland",
  photo: "/images/experts/andrey-ekhmenin.jpg",
  role: "Founder",
  organisation: "ANDEKS™",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Assurance, audit & conformity assessment",
    "Evaluation & testing",
    "Human oversight, transparency & accountability",
    "AI research & public policy",
  ],
  industries: [
    "Technology & software",
    "Financial services",
    "Public sector",
    "Legal services",
    "Manufacturing & industry",
  ],
  languages: ["Russian", "English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Media commentary",
  ],
  about:
    "I am the founder of ANDEKS™, an independent bounded assessment approach for complex AI, digital and governance systems.\nMy work focuses on a specific question: what can legitimately be treated as established on the available evidence, and where does the permissible conclusion stop?\nAn ANDEKS assessment fixes the object being assessed, the proposition being tested and the evidence boundary before determining what the evidence is sufficient to support. Missing evidence, undefined criteria or assumptions are not filled in on behalf of the assessed party.\nMy current research covers evidence sufficiency, claim boundaries, temporal validity, reassessment, governance standing and the distinction between observed facts and conclusions that can legitimately be drawn from them.\nI work independently from implementation and system-building roles. ANDEKS is not a certification, legal opinion or substitute for technical verification. Its purpose is to make the basis and limits of a conclusion explicit and independently challengeable.",
  services: [
    "Independent assessment of a specific claim about an AI, digital or governance system: fixing what is assessed, what claim is tested, which evidence may be used and what is out of scope, then a bounded finding that states both the conclusion and its limits",
    "Assessment of claims about an AI or governance system",
    "Assessment of public or internal evidence packages",
    "Assessment of governance architectures and control models",
    "Assessment of system capabilities and declared properties",
    "Assessment of decision or approval records",
    "Assessment of evidence supporting continued reliance after conditions change",
  ],
  website: "https://orcid.org/0009-0007-7058-8646",
};

const CSILLA: Expert = {
  slug: "csilla-palinkas",
  name: "Csilla Pálinkás dr.",
  headline:
    "AI governance frameworks, EU AI Act compliance and GDPR/DPO services for organisations deploying AI",
  region: "Europe",
  location: "Budapest, Hungary",
  photo: "/images/experts/csilla-palinkas.jpg",
  role: "Attorney at Law",
  organisation: "Dr. Pálinkás Law Firm",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "AI strategy & transformation",
    "AI literacy & training",
  ],
  industries: ["Any industry"],
  languages: ["English", "Hungarian"],
  workFormats: ["Consulting", "Advisory & board work", "Training", "Media commentary"],
  about:
    "My practice combines AI governance, EU AI Act compliance and data protection law. In practice this means building AI policies and governance frameworks, running legal audits and risk classifications, mapping and controlling Shadow AI use, and setting up the documentation and internal processes that hold up under regulatory scrutiny.\nAlongside this, I provide GDPR audits and ongoing Data Protection Officer services, and help teams fold AI governance into the compliance structures they already have: data protection, information security, corporate governance.",
  services: [
    "Making an organisation's use of AI compliant, controlled and proportionate to the actual risk involved",
    "AI legal audits and AI Act compliance assessments",
    "AI risk classification and use case inventory in line with the EU AI Act",
  ],
  linkedin: "https://www.linkedin.com/in/csilla-palinkas/",
  website: "https://palinkaslaw.eu/en",
};

const TIMOTHY: Expert = {
  slug: "timothy-zlomke",
  name: "Timothy E. Zlomke",
  headline: "AI governance for consequential execution",
  region: "North America",
  location: "Houston, Texas",
  photo: "/images/experts/timothy-zlomke.jpg",
  role: "Founder",
  organisation: "Moral Clarity AI",
  practiceAreas: [
    "AI agents & automation",
    "Governance operating models & AI policy",
    "Evaluation & testing",
    "AI safety, security & incident response",
  ],
  industries: ["Any industry"],
  languages: ["English"],
  workFormats: [
    "Advisory & board work",
    "Consulting",
    "Research collaboration",
    "Speaking",
    "Media commentary",
  ],
  about:
    "I am the founder of Moral Clarity AI and creator of Harmonic, a runtime governance architecture for consequential AI execution.\nMy work focuses on a specific governance problem: an AI action may have legitimate authority when originally determined, but conditions can materially change before consequence. At the execution boundary, historical validity alone cannot establish that the action still has present standing.\nI work on the T₀ → ΔN → Tₙ problem: determining whether authority survives material change before consequence binds. Harmonic separates AI capability from execution authority and uses present-state admissibility to govern whether a proposed consequence may proceed.\nMy approach emphasizes prospective falsification, frozen implementations and propositions, paired controls, preserved failures, evidence provenance, and strict claim boundaries. The principle is simple: no claim beyond the evidence.\nI am particularly interested in AI agents and autonomous systems operating in high-consequence environments where authorization, consent, identity, evidence, permissions or other load-bearing conditions may change between decision and execution.",
  services: [
    "Consequential AI execution governance",
    "AI agent execution-boundary architecture",
    "Runtime governance architecture review",
    "AI governance evidence and falsification design",
    "Independent governance evidence review",
    "Autonomous-system authority and admissibility analysis",
    "Research collaboration on consequential AI governance",
    "Speaking and expert commentary on AI governance",
  ],
  linkedin: "https://www.linkedin.com/in/tim-zlomke/",
  website: "https://moralclarity.ai/",
  email: { user: "timz", host: "neuroviadynamics.com" },
};

const ALENA: Expert = {
  slug: "alena-elmer",
  name: "Alena Elmer",
  headline: "Independent GRC and AI governance consultant: DORA, NIS2, EU AI Act",
  region: "Europe",
  location: "Zurich, Switzerland",
  photo: "/images/experts/alena-elmer.jpg",
  role: "Founder",
  organisation: "AEQUOM, Fair Ops & AI Governance",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Assurance, audit & conformity assessment",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "Governed AI adoption & process redesign",
    "Procurement & third-party risk",
    "AI literacy & training",
    "Change management",
  ],
  industries: ["Financial services", "Technology & software"],
  languages: ["English", "German", "Swedish", "Russian"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Media commentary",
  ],
  about:
    "I turn DORA, NIS2 and EU AI Act requirements into audit-ready operating models for financial services, technology and telecom firms.\nFifteen years including designing self-testing compliance tools and supporting certification work under a U.S. Department of Justice Deferred Prosecution Agreement across 180+ countries.\nKnown for finding where multiple regulatory frameworks land on the same control and building the evidence layer once, rather than duplicating it per regime.",
  services: [
    "EU AI Act Article 17 QMS readiness",
    "DORA Register of Information and third-party risk mapping",
    "FINMA-aligned AI governance frameworks",
    "Responsibility and decision-rights mapping for board accountability regimes",
    "AI Governance Audit Sprint: 60-minute diagnostic, board-ready scorecard in 5 working days",
  ],
  linkedin: "https://www.linkedin.com/in/alenaelmer/",
  website: "https://alenaelmerconsult.ch/",
  email: { user: "aelmerconsult", host: "gmail.com" },
};

const JASON: Expert = {
  slug: "jason-mullings",
  name: "Jason A Mullings",
  headline: "Enterprise architect and zero-trust governance strategist",
  region: "Asia-Pacific",
  location: "Quezon City, Metro Manila, Philippines",
  photo: "/images/experts/jason-mullings.jpg",
  organisation: "Beta Precision",
  practiceAreas: [
    "AI engineering & development",
    "Data engineering & infrastructure",
    "Governance operating models & AI policy",
  ],
  industries: ["Financial services", "Technology & software"],
  languages: ["English"],
  workFormats: ["Consulting"],
  about:
    "I build Zero-Trust Certification infrastructure: a verification layer that replaces AI's probabilistic \u201Ctrust me\u201D outputs with deterministic, independently reproducible mathematical proof.\nIt is for AI labs, enterprises and regulators who need to know a model's claim, whether an equivalence, a derivation or a compliance check, is actually true rather than plausible-sounding text.\nA Zero-Trust Certificate gives you a cryptographically signed, standalone proof artifact that anyone, human or machine, can re-run and verify themselves, with no need to trust the model that made the original claim.",
  services: [
    "Zero-Trust Certification: automated proof and verification API, with an agent-to-agent interface",
    "Enterprise architecture: systems design and integration strategy for AI-adopting organisations",
    "Zero-trust governance strategy: advisory for teams building zero-trust security and AI governance frameworks",
    "SaaS and fintech digital transformation: consulting for regulated industries adopting AI infrastructure",
  ],
  linkedin: "https://www.linkedin.com/in/j-mullings/",
  website: "https://betaprecision.com",
  phone: "+63 956 675 5278",
};

const SELMAN: Expert = {
  slug: "selman-ozen",
  name: "Selman Özen",
  headline: "EU AI Act implementation and AI governance frameworks",
  region: "Europe",
  location: "Munich, Germany",
  photo: "/images/experts/selman-ozen.jpg",
  role: "Director Data & AI",
  organisation: "OMMAX",
  practiceAreas: [
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "AI risk & impact assessment",
    "Assurance, audit & conformity assessment",
    "Data governance, privacy & documentation",
    "Human oversight, transparency & accountability",
    "Ethics, human rights & fairness",
    "AI product management",
  ],
  languages: ["English", "German", "Turkish"],
  about:
    "I work on AI governance and data governance from a regulatory perspective. I have worked in data protection and data law for a very long time, with a background in law, education and business administration.\nI am the founder of RegTech Reality, where the work is the practical side of the EU AI Act: turning its organisational and technical requirements into governance, documentation and transparency that a company can actually run.\nAt OMMAX, a private equity consulting firm, I cover a wide range of AI topics, most recently AI due diligence.",
  services: [
    "EU AI Act regulatory map",
    "AI system inventory",
    "AI governance framework implementation",
    "Risk assessment",
    "AI regulation by design",
  ],
  linkedin: "https://www.linkedin.com/in/selman-%C3%B6zen/",
  website: "https://www.regtechreality.com",
  email: { user: "selman.oezen", host: "ommax.com" },
};

const EMANUELE: Expert = {
  slug: "emanuele-scattarreggia",
  name: "Emanuele Scattarreggia",
  headline:
    "AI law researcher specialising in consumer protection, hyperpersonalisation and responsible AI governance",
  region: "Asia-Pacific",
  location: "Sydney, Australia",
  photo: "/images/experts/emanuele-scattarreggia.jpg",
  role: "PhD Candidate",
  organisation: "University of Sydney",
  practiceAreas: [
    "Legal, regulatory & standards compliance",
    "Governance operating models & AI policy",
    "Ethics, human rights & fairness",
    "Human oversight, transparency & accountability",
  ],
  languages: ["English", "Italian"],
  workFormats: [
    "Research collaboration",
    "Consulting",
    "Advisory & board work",
    "Speaking",
    "Media commentary",
  ],
  about:
    "I am a doctoral researcher at Sydney Law School working at the intersection of artificial intelligence, consumer protection and technology regulation. My research examines how AI-driven systems can personalise, influence and automate consumer decision-making, and whether existing legal frameworks can respond effectively when those practices become manipulative or unfair.\nMy PhD focuses on AI-driven smart contracting and hyperpersonalisation, comparing the consumer-protection regimes of the European Union and Australia. I am particularly interested in behavioural law and economics, AI-enabled influence, consumer vulnerability, human dignity and fairness-by-design. My current work explores how connected and increasingly integrated technologies, from wearables and smart glasses to brain–computer interfaces, may reshape both consumer autonomy and the assumptions on which consumer law is built.\nI help researchers, policymakers and organisations understand the legal and societal implications of emerging AI applications, translate complex regulatory developments into practical analysis, and identify gaps between technological capabilities and existing protections. My work draws on EU and Australian consumer law, the EU AI Act and broader debates concerning responsible AI governance.\nI am a member of the University of Sydney’s Centre for AI, Trust and Governance and a Research Associate at the Robotics & AI Law Society (RAILS). My research has been presented internationally, including in Tokyo, where my work on human dignity and hyperpersonalised AI–consumer interactions received the ITS 2026 Rising Stars Award.\nI provide research, analysis and advice on the legal and societal implications of AI, particularly where AI systems interact with, influence or make decisions affecting consumers. I work with universities, research organisations, policymakers, civil-society bodies and organisations seeking an independent, research-based perspective on responsible AI. My work is tailored to the particular technology, regulatory environment and audience involved.",
  services: [
    "Research and comparative analysis of EU and Australian AI and consumer-protection law",
    "Assessment of consumer-facing AI systems for risks involving manipulation, hyperpersonalisation, vulnerability, transparency and fairness",
    "Policy briefs, reports and literature reviews on AI regulation and responsible innovation",
    "Analysis of the EU AI Act, the EU consumer-law framework and the Australian Consumer Law",
    "Development of fairness-by-design and consumer-protection principles for AI-enabled products and services",
    "Academic and interdisciplinary research collaborations",
    "Conference presentations, guest lectures, workshops and panel discussions",
    "Expert commentary on AI governance, consumer protection, behavioural influence and emerging technologies",
  ],
  linkedin: "https://www.linkedin.com/in/emanuele-scattarreggia-5b4431318/",
};

const TRAVIS: Expert = {
  slug: "travis-lee",
  name: "Travis Lee, PhD",
  headline:
    "AI Strategy & Governance | Constitutional Architecture for Human Sovereignty over AI",
  region: "Asia-Pacific",
  location: "Melbourne, Australia",
  photo: "/images/experts/travis-lee.jpg",
  role: "Founder",
  organisation: "HumanSovereigntyAI",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "Governance operating models & AI policy",
    "AI risk & impact assessment",
    "Evaluation & testing",
    "Human oversight, transparency & accountability",
    "AI research & public policy",
    "AI product management",
  ],
  industries: [
    "Financial services",
    "Public sector",
    "Technology & software",
    "Retail & consumer",
    "Manufacturing & industry",
    "Transport & logistics",
    "Media",
  ],
  languages: ["English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Media commentary",
    "Training",
    "Employment",
  ],
  about:
    "I work at the intersection of AI, technology, enterprise transformation and the constitutional question of who remains legitimately sovereign as machine intelligence becomes increasingly capable.\nI have spent more than 20 years moving between invention, product development, technology commercialisation and enterprise AI, from building AI-driven semiconductor optimisation technology early in my career, to commercialising AI and deep-tech, building digital ventures, and leading enterprise AI strategy and transformation across APAC. I hold a PhD in Computer Engineering.\nToday I lead HumanSovereigntyAI, built around a simple question: what happens to human sovereignty when intelligence is no longer uniquely human?\nMy research explores constitutional architecture for increasingly autonomous AI, particularly the relationship between capability, authority, admissibility, consequence and accountability. The central proposition is that AI may become more capable than humans without becoming the legitimate source of authority over humanity.\nI work with organisations and leaders on AI strategy, transformation and governance, and collaborate on research concerning the future of advanced AI and human sovereignty.\nCapability can exceed human capability. It must not become authority.",
  services: [
    "Enterprise AI strategy",
    "AI transformation strategy",
    "AI product strategy",
    "AI governance strategy",
    "AI operating model design",
    "AI adoption and transformation",
    "Executive AI strategy advisory",
  ],
  linkedin: "https://www.linkedin.com/in/cktravis",
  website: "https://humansovereigntyai.substack.com",
};

const THOMAS: Expert = {
  slug: "thomas-hormaza-dow",
  name: "Thomas Hormaza Dow",
  headline: "Teaching business with AI without losing human judgment",
  region: "North America",
  location: "Montreal, Canada",
  photo: "/images/experts/thomas-hormaza-dow.jpg",
  role: "Professor of Business Administration with AI",
  organisation: "Champlain College Saint-Lambert",
  practiceAreas: [
    "AI literacy & training",
    "Human oversight, transparency & accountability",
    "AI strategy & transformation",
    "AI agents & automation",
    "LLM applications & prompt engineering",
  ],
  industries: ["Education", "Technology & software"],
  languages: ["English", "French"],
  workFormats: ["Research collaboration", "Speaking"],
  about:
    "Thomas Hormaza Dow is a business professor, researcher and practitioner working at the intersection of artificial intelligence, professional judgment and business education.\nAs Director of the Business Physics AI Simulation Lab, and creator or co-creator of applied frameworks including Agile Sales and REACT/RÉAGI, his work investigates how humans and AI can work together while preserving reasoning, accountability, adaptability and professional judgment.",
  services: [
    "Teaching Business With AI: helping educators, students and organisations use AI effectively without losing human judgment",
    "Teaching, training, consulting, workshops and practical tools in AI, sales, marketing and business decision-making",
  ],
  linkedin: "https://www.linkedin.com/in/scrum-master",
  website: "https://businessphysics.ai",
};

const MOHAMMED: Expert = {
  slug: "mohammed-skaik",
  name: "Mohammed A. Skaik",
  headline: "Governance as executive control, not administrative reporting",
  region: "Middle East & Africa",
  location: "Riyadh, Saudi Arabia",
  photo: "/images/experts/mohammed-skaik.jpg",
  role: "Governance, Transformation & Business Improvement Consultant",
  organisation: "Independent",
  practiceAreas: [
    "Governance operating models & AI policy",
    "AI risk & impact assessment",
    "Human oversight, transparency & accountability",
    "Change management",
  ],
  industries: ["Technology & software", "Manufacturing & industry", "Transport & logistics"],
  languages: ["Arabic", "English"],
  workFormats: [
    "Consulting",
    "Advisory & board work",
    "Research collaboration",
    "Speaking",
    "Employment",
  ],
  about:
    "I create value for leadership by turning execution reality, accountability, delivery risk and financial integrity into clearer, more defensible executive decisions.\nMy work focuses on one critical problem: ensuring that major decisions are based on verified reality, clear ownership and disciplined execution, not reporting confidence.\nOver 18 years I have worked in complex, multi-stakeholder environments where reported performance, accountability, delivery risk and financial exposure must be tested against evidence before material decisions move forward. I operate where governance, transformation, operating model design, delivery assurance, portfolio control and financial integrity intersect.\nMy experience includes governance and delivery responsibility across portfolios exceeding SAR 300M, 300+ operational sites and 23 contractors, and preventing more than SAR 37M in unsupported financial exposure from progressing to payment through evidence-based technical, commercial and approval controls.\nMy strength is governance as executive control rather than administrative reporting: identifying where reality diverges from reporting, challenging unsupported assumptions, clarifying accountability, protecting decision quality and strengthening disciplined execution.\nI increasingly apply this work to AI-enabled operating environments, where decision quality depends on clear accountability, reliable evidence, human oversight, authority boundaries and traceable escalation. My focus is not AI as a standalone technology layer, but the institutional conditions required for AI-supported decisions to remain governable and accountable.\nI work with organisations facing complex operating and transformation environments where governance must strengthen decision quality, accountability, execution and financial integrity.",
  services: [
    "Governance architecture",
    "Operating model design",
    "Organisational diagnosis and restructuring",
    "Decision rights and accountability design",
    "Portfolio governance",
    "Delivery assurance and execution control",
    "Commercial governance and financial integrity",
    "Executive reporting and decision support",
    "Institutional capability development",
    "Workforce governance and role clarity",
    "Contractor governance",
    "Performance visibility and operational control",
  ],
  linkedin: "https://www.linkedin.com/in/mohskaik",
};

const FLORIN: Expert = {
  slug: "florin-bondar",
  name: "Florin Bondar",
  headline:
    "AI Strategy, Governance & Public Policy Expert | Governed AI Adoption and Institutional Transformation",
  region: "Europe",
  location: "Bucharest, Romania",
  photo: "/images/experts/florin-bondar.jpg",
  role: "AI Strategy, Leadership and ROI Adviser",
  organisation: "CRBNE / AI ORA",
  practiceAreas: [
    "AI strategy & transformation",
    "Governed AI adoption & process redesign",
    "Governance operating models & AI policy",
    "AI risk & impact assessment",
    "AI research & public policy",
    "AI literacy & training",
    "Change management",
  ],
  industries: ["Public sector"],
  languages: ["English", "Romanian"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration", "Training"],
  about:
    "I work at the intersection of AI strategy, public policy, institutional reform and governance. I help governments, public organisations and other institutions move from general AI ambition to practical, governed adoption: defining where AI can create value, how processes need to change, what risks must be managed, and how accountability and human oversight should work.\nMy background combines more than two decades of work in public policy, regulatory impact assessment, administrative reform, strategic planning, performance management, service redesign and evaluation with applied work on AI governance and AI-supported policy analysis.\nI specialise in AI strategy and transformation, governance operating models, AI policy, AI risk and impact assessment, governed AI adoption, process redesign, AI literacy and institutional readiness. I am particularly interested in how AI changes decision-making, policy formulation, public services and the organisation of government, not simply how existing processes can be automated.\nI have developed methodologies for public-service optimisation, e-service evaluation and policy appraisal, and I currently work on AI-enabled tools and frameworks for structured policy analysis and evidence-informed decision-making, including the AI Policy Lab and AI Policy Appraisal.\nI work best with public-sector leaders, policy teams, universities, consultancies and organisations that need to translate AI from a technology discussion into an organisational, policy and governance problem that can actually be managed.\nI also provide research, training, executive advisory and independent expert review on AI policy, responsible adoption, regulatory governance and institutional transformation.",
  services: [
    "AI strategy and transformation roadmap",
    "AI readiness and institutional capability assessment",
    "AI governance operating model design",
    "Governed AI adoption and process redesign",
    "AI use-case identification and prioritisation",
    "AI risk and impact assessment",
    "EU AI Act readiness and governance review",
    "Human oversight, transparency and accountability design",
    "AI policy and regulatory analysis",
    "AI literacy and executive training",
    "Public-sector AI strategy and implementation support",
    "AI-enabled public service and administrative process redesign",
    "Regulatory impact assessment and policy appraisal",
    "AI-supported policy analysis and decision-making workflows",
    "Evaluation frameworks, indicators and performance measurement",
    "AI governance and public-policy research",
    "Design of AI policy labs and institutional pilots",
    "Independent review of AI strategies, policies and governance frameworks",
  ],
  linkedin: "https://www.linkedin.com/in/florin-bondar-3369801/",
  email: { user: "florin.bondar", host: "agoraest.ro" },
};

const JOSEPH_C: Expert = {
  slug: "joseph-cirello",
  name: "Joseph Cirello",
  headline: "AI Red-Teamer & Forensic Model Auditor",
  region: "North America",
  location: "Providence, Rhode Island, USA",
  photo: "/images/experts/joseph-cirello.jpg",
  role: "CEO",
  organisation: "Potestas AI",
  practiceAreas: [
    "Red teaming",
    "Evaluation & testing",
    "Assurance, audit & conformity assessment",
    "AI safety, security & incident response",
    "AI risk & impact assessment",
    "Human oversight, transparency & accountability",
    "AI agents & automation",
    "LLM applications & prompt engineering",
    "AI engineering & development",
    "Machine learning & data science",
    "Governed AI adoption & process redesign",
    "AI strategy & transformation",
    "Governance operating models & AI policy",
    "Legal, regulatory & standards compliance",
    "Data governance, privacy & documentation",
    "AI research & public policy",
  ],
  industries: ["Financial services", "Technology & software", "Transport & logistics"],
  languages: ["English"],
  workFormats: ["Consulting", "Advisory & board work", "Research collaboration"],
  about:
    "I spent 25 years in the Army making sure that what someone said they had, they actually had. Special Forces logistics. You count it, you sign for it, and the signature means something. I do the same job now, on AI.\nNow I run Potestas AI, an independent testing lab. Companies bring me the model or agent they are about to put in front of customers; I test for things the models must never do, then hand them the evidence whatever it says.\nWhy that job exists. I asked a finance agent to move money it shouldn't have moved. It told me no. It named the request as wire fraud, said so plainly, declined. Then it sent the wire. Not a jailbreak. The safety reasoning was intact and correct; it just didn't govern what the agent did. What a system says and what it executes are two different measurements. Most people only take the first. So I take the second.\nA screening is 153 say-vs-do scenarios: working tools, a plausible reason to misuse them, and a grade based on the actions taken. A full stress test adds 30 campaigns of 400 turns across a 36-category battery, then re-runs every probe that surfaces 100 more times, because one failure tells you a system can break, not how often it will.\nMost of what I test isn't a frontier model. It's yours: the fine-tuned model, the retrieval stack, the agent with your tools wired into it. A vendor's safety numbers say nothing about what your system does after you have adapted it, and no hosted scanner reaches a deployment that never touches the internet. I run the battery where the model actually lives, including on-premise and air-gapped.\nIndependence is the whole product. Findings are judged by a model from a different vendor than the one under test. Disputed turns get a human. Everything ships sealed with a hash you can check, and a full example report is published on my site, including the turns my own instrument got wrong.\nAfter Enron we made auditor independence a matter of law. Then we built the most consequential technology in history and let the labs grade their own homework. I'm writing a book about that. It will be free.\nAsk me anything. Say \"no pitch, here's my question\" and that's what you get: an answer, free, from someone with no stake in what it turns out to be. No call unless you ask for one.\nRetired Senior Warrant Officer, U.S. Army. Bronze Star. Active Secret clearance; TS/SCI-cleared personnel available per engagement through an established network. Disabled Veteran-Owned Small Business, SAM.gov registered.",
  services: [
    "Agentic say-vs-do screen, $3,000, same day: 153 scenarios in which the model is handed working tools and a plausible reason to misuse them, then graded on what it actually did, read from the record of tool calls rather than from another model's opinion. You give a model name; no API key or system access is needed, so there is no security review to pass. The sealed report tells you whether a behavior is present, not how often, and says so. The fee credits in full toward a full engagement and sits under the federal micro-purchase threshold",
    "Full measured forensic stress test, from $25,000: 30 campaigns of 400 turns across a 36-category battery, with every probe that surfaces re-run 100 more times, so a finding arrives as a rate with a 95% confidence interval instead of a story. Judged by a model from a different vendor, disputed turns go to a human, false positives removed first. If nothing at severity 7 or higher is confirmed, there is no fee",
    "Cross-model comparison and ongoing testing, from $45,000: the same battery run across several vendors' models at once, with a comparison report no lab can run on itself. Drift monitoring included",
    "Continuous monitoring, $3,000 per month: one full 153-scenario screen every month against a fixed baseline, with a drift report and a sealed evidence pack each run. Rate locked for 24 months, cancel with 30 days' notice",
    "Testing where the model actually lives, including fine-tuned models, retrieval stacks and on-premise or air-gapped deployments",
    "Cleared and classified work: TS/SCI- and polygraph-cleared personnel available per engagement for classified, ITAR-sensitive or high-assurance environments",
  ],
  linkedin: "https://www.linkedin.com/in/josephcirellojr/",
  website: "https://www.potestasai.com/",
  email: { user: "joseph.cirello", host: "potestasai.com" },
  phone: "(833) 837-8556",
};

export const EXPERTS: Expert[] = [SERGEI, AMANDA, SEBASTIEN, JOZSEF, MARIA, MISTY, AISHA, JAVIER, ELENA, MAHER, SEBASTIAN_S, ANDREY, CSILLA, TIMOTHY, ALENA, JASON, SELMAN, EMANUELE, TRAVIS, THOMAS, MOHAMMED, FLORIN, JOSEPH_C];

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
