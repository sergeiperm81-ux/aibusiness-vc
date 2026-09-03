---
title: "GPT-6 Astra: What OpenAI Actually Shipped, What It Costs, and What Is Still a Claim"
description: "OpenAI began the staged rollout of GPT-6 Astra on September 3, 2026 — a model built to operate software rather than advise about it. Documented pricing is $10/$50 per million tokens with a 1.05M context window. What is confirmed by the official docs, what rests on reporting, and what the 'AGI' line does not mean."
date: "2026-09-03"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/multiple-screens-1.jpg"
keywords: ["GPT-6 Astra", "GPT-6 Astra pricing", "OpenAI computer use model", "Astra vs GPT-5.6 Sol", "GPT-6 Astra API cost", "OpenAI AGI claim"]
---

# GPT-6 Astra: What OpenAI Actually Shipped, What It Costs, and What Is Still a Claim

OpenAI began the staged rollout of **GPT-6 Astra** on September 3, 2026, initially for enterprises in its **Trusted Access Program**. Wider access through the API and the ChatGPT Plus, Pro, Business and Enterprise plans was announced for the following days. The company describes it as its most capable and most intent-aligned model, and OpenAI president **Greg Brockman** called it a "generational leap," closing the launch briefing with the line "Welcome to the AGI era."

That framing is doing a lot of work, so this piece separates three different things: what the product actually does, what the numbers are and who measured them, and what remains an opinion. The commercially important change is narrower and more concrete than the AGI headline — Astra is built to **operate software**, not to advise you about it. That distinction, plus the price attached to it, is what should shape your decision.

## What was announced

Astra's headline capability is computer and browser control. Per OpenAI, it can fill in forms, update records in a CRM, manage a calendar, research information, draft emails and documents, analyse data and check that websites work. It is designed for **long multi-step workflows** rather than single answers: producing a document, spreadsheet or presentation from an existing template, and inside ChatGPT, building and publishing sites, web applications and games.

In Codex, two changes matter to anyone doing real work. Astra holds context better across a long session, and it can **ask a clarifying question without halting the rest of the task** — which addresses one of the most irritating failure modes of agentic coding, where the whole run stops waiting for you.

The rollout is deliberately staged. Per OpenAI's model documentation, access begins with enterprises in the **Trusted Access Program**, with the API and the **Plus, Pro, Business and Enterprise** plans following afterwards; reporting adds AWS as a distribution channel. A free tier is not part of the announcement.

One clarification worth making, because the two are easy to conflate: the **Trusted Access Program** is the named first cohort for the general model. **Daybreak Blue** — described in reporting as a restricted channel for advanced cyber capabilities — is a separate, controlled track, not another name for the initial rollout group.

The published specifications are unusually generous in one respect. The documented context window is **1,050,000 tokens** (922,000 maximum input, 128,000 maximum output), and the model exposes reasoning effort levels from `low` through `medium`, `high`, `xhigh` to `max` — meaning you can dial compute up or down per call, which is directly a cost control.

## The performance numbers, and one thing worth correcting

Two figures are circulating, and it is worth being precise, because they are frequently presented as separate achievements when they are the same measurement.

| Reported figure | What it actually refers to |
|---|---|
| "~47% faster" on computer-use tasks | Average time per task falling from **about 75 minutes to about 40** |
| "1.9x faster" on a benchmark | The same 75→40 minute result, expressed as a multiple |

Run the arithmetic: 75 minutes down to 40 is a 46.7% reduction in time, and 75 divided by 40 is 1.875. **They are one result described two ways**, measured on the Mind2Web benchmark against the current Sol-based setup, and the improvement is attributed to Astra *together with an updated Codex harness* rather than to the model alone.

That is not a criticism of the result — cutting a 75-minute task to 40 minutes is substantial. It is a caution about attribution: these figures come from the reported benchmark results rather than from a primary source I could verify directly, and no independent replication has been published. Treat the number as a credible indication of direction, not as a settled measurement.

## The price, which is the part most coverage skipped

Astra is the most expensive mainstream model on the board. Per OpenAI's model documentation, API pricing is **$10 per million input tokens, $50 per million output tokens and $1 per million cached input tokens**, with Fast mode charged at double the applicable rates. Put against the current field:

| Model | Input ($/M) | Cached input ($/M) | Output ($/M) |
|---|---|---|---|
| **GPT-6 Astra** | **$10** | **$1** | **$50** |
| **GPT-6 Astra (Fast)** | **$20** | **$2** | **$100** |
| Claude Opus 4.8 | $5 | — | $25 |
| Claude Sonnet 5 (standard) | $3 | — | $15 |

