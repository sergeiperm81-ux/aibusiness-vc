"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeDomainAsId } from "@/lib/audit/mock";
import { isAcceptableHostname } from "@/lib/audit/hostname";

interface UrlAuditFormProps {
  /** hero: on the black band; yellow: on the closing yellow band; compact: a single-line field. */
  variant?: "hero" | "yellow" | "compact";
}

export function UrlAuditForm({ variant = "hero" }: UrlAuditFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a website URL.");
      return;
    }

    const id = encodeDomainAsId(trimmed);
    const hostname = id.replace(/^demo-/, "").replace(/__dot__/g, ".");
    const check = isAcceptableHostname(hostname);
    if (!check.ok) {
      setError(check.reason ?? "That doesn't look like a valid domain.");
      return;
    }

    setSubmitting(true);
    router.push(`/audit/r/${id}`);
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourdomain.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-card-bg border border-card-border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-accent text-black text-sm font-bold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {submitting ? "Checking..." : "Run check"}
        </button>
      </form>
    );
  }

  const onYellow = variant === "yellow";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <label htmlFor={`site-url-${variant}`} className={`mb-2 block text-base font-semibold ${onYellow ? "text-black" : "text-white/80"}`}>
        Website address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`site-url-${variant}`}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`flex-1 rounded-lg px-4 py-3 text-base focus:outline-none ${onYellow ? "border-2 border-black bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-black/30" : "border-2 border-white bg-white text-black placeholder:text-black/45 focus:ring-2 focus:ring-accent"}`}
        />
        <button
          type="submit"
          disabled={submitting}
          className={`whitespace-nowrap rounded-lg px-6 py-3 text-base font-bold transition-colors disabled:opacity-60 ${onYellow ? "bg-black text-white hover:bg-black/85" : "bg-accent text-black hover:bg-accent-hover"}`}
        >
          {submitting ? "Checking..." : "Check the site free"}
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
