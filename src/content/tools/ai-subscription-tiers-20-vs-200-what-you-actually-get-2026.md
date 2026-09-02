---
title: "$20 or $200 a Month? What AI Subscriptions Actually Give You — and Why '20x' Doesn't Mean 20x"
description: "Every AI vendor now sells a $20 tier and a $200 tier, measured in four incompatible units. Paying 2x more can buy as little as 1.3x more weekly capacity — the gap behind a live class action against Anthropic. Here's the verified price board and how to pick."
date: "2026-09-02"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/payment-card-1.jpg"
keywords: ["AI subscription limits 2026", "Claude Max vs Pro", "ChatGPT Plus vs Pro limits", "Cursor Ultra pricing", "AI plan comparison 2026", "which AI subscription to buy"]
---

# $20 or $200 a Month? What AI Subscriptions Actually Give You — and Why '20x' Doesn't Mean 20x

Every serious AI tool now sells you the same shape of decision: a $20 tier that feels affordable, and a $100–$300 tier that promises to remove the limits you keep hitting. The obvious question — "is the expensive one worth ten times the price?" — turns out to be almost unanswerable as asked, and not because the vendors are being coy. It's because **no two of them measure the thing you're buying in the same unit.**

One sells you messages inside a five-hour window. One sells you a weekly allowance of hours. One sells you a dollar-denominated budget of someone else's model. One sells you credits whose value changes depending on how much of your context was cached. Comparing "$20 vs $200" across those is like comparing rent quoted in square metres, months, and cost-per-window. So I did the work: pulled the current prices, checked the mechanics, and — because a claim this consequential deserves it — verified the one legal case that proves the multipliers don't mean what you think. Here's what's actually true in September 2026.

## The verified price board

Start with what the money buys, because even this is more crowded than most people realize. Several of these tiers didn't exist a year ago:

| Provider | Entry | Mid | Top |
|---|---|---|---|
| **ChatGPT** | Go **$8** · Plus **$20** | Pro **$100** (5x) | Pro **$200** (20x) |
| **Claude** | Pro **$20** | Max 5x **$100** | Max 20x **$200** |
| **Cursor** | Hobby free · Pro **$20** | Pro Plus **$60** | Ultra **$200** |
| **Grok** | SuperGrok **$30** | — | SuperGrok Heavy **$300** |
| **Z.ai GLM Coding** | Lite **$18** | Pro **$72** | Max **$160** |

Two things worth flagging immediately, because they're the kind of detail that gets left out of comparisons. **Grok is not a $300-or-nothing choice** — there's a $30 SuperGrok tier underneath Heavy, and Heavy has been running a promotional rate well below list. **Z.ai's middle tier exists** at $72 and the whole ladder has carried an introductory discount of around 30%, which pulls Lite under $13. If you priced these from a six-month-old comparison, you priced them wrong.

## Four incompatible units — the real reason comparison fails

Here is the heart of the problem, and once you see it you can't unsee it. Each vendor meters a fundamentally different resource:

| Provider | What you're actually buying | What makes your capacity vary |
|---|---|---|
| **ChatGPT / Codex** | Messages inside a rolling **5-hour** window, plus a **weekly** cap | Which model you pick — heavier models burn the allowance far faster |
| **Claude** | One shared pool: **5-hour session** + **weekly** cap | Every prompt, tool call, file read and thinking block draws from it |
| **Cursor** | A **dollar budget** of third-party model usage: **$20 / $70 / $400** | The API price of whichever model you route to |
| **Z.ai GLM** | **Credits** per 5 hours and per week | Your cache hit rate — cached input is priced differently from fresh |
| **Grok Heavy** | A single **weekly pool** across Chat, Imagine, Voice and Build | Everything you do competes for the same allowance |

Cursor's model is the honest outlier and worth understanding, because it's the only one where you can compute your capacity exactly. Pro doesn't give you "requests" — it gives you **$20 of model usage at API rates**, Pro Plus gives $70, Ultra gives $400. Route to a cheap model and that budget stretches a long way; route everything to a flagship and it evaporates. That's why the [real cost-per-task discipline](/tools/claude-sonnet-5-cheaper-than-opus-real-cost-2026) matters more than the sticker: with Cursor, your subscription is literally a wallet, and model routing is the spend control.

