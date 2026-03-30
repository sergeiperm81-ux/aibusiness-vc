import Link from "next/link";
import type { Metadata } from "next";
import { regulations, getRegulationById } from "@/data/regulations";
import { notFound } from "next/navigation";

interface Props { params: Promise<{ country: string }> }

export async function generateStaticParams() {
  return regulations.map((r) => ({ country: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const r = getRegulationById(country);
  if (!r) return { title: "Not Found" };
  return {
    title: `AI Regulation in ${r.country} (2026) — ${r.keyLegislation}`,
    description: `${r.country} AI regulation: ${r.keyLegislation}. Status: ${r.status}. ${r.description.slice(0, 100)}...`,
  };
}

const statusColors: Record<string, string> = {
  Enacted: "bg-emerald-500 text-white",
  "In Progress": "bg-amber-500 text-black",
  Proposed: "bg-blue-500 text-white",
  "Framework Only": "bg-gray-500 text-white",
};

export default async function CountryRegulationPage({ params }: Props) {
  const { country } = await params;
  const r = getRegulationById(country);
  if (!r) notFound();

  const others = regulations.filter((x) => x.id !== r.id).slice(0, 4);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/regulation" className="text-xs text-muted hover:text-accent">Regulation</Link>
            <span className="text-xs text-muted">/</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{r.country}</h1>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase ${statusColors[r.status]}`}>{r.status}</span>
          </div>
          <p className="text-sm text-accent">{r.keyLegislation}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Status</p>
              <p className="font-semibold text-gray-900 mt-1">{r.status}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Effective Date</p>
              <p className="font-semibold text-gray-900 mt-1">{r.effectiveDate}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Region</p>
              <p className="font-semibold text-gray-900 mt-1">{r.region}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Penalties</p>
              <p className="font-semibold text-gray-900 mt-1 text-xs">{r.penalties}</p>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
            <p className="text-muted leading-relaxed">{r.description}</p>
            <div className="mt-4 pt-4 border-t border-card-border">
              <p className="text-xs text-muted mb-1">Regulatory Approach</p>
              <p className="text-sm text-white">{r.riskApproach}</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Key Requirements</h2>
            <div className="space-y-2">
              {r.keyRequirements.map((req) => (
                <div key={req} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-accent font-bold mt-0.5">+</span>
                  <p className="text-sm text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">Other Countries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((o) => (
              <Link key={o.id} href={`/regulation/${o.id}`}
                className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-accent">{o.country}</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${statusColors[o.status]}`}>{o.status}</span>
                </div>
                <p className="text-[11px] text-muted">{o.keyLegislation}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
