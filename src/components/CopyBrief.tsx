"use client";

import { useState } from "react";

export function CopyBrief({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — user can still select the text manually
    }
  }

  return (
    <div className="rounded-xl border-2 border-gray-300 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
        <span className="text-sm font-bold text-gray-900">Your story brief</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-black transition hover:brightness-95"
        >
          {copied ? "Copied ✓" : "Copy to clipboard"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap px-4 py-4 text-[13px] leading-relaxed text-gray-700 font-sans">
        {text}
      </pre>
    </div>
  );
}
