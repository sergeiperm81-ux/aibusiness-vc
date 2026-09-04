import Link from "next/link";
import { getLatestNews } from "@/lib/supabase";

/**
 * The third column: what we do, then what is new.
 *
 * The top navigation already lists every section, so a sidebar repeating it
 * showed the reader the same menu twice. Services are what a reader deep in a
 * page has not already been offered; the news block underneath keeps the
 * column from looking like a stub and gives it a reason to change.
 */

export const START_HERE_ITEMS = [
  {
    href: "/service-check",
    title: "AI Service Check",
    text: "Test purchases of AI agents: what your bot actually tells customers.",
  },
  {
    href: "/audit",
    title: "AI Visibility Audit",
    text: "See how ChatGPT and AI search understand your website.",
  },
  {
    href: "/library",
    title: "Author's Library",
    text: "Free frameworks, checklists and methods. No registration.",
  },
  {
    href: "/submit-your-story",
    title: "Submit Your Story",
    text: "Share an AI business case, tool, or revenue story.",
  },
  {
    href: "/sergei-ponomarev",
    title: "About the founder",
    text: "Seven years of service standards, evaluation and test purchases.",
  },
] as const;

interface Props {
  /** Hide one entry when the reader is already on that page. */
  readonly exclude?: string;
  readonly sticky?: boolean;
  /** How many news items to show underneath. Zero hides the block. */
  readonly newsCount?: number;
}

export async function StartHereRail({ exclude, sticky = true, newsCount = 5 }: Props) {
  const items = START_HERE_ITEMS.filter((i) => i.href !== exclude);

  // News is the fastest-moving thing on the site, so it is what makes a
  // sidebar worth glancing at twice. A failure here must not take the page
  // down: the rail simply renders without it.
  let news: Awaited<ReturnType<typeof getLatestNews>> = [];
  if (newsCount > 0) {
    try {
      news = (await getLatestNews(newsCount)).slice(0, newsCount);
    } catch {
      news = [];
    }
  }

  return (
    <div className={sticky ? "lg:sticky lg:top-20" : undefined}>
      <div className="rounded-2xl bg-background p-6">
        <p className="mb-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Start here
        </p>
        <p className="mb-5 text-lg font-bold text-white">What we do</p>
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-accent/50 hover:bg-white/10"
            >
              <p className="text-sm font-semibold leading-tight text-white">{item.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-white/40">{item.text}</p>
            </Link>
          ))}
        </div>
      </div>

      {news.length > 0 && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Latest news
            </p>
            <Link href="/news" className="text-xs font-semibold text-amber-600 hover:underline">
              All news →
            </Link>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`/news?open=${item.slug}`}
                className="group flex gap-3"
              >
                {item.image && (
                  // Remote news thumbnails come from many hosts, so a plain img
                  // avoids configuring every domain for the image optimiser.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    {item.category}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug text-gray-900 group-hover:text-amber-700">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
