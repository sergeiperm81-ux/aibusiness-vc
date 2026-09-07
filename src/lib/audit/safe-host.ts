/**
 * Server-side guard against the audit scanner being pointed somewhere private.
 *
 * The scanner fetches a URL a stranger typed into a public form. Syntax alone
 * is not enough: a perfectly valid public name can resolve to 127.0.0.1, and a
 * public host can redirect into a private one. Every target is therefore both
 * parsed and resolved, at every redirect hop.
 *
 * Syntax rules live in `hostname.ts` so the browser form can share them.
 */

import { promises as dns } from "node:dns";
import { isIP } from "node:net";
import { isAcceptableHostname, type HostCheck } from "./hostname";

export type { HostCheck };
export { isAcceptableHostname, normalizeHostname } from "./hostname";

function ipv4ToLong(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => acc * 256 + Number.parseInt(octet, 10), 0);
}

function isPrivateIpv4(ip: string): boolean {
  const value = ipv4ToLong(ip);
  const inRange = (cidrBase: string, bits: number) => {
    const base = ipv4ToLong(cidrBase);
    const mask = bits === 0 ? 0 : (-1 << (32 - bits)) >>> 0;
    return ((value & mask) >>> 0) === ((base & mask) >>> 0);
  };

  return (
    inRange("0.0.0.0", 8) || // "this network"
    inRange("10.0.0.0", 8) || // private
    inRange("100.64.0.0", 10) || // carrier-grade NAT
    inRange("127.0.0.0", 8) || // loopback
    inRange("169.254.0.0", 16) || // link-local, incl. cloud metadata
    inRange("172.16.0.0", 12) || // private
    inRange("192.0.0.0", 24) || // IETF protocol assignments
    inRange("192.0.2.0", 24) || // documentation
    inRange("192.168.0.0", 16) || // private
    inRange("198.18.0.0", 15) || // benchmarking
    inRange("198.51.100.0", 24) || // documentation
    inRange("203.0.113.0", 24) || // documentation
    inRange("224.0.0.0", 4) || // multicast
    inRange("240.0.0.0", 4) // reserved, incl. broadcast
  );
}

/**
 * Expands an IPv6 address to eight four-digit groups.
 *
 * Matching on the written form is unreliable: `::1`, `0:0:0:0:0:0:0:1` and
 * `0000:0000:0000:0000:0000:0000:0000:0001` are the same address but share no
 * prefix. Comparisons are made on the expanded form instead.
 */
function expandIpv6(ip: string): string[] | null {
  const bare = ip.toLowerCase().replace(/^\[|\]$/g, "").replace(/%.*$/, "");

  // A trailing IPv4 part (::ffff:127.0.0.1) becomes two groups.
  const withIpv4 = bare.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)$/, (_m, a, b, c, d) => {
    const hi = (Number(a) << 8) + Number(b);
    const lo = (Number(c) << 8) + Number(d);
    return `${hi.toString(16)}:${lo.toString(16)}`;
  });

  const [head, tail, ...rest] = withIpv4.split("::");
  if (rest.length > 0) return null;

  const headGroups = head ? head.split(":").filter(Boolean) : [];
  const tailGroups = tail !== undefined && tail ? tail.split(":").filter(Boolean) : [];

  let groups: string[];
  if (tail === undefined) {
    groups = headGroups;
  } else {
    const missing = 8 - headGroups.length - tailGroups.length;
    if (missing < 0) return null;
    groups = [...headGroups, ...Array<string>(missing).fill("0"), ...tailGroups];
  }

  if (groups.length !== 8) return null;
  return groups.map((group) => group.padStart(4, "0"));
}

function isPrivateIpv6(ip: string): boolean {
  const groups = expandIpv6(ip);
  if (!groups) return true; // Unparseable means untrusted.

  const first = groups[0];

  // IPv4-mapped (::ffff:a.b.c.d) inherits the IPv4 verdict.
  const isMapped = groups.slice(0, 5).every((g) => g === "0000") && groups[5] === "ffff";
  if (isMapped) {
    const hi = Number.parseInt(groups[6], 16);
    const lo = Number.parseInt(groups[7], 16);
    const ipv4 = `${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`;
    return isPrivateIpv4(ipv4);
  }

  // Unspecified (::) and loopback (::1), however they were written.
  if (groups.every((g) => g === "0000")) return true;
  if (groups.slice(0, 7).every((g) => g === "0000") && groups[7] === "0001") return true;

  const leading = Number.parseInt(first, 16);
  if ((leading & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((leading & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((leading & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  return false;
}

export function isPrivateAddress(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) return isPrivateIpv4(ip);
  if (family === 6) return isPrivateIpv6(ip);
  return false;
}

/** Resolves the hostname and rejects it if any address is private. */
export async function resolvesToPublicAddress(hostname: string): Promise<HostCheck> {
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (records.length === 0) return { ok: false, reason: "Domain does not resolve." };
    if (records.some((record) => isPrivateAddress(record.address))) {
      return { ok: false, reason: "That address cannot be scanned." };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "Domain does not resolve." };
  }
}

/** Full check for a URL the scanner is about to request. */
export async function isSafeScanTarget(rawUrl: string): Promise<HostCheck> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, reason: "Only http and https addresses can be scanned." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "Addresses with a login cannot be scanned." };
  }
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return { ok: false, reason: "Only standard web ports can be scanned." };
  }

  const syntax = isAcceptableHostname(parsed.hostname);
  if (!syntax.ok) return syntax;

  return resolvesToPublicAddress(parsed.hostname);
}
