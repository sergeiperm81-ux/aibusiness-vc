import type { Metadata } from "next";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string; next?: string; logged_out?: string }>;
};

export const metadata: Metadata = {
  title: "Leads Login",
  description: "Restricted access for leads dashboard.",
};

function normalizeNextPath(path?: string): string {
  if (!path || !path.startsWith("/materials/leads")) return "/materials/leads";
  if (path.startsWith("/materials/leads/login")) return "/materials/leads";
  return path;
}

export default async function LeadsLoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeNextPath(resolvedSearchParams?.next);
  const hasError = resolvedSearchParams?.error === "1";
  const loggedOut = resolvedSearchParams?.logged_out === "1";

  return (
    <section className="min-h-[70vh] bg-background flex items-center">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">Private</p>
          <h1 className="text-2xl font-bold text-white mb-2">Leads Dashboard Access</h1>
          <p className="text-sm text-muted mb-6">Enter login and password to open lead export.</p>

          <form method="post" action="/api/leads-auth/login" className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div>
              <label htmlFor="username" className="block text-xs text-gray-300 mb-1">
                Login
              </label>
              <input
                id="username"
                name="username"
                type="email"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-accent"
              />
            </div>

            {hasError && (
              <p className="text-xs text-rose-300">Wrong login or password. Please try again.</p>
            )}
            {loggedOut && <p className="text-xs text-emerald-300">You are logged out.</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black hover:bg-accent-hover transition-colors"
            >
              Open Leads
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
