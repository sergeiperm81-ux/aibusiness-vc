import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TESTED_ENTRIES,
  getEntry,
  entryStatus,
  activeUntil,
} from "@/data/tested-registry";

interface Props {
  params: Promise<{ number: string }>;
}

export function generateStaticParams() {
  return TESTED_ENTRIES.map((e) => ({ number: e.number }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const entry = getEntry(number);
  if (!entry) return { title: "Verification Not Found" };
  return {
    title: `Verification No. ${entry.number}: ${entry.company}`,
    description: `${entry.company} is under independent test purchase. Last checked on ${entry.checkDate}. The registry records that the check happens; the findings stay with the company.`,
    alternates: { canonical: `/tested/${entry.number}` },
  };
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * The page a badge's QR code resolves to.
 *
 * It answers one question and no more: is this service really being checked by
 * an outsider, and how recently. What a check found belongs to the company that
 * paid for it, so no score and no item list appear here — publishing those
 * would turn a registry into a scoreboard built from other people's problems.
 */
export default async function VerificationPage({ params }: Props) {
  const { number } = await params;
  const entry = getEntry(number);
  if (!entry) notFound();

  const now = new Date();
  const status = entryStatus(entry, now);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Verified Test Purchase
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Verification No. {entry.number}
        </h1>

        <div className="mt-8 rounded-2xl border border-card-border bg-card-bg p-7 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xl font-bold text-white">{entry.company}</p>
              <p className="mt-1 text-base text-white/70">{entry.service}</p>
              <p className="mt-1 text-sm text-white/40">{entry.url}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-semibold text-white/60">Last checked</p>
              <p className="text-2xl font-bold text-accent">
                {fmt(new Date(entry.checkDate))}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/70">
            <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                status === "active" ? "bg-accent text-black" : "bg-white/10 text-white/60"
              }`}
            >
              {status}
            </span>
            {status === "active" ? (
              <span>
                This service is under independent test purchase. Next verification due by{" "}
                {fmt(activeUntil(entry))}.
              </span>
            ) : status === "archived" ? (
              <span>
                Checks are no longer continuing. The date above is the last verification
                carried out.
              </span>
            ) : (
              <span>
                Record suspended: the service has changed materially since the last check.
              </span>
            )}
          </div>

          <p className="mt-6 text-base leading-relaxed text-white/75">
            An outsider works through this service as an ordinary customer and checks it
            against requirements agreed with the company before the check begins. The
            company knows what is checked; it never knows when, from which account, or by
            which scenario.
          </p>
        </div>

        <div className="mt-8 space-y-3 text-sm leading-relaxed text-white/50">
          <p>
            What the checks found is not published. The findings go to the company that
            commissioned them, along with recommendations, and stay there. This record
            confirms one thing: that the checking is real and current.
          </p>
          <p>
            The company pays for the check to be carried out, never for a particular
            result. This is a private, independent test purchase, not an accredited
            conformity assessment.{" "}
            <Link href="/tested" className="font-semibold text-accent hover:underline">
              Registry
            </Link>{" "}
            &middot;{" "}
            <Link
              href="/library/ai-agent-test-purchase"
              className="font-semibold text-accent hover:underline"
            >
              Methodology
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
