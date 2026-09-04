---
title: "Claude Fable 5.1 and Claude Mythos 5.1: Same $10/$50 Price, 75% Cheaper to Run"
description: "Claude Fable 5.1 shipped on September 1 at exactly the same $10/$50 per million tokens as Fable 5. The saving is hidden in one line of the price list: cache reads fell from $1.00 to $0.25. Here is the arithmetic, and who gets nothing from it."
date: "2026-09-01"
author: "Sergei Ponomarev"
category: "Tools"
image: "/images/articles/coding-dark-1.jpg"
keywords: ["Claude Fable 5.1", "Claude Mythos 5.1", "Claude Fable 5.1 pricing", "Claude Fable 5.1 vs Fable 5", "Claude Fable 5.1 release date", "Claude Fable 5.1 cache read price", "Anthropic September 2026 model", "Claude Fable 5.1 review", "Claude API pricing 2026", "prompt caching cost"]
---

# Claude Fable 5.1 and Claude Mythos 5.1: Same $10/$50 Price, 75% Cheaper to Run

**Claude Fable 5.1** is Anthropic's flagship model, released on 1 September 2026. It costs $10 per million input tokens and $50 per million output tokens, the same as Claude Fable 5, with a 1 million token context window and up to 128,000 tokens per answer. **Claude Mythos 5.1** is the same model without the production safeguards, released the same day at the same price, available only through restricted programmes for vetted cybersecurity and life sciences organisations. The one price that changed is the cache read, down from $1.00 to $0.25 per million tokens, which is what makes Fable 5.1 roughly 25% to 60% cheaper to run than Fable 5 depending on the job.

Anthropic released Claude Fable 5.1 and Claude Mythos 5.1 today, September 1. If you go looking for the usual launch story, the one with a benchmark chart where the new bar is taller than the old bar, you will be disappointed. Anthropic did not publish one.

What it published instead is a price list where the two numbers everybody quotes did not move at all, and one number nobody quotes fell by three quarters. For anyone running Claude in production, that third number is the entire story, and it is worth more than any benchmark would have been.

## The headline price did not change

Fable 5.1 costs $10 per million input tokens and $50 per million output tokens. That is exactly what [Fable 5 cost when it launched in June](/tools/claude-fable-5-mythos-5-launch-2026), when it posted 80.3% on SWE-bench Pro, ran a two-month code migration for Stripe in a single day, and sped up parts of drug design by a factor of ten.

So on the surface, nothing happened. Same model family, same sticker, one decimal place added to the name.

Now look at the line underneath. Reading from the prompt cache used to cost $1.00 per million tokens. On Fable 5.1 it costs $0.25. Writing to the cache stayed where it was, at $12.50 per million for the five minute cache and $20.00 for the one hour version.

That is a 75% cut on the one thing a long running AI job does over and over again.

## Why cache reads are where the money actually is

If you use Claude through a chat window, this changes nothing for you and you can stop reading. This matters for the case where a model is holding a large body of material and coming back to it repeatedly: an agent working through a codebase, a research run over a long document, a support system that carries the same product manual into every conversation.

In that pattern, the same tokens get sent again and again. Prompt caching exists so you do not pay full input price every time. You pay a premium once to write the context into the cache, then a much lower rate each time the model reads it back.

The write is expensive, $12.50 per million, more than the $10 base input price. The read is what you do fifty times. Cut the read price by 75% and you have cut the bill on exactly the shape of work that costs the most.

The comparison that makes this concrete: a cache read on Fable 5.1 now costs only about a quarter more than a cache read on Sonnet 5, even though Fable's base input price is five times higher. The gap between the flagship and the mid tier, for the repeated part of the work, has almost closed.

## The arithmetic, on a real shape of job

Take a coding agent working on a repository. It loads 200,000 tokens of context, then works through fifty turns, re-reading that context each time. All figures below are calculated from the published prices.

With no caching at all, you send 200,000 tokens fifty times. That is 10 million input tokens at $10 per million: **$100**.

With caching on Fable 5, you write once and read forty nine times. The write is 0.2 million tokens at $12.50, so $2.50. The reads are 9.8 million tokens at $1.00, so $9.80. Total: **$12.30**.

With caching on Fable 5.1, the write is unchanged at $2.50, and the reads are 9.8 million at $0.25, so $2.45. Total: **$4.95**.

The same job, on the same model family, at the same headline price, went from $12.30 to $4.95. That is 60% off the run.

Now change the shape and watch the benefit shrink. Take a 500,000 token document that you ask twenty questions about. On Fable 5: write $6.25, reads of 9.5 million tokens at $1.00, giving $15.75. On Fable 5.1: the same $6.25 write, reads at $0.25 giving $2.38, total $8.63. Still a 45% saving, but the expensive write now dominates the bill and caps how much the discount can do for you.

That is the rule worth carrying away: the discount rewards re-reading. The more times a single cached context gets read, the closer your saving gets to the full 75%. Read it twice and the write cost swamps everything and you barely notice.

