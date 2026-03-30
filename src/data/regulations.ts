export interface AIRegulation {
  id: string;
  country: string;
  region: string;
  status: "Enacted" | "In Progress" | "Proposed" | "Framework Only";
  keyLegislation: string;
  effectiveDate: string;
  riskApproach: string;
  description: string;
  keyRequirements: string[];
  penalties: string;
}

export const regulations: AIRegulation[] = [
  {
    id: "eu",
    country: "European Union",
    region: "Europe",
    status: "Enacted",
    keyLegislation: "EU AI Act",
    effectiveDate: "August 2025 (phased)",
    riskApproach: "Risk-based (Unacceptable → High → Limited → Minimal)",
    description: "The world's first comprehensive AI law. Classifies AI systems by risk level with requirements scaling accordingly. Bans social scoring and real-time biometric surveillance.",
    keyRequirements: ["Risk classification for all AI systems", "Transparency requirements for generative AI", "Mandatory conformity assessments for high-risk AI", "Foundation model providers must disclose training data"],
    penalties: "Up to 7% of global annual turnover or €35 million",
  },
  {
    id: "us",
    country: "United States",
    region: "North America",
    status: "Framework Only",
    keyLegislation: "Executive Order on AI (Oct 2023) + State Laws",
    effectiveDate: "Ongoing",
    riskApproach: "Sector-specific, no comprehensive federal law",
    description: "No single federal AI law. Relies on executive orders, agency guidelines, and state-level legislation. Colorado and California lead with state AI laws.",
    keyRequirements: ["NIST AI Risk Management Framework (voluntary)", "AI safety testing for dual-use models", "State-level disclosure requirements", "FTC enforcement on deceptive AI practices"],
    penalties: "Varies by sector and state",
  },
  {
    id: "uk",
    country: "United Kingdom",
    region: "Europe",
    status: "In Progress",
    keyLegislation: "AI Regulation White Paper + AI Safety Institute",
    effectiveDate: "2025-2026",
    riskApproach: "Pro-innovation, sector-specific regulation",
    description: "Context-based approach letting existing regulators handle AI in their domains. Established the AI Safety Institute for frontier model testing.",
    keyRequirements: ["Sector regulators develop AI-specific guidance", "AI Safety Institute evaluates frontier models", "Transparency in automated decision-making", "No new standalone AI regulator"],
    penalties: "Determined by sector regulators",
  },
  {
    id: "china",
    country: "China",
    region: "Asia",
    status: "Enacted",
    keyLegislation: "Generative AI Measures + Algorithm Regulations",
    effectiveDate: "August 2023",
    riskApproach: "Content-focused with registration requirements",
    description: "First country to regulate generative AI specifically. Requires algorithm registration, content labeling, and adherence to socialist core values.",
    keyRequirements: ["Algorithm registration with CAC", "AI-generated content must be labeled", "Training data must be lawfully obtained", "AI must uphold socialist core values"],
    penalties: "Service suspension, fines, criminal liability",
  },
  {
    id: "canada",
    country: "Canada",
    region: "North America",
    status: "In Progress",
    keyLegislation: "Artificial Intelligence and Data Act (AIDA)",
    effectiveDate: "Expected 2026",
    riskApproach: "Risk-based, similar to EU approach",
    description: "Part of Bill C-27. Creates requirements for high-impact AI systems including risk assessments and transparency obligations.",
    keyRequirements: ["Risk assessments for high-impact AI", "Transparency measures", "Mitigation of biased output", "Record-keeping requirements"],
    penalties: "Up to CAD $25 million or 5% of global revenue",
  },
  {
    id: "japan",
    country: "Japan",
    region: "Asia",
    status: "Framework Only",
    keyLegislation: "AI Guidelines for Business",
    effectiveDate: "2024",
    riskApproach: "Non-binding guidelines, pro-innovation",
    description: "Voluntary guidelines promoting responsible AI use. Japan takes a light-touch approach to attract AI investment and development.",
    keyRequirements: ["Voluntary compliance with AI principles", "Human oversight encouraged", "Transparency recommended", "Privacy protection guidelines"],
    penalties: "No specific AI penalties (existing laws apply)",
  },
  {
    id: "south-korea",
    country: "South Korea",
    region: "Asia",
    status: "Enacted",
    keyLegislation: "AI Basic Act",
    effectiveDate: "January 2026",
    riskApproach: "Risk-based with innovation focus",
    description: "Comprehensive AI framework law establishing rights and obligations. Balances regulation with support for AI industry growth.",
    keyRequirements: ["High-risk AI classification system", "Impact assessments required", "AI Ethics Committee established", "Support for AI industry development"],
    penalties: "Fines up to KRW 300 million",
  },
  {
    id: "brazil",
    country: "Brazil",
    region: "South America",
    status: "In Progress",
    keyLegislation: "AI Bill (PL 2338/2023)",
    effectiveDate: "Expected 2026",
    riskApproach: "Risk-based, EU-influenced",
    description: "Comprehensive AI regulation modeled partly on the EU AI Act. Focuses on protecting fundamental rights while enabling innovation.",
    keyRequirements: ["Risk classification system", "Algorithmic impact assessments", "Right to human review of AI decisions", "Transparency obligations"],
    penalties: "Up to 2% of revenue or BRL 50 million",
  },
  {
    id: "india",
    country: "India",
    region: "Asia",
    status: "Proposed",
    keyLegislation: "Digital India Act (AI provisions)",
    effectiveDate: "TBD",
    riskApproach: "Sector-specific with voluntary guidelines",
    description: "India is developing AI governance through the Digital India Act and NITI Aayog principles. Currently relies on voluntary responsible AI guidelines.",
    keyRequirements: ["Responsible AI principles (voluntary)", "Sector-specific regulations emerging", "Data protection under DPDP Act", "AI advisory committee established"],
    penalties: "Under development",
  },
  {
    id: "australia",
    country: "Australia",
    region: "Oceania",
    status: "In Progress",
    keyLegislation: "Voluntary AI Safety Standard + Mandatory Guardrails",
    effectiveDate: "2025-2026",
    riskApproach: "Moving from voluntary to mandatory for high-risk",
    description: "Transitioning from voluntary AI ethics principles to mandatory guardrails for high-risk AI. Consulting on mandatory requirements.",
    keyRequirements: ["Voluntary AI Ethics Framework", "Mandatory guardrails for high-risk AI (proposed)", "Transparency requirements", "Testing and evaluation standards"],
    penalties: "Under development",
  },
];

export function getRegulationById(id: string): AIRegulation | undefined {
  return regulations.find((r) => r.id === id);
}
