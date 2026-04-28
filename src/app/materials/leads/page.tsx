import type { Metadata } from "next";
import LeadsAdmin from "@/components/materials/LeadsAdmin";

export const metadata: Metadata = {
  title: "Leads Export - Local Backup",
  description: "View locally saved leads and export CSV.",
};

export default function LeadsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Materials</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Leads <span className="text-accent">Export</span>
          </h1>
          <p className="text-sm text-muted max-w-3xl">
            Local lead backup. Use this page on the same browser where leads were captured, then export CSV.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <LeadsAdmin />
        </div>
      </section>
    </>
  );
}
