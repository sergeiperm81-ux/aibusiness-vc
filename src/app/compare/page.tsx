import Link from "next/link";
import type { Metadata } from "next";
import { getAllComparisons } from "@/data/comparisons";

export const metadata: Metadata = {
  title: "AI Model Comparisons — Head-to-Head LLM Battles (2026)",
  description:
    "Compare AI models side-by-side. GPT-4 vs Claude, Gemini vs DeepSeek, and more. Benchmarks, pricing, and which model is best for your use case.",
};

export default function ComparePage() {
  const comparisons = getAllComparisons();

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Head-to-Head
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Model Comparisons <span className="text-accent">2026</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Side-by-side comparisons of the top AI models. Benchmarks, pricing,
            strengths, and which one to choose for your use case.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <p className="font-bold text-white text-sm">
                      {comp.modelA.name}
                    </p>
                    <p className="text-[10px] text-muted">
                      {comp.modelA.developer}
                    </p>
                  </div>
                  <span className="text-accent font-bold text-lg px-3">vs</span>
                  <div className="text-center flex-1">
                    <p className="font-bold text-white text-sm">
                      {comp.modelB.name}
                    </p>
                    <p className="text-[10px] text-muted">
                      {comp.modelB.developer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-mono">
                    {comp.modelA.elo ?? "—"}
                  </span>
                  <span className="text-muted">ELO</span>
                  <span className="text-emerald-400 font-mono">
                    {comp.modelB.elo ?? "—"}
                  </span>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-medium text-accent group-hover:underline">
                    Compare &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
