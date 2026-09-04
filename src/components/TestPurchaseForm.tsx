"use client";

import { useState } from "react";

/**
 * The express test purchase application: three fields, nothing else.
 *
 * Only live services are tested, so there is no "still building" track and no
 * free-text brief. Name, email, and where the AI service lives — screening
 * does the rest. Posts to the same mailbox as the old two-track form.
 */
export function TestPurchaseForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      track: "existing",
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      link: String(form.get("link") ?? ""),
      details: "Express test purchase application",
      company: String(form.get("company") ?? ""),
    };

    setStatus("sending");
    try {
      const response = await fetch("/api/assurance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus("idle");
        setError(data.error ?? "Could not send that. Please try again, or use the email address in the site footer.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("Could not send that. Please try again, or use the email address in the site footer.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5">
        <p className="text-base font-bold text-emerald-900">Got it.</p>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-800">
          I read every application myself and reply within two working days: either your
          service can be checked and we start, or I tell you honestly why it cannot.
        </p>
      </div>
    );
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tp-name" className="text-sm font-bold text-gray-900">
            Your name
          </label>
          <input id="tp-name" name="name" type="text" autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="tp-email" className="text-sm font-bold text-gray-900">
            Email <span className="font-normal text-gray-500">(required)</span>
          </label>
          <input id="tp-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="tp-link" className="text-sm font-bold text-gray-900">
          Where is your AI service? <span className="font-normal text-gray-500">(required)</span>
        </label>
        <input
          id="tp-link"
          name="link"
          type="text"
          inputMode="url"
          required
          placeholder="https://yourcompany.com, a chat link, or an app page"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
          Only live services are checked. If yours is still being built, come back when
          customers can use it.
        </p>
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="tp-company">Company</label>
        <input id="tp-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-accent px-5 py-3 text-base font-bold text-black transition hover:brightness-95 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send the application"}
      </button>

      <p className="text-xs leading-relaxed text-gray-500">
        Screening is free. You pay only after I confirm your service can be checked.
      </p>
    </form>
  );
}
