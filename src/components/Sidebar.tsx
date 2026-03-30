import Link from "next/link";

const popularTopics = [
  { name: "AI Automation Agency", href: "/solo/ai-automation-agency" },
  { name: "AI Side Hustles 2026", href: "/solo/ai-side-hustles" },
  { name: "Best AI Tools", href: "/tools" },
  { name: "AI Agents Business", href: "/solo/ai-agents" },
  { name: "Vibe Coding", href: "/solo/vibe-coding" },
  { name: "AI Freelancing", href: "/solo/ai-freelancing" },
];

const trendingTools = [
  { name: "Cursor", category: "Coding", href: "/tools/cursor" },
  { name: "Make.com", category: "Automation", href: "/tools/make" },
  { name: "Claude", category: "AI Assistant", href: "/tools/claude" },
  { name: "Semrush", category: "SEO", href: "/tools/semrush" },
];

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <NewsletterWidget />
      <PopularTopics />
      <TrendingTools />
    </aside>
  );
}

function NewsletterWidget() {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
      <h3 className="font-semibold text-heading text-sm mb-2">
        AI Money Newsletter
      </h3>
      <p className="text-xs text-muted mb-3 leading-relaxed">
        Weekly digest: new tools, earning strategies, and real income reports.
      </p>
      <input
        type="email"
        placeholder="you@email.com"
        className="w-full px-3 py-2 text-sm bg-white border border-card-border rounded-md mb-2 focus:outline-none focus:border-accent"
      />
      <button
        type="button"
        className="w-full px-3 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
      >
        Subscribe Free
      </button>
    </div>
  );
}

function PopularTopics() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-heading text-sm mb-3">
        Popular Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {popularTopics.map((topic) => (
          <Link
            key={topic.name}
            href={topic.href}
            className="text-xs px-2.5 py-1 bg-surface text-muted rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
          >
            {topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrendingTools() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-5">
      <h3 className="font-semibold text-heading text-sm mb-3">
        Trending Tools
      </h3>
      <div className="space-y-3">
        {trendingTools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-accent text-xs font-bold shrink-0">
              {tool.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-heading group-hover:text-accent transition-colors">
                {tool.name}
              </p>
              <p className="text-xs text-muted">{tool.category}</p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/tools"
        className="block mt-3 text-xs text-accent hover:text-accent-hover font-medium"
      >
        All tools &rarr;
      </Link>
    </div>
  );
}
