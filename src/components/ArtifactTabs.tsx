"use client";

import { useState } from "react";

export interface Artifact {
  readonly id: string;
  readonly tab: string;
  readonly title: string;
  readonly lead: string;
  /** Questions the document answers. Deliberately the shape, not the method. */
  readonly answers: readonly string[];
  readonly footnote: string;
}

interface ArtifactTabsProps {
  readonly artifacts: readonly Artifact[];
}

export function ArtifactTabs({ artifacts }: ArtifactTabsProps) {
  const [active, setActive] = useState(artifacts[0]?.id ?? "");
  const current = artifacts.find((a) => a.id === active) ?? artifacts[0];

  if (!current) return null;

  return (
    <div>
      <div role="tablist" aria-label="What each document contains" className="flex flex-wrap gap-2">
        {artifacts.map((artifact) => {
          const selected = artifact.id === current.id;
          return (
            <button
              key={artifact.id}
              type="button"
              role="tab"
              id={`tab-${artifact.id}`}
              aria-selected={selected}
              aria-controls={`panel-${artifact.id}`}
              onClick={() => setActive(artifact.id)}
              // The site's buttons are amber. A white pill read as a disabled
              // control rather than a tab you can press.
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                selected
                  ? "bg-accent text-black"
                  : "border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
              }`}
            >
              {artifact.tab}
            </button>
          );
        })}
      </div>

      {/*
        Every panel is rendered, and the inactive ones are hidden rather than
        omitted. Rendering only the open tab meant a crawler saw one document
        out of three, which is a poor look on a page about machine readability.
      */}
      {artifacts.map((artifact) => (
        <div
          key={artifact.id}
          role="tabpanel"
          id={`panel-${artifact.id}`}
          aria-labelledby={`tab-${artifact.id}`}
          hidden={artifact.id !== current.id}
          className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h3 className="text-xl font-bold text-gray-900">{artifact.title}</h3>
          <p className="mt-2 text-base leading-relaxed text-gray-700">{artifact.lead}</p>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-amber-600">
            Questions it answers
          </p>
          <ul className="mt-3 space-y-2.5">
            {artifact.answers.map((answer) => (
              <li key={answer} className="flex gap-3 text-base leading-relaxed text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{answer}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-500">
            {artifact.footnote}
          </p>
        </div>
      ))}
    </div>
  );
}
