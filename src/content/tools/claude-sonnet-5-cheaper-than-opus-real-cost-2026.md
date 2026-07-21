---
title: "Claude Sonnet 5 Is Here: Near-Opus Power at 40% Off — But the Token Bill Hides a Catch"
description: "Anthropic just launched Claude Sonnet 5 — agentic power close to Opus 4.8 at a much lower sticker price ($2/$10 intro per million tokens). But it uses ~30% more tokens, and one analysis found its real per-task cost landed ABOVE Opus. Here's the actual money math."
date: "2026-07-20"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/ai-abstract-1.jpg"
keywords: ["Claude Sonnet 5 pricing", "Claude Sonnet 5 vs Opus 4.8", "Sonnet 5 cost per token", "Claude Sonnet 5 benchmarks", "AI model cost 2026", "Claude API pricing"]
---

# Claude Sonnet 5 Is Here: Near-Opus Power at 40% Off — But the Token Bill Hides a Catch

Anthropic just dropped Claude Sonnet 5, and the headline writes itself: near-flagship, Opus-class power at a fraction of the price. If you build anything on AI — a product, a side project, an internal tool — that sentence should make you sit up, because the single biggest lever on the economics of an AI business is what you pay per unit of intelligence, and that number just moved. Sonnet 5 does agentic work — planning, using browsers and terminals, running autonomously — that a few months ago demanded the biggest, most expensive models, and it does it at a sticker price roughly 40% below Opus 4.8.

But I want to save you from a mistake I'm already watching people make this week: reading the press release instead of the invoice. Because Sonnet 5 has a quirk that the "cheaper per token" headline completely hides — it tends to use *more* tokens to do the same job, and in at least one careful analysis that pushed its real per-task cost *above* Opus 4.8, the very model it's supposed to undercut. So let me walk you through what actually launched, where it lands on the benchmarks, and — most importantly — how to figure out what it will really cost *you*, not what the sticker says.

## What Anthropic actually launched

First the facts. Claude Sonnet 5 is billed as the most agentic Sonnet model yet: it makes plans, uses tools, and runs autonomously through multi-step tasks rather than just answering a single prompt. It's available everywhere at once — Free, Pro, Max, Team, and Enterprise plans, inside Claude Code, and on the Claude Platform (the API) for builders. It ships with the full **1-million-token context window** at standard pricing, which matters if you feed it big codebases or document piles.

The pitch is simple and, on the benchmarks, largely true: performance close to Opus 4.8 at a lower price, with an introductory-pricing window to get everyone to try it. This slots directly beneath the model I broke down in [the Claude Opus 4.8 deep dive](/tools/claude-opus-4-8-launch-benchmarks-pricing-deep-dive-2026) and alongside the specialized [Fable 5 and Mythos 5 models](/tools/claude-fable-5-mythos-5-launch-2026) — a family where the whole game, for your wallet, is picking the right model for each job. Get that routing right and you can cut your AI bill dramatically; get it wrong and you overpay on every call.

## Where it lands on the benchmarks

Numbers first, because "close to Opus" is a marketing phrase until you see the gap. On the two benchmarks that matter most for real agentic and coding work, here's how Sonnet 5 sits between its predecessor and the flagship:

| Benchmark | Sonnet 4.6 | **Sonnet 5** | Opus 4.8 |
|---|---|---|---|
| SWE-bench Verified (coding) | 62.3% | **72.7%** | 79.4% |
| SWE-bench Pro (agentic coding) | 58.1% | **63.2%** | 69.2% |

Read those rows honestly and you get a clear picture. Sonnet 5 is a big jump over Sonnet 4.6 — more than ten points on SWE-bench Verified, which is a generational leap for the mid-tier. But it is *not* Opus 4.8; the flagship still leads by roughly 6–7 points on both. So "near-Opus" is fair but not "equals Opus." The question every builder has to answer is whether that last 6–7 points of capability is worth Opus's much higher price for your specific work — and the answer, as we're about to see, is genuinely complicated.

