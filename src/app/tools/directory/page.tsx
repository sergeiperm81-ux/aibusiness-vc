import type { Metadata } from "next";
import { tools, toolCategories } from "@/data/tools";
import ToolsDirectoryClient from "@/components/ToolsDirectoryClient";

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
            Every AI tool reviewed with honest pricing, use cases, and who it&apos;s
            for. Filter by category to find exactly what you need.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ToolsDirectoryClient tools={tools} categories={toolCategories} />
        </div>
      </section>
    </>
  );
}
