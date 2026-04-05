import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

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
            AI & the State — <span className="text-accent">Trillions at Stake</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Government AI spending, defense contracts, data center infrastructure, regulation
            (does it help or block your business?), smart cities, and AI in space.
            The biggest money in AI isn't in startups — it's in governments.
          </p>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="government" totalLabel="articles" />
    </>
  );
}
