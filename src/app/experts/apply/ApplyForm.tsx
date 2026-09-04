"use client";

import { useState } from "react";
import {
  AVAILABILITY,
  INDUSTRIES,
  PRACTICE_GROUPS,
  REGIONS,
  WORK_FORMATS,
} from "../experts";
import { PhotoPicker, type PickedPhoto } from "./PhotoPicker";

type Status = "idle" | "sending" | "done" | "error";

const FIELD =
  "w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40";
const LABEL = "mb-1 block text-sm font-semibold text-gray-900";
// The visible heading is a plain block inside the box. A real <legend> sits on
// the fieldset border and floating it to move it inside breaks the layout, so
// the legend is kept for screen readers only.
const LEGEND =
  "mb-4 rounded-lg bg-accent px-4 py-1.5 text-base font-bold uppercase tracking-wide text-black";

export function ApplyForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [workFormats, setWorkFormats] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  // Kept in state so the person can watch their card take shape while filling this in.
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");

  function toggle(
    value: string,
    set: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    set((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]));
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
    if (practiceAreas.length === 0 && !other.trim()) {
      setStatus("error");
      setMessage("Pick at least one practice area.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: text("email"),
      headline: headline.trim(),
      role: text("role"),
      organisation: text("organisation"),
      region: text("region"),
      location: location.trim(),
      about: text("about"),
      services: text("services"),
      linkedin: text("linkedin"),
      website: text("website"),
      phone: text("phone"),
      showEmail: form.get("showEmail") === "on",
      showPhone: form.get("showPhone") === "on",
      showLinkedin: form.get("showLinkedin") === "on",
      showWebsite: form.get("showWebsite") === "on",
      practiceAreas: other.trim() ? [...practiceAreas, `Other: ${other.trim()}`] : practiceAreas,
      industries,
      workFormats,
      languages: text("languages"),
      availability: text("availability"),
      consent: form.get("consent") === "on",
      newsletter: form.get("newsletter") === "on",
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

  const chip = (active: boolean) =>
    active
      ? "rounded-lg border-2 border-amber-500 bg-amber-400 px-3 py-1.5 text-sm font-bold text-gray-950"
      : "rounded-lg border-2 border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-amber-500 hover:bg-amber-50";

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center">
        <div className="mb-2 text-2xl">✅</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Sent for review</h2>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-700">
          Your profile is not on the site yet. We check that the person and the links are real,
          nothing more, and that usually takes a couple of days. If anything is unclear we write
          to you first, and you get an email the moment the profile goes live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <fieldset className="rounded-2xl border-2 border-gray-200 p-6">
        <legend className="sr-only">Your photo *</legend>
        <div className={LEGEND}>Your photo *</div>
        <p className="mb-4 text-sm text-gray-600">
          Position your face inside the circle. That square is exactly what gets published.
        </p>
        <PhotoPicker onChange={setPhoto} />
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border-2 border-gray-200 p-6">
        <legend className="sr-only">You</legend>
        <div className={LEGEND}>You</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="name">
              Full name *
            </label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={FIELD}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="headline">
              One-line headline *{" "}
              <span className="font-normal text-amber-700">this is the line on your card</span>
            </label>
            <input
              id="headline"
              name="headline"
              required
              maxLength={120}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={FIELD}
              placeholder="EU AI Act compliance lead for regulated industries"
            />
            <p className="mt-1 text-xs text-gray-500">{headline.length}/120</p>
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={FIELD}
              placeholder="Berlin, or Germany, or Berlin, Germany"
            />
          </div>
        </div>
      </fieldset>

      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
        <p className="mb-2 text-2xl font-bold leading-tight text-gray-900">
          How your card will look in the catalogue
        </p>
        <p className="mb-6 text-base leading-relaxed text-gray-800">
          This is the preview people scroll past. Everything else you write lives on your own
          page, one click deeper.
        </p>
        <div className="mx-auto flex w-full max-w-xs flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`data:${photo.type};base64,${photo.data}`}
              alt=""
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-accent">
              photo
            </span>
          )}
          <p className="mt-4 text-base font-bold text-gray-900">{name || "Your name"}</p>
          <p className="mt-0.5 text-xs text-gray-500">{location || "Your location"}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {headline || "Your one-line headline goes here"}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {practiceAreas.slice(0, 2).map((s) => (
              <span
                key={s}
                className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-black"
              >
                {s}
              </span>
            ))}
            {practiceAreas.length > 2 && (
              <span className="rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                +{practiceAreas.length - 2}
              </span>
            )}
          </div>
        </div>
        {practiceAreas.length > 2 && (
          <p className="mt-4 text-center text-xs text-gray-600">
            Tick as many as you like: the card shows the first two and a counter, and your page
            lists them all.
          </p>
        )}
      </div>

      <fieldset className="rounded-2xl border-2 border-gray-200 p-6">
        <legend className="sr-only">Your expertise</legend>
        <div className={LEGEND}>Your expertise</div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <p className="mb-2 text-sm font-semibold text-gray-900">
          Practice areas: what you actually do *
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Pick everything that applies, across as many groups as you like.
        </p>
        {PRACTICE_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-700">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggle(s, setPracticeAreas)}
                  aria-pressed={practiceAreas.includes(s)}
                  className={chip(practiceAreas.includes(s))}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}

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

        <p className="mb-3 mt-8 text-sm font-semibold text-gray-900">Industries you know</p>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s, setIndustries)}
              aria-pressed={industries.includes(s)}
              className={chip(industries.includes(s))}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-8 text-sm font-semibold text-gray-900">Work you are open to</p>
        <div className="flex flex-wrap gap-2">
          {WORK_FORMATS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s, setWorkFormats)}
              aria-pressed={workFormats.includes(s)}
              className={chip(workFormats.includes(s))}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="languages">
              Working languages
            </label>
            <input id="languages" name="languages" className={FIELD} placeholder="English, German" />
          </div>
          <div>
            <label className={LABEL} htmlFor="availability">
              Availability
            </label>
            <select id="availability" name="availability" defaultValue="" className={FIELD}>
              <option value="">Prefer not to say</option>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
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
              Services you offer, in plain words *
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

      <fieldset className="space-y-5 rounded-2xl border-2 border-gray-200 p-6">
        <legend className="sr-only">Contacts</legend>
        <div className={LEGEND}>Contacts</div>
        <p className="text-sm text-gray-600">
          You decide what is public. Published addresses are written into the page in a form
          that makes casual harvesting harder, the same way our own address is handled, but
          anything published anywhere can eventually be read. If you would rather not risk it,
          leave the box unticked and we pass enquiries on to you ourselves.
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
            <span>
              Show my email on my profile. Leave it unticked and only AI Business sees it.
            </span>
          </label>
        </div>

        <div>
          <label className={LABEL} htmlFor="linkedin">
            LinkedIn * <span className="font-normal text-gray-500">(how we verify you)</span>
          </label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            required
            className={FIELD}
            placeholder="https://www.linkedin.com/in/..."
          />
          <label className="mt-2 flex items-start gap-2.5 text-sm leading-snug text-gray-700">
            <input
              type="checkbox"
              name="showLinkedin"
              defaultChecked
              className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
            />
            <span>Show my LinkedIn on my profile</span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="website">
              Website
            </label>
            <input id="website" name="website" type="url" className={FIELD} placeholder="https://" />
            <label className="mt-2 flex items-start gap-2.5 text-sm leading-snug text-gray-700">
              <input
                type="checkbox"
                name="showWebsite"
                defaultChecked
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
              />
              <span>Show my website on my profile</span>
            </label>
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
      </fieldset>

      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
        <label className="flex items-start gap-2.5 text-sm leading-snug text-gray-700">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
          />
          <span>
            These are my own details. I agree to have this profile published on aibusiness.vc and
            to receive email from AI Business: new people in the community, work coming through,
            and what the register is doing next. I understand AI Business decides what goes into
            the register and may decline a profile without giving reasons. I can have the profile
            changed or removed, and unsubscribe, at any time. *
          </span>
        </label>
      </div>

      {status === "error" && <p className="text-sm font-semibold text-red-600">{message}</p>}

      <p className="text-sm text-gray-600">
        Nothing is published straight away: this goes to the editor first.
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-amber-400 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send for review"}
      </button>
    </form>
  );
}
