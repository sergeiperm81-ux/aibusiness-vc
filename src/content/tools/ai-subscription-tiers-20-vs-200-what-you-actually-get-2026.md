---
title: "$20, $100 or $200? What AI Subscriptions Actually Buy in 2026"
description: "Verified September 2026 prices for ChatGPT, Claude, Cursor, Grok and Z.ai, plus the session and weekly limits that make direct comparisons misleading."
date: "2026-09-02"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/payment-card-1.jpg"
keywords: ["AI subscription limits 2026", "Claude Max vs Pro", "ChatGPT Plus vs Pro limits", "Cursor Ultra pricing", "AI plan comparison 2026", "which AI subscription to buy"]
---

# $20, $100 or $200? What AI Subscriptions Actually Buy in 2026

Many leading AI products now present the same broad choice: an accessible plan around $20 and one or more power-user plans between $100 and $300. The obvious question is whether the expensive plan is worth five or ten times the price. That question is harder than it looks because the providers do not sell or disclose capacity in a common unit.

Claude describes capacity per session and also enforces weekly limits. Cursor guarantees a dollar-equivalent amount of model usage. Z.ai publishes prompt allowances for five-hour and weekly periods. OpenAI combines plan allowances, model-dependent consumption and optional credits, while xAI describes relative access without publishing fixed caps for every Grok feature. Comparing the sticker prices alone is therefore like comparing phone contracts without knowing whether the number refers to minutes, data or network speed.

I checked the current plan pages and support documentation. Here is what can be verified as of September 2, 2026, what remains undisclosed, and how to choose without pretending the plans are directly equivalent.

## The verified price board

These are monthly US list prices. Taxes, local pricing, annual discounts and account-specific offers can change the amount shown at checkout.

| Provider | Entry | Mid | Top |
|---|---|---|---|
| **ChatGPT** | Go **$8 in the US** · Plus **$20** | Pro 5x **$100** | Pro 20x **$200** |
| **Claude** | Pro **$20** | Max 5x **$100** | Max 20x **$200** |
| **Cursor** | Hobby **$0** · Pro **$20** | Pro Plus **$60** | Ultra **$200** |
| **Grok** | SuperGrok **$30** | SuperGrok Plus **$100** | SuperGrok Heavy **$300 list price** |
| **Z.ai GLM Coding** | Lite **$18** | Pro **$72** | Max **$160** |

There are two qualifications worth making before any comparison. ChatGPT Go's $8 figure is the US price; OpenAI localises it in some markets. Z.ai's 30% figure is an annual-billing discount, not a temporary introductory discount: its advertised annual equivalents are $12.60, $50.40 and $112 per month. Grok has a genuine $100 middle tier, so the choice is no longer simply $30 or $300. The current official checkout shows Heavy at $300 per month; any account-specific offer should be treated as temporary unless its renewal price says otherwise.

## The units are not compatible

The price board looks comparable. The underlying allowances are not.

| Provider | What the plan actually meters | What makes capacity vary |
|---|---|---|
| **ChatGPT Work and Codex** | Plus currently has a rolling **5-hour** allowance and a **weekly** allowance; Pro 5x and Pro 20x currently retain the weekly allowance without the five-hour cap | Model, context, task length, reasoning and tool use all affect consumption |
| **Claude and Claude Code** | A shared **per-session** allowance plus **weekly** limits | Model choice, conversation length, files, tool calls and parallel sessions |
| **Cursor** | Guaranteed API-priced agent usage of **$20 / $70 / $400**, plus variable bonus usage | The provider price of the selected model and whether the work uses metered agent models |
| **Z.ai GLM Coding** | Published prompt quotas per **5 hours** and per **week** | Higher-end models can consume quota at a multiple of the standard rate |
| **Grok** | xAI publishes relative tiers such as "higher" and "highest" usage, but not one stable public cap covering every feature | Chat, Build, image, video and voice limits can differ and change |

Cursor offers the clearest guaranteed floor, but even it is not an exact promise of total capacity. Pro includes $20 of API-priced agent usage, Pro Plus $70 and Ultra $400, while Cursor says it may provide additional bonus usage. A cheaper model stretches the guaranteed amount further; a flagship model consumes it faster. That is why [cost per completed task](/tools/claude-sonnet-5-cheaper-than-opus-real-cost-2026) matters more than the subscription label.

