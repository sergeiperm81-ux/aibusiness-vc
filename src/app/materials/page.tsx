import type { Metadata } from "next";
import Link from "next/link";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "Materials — Articles, Podcasts, Videos on AI",
  description:
    "Curated AI content: articles, podcasts, video talks, books, and deep reads about AI and its impact.",
};

export default function MaterialsPage() {
  const articles = getArticlesBySection("materials");
  const signatureTools = [
    {
      href: "/materials/roi-calculator",
      title: "AI ROI Calculator",
      description: "Estimate monthly gain, annual net impact, and payback period for any AI initiative.",
      accent: "text-emerald-400",
    },
    {
      href: "/materials/tool-selector",
      title: "AI Tool Selector",
      description: "Get practical stack recommendations by goal, budget, team size, and technical level.",
      accent: "text-cyan-400",
    },
    {
      href: "/materials/playbook-templates",
      title: "Playbook Templates",
      description: "Copy proven templates for offers, discovery calls, delivery SOPs, and value pricing.",
      accent: "text-amber-400",
    },
  ];

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Materials
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Best <span className="text-accent">AI Content</span> Worth Your Time
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Curated articles, podcasts, videos, books, and deep reads about AI.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Signature Tools</p>
              <h2 className="text-xl font-bold text-gray-900">Build, Validate, and Scale Faster</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signatureTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <h3 className={`text-base font-bold ${tool.accent} group-hover:text-accent transition-colors`}>
                  {tool.title}
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{tool.description}</p>
                <span className="text-[11px] font-medium text-accent mt-3 inline-block">Open tool &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="materials" totalLabel="articles" />
    </>
  );
}
