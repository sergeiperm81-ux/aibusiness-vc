import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "VC — Venture Capital & AI Investment (2026)",
  description:
    "AI venture capital: funds, accelerators, impact investing, funding rounds. Who invests in AI and how much they earn.",
};

export default function VCPage() {
  const articles = getArticlesBySection("vc");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-emerald-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Venture Capital
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Venture Capital — <span className="text-accent">Where the Money Flows</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Funds, accelerators, impact investing, and funding rounds.
            $150B invested in AI startups in 2025. Who writes the checks, who gets them, and what returns they see.
          </p>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="vc" totalLabel="articles" />
    </>
  );
}
