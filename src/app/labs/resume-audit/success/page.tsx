import type { Metadata } from "next";
import { Suspense } from "react";
import { ResumeAuditSuccessClient } from "@/components/resume/ResumeAuditSuccessClient";

export const metadata: Metadata = {
  title: "Resume Audit Payment Success (Private Beta)",
  description: "Private success page for paid AI Resume Audit report generation.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ResumeAuditSuccessPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Resume Audit Checkout</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
          Payment confirmed flow for private beta users. Verify payment, then download your full report PDF.
        </p>
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-sm text-white/70">
                Loading checkout result...
              </div>
            }
          >
            <ResumeAuditSuccessClient />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