That cached-input rate is the detail worth planning around: at **$1 versus $10**, re-reading the same context costs a tenth of sending it fresh. On long agentic runs that repeatedly reference the same codebase or document set, cache discipline is not a micro-optimisation — it is the difference between a viable unit cost and an unaffordable one.

Astra's output tokens cost **twice** Opus 4.8 and **more than three times** Sonnet 5. That arrives in a market that had been moving the other way all year, through [Gemini Flash price cuts](/tools/google-io-2026-gemini-35-flash-price-war), [near-free open models from China](/tools/glm-5-2-china-open-model-cant-be-banned-2026) and [Anthropic's own cache-price reductions](/tools/claude-fable-5-1-cache-price-cut-2026). Astra is a deliberate step in the opposite direction: a premium tier for work that could not be done at all before.

## Why the sticker price understates the real cost

There is a compounding effect here that anyone budgeting should account for. Agentic models — ones that plan, take many steps, call tools and retry — consume substantially more tokens per completed task than conversational ones. I documented this with [Sonnet 5, where a 40% lower per-token price still produced a higher per-task cost](/tools/claude-sonnet-5-cheaper-than-opus-real-cost-2026) because token consumption rose roughly 30%.

Astra is explicitly built for long multi-step workflows, so its token consumption per task should be expected to be high. A model priced at 2x Opus that also burns more tokens per job could land at several times the cost per task. The honest counterweight is that **the correct metric for agentic work is cost per completed task, not cost per token** — and a model that finishes in fewer attempts, or completes work that previously failed entirely, can be cheaper in total despite a higher rate. Which way Astra lands is an empirical question that your own workload will answer and a launch post cannot.

For subscription users the arithmetic is different again, since limits rather than token prices govern what you get — the structure I laid out in [what the $20, $100 and $200 plans actually buy](/tools/ai-subscription-tiers-20-vs-200-what-you-actually-get-2026).

## The cybersecurity designation is the most consequential detail

The item that deserves more attention than the AGI line: Astra is the **first OpenAI model classified as "Critical" for cybersecurity under the company's Preparedness Framework**. OpenAI states it can independently discover and exploit previously unknown security flaws in hardened systems.

This has concrete consequences rather than rhetorical ones:

- The rollout is **staged**, and reporting indicates a **White House review** preceded public access.
- Reporting describes capability being **split across two tracks**: general reasoning and software engineering going to public ChatGPT and API users, while advanced zero-day discovery and cyber-offence capabilities stay restricted to vetted security partners through the separate Daybreak Blue channel.
- Some actions require **additional user confirmation**, and the most dangerous scenarios are restricted outright.

