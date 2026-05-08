import Link from "next/link";

type HubKey =
  | "solo"
  | "startups"
  | "b2b"
  | "vc"
  | "government"
  | "learn"
  | "materials";

const HUBS: Array<{ key: HubKey; name: string; href: string; blurb: string }> = [
  {
    key: "solo",
    name: "Solo",
    href: "/solo",
    blurb: "Service offers and income playbooks for one-person operators.",
  },
  {
    key: "startups",
    name: "Startups",
    href: "/startups",
    blurb: "Funding, distribution, and product strategy for AI companies.",
  },
  {
    key: "b2b",
    name: "B2B",
    href: "/b2b",
    blurb: "Enterprise implementation lessons, ROI systems, and rollout risks.",
  },
  {
    key: "vc",
    name: "VC",
    href: "/vc",
    blurb: "Investor frameworks, term-sheet dynamics, and capital pathways.",
  },
  {
    key: "government",
    name: "Gov",
    href: "/government",
    blurb: "Public spending, procurement, regulation, and sovereign AI trends.",
  },
  {
    key: "learn",
    name: "Learn",
    href: "/learn",
    blurb: "Operator skill stacks, career paths, and practical training guides.",
  },
  {
    key: "materials",
    name: "Materials",
    href: "/materials",
    blurb: "Prompt packs, tools, calculators, and execution resources.",
  },
];

export default function SectionHubLinks({ current }: { current: HubKey }) {
  const items = HUBS.filter((hub) => hub.key !== current);

  return (
    <section className="bg-white border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">
          Explore All Sections
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Build context across the full AI money stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((hub) => (
            <Link
              key={hub.key}
              href={hub.href}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:border-accent/50 hover:bg-amber-50/40 transition-colors"
            >
              <p className="text-sm font-bold text-gray-900">{hub.name}</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{hub.blurb}</p>
              <span className="text-[11px] font-semibold text-accent mt-2 inline-block">
                Open section &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
