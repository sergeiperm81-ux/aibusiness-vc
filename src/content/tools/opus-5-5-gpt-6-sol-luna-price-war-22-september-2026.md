---
title: "In One Day, Frontier AI Got Half Price: Claude Opus 5.5 and GPT-6 Sol and Luna, and What It Does to Your Bill"
description: "On 22 September Anthropic cut Opus to $4/$20 and OpenAI launched GPT-6 Sol at $2/$10 and Luna at $0.10/$0.50, calling the cuts permanent. Both labs now say their cheaper models beat the flagship on cost per finished task. Here's the new price map and the catch in the fine print."
date: "2026-09-23"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/tech-abstract-1.jpg"
keywords: ["Claude Opus 5.5 price", "GPT-6 Sol price", "GPT-6 Luna", "AI API price cut September 2026", "Opus 5.5 vs GPT-6", "AI cost per task"]
---

# In One Day, Frontier AI Got Half Price: Claude Opus 5.5 and GPT-6 Sol and Luna, and What It Does to Your Bill

On **22 September** the two leading AI labs cut their prices within hours of each other. Anthropic released **Claude Opus 5.5** and dropped its flagship from $5/$25 to **$4/$20** per million tokens, with cache reads down 60%. OpenAI released **GPT-6 Sol** at **$2/$10** and **GPT-6 Luna** at **$0.10/$0.50**, roughly half what their predecessors cost, and said plainly that these are permanent prices rather than an introductory promotion.

If you run anything on an AI API, your cost base changed on Tuesday. But the headline discount is not the interesting part. The interesting part is what both labs said about their own flagships: on real multi-step work, the cheaper model now finishes more tasks per dollar than the expensive one. The flagship has stopped being the thing you should default to, and both companies published the numbers that prove it.

Here is the new price map, the two claims worth checking, and the fine print that can quietly hand you a bigger bill instead of a smaller one.

## What the prices actually are now

| Model | Input | Output | Change |
|---|---|---|---|
| **Claude Opus 5.5** | **$4** | **$20** | down 20% from Opus 5 |
| Claude Opus 5.5, cache read | **$0.20** | | down 60% from $0.50 |
| Claude Fable 5.1 | $10 | $50 | unchanged |
| Claude Sonnet 5 | $2 | $10 | unchanged, permanent since August |
| **GPT-6 Sol** | **$2** | **$10** | down 50% from GPT-5.6 Sol's $4/$20 |
| **GPT-6 Luna** | **$0.10** | **$0.50** | down 50% and 58% from GPT-5.6 Luna |
| GPT-6 Astra | $10 | $50 | unchanged |

Two things jump out of that table. First, **GPT-6 Sol and Claude Sonnet 5 now cost exactly the same**, $2 and $10, which makes the mid-tier the most directly comparable it has ever been. Second, Anthropic's new flagship at $4/$20 costs less than OpenAI's previous mid-tier did a month ago. The whole board moved down a step.

Anthropic's Opus 5.5 keeps the 1M-token context and 128K output (300K behind a beta header), lists on the Claude API, Bedrock, Google Cloud and Microsoft Foundry, and carries a retirement date no earlier than 22 September 2027. OpenAI's pair ship as `gpt-6-sol` and `gpt-6-luna` through the API, ChatGPT Work and Codex, with Luna also reaching Free and Go users in the desktop app.

## The claim that matters: the flagship is not the best value

Both labs published the same uncomfortable finding about their own top models.

OpenAI's number is the sharper one. On AutomationBench, a 47-tool agent workflow benchmark, **GPT-6 Sol at xhigh effort completed 33.2% of tasks at $0.27 per task**, while **GPT-6 Astra, the $10/$50 flagship, completed 30.3% at 3.9 times the cost per task.** Read that twice. The cheaper model did slightly better work for roughly a quarter of the money. OpenAI also says Luna at higher effort matches the factual reliability of GPT-5.6 Sol at about one hundredth of its task cost.

Anthropic's version is quieter but points the same way. It says Opus 5.5 performs at the level of **Claude Fable 5.1 on most work while costing 40% of Fable's per-token price**, and that it runs about 40% cheaper than Opus 5 on typical workloads.