Two things follow. First, government involvement in frontier-model releases is becoming more visible — the direction also visible when [export controls pulled a model offline earlier this year](/government/us-government-shuts-down-claude-fable-5-export-control-2026). Second, the defensive side of this is not theoretical: I wrote in August about [AI agents that reached real companies' production systems using nothing more exotic than weak passwords](/b2b/ai-agents-hacking-companies-non-human-identity-security-boom-2026). A model explicitly rated Critical for offensive capability raises the floor on what every organisation needs to have in place.

## How it was built

Two disclosed details are worth recording because they say something about where model development has gone.

Astra was trained using OpenAI's **Stargate infrastructure in Texas, whose disclosed scale exceeds 100,000 GPUs**. It is worth being precise here rather than repeating the shorthand: the size of that facility is documented, but I could not find a primary source confirming that this specific training run used all of it. What the site does illustrate is the capital intensity behind the model — the same physical build-out driving [Nvidia's revenue](/startups/nvidia-q1-fy27-earnings-78-billion-test-2026) and [OpenAI's $38 billion annual loss](/vc/openai-852-billion-valuation-1-trillion-ipo-what-it-means-2026).

More interesting technically: according to reporting cited below, this is the first OpenAI model where **other models played a significant role in supervising training**. If accurate, AI systems are now meaningfully involved in producing the next generation of AI systems — a genuine milestone, and also the sort of claim that deserves scrutiny rather than applause, since it makes the training process harder for outsiders to audit. It does not appear in the public model documentation.

## About the AGI claim

Brockman said he personally believes OpenAI has reached AGI, and invited users to decide for themselves whether Astra qualifies. It is worth being exact about what that is: **the stated opinion of a company executive on the day he launched the product**, not a scientific finding, a consensus position, or a measurement against any agreed definition. There is no accepted test for AGI, which is precisely why the question can be handed to the audience.

None of that makes the capability jump fake. A model that reliably drives software across long workflows is a real change in what can be automated, and that matters commercially whatever you call it. But the appropriate response to "we may have achieved AGI" from the vendor's president is to look at the benchmark methodology, the price, and the deployment restrictions — all three of which are more informative than the label.

## How to evaluate it in the first week

Launch benchmarks answer a question no buyer actually has. Yours is narrower: does this model do *my* work, at an acceptable cost, reliably enough to be trusted with access? A week of structured testing settles it, and the discipline matters more with an agentic model than a conversational one, because failures are expensive in a way that a bad chat answer never was.

| What to measure | Why it decides the purchase |
|---|---|
| **Cost per completed task** | The only number that matters at $50/M output. A model that costs 2x but needs half the attempts is cheaper |
| **Completion rate without intervention** | An agent that needs rescuing on one run in three is not automation, it is supervision with extra steps |
| **Token consumption per task** | Agentic models burn far more than chat; this is where budgets break silently |
| **Failure mode** | Does it stop and ask, or proceed confidently down the wrong path? The second is the dangerous one |
| **Blast radius** | What could a wrong action actually damage — a draft, or a production record? |

Two practical notes. Run the comparison on **the same tasks across Astra, Opus 4.8 and Sonnet 5**, not on Astra alone, because "it worked" tells you nothing about whether a model at a third of the price would also have worked. And test the failure cases deliberately: give it an ambiguous instruction and an under-specified goal, and watch what it does. For a model whose selling point is operating your software unattended, how it behaves when it is *wrong* is more commercially relevant than how it behaves when it is right.

The routing conclusion will probably resemble the one that already applies across the Claude family and its rivals in [the head-to-head comparison](/tools/chatgpt-vs-claude-vs-gemini): a premium model reserved for the long, hard, multi-step jobs, with cheaper models handling everything routine. Defaulting everything to the newest and most expensive model is the single most common way to turn a capability gain into a cost problem.

## What this means for you

**If you build with the API**, do not migrate on the announcement. Run your own tasks and measure **cost per completed task** against Sonnet 5, Opus 4.8 and Astra, because at $50 per million output tokens the wrong default routing gets expensive quickly. Astra earns its price on genuinely agentic, long-horizon work; for everything else the cheaper models remain the correct choice.

**If you run a business**, the practical shift is that AI moving from advice to **operating your software** changes which jobs can be automated — form-filling, CRM updates, scheduling, routine document production. That is closer to real back-office work than anything previously on offer, and it is the same trajectory behind [agents that transact on their own](/b2b/agentic-commerce-ai-agents-buy-for-you-who-gets-paid-2026). Before granting an agent access to production systems, decide what it may touch and what requires confirmation.

**If you are responsible for security**, the Critical designation is the actionable item in this launch. Capable offensive tooling becoming broadly available raises the baseline: credential hygiene, least privilege for machine identities, and monitoring of what your own agents do.

**If you are a ChatGPT subscriber**, expect access over the coming days on Plus, Pro, Business and Enterprise. Free-tier availability was not announced.

## The honest take

Two separate things were released on September 3: a product and a narrative. The product is a model that operates software across multi-step workflows, priced at a clear premium, deliberately restricted on its most dangerous capabilities, and validated so far only by its maker's own benchmarks. The narrative is that this may be the arrival of AGI. The first is verifiable and worth planning around; the second is a claim made by an interested party with no agreed test to settle it.

The pattern worth carrying is the same one that applies to every launch covered here: **the capability claim arrives on day one, the independent measurement arrives weeks later, and the invoice arrives at the end of the month.** Astra looks like a genuine step forward in getting AI to do work rather than describe it. Whether it is worth $50 per million output tokens in your specific workflow is not a question OpenAI can answer for you, and it is the only question that will show up in your accounts.

*Pricing, context window and access terms are taken from OpenAI's model documentation. Benchmark figures, training details and the White House review rest on the reporting linked below and are not independently verified. Terms stated at launch on September 3, 2026 may change.*

Primary source (pricing, context window, access and capabilities): [OpenAI — GPT-6 Astra model documentation](https://developers.openai.com/api/docs/models/gpt-6-astra).

Reporting (Brockman's remarks, training infrastructure, benchmark figures, White House review, Daybreak Blue): [Axios](https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman); [Fortune](https://fortune.com/2026/09/03/openai-debuts-gpt-6-astra-computer-use-greg-brockman-says-start-of-agi/); [The New Stack](https://thenewstack.io/openai-gpt6-astra-benchmarks/).
