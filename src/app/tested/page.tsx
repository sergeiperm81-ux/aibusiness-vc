import type { Metadata } from "next";
import Link from "next/link";
import {
  TESTED_ENTRIES,
  TESTED_STATS,
  entryStatus,
} from "@/data/tested-registry";

export const metadata: Metadata = {
  title: "Tested: Registry of Verified Test Purchases",
  description:
    "The public registry of AI services under independent test purchase: which services are checked, since when, and when each was last verified. Findings stay with the company; the registry records the fact of the check.",
  alternates: { canonical: "/tested" },
};

/**
 * The registry answers one question: is this service actually being checked,
 * and how recently. Findings are never published — they belong to the company
 * that paid for them — so there is no scoreboard here and no ranking. A company
 * that stops its monitoring moves to the archive with the date of its last
 * check, which is itself honest information for a reader.
 */
export default function TestedRegistryPage() {
  const now = new Date();
  const activeCount = TESTED_ENTRIES.filter((e) => entryStatus(e, now) === "active").length;
  const archivedCount = TESTED_ENTRIES.filter((e) => entryStatus(e, now) === "archived").length;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Tested by AI Business
          </p>
          <h1 className="mb-6 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
            The registry of verified test purchases
          </h1>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/70">
            <p>
              Every service listed here is checked by an outsider: requirements agreed
              with the company in advance, then verified by walking through the service
              as an ordinary customer. The registry records that the check happens and
              when it last happened. What the check found stays with the company.
            </p>
            <p className="text-white/90">
              A badge with a QR code is only real if it leads to a record on this page.
              No record, no verification.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/service-check"
              className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              Get your service tested &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How to read a score */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-6">
              <h2 className="text-lg font-bold text-black">What a record means</h2>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                That this service is checked by someone outside the company, against
                requirements agreed before the check, and that it was verified on the
                date shown. Not that it is perfect.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 p-6">
              <h2 className="text-lg font-bold text-black">Findings are not published</h2>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                What a check found goes to the company and nowhere else. There is no
                scoreboard here and no ranking: a registry of who is being checked is
                useful, a league table built from other people&apos;s problems is not.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 p-6">
              <h2 className="text-lg font-bold text-black">Records go stale, visibly</h2>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                A record stays active while the checks continue. When a company stops,
                it moves to the archive with the date of its last check still showing.
                An old date is information too.
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-black/50">
            Companies pay for the check to be carried out, never for a particular
            result. The requirements are frozen before the check starts, and the company
            knows what will be checked but never when, from which account, or by which
            scenario.{" "}
            <Link href="/library/ai-agent-test-purchase" className="font-semibold text-amber-600 hover:underline">
              The full methodology is published in the library
            </Link>
            . This is a private, independent test purchase, not an accredited conformity
            assessment.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-b border-black/10 bg-[#ebebed]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-black">{activeCount}</p>
              <p className="mt-1 text-sm text-black/60">services under active check</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-black">{TESTED_STATS.checksTotal}</p>
              <p className="mt-1 text-sm text-black/60">
                test purchases carried out in total
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-black">{archivedCount}</p>
              <p className="mt-1 text-sm text-black/60">
                archived: checks no longer continuing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Records */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Records
          </h2>

          {TESTED_ENTRIES.length === 0 ? (
            <div className="rounded-2xl border border-card-border bg-card-bg p-8">
              <p className="text-lg font-bold text-white">
                The registry starts with Verification No. 0001, and we are looking for
                the first companies to take it.
              </p>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/70">
                A record appears here once a company completes its first test purchase.
                The methodology is already public. If your AI service does what you say
                it does, this is the cheapest way to let anyone verify that an outsider
                checked.
              </p>
              <a
                href="/service-check#apply"
                className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
              >
                Apply for a test purchase &rarr;
              </a>
              <p className="mt-3 text-xs text-white/40">
                Free screening first; payment only after we confirm your service can be
                tested.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {TESTED_ENTRIES.map((e) => {
                const status = entryStatus(e, now);
                return (
                  <Link
                    key={e.number}
                    href={`/tested/${e.number}`}
                    className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card-bg p-6 transition hover:border-accent sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-mono text-xs text-white/40">
                        Verification No. {e.number}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">{e.company}</p>
                      <p className="text-sm text-white/60">{e.service}</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white/70">Last checked</p>
                        <p className="text-lg font-bold text-accent">{e.checkDate}</p>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          status === "active"
                            ? "bg-accent text-black"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
