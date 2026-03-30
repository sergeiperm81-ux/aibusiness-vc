import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Make Money with AI — 50+ Proven Methods (2026)",
  description:
    "Comprehensive guide to making money with AI in 2026. From beginner AI side hustles ($500/mo) to AI automation agencies ($100K+/mo). Real income data, step-by-step guides, and tools for every method.",
};

const methods = [
  {
    category: "AI Freelancing",
    description:
      "Offer AI-powered services to clients. Lowest barrier to entry, fastest time to first income.",
    items: [
      { name: "AI Copywriting & Content Writing", income: "$2K-$15K/mo", difficulty: "Beginner", time: "1-2 weeks", href: "/earn/ai-copywriting" },
      { name: "AI Design Services", income: "$1.5K-$10K/mo", difficulty: "Beginner", time: "1-3 weeks", href: "/earn/ai-design" },
      { name: "AI Video Creation", income: "$2K-$15K/mo", difficulty: "Beginner", time: "2-4 weeks", href: "/earn/ai-video-creation" },
      { name: "AI Coding & Development", income: "$5K-$25K/mo", difficulty: "Intermediate", time: "1-4 weeks", href: "/earn/ai-coding" },
      { name: "AI Consulting", income: "$5K-$30K/mo", difficulty: "Intermediate", time: "2-8 weeks", href: "/earn/ai-consulting" },
      { name: "AI Social Media Management", income: "$1.2K-$5K/mo per client", difficulty: "Beginner", time: "1-2 weeks", href: "/earn/ai-social-media" },
      { name: "AI Virtual Staging (Real Estate)", income: "$1K-$8K/mo", difficulty: "Beginner", time: "1-2 weeks", href: "/earn/ai-virtual-staging" },
      { name: "AI Translation & Localization", income: "$25K-$100K/yr", difficulty: "Intermediate", time: "1-4 weeks", href: "/earn/ai-translation" },
    ],
  },
  {
    category: "AI Business Models",
    description:
      "Build a scalable business powered by AI. Higher income ceiling, requires more investment upfront.",
    items: [
      { name: "AI Automation Agency", income: "$10K-$100K+/mo", difficulty: "Intermediate", time: "1-3 months", href: "/earn/ai-automation-agency" },
      { name: "White-Label AI Chatbot Reseller", income: "$4K-$40K/mo", difficulty: "Beginner", time: "2-6 weeks", href: "/earn/ai-chatbot-reseller" },
      { name: "AI SaaS Products", income: "$1K-$500K+/mo", difficulty: "Advanced", time: "2-6 months", href: "/earn/ai-saas" },
      { name: "AI Content Agency", income: "$10K-$100K/mo", difficulty: "Intermediate", time: "1-2 months", href: "/earn/ai-content-agency" },
      { name: "AI Training & Education Business", income: "$5K-$50K/mo", difficulty: "Intermediate", time: "1-3 months", href: "/earn/ai-training-business" },
      { name: "AI Agent Development", income: "$5K-$100K+/mo", difficulty: "Advanced", time: "1-3 months", href: "/earn/ai-agents" },
      { name: "AI-Enhanced E-Commerce", income: "$1K-$50K+/mo", difficulty: "Beginner", time: "2-8 weeks", href: "/earn/ai-ecommerce" },
    ],
  },
  {
    category: "AI Content Creation",
    description:
      "Create content with AI and monetize through ads, sponsorships, and affiliate commissions.",
    items: [
      { name: "Faceless YouTube Channels", income: "$500-$80K+/mo", difficulty: "Beginner", time: "3-12 months", href: "/earn/faceless-youtube" },
      { name: "AI-Powered Blogging", income: "$500-$10K+/mo", difficulty: "Beginner", time: "3-12 months", href: "/earn/ai-blogging" },
      { name: "AI Newsletter Business", income: "$1K-$50K+/mo", difficulty: "Beginner", time: "2-6 months", href: "/earn/ai-newsletter" },
      { name: "AI Podcasting", income: "$500-$20K+/mo", difficulty: "Beginner", time: "3-12 months", href: "/earn/ai-podcasting" },
    ],
  },
  {
    category: "AI Digital Products",
    description:
      "Create once, sell forever. The most passive income model with AI.",
    items: [
      { name: "Prompt Libraries & Packs", income: "$500-$5K/mo", difficulty: "Beginner", time: "1-4 weeks", href: "/earn/prompt-packs" },
      { name: "Online Courses About AI", income: "$2K-$50K+/mo", difficulty: "Intermediate", time: "1-3 months", href: "/earn/ai-courses" },
      { name: "AI Templates & Frameworks", income: "$500-$10K/mo", difficulty: "Beginner", time: "1-4 weeks", href: "/earn/ai-templates" },
      { name: "AI Art & Print-on-Demand", income: "$500-$10K/mo", difficulty: "Beginner", time: "2-6 weeks", href: "/earn/ai-art-pod" },
      { name: "E-books and Guides", income: "$200-$5K/mo", difficulty: "Beginner", time: "1-4 weeks", href: "/earn/ai-ebooks" },
      { name: "Vibe Coding Micro-Tools", income: "$500-$20K/mo", difficulty: "Beginner", time: "1-4 weeks", href: "/earn/vibe-coding" },
    ],
  },
  {
    category: "AI Careers & Jobs",
    description:
      "Get hired in the AI industry. The highest-paying and fastest-growing job market.",
    items: [
      { name: "AI Engineering Roles", income: "$150K-$450K/yr", difficulty: "Advanced", time: "1-6 months", href: "/earn/ai-engineering-jobs" },
      { name: "Prompt Engineering", income: "$101K-$192K/yr", difficulty: "Intermediate", time: "1-3 months", href: "/earn/prompt-engineering-jobs" },
      { name: "AI Data Labeling & Training", income: "$17-$100/hr", difficulty: "Beginner", time: "Immediate", href: "/earn/ai-data-labeling" },
      { name: "AI Product Management", income: "$130K-$250K/yr", difficulty: "Intermediate", time: "1-6 months", href: "/earn/ai-product-manager" },
    ],
  },
  {
    category: "AI Investing",
    description:
      "Invest in the AI boom through stocks, ETFs, and startup investing.",
    items: [
      { name: "AI ETFs & Stocks", income: "Market returns", difficulty: "Beginner", time: "Variable", href: "/earn/ai-investing" },
      { name: "AI Startup Angel Investing", income: "High risk/reward", difficulty: "Advanced", time: "Years", href: "/earn/ai-startup-investing" },
    ],
  },
];

