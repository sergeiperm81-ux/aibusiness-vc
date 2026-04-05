import Link from "next/link";
import type { Metadata } from "next";
import { professionToolMap, getToolsForProfession, getAllProfessionSlugs } from "@/lib/tool-comparisons";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ profession: string }>;
}

export async function generateStaticParams() {
  return getAllProfessionSlugs().map((profession) => ({ profession }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profession } = await params;
  const prof = professionToolMap[profession];
  if (!prof) return { title: "Not Found" };
  return {
    title: `Best AI Tools for ${prof.title} — Top Picks (2026)`,
    description: prof.description + `. Pricing, features, and honest reviews. Updated 2026.`,
    keywords: [
      `best AI tools for ${prof.title.toLowerCase()}`,
      `AI tools ${prof.title.toLowerCase()}`,
      `${prof.title.toLowerCase()} AI software`,
    ],
  };
}

export default async function BestForProfessionPage({ params }: Props) {
  const { profession } = await params;
  const prof = professionToolMap[profession];
  if (!prof) notFound();

  const profTools = getToolsForProfession(profession);

  const byCategory = new Map<string, typeof profTools>();
  for (const tool of profTools) {
    const list = byCategory.get(tool.category) ?? [];
    list.push(tool);
    byCategory.set(tool.category, list);
  }

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <Link href="/tools" className="text-muted hover:text-accent transition-colors">
              Tools
            </Link>
            <span className="text-muted">/</span>
            <Link href="/tools/best-for" className="text-muted hover:text-accent transition-colors">
              Best For
            </Link>
            <span className="text-muted">/</span>
            <span className="text-accent">{prof.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Best AI Tools for <span className="text-accent">{prof.title}</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">{prof.description}.</p>
          <p className="text-xs text-emerald-400 font-mono mt-3">
            {profTools.length} tools reviewed
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {[...byCategory.entries()].map(([cat, catTools]) => (
            <div key={cat} className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                {cat}
              </h2>
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
                      <span className="text-[10px] text-muted">
                        {tool.keyFeature}
                      </span>
                      <span className="text-[11px] font-medium text-accent">
                        Review →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {profTools.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              No tools found for this profession yet. We&apos;re adding more tools every week.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
