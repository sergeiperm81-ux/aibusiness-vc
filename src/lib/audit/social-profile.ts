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
 * product. Anything else is refused with a sentence the form can show, and
 * with a one-word reason for analytics.
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

/**
 * Why an input was refused, in a word. It goes to analytics so we learn what
 * people actually type into the field; the typed text itself never does.
 */
export type RejectReason =
  | "empty"
  | "name"
  | "handle"
  | "website"
  | "other_network"
  | "short_link"
  | "share_link"
  | "company_or_post"
  | "internal_id"
  | "malformed";

export type SocialProfileResult =
  | { readonly ok: true; readonly profile: SocialProfile }
  | { readonly ok: false; readonly error: string; readonly reason: RejectReason };

export const SOCIAL_PROFILE_HINT =
  "Paste the link to your own profile on LinkedIn, X, Instagram or Facebook.";

const NOT_A_PERSON =
  "This looks like a company, group or post, not a personal profile. " + SOCIAL_PROFILE_HINT;
const WRONG_SITE =
  "We only take a personal social profile here: LinkedIn, X, Instagram or Facebook. " +
  "For a company, use the AI Company Scan.";
const A_NAME =
  "A name alone can be many people, so we need a link to tell which one you are. " +
  "Open your profile on LinkedIn, X, Instagram or Facebook and paste its address, for example linkedin.com/in/your-name.";
const A_HANDLE =
  "We need the full profile link, not only the user name. " +
  "For example instagram.com/your-name, x.com/your-name or linkedin.com/in/your-name.";
const OTHER_NETWORK =
  "We do not take this network yet. Paste a profile link from LinkedIn, X, Instagram or Facebook.";
const SHORT_LINK =
  "This is a shortened link, and we cannot tell whose profile is behind it. " +
  "Open the profile and paste its full address, for example linkedin.com/in/your-name.";
const SHARE_LINK =
  "This is a Facebook share link, which does not show whose profile it is. " +
  "Open the profile in a browser and paste the address from the address bar, for example facebook.com/your.name.";

/**
 * LinkedIn's internal member id (ACoAA…, ACwAA…), which appears in links copied
 * from messages, search and the app. It opens the profile for a logged-in
 * member, but no search engine or AI model can tie it to a person.
 */
const LINKEDIN_MEMBER_ID = /^AC[a-z]AA[A-Za-z0-9_-]{15,}$/;
const LINKEDIN_INTERNAL =
  "This is LinkedIn's internal member link, which AI models cannot read. " +
  "Paste the public profile address instead: open the profile, choose Contact info, " +
  "and copy the link that looks like linkedin.com/in/your-name.";

const HOSTS: Readonly<Record<string, SocialNetwork>> = {
  "linkedin.com": "linkedin",
  "x.com": "x",
  "twitter.com": "x",
  "instagram.com": "instagram",
  "facebook.com": "facebook",
  "fb.com": "facebook",
};

/** Other networks people try. A site outside this list and outside HOSTS is treated as a website. */
const OTHER_NETWORKS: readonly string[] = [
  "threads.net", "threads.com", "tiktok.com", "youtube.com", "youtu.be", "github.com", "bsky.app",
  "medium.com", "substack.com", "t.me", "telegram.me", "whatsapp.com", "wa.me", "vk.com", "xing.com",
  "pinterest.com", "reddit.com", "snapchat.com", "mastodon.social",
];

const SHORTENERS: readonly string[] = ["lnkd.in", "bit.ly", "t.co", "fb.me", "tinyurl.com", "goo.gl"];

/** A profile address inside pasted text: "My profile: https://linkedin.com/in/jane". */
const LINK_IN_TEXT = new RegExp(
  "(?:https?://)?(?:[a-z0-9-]+\\.)*(?:linkedin\\.com|x\\.com|twitter\\.com|instagram\\.com|facebook\\.com|fb\\.com)/\\S+",
  "i"
);

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

