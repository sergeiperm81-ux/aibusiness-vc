import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best AI Tools for Making Money (2026) — Honest Reviews",
  description:
    "Honest reviews of the best AI tools for earning money. Every tool tested with ROI analysis, pricing breakdowns, and real use cases.",
};

const toolCategories = [
  {
    name: "Writing & Content",
    color: "bg-amber-500",
    tools: [
      { name: "Jasper AI", price: "From $49/mo", rating: "4.5" },
      { name: "Copy.ai", price: "Free — $49/mo", rating: "4.3" },
      { name: "Writesonic", price: "Free — $19/mo", rating: "4.2" },
      { name: "Surfer SEO", price: "From $89/mo", rating: "4.6" },
    ],
  },
  {
    name: "Video & Audio",
    color: "bg-rose-500",
    tools: [
      { name: "Synthesia", price: "From $29/mo", rating: "4.5" },
      { name: "HeyGen", price: "Free — $29/mo", rating: "4.4" },
      { name: "ElevenLabs", price: "Free — $11/mo", rating: "4.7" },
      { name: "Descript", price: "Free — $24/mo", rating: "4.5" },
    ],
  },
  {
    name: "Automation",
    color: "bg-emerald-500",
    tools: [
      { name: "Make.com", price: "Free — $9/mo", rating: "4.7" },
      { name: "Zapier", price: "Free — $30/mo", rating: "4.5" },
      { name: "n8n", price: "Free (self-host)", rating: "4.6" },
      { name: "Botpress", price: "Free — usage", rating: "4.3" },
    ],
  },
  {
    name: "Marketing & SEO",
    color: "bg-blue-500",
    tools: [
      { name: "Semrush", price: "From $140/mo", rating: "4.8" },
      { name: "Frase", price: "From $15/mo", rating: "4.4" },
      { name: "HubSpot", price: "Free — $800+/mo", rating: "4.5" },
    ],
  },
  {
    name: "Coding",
    color: "bg-purple-500",
    tools: [
      { name: "Cursor", price: "Free — $20/mo", rating: "4.8" },
      { name: "GitHub Copilot", price: "From $10/mo", rating: "4.6" },
      { name: "Bolt.new", price: "Free — $20/mo", rating: "4.4" },
    ],
  },
  {
    name: "Productivity",
    color: "bg-cyan-500",
    tools: [
      { name: "Notion AI", price: "From $10/mo", rating: "4.6" },
      { name: "Otter.ai", price: "Free — $17/mo", rating: "4.4" },
      { name: "Speechify", price: "Free — $12/mo", rating: "4.3" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p className="text-emerald-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Tools
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Best AI Tools <span className="text-accent">for Making Money</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Every tool tested with honest ROI analysis. We show you how each
            tool helps you earn, what it costs, and whether it's worth it.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-10">
            {toolCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <h2 className="text-lg font-bold text-gray-900">
                    {cat.name}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 mb-3 flex items-center justify-center text-accent font-bold text-sm">
                        {tool.name[0]}
                      </div>
                      <h3 className="font-semibold text-white text-sm group-hover:text-accent transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted mt-1">{tool.price}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-accent text-xs">{"★".repeat(Math.round(Number(tool.rating)))}</span>
                        <span className="text-[11px] text-muted">
                          {tool.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
