import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "AI & Society — How AI Is Reshaping the World",
  description:
    "Thoughtful analysis of AI's impact on jobs, education, creativity, trust, and daily life. Beyond the hype — what actually changes.",
};

export default function SocietyPage() {
  const articles = getArticlesBySection("society");

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI & Society
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            How AI Is <span className="text-accent">Reshaping the World</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            Jobs, education, creativity, trust, loneliness — AI touches everything.
            These essays explore what actually changes, beyond the hype.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="society" totalLabel="essays" />
    </>
  );
}
