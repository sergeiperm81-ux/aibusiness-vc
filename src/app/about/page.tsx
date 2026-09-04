import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { GUIDES } from "@/app/library/guides";

const LINKEDIN_URL = "https://www.linkedin.com/in/sergei-ponomarev/";

export const metadata: Metadata = {
  title: "About AI Business",
  description:
    "AI Business is an independent, outcome-first guide to the business of artificial intelligence, founded by Sergei Ponomarev. Real numbers, honest ROI, no hype.",
  alternates: {
    canonical: "/about",
  },
};

const COVERS: Array<[string, string, string]> = [
  ["Solo", "/solo", "AI for independent operators — services, productized offers, and lean systems."],
  ["Startups", "/startups", "Funding, go-to-market, and the economics of building AI products."],
  ["B2B", "/b2b", "Enterprise implementation — cost savings, ROI, and what actually works."],
  ["VC", "/vc", "How capital moves in AI: funds, rounds, valuations, and returns."],
  ["Government", "/government", "Public spending, procurement, regulation, and sovereign AI."],
  ["Robots", "/robots", "The economics of physical AI — costs, supply chains, and opportunities."],
  ["Society", "/society", "How AI reshapes jobs, education, and daily life — beyond the hype."],
  ["Learn", "/learn", "AI skills, careers, and the certifications that map to real salaries."],
  ["Tools & Models", "/tools", "Model launches, real pricing and hand-written comparisons, plus an LLM model leaderboard."],
];

const LIBRARY_ITEMS: Array<[string, string, string, string]> = [
  [
    "/library/ai-through-the-customers-eyes",
    "Your Company's AI Through the Customer's Eyes",
    "For entrepreneurs",
    "the five requests of your most demanding customer, with worked samples of all three documents.",
  ],
  [
    "/library/demand-the-ai-receipt",
    "Demand the AI Receipt",
    "For consumers",
    "the companion guide — what to demand from corporate AI, with a ready-to-send message per chapter.",
  ],
  [
    "/library/start-with-your-services",
    "Start with Your Services",
    "For leaders",
    "a 7-step playbook for adopting AI in business, nonprofits, and public institutions.",
  ],
  [
    "/library/ai-transparency-kit",
    "AI Transparency Kit",
    "Templates",
    "editable materials for telling customers about your AI — EU AI Act disclosure done the caring way.",
  ],
  [
    "/library/consumer-control-of-ai",
    "Consumer Control of AI",
    "Method",
    "how ordinary people can judge the quality of any AI service, with an assessment card.",
  ],
];

const SERVICES: Array<[string, string, string]> = [
  [
    "/service-check",
    "AI Service Check",
    "An independent test purchase of your customer-facing AI agent: does it keep the promises your company published, and does its own account of the conversation match what your system recorded? Findings come with verbatim quotes, a ranked fix list and a re-check.",
  ],
  [
    "/audit",
    "AI Visibility Audit",
    "A report on how ChatGPT and AI search engines read and cite your website (GEO), measured live on your domain.",
  ],
  [
    "/submit-your-story",
    "Submit Your Story",
    "A free written interview for companies building with AI, published under our masthead with an editorial check.",
  ],
];

