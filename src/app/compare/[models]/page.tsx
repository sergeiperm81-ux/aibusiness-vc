import Link from "next/link";
import type { Metadata } from "next";
import { getAllComparisons, getComparisonBySlug } from "@/data/comparisons";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ models: string }>;
}

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ models: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { models: slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return { title: "Comparison Not Found" };
  return {
    title: `${comp.modelA.name} vs ${comp.modelB.name} — Which AI Model Is Better? (2026)`,
    description: `Compare ${comp.modelA.name} vs ${comp.modelB.name}: ELO scores, benchmarks, pricing, context windows, and which one to choose. Updated for 2026.`,
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { models: slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  const { modelA, modelB } = comp;

  const rows = [
    { label: "Developer", a: modelA.developer, b: modelB.developer },
    { label: "Released", a: modelA.released, b: modelB.released },
    {
      label: "ELO Score",
      a: String(modelA.elo ?? "—"),
      b: String(modelB.elo ?? "—"),
      highlight: true,
    },
    { label: "MMLU", a: String(modelA.mmlu ?? "—"), b: String(modelB.mmlu ?? "—") },
    { label: "HumanEval", a: String(modelA.humanEval ?? "—"), b: String(modelB.humanEval ?? "—") },
    { label: "Context Window", a: modelA.contextWindow, b: modelB.contextWindow },
    { label: "Input Price", a: modelA.inputPrice, b: modelB.inputPrice },
    { label: "Output Price", a: modelA.outputPrice, b: modelB.outputPrice },
    {
      label: "Open Source",
      a: modelA.openSource ? "Yes" : "No",
      b: modelB.openSource ? "Yes" : "No",
    },
  ];

  function winner(a: string, b: string, higherBetter = true): "a" | "b" | "tie" {
    const numA = parseFloat(a.replace(/[^0-9.]/g, ""));
    const numB = parseFloat(b.replace(/[^0-9.]/g, ""));
    if (isNaN(numA) || isNaN(numB)) return "tie";
    if (numA === numB) return "tie";
    return higherBetter ? (numA > numB ? "a" : "b") : (numA < numB ? "a" : "b");
  }

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/compare"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Comparisons
            </Link>
            <span className="text-xs text-muted">/</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {modelA.name}
              </h2>
              <p className="text-sm text-muted">{modelA.developer}</p>
            </div>
            <span className="text-accent font-bold text-2xl">vs</span>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {modelB.name}
              </h2>
              <p className="text-sm text-muted">{modelB.developer}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {modelA.name} vs {modelB.name} — Full Comparison
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-3 pr-4 text-left font-bold text-gray-400 w-1/4">
                    Metric
                  </th>
                  <th className="pb-3 pr-4 text-center font-bold text-gray-900 w-5/16">
                    {modelA.name}
                  </th>
                  <th className="pb-3 text-center font-bold text-gray-900 w-5/16">
                    {modelB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const eloWin = row.label === "Input Price" || row.label === "Output Price"
                    ? winner(row.a, row.b, false)
                    : winner(row.a, row.b, true);
                  return (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-100 ${row.highlight ? "bg-amber-50/50" : ""}`}
                    >
                      <td className="py-3 pr-4 text-gray-500 font-medium">
                        {row.label}
                      </td>
                      <td
                        className={`py-3 pr-4 text-center font-mono ${
                          eloWin === "a"
                            ? "text-emerald-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {row.a}
                        {eloWin === "a" && " ✓"}
                      </td>
                      <td
                        className={`py-3 text-center font-mono ${
                          eloWin === "b"
                            ? "text-emerald-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {row.b}
                        {eloWin === "b" && " ✓"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            <div className="bg-background rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">{modelA.name}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {modelA.description}
              </p>
              <Link
                href={`/models/${modelA.id}`}
                className="text-xs text-accent font-medium mt-3 inline-block"
              >
                Full profile &rarr;
              </Link>
            </div>
            <div className="bg-background rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">{modelB.name}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {modelB.description}
              </p>
              <Link
                href={`/models/${modelB.id}`}
                className="text-xs text-accent font-medium mt-3 inline-block"
              >
                Full profile &rarr;
              </Link>
            </div>
          </div>

          {/* Other comparisons */}
          <div className="mt-10 text-center">
            <Link
              href="/compare"
              className="text-sm text-gray-400 hover:text-accent transition-colors"
            >
              View all comparisons &rarr;
            </Link>
          </div>
        </div>
      </section>

      <ComparisonSchemaOrg a={modelA} b={modelB} slug={slug} />
    </>
  );
}

function ComparisonSchemaOrg({
  a,
  b,
  slug,
}: {
  a: { name: string; developer: string; elo: number | null };
  b: { name: string; developer: string; elo: number | null };
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${a.name} vs ${b.name} — Which AI Model Is Better?`,
    description: `Side-by-side comparison of ${a.name} (${a.developer}) and ${b.name} (${b.developer}). ELO, benchmarks, pricing.`,
    datePublished: "2026-03-30",
    dateModified: "2026-03-30",
    author: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
    mainEntityOfPage: `https://aibusiness.vc/compare/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
