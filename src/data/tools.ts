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
];

export function getToolById(id: string): AITool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): AITool[] {
  return tools.filter((t) => t.category === category);
}
