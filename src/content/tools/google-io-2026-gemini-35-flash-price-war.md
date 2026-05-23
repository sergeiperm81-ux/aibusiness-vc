---
title: "Google I/O 2026: Gemini 3.5 Flash, $99 Ultra, and the Price War That Just Started"
description: "Google dropped Gemini 3.5 Flash at 25% lower API pricing, cut Ultra subscription from $250 to $99, and crossed 1 billion AI Mode users — all in one keynote. Why this is the moment Gemini stopped being the dark horse and became the price-setter for the entire AI industry."
date: "2026-05-22"
author: "Sergei P."
category: "Tools"
image: "/images/articles/hologram-1.jpg"
keywords: ["Google I/O 2026", "Gemini 3.5 Flash pricing", "Gemini Omni launch", "Google AI Ultra $99", "AI price war 2026", "Gemini vs ChatGPT vs Claude"]
---

# Google I/O 2026: Gemini 3.5 Flash, $99 Ultra, and the Price War That Just Started

Google I/O 2026 happened on Tuesday, May 19. By Wednesday morning, every other AI company was rewriting its 2027 budget.

The keynote delivered three product moves that landed as a single coordinated message: Gemini 3.5 Flash at $1.50/$9 per million tokens (25% cheaper than the prior Pro tier), Google AI Ultra cut from $249.99 to $99.99 per month (60% price drop), and AI Mode in Search crossing 1 billion monthly users with Gemini 3.5 Flash as the default model. Add Gemini Omni — Google's first true multimodal video-generation model — shipping to consumer subscribers the same day, and you have what is functionally the largest single-day reset of AI pricing in the industry's short history.

This is the moment Gemini stopped being the dark horse and started being the price-setter that everyone else has to react to.

## The Pricing Cut That Matters Most

Gemini 3.5 Flash is the single most important pricing change in this announcement, because Flash is the workhorse tier — the model that runs the bulk of production AI workloads at scale.

| Model | Input ($/1M tokens) | Output ($/1M tokens) | Cached input | Context window |
|---|---|---|---|---|
| Gemini 3.5 Flash | $1.50 | $9.00 | $0.15 | 1,048,576 / 65,536 out |
| Gemini 3.1 Pro (prior gen) | $2.00 | $12.00 | $0.25 | 1,000,000 |
| GPT-4o (current) | $2.50 | $10.00 | $1.25 | 128,000 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | 1,000,000 |
| Claude Opus 4.7 | $15.00 | $75.00 | $1.50 | 1,000,000 |

The 25% cut versus the prior Gemini Pro tier sounds modest until you do the cross-vendor math. Gemini 3.5 Flash is now roughly 50% cheaper on input and 40% cheaper on output than Claude Sonnet 4.6, while delivering 76.2% on Terminal-Bench 2.1 and 83.6% on MCP Atlas — benchmarks where it beats or matches the prior Gemini Pro and approaches Claude Sonnet on coding and agentic tasks.

For any AI product running at scale — agents, customer support bots, code copilots, content generation — Gemini 3.5 Flash is now the default rational choice unless you specifically need Claude's coding edge or GPT-4o's specific quirks. That is a much weaker form of competitive positioning than Claude and OpenAI enjoyed even six months ago.

## The 1 Billion AI Mode Users

The number that got the least attention in the announcement is the most important one: AI Mode in Search crossed 1 billion monthly active users, with Gemini 3.5 Flash as the default model serving those queries.

For context, ChatGPT — the most successful consumer AI product in history — reportedly serves around 900 million weekly active users. Claude has tens of millions. Perplexity has tens of millions. AI Mode at 1 billion monthly is now the largest single AI consumer product on the planet, and it is bundled into Search.

The distribution implications are enormous. Google does not need to convince users to download an AI app or visit chat.openai.com. AI Mode shows up the moment someone types a query into the existing Google Search box that 4 billion people already use every day. The funnel is built. The habit is built. The infrastructure is built. The only thing that was missing was a Flash model fast and cheap enough to serve every query economically — and that arrived on May 19.

