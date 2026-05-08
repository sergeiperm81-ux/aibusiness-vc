"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeDomainAsId } from "@/lib/audit/mock";

interface UrlAuditFormProps {
  variant?: "hero" | "compact";
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

    const looksValid = /\.[a-z]{2,}/i.test(trimmed);
    if (!looksValid) {
      setError("That doesn't look like a valid URL.");
      return;
    }

    setSubmitting(true);
    const id = encodeDomainAsId(trimmed);
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
          {submitting ? "Scanning..." : "Run scan"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourdomain.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 text-base bg-card-bg border border-card-border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-accent text-black text-sm font-bold rounded-lg hover:bg-accent-hover transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-60 whitespace-nowrap"
        >
          {submitting ? "Scanning..." : "Run AI audit"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="mt-3 text-xs text-white/50">
        Takes about 30 seconds.
      </p>
    </form>
  );
}
