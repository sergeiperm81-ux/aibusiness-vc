"use client";

import { useState } from "react";

export function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="px-3 py-1 bg-card-bg border border-card-border text-white text-[11px] font-semibold rounded-md hover:bg-card-border transition-colors"
    >
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}
