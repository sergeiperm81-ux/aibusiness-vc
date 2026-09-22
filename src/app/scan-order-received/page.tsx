import type { Metadata } from "next";
import Link from "next/link";

/** Where a buyer lands after paying: what happens now, and what to do if the report is slow. */

export const metadata: Metadata = {
  title: "Payment received: your report is on its way",
  robots: { index: false, follow: false },
};

export default async function OrderReceivedPage({ searchParams }: { searchParams: Promise<{ scan?: string }> }) {
  const { scan } = await searchParams;
  const company = scan === "company";
  const product = company ? "AI Company Scan" : "AI Person Scan";
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-4 text-base font-bold uppercase tracking-wider text-accent">{product}</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl">
            Payment received. <span className="text-accent">Your report is being made now.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
            Processing started the moment you paid. The PDF goes to the email address you gave at checkout, usually
            within 1 to 5 minutes.
          </p>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <li className="rounded-2xl bg-black px-6 py-5">
              <p className="text-xl font-bold text-accent">Check Spam and Promotions</p>
              <p className="mt-2 text-lg leading-relaxed text-white/85">
                The letter comes from info@aibusiness.vc with the PDF attached. If it is not in your inbox, look in Spam or
                Promotions first.
              </p>
            </li>
            <li className="rounded-2xl bg-black px-6 py-5">
              <p className="text-xl font-bold text-accent">If a model is slow</p>
              <p className="mt-2 text-lg leading-relaxed text-white/85">
                We retry automatically and send you a separate email if the report will take longer. You do not need to
                refresh or pay again.
              </p>
            </li>
            <li className="rounded-2xl bg-black px-6 py-5">
              <p className="text-xl font-bold text-accent">Nothing after an hour?</p>
              <p className="mt-2 text-lg leading-relaxed text-white/85">
                Write to info@aibusiness.vc with the email you paid with. A report that does not arrive is refunded in
                full.
              </p>
            </li>
          </ul>
          <p className="mt-10 text-lg text-black/70">
            <Link href="/ai-tools" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              Back to AI Tools
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
