import { tools, type AITool } from "@/data/tools";

export interface ToolComparison {
  slug: string;
  toolA: AITool;
  toolB: AITool;
}

/**
 * Generate all meaningful comparison pairs within same category.
 * For N tools in a category, generates N*(N-1)/2 pairs.
 */
export function getAllToolComparisons(): ToolComparison[] {
  const byCategory = new Map<string, AITool[]>();
  for (const tool of tools) {
    const list = byCategory.get(tool.category) ?? [];
    list.push(tool);
    byCategory.set(tool.category, list);
  }

  const pairs: ToolComparison[] = [];
  for (const catTools of byCategory.values()) {
    for (let i = 0; i < catTools.length; i++) {
      for (let j = i + 1; j < catTools.length; j++) {
        const a = catTools[i];
        const b = catTools[j];
        // Alphabetical order for consistent slugs
        const [first, second] = a.id < b.id ? [a, b] : [b, a];
        pairs.push({
          slug: `${first.id}-vs-${second.id}`,
          toolA: first,
          toolB: second,
        });
      }
    }
  }
  return pairs;
}

export function getComparisonBySlug(slug: string): ToolComparison | null {
  return getAllToolComparisons().find((c) => c.slug === slug) ?? null;
}

/**
 * Professions/roles with their relevant tool categories
 */
export const professionToolMap: Record<string, { title: string; description: string; categories: string[] }> = {
  "freelance-writer": {
    title: "Freelance Writers",
    description: "AI tools that help freelance writers earn more by writing faster, better, and at scale",
    categories: ["Writing & Content", "Marketing & SEO"],
  },
  "web-developer": {
    title: "Web Developers",
    description: "AI coding tools that 10x developer productivity and help ship faster",
    categories: ["Coding", "Automation & Workflows", "DevOps & Infrastructure"],
  },
  "graphic-designer": {
    title: "Graphic Designers",
    description: "AI design tools that speed up creative work and expand capabilities",
    categories: ["Image & Design", "Video & Audio", "Presentation & Slides"],
  },
  "marketer": {
    title: "Digital Marketers",
    description: "AI marketing tools for SEO, content, social media, and campaign optimization",
    categories: ["Marketing & SEO", "Social Media", "Email & Outreach", "Writing & Content"],
  },
  "solopreneur": {
    title: "Solopreneurs",
    description: "AI tools that let one person run a business that normally needs a team of 10",
    categories: ["Automation & Workflows", "Writing & Content", "Marketing & SEO", "Productivity & Business"],
  },
  "video-creator": {
    title: "Video Creators & YouTubers",
    description: "AI video and audio tools for faster editing, better thumbnails, and automated production",
    categories: ["Video & Audio", "Image & Design", "Music & Audio"],
  },
  "data-analyst": {
    title: "Data Analysts",
    description: "AI tools for faster data analysis, visualization, and automated insights",
    categories: ["Data & Analytics", "Coding", "Productivity & Business"],
  },
  "sales-professional": {
    title: "Sales Professionals",
    description: "AI tools for prospecting, outreach, CRM automation, and closing more deals",
    categories: ["Sales & CRM", "Email & Outreach", "Chatbots & Agents"],
  },
  "customer-support": {
    title: "Customer Support Teams",
    description: "AI tools for faster response times, automated tickets, and happier customers",
    categories: ["Customer Support", "Chatbots & Agents"],
  },
  "ecommerce-owner": {
    title: "E-commerce Store Owners",
    description: "AI tools for product descriptions, pricing optimization, and automated marketing",
    categories: ["E-commerce", "Marketing & SEO", "Writing & Content", "Image & Design"],
  },
  "hr-recruiter": {
    title: "HR & Recruiters",
    description: "AI tools for screening candidates, writing job posts, and automating recruitment",
    categories: ["HR & Recruitment", "Writing & Content"],
  },
  "real-estate-agent": {
    title: "Real Estate Agents",
    description: "AI tools for property listings, lead generation, and market analysis",
    categories: ["Real Estate", "Marketing & SEO", "Writing & Content"],
  },
  "teacher-educator": {
    title: "Teachers & Educators",
    description: "AI tools for creating course content, grading, and personalized learning",
    categories: ["Education & Research", "Writing & Content", "Presentation & Slides"],
  },
  "accountant": {
    title: "Accountants & Finance Pros",
    description: "AI tools for bookkeeping automation, financial analysis, and tax prep",
    categories: ["Finance & Accounting", "Data & Analytics"],
  },
  "lawyer": {
    title: "Lawyers & Legal Professionals",
    description: "AI tools for contract review, legal research, and compliance automation",
    categories: ["Legal & Compliance", "Writing & Content"],
  },
  "startup-founder": {
    title: "Startup Founders",
    description: "AI tools for building MVPs fast, automating operations, and scaling with a small team",
    categories: ["Coding", "No-Code & Low-Code", "Automation & Workflows", "Marketing & SEO"],
  },
  "podcast-host": {
    title: "Podcast Hosts",
    description: "AI tools for recording, editing, transcription, and show notes automation",
    categories: ["Voice & Speech", "Video & Audio", "Writing & Content"],
  },
  "social-media-manager": {
    title: "Social Media Managers",
    description: "AI tools for content creation, scheduling, analytics, and engagement optimization",
    categories: ["Social Media", "Image & Design", "Writing & Content", "Video & Audio"],
  },
};

export function getToolsForProfession(professionSlug: string): AITool[] {
  const prof = professionToolMap[professionSlug];
  if (!prof) return [];
  return tools.filter((t) => prof.categories.includes(t.category));
}

export function getAllProfessionSlugs(): string[] {
  return Object.keys(professionToolMap);
}
