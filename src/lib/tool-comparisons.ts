import { tools, type AITool } from "@/data/tools";

export interface ToolComparison {
  slug: string;
  toolA: AITool;
  toolB: AITool;
}

/**
 * Generate curated comparison pairs — top 5 tools per category,
 * creating max 10 pairs per category (~280 total) to avoid thin template pages.
 * Google penalizes mass-generated template pages with minimal differentiation.
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
    // Limit to top 5 tools per category to keep comparisons meaningful
    const top = catTools.slice(0, 5);
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const a = top[i];
        const b = top[j];
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
 * Generate unique analysis content for a comparison to avoid thin template pages.
 * Each comparison gets unique prose based on tool attributes.
 */
export function getComparisonAnalysis(toolA: AITool, toolB: AITool): {
  pricingVerdict: string;
  audienceVerdict: string;
  featureVerdict: string;
  moneyAngle: string;
  useCases: { scenario: string; winner: string; reason: string }[];
} {
  const aPriceNum = extractPrice(toolA.pricing);
  const bPriceNum = extractPrice(toolB.pricing);
  const aFree = toolA.pricing.toLowerCase().includes("free");
  const bFree = toolB.pricing.toLowerCase().includes("free");

  let pricingVerdict: string;
  if (aPriceNum > 0 && bPriceNum > 0) {
    const cheaper = aPriceNum <= bPriceNum ? toolA : toolB;
    const pricier = aPriceNum <= bPriceNum ? toolB : toolA;
    const diff = Math.abs(aPriceNum - bPriceNum);
    if (diff < 5) {
      pricingVerdict = `${toolA.name} and ${toolB.name} are priced similarly — both in the $${Math.min(aPriceNum, bPriceNum)}-${Math.max(aPriceNum, bPriceNum)}/month range. The decision comes down to which feature set matches your workflow, not cost.`;
    } else {
      pricingVerdict = `${cheaper.name} starts at a lower price point ($${Math.min(aPriceNum, bPriceNum)}/mo vs $${Math.max(aPriceNum, bPriceNum)}/mo for ${pricier.name}). That $${diff}/month difference adds up to $${diff * 12}/year — meaningful for solopreneurs but negligible for teams where productivity gains matter more than subscription costs.`;
    }
  } else if (aFree && !bFree) {
    pricingVerdict = `${toolA.name} offers a free tier, making it the clear winner for budget-conscious users testing AI tools. ${toolB.name} requires payment upfront, but the paid-only model often means more focused development and better support.`;
  } else if (!aFree && bFree) {
    pricingVerdict = `${toolB.name} offers a free tier, making it the clear winner for budget-conscious users testing AI tools. ${toolA.name} requires payment upfront, but the paid-only model often means more focused development and better support.`;
  } else {
    pricingVerdict = `Both ${toolA.name} and ${toolB.name} offer free tiers, so you can test both before committing. Compare the limits of each free plan carefully — free tiers often restrict the features that matter most for professional use.`;
  }

  const audienceVerdict = toolA.targetUser === toolB.targetUser
    ? `Both tools target ${toolA.targetUser.toLowerCase()}. The differentiation is in execution: ${toolA.name} leads with ${toolA.keyFeature.toLowerCase()}, while ${toolB.name} focuses on ${toolB.keyFeature.toLowerCase()}.`
    : `${toolA.name} is built for ${toolA.targetUser.toLowerCase()}, while ${toolB.name} targets ${toolB.targetUser.toLowerCase()}. If you identify more with one audience, that tool will likely feel more intuitive out of the box.`;

  const featureVerdict = `${toolA.name}'s standout feature is ${toolA.keyFeature.toLowerCase()}. ${toolB.name} differentiates with ${toolB.keyFeature.toLowerCase()}. For ${toolA.category.toLowerCase()} workflows, the question is which capability removes your biggest bottleneck.`;

  const moneyAngle = `From an ROI perspective, a ${toolA.category.toLowerCase()} tool that saves you 5 hours/week is worth $${Math.round(50 * 5 * 4)}/month at a $50/hr effective rate. Both ${toolA.name} and ${toolB.name} aim to deliver that time savings — the right choice depends on where your specific workflow loses the most time.`;

  const useCases = [
    {
      scenario: `You're a ${toolA.targetUser.toLowerCase().split(",")[0].split("&")[0].trim()} on a tight budget`,
      winner: aPriceNum <= bPriceNum ? toolA.name : toolB.name,
      reason: `Lower starting cost means faster payback on your investment`,
    },
    {
      scenario: `You need ${toolA.keyFeature.toLowerCase().slice(0, 60)}`,
      winner: toolA.name,
      reason: `${toolA.name} was specifically designed around this capability`,
    },
    {
      scenario: `You need ${toolB.keyFeature.toLowerCase().slice(0, 60)}`,
      winner: toolB.name,
      reason: `${toolB.name} was specifically designed around this capability`,
    },
  ];

  return { pricingVerdict, audienceVerdict, featureVerdict, moneyAngle, useCases };
}

function extractPrice(pricing: string): number {
  const match = pricing.match(/\$(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
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
