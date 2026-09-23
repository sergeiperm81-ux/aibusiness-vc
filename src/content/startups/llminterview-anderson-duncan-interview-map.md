---
title: "A $39 Map of the Interview You Are About to Walk Into"
description: "Anderson Duncan built LLMInterview.com because candidates for AI engineering jobs prepare for everything and arrive ready for nothing. His product reads the job description and the recruiter's wording, then ranks the rounds you are likely to face."
date: "2026-09-16"
author: ""
category: "Startups"
image: "/images/articles/desk-laptop-1.jpg"
keywords: ["LLMInterview", "Anderson Duncan", "AI engineer interview", "LLM engineer interview", "interview preparation AI", "AI job interview map", "agentic AI interview", "AI hiring"]
---

*Partner Story · in conversation with Anderson Duncan. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are his own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/anderson-duncan-llminterview.jpg" alt="Anderson Duncan, founder of LLMInterview.com" style="width:100%;max-width:360px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Anderson Duncan, founder of LLMInterview.com. Photo: provided by Anderson Duncan.*

An AI engineering job can pay more than most people will earn in any other role they are qualified for. The interview that decides it is frequently a black box.

"In 2026, someone can be genuinely qualified for an AI engineering job and still have almost no idea what the interview will look like," says Anderson Duncan, founder of <a href="https://llminterview.com" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">LLMInterview.com</a>.

The reason is that the vocabulary has not settled. A recruiter writes "AI Design round" and the phrase means product scoping at one company, LLM system architecture at another, and an agent-design exercise at a third. Same words, three different evenings of preparation.

## Studying everything is a way of preparing for nothing

Faced with that ambiguity, candidates do the responsible-looking thing. They revise algorithm puzzles, transformer theory, retrieval, agents, evaluation, system design, behavioural stories and whatever they can find in forum posts about the company.

Duncan's argument is that this breadth is the trap.

"That feels responsible, but it often produces shallow preparation everywhere. The problem I wanted to solve was not a lack of interview material. It was a lack of prioritization."

Anyone who has ground algorithm problems for a week and then sat down to a conversation about evaluation design will recognise the failure. The material was not missing. The aim was.

## What the product does

A candidate pastes in the job description, the company, the level, anything the recruiter has told them, and optionally their own background. About a minute later they get what Duncan calls an Interview Map: the rounds they are most likely to face, ranked, with what each one is probably testing, where they look exposed, and what to do first.

The output is deliberately constrained. Rather than free-form prose, it is schema-validated into fixed parts: likely rounds, a confidence state for each, the reason behind it, the top signals the loop tests, exposure areas and immediate actions.

The published example runs a fictional senior applied AI role and sorts the loop into confirmed rounds, a very likely behavioural round, a likely evaluation round that may be folded into system design instead, an unlikely classical machine learning round, and an agent take-home marked simply unknown.

## Where the AI sits

"AI is the product engine, not a decorative layer," Duncan says.

The system uses Perplexity to gather current public evidence about the company and role, then an OpenAI model through Lovable's AI gateway to synthesise that evidence into the structured map.

The interesting part is the hierarchy it enforces. Anything the recruiter said is treated as first-party evidence and outranks the model's own inference. Public evidence can strengthen or weaken a prediction, but it is not allowed to promote an inferred round to confirmed. Where evidence is thin, the map is built to say so.

## Selling calibration instead of certainty

That rule came out of the decision Duncan describes as the most important one he made.

"Early in the build, it was tempting to make every map look decisive because decisive outputs feel more impressive. But that would destroy the thing that makes the product useful."

So confirmed, very likely, likely, unlikely and unknown are kept as genuinely different states rather than shades of the same reassurance.

"A product that helps people prepare for high-stakes interviews has to be comfortable saying we do not know. The lesson was that calibration is more valuable than confidence theater."

It is also the competitive position. The rest of the category sells volume: bigger question banks, more model answers, more mock interviews. Duncan is selling subtraction.

"The useful question is not what could an AI engineer be asked. It is: given this exact job, this level, this recruiter wording, and the public evidence available right now, what should this person spend the next three hours or three days preparing?"

## The money

The free map costs nothing and needs no card. The full map is $39, paid once, for one interview.

That pricing choice is worth noting in a market that defaults to monthly billing. Interview preparation is not a habit, it is an episode: a few intense weeks, then nothing for two years. A subscription for that is a product designed to be forgotten about and keep charging. The pricing page makes the point in its own words, promising no subscription, no credits and no plan to downgrade.

Set against what is at stake, the arithmetic is not complicated. A single senior AI engineering offer moves annual income by a figure with several zeros in it. $39 to know whether to spend the weekend on evaluation design or on agent architecture is a small bet on a large outcome.

## Day one, said plainly

The product launched publicly on 15 September 2026, and Duncan does not dress that up.

"I do not have a meaningful user or revenue number to dress up yet. I would rather be explicit that this is day one than invent traction that does not exist."

What did launch alongside it is a free editorial layer covering AI engineer and LLM engineer interviews, agentic AI, AI system design, retrieval questions, evaluation and AI-assisted coding. He runs LLMInterview.com as a sole proprietorship from Georgia in the United States.

## What comes next

Not features. Feedback.

The next thirty days go on collecting real candidate reports, comparing the loop the map predicted against the loop that actually happened, and improving calibration from the gap. He wants to learn where the map is consistently right, where it overreaches, and which recommendations candidates actually act on.

For a product whose entire pitch is calibrated confidence, that is the only roadmap that makes sense. The map has to be right often enough to be worth following, and honest enough to admit when it is guessing.

LLMInterview is at <a href="https://llminterview.com" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">llminterview.com</a>.

---

*This is a Partner Story: a written interview with someone building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the product and its results are the founder's own. Building something with AI? [Tell us about it](/submit-your-story).*
