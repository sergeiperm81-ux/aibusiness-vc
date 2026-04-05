import Link from "next/link";
import type { Metadata } from "next";
import { tools, toolCategories } from "@/data/tools";
import { getAllToolComparisons, professionToolMap, getToolsForProfession } from "@/lib/tool-comparisons";
import { getArticlesBySection } from "@/lib/articles";

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const metadata: Metadata = {
  title: "Best AI Tools for Making Money (2026) — Honest Reviews & Comparisons",
  description:
    "500+ AI tools reviewed with ROI analysis. Compare tools, find the best stack for your profession, and discover which tools actually help you earn more.",
};

export default function ToolsPage() {
  const comparisons = getAllToolComparisons();
  const articles = getArticlesBySection("tools");
  const professions = Object.entries(professionToolMap);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-emerald-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Tools Hub
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Best AI Tools <span className="text-accent">for Making Money</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            {tools.length} tools reviewed with honest ROI analysis. Compare tools head-to-head,
            find the best stack for your job, or browse by category.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href="/tools/directory"
              className="px-4 py-2 bg-accent text-black text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Full Directory ({tools.length} tools)
            </Link>
            <Link
              href="/tools/compare"
              className="px-4 py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Compare Tools ({comparisons.length} matchups)
            </Link>
            <Link
              href="/tools/best-for"
              className="px-4 py-2 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Best For Your Job ({professions.length} roles)
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
            {toolCategories.map((cat) => {
              const count = tools.filter((t) => t.category === cat).length;
              if (count === 0) return null;
              return (
                <Link
                  key={cat}
                  href={`/tools/category/${slugify(cat)}`}
                  className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                >
                  <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                    {cat}
                  </h3>
                  <p className="text-emerald-400 font-mono text-xs mt-1">{count} tools</p>
                </Link>
              );
            })}
          </div>

          {/* Best For Your Job */}
          <h2 className="text-lg font-bold text-gray-900 mb-6">Best AI Tools For Your Job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {professions.slice(0, 9).map(([slug, prof]) => {
              const count = getToolsForProfession(slug).length;
              return (
                <Link
                  key={slug}
                  href={`/tools/best-for/${slug}`}
                  className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                >
                  <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                    {prof.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{prof.description}</p>
                  <p className="text-emerald-400 font-mono text-xs mt-2">{count} tools →</p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mb-10">
            <Link href="/tools/best-for" className="text-sm text-amber-600 font-medium hover:underline">
              View all {professions.length} professions →
            </Link>
          </div>

          {/* Articles */}
          {articles.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Tool Reviews & Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.slice(0, 6).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/tools/${article.slug}`}
                    className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted line-clamp-2">{article.description}</p>
                    <p className="text-[11px] font-medium text-accent mt-3">Read Article →</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
