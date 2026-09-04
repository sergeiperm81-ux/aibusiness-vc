import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes-content";

export const metadata: Metadata = {
  title: "Founder's Notes",
  description:
    "Founder commentary by Sergei Ponomarev on AI business, service quality, automation, and practical AI governance.",
  alternates: { canonical: "/notes" },
};

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <section className="bg-white">
      {/* Amber banner — the author layer is deliberately the brightest thing on the site */}
      <div className="bg-accent">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_auto] lg:gap-12 lg:px-8">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black/70">
              Founder&apos;s Notes
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
              Founder commentary, in my own words
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/75">
              Personal observations by{" "}
              <span className="font-semibold text-gray-950">Sergei Ponomarev</span> on AI
              business, service quality, automation, and where the money is moving. Not news,
              not SEO — just what I actually think, one note at a time.
            </p>
            <div className="mt-6 h-1 w-16 rounded-full bg-black/30" />
          </div>
          <Image
            src="/images/sergei-ponomarev.jpg"
            alt="Sergei Ponomarev"
            width={260}
            height={280}
            priority
            className="h-auto w-40 justify-self-start rounded-2xl border-2 border-black/15 object-cover object-top shadow-lg sm:w-52 lg:w-56 lg:justify-self-end"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {notes.map((n) => (
            <Link
              key={n.slug}
              href={`/notes/${n.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
            >
              <p className="text-sm text-gray-400">{fmtDate(n.date)}</p>
              <h2 className="mt-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-amber-700">
                {n.title}
              </h2>
              <p className="mt-2 flex-1 text-base leading-relaxed text-gray-600">{n.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-amber-600">
                Read note &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Author */}
        <div className="mt-16 flex items-center gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <Image
            src="/images/sergei-ponomarev.jpg"
            alt="Sergei Ponomarev"
            width={96}
            height={104}
            className="h-20 w-20 shrink-0 rounded-xl border border-gray-200 object-cover object-top"
          />
          <div>
            <p className="text-base leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">Sergei Ponomarev</span> — founder of
              AI Business. Seven years in service quality, standards, and independent assessment,
              now applied to AI.{" "}
              <Link href="/sergei-ponomarev" className="font-semibold text-amber-600 hover:underline">
                More about me &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
