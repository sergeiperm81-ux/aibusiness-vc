"use client";

import { useState } from "react";
import { EXPERTISE, REGIONS, WORK_TYPES } from "../experts";

type Status = "idle" | "sending" | "done" | "error";

const FIELD =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50";
const LABEL = "mb-1 block text-sm font-semibold text-gray-900";

export function ApplyForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      headline: String(form.get("headline") ?? "").trim(),
      region: String(form.get("region") ?? ""),
      country: String(form.get("country") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      languages: String(form.get("languages") ?? "").trim(),
      linkedin: String(form.get("linkedin") ?? "").trim(),
      website: String(form.get("website") ?? "").trim(),
      organisation: String(form.get("organisation") ?? "").trim(),
      role: String(form.get("role") ?? "").trim(),
      about: String(form.get("about") ?? "").trim(),
      services: String(form.get("services") ?? "").trim(),
      proof: String(form.get("proof") ?? "").trim(),
      environment: String(form.get("environment") ?? ""),
      notes: String(form.get("notes") ?? "").trim(),
      expertise,
      workTypes,
      consent: form.get("consent") === "on",
    };

    if (expertise.length === 0) {
      setStatus("error");
      setMessage("Pick at least one area of expertise.");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/experts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
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
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center">
        <div className="mb-2 text-2xl">✅</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Application received</h2>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-700">
          We check that the person and the links are real, nothing more, and that usually takes a
          couple of days. If anything is unclear we will write to you before publishing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-3 text-lg font-bold text-gray-900">You</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="name">
              Full name *
            </label>
            <input id="name" name="name" required className={FIELD} placeholder="Your name" />
          </div>
          <div>
            <label className={LABEL} htmlFor="email">
              Email * <span className="font-normal text-gray-500">(admin only, not published)</span>
            </label>
            <input id="email" name="email" type="email" required className={FIELD} placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label className={LABEL} htmlFor="headline">
            One-line headline *
          </label>
          <input
            id="headline"
            name="headline"
            required
            maxLength={120}
            className={FIELD}
            placeholder="EU AI Act compliance lead for regulated industries"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="role">
              Current role
            </label>
            <input id="role" name="role" className={FIELD} placeholder="Independent consultant" />
          </div>
          <div>
            <label className={LABEL} htmlFor="organisation">
              Organisation
            </label>
            <input id="organisation" name="organisation" className={FIELD} placeholder="Company or independent" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold text-gray-900">Where you are</legend>
        <p className="mb-3 text-sm text-gray-600">
          The region drives the search filter. Country and city are shown on your card.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={LABEL} htmlFor="region">
              Region *
            </label>
            <select id="region" name="region" required defaultValue="" className={FIELD}>
              <option value="" disabled>
                Choose a region
              </option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL} htmlFor="country">
              Country *
            </label>
            <input id="country" name="country" required className={FIELD} placeholder="Germany" />
          </div>
          <div>
            <label className={LABEL} htmlFor="city">
              City
            </label>
            <input id="city" name="city" className={FIELD} placeholder="Berlin" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="languages">
              Working languages *
            </label>
            <input id="languages" name="languages" required className={FIELD} placeholder="English, German" />
          </div>
          <div>
            <label className={LABEL} htmlFor="environment">
              Work environment
            </label>
            <select id="environment" name="environment" defaultValue="Remote" className={FIELD}>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-lg font-bold text-gray-900">What you do</legend>
        <p className="mb-3 text-sm text-gray-600">Areas of expertise, pick all that apply *</p>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(expertise, s, setExpertise)}
              aria-pressed={expertise.includes(s)}
              className={
                expertise.includes(s)
                  ? "rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900"
                  : "rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-amber-400"
              }
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-6 text-sm text-gray-600">How you take work on</p>
        <div className="flex flex-wrap gap-2">
          {WORK_TYPES.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => toggle(workTypes, w, setWorkTypes)}
              aria-pressed={workTypes.includes(w)}
              className={
                workTypes.includes(w)
                  ? "rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900"
                  : "rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-amber-400"
              }
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className={LABEL} htmlFor="about">
              About you *
            </label>
            <textarea
              id="about"
              name="about"
              required
              rows={4}
              maxLength={900}
              className={FIELD}
              placeholder="What you work on, who you help and what you are known for. A short paragraph."
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="services">
              Services you offer *
            </label>
            <textarea
              id="services"
              name="services"
              required
              rows={3}
              className={FIELD}
              placeholder="One per line, for example: EU AI Act gap assessment"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold text-gray-900">Links</legend>
        <p className="mb-3 text-sm text-gray-600">
          We confirm identity from these. LinkedIn is required, one more link helps.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="linkedin">
              LinkedIn *
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              required
              className={FIELD}
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="website">
              Website
            </label>
            <input id="website" name="website" type="url" className={FIELD} placeholder="https://" />
          </div>
        </div>
        <div>
          <label className={LABEL} htmlFor="proof">
            Supporting links
          </label>
          <textarea
            id="proof"
            name="proof"
            rows={2}
            className={FIELD}
            placeholder="Publications, talks, certifications, company page. One per line."
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="notes">
            Anything else we should know?
          </label>
          <textarea id="notes" name="notes" rows={2} className={FIELD} />
        </div>
      </fieldset>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-start gap-2.5 text-sm leading-snug text-gray-700">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-amber-500" />
          <span>
            I am submitting my own details and agree to have this profile published on
            aibusiness.vc. I can ask for it to be changed or removed at any time. *
          </span>
        </label>
      </div>

      {status === "error" && <p className="text-sm font-semibold text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-amber-400 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
