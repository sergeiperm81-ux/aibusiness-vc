---
title: "When an AI System Can Act, Who Decides Whether It May?"
description: "Meir Goldman focuses on a question that becomes important when AI systems act: not only whether a model's output is good, but whether the action it proposes is allowed to become a consequence. FAZON is his attempt to make that question explicit instead of inferred."
date: "2026-08-31"
author: ""
category: "Startups"
image: "/images/articles/padlock-cyber-1.jpg"
keywords: ["FAZON", "governed execution", "AI execution governance", "permission before AI action", "AI agent authority", "human oversight AI", "Meir Goldman", "pre-execution admissibility"]
partner:
  company: "FAZON"
  url: "https://fazon.org"
  founder: "Meir Goldman"
---

*Partner Story · in conversation with FAZON. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the founder's own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/meir-goldman-fazon.jpg" alt="Meir Goldman, founder of FAZON" style="width:100%;max-width:400px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Meir Goldman, founder of FAZON. Photo supplied by Meir Goldman.*

An AI assistant has drafted a document. It knows the recipient. The email account is connected and working. Every technical condition for sending it is satisfied.

None of that establishes that it may send that particular document, to that particular recipient, now.

That gap is where Meir Goldman has put his work. He is the founder of <a href="https://fazon.org/start-here/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">FAZON</a>, based in Israel, and what he builds is governed execution for AI systems: the point at which a proposed action needs a valid basis before it affects people, documents, access or another system.

"That can sound abstract until we make it ordinary," he says. And then he makes it ordinary, which is the most useful thing anyone in this field can do.

## The offer nobody authorised

His illustrative case is deliberately mundane. A team authorises an assistant to prepare an offer for a customer. The draft is accurate. The workflow is complete. The email account is available.

"None of those facts alone establishes permission to make that exact offer to that customer."

Goldman is careful to label this as an illustration rather than a reported client incident, and that care runs through everything he sends. The distinction he is drawing matters more than the example: the risk is not only that AI might be wrong.

"It can do a technically correct thing outside the authority it was given."

Anyone who has worked in an organisation recognises this immediately, because it is the oldest problem in delegation, arriving in new clothes. A competent employee who does something sensible that they had no standing to do has still created a problem, sometimes an expensive one. Competence was never the same thing as authority.

The practical question, as he frames it, is one of timing: can the basis for an action be established while it is still possible to change what happens?

## Separating the proposal from the permission

FAZON's subject is language-model-based agents that interpret requests, assemble information and propose actions through connected tools. In this work, AI behaviour is the subject of governance; the focus is not on building another general-purpose chatbot.

The core design principle is an explicit separation between the proposal and the permission to carry it out.

"A model's confidence or explanation should not be treated as authority in its own right. The proposed action needs to be considered against the applicable authority, evidence and scope."

A modern agent may explain its reasoning fluently, and fluency can be mistaken for justification. That explanation presents the model's stated reasons; it does not, by itself, establish that anyone granted authority to act.

## What the usual controls do not answer

The strongest passage in his account is the one where he declines to dismiss the alternatives.

Better prompting improves a draft. Access controls restrict which services an agent can reach. Monitoring helps explain what occurred afterwards. Goldman calls these useful controls and means it.

His emphasis is on the question none of them answers by itself: whether this action may create this consequence under the conditions that apply now.

"I do not assume other approaches cannot address that question. I want it to be explicit, rather than inferred from the fact that the workflow continued."

The failure mode he is concerned with is treating continuation as permission: nothing blocked the action, so the action is assumed to have been allowed. His question is whether that assumption was justified before the consequence.

He applies the same scepticism to the human in the loop, and this is where his thinking gets sharpest.

"Being named as the reviewer is not enough; the person needs usable information, time and a real ability to change the outcome."

For an organisation that has named a reviewer, the question is whether that person can actually intervene. Without usable context, sufficient time or a real ability to change the outcome, human oversight can become procedural rather than effective.

## What exists, stated precisely

Goldman is unusually disciplined about the difference between publication and product, and he states the boundary before anyone asks him to.

The public technical work includes <a href="https://github.com/fazoncore/mdab-tel-cts" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">MDAB-TEL CTS</a> on GitHub, with telemetry documentation, verification tools, conformance-test fixtures, expected outputs, versioned releases and reproducibility instructions. Its scope is telemetry verification, not a complete deployed execution-governance platform. Separately, <a href="https://github.com/fazoncore/fazon-core-bundle/tree/main/records/FAZON-REC-2026-08-07-AI-EXECUTION-GOVERNANCE-v0.2_PUBLIC_PACK" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">FAZON's public category record v0.2</a> documents the positioning, terminology, claim limits, citation metadata and integrity-verification instructions. These links make the specific published materials inspectable; they are not an inventory or validation of all FAZON work.

Then the qualification, in his own words: those materials support specific claims about what is available to inspect, and they do not establish a deployed customer platform.

"I am not presenting publication activity or professional conversations as revenue, customer adoption or independent certification."

Goldman lists what is available to inspect and separates it from what those materials do not establish. That reflects the evidence discipline he wants FAZON's execution controls to support.

The next milestone he names is a bounded, non-production demonstration connecting the work to one defined workflow, and measuring what actually happens.

## The lesson: precision that hid the point

Asked what building FAZON taught him, Goldman describes a failure of communication rather than of engineering.

"I could make the language more precise and still make the idea harder to understand."

Layers, terms and diagrams accumulated, and each addition was defensible on its own. Together they buried the everyday question underneath.

What rescued it was returning to a single action, sending a document, and four plain questions. Who is it for? What is being sent? Who may authorise it? Can the decision still change before it leaves?

"I do not need a reader to learn an entire vocabulary before recognising the problem."

The discipline he draws from it is the one he applies to his own claims: be clear about the difference between what you intend to build, what has been tested, and what a public record actually demonstrates.

## The commercial step, and what it is not

This interview does not claim revenue, customer adoption or a published price for the proposed review. The public materials described here are not presented as a deployed customer platform.

What he is preparing is an Execution Boundary Readiness Review built around one concrete workflow, rather than an invitation to begin a broad governance transformation. A bounded review gives an organisation a concrete starting point. Who may commission it, and what approval it requires, depend on that organisation's own authority and procurement rules.

He is looking to work with operators, security leads and enterprise architects who can point to a real proposed action and the decision it requires. The starting point he offers is a clearly scoped discussion and a non-production validation plan, and he says plainly what it is not: an open-ended integration promise.

## Why the timing matters

AI output can already lead to serious consequences when people rely on it. Agents add a further path: the system may itself send an offer, change access or release a document. The issue is therefore not only the quality of the answer, but the basis for letting a proposed action create an external effect.

Which is why Goldman's framing lands where it does.

"The aim is not to make every AI action slower. It is to make the basis for consequential action clear while it can still matter."

Or, as the line he ends on puts it: permission before AI action becomes consequence.

FAZON is at <a href="https://fazon.org/start-here/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">fazon.org</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
