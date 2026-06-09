import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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

const EDUCATION = [
  "PhD in Political Science — Moscow State University (2014)",
  "MA in Political Science — Moscow School of Social & Economic Sciences, validated by the University of Manchester (2004)",
  "Specialist in Political Science — Perm State University (2003)",
];

const PUBLICATIONS = [
  "“E-Government: Administrative and Civic Practices in Contemporary Russia” — PhD dissertation, Political Science (2014)",
  "“Open Government: Theoretical Model and Russian Practice” — Political Science Yearbook 2014, Russian Association of Political Science (2014)",
  "“Problems of Introducing ICT into Public Administration in Russia: Is E-Government Retiring?” — Ars Administrandi, No. 1 (2014)",
  "“Crowdsourcing: Administrative, Political and Civic Practices in Contemporary Russia” — Bulletin of Perm State University, Political Science, No. 4 (2013)",
  "“The State on the Net: New Institutions of Communication” — Vlast (Power), No. 11 (2012)",
  "“Government and NGOs: New Forms of Cooperation in Poland and Russia” (2013)",
  "“Monitoring the Quality and Accessibility of State and Municipal Services” — co-authored, HSE Publishing House (2011)",
  "“All-Russian Monitoring of the Introduction of Administrative Regulations” — HSE, Moscow (2010)",
];

const PROGRAMS = [
  "2005 — Berlin, Germany — Action Reconciliation Service for Peace (ASF)",
  "2005 — Sofia, Bulgaria — Centre for Liberal Strategies & Institute for Regional and International Studies",
  "2007 — Strasbourg, France — Summer University of Democracy, Council of Europe",
  "2012 — Washington & St. Louis, USA — “Open World” programme",
  "2012 — Warsaw, Poland — Training Program for Russian Policy and Opinion Makers",
  "2014 — Segovia, Spain — Municipal Governance and Territorial Development in Spain",
  "2014 — Oxford, UK — British Culture, Institutions and English Language",
  "2015 — Washington, USA — Experience of Open Government and Public Oversight Practices",
  "2015 — Washington, USA — Promoting Public Citizenship in the 21st Century",
  "2016 — Washington & New York, USA — Best Practices of Supporting Social Entrepreneurship",
  "2016 — Zagreb, Croatia — Eurolab Workshop: European Practices of Social Entrepreneurship",
  "2017 — London, UK — Young Leaders Programme, John Smith Trust",
  "2017 — Paris, France — Global Social Business Summit",
  "2017 — Berlin, Germany — “In Search of Lost Universalism”, Moscow School of Civic Education",
  "2018 — Oslo, Norway — Public Oversight in the Management of Natural Resources",
  "2018 — Paris, France — Role of Administrations and Civil Society Organisations in France",
  "2018 — Taipei, Taiwan — Social entrepreneurship seminars, National Taiwan University",
  "2019 — Riga, Latvia — Civic Education for a Society of Citizens (three seminars)",
  "2019 — Berlin, Germany — “In Search of Lost Universalism”",
  "2024 — Tbilisi, Georgia — John Smith Trust alumni meeting",
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

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Who&rsquo;s behind it</h2>
          <div className="not-prose text-sm leading-relaxed text-gray-700">
            <Image
              src="/images/sergei-ponomarev.jpg"
              alt="Sergei Ponomarev, founder of AI Business"
              width={180}
              height={194}
              className="float-left mr-5 mb-2 rounded-xl border border-gray-200 w-[140px] sm:w-[180px] h-auto"
            />
              <p className="mb-3">
                AI Business was founded and is led by <strong>Sergei Ponomarev</strong>, who writes
                and edits across the site.
              </p>
              <p className="mb-3">
                For more than 20 years I&rsquo;ve studied how digital services actually get built and
                adopted inside government. In 2014 I defended a PhD in Political Science at Moscow
                State University on the implementation of e-government in Russia, completed a
                fellowship on government openness at the Kennan Institute in Washington, D.C., and
                taught for 14 years as a university lecturer. For seven of those years I ran applied
                research at a public-policy center — leading nationwide monitoring of state and
                municipal services, running independent evaluations and &ldquo;mystery shopping&rdquo;
                to find where citizens actually get stuck, authoring the Information Openness Standard
                for the Perm City Duma, and commenting as an expert in print, on radio, and on TV. I
                then served 5 years as an aide to a municipal deputy and spent 4 years training
                entrepreneurs. Along the way I worked across social entrepreneurship and impact
                investing. For the last year and a half I&rsquo;ve been building software and AI
                agents hands-on.
              </p>
              <p>
                AI Business is where those two worlds meet — two decades of understanding how
                institutions really adopt technology, pointed at the question everyone now asks:{" "}
                <em>where does AI create real value?</em>{" "}
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-700"
                >
                  Connect on LinkedIn
                </a>
                .
              </p>
          </div>
          <div className="clear-both" />

          <h3 className="text-base font-bold text-gray-900 mt-8 mb-2">Education</h3>
          <ul className="not-prose space-y-1.5">
            {EDUCATION.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>

          <details className="not-prose mt-6">
            <summary className="cursor-pointer text-sm font-bold text-gray-900 hover:text-amber-700">
              Selected publications
            </summary>
            <ul className="mt-3 space-y-2">
              {PUBLICATIONS.map((item) => (
                <li key={item} className="text-sm text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </details>

          <details className="not-prose mt-4">
            <summary className="cursor-pointer text-sm font-bold text-gray-900 hover:text-amber-700">
              International programs &amp; fellowships
            </summary>
            <ul className="mt-3 space-y-1.5">
              {PROGRAMS.map((item) => (
                <li key={item} className="text-sm text-gray-600 leading-relaxed">{item}</li>
              ))}
            </ul>
          </details>

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
        image: "https://aibusiness.vc/images/sergei-ponomarev.jpg",
        description:
          "Founder of AI Business. PhD in Political Science (Moscow State University, 2014) specializing in e-government; 20+ years across public-administration analytics, university teaching, and AI development.",
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
