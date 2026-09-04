import Link from "next/link";
import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Join the AI Governance Expert Register",
  description:
    "Add yourself to the open register of AI governance experts. Free, no paid tier, and the profile stays yours.",
  alternates: { canonical: "/experts/apply" },
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <section className="bg-white">
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link href="/experts" className="text-xs text-gray-400 hover:text-amber-400">
            &larr; The register
          </Link>
          <p className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Join the register
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Add yourself to the register
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300">
            Free, with no paid tier and no ranking to buy. We confirm that you exist and that the
            links are yours, then publish the profile you wrote. Ask, and it comes down.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <ApplyForm />
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-base font-bold text-gray-900">Before you fill this in</h2>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                <li>
                  <strong className="font-semibold text-gray-900">Who belongs here.</strong>{" "}
                  Governance, compliance, assurance, evaluation, data governance, responsible
                  adoption, and specialists who know one industry from the inside.
                </li>
                <li>
                  <strong className="font-semibold text-gray-900">What we verify.</strong> Your
                  identity and your links. We do not assess professional quality, and a listing is
                  not a recommendation.
                </li>
                <li>
                  <strong className="font-semibold text-gray-900">Your data.</strong> Your email
                  stays with us and is never published. Write to us and the profile is edited or
                  deleted.
                </li>
                <li>
                  <strong className="font-semibold text-gray-900">No CV needed.</strong> Write the
                  profile in your own words. The links do the verifying.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
