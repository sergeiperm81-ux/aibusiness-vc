import Link from "next/link";
import type { Metadata } from "next";
import { getAllToolComparisons } from "@/lib/tool-comparisons";

export const metadata: Metadata = {
  title: "AI Tool Comparisons — Side-by-Side Reviews (2026)",
  description:
    "Compare AI tools head-to-head. Pricing, features, and which tool is better for your use case. Updated 2026.",
};

export default function ToolComparisonsPage() {
  const comparisons = getAllToolComparisons();

  const byCategory = new Map<string, typeof comparisons>();
  for (const comp of comparisons) {
    const cat = comp.toolA.category;
    const list = byCategory.get(cat) ?? [];
    list.push(comp);
    byCategory.set(cat, list);
  }

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Head-to-Head
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Tool Comparisons <span className="text-accent">2026</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            {comparisons.length} side-by-side comparisons of AI tools. Find the best tool for your
            specific use case and budget.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {[...byCategory.entries()].map(([cat, comps]) => (
            <div key={cat} className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                {cat}
                <span className="text-xs font-normal text-gray-400 ml-2">
                  {comps.length} comparisons
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {comps.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/tools/compare/${comp.slug}`}
                    className="group flex items-center justify-between bg-background rounded-lg p-3 hover:ring-2 hover:ring-accent/40 transition-all"
                  >
                    <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                      {comp.toolA.name}
                    </span>
                    <span className="text-accent text-xs font-bold px-2">vs</span>
                    <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                      {comp.toolB.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
