/**
 * What the site actually says, as the reference the answers are judged against.
 *
 * An earlier version used only the home page's JSON-LD, which was wrong. The
 * assistants read ordinary pages, external sources and their own indexes, so
 * markup is one technical signal among several and never the arbiter of truth.
 * A fact absent from the markup is not a fact the machines cannot see.
 *
 * So the reference is the readable text of the pages a person would check,
 * and the markup is reported separately as its own, lesser finding: not "this
 * is wrong" but "this is the one place a machine reads without guessing".
 */

import { extractTextContent } from "./live";
import { sitemapsFromRobots } from "./robots";

/** Tried on every site, whether or not the sitemap lists them. */
const ALWAYS_TRY = ["", "/about", "/contact", "/pricing"] as const;

/** Words that mark a page as likely to carry the facts under check. */
const RELEVANT_WORDS = [
  "about",
  "contact",
  "price",
  "pricing",
  "plan",
  "service",
  "product",
  "team",
  "company",
  "who-we-are",
  "imprint",
  "legal",
] as const;

/** Enough text per page to hold the facts, without flooding the classifier. */
const MAX_TEXT_PER_PAGE = 6_000;

/**
 * Total characters of reference text handed to the judge.
 *
 * The budget is divided between the pages that answered rather than taken off
 * the front of one joined string. Slicing the front quietly dropped whole
 * pages, so the judge called facts absent that the site stated on a page it
 * was never shown.
 */
const REFERENCE_BUDGET = 24_000;

/** Ceiling on reference pages. Beyond this the judge's prompt stops fitting. */
const MAX_REFERENCE_PAGES = 10;

export interface ReferencePage {
  readonly url: string;
  readonly ok: boolean;
  readonly text: string;
}

export interface SiteMarkup {
  readonly name: string | null;
  readonly description: string | null;
  readonly country: string | null;
  readonly locality: string | null;
  readonly founder: string | null;
  readonly contact: string | null;
  readonly prices: readonly string[];
  readonly schemaTypes: readonly string[];
  readonly declaresOffer: boolean;
}

export interface SiteFacts {
  readonly domain: string;
  readonly fetchedAt: string;
  readonly reachable: boolean;
  readonly pages: readonly ReferencePage[];
  readonly markup: SiteMarkup;
  /** The readable text of every page that answered, joined and labelled, within budget. */
  readonly reference: string;
  /** Pages whose text was shortened to fit the budget. Named, never silent. */
  readonly shortened: readonly string[];
}

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function collectNodes(html: string): readonly Json[] {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  const nodes: Json[] = [];
  const push = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (!isObject(value)) return;
    nodes.push(value);
    for (const key of [
      "@graph",
      "about",
      "mainEntity",
      "publisher",
      "provider",
      "offers",
      "makesOffer",
      "itemOffered",
      "address",
      "founder",
      "contactPoint",
    ]) {
      if (value[key]) push(value[key]);
    }
  };
  for (const block of blocks) {
    try {
      push(JSON.parse(block[1]) as unknown);
    } catch {
      // One malformed block must not cost the rest of the page.
    }
  }
  return nodes;
}

function typeOf(node: Json): string {
  const t = node["@type"];
  if (typeof t === "string") return t;
  if (Array.isArray(t) && typeof t[0] === "string") return t[0];
  return "";
}

function nameOfRef(value: unknown, nodes: readonly Json[]): string | null {
  if (typeof value === "string") return str(value);
  if (!isObject(value)) return null;
  const direct = str(value.name);
  if (direct) return direct;
  const id = str(value["@id"]);
  if (!id) return null;
  const target = nodes.find((n) => str(n["@id"]) === id && str(n.name));
  return target ? str(target.name) : null;
}

export function extractMarkup(html: string): SiteMarkup {
  const nodes = collectNodes(html);
  const org =
    nodes.find((n) => typeOf(n) === "Organization") ??
    nodes.find((n) => /Organization|NewsMediaOrganization|LocalBusiness/.test(typeOf(n)));

  const address = org && isObject(org.address) ? org.address : null;
  const contactPoint = org && isObject(org.contactPoint) ? org.contactPoint : null;

  const prices = nodes
    .filter((n) => /Offer|Service|Product/.test(typeOf(n)))
    .flatMap((n) => {
      const price = str(n.price) ?? str(n.lowPrice);
      if (!price) return [];
      const currency = str(n.priceCurrency);
      return [currency ? `${price} ${currency}` : price];
    });

  return {
    name: org ? str(org.name) : null,
    description: org ? str(org.description) : null,
    country: address ? str(address.addressCountry) : null,
    locality: address ? str(address.addressLocality) : null,
    founder: org ? nameOfRef(org.founder, nodes) : null,
    contact:
      (contactPoint ? str(contactPoint.email) ?? str(contactPoint.url) : null) ??
      (org ? str(org.email) : null),
    prices: [...new Set(prices)],
    schemaTypes: [...new Set(nodes.map(typeOf).filter(Boolean))],
    declaresOffer: nodes.some((n) => /Offer|Service|Product/.test(typeOf(n))),
  };
}

interface FetchedPage {
  readonly ok: boolean;
  readonly html: string;
  /** Where the request ended up after redirects, so /about and /about/ are read as one page. */
  readonly finalUrl: string;
}

async function fetchPage(url: string): Promise<FetchedPage> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "aibusiness.vc answer-check" },
      signal: AbortSignal.timeout(20_000),
    });
    const finalUrl = response.url || url;
    if (!response.ok) return { ok: false, html: "", finalUrl };
    return { ok: true, html: await response.text(), finalUrl };
  } catch {
    return { ok: false, html: "", finalUrl: url };
  }
}

