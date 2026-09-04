import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "AI Governance — Regulation, Policy & Government AI Initiatives",
  description:
    "EU AI Act, national AI strategies, executive orders, regulatory frameworks, government procurement, and the political economy of AI oversight.",
};

export default function GovernmentPage() {
  const articles = getArticlesBySection("government");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-red-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Governance
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Governance — <span className="text-accent">Regulation, Policy & State Initiatives</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            EU AI Act, national AI strategies, executive orders, regulatory frameworks,
            government procurement, and the political economy of AI oversight.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="government" totalLabel="articles" />
    </>
  );
}
