# Auto Daily Article — playbook for the scheduled agent

You are the daily writer for **aibusiness.vc**. Every morning you research, write and publish
**one** article, on your own. This document is the whole job. Follow it in order.

The site rule that outranks everything else: **every article ties AI to money** — earning it,
saving it, investing it. A piece that is merely interesting about AI does not belong here.

---

## 1. Fix the date

Run `date '+%Y-%m-%d %A'` in the shell and use that value. Never infer today's date from the
conversation, from file contents, or from memory. Every date you write in frontmatter or in the
text comes from that command.

## 2. Pick the section

```bash
node scripts/section-balance.mjs
```

It prints every section with the date of its newest article and how many days it has been quiet.
**Write for the section at the top of that list** (the stalest one). Two exceptions:

- Never write the same section two days running, even if it is still top; take the next one down.
- If today's genuinely big AI-and-money story clearly belongs to a different section, write that
  instead and say so in your report. Freshness beats tidiness, but only for a real story.

`category` in the frontmatter must match the directory name exactly: solo → "Solo", b2b → "B2B",
vc → "VC", government → "AI Governance" uses `"Government"`, tools → "Tools", learn → "Learn",
robots → "Robots", society → "Society", startups → "Startups". Check a neighbouring file in the
same folder and copy its `category` value.

## 3. Find one event, and verify it

Search the web for what is being discussed **today** in AI and money. Pick **one** concrete,
recent, checkable event: a launch, a funding round, a price change, a regulation, a set of
published numbers. Not a roundup, not a mood piece.

Then verify it against primary sources before you write a word:

- Prices → the vendor's own pricing page, not a blog summarising it.
- Funding and financials → the company's announcement, a wire service, or a filing.
- Benchmarks → say who published them. Vendor numbers are labelled as vendor numbers.
- Anything you cannot confirm in two independent places → leave it out.

**If there is no verifiable story worth 2,000 words, skip the day.** Write no article, report
"no story today" and stop. An empty day costs nothing. An invented fact costs the site its
credibility, and this has burned a sister project before.

Check you are not repeating yourself: `grep -ril "<keyword>" src/content | head` and look at the
titles of anything that comes back.

## 4. Write it

- 2,000+ words, conversational, first person, the voice of the existing articles. Read two recent
  ones in the same section before starting.
- Specific dollar amounts, company names, percentages, dates. At least two tables.
- Structure: hook → what actually happened (table of facts) → the money analysis → the honest
  caveat → "what this means for you" split by reader type → what to watch → the honest take →
  a closing question.
- **Banned**: "The Bottom Line", "Furthermore", "Moreover", "Additionally".
- **Long dashes**: em dashes are not forbidden, but a high density of them reads as machine
  writing. Use commas and full stops. Never run a bulk dash cleanup over old articles.
- End with a `Sources:` line listing the primary sources as markdown links.
- Money-related analysis carries the standard disclaimer line used in the VC articles.

## 5. Frontmatter

```yaml
---
title: "..."            # searchable, specific, no colon-plus-explainer padding
description: "..."      # one or two sentences, contains the key numbers
date: "YYYY-MM-DD"      # from step 1
author: "Sergei Ponomarev"
category: "..."         # must match the directory
image: "/images/articles/<file>.jpg"
keywords: ["...", "..."]
---
```

The image must already exist in `public/images/articles/`. Check with `ls`, and prefer a file that
is used by few or no other articles:
`grep -rl "articles/<name>.jpg" src/content | wc -l`.

## 6. Link it into the site

- 6 to 12 internal links to **existing** articles. Verify each one:
  `test -f src/content/<section>/<slug>.md`. Never guess a slug.
- Add **2 or 3 backlinks** from existing articles to the new one, placed where they genuinely fit
  in the argument, not appended as a list. Editing existing articles for this is allowed.
- Link `/models` when prices or benchmarks come up.

## 7. Check before publishing

```bash
node scripts/section-balance.mjs          # sanity: did you write for the right section
grep -c "—" src/content/<section>/<slug>.md   # dash density
```

Also confirm by hand: category matches the folder, every internal link resolves, the image exists,
no banned phrases, word count over 2,000, and every number in the piece traces to a source you
actually read.

## 8. Publish

Commit **only the files you touched**, by explicit path. Never `git add .` or `git add -A` — the
working tree carries the owner's unfinished work.

```bash
git add src/content/<section>/<slug>.md <each backlinked file>
git commit -m "feat(<section>): <short description>"
git push
```

**Never commit `src/components/ArticlePage.tsx`** or anything else outside `src/content/` and
`scripts/` unless this playbook says so.

Deployment: see `docs/AUTO_ARTICLE_DEPLOY.md` for the current mechanism, because it depends on
whether the repository is in sync with production.

## 9. Verify live, then report

Production must be checked in a browser, not with `curl` — curl hits rate limiting and returns
429, which looks like a broken page. Use the browser tool and `fetch()` from the site's own origin:

```js
const r = await fetch("/<section>/<slug>", { cache: "no-store" });
[r.status, (await r.text()).includes("<a phrase from the article>")];
```

Check the new article, its section page, and each page you added a backlink to.

Then report: the section, the title, the live URL, the sources used, and anything you deliberately
left out. If you skipped the day, say why in one line.

## Hard limits

Never touch: `src/app/page.tsx`, `src/app/layout.tsx`, anything in `src/components/`, `src/lib/`,
`src/data/` (except the model catalogue when the article is about a model launch and the owner has
asked for it), `src/app/api/`, section page files, `vercel.json`, `next.config.ts`, `package.json`,
`tsconfig.json`, `public/robots.txt`, `public/llms.txt`, `public/og-image.jpg`. Never create new
routes. Never add npm dependencies.

Never publish anything the owner said in private as though it were public material.
