import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "AI Startups — Funding, Launches, and Innovations (2026)",
  description:
    "AI startup news, funding rounds, product launches, and the companies shaping the future of AI.",
};

export default function StartupsPage() {
  const articles = getArticlesBySection("startups");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-purple-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Startups
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Companies <span className="text-accent">Building the Future</span> of AI
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Funding rounds, product launches, and the startups to watch.
          </p>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="startups" totalLabel="articles" />
    </>
  );
}