| The old assumption | What 22 September says |
|---|---|
| The flagship does the best work | The flagship does marginally better work per token |
| Pay more, get more | Pay more, often finish fewer tasks per dollar |
| Pick a model | Pick a model **and an effort level** |
| Price per token is the number | Cost per completed task is the number |

This is the same lesson I have been grinding away at since the [Sonnet 5 launch](/tools/claude-sonnet-5-cheaper-than-opus-real-cost-2026): the sticker price and the invoice are different numbers, and the gap is decided by how many tokens a model burns to finish your job. What changed this week is that the vendors are now making the argument themselves, with their own benchmarks, against their own most expensive products.

## The catch in Anthropic's 40%

Here is the fine print that most coverage skipped, and it can cost you real money.

Anthropic's "40% cheaper than Opus 5" compares **Opus 5.5 at its default medium effort against Opus 5 at its default high effort.** Default to default. The company also states that at the *same* effort setting, Opus 5.5 tends to think more per turn than Opus 5, particularly at the xhigh and max levels.

So the saving is conditional on accepting the new default. If your code pins effort to xhigh because that is what you tuned last quarter, you may be buying more thinking tokens per turn at a 20% lower per-token price, and the arithmetic can land above where you were. The price cut is real. The 40% is a configuration, not a guarantee.

The benchmark margins deserve the same caution. Opus 5.5 leads Terminal-Bench 4.0 at 66.4% against Astra's 57.9% and CursorBench at 57.8% against Fable 5.1's 51.8%, but it trails Astra on AutomationBench (40.0% versus 41.4%) and on Terminal-Bench Science (58.7% versus 64.6%). Anthropic itself notes the margins "sit close to the noise", with standard errors of roughly 2.6 to 5 points. These are vendor-published numbers on vendor-chosen tasks. They tell you the models are close. They do not tell you which one is better at your work.

## Migration is not free

Opus 5.5 ships with four breaking changes, and each one is engineering time you have to pay for before you see any saving.

| Breaking change | What happens |
|---|---|
| Thinking cannot be disabled | `thinking: {"type": "disabled"}` returns a 400 error |
| No forced tool use | `tool_choice` of "any" or a named tool returns 400; use `strict: true` |
| Thinking blocks bound to the conversation | Replaying them after the system prompt or tools change returns 400 |
| Computer use tool version | `computer_20251124` is rejected; migrate to `computer_toolset_20260801` |

There is also a quiet one worth knowing about: short model notes between tool calls now come back as thinking blocks, which are omitted from display by default. Nothing errors. Your logs just get less informative than they were.

Budget a developer day or two for this on any non-trivial integration, and weigh it against the saving. On a workload spending $200 a month, a 20% cut is $40 a month and the migration takes a year to pay back. On one spending $20,000 a month, it pays back before lunch. Cheaper models are only cheaper after the switching cost, which is the same reasoning behind [why model lock-in is a real financial risk](/tools/openai-cuts-off-cursor-spacex-model-lock-in-lesson-2026).

## Where the money actually moved: caching

The line item almost nobody puts in a headline is the one most likely to change your bill this month.

Opus 5.5 cut cache reads from $0.50 to **$0.20 per million**, a 60% reduction, against a $4 base input price. That means re-reading cached context now costs **one twentieth** of sending it fresh. OpenAI moved the same direction, with cached input reads discounted 90% and faster agent responses.

For anyone running agents, this matters more than the headline cut. An agent loop re-reads the same system prompt, the same tool definitions and the same document context on every single step. If that content is cached, the dominant cost line in your bill just fell by more than half, on top of the base price cut. If it is not cached, you are now paying twenty times more than you need to for every repeated token. Going and checking your caching setup is probably the highest-paid hour of work available to you this week, and the [API cost math for a one-person business](/solo/claude-api-cost-side-business) shows how quickly that compounds.

## What this means for you

