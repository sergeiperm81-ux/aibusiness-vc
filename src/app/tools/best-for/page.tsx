import Link from "next/link";
import type { Metadata } from "next";
import { professionToolMap, getToolsForProfession } from "@/lib/tool-comparisons";

export const metadata: Metadata = {
  title: "Best AI Tools by Profession — Find Your Perfect Stack (2026)",
  description:
    "Discover the best AI tools for your profession. Writers, developers, marketers, designers, founders, and more. Honest reviews and pricing.",
};

export default function BestForIndexPage() {
  const professions = Object.entries(professionToolMap);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            By Profession
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Best AI Tools <span className="text-accent">for Your Job</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Find the perfect AI tool stack for your profession. We review every tool with pricing,
            ROI analysis, and honest recommendations.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professions.map(([slug, prof]) => {
              const toolCount = getToolsForProfession(slug).length;
              return (
                <Link
                  key={slug}
                  href={`/tools/best-for/${slug}`}
                  className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
                >
                  <h2 className="text-base font-bold text-white group-hover:text-accent transition-colors mb-2">
                    {prof.title}
                  </h2>
                  <p className="text-xs text-muted leading-relaxed mb-3">{prof.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-card-border">
                    <span className="text-emerald-400 font-mono text-xs">{toolCount} tools</span>
                    <span className="text-[11px] font-medium text-accent">
                      View Tools →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