## The sticker price: real savings on paper

Here's the pricing that's driving the excitement. Through August 31, 2026, Anthropic is running introductory rates, after which Sonnet 5 settles at its standard price. Compared to Opus 4.8, the per-token discount is real:

| Model | Input ($/M tokens) | Output ($/M tokens) |
|---|---|---|
| **Sonnet 5 — intro (through Aug 31)** | $2 | $10 |
| **Sonnet 5 — standard (from Sep 1)** | $3 | $15 |
| Opus 4.8 | $5 | $25 |

On paper this is a clean win. At the introductory rate, Sonnet 5 output tokens cost 60% less than Opus. Even at the standard rate, you're paying $15 per million output tokens versus Opus's $25 — a 40% discount per token. For a high-volume application making millions of calls, a 40% cut on the dominant cost line looks like the difference between a business that works and one that doesn't. This is the same relentless price pressure I've tracked across the industry, from [Google's Gemini Flash price war](/tools/google-io-2026-gemini-35-flash-price-war) to [China's GLM going open and nearly free](/tools/glm-5-2-china-open-model-cant-be-banned-2026). The cost of intelligence keeps falling, and Sonnet 5 is the latest cut.

## The catch: why price-per-token lies

Now the part almost nobody puts in the headline, and the reason you should never budget off the sticker price alone. **Your bill is not price-per-token — it's price-per-token multiplied by tokens-per-task.** And Sonnet 5 changes both numbers, in opposite directions.

Sonnet 5 reportedly uses around **30% more tokens** than earlier Claude models to complete an equivalent task. It's more verbose, it "thinks" more, and as an agentic model it takes more steps — each of which spends tokens. So while the price *per token* dropped, the number of *tokens per task* went up. Multiply those together and the savings shrink fast. In one independent analysis of an agentic workload, Sonnet 5's real operating cost came out around **$2.29 per task — roughly double Sonnet 4.6, and about 15% *above* Opus 4.8.** Read that again: on that workload, the "cheaper" model was more expensive than the flagship it undercuts on paper.

| What you compare | Sonnet 5 vs Opus 4.8 |
|---|---|
| Price per token (sticker) | ~40% cheaper (standard rate) |
| Tokens used per task | ~30% more |
| Real cost per task (one agentic analysis) | ~15% **more** expensive |

This isn't a scandal — it's a lesson in how AI pricing actually works. A lower per-token price can be completely erased by higher token consumption, especially on long, autonomous, multi-step jobs where the token count balloons. It's the model-level version of the [cost pass-through dynamics I mapped in enterprise AI](/b2b/ai-cost-pass-through-enterprise-software-2026): the headline number and the number on your invoice are two different things.

## How to actually calculate your cost

So how do you avoid overpaying? You measure your *own* workload instead of trusting anyone's headline — mine included. Here's the method, and it takes an afternoon:

**Run the same real tasks on both models.** Take 20–50 tasks that actually represent your work — your real prompts, your real documents, your real agentic loops — and run them through both Sonnet 5 and Opus 4.8. Don't use toy examples; use your production workload.

**Measure tokens per task, not price per token.** Record the actual input and output tokens each model burns per task. This is the number that varies and the number that decides your bill.

**Do the multiplication.** Real cost = (input tokens × input price) + (output tokens × output price), averaged across your tasks. Now compare the totals. For short, one-shot tasks — classification, extraction, a single answer — Sonnet 5's sticker discount usually survives and it genuinely is cheaper. For long, autonomous agentic runs — the kind that plan, browse, retry, and self-correct across many steps — the token inflation can eat the savings and even flip it, exactly as that $2.29 analysis found.

This is precisely the cost discipline I preach for anyone running AI as a business, the same [API-cost math behind a profitable Claude side project](/solo/claude-api-cost-side-business). The builders who win on margin aren't the ones who chase the lowest sticker price — they're the ones who measure real cost per task and route each job to the model that does it cheapest at acceptable quality.

## When to use which: the money-smart routing

