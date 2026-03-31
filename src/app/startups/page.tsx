import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "AI Startups — Funding, Launches, and Innovations (2026)",
  description:
    "AI startup news, funding rounds, product launches, and the companies shaping the future of AI.",
};

export default function StartupsPage() {
  const articles = getAllArticles().filter((a) => a.category === "Startups");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-purple-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Startups
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Companies <span className="text-accent">Building the Future</span> of AI
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Funding rounds, product launches, and the startups to watch.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/startups/${article.slug}`}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500/40 transition-all hover:-translate-y-1"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-purple-500 text-white">
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
                    Read article &rarr;
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
