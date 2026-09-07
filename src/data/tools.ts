import rawTools from "./tools-raw.json";

export interface AITool {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  pricing: string;
  targetUser: string;
  keyFeature: string;
  hasAffiliate: boolean | null;
  /**
   * A measured or vendor-published figure, with its conditions stated.
   *
   * Optional on purpose: the page used to assert that tools "typically
   * generate 3-5x returns on subscription cost" for every listing, which was
   * an invented number applied to 360 products. A claim now appears only where
   * there is something real to cite.
   */
  evidence?: string;
  /** Programme memberships or named partners, as published by the vendor. */
  credentials?: string;
  /** What the tool does not do, where that is easy to misread. */
  caveat?: string;
  /** What the vendor receives and retains, where that is not a one-liner. */
  dataHandling?: string;
  /** Infrastructure layer this sits at, shown next to the category. */
  layer?: string;
  /** How it relates to the better-known tools in the same category. */
  positioning?: string;
  /** Traceability and evidence built on top of the core capability. */
  evidenceLayer?: string;
  /**
   * True for infrastructure other tools consume rather than compete with.
   *
   * The directory generates "X vs Y" pages for every pair in a category. For a
   * measurement layer that framing is simply wrong: it does not replace the
   * GRC or compliance tool next to it, it feeds it. This flag relabels those
   * sections instead of pretending the products are substitutes.
   */
  complementary?: boolean;
}

export const tools: AITool[] = rawTools as AITool[];

export const toolCategories = [
  "Writing & Content",
  "Image & Design",
  "Video & Audio",
  "Coding",
  "Automation & Workflows",
  "Marketing & SEO",
  "Productivity & Business",
  "Chatbots & Agents",
  "Data & Analytics",
  "Education & Research",
  "Finance & Accounting",
  "HR & Recruitment",
  "Sales & CRM",
  "Customer Support",
  "Healthcare & Medical",
  "Legal & Compliance",
  "Real Estate",
  "E-commerce",
  "Music & Audio",
  "3D & Game Dev",
  "Presentation & Slides",
  "Email & Outreach",
  "Social Media",
  "Translation & Localization",
  "Voice & Speech",
  "Cybersecurity",
  "DevOps & Infrastructure",
  "No-Code & Low-Code",
];

export function getToolById(id: string): AITool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): AITool[] {
  return tools.filter((t) => t.category === category);
}