Put it all together and you get a practical decision framework. You almost never want to run everything on one model — you want to route by job, because that's where the real savings live.

| Your task | Best pick | Why |
|---|---|---|
| High-volume, simple, one-shot (classify, extract, summarize) | **Sonnet 5** | Sticker discount survives; token inflation is small on short jobs |
| Everyday coding, drafting, tool use | **Sonnet 5** | Near-Opus quality at real savings for medium tasks |
| Long autonomous agentic runs, hardest reasoning | **Opus 4.8** | The 6–7 point edge and tighter token use can make it cheaper *and* better |
| Cost-insensitive bulk / offline work | **Open models** (e.g. GLM) | When "good enough" and near-free beats paying per token at all |

Notice the counterintuitive middle: for your *hardest, longest* agentic jobs, the flagship Opus can actually be the frugal choice, because it may finish in fewer tokens even at a higher per-token price. That's the opposite of the intuition the pricing table gives you, and it's why the [right-model-for-the-job routing](/solo/one-person-company-ai-agents-limits-2026) is where AI-cost optimization actually happens.

## What this means for you

Depending on how you use AI, here's the practical read.

**If you're a solo builder or run a side business on the API**, Sonnet 5 is very likely a win for the bulk of your calls — but prove it before you migrate everything. Run your real tasks, measure tokens per task, and only switch the workloads where the math actually favors it. Grab the introductory pricing window to run those tests cheaply, and remember the price steps up on September 1. The discipline pays for itself the first month, the same way it does in [the Claude-vs-ChatGPT money comparison](/solo/claude-vs-chatgpt-make-money).

**If you run engineering or a team**, this is a routing opportunity, not a wholesale switch. Move your medium-complexity coding and tool-use to Sonnet 5, keep the gnarliest agentic and reasoning work on Opus 4.8, and instrument your token usage so you can see the real per-task cost by workload. The seat-and-usage math matters more than the sticker, exactly as it did in [the Microsoft Copilot seat-cost breakdown](/tools/microsoft-copilot-seat-math-2026).

**If you're just choosing which Claude to use day to day** inside Pro or Max, the simple version: Sonnet 5 is your fast, capable default for almost everything, and you reach for Opus 4.8 when a task is genuinely hard or long and the quality gap shows. For the head-to-head across providers, [my ChatGPT vs Claude vs Gemini comparison](/tools/chatgpt-vs-claude-vs-gemini) still holds — Sonnet 5 just makes Claude's mid-tier a lot more competitive.

## The honest take

Claude Sonnet 5 is a genuinely impressive release — a mid-tier model that does agentic work which required a flagship not long ago, at a sticker price that undercuts one. That's real progress, and for a large share of everyday AI work it will lower your bill. I don't want the "catch" to read as cynicism, because the direction is unambiguously good: intelligence keeps getting cheaper, and Anthropic pricing Sonnet this aggressively — as it eyes the public markets I covered in [its march to a near-trillion valuation](/vc/anthropic-30b-raise-900b-valuation-2026) — is the price war working in your favor.

But the deeper lesson is the one that outlasts this launch: in AI, the number on the press release and the number on your invoice are not the same number, and the gap between them is your responsibility to measure. A lower per-token price is a promise; tokens-per-task is the fine print; and only your own workload tells you which one wins. The builders who quietly out-earn everyone else aren't the ones who jump on every "cheaper" headline — they're the ones who run the test, read the real bill, and route each job to whatever does it cheapest at the quality they need. Sonnet 5 is a fine new tool in that kit. Just weigh it on your own scale before you trust the label.

So here's the question worth acting on this week: do you actually know your real cost per task on the work you run most — or have you been budgeting off a sticker price that was never your bill? An afternoon of measuring is the highest-ROI thing you'll do with Sonnet 5.

Sources: [Introducing Claude Sonnet 5 — Anthropic](https://www.anthropic.com/news/claude-sonnet-5); [Claude Platform pricing](https://platform.claude.com/docs/en/about-claude/pricing).
