import Link from "next/link";
import type { Metadata } from "next";
import { tools, getToolById } from "@/data/tools";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.name} Review — Pricing, Features & Alternatives (2026)`,
    description: `${tool.name} review: ${tool.description} Pricing: ${tool.pricing}. Best for: ${tool.targetUser}. ${tool.keyFeature}.`,
  };
}

export default async function ToolPage({ params }: Props) {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) notFound();

  const alternatives = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/tools/directory"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Tools Directory
            </Link>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs text-accent">{tool.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-xl flex-shrink-0">
              {tool.name[0]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {tool.name}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {tool.category} &middot; {tool.pricing}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Key info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Category</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Pricing</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.pricing}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Best For</p>
              <p className="font-semibold text-gray-900 mt-1">{tool.targetUser}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Affiliate Program</p>
              <p className="font-semibold text-gray-900 mt-1">
                {tool.hasAffiliate === true ? "Yes" : tool.hasAffiliate === false ? "No" : "Unknown"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-background rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold text-white mb-3">
              What is {tool.name}?
            </h2>
            <p className="text-muted leading-relaxed mb-4">{tool.description}</p>
            <div className="pt-4 border-t border-card-border">
              <p className="text-xs text-muted mb-1">Key Differentiator</p>
              <p className="text-sm text-white font-medium">{tool.keyFeature}</p>
            </div>
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Alternatives to {tool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.id}
                    href={`/tools/directory/${alt.id}`}
                    className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all"
                  >
                    <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                      {alt.name}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{alt.pricing}</p>
                    <p className="text-xs text-muted mt-2">{alt.description}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
