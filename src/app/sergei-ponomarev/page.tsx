import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GUIDES } from "@/app/library/guides";
import { ContactEmail } from "@/components/ContactEmail";

/**
 * The personal page: who I am, what I have made, how I work, what I offer.
 *
 * No CV-style experience section and no duplicated capability lists: the hero
 * says who I am, Selected work points at the published guides, and one
 * services block says what can be commissioned. Long reference lists sit in
 * native details elements, so they are in the HTML for crawlers but folded
 * away for readers.
 */

const SITE = "https://aibusiness.vc";
const LINKEDIN = "https://www.linkedin.com/in/sergei-ponomarev/";
const REPO = "https://github.com/neomundi-io/use-case-aibusiness-runtime-conformity";

/**
 * The vocabulary this page should be findable by.
 *
 * People and assistants ask for the same work in a dozen ways: test purchase,
 * mystery shopping, chatbot testing, agent evaluation, conformity check. Most
 * appear in the visible text; the rest live here so a crawler matching on
 * wording still lands on the right person.
 */
const SEMANTIC_CORE = [
  "AI implementation methodologist",
  "AI adoption methodology",
  "AI agent testing",
  "AI agent test purchase",
  "chatbot testing service",
  "chatbot audit",
  "conversational AI testing",
  "AI mystery shopping",
  "mystery shopping for chatbots",
  "customer service AI testing",
  "LLM agent evaluation",
  "AI agent quality assurance",
  "AI agent verification",
  "independent AI testing",
  "third-party AI assessment",
  "AI conformity check",
  "AI service standard",
  "AI service passport",
  "AI receipt",
  "AI governance audit",
  "AI compliance testing",
  "EU AI Act Article 50 transparency check",
  "AI vendor due diligence",
  "AI supplier control",
  "chatbot acceptance testing",
  "AI integrator acceptance",
  "runtime conformity testing",
  "AI behaviour measurement",
  "consumer AI assurance",
  "AI complaint investigation",
  "AI drift monitoring",
  "monitoring and evaluation framework",
  "service quality standard",
  "independent evaluation",
  "AI agent development",
];

export const metadata: Metadata = {
  title: "Sergei Ponomarev, PhD: Methodologist of Technology Adoption",
  description:
    "A career on one question: how a new technology actually gets adopted inside an organisation. E-government, nationwide service monitoring, and now AI agents built and tested hands-on.",
  authors: [{ name: "Sergei Ponomarev", url: `${SITE}/sergei-ponomarev` }],
  creator: "Sergei Ponomarev",
  keywords: SEMANTIC_CORE,
  alternates: { canonical: "/sergei-ponomarev" },
  openGraph: {
    type: "profile",
    url: `${SITE}/sergei-ponomarev`,
    siteName: "AI Business",
    title: "Sergei Ponomarev, PhD: Methodologist of Technology Adoption",
    description:
      "How a new technology actually gets adopted inside an organisation, not on paper but in practice. Seven years of standards, evaluation and field auditing, now applied to AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sergei Ponomarev, PhD",
    description:
      "Methodologist of technology adoption. Standards, evaluation and independent assessment, now applied to AI agents.",
  },
};

/**
 * The pieces shown under "Selected work".
 *
 * Listing every guide made the heading untrue: the full set already sits one
 * click away behind the library button next to it.
 */
const SELECTED_SLUGS = [
  "ai-agent-test-purchase",
  "ai-through-the-customers-eyes",
  "demand-the-ai-receipt",
];

const HOW_I_WORK = [
  {
    title: "I start from the decision, not the tool",
    body: "Every engagement is designed backwards from what you need to decide. There is no standard package: scope, timing and terms are agreed case by case, and I adapt to how your organisation actually works.",
  },
  {
    title: "You deal with me directly",
    body: "The person who designs the work does it and writes the report. That is the advantage of a practitioner over an agency, and the limit of one too.",
  },
  {
    title: "Every claim carries its evidence",
    body: "Findings are quoted verbatim and reconciled against records. Nothing rests on an impression, and uncomfortable results are presented in a form you can act on.",
  },
  {
    title: "The limits are stated, not hidden",
    body: "Where a method cannot answer a question, the report says so. A conclusion is worth exactly as much as what stands behind it.",
  },
];

