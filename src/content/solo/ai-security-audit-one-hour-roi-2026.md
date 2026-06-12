---
title: "One Hour, One AI, One Closed Data Breach — and Four Years of AI Costs Paid Back"
description: "A live PII leak — 16,000 emails exposed through weak database security. I closed it in an hour with AI for $0 in extra cost. The old way: $15,000–$40,000 and a month or two. Here's the money math, and the lesson for anyone running a Supabase or Firebase app."
date: "2026-06-12"
author: "Sergei Ponomarev"
category: "Solo"
image: "/images/articles/cybersecurity-1.jpg"
keywords: ["AI security audit", "Supabase RLS security", "fix data breach with AI", "Claude Code security audit", "AI ROI real example"]
---

# One Hour, One AI, One Closed Data Breach — and Four Years of AI Costs Paid Back

A signal landed in my inbox: a database key was sitting in plain sight in the frontend code of a site I'd been asked to look at. The kind of thing that makes your stomach drop a little. One hour later, the hole was closed, the exposed data was locked down, and a handful of other problems I found along the way were fixed too. My out-of-pocket cost for that hour was zero — I was already paying for the AI tools I used. Priced the old way, the same work runs **$15,000 to $40,000 and takes one to two months**.

I want to walk you through exactly what happened, because behind the drama is a clean illustration of what AI actually changes about the economics of expert work — and a security lesson that applies to a huge number of small apps being built right now.

## The scary-looking thing that wasn't the problem

The exposed key was a Supabase "anon" key. If you've built anything on Supabase, you know these. And here's the first thing the AI and I confirmed together: **that key is public by design.** It's meant to ship in your frontend. Finding it in the page source is not, by itself, a breach — it's how the tool works.

So the obvious-looking problem was a false alarm. That distinction matters, because panicking about the wrong thing wastes the exact hours you don't have during an incident. The real question is never "is the key visible?" It's "what can someone actually *do* with it?"

## The real hole: the data behind the key was wide open

This is where it got serious. With Supabase — and Firebase, and most "backend-as-a-service" platforms — the public key is harmless *only if* your row-level security is doing its job. Row-level security (RLS) is the set of rules that says who can read and write each row of each table. It's the actual lock. The key is just the door handle anyone can grab.

On this site, the lock was barely there. The public key had **read access to personal data — around 16,000 email addresses plus chat conversations — and write access too**, meaning anyone could have forged records. That's not a theoretical risk. That's a live exposure of real people's information, and in the EU it's the kind of thing that triggers breach-notification duties and the compliance costs I've written about in [what the EU AI Act and GDPR actually cost businesses](/government/eu-ai-act-compliance-cost).

I'm deliberately not publishing the step-by-step of how the data could be reached. The point here is defensive, not a recipe. If you take one thing from this article, make it this: **if you run anything on a backend-as-a-service with a public key, your security is your row-level security. Go check it today.** A public key is fine. Unprotected tables sitting behind it are the breach.

## The fix, and then the audit that kept paying off

Closing the leak itself was the core job: lock down row-level security across every table, revoke the public key's read and write access to personal data, and shut a few over-privileged database functions and default permissions that were quietly handing out more access than anyone intended. Server-side writes got moved to a properly privileged service role instead of the public one. After that, an anonymous attempt to read personal data returns a flat **401 Unauthorized**. The door is closed.

But once you're in there with an AI that can read the whole codebase at once, you don't stop at the one fire. The same hour turned up more:

- An API endpoint that was supposed to be members-only but wasn't — any logged-in user could reach a paid AI chat feature. Now it enforces the membership check and returns a 401 or 403 otherwise.
- A cross-site scripting hole in an admin-facing AI report, where unescaped output could run code in the dashboard. Escaped and sanitized.
- A test suite that had been **silently not running at all** — the worst kind, because it gives false confidence. Fixed the harness; 50 tests now pass green.
- Debug mode left on in production, with a **3-gigabyte log file** and config backups sitting inside the public web folder. Removed from where the world could read them.
- A scan of the code history for leaked secrets, which turned out to be a false alarm — only placeholder templates, nothing real to rotate. Knowing *not* to panic is part of the value.
- Sixteen plugins and the theme updated, in batches, with a backup first, each one checked.

Every one of those is a thing a human security reviewer would bill for, and a thing a developer would then spend hours fixing by hand.

## The money math, honestly

Let me put a number on it, because that's what this site is for. I priced what this would cost done the traditional way — a specialist runs the audit and writes the report, then people fix everything by hand:

- **Freelancers:** roughly $8,000–$15,000, over 3–5 weeks.
- **A boutique agency plus a separate developer:** $20,000–$40,000, over 6–10 weeks.
- **A name-brand firm with a formal pentest report:** $40,000–$70,000 and up.

Those are estimates, not quotes — but they're in the right neighborhood for what's in that scope: a real audit and penetration test across the app, the cloud, TLS, and dependencies; emergency response to a live leak of personal data; a GDPR read on the exposure; and then the actual remediation — database permissions, API authorization, XSS hardening, tests, and plugin updates. Realistically that's three specialists and a lawyer, and one to two months.

It took me one hour, working with [Claude Code on Opus 4.8](/tools/claude-opus-4-8-launch-benchmarks-pricing-deep-dive-2026). My marginal cost was the AI subscription I already pay for. Put another way: **this single hour paid back everything I've spent on AI tools across the last four years, several times over.** Not 20% faster. Not a nice efficiency gain. A $15,000-to-$40,000, multi-week, multi-person job collapsed into an hour and a flat subscription fee.

## What this actually means for you

The honest part: AI didn't do this on its own, and I won't pretend it did. I directed it, I made the judgment calls about what was a real risk versus noise, I verified every change, I deployed carefully and watched the tests. The skill that mattered was knowing *what to check and how to confirm it was truly fixed.* AI was the force multiplier, not the operator — and that's exactly why the people who learn to wield it are pulling away, the same pattern behind [the highest-paying AI jobs of 2026](/learn/highest-paying-ai-jobs-2026).

For anyone earning with these tools, the takeaway is bigger than one incident. The kind of work that used to require a whole firm — security audits, the sort of client engagements people build [AI automation agencies](/solo/ai-automation-agency-guide) around — is now within reach of one capable person with the right AI. That's the real shape of the return, and it's why I keep coming back to concrete cases like [making money with Claude](/solo/make-money-with-claude-ai) instead of abstract hype.

So here's the question I'd leave you with. If one prepared person and an AI can now close a live data breach in an hour, the value of that breach-never-happening didn't disappear — it moved. It moved to whoever checks their row-level security *before* the signal lands in their inbox. Is that going to be you?