Z.ai is narrower than the other products in this table. The GLM Coding Plan is restricted to supported coding tools such as Claude Code, Cline and OpenCode; it is not a general-purpose chat subscription. Its current documentation publishes approximate limits of 80, 400 and 1,600 prompts per five hours for Lite, Pro and Max, with weekly estimates of 400, 2,000 and 8,000. Those are estimates, not guaranteed completed coding tasks, because one prompt can invoke the model multiple times.

## Claude's 5x and 20x labels do not describe the weekly increase

This distinction applies directly to Claude. Anthropic's current plan table describes Max 5x and Max 20x as five and twenty times Pro capacity **per session**. Weekly limits also exist, but Anthropic does not promise that they scale by the same multiplier.

The complaint discussed below reproduces Anthropic guidance estimating the following weekly Claude Code capacity for Opus 4:

| Plan | Price | Estimated Opus 4 usage per week | Indicative subscription cost per Opus hour* |
|---|---|---|---|
| **Max 5x** | $100/mo | **15-35 hours** | **$0.66-$1.54** |
| **Max 20x** | $200/mo | **24-40 hours** | **$1.15-$1.92** |

*The cost range divides the monthly subscription by 4.33 weeks and by the endpoints of Anthropic's estimated hours. It is not an API price or a guaranteed effective rate.*

The endpoints tell a more careful story than "20x" suggests. Moving from Max 5x to Max 20x doubles the monthly price, while the lower weekly estimate rises from 15 to 24 hours and the upper estimate rises from 35 to 40. That does not prove what any one user will receive, because workload and context differ. It does show why a per-session multiplier should not be read as a weekly throughput guarantee.

These are Opus 4 estimates specifically. Anthropic has published much larger hour ranges for Sonnet, so presenting the table as generic "Claude hours" would be misleading.

## The lawsuit that makes the distinction concrete

On June 14, 2026, Karl Kahn, a Washington, DC resident, filed a federal complaint against Anthropic in the US District Court for the Northern District of California. The case is **Kahn v. Anthropic PBC, No. 3:26-cv-05763**. It alleges that Max 5x and Max 20x deliver substantially less usage than subscribers reasonably understand from the labels and that the effective caps are difficult to determine before purchase.

Kahn says he upgraded to Max 20x in April 2026, reached the weekly ceiling quickly and saw one five-hour session consume about 15% of his weekly allowance. The filing seeks class-action status for US consumers who bought or upgraded to a Max plan from April 9, 2025, and includes claims under California's Consumers Legal Remedies Act and False Advertising Law.

These are allegations, not judicial findings. Anthropic is entitled to contest them, and the existence of a complaint does not establish deception. What the case does establish is that the difference between a session multiplier and weekly capacity is material enough to be litigated. Buyers should therefore measure the limit they actually hit instead of treating the tier name as a unit of output.

## OpenAI follows a different limit structure

The Claude analysis should not be copied across to OpenAI. OpenAI's current help page describes the $100 Pro tier as 5x higher usage than Plus and the $200 tier as 20x, but it does not publish a stable message or token entitlement that lets an outsider calculate completed tasks.

There was also a recent change. After several weeks with only a weekly cap, OpenAI restored a five-hour limit for **Plus** users of Codex and ChatGPT Work on August 25, 2026. At the time of the announcement, OpenAI said the five-hour limit would remain disabled for Pro 5x and Pro 20x for the coming months. The practical result is that a Plus user can currently be stopped by either window, while a Pro user may encounter the weekly allowance without that shorter cap. This is a temporary product policy, not a permanent feature of either plan.

OpenAI currently offers two separate ways to continue beyond included use, where available:

- **Usage credits** pay for supported agentic features after the included allowance is exhausted.
- **An instant paid reset** restores the relevant Work and Codex allowance immediately and starts a new weekly period with the next request. It cannot be saved for later.

A banked reset is different: it may be earned through an eligible referral or promotion and saved for later use. Conflating a purchased instant reset with a banked promotional reset would give buyers the wrong expectation.

## Where the vendors still leave uncertainty

There is no stable, official conversion from a ChatGPT plan to a fixed number of Codex tasks. OpenAI explicitly says usage depends on model, context, reasoning, tools and task complexity, and directs customers to the live usage dashboard. Third-party message-count tables can be useful observations, but they should not be presented as plan entitlements.

Claude is more explicit about the meaning of its plan names: Max capacity is stated per session. Even there, message and hour figures are estimates rather than absolute token grants. Cursor discloses a guaranteed dollar-equivalent floor but keeps bonus usage variable. Z.ai publishes prompt estimates, while xAI's public comparison uses relative phrases rather than fixed cross-feature caps.

