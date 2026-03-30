// Placeholder data — will be replaced with real data from agent
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

export const tools: AITool[] = [
  { id: "cursor", name: "Cursor", url: "https://cursor.com", category: "Coding", description: "AI-first code editor with built-in AI pair programming.", pricing: "Free — $20/mo", targetUser: "Developers", keyFeature: "AI-powered code completion and chat in the editor", hasAffiliate: false },
  { id: "make-com", name: "Make.com", url: "https://make.com", category: "Automation", description: "Visual automation platform connecting 1,500+ apps with AI.", pricing: "Free — $9/mo", targetUser: "Businesses & marketers", keyFeature: "Visual workflow builder with AI integrations", hasAffiliate: true },
  { id: "semrush", name: "Semrush", url: "https://semrush.com", category: "Marketing & SEO", description: "All-in-one SEO, content, and competitive analysis platform.", pricing: "From $139.95/mo", targetUser: "Marketers & SEO professionals", keyFeature: "Comprehensive keyword and competitor research", hasAffiliate: true },
  { id: "copy-ai", name: "Copy.ai", url: "https://copy.ai", category: "Writing & Content", description: "AI writing assistant for marketing copy, blogs, and emails.", pricing: "Free — $49/mo", targetUser: "Marketers & content creators", keyFeature: "90+ templates for different content types", hasAffiliate: true },
  { id: "synthesia", name: "Synthesia", url: "https://synthesia.io", category: "Video & Audio", description: "Create AI avatar videos without cameras or studios.", pricing: "From $29/mo", targetUser: "Businesses & trainers", keyFeature: "150+ AI avatars speaking 130+ languages", hasAffiliate: true },
  { id: "notion-ai", name: "Notion AI", url: "https://notion.so", category: "Productivity", description: "AI writing and knowledge management built into Notion workspace.", pricing: "From $10/mo", targetUser: "Teams & individuals", keyFeature: "AI integrated into existing docs and databases", hasAffiliate: true },
  { id: "midjourney", name: "Midjourney", url: "https://midjourney.com", category: "Image & Design", description: "AI image generation with the highest aesthetic quality.", pricing: "From $10/mo", targetUser: "Designers & creators", keyFeature: "Best-in-class artistic image generation", hasAffiliate: false },
  { id: "elevenlabs", name: "ElevenLabs", url: "https://elevenlabs.io", category: "Video & Audio", description: "AI voice synthesis with the most natural-sounding voices.", pricing: "Free — $11/mo", targetUser: "Content creators & businesses", keyFeature: "Voice cloning and multilingual synthesis", hasAffiliate: false },
  { id: "jasper", name: "Jasper AI", url: "https://jasper.ai", category: "Writing & Content", description: "Enterprise AI writing platform for marketing teams.", pricing: "From $49/mo", targetUser: "Marketing teams", keyFeature: "Brand voice and style guide training", hasAffiliate: true },
  { id: "zapier", name: "Zapier", url: "https://zapier.com", category: "Automation", description: "Connect 7,000+ apps with automated workflows and AI.", pricing: "Free — $29.99/mo", targetUser: "Everyone", keyFeature: "Largest app integration library", hasAffiliate: true },
  { id: "github-copilot", name: "GitHub Copilot", url: "https://github.com/features/copilot", category: "Coding", description: "AI pair programmer by GitHub/Microsoft for code completion.", pricing: "From $10/mo", targetUser: "Developers", keyFeature: "Deep integration with VS Code and JetBrains", hasAffiliate: false },
  { id: "runway", name: "Runway", url: "https://runwayml.com", category: "Video & Audio", description: "AI video generation and editing used by Hollywood studios.", pricing: "Free — $15/mo", targetUser: "Video creators & filmmakers", keyFeature: "Gen-3 Alpha text-to-video generation", hasAffiliate: false },
];

export const toolCategories = [
  "Writing & Content",
  "Image & Design",
  "Video & Audio",
  "Coding",
  "Automation",
  "Marketing & SEO",
  "Productivity",
  "Chatbots & Agents",
];

export function getToolById(id: string): AITool | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): AITool[] {
  return tools.filter((t) => t.category === category);
}
