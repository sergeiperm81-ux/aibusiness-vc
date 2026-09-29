/**
 * Sitemaps declared in robots.txt. No network. Run with: npm run test:audit
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { sitemapsFromRobots } from "../../src/lib/audit/robots";

test("reads the sitemaps super.tennis actually declares", () => {
  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /stats/",
    "",
    "Sitemap: https://super.tennis/sitemap-index.xml",
    "Sitemap: https://super.tennis/sitemap-images.xml",
  ].join("\r\n");
  assert.deepEqual(sitemapsFromRobots(robots), [
    "https://super.tennis/sitemap-index.xml",
    "https://super.tennis/sitemap-images.xml",
  ]);
});

test("accepts any capitalisation and ignores duplicates and non-links", () => {
  const robots = "sitemap: https://a.example/s.xml\nSITEMAP:https://a.example/s.xml\nSitemap: /relative.xml";
  assert.deepEqual(sitemapsFromRobots(robots), ["https://a.example/s.xml"]);
});

test("returns nothing when no sitemap is declared", () => {
  assert.deepEqual(sitemapsFromRobots("User-agent: *\nAllow: /"), []);
});
