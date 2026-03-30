import Link from "next/link";
import type { Metadata } from "next";
import { salaries, getSalaryById } from "@/data/salaries";
import { notFound } from "next/navigation";

interface Props { params: Promise<{ role: string }> }

export async function generateStaticParams() {
  return salaries.map((s) => ({ role: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const s = getSalaryById(role);
  if (!s) return { title: "Role Not Found" };
  return {
    title: `${s.role} Salary 2026 — ${s.avgSalary} Average (${s.salaryRange})`,
    description: `${s.role} salary: ${s.avgSalary} average, range ${s.salaryRange}. Demand growth: ${s.demandGrowth}. Skills: ${s.skills.slice(0, 3).join(", ")}. ${s.description}`,
  };
}

export default async function SalaryPage({ params }: Props) {
  const { role } = await params;
  const s = getSalaryById(role);
  if (!s) notFound();

  const others = salaries.filter((x) => x.id !== s.id).slice(0, 3);

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/salaries" className="text-xs text-muted hover:text-accent">Salaries</Link>
            <span className="text-xs text-muted">/</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.role}</h1>
          <p className="text-sm text-muted">{s.experience} experience &middot; {s.remoteAvailability}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{s.avgSalary}</p>
              <p className="text-xs text-gray-400 mt-1">Average Salary</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-900">{s.salaryRange}</p>
              <p className="text-xs text-gray-400 mt-1">Salary Range</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{s.demandGrowth}</p>
              <p className="text-xs text-gray-400 mt-1">Demand Growth</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-900">{s.remoteAvailability}</p>
              <p className="text-xs text-gray-400 mt-1">Remote</p>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6 mb-10">
            <h2 className="text-lg font-bold text-white mb-3">About This Role</h2>
            <p className="text-muted leading-relaxed">{s.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Key Skills</h2>
              <div className="flex flex-wrap gap-2">
                {s.skills.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
              <div className="flex flex-wrap gap-2">
                {s.topCompanies.map((co) => (
                  <span key={co} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium">{co}</span>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">Other AI Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((o) => (
              <Link key={o.id} href={`/salaries/${o.id}`}
                className="group bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-accent">{o.role}</h3>
                  <span className="text-sm font-mono text-emerald-400">{o.avgSalary}</span>
                </div>
                <p className="text-xs text-muted">{o.experience}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
