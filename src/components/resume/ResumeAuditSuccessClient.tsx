"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type StoredPayload = {
  targetRole: string;
  resumeText: string;
  email?: string;
  savedAt: string;
};

const STORAGE_KEY = "resume_audit_checkout_payload_v1";

export function ResumeAuditSuccessClient() {
  const params = useSearchParams();
  const orderId = useMemo(() => params.get("order_id") ?? "", [params]);
  const email = useMemo(() => params.get("email") ?? "", [params]);

  const [payload, setPayload] = useState<StoredPayload | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredPayload;
      if (!parsed.resumeText || !parsed.targetRole) return;
      setPayload(parsed);
    } catch {
      setPayload(null);
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    async function run() {
      setVerifying(true);
      setError(null);
      try {
        const res = await fetch(`/api/resume-payment-verify?order_id=${encodeURIComponent(orderId)}`);
        const data = (await res.json()) as { ok: boolean; verified?: boolean; error?: string };
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setVerified(false);
          setError(data.error ?? "Payment verification failed.");
          return;
        }
        setVerified(Boolean(data.verified));
        if (!data.verified) {
          setError("Order is not marked as paid yet.");
        }
      } catch {
        if (!cancelled) {
          setVerified(false);
          setError("Payment verification failed.");
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  async function downloadReport() {
    if (!payload || !orderId) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/resume-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderId,
          targetRole: payload.targetRole,
          resumeText: payload.resumeText,
          email: email || payload.email,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Could not generate PDF.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-audit-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Could not generate PDF.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-card-border bg-card-bg p-6">
      <h2 className="text-xl font-bold text-white">Payment Success</h2>
      <p className="mt-2 text-sm text-white/70">
        Order ID: <span className="font-mono text-white/90">{orderId || "missing"}</span>
      </p>
      {email && (
        <p className="mt-1 text-sm text-white/70">
          Email: <span className="text-white/90">{email}</span>
        </p>
      )}

      <div className="mt-5 rounded-xl border border-card-border bg-background p-4">
        {verifying && <p className="text-sm text-white/70">Verifying payment...</p>}
        {!verifying && verified && (
          <p className="text-sm text-emerald-300">
            Payment verified. Your full 10-15 page PDF is ready to generate.
          </p>
        )}
        {!verifying && verified === false && (
          <p className="text-sm text-red-300">
            Payment is not verified yet. Refresh in 30-60 seconds.
          </p>
        )}
      </div>

      {!payload && (
        <p className="mt-4 text-sm text-amber-300">
          We could not find your local resume draft. Go back to the audit page, run the free audit again, then continue to checkout from there.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!payload || !verified || generating}
          onClick={() => void downloadReport()}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover disabled:opacity-50"
        >
          {generating ? "Generating PDF..." : "Download Full PDF Report"}
        </button>
        <a
          href="/labs/resume-audit"
          className="rounded-lg border border-card-border px-5 py-2.5 text-sm font-semibold text-white/85 hover:text-white"
        >
          Back to Resume Audit
        </a>
      </div>
    </div>
  );
}