export default function EarnPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            How to Make Money with AI
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            50+ proven methods to earn with artificial intelligence in 2026.
            Every method includes realistic income ranges, difficulty levels,
            time to first income, and the tools you need. No hype — just
            data.
          </p>
        </div>

        <div className="space-y-16">
          {methods.map((section) => (
            <div key={section.category}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{section.category}</h2>
                <p className="text-muted">{section.description}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-left">
                      <th className="pb-3 pr-4 font-semibold">Method</th>
                      <th className="pb-3 pr-4 font-semibold">
                        Income Potential
                      </th>
                      <th className="pb-3 pr-4 font-semibold">Difficulty</th>
                      <th className="pb-3 font-semibold">Time to Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item) => (
                      <tr
                        key={item.name}
                        className="border-b border-card-border/50 hover:bg-card-bg transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <Link
                            href={item.href}
                            className="font-medium text-foreground hover:text-accent transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 font-mono text-success text-xs">
                          {item.income}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              item.difficulty === "Beginner"
                                ? "bg-green-500/10 text-green-400"
                                : item.difficulty === "Intermediate"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : item.difficulty === "Advanced"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-zinc-500/10 text-zinc-400"
                            }`}
                          >
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="py-3 text-muted text-xs">
                          {item.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EarnSchemaOrg />
    </>
  );
}

function EarnSchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Make Money with AI — 50+ Proven Methods (2026)",
    description:
      "Comprehensive guide to making money with AI in 2026. From beginner AI side hustles to AI automation agencies.",
    author: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
    publisher: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
    datePublished: "2026-03-30",
    dateModified: "2026-03-30",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
