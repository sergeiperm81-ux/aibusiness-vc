import Link from "next/link";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Business — How to Make Money with AI in 2026",
  description:
    "The latest AI business news, tools, and strategies. How to make money with AI — for solo earners, startups, and enterprises.",
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryHref: string;
  date: string;
  imageUrl: string;
  href: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "AI Agents Market Hits $7.6B — Here's How Solo Builders Are Cashing In",
    excerpt:
      "The AI agents market reached $7.63 billion in 2025 and is projected to hit $183 billion by 2033. Individual developers are building custom agents for businesses at $500-1,500 per agent. Here's how to get started.",
    category: "Solo",
    categoryHref: "/solo",
    date: "Mar 30, 2026",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    href: "/solo/ai-agents-market-opportunity",
    featured: true,
  },
  {
    id: "2",
    title: "OpenAI Launches New API Pricing — What It Means for AI Startups",
    excerpt:
      "OpenAI's latest pricing changes make it 40% cheaper to build AI products. Startups that depend on GPT-4 APIs are seeing immediate margin improvements.",
    category: "Startups",
    categoryHref: "/startups",
    date: "Mar 29, 2026",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    href: "/startups/openai-api-pricing-update",
  },
  {
    id: "3",
    title: "How a Marketing Agency Cut Costs 40% with AI Automation",
    excerpt:
      "Case study: A 15-person digital marketing agency replaced manual reporting, content drafts, and ad optimization with AI tools. Revenue per employee doubled.",
    category: "B2B",
    categoryHref: "/b2b",
    date: "Mar 28, 2026",
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    href: "/b2b/marketing-agency-ai-automation-case-study",
  },
  {
    id: "4",
    title: "5 AI Tools That Actually Pay for Themselves in Week One",
    excerpt:
      "We tested 30+ AI tools and found 5 that generate positive ROI within 7 days. Includes pricing breakdowns and real workflow examples.",
    category: "Tools",
    categoryHref: "/tools",
    date: "Mar 27, 2026",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    href: "/tools/ai-tools-positive-roi-week-one",
  },
  {
    id: "5",
    title: "From Teacher to $8K/Month AI Freelancer in 6 Months",
    excerpt:
      "Sarah left her teaching job and now earns $8,200/month writing AI-powered content for SaaS companies. Her full journey with exact numbers.",
    category: "Solo",
    categoryHref: "/solo",
    date: "Mar 26, 2026",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    href: "/solo/teacher-to-ai-freelancer",
  },
  {
    id: "6",
    title: "Anthropic Raises $3.5B — The AI Infrastructure Race Accelerates",
    excerpt:
      "Anthropic's latest funding round values the company at $61.5 billion. What this means for the AI ecosystem and investment opportunities.",
    category: "Startups",
    categoryHref: "/startups",
    date: "Mar 25, 2026",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    href: "/startups/anthropic-funding-round",
  },
  {
    id: "7",
    title: "Enterprise AI Adoption Hits 58% — The Implementation Playbook",
    excerpt:
      "More than half of enterprises now use AI in production. Here are the patterns that separate successful implementations from expensive failures.",
    category: "B2B",
    categoryHref: "/b2b",
    date: "Mar 24, 2026",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    href: "/b2b/enterprise-ai-adoption-playbook",
  },
];

export default function HomePage() {
  const featured = newsItems.find((item) => item.featured);
  const rest = newsItems.filter((item) => !item.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Featured Story */}
      {featured && <FeaturedStory item={featured} />}

      {/* 3-Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content — News Feed */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-heading">Latest</h2>
            <div className="flex gap-2">
              {["All", "Solo", "Startups", "B2B", "Tools"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="text-xs px-3 py-1 rounded-full bg-surface text-muted hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0 divide-y divide-card-border">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>

      <HomeSchemaOrg />
    </div>
  );
}

function FeaturedStory({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
                {item.category}
              </span>
              <span className="text-xs text-muted">{item.date}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-heading leading-tight mb-3 group-hover:text-accent transition-colors">
              {item.title}
            </h1>
            <p className="text-muted leading-relaxed">{item.excerpt}</p>
          </div>
          <div className="relative h-48 md:h-auto">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className="group flex gap-4 py-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Link
            href={item.categoryHref}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            {item.category}
          </Link>
          <span className="text-xs text-muted">{item.date}</span>
        </div>
        <h3 className="font-semibold text-heading leading-snug mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-2">
          {item.excerpt}
        </p>
      </div>
      <div className="shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-surface">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
    </Link>
  );
}

function HomeSchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Business",
    url: "https://aibusiness.vc",
    description:
      "How to make money with AI. News, tools, and strategies for solo earners, startups, and enterprises.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
