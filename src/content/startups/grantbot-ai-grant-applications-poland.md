---
title: "He Spent 26 Years on Military Aircraft Programs. Now His AI Writes Poland's Grant Applications"
description: "Łukasz Treder, a colonel on the F-35 implementation team, built Grantbot.pl alone: an AI that turns a funder's rulebook into a 40 to 60 page application, for about 60 PLN a month in model costs. Then he ran the company itself on agents."
date: "2026-09-03"
author: ""
category: "Startups"
image: "/images/articles/desk-work-1.jpg"
keywords: ["Grantbot.pl", "Łukasz Treder", "AI grant writing", "EU funding Poland", "grant application AI", "nonprofit grant software", "Claude Sonnet grant writer", "AI agents run a company"]
---

*Partner Story · in conversation with Grantbot.pl. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the founder's own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/lukasz-treder-grantbot.jpg" alt="Łukasz Treder, founder of Grantbot.pl" style="width:100%;max-width:380px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Łukasz Treder, founder of Grantbot.pl. Photo: courtesy of the founder.*

A nonprofit director with a genuinely good project. A founder with a real shot at EU funding. Both sitting on an application they never finished, buried under the needs analysis, the budget, the partner letters and forty pages of guidelines.

Not because the idea was weak. Because getting a strong idea onto paper, the way evaluators want to read it, takes more hours and more expertise than most organisations have. And a consultant is out of reach for the ones who need the money most.

That gap is why Łukasz Treder built <a href="https://grantbot.pl" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Grantbot.pl</a>.

## The founder who came from the F-35

Treder's edge does not come from a fundraising background. It comes from twenty-six years of working on complex military aircraft programmes, including his current role in F-35 acquisition. He is a colonel on the team bringing the fifth-generation fighter into the Polish Armed Forces, and Polish defence media have quoted him explaining how its cockpit systems work.

"This experience taught me how to navigate demanding requirements, compliance, documentation and high-stakes delivery," he says. "The same challenges organisations face when applying for grants."

He runs Grantbot.pl from Washington DC, and right now he is the entire team: engineering, sales and support. That last fact is not a limitation of the story. It is the story, as will become clear.

## Forty pages that follow one funder's rules

A Polish grant application is forty to sixty pages of prose that has to follow one specific funder's rulebook: which sections exist, what belongs in each, which budget categories are capped at what percentage. Most organisations applying for this money have no grant writer. They either sacrifice a board member's month or pay a consultant several thousand złoty per application, with no refund if it loses.

"The absurd part is that most of that month isn't thinking," Treder says. "It's re-shaping the same organisational knowledge, what we do, who we help, how we measure it, into a different template for the fourth time this year."

That observation is the whole design of the product. If the knowledge is stable and only the template changes, then the template is a data structure and the writing is a transformation, and both can be automated.

## The regulation is the contract

Here is how it works, in Treder's own account.

Grantbot parses the funder's regulation into a structured requirement set for each programme: the sections, the required fields, the eligibility rules, the budget limits. "That structure is the contract." Generation then runs section by section on Claude Sonnet 4.6, with the programme requirements and the organisation's profile held in a cached prefix.

The economics of that architecture are what make a one-person company possible. The cache hit rate, measured over a full month, is 73.3%. In that month the system generated 279 sections for about 60 PLN in model spend. Roughly fifteen dollars, for the equivalent of several complete applications that a consultant would bill in the thousands.

Around the writer sits a set of agents that are not chat. A scraper runs fourteen batches a week across governmental and non-governmental sources that offer an API. Claude Haiku 4.5 then scores every new call against every organisation's profile, a cheap model with a tight prompt, and only genuine matches go out as email alerts. A separate job warns you fourteen, seven and one day before a deadline on an application you have actually started. Embeddings run nightly in pgvector over past applications.

Underneath: Next.js, Supabase with row-level security, Python for the ingest side, Railway and Stripe.

## Nothing generates ungrounded

Two things set Grantbot apart, and Treder is precise about both.

The first is discipline about sources. "Every claim in a draft traces to either the funder's regulation or the organisation's own profile." Most tools in this space, he says, are a prompt box in front of a general model. Grantbot knows that in this specific programme, section four has a 3,000 character limit and personnel costs are capped at 20%. An evaluator reading the result sees an application that obeys the rules of that particular competition, because the rules were the input.

The second is the company itself.

## A company run as agents

"I run the company itself as agents. Ten automated processes handle scraping, matching, reminders, outreach, content and publishing. That's not a marketing line, it's why one person can operate this at all, and it's the honest demo of what we're selling."

The marketing runs the same way as the product. An SEO agent on Claude Opus 5 with web search finds a keyword gap, writes an article, compiles it and commits it to the main branch without Treder approving anything. A social agent then announces that article: Opus 5 writes a version per channel, Haiku 4.5 scores the draft on five dimensions, and a set of hard rules in code decides whether it ships. Rule one: no post without a source row it can be checked against. Rule three: every number in the text must exist in that source. Nine rules in all, and one kill switch in the database.

The same grounding discipline that governs a grant draft governs a tweet, which is why the automation is safe to leave running unattended. Treder's operating principle for all of it is one sentence: anything you politely ask a model to remember is a preference, not a rule. A rule is code. Every decision that matters, from which link goes at the end of a post to which budget line is capped, lives in the program rather than in the prompt.

## The numbers

Treder describes the traction as small but compounding, and the figures are his own.

Cash collected went from 470 PLN in June to 1,810 PLN in July. Subscriptions are 63% to 85% of that, so it is a subscription business rather than a string of one-off sales. Pricing starts at 49 PLN a month. The first paying cohort renewed two out of three. "For a product this young, retention is the number I care about, and it held."

On the ingest side, around seventy active competitions are tracked continuously, and one outreach programme reached 13,200 of Poland's 18,698 schools.

Then there is the search agent, which has been publishing to production without human approval since spring. Organic search is 8% of sessions and 70% of tracked revenue. "The traffic is small. Non-brand clicks are still in the dozens per month. But the people who arrive that way are the ones who pay."

That last line deserves a pause. A one-person company whose content is written, published and promoted by agents is already earning most of its revenue from search. The agents are not a demo of what the product might do. They are the sales team.

## What is next

Two directions. Retrieval over winning applications, so the system learns from documents that actually got funded rather than from generic examples. And an early push into dual-use and defence funding, where application budgets are an order of magnitude larger, and where a founder with twenty-six years inside military procurement has an obvious advantage.

He is looking for two things. Organisations that apply for grants regularly and will tell him bluntly where the drafts fall short. And advisory firms that want to use Grantbot under their own brand.

For a consultant charging several thousand złoty per application, the second offer is worth reading twice.

Grantbot.pl is at <a href="https://grantbot.pl" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">grantbot.pl</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
