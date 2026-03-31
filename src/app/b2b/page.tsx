import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "B2B — AI Implementation for Businesses (2026)",
  description:
    "How businesses implement AI. Case studies, ROI analysis, implementation guides, and lessons from real AI deployments.",
};

export default function B2BPage() {
  const articles = getArticlesBySection("b2b");

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
            Real stories of AI implementation. The wins, the failures, ROI analysis, and lessons learned.
          </p>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="b2b" totalLabel="articles" />
    </>
  );
}
