import Link from "next/link";
import type { Metadata } from "next";
import { TrendingBar } from "@/components/TrendingBar";
import { getAllArticles } from "@/lib/articles";
import { getLatestNews } from "@/lib/supabase";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "AI Business - How to Make Money with AI in 2026",
  description:
    "How to make money with AI: 50+ income methods with $500-$300K/month verified numbers, 356 AI tools reviewed with ROI data, 146 case studies. Updated daily.",
  alternates: {
    canonical: "/",
  },
};

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  VC: "bg-fuchsia-500 text-white",
  Government: "bg-indigo-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Society: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
};

// No revalidate — page is rebuilt fresh on every deploy.
// News section uses getLatestNews() which fetches RSS at build time.
// Cron /api/cron/news calls revalidatePath("/") daily at 7am Sofia
// to refresh news without a full redeploy.

const HOME_FAQ = [
  {
    q: "Is AI actually profitable for businesses in 2026?",
    a: "Yes — and we track the evidence. 146 case studies with verified results, from lean solo operators to enterprises cutting costs 40-60%. The clearest returns come from AI freelancing, automation services, and content systems built on Claude or ChatGPT. See the Solo and B2B sections for step-by-step playbooks.",
  },
  {
    q: "How much does it cost to start an AI side hustle?",
    a: "Most solo earners spend $30-$100/month on AI tools to start. ChatGPT Plus or Claude Pro at $20/month plus one specialized tool (Make.com, Synthesia, or Notion AI) covers 80% of use cases. The Solo Tool Stack page lists $97/month bundles that replace a $200K team.",
  },
  {
    q: "What is the highest-paying AI career in 2026?",
    a: "ML engineers earn $180K-$350K, AI research scientists earn up to $893K total comp at frontier labs, and prompt engineering roles start at $100K. The Learn section maps salaries against the certifications and skills required to qualify.",
  },
  {
    q: "Which AI tool gives the best ROI for small businesses?",
    a: "It depends on the bottleneck. For customer service, Klarna replaced 700 agents with AI and cut costs 40-60%. For content, Make.com plus ChatGPT replaces a writing team at $50/month. The Tool Selector matches your goal, budget, and team to a verified stack.",
  },
  {
    q: "Is AI replacing jobs or creating them?",
    a: "Both. Klarna AI replaced 700 customer service agents while AI engineering jobs grew 200% year over year. The B2B section tracks the cost-cutting case studies; the Learn section tracks the new roles, certifications, and salaries.",
  },
  {
    q: "How is AI Business different from other AI directories?",
    a: "Outcome-first, not catalog-first. Most AI directories list 28,000+ tools without saying which earn money. We focus on 50+ income methods, 146 real case studies with revenue data, and 356 tools reviewed against ROI rather than features.",
  },
];

type HomeSectionBlock = {
  section: "solo" | "startups" | "b2b" | "vc" | "government" | "learn" | "society" | "robots";
  title: string;
  href: string;
  description: string;
  badge: string;
  cta: string;
  hoverRingClass: string;
};

const HOME_SECTION_BLOCKS: HomeSectionBlock[] = [
  {
    section: "robots",
    title: "Robots: The Economics of Physical AI",
    href: "/robots",
    description:
      "The business of humanoid robots — what they cost, China's supply-chain edge, and where the returns are.",
    badge: "ROBOTS",
    cta: "Read analysis",
    hoverRingClass: "hover:ring-orange-500/40",
  },
  {
    section: "solo",
    title: "Solo: AI for Independent Operators",
    href: "/solo",
    description:
      "Execution playbooks for individuals: AI freelancing, productized services, agency models, and lean solo systems.",
    badge: "SOLO",
    cta: "Read guide",
    hoverRingClass: "hover:ring-amber-500/40",
  },
  {
    section: "startups",
    title: "Startups: Build and Scale",
    href: "/startups",
    description:
      "Revenue playbooks, market timing, GTM strategy, and hard numbers from AI products moving from idea to ARR.",
    badge: "STARTUPS",
    cta: "Read startup brief",
    hoverRingClass: "hover:ring-purple-500/40",
  },
  {
    section: "b2b",
    title: "B2B: AI for Business",
    href: "/b2b",
    description:
      "Practical enterprise economics: margin gains, cost savings, and measurable implementation outcomes.",
    badge: "B2B",
    cta: "Read case study",
    hoverRingClass: "hover:ring-blue-500/40",
  },
  {
    section: "vc",
    title: "VC: Capital and Returns",
    href: "/vc",
    description:
      "What investors track now: metrics, deal structure, valuation logic, and AI portfolio risk/reward dynamics.",
    badge: "VC",
    cta: "Read VC analysis",
    hoverRingClass: "hover:ring-fuchsia-500/40",
  },
  {
    section: "government",
    title: "Government: Public AI Economics",
    href: "/government",
    description:
      "Public procurement, policy impact, and where state AI spending turns into commercial opportunity.",
    badge: "GOV",
    cta: "Read policy brief",
    hoverRingClass: "hover:ring-indigo-500/40",
  },
  {
    section: "learn",
    title: "Learn: AI Skills & Careers",
    href: "/learn",
    description:
      "Salary-backed learning paths, role roadmaps, and practical skill stacks to earn in the AI economy.",
    badge: "LEARN",
    cta: "Read learning guide",
    hoverRingClass: "hover:ring-cyan-500/40",
  },
  {
    section: "society",
    title: "Society: AI and the Future of Work",
    href: "/society",
    description:
      "How AI reshapes jobs, education, creativity, trust, and daily life. Thoughtful analysis beyond the hype.",
    badge: "SOCIETY",
    cta: "Read essay",
    hoverRingClass: "hover:ring-pink-500/40",
  },
];

