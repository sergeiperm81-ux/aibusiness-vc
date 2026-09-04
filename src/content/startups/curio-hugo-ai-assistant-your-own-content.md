---
title: "Curio: An AI Assistant for Your Site That Answers Only From Your Own Content"
description: "One line of HTML puts a chat bubble on your site. Hugo answers visitor questions from your docs, your site and your repos, with citations, and says he does not know rather than inventing. Founder Richard Whitney on grounding, prompt injection and building bounded before smart."
date: "2026-08-22"
author: ""
category: "Startups"
image: "/images/articles/typing-dark-1.jpg"
keywords: ["Curio", "grounded AI chatbot", "AI assistant for website", "embeddable chat widget", "prompt injection protection", "RAG chatbot with citations", "Claude Haiku 4.5", "AI customer support"]
partner:
  company: "Curio"
  url: "https://getcurio.chat"
  founder: "Richard Whitney"
---

*Partner Story · in conversation with Curio. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the company's own, presented as they were given to us. No payment was involved.*

Richard Whitney builds <a href="https://getcurio.chat" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Curio</a>, an embeddable AI assistant named Hugo that answers your visitors' questions using only your own content. One line of HTML drops a chat bubble on the site, and Hugo handles the rest. Whitney is the founder of phpMyDEV LLC, based in Scottsdale, Arizona.

The problem he is aiming at will be familiar to anyone who has ever run a website.

"Every site has the same gap," he says. "Visitors have questions, and the answers already exist, buried in the docs, the FAQ, a GitHub README, a PDF nobody opens."

The two usual fixes both fail. Human support does not scale and is not awake at two in the morning. A generic AI chatbot is awake, and that turns out to be the more expensive problem: it will cheerfully hallucinate, invent a refund policy, promise a feature you do not ship, or get talked into leaking something it should not.

"For anyone putting AI on their own site, that unpredictability is the blocker," Whitney says. "Curio's whole job is to make 'put an accurate, safe assistant on your site' a one-line, low-risk decision."

## Where the AI sits

Curio is AI end to end, and Whitney is unusually specific about what runs where.

The live visitor chat is powered by Anthropic's Claude Haiku 4.5, fast and cheap enough to answer in real time at scale, which matters when the model sits in the hot path of every single conversation. Answers are grounded in the customer's own material: Curio crawls the site, GitHub repositories or uploaded files, embeds all of it with Voyage AI's voyage-3.5 vectors at 1,024 dimensions, and Hugo answers only from what it retrieves, with citations back to the source.

The heavier, judgement-heavy work runs on Claude Sonnet 4.6: drafting competitive battlecards from a rival's material, and scrubbing personal data out of stored transcripts. Haiku also handles the smaller background jobs, such as the crawl-time summary of what a site is about, and enriching the analytics.

"It's a deliberately tiered setup," Whitney says. "Haiku for the fast, high-volume path, Sonnet where quality and judgement matter, Voyage for retrieval."

That split is a cost decision as much as a quality one. A model in the hot path is billed on every exchange a visitor has, so the per-conversation price decides whether the product works at any volume worth having. Curio publishes its own running average on the homepage: about seven and a half cents per chat.

## What makes it different

Two things, in Whitney's account.

The first is grounding with citations. Hugo answers from your content or admits that he does not know. He does not improvise, and every answer carries the source it came from.

The second is the part he thinks people underrate.

"Safety is a feature, not an afterthought," he says. Curio will not leak your secrets, your internal sources, its own system prompt, or a visitor's personal data, and it actively blocks prompt injection: the "ignore your instructions and…" attacks that jailbreak naive bots.

"Most add-a-chatbot products hand you a clever parrot and leave the liability to you. We took the opposite bet: a support bot that's confidently wrong, or that can be talked into leaking, is worse than no bot at all."

The assistant also does more than question and answer. Sonnet drafts competitive battlecards from your material and a competitor's, so it helps with positioning rather than support alone. The owner edits before anything goes live.

## The lesson that shaped the product

The insight behind Curio was not about intelligence.

"The scariest thing about putting AI on someone's website isn't that it'll be dumb," Whitney says. "It's that it'll be confidently wrong, or worse, helpful to the wrong person."

It is trivial, he points out, to walk a naive bot into repeating its own instructions, or into speaking for a company on things it was never told. So he inverted the usual priority. Before making Hugo smart, he made it bounded: grounded to the customer's content, citing sources, and hardened against injection and leakage.

"Teaching an AI to refuse gracefully turned out to be harder, and more valuable, than making it chatty."

That is an unfashionable order of work. Refusals do not demo well, they do not trend, and no visitor has ever screenshotted a bot politely declining to answer. They are also the difference between a support widget and a liability, and the people who have already been burned by the second kind tend to understand the distinction immediately.

## What it costs and what it has done

Hugo has answered more than 380 real visitor questions and counting.

Installation is a single line of HTML. There is a free tier covering five conversations a day for thirty days, and after that the account runs on prepaid credits in arbitrary increments, so the spend follows actual use rather than a monthly seat.

For a small site, that is the difference between a line item somebody eventually cancels and a balance that simply sits there being used. For an agency running assistants across a portfolio of client sites, it is the difference between selling a subscription upward and quietly passing through a usage cost.

## Who it is for

Whitney is looking for site owners, SaaS teams and agencies who want an accurate, team-aware, safe assistant on their site without building one, and for anyone who has been burned by a hallucinating bot and wants the grounded, cited alternative.

It is one line of HTML to try, at <a href="https://getcurio.chat" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">getcurio.chat</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
