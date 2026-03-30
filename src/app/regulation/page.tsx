import Link from "next/link";
import type { Metadata } from "next";
import { regulations } from "@/data/regulations";

export const metadata: Metadata = {
  title: "AI Regulation Tracker — Global AI Laws & Policies (2026)",
  description:
    "Track AI regulations worldwide. EU AI Act, US executive orders, China's AI rules, and more. Status, requirements, and penalties for every major country.",
};

const statusColors: Record<string, string> = {
  Enacted: "bg-emerald-500 text-white",
  "In Progress": "bg-amber-500 text-black",
  Proposed: "bg-blue-500 text-white",
  "Framework Only": "bg-gray-500 text-white",
};

export default function RegulationPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p className="text-blue-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Policy Tracker
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Regulation <span className="text-accent">Around the World</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Every major country's AI laws, policies, and regulations in one
            place. What's enacted, what's coming, and what it means for AI
            businesses.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 pr-4 font-bold text-gray-900">Country</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Status</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Key Legislation</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900">Approach</th>
                  <th className="pb-3 font-bold text-gray-900">Penalties</th>
                </tr>
              </thead>
              <tbody>
                {regulations.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={`/regulation/${r.id}`} className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                        {r.country}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{r.keyLegislation}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500">{r.riskApproach}</td>
                    <td className="py-3 text-xs text-gray-500">{r.penalties}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {regulations.map((r) => (
              <Link key={r.id} href={`/regulation/${r.id}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white group-hover:text-accent">{r.country}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-accent mb-1">{r.keyLegislation}</p>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{r.description}</p>
                <span className="text-[11px] font-medium text-accent mt-3 inline-block">Details &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