**If you build products on these APIs**, re-run your routing this week rather than next quarter. Three prices moved, and the ranking of which model is cheapest for which job has changed with them. Start by testing whether GPT-6 Sol or Claude Sonnet 5, now identically priced at $2/$10, handles the work you currently send to a flagship; the vendors' own benchmarks suggest it often will. Then check your effort settings, because that is now as big a lever as the model choice. Measure cost per completed task, not price per token, on 20 to 50 of your real tasks.

**If you sell AI-powered services at a fixed price**, your margin just improved, quietly, without you doing anything. The question is what to do with it. You can bank it, you can spend it on higher effort settings and better output, or you can pass some of it on and win price-sensitive clients. What you should not do is leave it unmeasured, because [the cost pass-through dynamic](/b2b/ai-cost-pass-through-enterprise-software-2026) works both ways and clients who read the news will ask.

**If you are just choosing a subscription**, note that these are API prices and they do not change what Plus or Pro costs you. What they do change is what the labs can afford to include in the consumer tiers, and Luna reaching Free and Go users in the desktop app is the first sign of that. For the plan-level comparison, [the $20 versus $200 breakdown](/tools/ai-subscription-tiers-20-vs-200-what-you-actually-get-2026) still holds.

**If you watch the industry money**, this is the price war arriving at the top of the market. Until now the deep cuts were at the cheap end, from [China's open models going nearly free](/tools/glm-5-2-china-open-model-cant-be-banned-2026) to Gemini Flash. Frontier tiers held their prices and their margins. On 22 September both leaders cut the tier that funds everything else, on the same day, and OpenAI explicitly ruled out calling it a promotion. That tells you competition at the frontier is now fierce enough to eat into the margin of the business that has to [pay for $38 billion of annual losses](/vc/openai-852-billion-valuation-1-trillion-ipo-what-it-means-2026).

## What to watch

**Whether the cuts hold.** OpenAI called these permanent prices, not introductory ones, which is a stronger commitment than the promo on GPT-5.6 Sol that runs out on 21 November. Anthropic did the same thing with Sonnet 5 in August. Permanent pricing is becoming a competitive weapon in itself, because it lets buyers plan.

**Independent benchmarks.** Everything above comes from the labs. The Arena leaderboard and independent evaluators will take a few weeks to place Opus 5.5, GPT-6 Sol and Luna properly. Our [model leaderboard](/models) carries their prices now and will carry independent scores when there are enough votes to mean anything.

**The effort-level pricing game.** Both labs now ship models whose cost swings several-fold depending on an effort parameter. Expect that to become the main lever vendors pull, and expect pricing pages to get harder to read as a result.

**Whether Fable and Astra hold at $10/$50.** Both flagships now look expensive against their own siblings. If the top tier does not justify the four-to-five-times premium on real work, it will either get cut or get repositioned as a specialist tool.

## The honest take

The striking thing about Tuesday is not that prices fell. Prices in this industry always fall. It is that both labs chose to argue publicly that their own cheapest models are the better buy, with benchmark numbers showing the flagship losing on cost per finished task. That is not a marketing accident. It is what a market looks like when capability at the top has converged enough that nobody can charge a large premium for it any more, and when the real competition has moved to who can finish the job cheapest.

For anyone running a business on these tools, that is unambiguously good news, with one condition attached: the saving only reaches your bank account if you go and reconfigure something. A price cut you do not act on is a press release. A price cut plus an afternoon of re-routing, caching and effort tuning is a permanently lower cost base, and this week that is worth more than any new feature either lab shipped.

So the question worth answering before the end of the week: do you know what your AI costs per completed task, and is the model doing that work still the right one at Tuesday's prices?

Sources: [OpenAI: Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/); [VentureBeat on the GPT-6 Sol and Luna price cuts](https://venturebeat.com/technology/openai-releases-gpt-6-sol-and-luna-models-slashing-api-costs-50-or-more); [Claude Platform pricing](https://platform.claude.com/docs/en/about-claude/pricing); [Digital Applied: Claude Opus 5.5 pricing and benchmarks](https://www.digitalapplied.com/blog/claude-opus-5-5-launch-pricing-benchmarks-2026).
