---
title: "Claude API and Subscription Costs: What a One-Person AI Business Really Pays"
description: "Subscription or API? Per-token math, real monthly examples, and the margin story behind AI services. Here's exactly what Claude costs to run a solo AI business in 2026 — and why it's a rounding error against what it earns."
date: "2026-06-12"
author: "Sergei Ponomarev"
category: "Solo"
image: "/images/articles/fintech-card-1.jpg"
keywords: ["Claude API cost", "Claude pricing for business", "Claude API vs subscription", "cost to run AI business", "Claude token pricing 2026"]
---

# Claude API and Subscription Costs: What a One-Person AI Business Really Pays

The most common reason people hesitate to build an AI side business is a fear that the costs will eat them alive. They won't. Once you see the actual numbers, the worry flips into the opposite realization: AI services carry margins most businesses can only dream of. Let me lay out exactly what Claude costs, the two ways to pay for it, and the margin math that makes this worth your attention.

## Two ways to pay, for two kinds of work

**The subscription, for hands-on work.** If you do the work yourself — writing, coding, research, analysis — you want a flat-rate plan. Claude runs about **$20/month** for Pro and **$100–$200/month** for the Max tiers that unlock heavy [Claude Code](/solo/claude-code-developer-income) usage. Flat, predictable, unlimited within fair-use. For most freelancers, this is the entire AI bill.

**The API, for products and agents.** If you build something that serves *other people* automatically — an agent, a tool, a SaaS — you pay per token (a token is roughly ¾ of a word, counting both what you send and what comes back). This scales with usage instead of being flat.

## The per-token math, in plain numbers

Anthropic prices by model tier, cheapest to most powerful:

- **Haiku** — the cheapest tier, for high-volume, simple tasks.
- **Sonnet** — the balanced workhorse for most production work.
- **Opus 4.8** — **$5 per million input tokens, $25 per million output**, for the hard reasoning jobs.
- **[Claude Fable 5](/models/claude-fable-5)** — $10/$50 per million, the frontier tier for long, autonomous work.

A "million tokens" sounds abstract, so anchor it: a million tokens is roughly 750,000 words — about ten full novels. Most real tasks use a few thousand tokens, not a million. And **prompt caching cuts repeat input costs by up to 90%**, which matters enormously when an agent reuses the same instructions thousands of times.

## A real monthly example

Say you build an agent that handles 500 client requests a month, each request using ~4,000 input and ~1,000 output tokens on the mid Sonnet tier. That's 2 million input and 0.5 million output tokens for the month. Even at Opus-level pricing that's roughly **$10 + $12 = $22 a month** in tokens — and on Sonnet, a fraction of that. Run it on the cheapest tier for the simple requests and route only the hard ones to Opus, and you control cost precisely.

Now the part that matters. If that agent delivers a service you charge a client **$2,000/month** for, your AI cost of goods is around **1%**. That's a 99% gross margin on the AI itself. I've seen this firsthand — [one hour of AI-driven work that replaced a $15,000–$40,000 job](/solo/ai-security-audit-one-hour-roi-2026) cost effectively nothing in tokens. The economics aren't a little good. They're absurd.

And the costs scale gently, not explosively. Take that same agent to 5,000 requests a month — ten times the volume — and on the mid Sonnet tier you're still looking at low tens of dollars, while the revenue from ten times the clients climbs into five figures. This is the opposite of a traditional service business, where serving ten times the customers means hiring ten times the people. Your cost line stays nearly flat while your revenue line climbs. That divergence is the whole reason a single person can now run what used to require a team — and it's why the token bill should be the last thing you worry about.

## How to keep costs near zero

- **Match the model to the task.** Don't run Opus on a job Haiku can do. Tier routing is the single biggest cost lever.
- **Cache your prompts.** If your agent reuses a long system prompt, caching turns that repeated cost into near-nothing.
- **Start on the subscription.** Until you're building something that runs without you, the $20 plan covers everything. Don't touch the API until you have a product that needs it.
- **Charge for outcomes, not tokens.** Your client pays for the result, not your cost. This is the heart of the argument that [AI belongs in the services you sell, not just back-office functions](/b2b/start-ai-with-services-not-functions-2026) — that's where the margin lives.

## The takeaway

The cost of running a one-person AI business with Claude is, for most people, a $20–$40 monthly subscription — less than a couple of coffees a week. The moment you build something that serves customers automatically, you shift to per-token pricing that still lands at single-digit percentages of what you charge. The fear that costs will sink you is backwards. The real story is the margin: you sell outcomes worth thousands and pay tens. If you haven't picked what to sell yet, that's the actual first move — start with the [7 proven ways to make money with Claude AI](/solo/make-money-with-claude-ai), and price the result, not the tokens.
