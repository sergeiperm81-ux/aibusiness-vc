/**
 * Makes the sources under every answer readable.
 *
 * The report promises the reader where each assistant got its information.
 * Two providers hand back addresses nobody can read: OpenAI appends its own
 * tracking parameter, and Gemini returns a Google redirect in place of the
 * page. The first is stripped; the second is followed exactly one hop, with no
 * body read, to learn the real address. When that fails the redirect is kept:
 * a working link beats a missing one.
 */

const GOOGLE_REDIRECT_HOST = "vertexaisearch.cloud.google.com";
const RESOLVE_TIMEOUT_MS = 5_000;
const MAX_REDIRECTS_RESOLVED = 40;

export function stripTracking(address: string): string {
  try {
    const url = new URL(address);
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString().replace(/\?$/, "");
  } catch {
    return address;
  }
}

export function isGoogleRedirect(address: string): boolean {
  try {
    return new URL(address).hostname === GOOGLE_REDIRECT_HOST;
  } catch {
    return false;
  }
}

/** The Location of one hop. Only ever called for the fixed Google redirect host. */
async function followOnce(address: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RESOLVE_TIMEOUT_MS);
  try {
    const response = await fetch(address, { method: "GET", redirect: "manual", signal: controller.signal });
    const location = response.headers.get("location");
    if (!location) return address;
    const target = new URL(location);
    return target.protocol === "https:" || target.protocol === "http:" ? stripTracking(target.toString()) : address;
  } catch {
    return address;
  } finally {
    clearTimeout(timer);
  }
}

/** Cleans a list of cited addresses, keeping order and dropping repeats. */
export async function cleanCitations(addresses: readonly string[]): Promise<readonly string[]> {
  let budget = MAX_REDIRECTS_RESOLVED;
  const cleaned = await Promise.all(
    addresses.map((address) => {
      if (!isGoogleRedirect(address)) return Promise.resolve(stripTracking(address));
      if (budget <= 0) return Promise.resolve(address);
      budget -= 1;
      return followOnce(address);
    })
  );
  return [...new Set(cleaned)];
}
