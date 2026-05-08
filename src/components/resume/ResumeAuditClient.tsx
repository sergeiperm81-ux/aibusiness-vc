"use client";

import { useRef, useState } from "react";

interface ResumeAuditMetric {
  key: string;
  label: string;
  score: number;
  note: string;
}

interface ResumeEngineScore {
  key: string;
  label: string;
  score: number;
  note: string;
}

interface ResumeAuditResult {
  overallScore: number;
  verdict: string;
  wordCount: number;
  metrics: ResumeAuditMetric[];
  engineScores: ResumeEngineScore[];
  missingSections: string[];
  missingKeywords: string[];
  strengths: string[];
  recommendations: string[];
  aiPrompts: string[];
}

const STORAGE_KEY = "resume_audit_checkout_payload_v1";

export function ResumeAuditClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<ResumeAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUploadResumeFile(file: File) {
    setError(null);
    setExtracting(true);

    try {
      const lower = file.name.toLowerCase();
      const isPlainText =
        lower.endsWith(".txt") ||
        lower.endsWith(".md") ||
        lower.endsWith(".markdown");

      if (isPlainText) {
        const text = await file.text();
        setResumeText(text);
        return;
      }

      const isSupportedBinary = lower.endsWith(".pdf") || lower.endsWith(".docx");
      if (!isSupportedBinary) {
        setError("Unsupported file type. Use .pdf, .docx, .txt, or .md.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume-extract", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        text?: string;
      };

      if (!response.ok || !data.ok || !data.text) {
        setError(data.error ?? "Could not extract text from this file.");
        return;
      }

      setResumeText(data.text);
    } catch {
      setError("Could not extract text from this file.");
    } finally {
      setExtracting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!targetRole.trim()) {
      setError("Enter your target role.");
      return;
    }

    if (resumeText.trim().length < 120) {
      setError("Paste a fuller CV text (at least 120 characters).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/resume-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetRole,
          resumeText,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: ResumeAuditResult;
      };

      if (!response.ok || !data.ok || !data.result) {
        setError(data.error ?? "Failed to run resume audit.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Failed to run resume audit.");
    } finally {
      setLoading(false);
    }
  }

  async function onUnlockFullReport() {
    setError(null);

    if (!result) {
      setError("Run the basic audit first.");
      return;
    }

    if (!targetRole.trim() || resumeText.trim().length < 120) {
      setError("Target role and resume content are required.");
      return;
    }

    setCheckoutLoading(true);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          targetRole: targetRole.trim(),
          resumeText: resumeText.trim(),
          email: email.trim() || undefined,
          savedAt: new Date().toISOString(),
        })
      );

      const response = await fetch("/api/resume-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        url?: string;
      };

      if (!response.ok || !data.ok || !data.url) {
        setError(data.error ?? "Checkout is not available yet.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Could not start checkout.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-card-border bg-card-bg p-5 sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
              Email (for paid report delivery)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
              Target role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Senior Product Manager (AI), ML Engineer, AI Solutions Consultant..."
              className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
              Resume text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste full resume text here, or upload PDF/DOCX."
              rows={14}
              className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => !extracting && fileInputRef.current?.click()}
            className="rounded-lg border border-card-border px-5 py-2.5 text-sm font-semibold text-white/85 hover:text-white"
          >
            {extracting ? "Extracting..." : "Upload Resume (.pdf/.docx/.txt/.md)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md,.markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUploadResumeFile(file);
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Run Basic Resume Scan"}
          </button>
          <p className="text-xs text-white/50">
            Private beta. Not public in site navigation.
          </p>
        </div>
      </form>

      {result && (
        <div className="space-y-8">
          <section className="rounded-2xl border border-card-border bg-card-bg p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-white/50">
                  AI Resume Score
                </p>
                <div className="mb-2 flex items-baseline gap-2">
                  <span
                    className={`text-5xl font-bold ${
                      result.overallScore >= 85
                        ? "text-emerald-400"
                        : result.overallScore >= 70
                          ? "text-yellow-300"
                          : "text-red-400"
                    }`}
                  >
                    {result.overallScore}
                  </span>
                  <span className="text-2xl text-white/40">/ 100</span>
                </div>
                <p className="text-xs text-white/60">{result.wordCount} words analyzed</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-card-border">
                  <div
                    className={`h-full ${
                      result.overallScore >= 85
                        ? "bg-emerald-500"
                        : result.overallScore >= 70
                          ? "bg-yellow-400"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${result.overallScore}%` }}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-white/50">
                  Summary
                </p>
                <p className="mb-4 text-sm leading-relaxed text-white/80">{result.verdict}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-red-200">Weak metrics</p>
                    <p className="text-xl font-bold text-red-100">
                      {result.metrics.filter((m) => m.score < 70).length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Strong metrics</p>
                    <p className="text-xl font-bold text-emerald-100">
                      {result.metrics.filter((m) => m.score >= 85).length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-amber-200">Missing keywords</p>
                    <p className="text-xl font-bold text-amber-100">{result.missingKeywords.length}</p>
                  </div>
                  <div className="rounded-lg border border-white/20 bg-white/5 px-3 py-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-white/70">Missing sections</p>
                    <p className="text-xl font-bold text-white">{result.missingSections.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {result.engineScores.map((engine) => (
              <article
                key={engine.key}
                className="rounded-xl border border-black/10 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-black/50">
                  {engine.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-black">{engine.score}</p>
                <p className="mt-1 text-xs text-black/60">{engine.note}</p>
              </article>
            ))}
          </section>

          <section className="border-t border-card-border bg-background">
            <div className="rounded-2xl border-2 border-accent bg-gradient-to-br from-amber-500/5 to-amber-500/0 p-8">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
                    Ready for the complete fix plan?
                  </p>
                  <h4 className="mb-3 text-2xl font-bold text-white">Buy Full Resume Report</h4>
                  <p className="mb-4 text-sm leading-relaxed text-white/75">
                    Get one premium PDF for decision-makers and execution. It explains what blocks your resume in AI screening, what to rewrite first, and gives ready instructions for fast implementation.
                  </p>
                  <ul className="grid grid-cols-1 gap-1.5 text-sm text-white/85 sm:grid-cols-2">
                    <li>10-15 page executive PDF in English</li>
                    <li>Detailed AI recruiter score breakdown</li>
                    <li>Top risk areas ranked by hiring impact</li>
                    <li>Rewritten summary + achievement bullets</li>
                    <li>Keyword and section gap map</li>
                    <li>24-hour implementation action plan</li>
                    <li>Copy-paste prompts for ChatGPT/Claude</li>
                    <li>Interview positioning snippets</li>
                  </ul>
                </div>
                <div className="lg:col-span-1">
                  <div className="rounded-xl border border-card-border bg-card-bg p-5">
                    <p className="mb-1 text-xs text-white/60">Resume Audit</p>
                    <p className="mb-1 text-3xl font-bold text-white">EUR 29</p>
                    <p className="mb-4 text-xs text-white/50">One-time payment</p>
                    <button
                      type="button"
                      onClick={() => void onUnlockFullReport()}
                      disabled={checkoutLoading}
                      className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-black hover:bg-accent-hover disabled:opacity-60"
                    >
                      {checkoutLoading ? "Redirecting to checkout..." : "Buy Full Report"}
                    </button>
                    <p className="mt-3 text-center text-[11px] text-white/50">
                      Secure checkout. PDF download after payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