interface FactCardProps {
  label: string;
  value: string;
  sub: string;
}

function FactCard({ label, value, sub }: FactCardProps) {
  return (
    <div className="rounded-xl border border-black/10 p-4">
      <p className="mb-1 text-[10px] font-mono uppercase tracking-wider text-black/50">
        {label}
      </p>
      <p className="mb-1 text-2xl font-bold text-black">{value}</p>
      <p className="text-xs leading-relaxed text-black/60">{sub}</p>
    </div>
  );
}

interface HomeNewsItemListProps {
  items: { slug: string; title: string; excerpt: string; date: string }[];
}

interface HomeFaqSchemaProps {
  items: { q: string; a: string }[];
}

function HomeWebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Business",
    url: "https://aibusiness.vc",
    inLanguage: "en",
    description:
      "How to make money with AI: 146 articles, 356 tool reviews, 36 LLM model profiles, daily news, real income case studies.",
    publisher: {
      "@type": "Organization",
      name: "AI Business",
      url: "https://aibusiness.vc",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aibusiness.vc/news?open={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function HomeNewsItemListSchema({ items }: HomeNewsItemListProps) {
  if (items.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest AI Business News",
    description:
      "Daily AI business news: funding, earnings, tool launches, enterprise deals.",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://aibusiness.vc/news?open=${item.slug}`,
      name: item.title,
      description: item.excerpt,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function HomeFaqSchema({ items }: HomeFaqSchemaProps) {
  if (items.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const allArticles = getAllArticles();
  const newsData = await getLatestNews(6);
  const articlesBySection = HOME_SECTION_BLOCKS.map((block) => ({
    ...block,
    count: allArticles.filter((article) => article.section === block.section).length,
    articles: allArticles.filter((article) => article.section === block.section).slice(0, 3),
  }));
  const signatureToolCtas = [
    {
      href: "/tools/directory",
      title: "AI Tool Directory",
      description: "356 tools reviewed with pricing, ROI data, and honest ratings.",
    },
    {
      href: "/society",
      title: "AI & Society",
      description: "How AI reshapes jobs, education, creativity, and daily life.",
    },
    {
      href: "/learn",
      title: "Learn AI Skills",
      description: "Salary-backed career paths, certifications, and learning guides.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent">
              The business of artificial intelligence
            </p>
            <h1 className="mb-2 text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-3xl">
              How AI Creates <span className="text-accent">Business Value</span> in 2026
            </h1>
            <p className="mb-3 max-w-xl text-sm leading-relaxed text-white/70">
              Independent, outcome-first analysis of where AI creates value — for operators,
              founders, and investors. Real numbers, honest ROI, and 356 tools reviewed across
              solo, startups, and enterprise.
            </p>
            <div className="flex flex-wrap gap-3">
              <TrackedLink
                href="/solo"
                eventName="click_home_cta"
                eventParams={{ cta: "explore_earning_methods" }}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                Explore the Playbooks
              </TrackedLink>
              <TrackedLink
                href="/tools/directory"
                eventName="click_home_cta"
                eventParams={{ cta: "browse_ai_tools" }}
                className="rounded-lg border border-card-border px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-card-bg"
              >
                Browse AI Tools
              </TrackedLink>
              <TrackedLink
                href="/society"
                eventName="click_home_cta"
                eventParams={{ cta: "calculate_ai_roi" }}
                className="rounded-lg border border-emerald-500/40 px-4 py-1.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/10"
              >
                Calculate AI ROI
              </TrackedLink>
            </div>
          </div>
        </div>
        <TrendingBar />
      </section>

      {/* LATEST NEWS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Latest News</h2>
            <Link
              href="/news"
              className="text-sm text-black/50 transition-colors hover:text-accent"
            >
              All news &rarr;
            </Link>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-black/60">
            Auto-updated daily from TechCrunch, Crunchbase, VentureBeat, MIT Tech Review.
            Funding rounds, AI earnings, tool launches, enterprise deals.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {newsData.slice(0, 6).map((item) => (
              <Link
                key={item.slug}
                href={`/news?open=${item.slug}`}
                className="group overflow-hidden rounded-xl bg-background transition-all hover:-translate-y-1 hover:ring-2 hover:ring-accent/40"
              >
                <div className="relative h-36 overflow-hidden bg-gray-800">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${catColors[item.category] ?? "bg-amber-500 text-black"}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <h3 className="mb-1 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mb-1.5 line-clamp-2 text-xs leading-relaxed text-white/70">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-accent">
                      Read more &rarr;
                    </span>
                    <span className="text-[10px] text-white/50">{item.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-lg font-bold text-black">
            What you&rsquo;ll find on AI Business
          </h2>
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-black/70">
            AI Business is an outcome-first guide to the business of artificial intelligence.
            Below is what we cover, with concrete numbers so you can decide where to start.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FactCard label="Income methods" value="50+" sub="With real revenue data" />
            <FactCard label="AI tools reviewed" value="356" sub="With ROI data and pricing" />
            <FactCard label="Case studies" value="146" sub="Real numbers, named companies" />
            <FactCard label="LLM models profiled" value="36" sub="GPT-4o, Claude, Gemini, more" />
          </div>
        </div>
      </section>

      {/* SIGNATURE TOOLS */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Where to Start</h2>
            <Link
              href="/society"
              className="text-sm text-black/50 transition-colors hover:text-accent"
            >
              See all society essays &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {signatureToolCtas.map((tool) => (
              <TrackedLink
                key={tool.href}
                href={tool.href}
                eventName="click_home_cta"
                eventParams={{ cta: tool.title.toLowerCase().replace(/\s+/g, "_") }}
                className="group rounded-xl bg-background p-5 transition-all hover:-translate-y-1 hover:ring-2 hover:ring-accent/40"
              >
                <h3 className="font-bold text-white transition-colors group-hover:text-accent">
                  {tool.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">{tool.description}</p>
                <span className="mt-3 inline-block text-xs font-medium text-accent">
                  Open tool &rarr;
                </span>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FEEDS */}
      {articlesBySection.map((block) => (
        <section key={block.section} className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">{block.title}</h2>
              <Link
                href={block.href}
                className="text-sm text-black/50 transition-colors hover:text-accent"
              >
                All {block.badge.toLowerCase()} articles &rarr;
              </Link>
            </div>
            <p className="mb-6 max-w-3xl text-sm text-black/60">
              {block.count} published articles. {block.description}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {block.articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${article.section}/${article.slug}`}
                  className={`group overflow-hidden rounded-xl bg-background transition-all hover:-translate-y-1 hover:ring-2 ${block.hoverRingClass}`}
                >
                  <div className="relative h-36 overflow-hidden bg-card-bg">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-black/40 to-black/70" />
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${catColors[article.category] ?? "bg-amber-500 text-black"}`}
                    >
                      {block.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-white/70">{article.description}</p>
                    <span className="mt-3 inline-block text-xs font-medium text-accent">
                      {block.cta} &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* COMMON QUESTIONS */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-xl font-bold text-black">Common questions</h2>
          <p className="mb-6 max-w-3xl text-sm text-black/60">
            Direct answers to the questions readers ask most. Each answer links to a deeper
            guide.
          </p>
          <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {HOME_FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="mb-2 text-base font-bold text-black">{item.q}</h3>
                <p className="text-sm leading-relaxed text-black/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeWebsiteSchema />
      <HomeNewsItemListSchema items={newsData} />
      <HomeFaqSchema items={HOME_FAQ} />
    </>
  );
}