Anthropic's own framing matches the arithmetic. It says Fable 5.1 runs about 25% cheaper than Fable 5 for typical workloads, and around 45% cheaper for complex agent tasks. Those are two points on the same curve, and the curve is set by how often you re-read.

## Who gets nothing from this

Here is the part that will not appear in the launch coverage. If you are not using prompt caching, your bill on Fable 5.1 is identical to your bill on Fable 5, to the cent. Not slightly better. Identical.

Plenty of teams are in exactly that position. Caching takes deliberate work: you have to structure the prompt so the stable part sits at the front and stays byte for byte the same, you have to mark the cache breakpoints, and you have to keep the session inside the cache lifetime or pay to write it again. Teams that wired up an integration quickly and moved on to shipping features have usually skipped all of that.

For those teams, the honest reading of today's news is not "the model got cheaper". It is "a 60% discount is now sitting on the table, and collecting it is an engineering task of a day or two". That is a rate of return most infrastructure work never comes close to.

There is a second trap in the same neighbourhood. The five minute cache and the one hour cache cost different money to write, $12.50 against $20.00. A long agent session that keeps letting the five minute cache lapse and re-writing it will quietly pay the write premium over and over and wonder why the savings never showed up. If your sessions run long, the more expensive cache is usually the cheaper choice, which is the sort of sentence that only makes sense once you have seen the invoice.

## What actually got better in the model

Anthropic describes Fable 5.1 as setting a new standard on coding, knowledge work and long running problem solving, and says it reaches similar or better results than Fable 5 at much lower cost when running at low or medium effort settings. Read that carefully, because it is a cost claim as much as a capability claim: the same answer, reached with less spent thinking.

The example the company leads with is diagnostic rather than benchmark shaped. Fable 5.1 found the cause of a rare crash in a customer's internal systems that none of their engineers, and no other model, had been able to explain. That is a good story and an unverifiable one, which is how most launch anecdotes work, and worth treating as such until someone reproduces it.

What is not on offer is a published benchmark table comparing 5.1 with 5. Independent write ups so far characterise the release as an iteration on the same architecture, a reliability and instruction following pass built on production feedback rather than a generational jump. On our own [model leaderboard](/models) both new models are listed without an ELO for the same reason we apply to every new arrival: public arena scores do not exist yet, and a number we cannot source is worse than no number at all.

## Mythos 5.1, and why it is not for you

Alongside Fable 5.1, Anthropic shipped Claude Mythos 5.1 at the same $10 and $50 pricing. It is the same underlying model without the production safeguards, and it is not generally available. Access runs through restricted programmes for vetted organisations in cybersecurity and life sciences, the two fields where the safeguards that protect everyone else get in the way of legitimate work.

For a normal business the practical consequence is simple: you will be using Fable 5.1, the pricing is identical, and Mythos existing changes nothing about your options. It matters for one reason only, which is that it tells you where the frontier of restricted capability now sits, and that is a useful thing for anyone writing an AI policy to know.


## Claude Fable 5.1: common questions

**When was Claude Fable 5.1 released?**
1 September 2026, alongside Claude Mythos 5.1. It is generally available through Anthropic's API and on AWS, Google Cloud and Microsoft Azure.

**How much does Claude Fable 5.1 cost?**
$10 per million input tokens and $50 per million output tokens, unchanged from Fable 5. Cache reads cost $0.25 per million, down from $1.00. Cache writes cost $12.50 per million for the five minute cache and $20.00 for the one hour cache.

**Is Claude Fable 5.1 cheaper than Fable 5?**
Only if you use prompt caching. Without caching the two cost exactly the same. With caching, Anthropic reports about 25% lower cost on typical workloads and around 45% on complex agent tasks; on a heavily re-read context the saving on our own arithmetic reaches 60%.

**What is the context window of Claude Fable 5.1?**
1 million tokens, with up to 128,000 tokens in a single response.

**What is the difference between Claude Fable 5.1 and Claude Mythos 5.1?**
The same underlying model at the same price. Fable 5.1 is generally available with production safeguards. Mythos 5.1 runs without those safeguards and is released only through restricted access programmes for vetted cybersecurity and life sciences organisations.

**Is Claude Fable 5.1 better than Fable 5 at coding?**
Anthropic says it sets a new standard on coding and long running problem solving, and that it matches or beats Fable 5 at lower effort settings. It has not published a benchmark table comparing the two, and no public arena ELO exists yet, so treat the capability claim as the company's own until independent scores appear.

## What to do this week

If you already cache, you have nothing to do. The new rate applies and your next invoice will be smaller than your last one for the same work.

If you do not cache, price the change before you decide. Take your largest recurring job, count how many times the same context gets sent, and run it through the arithmetic above with your own numbers. If that context is large and gets re-read more than a handful of times per session, the discount is worth real money and the work to collect it is small.

And if you are choosing a model right now, the decision has genuinely moved. The argument for dropping to a cheaper tier was always that the flagship cost too much to run in a loop. On the repeated portion of the work, that gap has narrowed to almost nothing. The premium you pay for the best model is now concentrated where it always should have been: in the new thinking, not in reading the same file for the fiftieth time.
