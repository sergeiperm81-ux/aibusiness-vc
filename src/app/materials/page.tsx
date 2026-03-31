import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import { SectionArticleGrid } from "@/components/SectionPage";

export const metadata: Metadata = {
  title: "Materials — Articles, Podcasts, Videos on AI",
  description:
    "Curated AI content: articles, podcasts, video talks, books, and deep reads about AI and its impact.",
};

export default function MaterialsPage() {
  const articles = getArticlesBySection("materials");

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

      <SectionArticleGrid articles={articles} section="materials" totalLabel="articles" />
    </>
  );
}
