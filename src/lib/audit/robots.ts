/**
 * Reading robots.txt for what a site tells crawlers about itself.
 *
 * Kept free of any network or framework import, so it can be tested alone.
 */

/**
 * Sitemap addresses declared in robots.txt, in order, without duplicates.
 *
 * The first paid test read only /sitemap.xml. super.tennis declares its
 * sitemap in robots.txt as /sitemap-index.xml, so discovery found nothing. The
 * directive is what a site actually tells crawlers, so it is read first.
 */
export function sitemapsFromRobots(robots: string): readonly string[] {
  return [
    ...new Set(
      robots
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*sitemap\s*:\s*(\S+)/i)?.[1])
        .filter((url): url is string => typeof url === "string" && /^https?:\/\//i.test(url))
    ),
  ];
}
