import Link from "next/link";
import Image from "next/image";
import { StartHereRail } from "@/components/StartHereRail";
import type { Metadata } from "next";
import { GUIDES } from "./guides";
import { ContactEmail } from "@/components/ContactEmail";

const LINKEDIN_URL = "https://www.linkedin.com/in/sergei-ponomarev/";

export const metadata: Metadata = {
  title: "An Author's Library — Methods & Tools for an AI That Serves People",
  description:
    "Original methods and ready-to-use tools for governing AI from the human side — by Sergei Ponomarev, founder of aibusiness.vc. Free guides you can use today.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <section className="bg-white">
      {/* Black / gold banner */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            An author&apos;s library
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Methods &amp; tools for an AI that serves people
          </h1>
          <p className="mt-3 text-lg font-semibold text-amber-400">by Sergei Ponomarev, PhD</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300">
            My own methods for governing AI from the human side, published here as I build
            them. Free, and made to be used today.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* White body */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Two columns of guides */}
          <div className="lg:col-span-2">
            <p className="max-w-3xl text-base leading-relaxed text-gray-700">
              This is a personal library: the methods here are my own work, collected and
              published as I develop them. Where a guide draws on someone else&apos;s work, I
              say so — everything else is mine. Each one takes a single piece of the problem —
              how to judge an AI service, how to describe one, how to keep it accountable — and
              turns it into something you can use today. Built from long practice in standards,
              quality assessment, and civic control, now applied to AI. New methods added
              regularly.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  href={`/library/${g.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                  <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-amber-600">
                    {g.kicker}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-amber-700">
                    {g.title}
                  </h2>
                  {g.audience && (
                    <span className="mt-2 inline-flex w-fit items-center rounded-md bg-gray-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      {g.audience}
                    </span>
                  )}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{g.cardBlurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                    Read &amp; download · {g.pages} {g.pagesLabel ?? "pages"} →
                  </span>
                </Link>
              ))}
            </div>

            {/* About the author */}
            <div className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <Image
                  src="/images/sergei-desk.png"
                  alt="Sergei Ponomarev"
                  width={180}
                  height={194}
                  className="h-32 w-32 shrink-0 self-start rounded-xl border border-gray-200 object-cover object-[50%_22%]"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">About the author</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    <span className="font-semibold text-gray-900">Sergei Ponomarev, PhD</span> —
                    founder of aibusiness.vc and a specialist in assessing service quality from
                    the consumer&apos;s side. A PhD on e-government and seven years leading nationwide
                    quality monitoring, independent assessment and test purchases of public
                    services — now applied to AI.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link
                      href="/sergei-ponomarev"
                      className="font-semibold text-amber-600 hover:underline"
                    >
                      More about me →
                    </Link>
                    <ContactEmail className="font-semibold text-amber-600 hover:underline" />
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-600 hover:underline"
                    >
                      LinkedIn →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services rail */}
          <aside className="lg:col-span-1">
            <StartHereRail exclude="/library" />
          </aside>
        </div>
      </div>
    </section>
  );
}
