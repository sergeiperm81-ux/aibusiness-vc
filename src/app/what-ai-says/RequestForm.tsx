"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const FIELD =
  "w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40";
const LABEL = "mb-1 block text-sm font-semibold text-gray-900";
const HINT = "mb-1.5 text-xs leading-relaxed text-gray-600";

/**
 * The longest we accept, mirroring the API.
 *
 * Never expressed as maxLength: the browser silently stops accepting characters and
 * someone pasting prepared text loses the end of it without being told. Counting out
 * loud and refusing to send is the only honest way to hold a limit.
 */
const FIELD_LIMITS = { notes: 2000 } as const;

function Counter({ length, limit }: { length: number; limit: number }) {
  const over = length > limit;
  const close = !over && length > limit * 0.9;
  return (
    <p
      className={
        over
          ? "mt-1 text-xs font-bold text-red-600"
          : close
            ? "mt-1 text-xs font-semibold text-amber-700"
            : "mt-1 text-xs text-gray-500"
      }
    >
      {length}/{limit}
      {over ? ` · ${length - limit} too many, trim before sending` : ""}
    </p>
  );
}

export function RequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    if (notes.length > FIELD_LIMITS.notes) {
      setStatus("error");
      setMessage(
        `Your notes are ${notes.length - FIELD_LIMITS.notes} characters over the ${
          FIELD_LIMITS.notes
        } limit. Nothing is cut for you: shorten it and send again.`
      );
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/what-ai-says", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: value("website"),
          company: value("company"),
          name: value("name"),
          leader: value("leader"),
          product: value("product"),
          category: value("category"),
          market: value("market"),
          email: value("email"),
          notes,
          consent: data.get("consent") === "on",
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!result.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      form.reset();
      setNotes("");
    } catch {
      setStatus("error");
      setMessage(
        "The request could not be sent. Please email info@aibusiness.vc directly and it will be picked up."
      );
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border-2 border-accent bg-accent/10 p-6">
        <p className="text-lg font-bold text-gray-900">Got it.</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-800">
          I run these by hand, five a week. You will hear back from me with one real
          answer about your company and whether it matches your site. If this week is
          full, I will tell you that rather than leave you waiting.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="company">
            Company name
          </label>
          <input id="company" name="company" required className={FIELD} placeholder="Acme AI" />
        </div>
        <div>
          <label className={LABEL} htmlFor="website">
            Website
          </label>
          <input id="website" name="website" required className={FIELD} placeholder="acme.ai" />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="product">
          Your main product or service
        </label>
        <p className={HINT}>
          The one thing you would want a stranger to understand correctly. Half the
          questions are about this.
        </p>
        <input
          id="product"
          name="product"
          required
          className={FIELD}
          placeholder="Acme Review, an AI contract reviewer for in-house legal teams"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="category">
          What you want to be found for
        </label>
        <p className={HINT}>
          One short phrase, in the words a customer would use. This is the question that
          never mentions your name.
        </p>
        <input
          id="category"
          name="category"
          required
          className={FIELD}
          placeholder="AI contract review software for legal teams"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="market">
            Main market and language
          </label>
          <input
            id="market"
            name="market"
            required
            className={FIELD}
            placeholder="United States / English"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="leader">
            Founder or public leader to check <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <p className={HINT}>Leave blank if you would rather I only checked the company.</p>
          <input id="leader" name="leader" className={FIELD} placeholder="Dana Whitfield, CEO" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required className={FIELD} placeholder="Who I write back to" />
        </div>
        <div>
          <label className={LABEL} htmlFor="email">
            Your email
          </label>
          <input id="email" name="email" type="email" required className={FIELD} placeholder="you@company.com" />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="notes">
          Anything I should know <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <p className={HINT}>
          A recent price change, a product you stopped selling, a rebrand, a name you keep
          being confused with. These are where the wrong answers usually come from.
        </p>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={FIELD}
        />
        <Counter length={notes.length} limit={FIELD_LIMITS.notes} />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-800">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0" />
        <span>
          Send the result to this address. Your details are used for this check and
          nothing else.
        </span>
      </label>

      {status === "error" && (
        <p className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-gray-950 px-6 py-3.5 text-base font-bold text-white transition hover:bg-gray-800 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send me the free check"}
      </button>
    </form>
  );
}
