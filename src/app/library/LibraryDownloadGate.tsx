"use client";

import { useState } from "react";

interface Props {
  slug: string;
  title: string;
  pdf: string;
  fileLabel?: string;
}

type Status = "idle" | "sending" | "done" | "error";

export function LibraryDownloadGate({ slug, title, pdf, fileLabel = "PDF" }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, slug }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
        if (typeof window !== "undefined") window.open(pdf, "_blank", "noopener");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
        <div className="mb-2 text-2xl">✅</div>
        <h3 className="mb-1 text-lg font-bold text-gray-900">Your guide is ready</h3>
        <p className="mb-4 text-sm text-gray-600">
          If the download didn&apos;t open automatically, use the button below.
        </p>
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-amber-400"
        >
          Download the {fileLabel} →
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
      <h3 className="mb-1 text-lg font-bold text-gray-900">Get the {fileLabel} — free</h3>
      <p className="mb-4 text-sm text-gray-600">
        Drop your email and get instant access to{" "}
        <span className="font-semibold text-gray-900">{title}</span>. No spam — just an occasional
        note when a new guide is published.
      </p>
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-4">
        <label htmlFor="library-email" className="mb-1 block text-xs text-gray-500">
          Your email
        </label>
        <input
          id="library-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <label className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-gray-500">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-amber-500"
          />
          <span>
            I agree to receive this guide and occasional emails from AI Business, and to the{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Privacy Policy
            </a>
            . I can unsubscribe anytime.
          </span>
        </label>
        <button
          type="submit"
          disabled={status === "sending" || !consent}
          className="mt-3 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-amber-400 disabled:opacity-60"
        >
          {status === "sending" ? "Preparing…" : "Get the guide"}
        </button>
        {status === "error" && <p className="mt-2 text-xs text-red-500">{message}</p>}
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Free. No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