I covered the [Perplexity vs Google Search dynamic](/startups/perplexity-vs-google-search) earlier this year. The thesis was that Google would not lose search overnight but would lose it slowly to AI-native alternatives. The Gemini 3.5 Flash + AI Mode integration is Google's response: keep search, embed AI deeply, and use the existing distribution moat to defend share. So far it is working.

## The $99 Ultra Cut

Google AI Ultra dropped from $249.99 per month to $99.99 per month overnight — a 60% price cut that nobody saw coming.

The strategic logic is straightforward: ChatGPT Plus is $20/month, Claude Pro is $20/month, ChatGPT Pro is $200/month for the top tier. Google was positioned at $249.99 with Ultra, which made it the most expensive consumer AI subscription on the market — and consumers were not buying. The drop to $99.99 puts Ultra below ChatGPT Pro ($200) and well above Claude Pro and ChatGPT Plus ($20), creating a clean three-tier market:

| Tier | Price/mo | Players | Target |
|---|---|---|---|
| Mass-market | $7.99-$19.99 | Google AI Plus, ChatGPT Plus, Claude Pro, Gemini Pro | Consumers, light users |
| Premium | $99.99 | Google AI Ultra (new) | Power users, prosumers |
| Enterprise/Top | $200+ | ChatGPT Pro, Claude Team/Enterprise | Heavy creators, businesses |

The price cut is Google saying out loud what their data has been telling them: at $250, almost nobody upgrades from Pro to Ultra. At $100, the upgrade rate triples or more. The lifetime revenue from 5 million Ultra subscribers at $100 dwarfs the revenue from 1 million Ultra subscribers at $250.

The collateral damage lands on Anthropic and OpenAI. Claude does not have a $100 tier — it jumps from $20 Pro to $30+ Team to enterprise. ChatGPT has the $20 Plus and $200 Pro but nothing in the middle. Google just claimed the premium prosumer tier with no direct competition.

## Gemini Omni Changes the Video AI Math

Gemini Omni Flash, announced the same day, is Google's first multimodal video-generation model — combining image, audio, video, and text inputs into video outputs with conversational editing. It shipped to Google AI Plus, Pro, and Ultra subscribers globally on launch day, with API access "in the coming weeks."

This is a direct shot at OpenAI Sora and Runway Gen-4. The capability set is competitive — physics-aware generation, character consistency across edits, multimodal input fusion — but the distribution advantage is decisive. OpenAI Sora is gated and slow to roll out. Runway is a standalone product at standalone pricing. Gemini Omni is bundled into a $7.99/month Google AI Plus subscription that already includes everything else.

For advertisers, marketers, retail product visualization, and creator workflows, Gemini Omni at bundled pricing is a stronger value proposition than any standalone video AI tool. Expect Adobe, Canva, and the long tail of creative AI startups to add Gemini Omni API integrations within 90 days of API availability. Expect Runway and the standalone video AI specialists to face serious pricing pressure.

## What This Does to OpenAI

The pricing pressure on OpenAI is real and immediate. ChatGPT is still the dominant consumer AI brand and still has roughly $2 billion in monthly revenue with 40%+ from enterprise. None of that disappears overnight. But the marginal calculus on every API decision and every new ChatGPT Plus signup gets harder.

OpenAI's response will be some combination of three moves over the next 90 days:

1. **GPT-5 launch acceleration.** A new flagship model that meaningfully beats Gemini 3.5 Flash on benchmarks resets the conversation. The technical question is whether GPT-5 is ready.
2. **Pricing cuts on GPT-4o.** Matching Gemini 3.5 Flash on $/1M tokens is the obvious defensive move. Expect a 20-30% API price cut within 60 days.
3. **Distribution doubling-down.** OpenAI's Apple Intelligence partnership and Microsoft Copilot integration are the two distribution beachheads that compete with Google's Search funnel. Expect aggressive deepening of both.

