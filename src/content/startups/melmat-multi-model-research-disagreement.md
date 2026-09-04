---
title: "MelMat Runs Four AI Models on the Same Question and Shows You Where They Disagree"
description: "Vanja Todorovic spent 25 years in financial services compliance before building a research platform on one principle: synthesise without hiding disagreement. A brief that comes back at 51% consensus is not a failure, it is the finding."
date: "2026-08-30"
author: ""
category: "Startups"
image: "/images/articles/melmat-brief.jpg"
keywords: ["MelMat", "multi-model AI research", "AI verification platform", "AI hallucination risk", "model disagreement", "AI for compliance", "research intelligence", "AI due diligence"]
partner:
  company: "MelMat"
  url: "https://melmat.ai"
  founder: "Vanja Todorovic"
---

*Partner Story · in conversation with MelMat. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the founder's own, presented as they were given to us. No payment was involved.*

Ask a capable AI model a serious question and you get a convincing answer. Ask a different capable model the same question and you may get a materially different one, delivered with exactly the same confidence.

For a casual query that hardly matters. For research, compliance, due diligence or anything where somebody signs their name at the bottom, the gap between those two answers is the most important thing on the page, and almost every AI product on the market is built to hide it.

<a href="https://melmat.ai" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">MelMat</a> is built to show it.

## Where the idea comes from

Vanja Todorovic spent more than 25 years in financial services, much of it in compliance and risk work, before building MelMat as a solo founder in Tampa, Florida.

That background is the whole product philosophy, and he says so plainly.

"In high-accountability environments, 'the system said so' is not enough. You need to know what supports the conclusion and where the risk is."

The principle he built on states itself in one line: synthesise without hiding disagreement.

"The goal is not to make uncertainty disappear. It is to make the evidence, contradictions and unresolved questions visible enough for a person to make a better decision."

## Three problems, one of which is the hard one

MelMat's own framing of the problem is worth repeating because it separates three things that usually get lumped together.

The first is single perspective. Every model carries different training data and different blind spots, so one answer is one opinion rather than the full picture.

The second is manual effort. Running the same question through several AI tools by hand costs 30 to 45 minutes per query, by the company's reckoning, and anyone who has done it recognises the tab-switching, the copying, the losing track of which window said what.

The third is the one that actually decides whether a multi-model approach is useful at all: synthesis. Even if you do the copying, you are still left holding four different answers and the job of reconciling them, which is the hardest part of the exercise and the part no amount of discipline makes faster.

Most tools in this space solve the second problem. MelMat is built around the third.

## How it works

MelMat supports eight engines: Claude, ChatGPT, Gemini, Mistral, MiniMax, Kimi, Grok and Perplexity. Four run on any given query, in parallel and independently, each answering the same question without seeing the others. Perplexity is always in the stack, supplying live web grounding, while the rest contribute analytical reasoning.

The user submits a question and picks a focus, from strategic to technical, market, clinical research and others. Then a synthesis pass turns those separate outputs into a structured brief rather than a single paragraph.

What that brief carries is the product. It marks where the models agree, flags where they contradict each other, shows the grounding and source material behind claims, lists what remains unresolved, keeps the individual model perspectives available rather than collapsing them into one voice, and ends with an action plan.

"We do not treat model consensus as proof of truth," Todorovic says. "Consensus is a signal."

That distinction is doing real work. A number saying four models agreed is not evidence that they are right; models trained on overlapping data can be confidently wrong together. What agreement tells you is where to stop looking, and disagreement tells you where to keep going.

For longer investigations there are M²W Workspaces: persistent, section-based research around a subject where facts and findings accumulate over time, where you can work against that accumulated context, compare subjects, and produce summaries and memos. The design intent, in his words, is "to preserve the evidence, contradictions, facts and research history around an investigation instead of treating every AI interaction as a disposable chat."

There is also a smaller feature that says something about who built this. While a brief is being assembled, the user can chat with the system rather than watch a spinner, and each brief allows follow-up questions that dig deeper into a specific finding. Somebody who has waited on a compliance report knew that the waiting is part of the experience.

## The 51% brief

Asked for the moment that best explains the product, Todorovic describes a research brief where the engines did not converge.

The system reported 51% consensus and partial grounding, exposing that important pieces of the research remained contested.

