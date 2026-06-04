import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "Solo — Make Money with AI as an Individual (2026)",
  description:
    "How individuals earn money with AI. Freelancing, digital products, content creation, side hustles. Real income data and step-by-step guides.",
};

export default function SoloPage() {
  const articles = getArticlesBySection("solo");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Solo &amp; Independent
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI for <span className="text-accent">Independent Operators</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            No company, no team — just you and AI. Practical methods with real
            numbers, honest difficulty levels, and realistic timelines.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="solo" totalLabel="articles" />
    </>
  );
}
