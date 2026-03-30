import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business — How to Make Money with AI in 2026",
  description:
    "The definitive guide to making money with AI. Discover 50+ proven methods, the best AI tools, real income case studies, and step-by-step strategies. From AI side hustles to building AI automation agencies.",
};

const earnCategories = [
  {
    title: "AI Freelancing",
    description: "Offer AI-powered services: writing, design, video, coding",
    income: "$2K-$25K/mo",
    difficulty: "Beginner",
    href: "/earn/ai-freelancing",
  },
  {
    title: "AI Automation Agency",
    description:
      "Build and sell AI workflows to businesses. Hottest model of 2026",
    income: "$10K-$100K/mo",
    difficulty: "Intermediate",
    href: "/earn/ai-automation-agency",
  },
  {
    title: "AI Digital Products",
    description: "Create once, sell forever: prompts, templates, courses",
    income: "$500-$50K/mo",
    difficulty: "Beginner",
    href: "/earn/ai-digital-products",
  },
  {
    title: "AI Content Creation",
    description: "YouTube, blogs, newsletters monetized with AI",
    income: "$500-$80K/mo",
    difficulty: "Beginner",
    href: "/earn/ai-content-creation",
  },
  {
    title: "AI SaaS & Agents",
    description: "Build software products powered by AI. Highest ceiling",
    income: "$1K-$500K/mo",
    difficulty: "Advanced",
    href: "/earn/ai-saas-agents",
  },
  {
    title: "AI Careers & Jobs",
    description: "Highest-paying AI roles and how to land them",
    income: "$101K-$893K/yr",
    difficulty: "Varies",
    href: "/earn/ai-careers",
  },
];

const featuredTools = [
  { name: "Semrush", category: "SEO & Marketing", href: "/tools/semrush" },
  { name: "Notion AI", category: "Productivity", href: "/tools/notion-ai" },
  { name: "Make.com", category: "Automation", href: "/tools/make" },
  { name: "Copy.ai", category: "Writing", href: "/tools/copy-ai" },
  { name: "Synthesia", category: "Video", href: "/tools/synthesia" },
  { name: "Cursor", category: "Coding", href: "/tools/cursor" },
];

const stats = [
  { value: "$2.52T", label: "Global AI spending in 2026" },
  { value: "49.6%", label: "AI agents market CAGR" },
  { value: "28%", label: "Higher pay for AI-skilled workers" },
  { value: "58%", label: "Small businesses now using AI" },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <EarnSection />
      <ToolsSection />
      <CaseStudiesPreview />
      <NewsletterSection />
      <HomeSchemaOrg />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-accent font-mono text-sm font-medium mb-4 tracking-wider uppercase">
            The AI Gold Rush is here
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            How to Make Money
            <br />
            <span className="text-accent">with AI</span> in 2026
          </h1>
          <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-2xl">
            The definitive guide to earning with artificial intelligence. 50+
            proven methods, honest income numbers, the best tools reviewed, and
            real case studies from people who actually did it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/earn"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors"
            >
              Explore Earning Methods
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border border-card-border text-foreground rounded-lg hover:bg-card-bg transition-colors"
            >
              Browse AI Tools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-y border-card-border bg-card-bg/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EarnSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-3">
          How People Make Money with AI
        </h2>
        <p className="text-muted text-lg max-w-2xl">
          From beginner-friendly side hustles to advanced business models.
          Choose your path based on your skills and income goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earnCategories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group border border-card-border rounded-xl p-6 hover:border-accent/50 transition-all hover:bg-card-bg"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                {category.difficulty}
              </span>
              <span className="text-sm font-mono text-success">
                {category.income}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {category.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/earn"
          className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
        >
          View all 50+ earning methods &rarr;
        </Link>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="border-t border-card-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">
            Best AI Tools for Making Money
          </h2>
          <p className="text-muted text-lg max-w-2xl">
            Honest reviews with real ROI analysis. We test every tool and show
            you exactly how it helps you earn.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group border border-card-border rounded-lg p-4 text-center hover:border-accent/50 transition-all hover:bg-card-bg"
            >
              <div className="w-12 h-12 rounded-lg bg-card-bg border border-card-border mx-auto mb-3 flex items-center justify-center text-accent text-lg font-bold">
                {tool.name[0]}
              </div>
              <p className="font-medium text-sm group-hover:text-accent transition-colors">
                {tool.name}
              </p>
              <p className="text-xs text-muted mt-1">{tool.category}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
          >
            Browse all AI tools &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function CaseStudiesPreview() {
  return (
    <section className="border-t border-card-border bg-card-bg/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Real Income Case Studies</h2>
          <p className="text-muted text-lg max-w-2xl">
            Not theory. Real people, real numbers, real timelines. See exactly
            how others are making money with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "From $0 to $10K/mo with an AI Automation Agency",
              income: "$10,200/mo",
              timeline: "6 months",
              method: "AI Automation",
              href: "/case-studies/ai-automation-agency-10k",
            },
            {
              title: "AI Copywriting Freelancer: 9 Clients, $16K/mo",
              income: "$16,200/mo",
              timeline: "8 months",
              method: "AI Freelancing",
              href: "/case-studies/ai-copywriting-freelancer",
            },
            {
              title: "Faceless YouTube Channel: $5K/mo with AI Video",
              income: "$5,100/mo",
              timeline: "12 months",
              method: "Content Creation",
              href: "/case-studies/faceless-youtube-ai",
            },
          ].map((study) => (
            <Link
              key={study.title}
              href={study.href}
              className="group border border-card-border rounded-xl p-6 hover:border-accent/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-success">
                  {study.income}
                </span>
                <span className="text-xs text-muted">in {study.timeline}</span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
                {study.title}
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                {study.method}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/case-studies"
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
          >
            Read all case studies &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="border-t border-card-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">
            Get the AI Money Newsletter
          </h2>
          <p className="text-muted text-lg mb-8">
            Weekly digest of the best ways to make money with AI. New tools, new
            methods, real income reports. Free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 px-4 py-3 bg-card-bg border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              className="px-6 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent-hover transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-muted mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

function HomeSchemaOrg() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Business",
    url: "https://aibusiness.vc",
    description:
      "The definitive guide to making money with AI. 50+ proven methods, honest income numbers, the best tools reviewed, and real case studies.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can you really make money with AI in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. AI is creating new income streams across freelancing, business automation, content creation, and digital products. Global AI spending reached $2.52 trillion in 2026, and workers with AI skills earn 28% more on average.",
        },
      },
      {
        "@type": "Question",
        name: "What is the easiest way to make money with AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The easiest entry points are AI-powered freelancing (copywriting, design, video creation) and selling AI digital products (prompt packs, templates). These require minimal technical skills and can generate $500-5,000/month within weeks.",
        },
      },
      {
        "@type": "Question",
        name: "How much money can you make with AI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Income varies widely by method. AI freelancers earn $2,000-25,000/month. AI automation agencies generate $10,000-100,000+/month. AI SaaS products can reach $1,000-500,000+/month. AI careers pay $101,000-893,000/year.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
