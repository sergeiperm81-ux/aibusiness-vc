import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "B2B — AI Implementation for Businesses (2026)",
  description:
    "How businesses implement AI. Case studies, ROI analysis, implementation guides, and lessons from real AI deployments.",
};

export default function B2BPage() {
  const articles = getAllArticles().filter((a) => a.category === "B2B");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-blue-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            B2B
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI for Business — <span className="text-accent">What Works</span> and What Doesn't
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Real stories of AI implementation in businesses. The wins, the failures,
            ROI analysis, and lessons learned.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/b2b/${article.slug}`}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500/40 transition-all hover:-translate-y-1"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-500 text-white">
                      {article.category}
                    </span>
                    <span className="text-xs text-white/50">{article.date}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2 group-hover:text-accent transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                  <span className="text-xs font-medium text-accent mt-3 inline-block">
                    Read case study &rarr;
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