const SERVICES = [
  {
    title: "Test purchases of AI agents",
    body: "An independent check of whether your customer-facing agent keeps the promises your company published, with verbatim evidence and a fix list.",
    href: "/service-check",
    cta: "How the test works",
  },
  {
    title: "AI agents and workflows, built",
    body: "Hands-on development of agents, automation and agentic pipelines, and the testing that confirms they behave.",
  },
  {
    title: "Standards and implementation methodology",
    body: "The documents an organisation needs to adopt AI in a measurable way: a public AI Policy, a service passport per service, and a receipt per interaction.",
  },
  {
    title: "Monitoring and evaluation",
    body: "Frameworks for measuring whether a programme or a service does what it was meant to do, carried over from seven years of public-service monitoring.",
  },
  {
    title: "Research and independent assessment",
    body: "Comparative studies, field research and evaluations for companies, universities, consumer bodies and the social sector.",
  },
  {
    title: "AI visibility audit",
    body: "How AI search engines read and cite a website, measured across eight signals with the fixes in priority order.",
    href: "/audit",
    cta: "Run a scan",
  },
];

const EDUCATION = [
  "PhD in Political Science, Lomonosov Moscow State University. Dissertation on e-government and technology adoption in public administration.",
  "MA in Political Science, Moscow School of Social and Economic Sciences, validated by the University of Manchester.",
  "Specialist in Political Science, Perm State University.",
  "Fellowship on government openness, Kennan Institute, Washington, D.C.",
];

const PUBLICATIONS = [
  "“Monitoring the Quality and Accessibility of State and Municipal Services”, co-authored, HSE Publishing House",
  "“All-Russian Monitoring of the Introduction of Administrative Regulations”, HSE, Moscow",
  "“E-Government: Administrative and Civic Practices in Contemporary Russia”, PhD dissertation",
  "“Open Government: Theoretical Model and Russian Practice”, Political Science Yearbook, Russian Association of Political Science",
  "“Problems of Introducing ICT into Public Administration in Russia: Is E-Government Retiring?”, Ars Administrandi",
  "“Crowdsourcing: Administrative, Political and Civic Practices in Contemporary Russia”, Bulletin of Perm State University",
  "“The State on the Net: New Institutions of Communication”, Vlast (Power)",
  "“Government and NGOs: New Forms of Cooperation in Poland and Russia”",
];

const PROGRAMS = [
  "United States, Open World programme and open-government study visits, Washington, St. Louis and New York",
  "United Kingdom, John Smith Trust Young Leaders Programme, London; and Oxford",
  "Council of Europe, Summer University of Democracy, Strasbourg",
  "France, Global Social Business Summit and public administration programmes, Paris",
  "Germany, Action Reconciliation Service for Peace and Moscow School of Civic Education, Berlin",
  "Taiwan, social entrepreneurship seminars, National Taiwan University, Taipei",
  "Norway, public oversight in the management of natural resources, Oslo",
  "Spain, municipal governance and territorial development, Segovia",
  "Croatia, European practices of social entrepreneurship, Zagreb",
  "Poland, training programme for policy and opinion makers, Warsaw",
  "Latvia, civic education seminars, Riga",
  "Bulgaria, Centre for Liberal Strategies, Sofia",
  "Georgia, John Smith Trust alumni meeting, Tbilisi",
];

function profileSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE}/sergei-ponomarev`,
    mainEntity: {
      "@type": "Person",
      name: "Sergei Ponomarev",
      honorificSuffix: "PhD",
      url: `${SITE}/sergei-ponomarev`,
      image: `${SITE}/images/sergei-desk.png`,
      jobTitle: "Methodologist of technology adoption; independent tester of AI agents",
      description:
        "A career on one question: how a new technology actually gets adopted inside an organisation, not on paper but in practice. A PhD on e-government, seven years leading nationwide evaluation of public services with quality standards, independent assessments and test purchases, and now AI agents built and tested hands-on.",
      knowsAbout: SEMANTIC_CORE,
      knowsLanguage: ["Russian", "English"],
      homeLocation: { "@type": "Place", name: "Sveti Vlas, Bulgaria" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Lomonosov Moscow State University" },
        { "@type": "CollegeOrUniversity", name: "Moscow School of Social and Economic Sciences" },
        { "@type": "CollegeOrUniversity", name: "Perm State University" },
      ],
      worksFor: { "@type": "Organization", name: "AI Business", url: SITE },
      affiliation: { "@type": "Organization", name: "NeoMundi", url: "https://neomundi.io" },
      sameAs: [LINKEDIN, `${SITE}/notes`, REPO],
      workExample: {
        "@type": "CreativeWork",
        name: "Reference pilot: runtime conformity and receipt validation",
        url: REPO,
      },
    },
  };
}

export default function SergeiPonomarevPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema()) }}
      />

      {/* Who I am */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <Image
              src="/images/sergei-desk.png"
              alt="Sergei Ponomarev"
              width={630}
              height={449}
              priority
              className="h-56 w-44 rounded-2xl object-cover object-[50%_22%] sm:h-72 sm:w-60"
            />
            <div>
              <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Sergei Ponomarev, PhD
              </h1>
              <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Methodologist of technology adoption
              </p>
              <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/80">
                <p>
                  I am a methodologist. My work has long centred on one
                  question: how a new technology actually gets adopted inside an
                  organisation, not on paper but in practice.
                </p>
                <p className="text-base text-white/65">
                  I defended a PhD on e-government in 2014 and worked at the origins of
                  Russia&apos;s administrative reform: rolling out new digital public
                  services, monitoring how they performed in the field, and building the
                  methods to evaluate them, from quality standards to independent
                  assessments and test purchases. For the past two years I have applied the
                  same discipline to AI, building agents and workflows hands-on.
                </p>
                <p className="text-base text-white/65">
                  The core problem has not changed. A technology arrives, everyone agrees
                  it matters, and then the real work begins: turning it into methods,
                  standards and processes a company can actually use and measure.
                </p>
              </div>
              <p className="mt-5 text-base leading-relaxed text-white/80">
                Partner for methodology and development in Central and Eastern Europe at{" "}
                <a
                  href="https://neomundi.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  NeoMundi
                </a>
                , a Swiss AI metrology company.
              </p>
              <p className="mt-4 text-sm text-white/45">
                Sveti Vlas, Bulgaria &middot; remote, any time zone &middot; Russian and
                English
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
                >
                  What I can do for you
                </a>
                <ContactEmail className="rounded-lg border border-card-border px-6 py-3 text-sm font-bold text-white transition hover:border-accent">
                  Get in touch
                </ContactEmail>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Selected work
              </h2>
              <ul className="space-y-4">
              {SELECTED_SLUGS.map((slug) => GUIDES.find((g) => g.slug === slug))
                .filter((guide): guide is (typeof GUIDES)[number] => Boolean(guide))
                .map((guide) => (
                <li key={guide.slug} className="flex gap-3 text-base leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <div>
                    <Link
                      href={`/library/${guide.slug}`}
                      className="font-semibold text-black hover:text-amber-700"
                    >
                      {guide.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-black/55">{guide.kicker}</p>
                  </div>
                </li>
              ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <Link
                href="/library"
                className="rounded-2xl bg-accent p-6 transition hover:brightness-95"
              >
                <span className="block text-xl font-bold text-black">
                  Details in the library &rarr;
                </span>
                <span className="mt-1 block text-sm text-black/70">
                  Free guides on governing AI from the customer&apos;s side. No
                  registration.
                </span>
              </Link>
              <Link
                href="/notes"
                className="rounded-2xl bg-accent p-6 transition hover:brightness-95"
              >
                <span className="block text-xl font-bold text-black">My blog &rarr;</span>
                <span className="mt-1 block text-sm text-black/70">
                  Commentary and personal observations on AI, written by hand.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What I can do for you
          </h2>
          <p className="mb-8 text-base leading-relaxed text-white/60">
            Some of this is packaged and priced; most of it is agreed case by case.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-card-border bg-card-bg p-6">
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">{s.body}</p>
                {s.href && (
                  <Link
                    href={s.href}
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    {s.cta} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How I work */}
      <section className="border-b border-black/10 bg-[#ebebed]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            How I work
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_I_WORK.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-black">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-black/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials, folded */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Credentials
          </h2>
          <div className="max-w-4xl space-y-3">
            {[
              { title: "Education", items: EDUCATION, note: "" },
              {
                title: "Academic publications",
                items: PUBLICATIONS,
                note: "More than 30 publications in total.",
              },
              {
                title: "International programmes and fellowships",
                items: PROGRAMS,
                note: "Over 20 programmes across 12 countries.",
              },
            ].map((group) => (
              <details
                key={group.title}
                className="rounded-xl border border-black/10 bg-[#fafafa] px-6 py-4"
              >
                <summary className="cursor-pointer text-base font-bold text-black">
                  {group.title}
                </summary>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-black/70"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black/30" />
                      {item}
                    </li>
                  ))}
                </ul>
                {group.note && (
                  <p className="mt-3 text-sm italic text-black/50">{group.note}</p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Get in touch
              </h2>
              <p className="mt-2 text-base leading-relaxed text-white/60">
                Write to{" "}
                <ContactEmail className="font-semibold text-accent hover:underline" />{" "}
                or{" "}
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  connect on LinkedIn
                </a>
                .
              </p>
            </div>
            <Link
              href="/service-check"
              className="shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              Test purchases of AI agents
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
