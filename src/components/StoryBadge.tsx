import type { StoryKind } from "@/lib/articles";

const LABELS: Record<StoryKind, string> = {
  partner: "Partner Story",
  submitted: "Submit Your Story",
};

/** Same yellow as the Submit Story button, so the badge reads as part of that programme. */
const TONE = "bg-accent text-black";

type Size = "sm" | "xs";

const SIZES: Record<Size, string> = {
  sm: "text-[10px] px-2 py-0.5",
  xs: "text-[9px] px-1.5 py-0.5",
};

interface StoryBadgeProps {
  story?: StoryKind;
  size?: Size;
}

/**
 * Second chip on a preview card, next to the category chip, so a reader can tell
 * at a glance which pieces came in through the Submit Your Story programme.
 */
export function StoryBadge({ story, size = "sm" }: StoryBadgeProps) {
  if (!story) return null;
  return (
    <span
      className={`font-bold rounded uppercase tracking-wider whitespace-nowrap ${SIZES[size]} ${TONE}`}
    >
      {LABELS[story]}
    </span>
  );
}
