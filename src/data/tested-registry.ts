/**
 * The public registry of express test purchases.
 *
 * One entry per company under check. The entry records that an outsider checks
 * this service and when it was last verified. What the checks found is never
 * published: those findings belong to the company that paid for them.
 *
 * Numbers are sequential and never reused. The QR code on a client's badge
 * and on the Verified Test Purchase PDF resolves to /tested/<number>, which
 * makes a forged badge detectable with one scan: no entry, no verification.
 */

export type TestedItemStatus = "confirmed" | "not_confirmed";

export interface TestedItem {
  /** What was checked, phrased as the promise's subject — never the script. */
  subject: string;
  status: TestedItemStatus;
}

export interface TestedEntry {
  /** Zero-padded sequential number: "0001". Appears on the badge and PDF. */
  number: string;
  company: string;
  /** The customer-facing service that was tested, in one line. */
  service: string;
  /** The client's site. Displayed, not linked with authority: rel=sponsored. */
  url: string;
  /** ISO date of the purchase itself. */
  checkDate: string;
  /**
   * The agreed items with their statuses: ten by default, up to twenty.
   * Kept for the private report and the PDF; never rendered on the site.
   */
  items: TestedItem[];
  /** Slug of the full write-up in the Tested section, once published. */
  articleSlug?: string;
  /** Set when the service changed materially and the record was paused. */
  suspended?: boolean;
}

/** Days an entry stays in active status before it is archived. */
export const ACTIVE_DAYS = 183;

/**
 * Counters kept by hand alongside the entries. Active and archived counts are
 * derived from the dates, so only the running total lives here.
 */
export const TESTED_STATS = {
  /** Test purchases carried out since the registry opened. */
  checksTotal: 0,
};

export const TESTED_ENTRIES: TestedEntry[] = [
  // The first published check starts the registry. Format:
  // {
  //   number: "0001",
  //   company: "Example GmbH",
  //   service: "AI booking assistant on example.com",
  //   url: "https://example.com",
  //   checkDate: "2026-09-01",
  //   items: [
  //     { subject: "Discloses that the visitor is talking to an AI", status: "confirmed" },
  //     ...ten to twenty...
  //   ],
  //   articleSlug: "example-gmbh-booking-assistant",
  // },
];

export function getEntry(number: string): TestedEntry | undefined {
  return TESTED_ENTRIES.find((e) => e.number === number);
}

export type EntryStatus = "active" | "archived" | "suspended";

export function entryStatus(entry: TestedEntry, now: Date): EntryStatus {
  if (entry.suspended) return "suspended";
  const expiry = new Date(entry.checkDate);
  expiry.setDate(expiry.getDate() + ACTIVE_DAYS);
  return now > expiry ? "archived" : "active";
}

export function activeUntil(entry: TestedEntry): Date {
  const d = new Date(entry.checkDate);
  d.setDate(d.getDate() + ACTIVE_DAYS);
  return d;
}
