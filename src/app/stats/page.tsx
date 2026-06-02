import type { Metadata } from "next";
import { cookies } from "next/headers";
import stats from "@/data/stats-snapshot.json";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export default async function StatsPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const expected = process.env.STATS_PASSWORD;
  const authed = !!expected && cookieStore.get("stats_auth")?.value === expected;

  if (!authed) {
    const { error } = await searchParams;
    return <PasswordGate hasError={error === "1"} />;
  }

  return <Dashboard />;
}

function PasswordGate({ hasError }: { hasError: boolean }) {
  return (
    <section className="min-h-[70vh] bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔒</div>
          <h1 className="text-xl font-bold text-white">Stats</h1>
          <p className="text-sm text-white/50 mt-1">This area is password protected.</p>
        </div>
        <form
          action="/api/stats/login"
          method="post"
          className="bg-card-bg border border-card-border rounded-xl p-5"
        >
          <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          {hasError && (
            <p className="text-xs text-red-400 mt-2">Wrong password. Try again.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-black hover:brightness-95 transition"
          >
            Enter
          </button>
        </form>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

function BarRow({ name, value, max, accent }: { name: string; value: string; max: number; accent: string }) {
  const numeric = Number(value.replace(/[^0-9.]/g, "")) || 0;
  const pct = max > 0 ? Math.max(4, Math.round((numeric / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700 truncate pr-2">{name}</span>
        <span className="font-semibold text-gray-900 tabular-nums shrink-0">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${accent}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PageRow({ path, views, bounce, tone }: { path: string; views: number; bounce: number; tone: "good" | "bad" }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <a href={path} target="_blank" rel="noreferrer" className="text-sm text-gray-700 hover:text-amber-600 truncate">
        {path}
      </a>
      <div className="flex items-center gap-3 shrink-0 text-xs">
        <span className="font-semibold text-gray-900 tabular-nums">{fmt(views)} views</span>
        <span className={`tabular-nums ${tone === "bad" ? "text-red-500" : "text-emerald-600"}`}>
          {bounce}% bounce
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const v = stats.visitors;
  const maxCountry = Math.max(...stats.countries.map((c) => c.users));
  const totalDevice = stats.devices.reduce((s, d) => s + d.users, 0) || 1;

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
                Private
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Site Statistics</h1>
              <p className="text-sm text-white/60 max-w-2xl">
                Live traffic from Google Analytics. Snapshot taken {stats.generatedAt}. &ldquo;All
                time&rdquo; covers the whole life of the site (since {stats.allTimeSince}).
              </p>
            </div>
            <form action="/api/stats/logout" method="post">
              <button type="submit" className="text-xs text-white/40 hover:text-white/80 transition">
                Log out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          {/* Visitor totals */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Visitors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Last 7 days" value={fmt(v.last7days.users)} sub={`${fmt(v.last7days.sessions)} sessions · ${fmt(v.last7days.pageviews)} views`} />
              <Stat label="Last 30 days" value={fmt(v.last30days.users)} sub={`${fmt(v.last30days.sessions)} sessions · ${fmt(v.last30days.pageviews)} views`} />
              <Stat label="All time" value={fmt(v.allTime.users)} sub={`${fmt(v.allTime.sessions)} sessions · ${fmt(v.allTime.pageviews)} views`} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Numbers are people (active users). Note: a large share of traffic is automated (bots/crawlers).</p>
          </div>

          {/* Countries + Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">By country (all time)</h2>
              <div className="space-y-3">
                {stats.countries.map((c) => (
                  <BarRow key={c.name} name={c.name} value={fmt(c.users)} max={maxCountry} accent="bg-accent" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">By device (all time)</h2>
              <div className="space-y-3">
                {stats.devices.map((d) => {
                  const pct = Math.round((d.users / totalDevice) * 100);
                  return (
                    <BarRow key={d.name} name={`${d.name} (${pct}%)`} value={fmt(d.users)} max={stats.devices[0].users} accent="bg-emerald-500" />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top + Worst pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Top 5 pages</h2>
              <p className="text-xs text-gray-400 mb-3">Most viewed, all time.</p>
              <div>
                {stats.topPages.map((p) => (
                  <PageRow key={p.path} path={p.path} views={p.views} bounce={p.bounce} tone="good" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Anti-top 5 pages</h2>
              <p className="text-xs text-gray-400 mb-3">People land here and leave immediately (highest bounce among pages with real traffic).</p>
              <div>
                {stats.worstPages.map((p) => (
                  <PageRow key={p.path} path={p.path} views={p.views} bounce={p.bounce} tone="bad" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