"That is not a failure state to me. It is useful information. My career taught me that uncertainty becomes dangerous when it is hidden. If several capable systems disagree, I want to know that before I make a decision, not after."

Any product manager will recognise how unnatural that is to ship. A dashboard that announces its own low confidence looks worse in a demo than one that returns a clean answer, and it is the more honest of the two. The company's own promotional material leads with a screenshot of exactly that: a brief on Florida mortgage denial rates showing 51% consensus, grounding marked partial, and a note that the engines diverged, with a tab where the contradictions are listed.

Showing your product at its least reassuring is a choice. It also happens to be the strongest available argument that the feature is real.

## Who it is built for

The audience list is specific rather than the usual "everyone": consultants in strategy and management, business owners and executives, marketing and growth teams, investors and analysts, legal and compliance teams, graduate researchers, and clinicians.

The common thread, and MelMat states it directly, is accountability. These are people who make recommendations that somebody else acts on, and who carry the consequences of being wrong. A consultant hands a client a market entry recommendation. A compliance team writes a policy response. An analyst validates an investment thesis. In each case the deliverable is somebody's professional judgement, and an unattributed AI paragraph inside it is a liability rather than a shortcut.

Which explains a design decision that would look strange in a consumer tool: the brief keeps each model's perspective visible instead of averaging them away. If you have to defend the conclusion later, you need to see what supported it.

## What it costs

Pricing is published in full, which is more than most of this category manages.

Starter is $49 a month for 50 queries on a fixed stack of Claude, ChatGPT, Gemini and Perplexity. Pro is $99 for 100 queries and six available engines, adding Mistral and MiniMax, with a selector so the user picks three plus Perplexity. Power is $179 for 200 queries and seven engines, adding Kimi. Researcher is $299 for 300 queries and all eight, with Grok exclusive to that tier. Annual billing gives two months free, and there is a seven-day trial with a card required.

Briefs arrive in the portal and by email, with PDF export from Pro upwards.

The arithmetic that justifies any of it is the company's own 30-to-45-minute figure for doing this by hand. At Pro, a hundred queries a month works out at a dollar each. For a consultant billing by the hour, the comparison was never against a chatbot subscription; it is against the afternoon spent copying prompts between tabs and reconciling the results.

One more line on the site is worth noting for anyone in a regulated field: MelMat states that it never trains AI on user chats. The company operates as Via Logixs LLC.

## Traction, and a claim he may want to publish the method behind

Todorovic began building in March 2026 and launched publicly on 1 May, going from concept to a live product in roughly six weeks as a solo founder with no traditional engineering team. The verification architecture is patent pending, and MelMat has been accepted into Embarc Collective, Tampa's startup hub.

He is notably reluctant to put numbers on performance.

"I'm deliberately careful about publishing performance claims before I can defend the underlying measurement. Claims remain claims until they are verified, and I think the company should be held to the same standard as the product."

That principle sits interestingly beside one figure on his own homepage: "98.6% of MelMat briefs land in our lowest hallucination-risk tier." It is a real internal measurement against a scale MelMat defined, and by the standard the product itself applies, a reader would want to see the method before treating it as settled. Publishing how that tier is calculated would turn the strongest number on the site into the most defensible one, and given the philosophy behind the product, it seems likely he will.

A small detail that fits the same picture: the interface is available in English, Serbian and Bosnian. A solo founder localising into two Balkan languages in the first months is not chasing a market segment. He is building something his own people can use.

## The name

There is a personal detail behind the company that Todorovic offers without being asked.

MelMat comes from the names of his twins, Melania and Mateo.

"I did not leave a long corporate career because I wanted to make another chatbot. I wanted to build something I would be comfortable putting my own name, and in a way my children's names, behind."

## What comes next

The direction is deeper into persistent research through the workspaces, and the reasoning behind it is a bet on where the value is moving.

"AI is making answers cheaper and faster every month. I think that makes verification more valuable, not less."

If answers become close to free, the scarce thing is not another answer. It is knowing which one to act on, and being able to show why, months later, to a client, a regulator or a board.

The question he says interests him most is not whether AI can answer more questions, but whether systems can be built that make it easier to know when an answer deserves trust, and when it does not yet. The platform is at <a href="https://melmat.ai" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">melmat.ai</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
