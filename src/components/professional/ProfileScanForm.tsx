"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseSocialProfile } from "@/lib/audit/social-profile";
import { trackScan } from "@/lib/scan-analytics";

/**
 * One field: the link to a personal profile. The same parser as the server
 * checks it first, so a website or a company page is refused before any
 * request is made.
 */
export function ProfileScanForm({ tone = "dark" }: { tone?: "dark" | "yellow" }) {
  const onYellow = tone === "yellow";
  const router = useRouter();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const parsed = parseSocialProfile(value);
    if (!parsed.ok) {
      setError(parsed.error);
      trackScan("preview_failed", "person", { reason: "invalid_link" });
      return;
    }
    setBusy(true);
    trackScan("preview_started", "person");
    try {
      const response = await fetch("/api/professional-scan/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profile: parsed.profile.url }),
      });
      const data = (await response.json()) as { ok: boolean; previewId?: string; error?: string };
      if (data.ok && data.previewId) {
        trackScan("preview_completed", "person");
        router.push(`/professional-scan/r/${data.previewId}`);
        return;
      }
      trackScan("preview_failed", "person", { reason: response.status === 429 ? "rate_limited" : "unavailable" });
      setError(data.error ?? "The check did not work this time. Please try again.");
    } catch {
      trackScan("preview_failed", "person", { reason: "network" });
      setError("The check did not work this time. Please try again.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-2xl">
      <label htmlFor={`profile-link-${tone}`} className={`mb-2 block text-base font-semibold ${onYellow ? "text-black" : "text-white/80"}`}>
        Your LinkedIn, X, Instagram or Facebook profile link
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`profile-link-${tone}`}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="linkedin.com/in/your-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`flex-1 rounded-lg px-4 py-3 text-base focus:outline-none ${onYellow ? "border-2 border-black bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/30" : "border-2 border-white bg-white text-black placeholder:text-black/45 focus:ring-2 focus:ring-accent"}`}
        />
        <button
          type="submit"
          disabled={busy}
          className={`whitespace-nowrap rounded-lg px-6 py-3 text-base font-bold transition-colors disabled:opacity-60 ${onYellow ? "bg-black text-white hover:bg-black/85" : "bg-accent text-black hover:bg-accent-hover"}`}
        >
          {busy ? "Looking you up..." : "Check for free"}
        </button>
      </div>
      {error && (
        <p className={`mt-3 text-base font-semibold ${onYellow ? "text-black" : "text-red-400"}`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
