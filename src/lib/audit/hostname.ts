/**
 * Hostname syntax rules shared by the browser form and the server scanner.
 *
 * Kept free of Node imports on purpose: the audit form is a client component,
 * so anything it validates against has to run in a browser too. DNS resolution
 * and private-address checks live in `safe-host.ts`, server side only.
 */

export interface HostCheck {
  readonly ok: boolean;
  /** Short, user-safe reason. Never leaks internal addresses. */
  readonly reason?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata",
  "metadata.google.internal",
]);

const BLOCKED_SUFFIXES = [".local", ".internal", ".localhost", ".home.arpa", ".onion"];

/** A single DNS label: letters, digits, hyphens, not starting or ending with one. */
const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

/** True for anything that is written as an IP literal rather than a name. */
export function looksLikeIpLiteral(host: string): boolean {
  if (IPV4.test(host)) return true;
  // Any colon means IPv6 (bracketed or not); no hostname legally contains one.
  return host.includes(":");
}

/**
 * Reduces user input to a bare hostname.
 *
 * Credentials, path, query and port are all removed, in that order — leaving
 * any of them in lets `example.com@127.0.0.1` reach the network layer.
 */
export function normalizeHostname(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^[^/@]*@/, "")
    .replace(/[/?#].*$/, "")
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

/**
 * Accepts only a plain, public-looking hostname.
 *
 * Rejects credentials, IP literals and internal suffixes before any lookup.
 */
export function isAcceptableHostname(hostname: string): HostCheck {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");

  if (!host) return { ok: false, reason: "Enter a website address." };
  if (host.length > 253) return { ok: false, reason: "That address is too long." };
  if (host.includes("@")) return { ok: false, reason: "Addresses with a login cannot be scanned." };
  if (host.includes("_")) return { ok: false, reason: "That doesn't look like a valid domain." };
  if (looksLikeIpLiteral(host)) {
    return { ok: false, reason: "Enter a domain name, not an IP address." };
  }
  if (BLOCKED_HOSTNAMES.has(host)) return { ok: false, reason: "That address cannot be scanned." };
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return { ok: false, reason: "That address cannot be scanned." };
  }

  const labels = host.split(".");
  if (labels.length < 2) {
    return { ok: false, reason: "Enter a full domain, like yourdomain.com." };
  }
  if (!labels.every((label) => LABEL.test(label))) {
    return { ok: false, reason: "That doesn't look like a valid domain." };
  }
  if (!/^[a-z]{2,}$/.test(labels[labels.length - 1])) {
    return { ok: false, reason: "That doesn't look like a valid domain." };
  }

  return { ok: true };
}