I covered the [OpenAI $13B+ ARR trajectory](/startups/openai-13b-arr) and the [Anthropic-OpenAI workplace adoption race](/b2b/anthropic-openai-ramp-workplace-adoption-2026) earlier this year. The numbers still hold for now. But OpenAI's path from $25B run-rate to $100B run-rate just got materially harder, because Google can credibly underprice every API tier OpenAI offers.

## What This Does to Anthropic

Anthropic faces a sharper version of the same problem. Claude is the premium-quality model for coding and agentic workloads — but premium quality at premium price stops being an obvious value proposition when Gemini 3.5 Flash hits 76.2% Terminal-Bench at half the cost.

The strategic response is already visible in this week's other news. The [rumored Microsoft Maia 200 inference deal I covered yesterday](/startups/microsoft-anthropic-maia-200-chip-deal-2026) is exactly the kind of cost-side move Anthropic needs to make to defend margins against Google's pricing pressure. If Anthropic can cut its inference COGS by 30% via Maia 200 and use that headroom to drop Claude API prices 20-25%, the competitive picture stays defensible. If the deal stalls and Claude pricing stays flat, market share erodes through 2026.

The [$5B+ Anthropic ARR](/startups/anthropic-5b-arr) keeps growing in absolute terms either way. The question is whether the growth rate stays high enough to support the current $200B+ valuation when the price competition gets real.

## What This Does to Enterprise AI Buyers

If you are running AI at any meaningful scale in your business, the Google I/O announcements just gave you a negotiation tool you did not have last week.

The simple play: tell your current model provider (whoever it is) that Gemini 3.5 Flash benchmarks within 5-10% of your current model at 30-50% lower cost, and ask what they can do on pricing for your next contract renewal. The conversation alone unlocks 15-25% price concessions from the incumbents trying to keep your business.

The [AI cost pass-through dynamics I covered last month](/b2b/ai-cost-pass-through-enterprise-software-2026) start to shift. Through 2024-2025, model providers and the SaaS companies built on top of them passed inference cost increases through to customers as price increases. Starting now, that dynamic reverses. Watch for the first round of API price cuts from OpenAI and Anthropic within 30-60 days. Watch for SaaS vendors quietly cutting "AI premium" pricing within 90 days.

For AI wrapper startups, the picture is more nuanced. Lower model costs mean better gross margins on existing products — good. But the moat of "we built a smart UX on top of expensive AI" weakens when the AI gets cheap, because building a wrapper becomes easier and the underlying model commoditizes. The wrapper startups that survive the price war are the ones with proprietary data, distribution, or vertical depth that the underlying model alone cannot replicate.

## The Watch List

Three signals tell you how the price war evolves over the next 90 days:

1. **OpenAI's response.** A GPT-5 launch announcement within 30 days suggests OpenAI was holding the model back for exactly this moment. Silence suggests they need 6 more months and will compete on price in the meantime.
2. **Gemini 3.5 Pro release.** Google said Gemini 3.5 Pro is in internal use and ships in June 2026. The pricing on Pro relative to Flash will tell you how aggressive Google plans to be on the high end.
3. **Anthropic API pricing changes.** If Claude API prices drop 15-25% within 60 days, the Maia 200 deal (or another cost-side move) closed quietly. If pricing stays flat, Anthropic is betting the brand and quality story hold up at premium prices.

The [trillion-dollar AI race](/startups/ai-trillion-dollar-race-may-2026) and [$67 billion infrastructure bets like NextEra-Dominion](/government/nextera-dominion-67-billion-ai-power-merger-2026) tell you that the supply side of AI is scaling fast. Google I/O 2026 is the signal that the pricing side is finally starting to scale down. For everyone building on top of AI, the next 12 months get cheaper. For the model providers competing for that demand, the next 12 months get harder.

Google just fired the first real shot of the AI price war. The shots back are coming fast.
