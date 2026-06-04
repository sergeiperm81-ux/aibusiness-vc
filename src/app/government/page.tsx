import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "Government — AI & the State: Spending, Defense, Regulation, Infrastructure",
  description:
    "AI government spending, defense contracts, data centers, regulation, smart cities, space. Trillions at stake in public AI.",
};

export default function GovernmentPage() {
  const articles = getArticlesBySection("government");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-red-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Government & AI
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI & the State — <span className="text-accent">Public Spending & Policy</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Government AI spending, defense contracts, data-center infrastructure, regulation,
            smart cities, and AI in space — and what it all means for businesses.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="government" totalLabel="articles" />
    </>
  );
}
