"use client";

import { useState } from "react";
import { EXPERTISE, REGIONS } from "../experts";
import { PhotoPicker, type PickedPhoto } from "./PhotoPicker";

type Status = "idle" | "sending" | "done" | "error";

const FIELD =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50";
const LABEL = "mb-1 block text-sm font-semibold text-gray-900";
const LEGEND = "mb-1 text-lg font-bold text-gray-900";

export function ApplyForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);

  function toggle(value: string) {
    setExpertise((list) =>
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();

    if (!photo) {
      setStatus("error");
      setMessage("Add a photo. It is the first thing anyone sees.");
      return;
    }
    if (expertise.length === 0 && !other.trim()) {
      setStatus("error");
      setMessage("Pick at least one area of expertise.");
      return;
    }

    const payload = {
      name: text("name"),
      email: text("email"),
      headline: text("headline"),
      role: text("role"),
      organisation: text("organisation"),
      region: text("region"),
      location: text("location"),
      about: text("about"),
      services: text("services"),
      linkedin: text("linkedin"),
      website: text("website"),
      phone: text("phone"),
      notes: text("notes"),
      showEmail: form.get("showEmail") === "on",
      showPhone: form.get("showPhone") === "on",
      expertise: other.trim() ? [...expertise, `Other: ${other.trim()}`] : expertise,
      consent: form.get("consent") === "on",
      photo,
    };

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
        <h2 className="mb-2 text-xl font-bold text-gray-900">You are in the queue</h2>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-700">
          We check that the person and the links are real, nothing more, and that usually takes a
          couple of days. If anything is unclear we will write to you before publishing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <fieldset>
        <legend className={LEGEND}>Your photo *</legend>
        <p className="mb-4 text-sm text-gray-600">
          Position your face inside the circle. That square is exactly what gets published.
        </p>
        <PhotoPicker onChange={setPhoto} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={LEGEND}>You</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="name">
              Full name *
            </label>
            <input id="name" name="name" required className={FIELD} placeholder="Your name" />
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
            <input
              id="organisation"
              name="organisation"
              className={FIELD}
              placeholder="Company, or independent"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <label className={LABEL} htmlFor="location">
              Location *
            </label>
            <input
              id="location"
              name="location"
              required
              className={FIELD}
              placeholder="Berlin, or Germany, or Berlin, Germany"
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className={LEGEND}>What you do</legend>
        <p className="mb-3 text-sm text-gray-600">Pick everything that applies *</p>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
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

        <div className="mt-4">
          <label className={LABEL} htmlFor="other">
            Other, in your own words
          </label>
          <input
            id="other"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            className={FIELD}
            placeholder="Something the list above does not cover"
          />
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
              placeholder="What you work on, who you help and what you are known for."
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

      <fieldset className="space-y-5">
        <legend className={LEGEND}>Contacts</legend>
        <p className="text-sm text-gray-600">
          You decide what is public. Anything published here is written into the page so that
          scrapers cannot lift it, the same way our own address is handled.
        </p>

        <div>
          <label className={LABEL} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={FIELD}
            placeholder="you@email.com"
          />
          <label className="mt-2 flex items-start gap-2.5 text-sm leading-snug text-gray-700">
            <input
              type="checkbox"
              name="showEmail"
              className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
            />
            <span>Show my email on my profile. Leave it unticked and only we see it.</span>
          </label>
        </div>

        <div>
          <label className={LABEL} htmlFor="linkedin">
            LinkedIn *{" "}
            <span className="font-normal text-gray-500">(published, and how we verify you)</span>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="website">
              Website <span className="font-normal text-gray-500">(published if given)</span>
            </label>
            <input id="website" name="website" type="url" className={FIELD} placeholder="https://" />
          </div>
          <div>
            <label className={LABEL} htmlFor="phone">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" className={FIELD} placeholder="+49 ..." />
            <label className="mt-2 flex items-start gap-2.5 text-sm leading-snug text-gray-700">
              <input
                type="checkbox"
                name="showPhone"
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
              />
              <span>Show my phone on my profile</span>
            </label>
          </div>
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
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
          />
          <span>
            These are my own details. I agree to have this profile published on aibusiness.vc and
            to receive email from AI Business: new members, briefs from companies looking for
            help, and community news. I can edit or remove the profile, or unsubscribe, at any
            time. *
          </span>
        </label>
      </div>

      {status === "error" && <p className="text-sm font-semibold text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-amber-400 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Claim my expertise"}
      </button>
    </form>
  );
}
