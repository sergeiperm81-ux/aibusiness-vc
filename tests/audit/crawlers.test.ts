/**
 * robots.txt permission scoring for AI bots. No network. Run with: npm run test:audit
 *
 * Bot classes follow the vendors' own documentation: OAI-SearchBot,
 * Claude-SearchBot and PerplexityBot feed answer engines and are scored;
 * GPTBot, ClaudeBot and Google-Extended collect training data and are the
 * owner's decision, reported but never scored; Claude-User is a per-request
 * fetcher, reported on its own.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { isServedAsHtml, parseRobotsGroups, scoreAiCrawlerAccess } from "../../src/lib/audit/live";

test("ClaudeBot is a training crawler: allowing it does not count as answer-engine permission", () => {
  const robots = ["User-agent: *", "Allow: /", "", "User-agent: ClaudeBot", "Allow: /"].join("\n");
  const result = scoreAiCrawlerAccess(robots);
  assert.equal(result.score, 60, "no answer-engine bot is named, so the neutral score applies");
  assert.match(result.summary, /names no answer-engine bots/);
  assert.match(result.summary, /Training crawlers ClaudeBot are allowed/);
});

test("Claude-SearchBot is the bot that counts for Claude", () => {
  const robots = ["User-agent: Claude-SearchBot", "Allow: /"].join("\n");
  const result = scoreAiCrawlerAccess(robots);
  assert.equal(result.score, 73, "one of three answer-engine bots explicitly allowed");
  assert.match(result.summary, /1\/3 answer-engine bots/);
});

test("all three answer-engine bots allowed scores 100 regardless of training crawlers", () => {
  const allowed = ["User-agent: OAI-SearchBot", "Allow: /", "User-agent: Claude-SearchBot", "Allow: /", "User-agent: PerplexityBot", "Allow: /"];
  const withTrainingBlocked = [...allowed, "User-agent: GPTBot", "Disallow: /", "User-agent: Google-Extended", "Disallow: /"].join("\n");
  const result = scoreAiCrawlerAccess(withTrainingBlocked);
  assert.equal(result.score, 100);
  assert.match(result.summary, /GPTBot, Google-Extended are blocked; that is your decision/);
});

test("blocking training crawlers alone never lowers the score", () => {
  const neutral = scoreAiCrawlerAccess("User-agent: *\nAllow: /");
  const blockedTraining = scoreAiCrawlerAccess("User-agent: *\nAllow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: ClaudeBot\nDisallow: /");
  assert.equal(blockedTraining.score, neutral.score);
});

test("blocking an answer-engine bot is penalised", () => {
  const result = scoreAiCrawlerAccess("User-agent: OAI-SearchBot\nDisallow: /");
  assert.equal(result.score, 38);
  assert.match(result.summary, /blocks OAI-SearchBot/);
});

test("a wildcard Disallow: / blocks every bot that has no group of its own", () => {
  const result = scoreAiCrawlerAccess("User-agent: *\nDisallow: /");
  assert.equal(result.score, 5);
});

test("Claude-User is reported separately when blocked", () => {
  const result = scoreAiCrawlerAccess("User-agent: *\nAllow: /\nUser-agent: Claude-User\nDisallow: /");
  assert.equal(result.score, 60);
  assert.match(result.summary, /Claude-User is blocked too/);
});

test("consecutive User-agent lines share the rules that follow them", () => {
  const groups = parseRobotsGroups(["User-agent: GPTBot", "User-agent: ClaudeBot", "Disallow: /", "", "User-agent: *", "Allow: /"].join("\n"));
  assert.deepEqual(groups.get("gptbot"), ["disallow:/"]);
  assert.deepEqual(groups.get("claudebot"), ["disallow:/"]);
  assert.deepEqual(groups.get("*"), ["allow:/"]);
});

test("a rule after a blank-separated single agent applies to that agent only", () => {
  const groups = parseRobotsGroups(["User-agent: OAI-SearchBot", "Allow: /", "", "User-agent: GPTBot", "Disallow: /"].join("\n"));
  assert.deepEqual(groups.get("oai-searchbot"), ["allow:/"]);
  assert.deepEqual(groups.get("gptbot"), ["disallow:/"]);
});

test("an HTML page served at /robots.txt or /llms.txt is not a side file", () => {
  assert.equal(isServedAsHtml("text/html; charset=utf-8", "User-agent: *"), true, "content type wins");
  assert.equal(isServedAsHtml(null, "<!DOCTYPE html><html><head>"), true);
  assert.equal(isServedAsHtml(null, "\n  <html lang=\"en\">"), true);
  assert.equal(isServedAsHtml("text/plain", "User-agent: *\nAllow: /"), false);
  assert.equal(isServedAsHtml(null, "# aibusiness.vc\n\n> Site summary"), false);
});
