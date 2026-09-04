import type { Metadata } from "next";
import Link from "next/link";
import { models } from "@/data/models";

export const metadata: Metadata = {
  title: "AI Business Benchmarks — Our Own Data on Models, Money and Service Quality",
  description:
    "Original benchmarks from AI Business: the LLM leaderboard, the AI revenue leaderboard, and independent tests of customer-facing AI. Data we produce, not market commentary we repeat.",
  alternates: { canonical: "/benchmarks" },
};

type Benchmark = {
  href: string | null;
  kicker: string;
  title: string;
  blurb: string;
  stat: string;
  statLabel: string;
  status: "live" | "building";
};

function buildBenchmarks(): Benchmark[] {
  const modelCount = models.length;

  return [
    {
      href: "/models",
      kicker: "Models",
      title: "LLM Leaderboard",
      blurb:
        "Every frontier and open-weight model that matters, compared on price per million tokens, context window, and public ELO where it exists. Updated as models ship, not once a quarter.",
      stat: String(modelCount),
      statLabel: "models tracked",
      status: "live",
    },
    {
      href: "/startups/ai-revenue-leaderboard",
      kicker: "Money",
      title: "AI Revenue Leaderboard",
      blurb:
        "Who actually earns money in AI, ranked by run-rate revenue, valuation and revenue per employee — with the accounting caveats that make the numbers honest, and corrections when the press gets it wrong.",
      stat: "$47B",
      statLabel: "current revenue leader",
      status: "live",
    },
    {
      href: "/service-check",
      kicker: "Service quality",
      title: "AI Service Check",
      blurb:
        "Mystery shopping for customer-facing AI: ten real situations per bot, checked against the company's own published rules, with a quote as evidence for every finding.",
      stat: "10",
      statLabel: "situations per test",
      status: "live",
    },
    {
      href: null,
      kicker: "In progress",
      title: "AI Receptionist Test",
      blurb:
        "Independent test calls to the AI receptionists small businesses actually buy. Does it quote the right price, book the appointment, admit it's AI, and hand you to a human when it can't help?",
      stat: "5–10",
      statLabel: "services under test",
      status: "building",
    },
    {
      href: "/audit",
      kicker: "Visibility",
      title: "AI Visibility Benchmark",
      blurb:
        "How AI search engines read a website: llms.txt quality, crawler access, schema, citation readiness. Run it on your own domain and get the scoreboard by email.",
      stat: "8",
      statLabel: "signals scored",
      status: "live",
    },
  ];
}

export default function BenchmarksPage() {
  const benchmarks = buildBenchmarks();

  return (
    <>
      {/* Black header */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Benchmarks
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Our own data — not the market&apos;s press releases
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            Most AI coverage repeats what companies say about themselves. These are the numbers we
            produce and maintain ourselves: what models cost, who actually earns money, and whether
            customer-facing AI does what it promises. Free to read, free to cite — attribution is
            all we ask.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
        </div>
      </section>

      {/* White body */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {benchmarks.map((b) => {
              const card = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-600">
                      {b.kicker}
                    </p>
                    {b.status === "building" && (
                      <span className="rounded bg-gray-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        In progress
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">{b.title}</h2>
                  <p className="mt-2 flex-1 text-base leading-relaxed text-gray-600">{b.blurb}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-950">{b.stat}</span>
                    <span className="text-sm text-gray-500">{b.statLabel}</span>
                  </div>
                  {b.href && (
                    <span className="mt-3 inline-block text-base font-semibold text-amber-600">
                      Open benchmark &rarr;
                    </span>
                  )}
                </>
              );

              return b.href ? (
                <Link
                  key={b.title}
                  href={b.href}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={b.title}
                  className="flex flex-col rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6"
                >
                  {card}
                </div>
              );
            })}
          </div>

          {/* Why */}
          <div className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">Why we publish benchmarks</h2>
            <p className="mt-3 text-base leading-relaxed text-gray-700">
              Every company will tell you its AI is fast, accurate and helpful. Almost nobody checks
              from the outside. The method behind these benchmarks comes from seven years of
              independent service assessment — nationwide monitoring, quality standards and mystery
              shopping — now pointed at AI.{" "}
              <Link href="/about" className="font-semibold text-amber-600 hover:underline">
                More about the author &rarr;
              </Link>
            </p>
            <p className="mt-3 text-base leading-relaxed text-gray-700">
              If you want the methods themselves rather than the results, they are free in the{" "}
              <Link href="/library" className="font-semibold text-amber-600 hover:underline">
                Library
              </Link>{" "}
              — no email, no registration.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
