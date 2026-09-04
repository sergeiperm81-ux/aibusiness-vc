import Link from "next/link";
import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";
import { REGISTER_BENEFITS } from "../experts";

export const metadata: Metadata = {
  title: "Join the AI Governance Experts Community",
  description:
    "Join the open community of AI governance experts. Free, no paid tier, and the profile stays yours.",
  alternates: { canonical: "/experts/apply" },
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <section className="bg-white">
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Link href="/experts" className="text-xs text-gray-400 hover:text-accent">
            &larr; The community
          </Link>
          <p className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Join the community
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Put yourself on the map of AI governance
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300">
            Write the profile in your own words. We confirm you are you, publish it, and from that
            day clients and AI search can find you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <ApplyForm />
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl bg-accent p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
                  What changes
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight text-black">
                  The day your profile goes live
                </h2>
                <ul className="mt-5 space-y-4">
                  {REGISTER_BENEFITS.map((b) => (
                    <li key={b.title}>
                      <p className="text-sm font-bold text-black">{b.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-black/75">{b.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-gray-950 p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  The rules
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300">
                  <li>
                    <strong className="font-bold text-white">Free, and it stays free.</strong> No
                    paid tier, no sponsored ranking, nobody can buy a place above you.
                  </li>
                  <li>
                    <strong className="font-bold text-white">We check identity, not talent.</strong>{" "}
                    Your links prove you are you. Your work speaks for itself.
                  </li>
                  <li>
                    <strong className="font-bold text-white">Yours to edit or remove.</strong> One
                    email, and the profile changes or disappears the same week.
                  </li>
                  <li>
                    <strong className="font-bold text-white">Email stays private.</strong> It is
                    never shown on the site.
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
