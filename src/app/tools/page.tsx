import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "AI Tools & Technology — Model Launches, Pricing and Comparisons",
  description:
    "Reporting on the AI tools market: model launches, what they actually cost, and head-to-head comparisons written by hand rather than generated from a template.",
  keywords: [
    "AI tools",
    "AI model comparison",
    "AI pricing",
    "Claude vs GPT",
    "AI technology analysis",
  ],
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  const articles = getArticlesBySection("tools");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-emerald-400">
            Tools &amp; Technology
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            What the AI Tools <span className="text-accent">Actually Cost</span>
          </h1>
          <p className="max-w-2xl text-sm text-white/70">
            Model launches, real pricing, and head-to-head comparisons. Every piece here is
            written by hand, with the numbers read off the vendor&apos;s own page on the day
            of writing.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="tools" totalLabel="articles" />
    </>
  );
}