That uncertainty is part of the purchasing decision. A plan can be accurately priced and still resist a clean value comparison because the unit of useful output is a completed task, not a message, prompt or model call.

## How to choose without guessing

Start on the cheapest plausible plan and observe it for two representative weeks. Record which restriction actually interrupts paid work.

| What stops the work | What to evaluate next | What not to assume |
|---|---|---|
| A **short session window** | A tier that explicitly raises or removes that window | That every provider's premium tier changes the same limit |
| A **weekly allowance** | The documented increase, pay-as-you-go credits, API use or a second provider | That a larger session multiplier guarantees the same weekly multiplier |
| One costly model | Routing routine work to a cheaper model | That a more expensive subscription fixes inefficient routing |
| A coding-only workload | A focused coding plan such as GLM Coding | That a narrow plan replaces a general chat product |

A second provider can be a sensible fallback when weekly limits or outages stop client work, but it is not automatically better value. For example, OpenAI markets its $100 and $200 tiers as 5x and 20x Plus usage respectively, so two $100 subscriptions would not reproduce the stated allowance of one $200 account. The correct comparison is the capacity shown for the specific accounts and workloads, plus the operational value of having a fallback.

## What this means for different buyers

**If you are an occasional user**, begin with Go, Plus or another entry plan and upgrade only after a real limit interrupts useful work. ChatGPT Go is $8 in the US, while Z.ai Lite is $18 monthly or $12.60 per month when billed annually, but the latter is a coding-only product. Cheap does not mean interchangeable.

**If you code all day**, track the five-hour and weekly meters separately, along with the model used and whether the task finished. If a short window is the constraint, a plan that raises that window may help. If weekly capacity is the constraint, compare the actual next-tier allowance with credits, API pricing and a fallback provider. The same [per-task cost discipline](/solo/claude-api-cost-side-business) that applies to API calls also applies to subscriptions.

**If you are buying for a team**, do not multiply consumer-plan prices and call that a procurement comparison. Business plans can add data controls, administration, support and different usage rules, while consumer accounts generally cannot be shared. Run a pilot with representative heavy and light users, then compare annual cost per completed workflow rather than cost per advertised multiplier.

The safest rule is simple: start one tier below where you think you belong, measure interruptions for two weeks, and upgrade only when you can name the limit and the work it prevents. Upgrade, downgrade and refund terms differ by provider, so verify those terms before committing to annual billing.

## The honest take

The hard part is not finding the monthly price. It is discovering what the provider counts, which limit applies to your account and how that limit maps to finished work. Session multipliers, weekly pools, prompt estimates and dollar-equivalent usage budgets are different products even when the checkout price is identical.

Treat an AI subscription as a measured operating expense. Record the tasks completed, the model used, the limit encountered and the cost of the interruption. After two weeks, the right upgrade is usually obvious. Without that record, a buyer is comparing marketing labels rather than capacity.

*Prices and plan mechanics checked September 2, 2026. They can change by country, account and promotion. The Kahn complaint contains allegations, not findings.*

Sources: [OpenAI: ChatGPT Go](https://openai.com/index/introducing-chatgpt-go/); [OpenAI: ChatGPT Pro tiers](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers); [OpenAI: Codex usage and resets](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan); [OpenAI: paid Work and Codex resets](https://help.openai.com/en/articles/20001507-paid-weekly-work-and-codex-rate-limit-resets); [Anthropic: plan comparison](https://support.claude.com/en/articles/11049762-choose-a-claude-plan); [Anthropic: Claude Code plans and limits](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan); [Cursor: models and pricing](https://docs.cursor.com/account/pricing); [xAI: Grok pricing](https://x.ai/pricing); [xAI: SuperGrok checkout](https://grok.com/supergrok?referrer=grok-build); [Z.ai: GLM Coding Plan](https://z.ai/subscribe); [Z.ai: usage documentation](https://docs.z.ai/devpack/overview); [Kahn v. Anthropic complaint](https://storage.courtlistener.com/recap/gov.uscourts.cand.472161/gov.uscourts.cand.472161.1.0.pdf); [9to5Mac: OpenAI restores the five-hour Plus limit](https://9to5mac.com/2026/08/24/openai-restores-5-hour-codex-and-work-limits-for-chatgpt-plus-users/).
