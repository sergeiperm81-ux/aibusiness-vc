import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Solo — Make Money with AI as an Individual (2026)",
  description:
    "How individuals earn money with AI. Freelancing, digital products, content creation, side hustles. Real income data and step-by-step guides.",
};

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
};

export default function SoloPage() {
  const articles = getAllArticles().filter((a) => a.category === "Solo");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Solo Earners
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Make Money with AI <span className="text-accent">as an Individual</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            No company needed. No employees. Just you and AI. Every method with
            real income numbers, difficulty levels, and time to first dollar.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/solo/${article.slug}`}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[article.category] ?? "bg-amber-500 text-black"}`}>
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
                    Read guide &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {articles.length === 0 && (
            <p className="text-center text-white/50 py-10">
              Articles coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
