import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best AI Tools for Making Money (2026) — Honest Reviews",
  description:
    "Honest reviews of the best AI tools for earning money. Every tool tested with ROI analysis, pricing breakdowns, and real use cases. From writing to automation to video.",
};

const toolCategories = [
  {
    name: "AI Writing & Content",
    tools: [
      { name: "Jasper AI", price: "From $49/mo", rating: "4.5/5", href: "/tools/jasper" },
      { name: "Copy.ai", price: "Free — $49/mo", rating: "4.3/5", href: "/tools/copy-ai" },
      { name: "Writesonic", price: "Free — $19/mo", rating: "4.2/5", href: "/tools/writesonic" },
      { name: "Surfer SEO", price: "From $89/mo", rating: "4.6/5", href: "/tools/surfer-seo" },
    ],
  },
  {
    name: "AI Video & Audio",
    tools: [
      { name: "Synthesia", price: "From $29/mo", rating: "4.5/5", href: "/tools/synthesia" },
      { name: "HeyGen", price: "Free — $29/mo", rating: "4.4/5", href: "/tools/heygen" },
      { name: "ElevenLabs", price: "Free — $11/mo", rating: "4.7/5", href: "/tools/elevenlabs" },
      { name: "Descript", price: "Free — $24/mo", rating: "4.5/5", href: "/tools/descript" },
    ],
  },
  {
    name: "AI Automation",
    tools: [
      { name: "Make.com", price: "Free — $9/mo", rating: "4.7/5", href: "/tools/make" },
      { name: "Zapier", price: "Free — $29.99/mo", rating: "4.5/5", href: "/tools/zapier" },
      { name: "n8n", price: "Free (self-host)", rating: "4.6/5", href: "/tools/n8n" },
      { name: "Botpress", price: "Free — usage", rating: "4.3/5", href: "/tools/botpress" },
    ],
  },
  {
    name: "AI Marketing & SEO",
    tools: [
      { name: "Semrush", price: "From $139.95/mo", rating: "4.8/5", href: "/tools/semrush" },
      { name: "HubSpot", price: "Free — $800+/mo", rating: "4.5/5", href: "/tools/hubspot" },
      { name: "Frase", price: "From $15/mo", rating: "4.4/5", href: "/tools/frase" },
    ],
  },
  {
    name: "AI Productivity",
    tools: [
      { name: "Notion AI", price: "From $10/mo", rating: "4.6/5", href: "/tools/notion-ai" },
      { name: "Otter.ai", price: "Free — $16.99/mo", rating: "4.4/5", href: "/tools/otter" },
      { name: "Speechify", price: "Free — $11.58/mo", rating: "4.3/5", href: "/tools/speechify" },
    ],
  },
  {
    name: "AI Coding",
    tools: [
      { name: "Cursor", price: "Free — $20/mo", rating: "4.8/5", href: "/tools/cursor" },
      { name: "GitHub Copilot", price: "From $10/mo", rating: "4.6/5", href: "/tools/github-copilot" },
      { name: "Bolt.new", price: "Free — $20/mo", rating: "4.4/5", href: "/tools/bolt" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Best AI Tools for Making Money
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Every tool tested and reviewed with honest ROI analysis. We show you
          exactly how each tool helps you earn, what it costs, and whether it is
          worth the investment.
        </p>
      </div>

      <div className="space-y-12">
        {toolCategories.map((category) => (
          <div key={category.name}>
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group border border-card-border rounded-lg p-5 hover:border-accent/50 transition-all hover:bg-card-bg"
                >
                  <div className="w-10 h-10 rounded-lg bg-card-bg border border-card-border mb-3 flex items-center justify-center text-accent font-bold">
                    {tool.name[0]}
                  </div>
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted mt-1">{tool.price}</p>
                  <p className="text-xs text-accent mt-1">{tool.rating}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
