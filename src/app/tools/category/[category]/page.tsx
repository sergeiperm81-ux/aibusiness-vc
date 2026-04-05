import Link from "next/link";
import type { Metadata } from "next";
import { tools, toolCategories } from "@/data/tools";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCategoryFromSlug(slug: string): string | null {
  return toolCategories.find((c) => slugify(c) === slug) ?? null;
}

export async function generateStaticParams() {
  return toolCategories.map((cat) => ({ category: slugify(cat) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const catName = getCategoryFromSlug(category);
  if (!catName) return { title: "Category Not Found" };
  const catTools = tools.filter((t) => t.category === catName);
  return {
    title: `Best ${catName} AI Tools — ${catTools.length} Tools Reviewed (2026)`,
    description: `Compare the best ${catName.toLowerCase()} AI tools. Pricing, features, and honest reviews of ${catTools.length} tools. Find the right tool for your needs.`,
    keywords: [
      `best ${catName.toLowerCase()} AI tools`,
      `${catName.toLowerCase()} AI software`,
      `AI tools for ${catName.toLowerCase()}`,
    ],
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const catName = getCategoryFromSlug(category);
  if (!catName) notFound();

  const catTools = tools.filter((t) => t.category === catName);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/tools" className="text-muted hover:text-accent transition-colors">
              Tools
            </Link>
            <span className="text-muted">/</span>
            <span className="text-accent">{catName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Best <span className="text-accent">{catName}</span> AI Tools
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            {catTools.length} {catName.toLowerCase()} tools reviewed with honest pricing, features, and use cases.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Pricing comparison table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Tool</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Pricing</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Best For</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Key Feature</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Affiliate</th>
                </tr>
              </thead>
              <tbody>
                {catTools.map((tool, i) => (
                  <tr
                    key={tool.id}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50"}`}
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/tools/directory/${tool.id}`}
                        className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{tool.pricing}</td>
                    <td className="py-3 px-4 text-gray-700">{tool.targetUser}</td>
                    <td className="py-3 px-4 text-gray-700 text-xs">{tool.keyFeature}</td>
                    <td className="py-3 px-4">
                      {tool.hasAffiliate === true ? "✅" : tool.hasAffiliate === false ? "❌" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/directory/${tool.id}`}
                className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                    {tool.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-muted">{tool.pricing}</p>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{tool.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-card-border">
                  <span className="text-[10px] text-muted">For: {tool.targetUser}</span>
                  <span className="text-[11px] font-medium text-accent">Review →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
