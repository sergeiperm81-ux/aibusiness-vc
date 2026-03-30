import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solo — Make Money with AI as an Individual",
  description:
    "How individuals earn money with AI without forming a company. Freelancing, digital products, content creation, side hustles, and more. Real income data and step-by-step guides.",
};

const methods = [
  {
    title: "AI Freelancing",
    description: "Copywriting, design, video, coding — powered by AI",
    income: "$2K-$25K/mo",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
    href: "/solo/ai-freelancing",
  },
  {
    title: "AI Automation Agency",
    description: "Build and sell AI workflows to businesses. Hottest model of 2026",
    income: "$10K-$100K/mo",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
    href: "/solo/ai-automation-agency",
  },
  {
    title: "AI Digital Products",
    description: "Create once, sell forever: prompts, templates, courses",
    income: "$500-$50K/mo",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    href: "/solo/ai-digital-products",
  },
  {
    title: "AI Content Creation",
    description: "YouTube, blogs, newsletters monetized with AI tools",
    income: "$500-$80K/mo",
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    href: "/solo/ai-content-creation",
  },
  {
    title: "AI Agents & SaaS",
    description: "Build software products and sell them. Highest ceiling",
    income: "$1K-$500K/mo",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    href: "/solo/ai-saas-agents",
  },
  {
    title: "AI Careers & Jobs",
    description: "Highest-paying AI roles and how to land them",
    income: "$101K-$893K/yr",
    difficulty: "Varies",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    href: "/solo/ai-careers",
  },
];

export default function SoloPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-3">
          Solo: Make Money with AI as an Individual
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          No company needed. No employees. Just you and AI. From side hustles
          to full-time income — every method with real numbers and honest
          timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => (
          <Link
            key={method.title}
            href={method.href}
            className="group bg-white border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-all"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={method.image}
                alt={method.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    method.difficulty === "Beginner"
                      ? "bg-green-50 text-green-700"
                      : method.difficulty === "Intermediate"
                        ? "bg-amber-50 text-amber-700"
                        : method.difficulty === "Advanced"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {method.difficulty}
                </span>
                <span className="text-sm font-mono text-success font-medium">
                  {method.income}
                </span>
              </div>
              <h3 className="font-semibold text-heading mb-1 group-hover:text-accent transition-colors">
                {method.title}
              </h3>
              <p className="text-sm text-muted">{method.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
