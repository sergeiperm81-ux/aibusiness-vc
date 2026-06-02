import Link from "next/link";
import type { Metadata } from "next";
import { getAllToolComparisons, getComparisonBySlug, getComparisonAnalysis } from "@/lib/tool-comparisons";
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
    title: `${comp.toolA.name} vs ${comp.toolB.name} — Which Earns You More? (2026)`,
    description: `${comp.toolA.name} vs ${comp.toolB.name}: pricing, features, ROI analysis, and which ${comp.toolA.category.toLowerCase()} tool is the better investment. Honest comparison updated 2026.`,
    keywords: [
      `${comp.toolA.name} vs ${comp.toolB.name}`,
      `${comp.toolB.name} vs ${comp.toolA.name}`,
      `${comp.toolA.name} alternative`,
      `${comp.toolB.name} alternative`,
      `best ${comp.toolA.category.toLowerCase()} tools 2026`,
    ],
    alternates: {
      canonical: `/tools/compare/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${comp.toolA.name} vs ${comp.toolB.name}`,
      description: `${comp.toolA.name} vs ${comp.toolB.name}: pricing, features, and ROI-focused verdict.`,
      url: `https://aibusiness.vc/tools/compare/${slug}`,
      type: "article",
    },
  };
}

export default async function ToolComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  const { toolA, toolB } = comp;
  const analysis = getComparisonAnalysis(toolA, toolB);
  const domainA = (() => {
    try {
      return new URL(toolA.url).hostname.replace(/^www\./, "");
    } catch {
      return toolA.url;
    }
  })();
  const domainB = (() => {
    try {
      return new URL(toolB.url).hostname.replace(/^www\./, "");
    } catch {
      return toolB.url;
    }
  })();

  const otherComps = getAllToolComparisons()
    .filter((c) => c.slug !== slug && (c.toolA.category === toolA.category))
    .slice(0, 4);

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
            Which {toolA.category.toLowerCase()} tool gives you a better return on investment?
            We break down pricing, features, and real use cases.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <a
              href={toolA.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
            >
              {toolA.name}: {domainA} ↗
            </a>
            <a
              href={toolB.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
            >
              {toolB.name}: {domainB} ↗
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Quick Comparison Table */}
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
                    {toolA.hasAffiliate === true ? "Yes" : toolA.hasAffiliate === false ? "No" : "Unknown"}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    {toolB.hasAffiliate === true ? "Yes" : toolB.hasAffiliate === false ? "No" : "Unknown"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Analysis */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Pricing Breakdown</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.pricingVerdict}</p>
          </div>

          {/* Audience Analysis */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Who Is Each Tool For?</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.audienceVerdict}</p>
          </div>

          {/* Feature Analysis */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Feature Comparison</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.featureVerdict}</p>
          </div>

          {/* Use Case Scenarios */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">When to Choose Which</h2>
            <div className="space-y-3">
              {analysis.useCases.map((uc, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">{uc.scenario}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-amber-600">Winner: {uc.winner}</span> — {uc.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ROI / Money Angle */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">The Money Question</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.moneyAngle}</p>
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
                  Full Review &rarr;
                </Link>
              </div>
            ))}
          </div>

          {/* Related Comparisons */}
          {otherComps.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">More {toolA.category} Comparisons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {otherComps.map((oc) => (
                  <Link
                    key={oc.slug}
                    href={`/tools/compare/${oc.slug}`}
                    className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                  >
                    <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                      {oc.toolA.name} <span className="text-accent">vs</span> {oc.toolB.name}
                    </p>
                    <p className="text-[11px] text-muted mt-1">Compare &rarr;</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
