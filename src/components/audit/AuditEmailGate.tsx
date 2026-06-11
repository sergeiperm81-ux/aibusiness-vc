"use client";

import { useState } from "react";

interface Props {
  auditId: string;
  domain: string;
  overallScore: number;
}

const PERKS = [
  "Your full score breakdown across all 8 signals",
  "A prioritized GEO action plan — exactly what to fix first",
  "How to get cited by ChatGPT, Perplexity, Gemini & Google AI",
  "Ready-to-use llms.txt + schema guidance",
];

export function AuditEmailGate({ auditId, domain, overallScore }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/audit/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), auditId, consent }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("done");
        setMessage(data.message ?? "Report sent — check your inbox.");
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
      <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/5 p-8 text-center">
        <div className="mb-2 text-3xl">✅</div>
        <h2 className="mb-2 text-2xl font-bold text-white">Your report is on its way</h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-white/70">{message}</p>
        <p className="mt-3 text-xs text-white/40">
          Sent to your inbox for <span className="font-semibold text-white/70">{domain}</span>. Didn&apos;t arrive in
          a minute? Check spam or try another address.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-amber-500/5 to-amber-500/0 p-8">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Want to know exactly what to fix?
          </p>
          <h2 className="mb-3 text-2xl font-bold text-white">
            Get your full report + GEO recommendations — free
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {domain} scored {overallScore}/100. Drop your email and we&apos;ll send the complete
            breakdown plus a step-by-step plan to get your site seen and cited by AI search.
          </p>
          <ul className="grid grid-cols-1 gap-1.5 text-sm text-white/80 sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-card-border bg-card-bg p-5"
          >
            <label htmlFor="audit-email" className="mb-1 block text-xs text-white/60">
              Your email
            </label>
            <input
              id="audit-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-card-border bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <label className="mt-3 flex items-start gap-2 text-[11px] leading-snug text-white/60">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-amber-500"
              />
              <span>
                I agree to receive my report and occasional emails from AI Business, and to the{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                  Privacy Policy
                </a>
                . I can unsubscribe anytime.
              </span>
            </label>
            <button
              type="submit"
              disabled={status === "sending" || !consent}
              className="mt-3 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-95 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Email me the full report"}
            </button>
            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">{message}</p>
            )}
            <p className="mt-3 text-center text-[11px] text-white/40">
              Free. No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
