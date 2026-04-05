import Link from "next/link";
import type { Metadata } from "next";
import { getAllToolComparisons, getComparisonBySlug } from "@/lib/tool-comparisons";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllToolComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return { title: "Comparison Not Found" };
  return {
    title: `${comp.toolA.name} vs ${comp.toolB.name} — Which Is Better? (2026)`,
    description: `${comp.toolA.name} vs ${comp.toolB.name} comparison. Pricing, features, pros/cons, and which AI tool is better for your needs. Updated 2026.`,
    keywords: [
      `${comp.toolA.name} vs ${comp.toolB.name}`,
      `${comp.toolB.name} vs ${comp.toolA.name}`,
      `${comp.toolA.name} alternative`,
      `${comp.toolB.name} alternative`,
      `best ${comp.toolA.category.toLowerCase()} tools`,
    ],
  };
}

export default async function ToolComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  const { toolA, toolB } = comp;

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/tools" className="text-muted hover:text-accent transition-colors">
              Tools
            </Link>
            <span className="text-muted">/</span>
            <Link href="/tools/compare" className="text-muted hover:text-accent transition-colors">
              Compare
            </Link>
            <span className="text-muted">/</span>
            <span className="text-accent">{toolA.name} vs {toolB.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {toolA.name} <span className="text-accent">vs</span> {toolB.name}
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Side-by-side comparison of {toolA.name} and {toolB.name}. Which {toolA.category.toLowerCase()} tool is better for your needs?
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Comparison Table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">{toolA.name}</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-900">{toolB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-500">Category</td>
                  <td className="py-3 px-4 text-gray-900">{toolA.category}</td>
                  <td className="py-3 px-4 text-gray-900">{toolB.category}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">Pricing</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{toolA.pricing}</td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{toolB.pricing}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-500">Best For</td>
                  <td className="py-3 px-4 text-gray-900">{toolA.targetUser}</td>
                  <td className="py-3 px-4 text-gray-900">{toolB.targetUser}</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">Key Feature</td>
                  <td className="py-3 px-4 text-gray-900">{toolA.keyFeature}</td>
                  <td className="py-3 px-4 text-gray-900">{toolB.keyFeature}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-500">Affiliate Program</td>
                  <td className="py-3 px-4 text-gray-900">
                    {toolA.hasAffiliate === true ? "✅ Yes" : toolA.hasAffiliate === false ? "❌ No" : "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {toolB.hasAffiliate === true ? "✅ Yes" : toolB.hasAffiliate === false ? "❌ No" : "Unknown"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[toolA, toolB].map((tool) => (
              <div key={tool.id} className="bg-background rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
                    {tool.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{tool.name}</h2>
                    <p className="text-xs text-muted">{tool.pricing}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4">{tool.description}</p>
                <div className="pt-3 border-t border-card-border">
                  <p className="text-xs text-muted mb-1">Key Differentiator</p>
                  <p className="text-sm text-white font-medium">{tool.keyFeature}</p>
                </div>
                <Link
                  href={`/tools/directory/${tool.id}`}
                  className="inline-block mt-4 text-xs font-medium text-accent hover:underline"
                >
                  Full Review →
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Line */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">The Bottom Line</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Choose {toolA.name}</strong> if you need {toolA.keyFeature.toLowerCase()}.
              It&apos;s priced at {toolA.pricing} and is best for {toolA.targetUser.toLowerCase()}.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              <strong>Choose {toolB.name}</strong> if you need {toolB.keyFeature.toLowerCase()}.
              It&apos;s priced at {toolB.pricing} and is best for {toolB.targetUser.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
