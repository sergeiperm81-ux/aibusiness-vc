"use client";

import { useState } from "react";
import { ContactEmail } from "@/components/ContactEmail";

export type AssuranceTrack = "existing" | "building";

interface AssuranceFormProps {
  readonly track: AssuranceTrack;
}

interface FieldCopy {
  readonly linkLabel: string;
  readonly linkPlaceholder: string;
  readonly linkHint: string;
  readonly detailsLabel: string;
  readonly detailsPlaceholder: string;
  readonly submit: string;
}

const COPY: Record<AssuranceTrack, FieldCopy> = {
  existing: {
    linkLabel: "Where can I reach your bot?",
    linkPlaceholder: "https://yourcompany.com/support, or a WhatsApp number",
    linkHint:
      "A page with the chat widget, a direct link, or a phone number. If it sits behind a login, say so and we will sort out access.",
    detailsLabel: "What is your agent supposed to promise customers, and where is that written down?",
    detailsPlaceholder:
      "It answers questions about our pricing and books consultations. We are not sure what it says when someone asks for a discount.",
    submit: "Send it for a test purchase",
  },
  building: {
    linkLabel: "Your website",
    linkPlaceholder: "https://yourcompany.com",
    linkHint:
      "Whatever exists today: a site, a landing page, even a social profile. It tells me what your company already promises customers.",
    detailsLabel: "Which service will the agent handle?",
    detailsPlaceholder:
      "We want it to take booking requests for our clinic and answer questions about prices and availability. A developer starts in September.",
    submit: "Send it for requirements",
  },
};

export function AssuranceForm({ track }: AssuranceFormProps) {
  const copy = COPY[track];
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      track,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      link: String(form.get("link") ?? ""),
      details: String(form.get("details") ?? ""),
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
          I read every one of these myself and reply within two working days, with a fixed price
          and a date, or with an honest reason why this is not the right service for you.
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
          <label htmlFor={`${track}-name`} className="text-sm font-bold text-gray-900">
            Your name
          </label>
          <input id={`${track}-name`} name="name" type="text" autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${track}-email`} className="text-sm font-bold text-gray-900">
            Email <span className="font-normal text-gray-500">(required)</span>
          </label>
          <input
            id={`${track}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${track}-link`} className="text-sm font-bold text-gray-900">
          {copy.linkLabel}
        </label>
        <input
          id={`${track}-link`}
          name="link"
          type="text"
          inputMode="url"
          placeholder={copy.linkPlaceholder}
          className={inputClass}
        />
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{copy.linkHint}</p>
      </div>

      <div>
        <label htmlFor={`${track}-details`} className="text-sm font-bold text-gray-900">
          {copy.detailsLabel} <span className="font-normal text-gray-500">(required)</span>
        </label>
        <textarea
          id={`${track}-details`}
          name="details"
          required
          rows={4}
          placeholder={copy.detailsPlaceholder}
          className={inputClass}
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${track}-company`}>Company</label>
        <input id={`${track}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-gray-950 px-5 py-3 text-base font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : copy.submit}
      </button>

      <p className="text-xs leading-relaxed text-gray-500">
        Your details are used to reply to you and nothing else. No list, no newsletter. Prefer
        email? <ContactEmail className="font-semibold text-amber-600 hover:underline" />
      </p>
    </form>
  );
}
