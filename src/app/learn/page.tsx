import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "Learn AI — Best Courses, Books & Resources (2026)",
  description:
    "Curated collection of the best AI learning resources. Courses, certifications, books, and tutorials.",
};

export default function LearnPage() {
  const articles = getArticlesBySection("learn");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-cyan-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Learn
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Learn AI — <span className="text-accent">Courses, Books & Resources</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            The best resources to master AI and start earning.
          </p>
        </div>
      </section>

      <SectionArticleGrid articles={articles} section="learn" totalLabel="articles" />
    </>
  );
}
