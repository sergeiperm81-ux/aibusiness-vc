import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solo — Make Money with AI as an Individual (2026)",
  description:
    "How individuals earn money with AI without forming a company. Freelancing, digital products, content creation, side hustles, and more. Real income data and step-by-step guides.",
};

const methods = [
  {
    title: "AI Freelancing",
    description: "Copywriting, design, video, coding — powered by AI",
    income: "$2K-$25K/mo",
    difficulty: "Beginner",
    time: "1-2 weeks",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
    href: "/solo/ai-freelancing",
  },
  {
    title: "AI Automation Agency",
    description: "Build and sell AI workflows to businesses. Hottest model of 2026",
    income: "$10K-$100K/mo",
    difficulty: "Intermediate",
    time: "1-3 months",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
    href: "/solo/ai-automation-agency",
  },
  {
    title: "AI Digital Products",
    description: "Create once, sell forever: prompts, templates, courses, ebooks",
    income: "$500-$50K/mo",
    difficulty: "Beginner",
    time: "1-4 weeks",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    href: "/solo/ai-digital-products",
  },
  {
    title: "AI Content Creation",
    description: "YouTube, blogs, newsletters monetized with AI tools",
    income: "$500-$80K/mo",
    difficulty: "Beginner",
    time: "3-12 months",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    href: "/solo/ai-content-creation",
  },
  {
    title: "AI SaaS & Agents",
    description: "Build software products powered by AI. Highest ceiling",
    income: "$1K-$500K/mo",
    difficulty: "Advanced",
    time: "2-6 months",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    href: "/solo/ai-saas-agents",
  },
  {
    title: "AI Careers & Jobs",
    description: "Highest-paying AI roles and how to land them",
    income: "$101K-$893K/yr",
    difficulty: "Varies",
    time: "1-6 months",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    href: "/solo/ai-careers",
  },
  {
    title: "Vibe Coding",
    description: "Build and sell micro-tools over a weekend with AI coding assistants",
    income: "$500-$20K/mo",
    difficulty: "Beginner",
    time: "1-4 weeks",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80",
    href: "/solo/vibe-coding",
  },
  {
    title: "AI Art & Print-on-Demand",
    description: "Generate art with Midjourney/DALL-E, sell on Etsy and POD platforms",
    income: "$500-$10K/mo",
    difficulty: "Beginner",
    time: "2-6 weeks",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&q=80",
    href: "/solo/ai-art-pod",
  },
  {
    title: "AI Data Labeling & Training",
    description: "Get paid to train AI models. No experience needed for basics",
    income: "$17-$100/hr",
    difficulty: "Beginner",
    time: "Immediate",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=80",
    href: "/solo/ai-data-labeling",
  },
];

const difficultyColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-400",
  Advanced: "bg-rose-500/10 text-rose-400",
  Varies: "bg-zinc-500/10 text-zinc-400",
};

export default function SoloPage() {
  return (
    <>
      {/* Hero banner — black */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Solo Earners
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Make Money with AI <span className="text-accent">as an Individual</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            No company needed. No employees. Just you and AI. Every method with
            real income numbers, difficulty levels, and time to first dollar.
          </p>
        </div>
      </section>

      {/* Methods grid — white bg, black cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {methods.map((method) => (
              <Link
                key={method.title}
                href={method.href}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={method.image}
                    alt={method.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyColor[method.difficulty]}`}
                    >
                      {method.difficulty}
                    </span>
                    <span className="text-xs font-mono text-success">
                      {method.income}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-2">
                    {method.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-accent">
                      Learn more &rarr;
                    </span>
                    <span className="text-[10px] text-muted">
                      {method.time} to income
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick comparison table — gray bg */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 pr-4 font-bold text-gray-900">Method</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Income</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Difficulty</th>
                  <th className="pb-3 font-bold text-gray-900">Time to Income</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((m) => (
                  <tr
                    key={m.title}
                    className="border-b border-gray-100 hover:bg-white transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={m.href}
                        className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
                      >
                        {m.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-emerald-600 text-xs font-semibold">
                      {m.income}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          m.difficulty === "Beginner"
                            ? "bg-emerald-50 text-emerald-700"
                            : m.difficulty === "Intermediate"
                              ? "bg-amber-50 text-amber-700"
                              : m.difficulty === "Advanced"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {m.difficulty}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{m.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
