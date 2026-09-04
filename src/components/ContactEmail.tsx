"use client";

/**
 * The contact address, unreadable to harvesters.
 *
 * Spam bots collect addresses by scanning HTML for mailto: links and
 * user@domain patterns. Neither exists here: the static markup contains only
 * "info [at] aibusiness.vc" split across elements, and the real address is
 * assembled from parts in the click handler, at which point a human is
 * already involved. A person sees a normal address and gets a normal mail
 * window; a scraper reading the page source gets nothing to join.
 */

const USER = "info";
const HOST = ["aibusiness", "vc"];

interface ContactEmailProps {
  readonly className?: string;
  /** Pre-fills the subject line once a person clicks. */
  readonly subject?: string;
  /** Replaces the default "info [at] aibusiness.vc" label. */
  readonly children?: React.ReactNode;
}

export function ContactEmail({ className, subject, children }: ContactEmailProps) {
  const openMail = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    window.location.href = `mailto:${USER}@${HOST.join(".")}${query}`;
  };

  return (
    <a href="#contact" onClick={openMail} className={className} rel="nofollow">
      {children ?? (
        <>
          <span>{USER}</span>
          <span aria-hidden> [at] </span>
          <span>{HOST.join(".")}</span>
        </>
      )}
    </a>
  );
}
