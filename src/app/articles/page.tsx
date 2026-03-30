import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles — AI Money-Making Guides & Strategies",
  description:
    "In-depth guides on making money with AI. Step-by-step strategies, tool reviews, income breakdowns, and real-world case studies.",
};

const categoryColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Guides & Strategies
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            How to Make Money <span className="text-accent">with AI</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            In-depth guides with real numbers, step-by-step instructions, and
            the tools you need. No fluff.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${categoryColors[article.category] ?? "bg-gray-500 text-white"}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-[11px] text-muted">{article.date}</span>
                </div>
                <h2 className="font-bold text-white text-base mb-2 group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {article.description}
                </p>
                <span className="text-xs font-medium text-accent mt-3 inline-block">
                  Read guide &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
