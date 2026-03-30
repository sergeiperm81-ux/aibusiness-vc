import Link from "next/link";
import type { Metadata } from "next";
import { models } from "@/data/models";

export const metadata: Metadata = {
  title: "AI Model Leaderboard — LLM Rankings & Benchmarks (2026)",
  description:
    "Compare the best AI models side-by-side. ELO ratings, benchmark scores, pricing, and detailed profiles for GPT-4, Claude, Gemini, Llama, and more.",
};

export default function ModelsPage() {
  const sorted = [...models].sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0));

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
          {/* Leaderboard table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 pr-3 font-bold text-gray-900 w-8">#</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Model</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Developer</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900 text-right">ELO</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900 text-right">MMLU</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Context</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Price (Input)</th>
                  <th className="pb-3 font-bold text-gray-900">Type</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((model, i) => (
                  <tr
                    key={model.id}
                    className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="py-3 pr-3">
                      <span
                        className={`text-sm font-bold ${
                          i === 0
                            ? "text-amber-500"
                            : i === 1
                              ? "text-gray-400"
                              : i === 2
                                ? "text-amber-700"
                                : "text-gray-300"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/models/${model.id}`}
                        className="font-semibold text-gray-900 hover:text-amber-600 transition-colors"
                      >
                        {model.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{model.developer}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className="font-mono font-bold text-emerald-600">
                        {model.elo ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-gray-600">
                      {model.mmlu ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {model.contextWindow}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {model.inputPrice}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          model.openSource
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {model.openSource ? "Open" : "Closed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model cards below */}
          <h2 className="text-lg font-bold text-gray-900 mt-12 mb-6">
            Model Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((model, i) => (
              <Link
                key={model.id}
                href={`/models/${model.id}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-accent">
                    #{i + 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      model.openSource
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-500/10 text-zinc-400"
                    }`}
                  >
                    {model.openSource ? "Open Source" : "Proprietary"}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-accent transition-colors">
                  {model.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">{model.developer}</p>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {model.description}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-card-border">
                  <div>
                    <p className="text-lg font-bold text-emerald-400">
                      {model.elo ?? "—"}
                    </p>
                    <p className="text-[10px] text-muted">ELO</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">
                      {model.contextWindow}
                    </p>
                    <p className="text-[10px] text-muted">Context</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {model.inputPrice}
                    </p>
                    <p className="text-[10px] text-muted">per 1M tokens</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
