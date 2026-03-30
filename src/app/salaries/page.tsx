import Link from "next/link";
import type { Metadata } from "next";
import { salaries } from "@/data/salaries";

export const metadata: Metadata = {
  title: "AI Salaries 2026 — What Every AI Role Pays",
  description:
    "Complete AI salary guide for 2026. From data annotators ($35K) to Chief AI Officers ($643K). Salary ranges, demand growth, top companies, and skills needed.",
};

export default function SalariesPage() {
  const sorted = [...salaries].sort((a, b) => {
    const numA = parseInt(a.avgSalary.replace(/[^0-9]/g, ""));
    const numB = parseInt(b.avgSalary.replace(/[^0-9]/g, ""));
    return numB - numA;
  });

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <p className="text-emerald-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Salary Guide
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Salaries <span className="text-accent">2026</span>
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            What every AI role pays — from entry-level data annotators to
            C-suite executives. Updated salary ranges, demand growth, and the
            skills you need.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Salary table */}
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 pr-4 font-bold text-gray-900">Role</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900 text-right">Avg Salary</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900 text-right">Range</th>
                  <th className="pb-3 pr-4 font-bold text-gray-900 text-right">Demand</th>
                  <th className="pb-3 font-bold text-gray-900">Remote</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={`/salaries/${s.id}`} className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                        {s.role}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono font-bold text-emerald-600">{s.avgSalary}</td>
                    <td className="py-3 pr-4 text-right text-xs text-gray-500">{s.salaryRange}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className="text-xs font-bold text-emerald-600">{s.demandGrowth}</span>
                    </td>
                    <td className="py-3 text-xs text-gray-500">{s.remoteAvailability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role cards */}
          <h2 className="text-lg font-bold text-gray-900 mb-6">Role Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((s) => (
              <Link key={s.id} href={`/salaries/${s.id}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400">{s.demandGrowth} demand</span>
                  <span className="text-lg font-bold text-accent">{s.avgSalary}</span>
                </div>
                <h3 className="font-bold text-white group-hover:text-accent transition-colors">{s.role}</h3>
                <p className="text-xs text-muted mt-1">{s.experience} experience</p>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">{s.description}</p>
                <span className="text-[11px] font-medium text-accent mt-3 inline-block">View details &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
