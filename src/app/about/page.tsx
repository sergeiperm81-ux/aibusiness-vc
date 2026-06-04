import type { Metadata } from "next";
import Link from "next/link";

const LINKEDIN_URL = "https://www.linkedin.com/in/sergei-ponomarev/";

export const metadata: Metadata = {
  title: "About AI Business",
  description:
    "AI Business is an independent, outcome-first guide to the business of artificial intelligence, founded by Sergei Ponomarev. Real numbers, honest ROI, no hype.",
  alternates: {
    canonical: "/about",
  },
};

const COVERS = [
  ["Solo", "AI for independent operators — services, productized offers, and lean systems."],
  ["Startups", "Funding, go-to-market, and the economics of building AI products."],
  ["B2B", "Enterprise implementation — cost savings, ROI, and what actually works."],
  ["VC", "How capital moves in AI: funds, rounds, valuations, and returns."],
  ["Government", "Public spending, procurement, regulation, and sovereign AI."],
  ["Robots", "The economics of physical AI — costs, supply chains, and opportunities."],
  ["Society", "How AI reshapes jobs, education, and daily life — beyond the hype."],
  ["Learn", "AI skills, careers, and the certifications that map to real salaries."],
  ["Tools & Models", "350+ AI tools reviewed against ROI, plus an LLM model leaderboard."],
];

export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">About</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About AI Business</h1>

        <div className="prose prose-gray max-w-none text-gray-700">
          <p className="text-base leading-relaxed">
            <strong>AI Business</strong> is an independent, outcome-first guide to the
            business of artificial intelligence. The goal is simple: cut through the hype and
            show how AI actually creates value — for independent operators, founders, and
            investors — with real numbers and honest ROI.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Why this exists</h2>
          <p className="text-sm leading-relaxed">
            Most coverage of AI is either breathless hype or a directory of 28,000 tools with
            no view on which ones earn their keep. We take the opposite approach — fewer,
            deeper answers built around a single question: does it work, and is it worth it?
            Every piece is anchored in concrete figures, named companies, and usable
            frameworks rather than speculation.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">What we cover</h2>
          <ul className="not-prose space-y-2 mt-3">
            {COVERS.map(([name, desc]) => (
              <li key={name} className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{name}</span> — {desc}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Editorial standards</h2>
          <p className="text-sm leading-relaxed">
            We prioritize verifiable numbers, clearly stated assumptions, and practical
            takeaways. When something is uncertain, we say so. When a tool or strategy has a
            downside, we name it. The site also publishes daily AI-business news and offers a
            free AI-visibility (GEO) audit for any website.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Who&rsquo;s behind it</h2>
          <p className="text-sm leading-relaxed">
            AI Business was founded and is led by <strong>Sergei Ponomarev</strong>, who writes
            and edits across the site. You can connect with him on{" "}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700"
            >
              LinkedIn
            </a>
            .
          </p>

          <p className="text-sm leading-relaxed mt-6 text-gray-500">
            Questions or feedback? See our{" "}
            <Link href="/privacy" className="text-amber-600 hover:underline">
              privacy policy
            </Link>{" "}
            or reach out via LinkedIn.
          </p>
        </div>
      </div>

      <AboutSchema />
    </section>
  );
}

function AboutSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About AI Business",
    url: "https://aibusiness.vc/about",
    mainEntity: {
      "@type": "Organization",
      name: "AI Business",
      url: "https://aibusiness.vc",
      description:
        "Independent, outcome-first guide to the business of artificial intelligence.",
      founder: {
        "@type": "Person",
        name: "Sergei Ponomarev",
        jobTitle: "Founder & Editor",
        url: "https://aibusiness.vc/about",
        sameAs: [LINKEDIN_URL],
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
