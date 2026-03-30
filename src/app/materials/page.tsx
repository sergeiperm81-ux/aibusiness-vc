import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials — Articles, Podcasts, Videos on AI",
  description:
    "Curated AI content: articles, podcasts, video talks, books, and deep reads about AI and its impact on the world.",
};

const podcasts = [
  { name: "Lex Fridman Podcast", host: "Lex Fridman", focus: "AI researchers & tech leaders", url: "#" },
  { name: "The AI Podcast (NVIDIA)", host: "Noah Kravitz", focus: "AI applications & research", url: "#" },
  { name: "Hard Fork", host: "NYT", focus: "Tech & AI news", url: "#" },
  { name: "Practical AI", host: "Changelog", focus: "AI in production", url: "#" },
];

const mustReads = [
  { title: "State of AI Report 2025", source: "Air Street Capital", type: "Report" },
  { title: "AI Index Report 2025", source: "Stanford HAI", type: "Research" },
  { title: "Economic Potential of Generative AI", source: "McKinsey", type: "Report" },
  { title: "Situational Awareness", source: "Leopold Aschenbrenner", type: "Essay" },
];

const youtubeChannels = [
  { name: "Two Minute Papers", focus: "AI research explained simply", subs: "1.5M+" },
  { name: "Matt Wolfe", focus: "AI tools & news", subs: "800K+" },
  { name: "AI Explained", focus: "Deep dives into AI developments", subs: "500K+" },
  { name: "Fireship", focus: "Tech & AI in 100 seconds", subs: "3M+" },
];

export default function MaterialsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-pink-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Materials
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            The Best <span className="text-accent">AI Content</span> Worth Your Time
          </h1>
          <p className="text-sm text-muted max-w-2xl">
            Curated articles, podcasts, videos, books, and deep reads. The best of
            what the internet has on AI and its impact.
          </p>
        </div>
      </section>

      {/* Podcasts — white */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">AI Podcasts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {podcasts.map((p) => (
              <div key={p.name} className="bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 mb-3 flex items-center justify-center text-pink-400 font-bold text-sm">
                  {p.name[0]}
                </div>
                <h3 className="font-semibold text-white text-sm">{p.name}</h3>
                <p className="text-xs text-muted mt-0.5">{p.host}</p>
                <p className="text-[11px] text-muted mt-1">{p.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube — gray */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">YouTube Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {youtubeChannels.map((ch) => (
              <div key={ch.name} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-red-50 mb-3 flex items-center justify-center text-red-500 font-bold text-sm">
                  {ch.name[0]}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{ch.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{ch.focus}</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">{ch.subs} subscribers</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Must reads — white */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Must-Read Reports & Essays</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mustReads.map((r) => (
              <div key={r.title} className="bg-background rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex-shrink-0 flex items-center justify-center text-accent font-bold text-sm">
                  {r.type[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{r.title}</h3>
                  <p className="text-xs text-muted mt-0.5">{r.source}</p>
                  <span className="text-[10px] font-medium text-accent uppercase tracking-wider">{r.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
