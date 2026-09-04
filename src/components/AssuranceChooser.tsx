"use client";

import { useState } from "react";
import { AssuranceForm, type AssuranceTrack } from "@/components/AssuranceForm";

/**
 * One form, always visible, with a switch at the top.
 *
 * The questions are the same either way; only the entry point differs, so
 * hiding the form behind a choice made the visitor work for nothing. The
 * panel is white because the form's fields are built for a light surface:
 * on the dark section they were unreadable.
 */
const OPTIONS: readonly { track: AssuranceTrack; label: string }[] = [
  { track: "existing", label: "My bot is already live" },
  { track: "building", label: "We are still building it" },
];

export function AssuranceChooser() {
  const [track, setTrack] = useState<AssuranceTrack>("existing");

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="border-b border-gray-200 p-6 sm:p-8">
        <p className="mb-3 text-sm font-bold text-gray-900">Which one are you?</p>
        <div
          role="tablist"
          aria-label="Entry point"
          className="flex gap-1 rounded-xl bg-gray-100 p-1"
        >
          {OPTIONS.map((option) => {
            const active = option.track === track;
            return (
              <button
                key={option.track}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTrack(option.track)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-accent text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <AssuranceForm key={track} track={track} />
      </div>
    </div>
  );
}
