import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllNotes, getNoteBySlug, getAllNoteSlugs } from "@/lib/notes-content";
import { ReadingTracker } from "@/components/analytics/ReadingTracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: "Note Not Found" };
  return {
    // The site template already appends "| AI Business"; adding it here
    // produced titles ending in the name twice.
    title: `${note.title} — Founder's Notes`,
    description: note.description,
    alternates: { canonical: `/notes/${note.slug}` },
    authors: [{ name: note.author }],
    robots: { index: true, follow: true },
    openGraph: {
      title: note.title,
      description: note.description,
      url: `https://aibusiness.vc/notes/${note.slug}`,
      type: "article",
      authors: [note.author],
      publishedTime: note.date,
    },
  };
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Minimal editorial renderer: paragraphs with inline bold/italic/links.
// Notes are hand-written prose — no tables, images, or code, so keep this tiny.
function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">$1</a>');
}

function NoteBody({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith("## ")) {
        return `<h2 style="font-size:22px;font-weight:700;color:#111;margin:36px 0 14px">${inline(b.slice(3))}</h2>`;
      }
      // A paragraph that is nothing but one link becomes a button. Notes render
      // with HTML escaped, so raw <a> markup would print as text instead.
      const solo = b.match(/^\[(.+?)\]\((\S+?)\)$/);
      if (solo) {
        return `<p style="margin:0 0 26px"><a href="${solo[2]}" style="display:inline-block;background:#f59e0b;color:#000;font-weight:800;font-size:17px;padding:16px 32px;border-radius:12px;text-decoration:none">${inline(solo[1])}</a></p>`;
      }
      const lines = b.split("\n").map((l) => l.trim());
      // Numbered or bulleted list — keep each item on its own line
      const ordered = lines.every((l) => /^\d+\.\s/.test(l));
      const bulleted = lines.every((l) => /^[-*]\s/.test(l));
      if (lines.length > 1 && (ordered || bulleted)) {
        const tag = ordered ? "ol" : "ul";
        const items = lines
          .map((l) => `<li style="margin:0 0 10px">${inline(l.replace(/^(\d+\.|[-*])\s/, ""))}</li>`)
          .join("");
        return `<${tag} style="color:#1f2937;font-size:17px;line-height:1.85;margin:0 0 22px;padding-left:24px">${items}</${tag}>`;
      }
      return `<p style="color:#1f2937;font-size:17px;line-height:1.85;margin:0 0 22px">${inline(b.replace(/\n/g, " "))}</p>`;
    });
  return <div dangerouslySetInnerHTML={{ __html: blocks.join("\n") }} />;
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const others = getAllNotes().filter((n) => n.slug !== note.slug);
  const sidebarNotes = others.slice(0, 6);

  return (
    <>
      <ReadingTracker contentId={`notes/${note.slug}`} section="notes" />
    <section className="bg-white">
      <div className="bg-accent">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_auto] lg:gap-12 lg:px-8">
          <div>
            <Link href="/notes" className="text-xs font-semibold text-black/60 transition-colors hover:text-black">
              &larr; Founder&apos;s Notes
            </Link>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
              {note.title}
            </h1>
            <p className="mt-4 text-sm text-black/70">
              By{" "}
              <Link href="/sergei-ponomarev" className="font-semibold text-gray-950 hover:underline">
                {note.author}
              </Link>
              {" · "}
              {fmtDate(note.date)}
            </p>
            <div className="mt-6 h-1 w-16 rounded-full bg-black/30" />
          </div>
          <Image
            src="/images/sergei-desk.png"
            alt="Sergei Ponomarev"
            width={200}
            height={216}
            className="hidden h-auto w-40 rounded-2xl border-2 border-black/15 object-cover object-[50%_22%] shadow-lg lg:block lg:w-44 lg:justify-self-end"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-14">
          {/* Text takes two of the three columns */}
          <article className="lg:col-span-2">
            <NoteBody content={note.content} />

            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-8">
              <Link
                href="/notes"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
              >
                All notes &rarr;
              </Link>
              <Link
                href="/sergei-ponomarev"
                className="text-sm font-semibold text-amber-600 hover:underline"
              >
                About the author &rarr;
              </Link>
            </div>
          </article>

          {/* Move between notes without going back to the index */}
          {sidebarNotes.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  More notes
                </p>
                <div className="space-y-1">
                  {sidebarNotes.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/notes/${n.slug}`}
                      className="block rounded-xl border border-transparent px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50"
                    >
                      <p className="text-xs text-gray-400">{fmtDate(n.date)}</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-gray-900">
                        {n.title}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/notes"
                  className="mt-4 inline-block px-4 text-sm font-semibold text-amber-600 hover:underline"
                >
                  All notes &rarr;
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: note.title,
            description: note.description,
            datePublished: note.date,
            author: { "@type": "Person", name: note.author, url: "https://aibusiness.vc/sergei-ponomarev" },
            mainEntityOfPage: `https://aibusiness.vc/notes/${note.slug}`,
          }),
        }}
      />
    </section>
    </>
  );
}
