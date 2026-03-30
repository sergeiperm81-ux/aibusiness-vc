import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Startups — Funding, Launches, and Innovations (2026)",
  description:
    "AI startup news, funding rounds, product launches, and the companies shaping the future of AI. Track the startups that matter.",
};

const featuredStartups = [
  {
    name: "Anthropic",
    description: "AI safety company behind Claude. Raised $3.5B at $61.5B valuation.",
    funding: "$3.5B",
    category: "AI Safety / LLMs",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
  },
  {
    name: "Cursor",
    description: "AI-first code editor. Became the #1 AI coding tool in 2026.",
    funding: "$400M",
    category: "Developer Tools",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80",
  },
  {
    name: "Runway",
    description: "AI video generation platform used by Hollywood studios.",
    funding: "$236M",
    category: "Creative AI",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80",
  },
  {
    name: "Scale AI",
    description: "Data labeling and AI infrastructure for enterprises.",
    funding: "$1.4B",
    category: "AI Infrastructure",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=80",
  },
  {
    name: "Perplexity",
    description: "AI-powered search engine challenging Google.",
    funding: "$500M+",
    category: "AI Search",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80",
  },
  {
    name: "ElevenLabs",
    description: "AI voice synthesis. Powers voiceovers across media and games.",
    funding: "$180M",
    category: "Audio AI",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  },
];

export default function StartupsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-purple-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            AI Startups
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Companies <span className="text-accent">Building the Future</span> of AI
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Funding rounds, product launches, and the startups to watch. Track
            who's raising, who's shipping, and who's changing the game.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Featured AI Startups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredStartups.map((startup) => (
              <div
                key={startup.name}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-500/40 transition-all hover:-translate-y-1"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={startup.image}
                    alt={startup.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                      {startup.category}
                    </span>
                    <span className="text-xs font-mono text-success font-bold">
                      {startup.funding}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-accent transition-colors">
                    {startup.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {startup.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Full AI startup database coming soon — funding tracker, company
              profiles, and investment trends.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