/**
 * URLs from the site's sitemaps, following one level of sitemap index.
 *
 * The sitemaps declared in robots.txt come first; /sitemap.xml is only a
 * fallback for a site that declares none.
 */
async function sitemapUrls(base: string): Promise<readonly string[]> {
  const read = async (url: string): Promise<string> => {
    const { ok, html } = await fetchPage(url);
    return ok ? html : "";
  };
  const locs = (xml: string): string[] =>
    [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);

  const declared = sitemapsFromRobots(await read(`${base}/robots.txt`));
  const roots = declared.length > 0 ? declared.slice(0, 3) : [`${base}/sitemap.xml`];

  const expand = async (url: string): Promise<readonly string[]> => {
    const xml = await read(url);
    if (!xml) return [];
    if (/<sitemapindex/i.test(xml)) {
      const children = locs(xml).slice(0, 5);
      const pages = await Promise.all(children.map(read));
      return pages.flatMap(locs);
    }
    return locs(xml);
  };

  return (await Promise.all(roots.map(expand))).flat();
}

/**
 * Which of a site's pages to read as the reference.
 *
 * Guessing a fixed list of paths was the previous approach and it failed in the
 * obvious way: the page describing the product under check was never read, so
 * every statement about the product came back "unsupported" when the site in
 * fact said all of it. The sitemap is what the site itself offers machines, so
 * that is what gets used, ranked by whether a URL looks like it carries facts.
 */
function chooseReferenceUrls(
  base: string,
  sitemap: readonly string[],
  hints: readonly string[]
): readonly string[] {
  const hintWords = hints
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);

  const score = (url: string): number => {
    const path = url.toLowerCase().replace(base.toLowerCase(), "");
    const depth = (path.match(/\//g) ?? []).length;
    let value = 0;
    if (RELEVANT_WORDS.some((word) => path.includes(word))) value += 3;
    if (hintWords.some((word) => path.includes(word))) value += 4;
    // A shallow page is more likely to be a company page than an article.
    value += Math.max(0, 3 - depth);
    return value;
  };

  const ranked = [...new Set(sitemap)]
    .filter((url) => url.startsWith(base))
    // Only the top level. A company states who it is and what it charges on a
    // shallow page; anything deeper is an article, and letting articles into
    // the reference diluted it with prose that has nothing to do with the
    // facts under check.
    .filter((url) => {
      const path = url.replace(base, "").replace(/\/$/, "");
      return (path.match(/\//g) ?? []).length <= 1;
    })
    .map((url) => ({ url, value: score(url) }))
    .filter((entry) => entry.value >= 4)
    .sort((a, b) => b.value - a.value)
    .map((entry) => entry.url);

  const always = ALWAYS_TRY.map((path) => `${base}${path}`);
  return [...new Set([...always, ...ranked])].slice(0, MAX_REFERENCE_PAGES);
}

export async function fetchSiteFacts(
  domain: string,
  /** The brand, product and category words, used to pick relevant pages. */
  hints: readonly string[] = [],
  /**
   * Pages the client names themselves, read whatever the sitemap says.
   *
   * Discovery cannot reliably find the page describing one particular product:
   * a URL rarely contains the product's name. Asking for it is more honest than
   * guessing and then reporting the product as "unsupported".
   */
  extraUrls: readonly string[] = []
): Promise<SiteFacts> {
  const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const base = `https://${clean}`;

  const sitemap = await sitemapUrls(base);
  const discovered = chooseReferenceUrls(base, sitemap, hints);
  // llms.txt is the plain-text summary a site writes for exactly these
  // machines, so it belongs in the reference whenever it exists.
  const urls = [...new Set([...extraUrls, `${base}/llms.txt`, ...discovered])].slice(
    0,
    MAX_REFERENCE_PAGES
  );

  const fetchedAll = await Promise.all(
    urls.map(async (url) => ({ url, ...(await fetchPage(url)) }))
  );

  // Two addresses that land on the same page are read once. In the first paid
  // test /about and /about/ each took a share of the budget for identical text.
  const seen = new Set<string>();
  const fetched = fetchedAll.filter((page) => {
    const key = page.ok ? page.finalUrl.replace(/\/$/, "") : page.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const pages: ReferencePage[] = fetched.map(({ url, ok, html }) => ({
    url,
    ok,
    text: ok ? extractTextContent(html).slice(0, MAX_TEXT_PER_PAGE) : "",
  }));

  // Found by address, not by position. A caller who names a product page puts
  // it first in the list, and reading that page's markup as the home page's
  // mislabels the whole technical section of the report.
  const home = fetched.find((page) => page.url === base || page.url === `${base}/`);

  const answered = pages.filter((page) => page.ok && page.text.length > 0);
  const share = answered.length > 0 ? Math.floor(REFERENCE_BUDGET / answered.length) : 0;
  const shortened: string[] = [];
  const reference = answered
    .map((page) => {
      const text = page.text.slice(0, share);
      if (text.length < page.text.length) shortened.push(page.url);
      return `--- ${page.url} ---\n${text}`;
    })
    .join("\n\n");

  return {
    domain: clean,
    fetchedAt: new Date().toISOString(),
    reachable: pages.some((page) => page.ok),
    pages,
    markup: extractMarkup(home?.html ?? ""),
    reference,
    shortened,
  };
}