export default function AboutPage() {
  return (
    <>
      {/* Who we are */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            About
          </p>
          <h1 className="mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            An independent, outcome-first guide to the business of AI
          </h1>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/75">
            <p>
              The goal is simple: cut through the hype and show how AI actually creates
              value — for independent operators, founders, and investors — with real
              numbers and honest ROI.
            </p>
            <p className="text-base text-white/60">
              Most coverage of AI is either breathless hype or a directory of 28,000 tools
              with no view on which ones earn their keep. We take the opposite approach —
              fewer, deeper answers built around a single question: does it work, and is it
              worth it? Every piece is anchored in concrete figures, named companies, and
              usable frameworks rather than speculation.
            </p>
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            What we cover
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COVERS.map(([name, href, desc]) => (
              <Link
                key={name}
                href={href}
                className="group rounded-2xl border border-black/10 bg-[#fafafa] p-6 transition hover:border-amber-400 hover:bg-accent"
              >
                <h3 className="text-lg font-bold text-black">
                  {name}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-black/70 group-hover:text-black/80">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Library */}
      <section className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            The Library: free original guides
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/60">
            Alongside the articles, we publish an author&rsquo;s Library of original
            methods for governing AI from the human side — free, with no email or
            registration required. It currently holds {GUIDES.length} guides, built around
            a three-document system: a public AI Policy, an AI Service Passport, and an AI
            Receipt.
          </p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <ul className="space-y-4">
              {LIBRARY_ITEMS.map(([href, name, who, desc]) => (
                <li key={href} className="flex gap-3 text-base leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <Link href={href} className="font-semibold text-white hover:text-accent">
                      {name}
                    </Link>{" "}
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-accent">
                      {who}
                    </span>
                    <p className="mt-0.5 text-sm text-white/55">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-5">
              <Link
                href="/library"
                className="rounded-2xl bg-accent p-6 transition hover:brightness-95"
              >
                <span className="block text-xl font-bold text-black">
                  Open the library &rarr;
                </span>
                <span className="mt-1 block text-sm text-black/70">
                  Everything published here stays free. No registration.
                </span>
              </Link>
              <Link
                href="/notes"
                className="rounded-2xl bg-accent p-6 transition hover:brightness-95"
              >
                <span className="block text-xl font-bold text-black">
                  Founder&apos;s Notes &rarr;
                </span>
                <span className="mt-1 block text-sm text-black/70">
                  Founder commentary, written by hand: field reports from real AI service
                  tests, and observations on where the money is moving.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="border-b border-black/10 bg-[#ebebed]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            What we offer
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-black/60">
            The methods published in the Library are also available as hands-on services.
            They are run by Sergei Ponomarev personally, not by an agency.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SERVICES.map(([href, name, desc]) => (
              <div key={href} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-black">{name}</h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-black/70">{desc}</p>
                <Link
                  href={href}
                  className="mt-4 inline-block text-sm font-semibold text-amber-600 hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-black/50">
            More services will be added as the methodology develops. Everything published
            in the Library stays free regardless.
          </p>
        </div>
      </section>

      {/* Editorial standards */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Editorial standards
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-7">
              <h3 className="text-lg font-bold text-black">What we hold ourselves to</h3>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                We prioritize verifiable numbers, clearly stated assumptions, and practical
                takeaways. When something is uncertain, we say so. When a tool or strategy
                has a downside, we name it. Commercial services never buy coverage: a
                listing, a story, or a mention is never for sale.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-7">
              <h3 className="text-lg font-bold text-black">How these articles are made</h3>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                Research and first drafts are produced with the help of AI; every article
                is then edited and fact-checked personally by Sergei Ponomarev, who holds
                editorial responsibility for everything published on this site. AI helps
                gather material and draft — the judgment, the checking, and the final word
                are human.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who's behind it */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Who&rsquo;s behind it
          </h2>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <Image
              src="/images/sergei-desk.png"
              alt="Sergei Ponomarev, founder of AI Business"
              width={220}
              height={240}
              className="h-auto w-40 rounded-2xl object-cover sm:w-56"
            />
            <div className="max-w-3xl space-y-4 text-base leading-relaxed text-white/75">
              <p>
                AI Business was founded and is led by{" "}
                <strong className="text-white">Sergei Ponomarev</strong>, who writes and
                edits across the site.
              </p>
              <p>
                For many years I have worked on making services open, clear and
                usable for the people who use them: seven years running nationwide
                monitoring of public services, hundreds of independent quality assessments
                and test purchases, and the Information Openness Standard written for the
                Perm City Duma. For the last year and a half I have been building software
                and AI agents hands-on.
              </p>
              <p>
                AI Business is where those two worlds meet: years of understanding
                how institutions really adopt technology, pointed at the question everyone
                now asks, <em>where does AI create real value?</em>
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/sergei-ponomarev"
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
                >
                  More about my work and method
                </Link>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-card-border px-6 py-3 text-sm font-bold text-white transition hover:border-accent"
                >
                  Connect on LinkedIn
                </a>
              </div>
              <p className="pt-2 text-sm text-white/45">
                Education, academic publications and international programmes are on the{" "}
                <Link
                  href="/sergei-ponomarev"
                  className="font-semibold text-accent hover:underline"
                >
                  personal page
                </Link>
                . Questions or feedback? See our{" "}
                <Link href="/privacy" className="font-semibold text-accent hover:underline">
                  privacy policy
                </Link>{" "}
                or reach out via LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutSchema />
    </>
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
        url: "https://aibusiness.vc/sergei-ponomarev",
        image: "https://aibusiness.vc/images/sergei-desk.png",
        description:
          "Founder of AI Business. PhD in Political Science specializing in e-government; a career across public-administration analytics, university teaching, and AI development.",
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Moscow State University" },
          { "@type": "CollegeOrUniversity", name: "University of Manchester" },
          { "@type": "CollegeOrUniversity", name: "Perm State University" },
        ],
        knowsAbout: [
          "Artificial Intelligence",
          "AI ROI",
          "E-Government",
          "Public Administration",
          "Digital Transformation",
        ],
        sameAs: [LINKEDIN_URL, "https://aibusiness.vc/sergei-ponomarev"],
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
