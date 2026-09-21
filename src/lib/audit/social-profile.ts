/**
 * The one thing a person hands over: the address of a personal social profile.
 *
 * It is there to say which person this is, and for nothing else. "Ivan Petrov"
 * is many people; "Ivan Petrov, the one at linkedin.com/in/ivan-petrov" is
 * one. None of these networks can be read without a login, and none is: the
 * address is an anchor, never a source.
 *
 * Only four networks are taken, because on each of them an address of this
 * shape belongs to a person. A website, a YouTube channel or a company page
 * can belong to anyone or anything, and the company check is a separate
 * product. Anything else is refused with a sentence the form can show.
 */

export type SocialNetwork = "linkedin" | "x" | "instagram" | "facebook";

export interface SocialProfile {
  readonly network: SocialNetwork;
  readonly networkLabel: string;
  /** The account name, or the numeric id of a Facebook profile that has no name. */
  readonly handle: string;
  /** One spelling per profile: https, the canonical host, no tracking, no trailing slash. */
  readonly url: string;
}

export type SocialProfileResult =
  | { readonly ok: true; readonly profile: SocialProfile }
  | { readonly ok: false; readonly error: string };

export const SOCIAL_PROFILE_HINT =
  "Paste the link to your own profile on LinkedIn, X, Instagram or Facebook.";

const NOT_A_PERSON =
  "This looks like a company, group or post, not a personal profile. " + SOCIAL_PROFILE_HINT;
const WRONG_SITE =
  "We only take a personal social profile here: LinkedIn, X, Instagram or Facebook. " +
  "For a company website, use the AI Website Scan.";

const HOSTS: Readonly<Record<string, SocialNetwork>> = {
  "linkedin.com": "linkedin",
  "x.com": "x",
  "twitter.com": "x",
  "instagram.com": "instagram",
  "facebook.com": "facebook",
  "fb.com": "facebook",
};

const LABELS: Readonly<Record<SocialNetwork, string>> = {
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  facebook: "Facebook",
};

/** First path segments that are the network's own pages, never an account. */
const RESERVED: Readonly<Record<SocialNetwork, readonly string[]>> = {
  linkedin: [],
  x: ["home", "i", "search", "explore", "hashtag", "settings", "messages", "notifications", "intent", "share", "login", "compose"],
  instagram: ["p", "reel", "reels", "explore", "stories", "accounts", "direct", "tv", "about"],
  facebook: [
    "pages", "groups", "events", "watch", "marketplace", "gaming", "share", "sharer", "login", "help",
    "photo", "photos", "story.php", "permalink.php", "business", "people", "public", "hashtag", "reel",
  ],
};

const HANDLE = /^[A-Za-z0-9._%-]{1,100}$/;

function bareHost(hostname: string): string {
  // www., m., mobile., and LinkedIn's country hosts such as bg.linkedin.com all name the same site.
  const parts = hostname.toLowerCase().split(".");
  return parts.slice(-2).join(".");
}

/** A name outside ASCII arrives percent-encoded; a broken encoding is kept as typed. */
function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function fail(error: string): SocialProfileResult {
  return { ok: false, error };
}

export function parseSocialProfile(value: string): SocialProfileResult {
  const trimmed = value.trim();
  if (!trimmed) return fail(SOCIAL_PROFILE_HINT);
  if (trimmed.length > 300 || /\s/.test(trimmed)) return fail(SOCIAL_PROFILE_HINT);

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return fail(SOCIAL_PROFILE_HINT);
  }
  if (url.username || url.password || (url.port && url.port !== "443")) return fail(SOCIAL_PROFILE_HINT);

  const host = bareHost(url.hostname);
  const network = HOSTS[host];
  if (!network) return fail(WRONG_SITE);

  const segments = url.pathname.split("/").filter(Boolean);
  const label = LABELS[network];
  const done = (handle: string, address: string): SocialProfileResult => ({
    ok: true,
    profile: { network, networkLabel: label, handle, url: address },
  });

  if (network === "linkedin") {
    // /in/ is a person. /company/, /school/, /posts/ and /pub/ are not taken.
    if (segments[0] !== "in" || !segments[1] || !HANDLE.test(segments[1])) return fail(NOT_A_PERSON);
    const handle = safeDecode(segments[1]).toLowerCase();
    return done(handle, `https://www.linkedin.com/in/${encodeURIComponent(handle)}`);
  }

  if (network === "facebook" && segments[0] === "profile.php") {
    const id = url.searchParams.get("id") ?? "";
    if (!/^\d{5,20}$/.test(id)) return fail(NOT_A_PERSON);
    return done(id, `https://www.facebook.com/profile.php?id=${id}`);
  }

  const first = (segments[0] ?? "").replace(/^@/, "");
  if (!first || !HANDLE.test(first) || RESERVED[network].includes(first.toLowerCase())) return fail(NOT_A_PERSON);
  // A second segment is a post, a photo or a tab. "/handle/" alone is the profile.
  if (segments.length > 1 && network !== "facebook") return fail(NOT_A_PERSON);

  const canonicalHost = network === "x" ? "x.com" : network === "instagram" ? "www.instagram.com" : "www.facebook.com";
  return done(first, `https://${canonicalHost}/${first}`);
}
