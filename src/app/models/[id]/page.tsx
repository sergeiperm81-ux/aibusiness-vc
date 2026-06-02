import Link from "next/link";
import type { Metadata } from "next";
import { models, getModelById } from "@/data/models";
import { notFound } from "next/navigation";
import { getModelExternalLinks } from "@/lib/model-links";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return models.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) return { title: "Model Not Found" };
  return {
    title: `${model.name} - Benchmarks, Pricing & Review (2026)`,
    description: `${model.name} by ${model.developer}: ELO ${model.elo}, MMLU ${model.mmlu}, ${model.contextWindow} context. Pricing: ${model.inputPrice} input. ${model.description}`,
    keywords: [
      `${model.name} benchmark`,
      `${model.name} pricing`,
      `${model.name} context window`,
      `${model.developer} model`,
      "LLM comparison",
    ],
    alternates: {
      canonical: `/models/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${model.name} - Benchmarks and Pricing`,
      description: `${model.name} by ${model.developer}: benchmark snapshot, pricing, and practical fit.`,
      url: `https://aibusiness.vc/models/${id}`,
      type: "article",
    },
  };
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) notFound();

  const others = models.filter((m) => m.id !== model.id).slice(0, 3);
  const links = getModelExternalLinks(model);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/models"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Leaderboard
            </Link>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs text-accent">{model.name}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {model.name}
              </h1>
              <p className="text-sm text-muted">
                by {model.developer} &middot; ID{" "}
                <span className="font-mono text-zinc-300">{model.id}</span>
                {" "} &middot; Released {model.released} &middot;{" "}
                <span
                  className={
                    model.openSource ? "text-emerald-400" : "text-zinc-400"
                  }
                >
                  {model.openSource ? "Open Source" : "Proprietary"}
                </span>
              </p>
            </div>
            <span className="text-3xl font-bold text-emerald-400 font-mono">
              {model.elo ?? "-"}
              <span className="text-xs text-muted font-normal ml-1">ELO</span>
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={links.docsUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 hover:border-emerald-500 hover:text-emerald-300 transition-colors"
            >
              Official docs
            </a>
            <a
              href={links.tryUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
            >
              {links.tryLabel}
            </a>
            <a
              href={links.searchUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-100 hover:border-zinc-500 transition-colors"
            >
              Search official source
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: "ELO Score", value: String(model.elo ?? "-"), color: "text-emerald-600" },
              { label: "MMLU", value: String(model.mmlu ?? "-"), color: "text-gray-900" },
              { label: "HumanEval", value: String(model.humanEval ?? "-"), color: "text-gray-900" },
              { label: "Context Window", value: model.contextWindow, color: "text-gray-900" },
              { label: "Input Price", value: model.inputPrice, color: "text-amber-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-background rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold text-white mb-3">
              About {model.name}
            </h2>
            <p className="text-muted leading-relaxed">{model.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-card-border">
              <div>
                <p className="text-xs text-muted">Output Price</p>
                <p className="text-sm font-semibold text-white">
                  {model.outputPrice}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">License</p>
                <p className="text-sm font-semibold text-white">
                  {model.openSource ? "Open Source" : "Proprietary"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted">Official Website</p>
                <a
                  href={links.tryUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-sm font-semibold text-emerald-300 hover:underline"
                >
                  {links.tryLabel}
                </a>
              </div>
            </div>
            <p className="text-xs text-muted mt-4">
              Not sure where to find it? Search query:{" "}
              <span className="font-mono text-zinc-300">
                "{model.name} official"
              </span>
            </p>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Compare with Other Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.id}
                href={`/models/${other.id}`}
                className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                    {other.name}
                  </h3>
                  <span className="text-sm font-mono text-emerald-400">
                    {other.elo}
                  </span>
                </div>
                <p className="text-xs text-muted">{other.developer}</p>
                <p className="text-xs text-muted mt-1">
                  {other.contextWindow} context &middot; {other.inputPrice}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