Z.ai has a catch that no price table shows: the GLM Coding Plan **works only inside supported coding tools** — Claude Code, Cline, OpenCode and similar. It is not a general chat subscription. Cheap, but narrow, and it's the same [open-model economics](/tools/glm-5-2-china-open-model-cant-be-banned-2026) that make it possible.

## The trap: the multiplier applies to the window, not the week

This is the single most important thing in this article, and it's where most people lose money.

When Anthropic sells "Max 5x" and "Max 20x", or OpenAI sells Pro at 5x and 20x, that multiplier is applied to the **five-hour session** allowance. Your **weekly** cap does not scale by the same factor. So you can pay double and get nowhere near double the actual work done across a week — which is exactly the gap now being litigated.

Per reporting on the case, the weekly ceilings look roughly like this:

| Plan | Price | Reported weekly usage | Cost per weekly hour |
|---|---|---|---|
| **Max 5x** | $100/mo | ~**15–35 hours** | ~$0.66–$1.54 |
| **Max 20x** | $200/mo | ~**24–40 hours** | ~$1.15–$1.92 |

Run that arithmetic slowly, because it's counterintuitive. Doubling your spend from $100 to $200 buys somewhere between roughly **1.15x and 1.6x** more weekly hours — not 4x, as the "5x → 20x" labels imply. On a per-hour basis the expensive tier can be **worse value than the cheaper one**. The multiplier is real; it just applies to a window most heavy users blow through anyway before the weekly cap stops them.

*(Those hour ranges come from reporting around the lawsuit rather than an official published table — treat them as the best available figures, not gospel. The structural point, that the multiplier governs the session and not the week, is not in dispute.)*

## The lawsuit that makes this concrete

I checked this claim specifically rather than repeating it, because "there's a lawsuit" is the kind of thing that circulates loosely. It holds up.

On **June 14, 2026**, Karl Kahn, a Washington DC resident, filed a federal complaint against Anthropic in the **US District Court for the Northern District of California**. The allegation is precisely the gap described above: that the actual usage delivered by Max 5x and Max 20x is **far below the advertised amount**, and that the real caps are difficult for a subscriber to determine at all. Kahn says he upgraded to Max 20x in April and hit his weekly ceiling quickly — with a single five-hour session consuming about **15% of his entire weekly allowance**.

The filing seeks **class-action status** covering everyone who subscribed to either Max tier since **April 9, 2025**, and brings claims under California's **Consumers Legal Remedies Act** and its **False Advertising Law**.

I want to be careful and fair here: these are **allegations**, not findings, and Anthropic is entitled to defend them. It's also worth noting the company whose plans are being challenged is the one that just became [the first frontier lab to turn a profit](/b2b/anthropic-first-profitable-ai-lab-enterprise-model-won-2026), largely on business customers. But the existence of a filed federal case tells you the ambiguity in these limits is not just your imagination, and it's the strongest possible argument for the practical advice at the end of this piece: measure, don't trust the label.

## OpenAI's moving target

If you priced ChatGPT even a few weeks ago, your information may already be stale — and this is a genuinely fresh change worth knowing. OpenAI **removed** the five-hour limit for a period, leaving Plus subscribers under a weekly cap only, and then **restored the five-hour window starting August 25, 2026** for Codex and ChatGPT Work on Plus.

That matters for planning: for several weeks the optimal strategy was to batch heavy work into long sessions, and that strategy just stopped working. Two other mechanics are worth knowing because they're real escape valves the comparison articles skip:

- **You can buy your way past a wall.** Hitting the cap isn't necessarily the end of your day — additional credits are purchasable, which converts a hard stop into a variable cost.
- **Resets can be banked.** Using a full banked reset refreshes both your 5-hour and weekly Codex windows, and shifts your weekly reset date — a detail that changes how you should time a crunch.

The lesson is that these limits are **product decisions, not physics**. They changed twice this summer at one vendor alone, which is a strong argument against locking yourself into an annual plan on the basis of this month's ceiling.

## Where published numbers disagree

Since the whole point of this piece is to be checkable, here's where I could not get a clean answer — and you should be suspicious of anyone who states these as settled fact.

The per-window **message counts for Codex on Plus differ materially between sources.** For GPT-5.6 I found one set citing roughly 15–90 (Sol), 20–110 (Terra) and 50–280 (Luna) per five hours, and another citing 10–100 (Sol), 25–200 (Terra) and **250–2,000 (Luna)** — an order of magnitude apart on the same model and tier. Both are presented confidently. They can't both be right.

