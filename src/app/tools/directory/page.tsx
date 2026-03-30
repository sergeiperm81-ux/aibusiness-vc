import Link from "next/link";
import type { Metadata } from "next";
import { tools, toolCategories } from "@/data/tools";

export const metadata: Metadata = {
  title: "AI Tools Directory — Every Tool Reviewed (2026)",
  description:
    "Complete directory of AI tools for making money. Honest reviews, pricing, and use cases for writing, coding, video, automation, marketing, and more.",
};

export default function ToolsDirectoryPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-emerald-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Tools Directory <span className="text-accent">2026</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Every AI tool reviewed with honest pricing, use cases, and who it's
            for. Filter by category to find exactly what you need.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {toolCategories.map((cat) => {
            const catTools = tools.filter((t) => t.category === cat);
            if (catTools.length === 0) return null;
            return (
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
                          <p className="text-[11px] text-muted">
                            {tool.pricing}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-card-border">
                        <span className="text-[10px] text-muted">
                          For: {tool.targetUser}
                        </span>
                        <span className="text-[11px] font-medium text-accent">
                          Review &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
