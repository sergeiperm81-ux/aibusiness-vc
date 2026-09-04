---
title: "Chatbot Testing Is Not What You Think: Why AI Agent Testing Starts with a Standard, Not a Tool"
description: "Companies watch their bots through the technical layer: speed, stability, uptime. What the agent actually says to customers, how it answers, whether it invents, how it behaves under manipulation, stays in a grey zone. Here is what closes it: a service standard, an AI receipt, and a periodic test purchase."
date: "2026-08-16"
author: "Sergei Ponomarev"
category: "Government"
image: "/images/articles/chatbot-phone-1.jpg"
keywords: ["chatbot testing", "AI agent testing", "how to test a chatbot", "AI agent evaluation", "test purchase of AI agents", "AI service standard", "AI receipt", "conversational AI testing", "AI governance"]
---

Companies are launching customer-facing bots at a remarkable pace, and of course they keep an eye on them. There are dashboards, logs, uptime alerts. The watching is real, it is just done almost entirely through the technical layer, and the technical layer is usually somebody else's job: oversight of the bot lands on the shoulders of developers and technical teams, and a technical professional is, quite reasonably, most concerned with technical stability.

But the bot is not only a system. It quotes prices. It promises delivery dates. It refuses people, books people in, gives advice. How does it answer an awkward question? Does it show any empathy, does it meet a frustrated customer halfway? How does it behave when someone manipulates it? Does it ever simply invent things? All of that sits in a grey zone that a stability dashboard does not illuminate, and your company is answerable for every word of it. The tribunal ruling in the Air Canada case, where an airline had to pay for a refund policy its chatbot invented, made that answerability very concrete, in dollars.

So the question every owner eventually asks is the right one: how can I be genuinely confident about what my bot tells my customers? How do I actually test that?

## What technical testing does, and what it cannot do

The market already offers plenty of technical answers, and many are good at what they do. There are tools that measure response speed, uptime and latency. There are evaluation platforms that score model quality, catch incoherent output, flag toxic content, and watch for the model drifting after an update. There is red teaming, which attacks the model to find what it can be tricked into saying.

All of this is useful, and it genuinely reduces risk. It just answers a different question from the one the owner is asking.

Here is why. Suppose your bot tells a customer: "Returns are accepted within 30 days without a receipt." Every technical metric can be green. The answer arrived in half a second. It is grammatically perfect, coherent, polite, non-toxic. The model is stable. And the statement is false, your policy allows 14 days, with a receipt.

No monitoring tool can catch that lie, because no tool knows how many days *your* company allows for returns. That fact does not live in the model or in the logs. It lives, or should live, in your service standard. Technical testing measures how the system behaves. Only a standard lets you check whether the bot kept your promises. These are different questions, and the second one is where the money is: every wrong promise a bot makes is a liability someone eventually pays for.

## Chatbot testing starts with a standard

If you want to test the *content* of your bot's work, what it says, promises and does, the first requirement is not a tool. It is a written reference: what the agent must do, what it must never do, and what counts as a properly delivered service. If that is written nowhere, then any test of the bot degenerates into a collection of impressions, because there is nothing to compare its answers against.

In my method this standard is made of three documents, and the analogy is deliberately old-fashioned:

**The company AI policy.** One public document for the whole company: what your AI does, how it identifies itself, what happens to customer data, which decisions it may never take alone, and how a customer reaches a human. Written for the customer, not for lawyers.

**The service passport.** One document per service. Where the policy sets the general rules, the passport sets the norm for a specific service: what the service is, what stages it has, what data the agent needs, what it may do on its own authority, and what counts as the result. This is the central document of any serious AI agent testing, most checks measure against it.

**The AI receipt.** One document per interaction. Every purchase in the physical world ends with a receipt; a conversation with a bot usually ends with a screenshot of a promise. The receipt fixes that: who spoke with whom and when, whether AI involvement was disclosed, what actions were actually taken and under which identifiers, and how it ended. Your agent should issue one after every meaningful interaction.

Together these three are your evidence base. In any dispute, a complaint, a chargeback, a procurement review, an insurance question, you can put two things side by side: here is what the agent was supposed to do, and here is the record of what happened. A company that has this arrives at an argument with documents. A company that does not arrives with excuses, and excuses are expensive.

## The receipt has a catch, which is why you test

There is one subtlety that surprises everyone the first time: the receipt is the agent's *own account* of what it did, and the agent can be wrong about itself. In a controlled pilot I ran, an agent completed a booking flawlessly and then put into its receipt the email address of an employee who does not exist. The transcript looked perfect. Only a comparison against the platform's operations log caught the invention, in about a second.

This is why a standard on paper is not enough. You have to periodically walk through your own service the way a customer would, and compare three layers: what you promised, what the bot said, and what your system actually recorded.

That procedure has a name older than AI: a test purchase. It is the one instrument that reaches the grey zone directly, because it looks at your agent through the customer's eyes, a mystery shopper walking the whole service from first question to final outcome, noticing exactly the things the dashboards do not: the tone, the empathy, the behaviour under pressure, the confident invention.

## The test purchase, carried over to AI

A test purchase is always a view from the customer's side of the counter. You approach the service as an ordinary customer, go through it end to end, and record every gap between the promise and the practice. I spent twenty years doing exactly this for public services, hundreds of independent assessments, a nationwide monitoring programme, and the discipline transfers to AI agents almost untouched. The human shopper becomes an AI shopper, the clerk becomes the company's agent, and the analysis becomes a reconciliation against the system log.

Checks come in different forms, and choosing the right one is most of the craft. An external test purchase needs no access at all, the standard is whatever your company publishes, and any bot can be checked this way, including your competitor's. An internal one adds the layer only access makes possible: comparing the agent's receipts against the operations log. A check can be manual or automated, and automation has changed the economics completely, because one bot can now test another in a thousand variations for the cost of a coffee. It can cover one service comprehensively or ask one question across a hundred bots for a market rating.

What automation has not changed is the part that decides whether the exercise produces value or noise: the design. Deciding which of your promises are worth checking, writing the scenario so the bot under test does not realise it is being tested, and reading the results correctly, that is methodology, not tooling. The runs are cheap now; the thinking is not. Which is the honest answer to "what should I look for": not a platform, but a methodologist who will write the approach for your specific service, because the list of things one *could* check is nearly infinite, and checking everything indiscriminately is how you drown in data.

One warning about what a test purchase can and cannot prove, because anyone selling you certainty here is selling comfort: a single check can prove your bot broke a promise. It can never prove your bot is fine. One clean run tells you nothing about the next thousand, frequency needs a series. And a check that passed in January is not a check that passes in June: the model underneath your bot gets updated, your own prices and rules change, and behaviour drifts quietly. That is why this is not a one-off exercise but a system of monitoring, run on a schedule.

I have written the full method up as a 35-page guide, the standard, the forms of a check, scoring, evidence, ethics and the limits, based on those twenty years of doing this for a living. The reference pilot behind it is published as open source. Start there, write the passport for one service, and run your first check on your own bot before someone else does.

<a href="/library/ai-agent-test-purchase" style="display:inline-block;background:#f59e0b;color:#000;font-weight:800;font-size:17px;padding:16px 32px;border-radius:12px;text-decoration:none;margin:8px 0">Download the method free, 35 pages, no registration →</a>