Claude's message-count equivalents (commonly quoted as roughly 45 / 225 / 900 messages per five-hour window for Pro / Max 5x / Max 20x) are **third-party estimates**, not an official published table — Anthropic does not publish an absolute token figure.

That ambiguity is itself the finding. When the unit is unpublished, ranges vary tenfold between reputable trackers, and the caps move mid-quarter, **no amount of reading will tell you what you're buying.** Only your own usage will.

## How to actually choose

Forget tier comparison and answer one question instead: **which limit hits you first?** Everything follows from that. Run this for two weeks on the cheapest plausible plan before you upgrade anything.

| If the thing that stops you is… | The fix is… | Not… |
|---|---|---|
| The **5-hour window**, mid-session | Upgrading a tier — this is exactly what multipliers buy | Switching vendor |
| The **weekly cap**, mid-week | A second cheaper subscription elsewhere, or an API fallback | Doubling your spend on the same vendor |
| **One expensive model** eating everything | Routing cheap work to a cheap model | Any upgrade at all |
| **One tool** (only coding, say) | A narrow, cheap plan like GLM Coding | A general premium tier |

That second row is the money-saver almost nobody acts on. If your blocker is the weekly ceiling, going from $100 to $200 with the same vendor buys you maybe 1.3x more week — whereas **$100 at a second vendor buys you a whole separate weekly allowance**, plus a fallback when one provider has an outage or, as [Cursor found out when OpenAI moved to cut off its models](/tools/openai-cuts-off-cursor-spacex-model-lock-in-lesson-2026), a commercial dispute. Two $100 plans usually beat one $200 plan for heavy users. That's not a trick; it's just what the weekly math says.

## What this means for you

**If you're a casual or occasional user**, stay at $20 — or look harder at the tiers below it. ChatGPT Go at $8 and GLM Lite at around $18 (less with the intro discount) exist precisely for people who never touch the ceiling. Most people paying $200 are buying a limit they hit twice a year.

**If you code all day**, this is where the money is real, and the honest advice is to measure before upgrading. Track which wall you hit for two weeks. If it's the five-hour window, the multiplier genuinely helps. If it's the weekly cap, diversify instead of upgrading — the [per-task cost discipline](/solo/claude-api-cost-side-business) applies to subscriptions just as much as to API calls, and it's the difference between a [profitable developer setup](/solo/claude-code-developer-income) and an expensive one.

**If you're buying for a team**, the per-seat arithmetic dominates everything else, and the same "what does a seat actually deliver" question I asked about [Copilot's seat math](/tools/microsoft-copilot-seat-math-2026) applies here. Twenty seats at $200 is $48,000 a year; the same twenty at $100 is $24,000. Before signing, get your heaviest two users to run a fortnight at the lower tier and report which limit stopped them.

**If you just want a rule of thumb**: start one tier below where you think you belong, and let the limits tell you when to move. Upgrading is instant; refunds are not.

## The honest take

What strikes me most, having actually chased these numbers down, is how hard the vendors have made a simple purchase. This is a market where the unit of sale is unpublished, the ceilings changed twice in one summer at a single provider, reputable trackers disagree by a factor of ten on the same tier, and one company's multiplier claims are in front of a federal judge. That is not an accident of a young industry — clear units would make these plans directly comparable, and directly comparable plans compete on price.

The practical defence is unglamorous and works: **treat every subscription as an experiment with a two-week deadline.** Buy the cheap tier, instrument what you actually use, find out which wall you hit, and let that decide where the next $100 goes — including the possibility that it goes to a different vendor entirely. That approach is immune to marketing multipliers, mid-quarter limit changes, and whatever the tiers look like next quarter, which is more than can be said for any comparison table, this one included.

So here's the question to answer before your next upgrade: do you actually know whether it's the five-hour window or the weekly cap that stops you — and if you don't, what exactly are you about to buy?

*Prices and limits verified September 2026 and change frequently; the lawsuit describes allegations, not findings. Check the vendor's current page before subscribing.*

Sources: [Engadget — Anthropic sued over Claude Max usage limits](https://www.engadget.com/2194626/anthropic-hit-with-lawsuit-over-its-claude-max-usage-limits/); [9to5Mac — OpenAI restores 5-hour Codex limits](https://9to5mac.com/2026/08/24/openai-restores-5-hour-codex-and-work-limits-for-chatgpt-plus-users/); [OpenAI Help Center — Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan).
