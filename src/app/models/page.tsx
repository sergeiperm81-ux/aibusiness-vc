import type { Metadata } from "next";
import { models } from "@/data/models";
import ModelsExplorer from "@/components/ModelsExplorer";

export const metadata: Metadata = {
  title: "AI Model Leaderboard - LLM Rankings & Benchmarks (2026)",
  description:
    "Compare the best AI models side-by-side. ELO ratings, benchmark scores, pricing, and detailed profiles for GPT-4, Claude, Gemini, Llama, and more.",
  keywords: [
    "AI model leaderboard",
    "LLM rankings",
    "GPT vs Claude vs Gemini",
    "AI model pricing",
    "AI model benchmarks",
  ],
  alternates: {
    canonical: "/models",
  },
};

export default function ModelsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Leaderboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Model Rankings <span className="text-accent">2026</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            The most comprehensive AI model comparison. ELO ratings from Chatbot
            Arena, benchmark scores, pricing, and what each model is best at.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ModelsExplorer models={models} />
        </div>
      </section>
    </>
  );
}