function fail(error: string, reason: RejectReason): SocialProfileResult {
  return { ok: false, error, reason };
}

/**
 * What the person meant to paste. Text around a link is dropped ("My profile:
 * https://..."), and so is punctuation stuck to its end. Words with no profile
 * link in them come back as null: that is a name, not an address.
 */
function linkFrom(text: string): string | null {
  if (!/\s/.test(text)) return text;
  const found = text.match(LINK_IN_TEXT);
  return found ? found[0].replace(/[.,;:!?)\]>"']+$/, "") : null;
}

export function parseSocialProfile(value: string): SocialProfileResult {
  const typed = value.trim();
  if (!typed) return fail(SOCIAL_PROFILE_HINT, "empty");
  if (typed.length > 300) return fail(SOCIAL_PROFILE_HINT, "malformed");

  const trimmed = linkFrom(typed);
  if (trimmed === null) return fail(A_NAME, "name");
  // "@jane" or "jane": a user name with no site in front of it.
  if (/^@[\w.-]+$/.test(trimmed) || !/[./]/.test(trimmed)) return fail(A_HANDLE, "handle");

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return fail(SOCIAL_PROFILE_HINT, "malformed");
  }
  if (url.username || url.password || (url.port && url.port !== "443")) return fail(SOCIAL_PROFILE_HINT, "malformed");

  const host = bareHost(url.hostname);
  const network = HOSTS[host];
  if (!network) {
    if (SHORTENERS.includes(host)) return fail(SHORT_LINK, "short_link");
    if (OTHER_NETWORKS.includes(host)) return fail(OTHER_NETWORK, "other_network");
    return fail(WRONG_SITE, "website");
  }

  const allSegments = url.pathname.split("/").filter(Boolean);
  // LinkedIn's mobile site puts "mwlite" in front of the same /in/ address.
  const segments = network === "linkedin" && allSegments[0] === "mwlite" ? allSegments.slice(1) : allSegments;
  const label = LABELS[network];
  const done = (handle: string, address: string): SocialProfileResult => ({
    ok: true,
    profile: { network, networkLabel: label, handle, url: address },
  });

  if (network === "linkedin") {
    // /in/ is a person. /company/, /school/, /posts/ and /pub/ are not taken.
    if (segments[0] !== "in" || !segments[1] || !HANDLE.test(segments[1])) return fail(NOT_A_PERSON, "company_or_post");
    if (LINKEDIN_MEMBER_ID.test(segments[1])) return fail(LINKEDIN_INTERNAL, "internal_id");
    const handle = safeDecode(segments[1]).toLowerCase();
    return done(handle, `https://www.linkedin.com/in/${encodeURIComponent(handle)}`);
  }

  if (network === "facebook" && segments[0] === "profile.php") {
    const id = url.searchParams.get("id") ?? "";
    if (!/^\d{5,20}$/.test(id)) return fail(NOT_A_PERSON, "company_or_post");
    return done(id, `https://www.facebook.com/profile.php?id=${id}`);
  }

  const first = (segments[0] ?? "").replace(/^@/, "");
  if (network === "facebook" && first.toLowerCase() === "share") return fail(SHARE_LINK, "share_link");
  if (!first || !HANDLE.test(first) || RESERVED[network].includes(first.toLowerCase())) return fail(NOT_A_PERSON, "company_or_post");
  // A second segment is a post, a photo or a tab. "/handle/" alone is the profile.
  // Instagram's own "share profile" button adds /profilecard/, which is still the profile.
  const shareCard = network === "instagram" && segments.length === 2 && segments[1].toLowerCase() === "profilecard";
  if (segments.length > 1 && network !== "facebook" && !shareCard) return fail(NOT_A_PERSON, "company_or_post");

  const canonicalHost = network === "x" ? "x.com" : network === "instagram" ? "www.instagram.com" : "www.facebook.com";
  return done(first, `https://${canonicalHost}/${first}`);
}
