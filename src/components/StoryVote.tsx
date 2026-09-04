"use client";

import { useEffect, useState } from "react";

interface StoryVoteProps {
  readonly slug: string;
}

/**
 * The 0-to-10 scale under every Partner Story: "Would you try this product?"
 *
 * 0 reads "never", 10 reads "going to try it right now". After voting the
 * reader sees the running average and vote count; localStorage remembers the
 * vote so the buttons collapse into the result on return visits.
 */
export function StoryVote({ slug }: StoryVoteProps) {
  const [voted, setVoted] = useState<number | null>(null);
  const [stats, setStats] = useState<{ count: number; average: number | null } | null>(null);
  const [busy, setBusy] = useState(false);

  const storageKey = `story-vote:${slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setVoted(Number(saved));
        void fetch(`/api/vote?slug=${slug}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.ok && setStats({ count: d.count, average: d.average }))
          .catch(() => undefined);
      }
    } catch {
      // storage blocked: the scale simply stays votable
    }
  }, [slug, storageKey]);

  async function vote(score: number) {
    if (busy || voted !== null) return;
    setBusy(true);
    try {
      const r = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, score }),
      });
      const d = await r.json();
      if (r.ok && d.ok) {
        setVoted(score);
        setStats({ count: d.count, average: d.average });
        try {
          localStorage.setItem(storageKey, String(score));
        } catch {
          // fine — the vote still counted
        }
      }
    } catch {
      // network hiccup: leave the scale votable
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="my-10 rounded-2xl border border-black/10 bg-[#fafafa] p-6">
      <p className="text-lg font-bold text-black">Would you try this product?</p>

      {voted === null ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                type="button"
                disabled={busy}
                onClick={() => vote(i)}
                className="h-11 w-11 rounded-lg border border-black/15 bg-white text-base font-bold text-black transition hover:border-accent hover:bg-accent disabled:opacity-50"
                aria-label={`Vote ${i} out of 10`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-black/45">
            <span>0 &mdash; never</span>
            <span>10 &mdash; going to try it right now</span>
          </div>
        </>
      ) : (
        <div className="mt-3">
          <p className="text-base text-black/75">
            You voted <span className="font-bold text-black">{voted}/10</span>.
            {stats && stats.average !== null && (
              <>
                {" "}Readers so far:{" "}
                <span className="font-bold text-black">{stats.average}/10</span>{" "}
                <span className="text-black/50">
                  ({stats.count} {stats.count === 1 ? "vote" : "votes"})
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
