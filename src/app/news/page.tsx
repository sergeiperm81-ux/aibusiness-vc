import Link from "next/link";
import type { Metadata } from "next";
import { getAllNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "AI News — Latest AI Business & Money News",
  description:
    "Daily AI business news. Funding rounds, tool launches, market trends, regulation updates, and earning opportunities.",
};

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  News: "bg-gray-500 text-white",
};

export default function NewsPage() {
  const news = getAllNews();

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            News Feed
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Business <span className="text-accent">News</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Daily updates on AI business opportunities, funding, tools, and
            regulation. What matters for making money with AI.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                {item.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${catColors[item.category] ?? catColors.News}`}
                    >
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-[11px] text-muted mb-1">{item.date}</p>
                  <h3 className="font-semibold text-white text-sm leading-snug mb-1.5 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                  <span className="text-[11px] font-medium text-accent mt-2 inline-block">
                    Read more &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
