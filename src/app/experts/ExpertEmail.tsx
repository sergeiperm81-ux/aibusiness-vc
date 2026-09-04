"use client";

interface Props {
  /** The part before the @. */
  readonly user: string;
  /** The part after the @. */
  readonly host: string;
  readonly className?: string;
}

/**
 * A member's address, unreadable to harvesters.
 *
 * The two halves are rendered separately and only joined inside the click
 * handler, so the page source never contains a mailto: link or a user@domain
 * pattern for a scraper to lift. A person sees a normal address.
 */
export function ExpertEmail({ user, host, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = `mailto:${user}@${host}`;
      }}
      className={className}
      aria-label="Write to this person"
    >
      {user} [at] {host}
    </button>
  );
}
