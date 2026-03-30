import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B — AI Implementation for Businesses (2026)",
  description:
    "How businesses implement AI successfully (and unsuccessfully). Case studies, ROI analysis, implementation guides, and lessons from real AI deployments.",
};

const caseStudies = [
  {
    title: "Marketing Agency Cuts Costs 40% with AI Automation",
    result: "-40% costs",
    industry: "Marketing",
    badgeColor: "bg-blue-500 text-white",
    description:
      "A 15-person digital marketing agency replaced manual reporting, content drafts, and ad optimization with AI. Revenue per employee doubled.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80",
  },
  {
    title: "E-Commerce Brand Automates Customer Support with AI",
    result: "3x faster",
    industry: "E-Commerce",
    badgeColor: "bg-blue-500 text-white",
    description:
      "An online retailer deployed AI chatbots that handle 70% of support tickets automatically. Response time dropped from 4 hours to 12 minutes.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80",
  },
  {
    title: "Law Firm Saves 200 Hours/Month on Document Review",
    result: "200 hrs saved",
    industry: "Legal",
    badgeColor: "bg-blue-500 text-white",
    description:
      "A mid-size law firm uses AI for contract review and legal research. Associates focus on strategy instead of document scanning.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
  },
];

export default function B2BPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p className="text-blue-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            B2B
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI for Business — <span className="text-accent">What Works</span> and What Doesn't
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Real stories of AI implementation in businesses. The wins, the failures,
            ROI analysis, and lessons from companies that did it right (and wrong).
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Implementation Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {caseStudies.map((study) => (
              <div
                key={study.title}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500/40 transition-all hover:-translate-y-1"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${study.badgeColor}`}
                    >
                      {study.industry}
                    </span>
                    <span className="text-sm font-bold text-success">
                      {study.result}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-2">
                    {study.description}
                  </p>
                  <span className="text-[11px] font-medium text-accent">
                    Read case study &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              More B2B case studies and implementation guides coming soon.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
