---
title: "UMI Wants Machines to Understand Human Motion. It Started With the Hardest Test There Is: Sign Language"
description: "UMI is building the layer between human movement and machine understanding, beginning with bitsign, an ASL-to-English translator. It has now put a real baseline, a public benchmark and its own mistakes on show."
date: "2026-09-17"
author: ""
category: "Startups"
image: "/images/articles/umi-bitsign-sign-lab-cover.jpg"
keywords: ["UMI", "bitsign", "sign language translation AI", "ASL to English AI", "motion intelligence", "Bittensor Subnet 78", "FLEURS-ASL", "physical AI", "Michael Parker", "Koyuki Nakamori"]
---

*Partner Story · in conversation with Michael Parker of UMI. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the company's own, presented as they were given to us, and the benchmark figures are ones UMI supplied and published. No payment was involved.*

AI learned to read. Then to speak. Then to see. What it still understands remarkably little about is what a human body is saying.

That is the gap UMI, short for Universal Motion Intelligence, is trying to close. Its co-founder and chief executive Michael Parker describes the company as building "the layer between human movement and machine understanding: turning observed human motion into contextual meaning, intent and calibrated uncertainty across time."

Its first product, <a href="https://bitsign.ai" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">bitsign</a>, is being built to translate between American Sign Language and spoken English.

## A patient who is already communicating

Parker starts with a scene rather than a market.

"Imagine a Deaf patient walking into a hospital. They raise their hands and begin to sign. There is no absence of information. Their hands carry language. Their face modifies meaning. Their body establishes context. Timing matters. Space matters. Sequence matters."

"The patient is already communicating. The problem is whether the technology around them can understand."

He is careful about what bitsign is for. Qualified human interpreters remain essential, especially for complex or consequential medical conversations. But interpreter availability is finite and the need to communicate is not. bitsign is being designed to widen the moments in which communication can happen immediately, while keeping escalation to a qualified interpreter wherever it is needed.

## Why start with the hardest problem

Most motion-recognition products begin with something tractable: a wave, a thumbs-up, a fall detected on a camera. UMI chose the opposite.

"We deliberately chose not to begin with an easy motion-recognition problem," Parker says. "We started with sign language because it forces almost every difficult part of human motion intelligence to arrive at once: hands, fingers, face, body, space, sequence, context and language."

In natural signing, meaning does not live in the hands alone. Facial expression changes it, body position frames it, timing and the use of space carry grammar. A system that only recognises handshapes is recognising gestures, not language.

"You cannot solve natural sign language by recognizing a handful of gestures."

## The moment the company changed shape

The most important realisation in building UMI, Parker says, was that the team had been treating sign language as the destination.

"It isn't. Sign language showed us the larger problem. The human body is already an interface."

People communicate constantly without speaking: a glance toward an object, a change of posture, hesitation, urgency, a hand raised in warning, two people coordinating without a word. Humans read all of it almost unconsciously. Machines largely do not.

"The cameras are already here. The sensors are already here. AI can increasingly see us. The missing layer is understanding."

That reframing is why the company is called UMI rather than bitsign. "Sign language is the first proving ground," he says, "not the boundary."

## Where it came from

UMI looks new in public, and in its current form it is. The work underneath it is older.

By Parker's account, elements of what became UMI were developed quietly for around six months before launch. Bittensor Subnet 78, which UMI now operates, began life as Vocence, a decentralised voice-intelligence subnet founded by Koyuki Nakamori, now UMI's co-founder and Head of AI. Nakamori previously served as Head of AI at the OpenTensor Foundation, the organisation behind Bittensor, and also founded Perturb, an adversarial-robustness and AI-safety testing subnet.

Rather than an outside company replacing an existing team, Parker describes a merger of complementary work: the voice intelligence already running on SN78, and a broader thesis about multimodal human communication and motion. The voice technology stays in the architecture. The mandate around it widened, in his words, to "voice, vision, motion, expression, language, context. Ultimately, meaning."

## What exists today

UMI now has a baseline model translating real ASL video into English end to end, and it has made the outputs public.

<img src="/images/articles/umi-bitsign-sign-lab-translation.jpg" alt="UMI Sign Lab frame showing an ASL signer, the model's face, hand and body inputs, its English output and the reference sentence" style="width:100%;max-width:720px;height:auto;border-radius:16px;margin:28px 0 8px" />

*A frame from UMI's Sign Lab recording: the original benchmark video, the detections the model receives, and its early English translation beside the reference sentence. Source video from FLEURS-ASL (Google), CC BY-SA 4.0.*

The benchmark is FLEURS-ASL, a dataset released by Google researchers in 2024 that extends the FLORES and FLEURS translation benchmarks to American Sign Language, with the ASL translations performed by five Certified Deaf Interpreters. It is a hard test by design. The dataset's own authors reported a baseline of 3.7 BLEU for sentence-level ASL-to-English translation.

UMI's current frozen development set is nine held-out FLEURS-ASL clips. On it, the baseline scores:

- Mean word error rate: 79.47%
- Mean character error rate: 60.66%
- WER-derived translation score: 20.53%
- Inference completed on 9 of 9 clips

In a separate reliability run, the pipeline completed 28 of 28 distinct real ASL clips.

Parker is precise about what those numbers are. They are frozen development benchmark results, not scores from the live network's validators, whose competitive translation weights have not yet been switched on.

## The example they chose to show

Asked for a recording that includes a mistake, UMI sent one.

The signer's reference sentence: "The cabbage juice changes color depending on how acidic or basic (alkaline) the chemical is."

The baseline's output: "Alkaline chemicals change the color of acids and basics."

Word for word, that scores a 93.33% word error rate. Yet it is plainly not noise: the model has caught chemicals, alkalinity, acids and bases, and a change of colour. UMI's public Sign Lab rates the semantic similarity of the pair at 71%, and then spends a paragraph explaining what that number does not mean. The output keeps related words, it notes, but omits the cabbage juice and changes the relationships between the concepts. "Topic overlap and a faithful translation are different achievements."

"The baseline is intentionally a starting point," Parker says. "What matters to us is that we now have real video moving through the complete pipeline, reproducible errors, frozen evaluation material and an objective measurement that subsequent models can be tested against."

He argues the failures belong in public. "I actually think the failures are important to show, because they explain why the competitive improvement mechanism exists."

## Inside the Sign Lab

The <a href="https://www.bitsign.ai/sign-lab" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Sign Lab</a> describes itself as "a recorded benchmark inspection, not a live inference service or a claim of a solved translator," and it reads like a document written by people expecting to be checked.

It shows what the model actually receives. The face detector records 478 points per face, but the current downstream representation keeps mainly the eye and mouth regions rather than the full facial mesh. Each detected hand carries 21 points. The body detector finds 33 points, of which the model currently uses seven, with two coordinates each: the nose, both shoulders, both elbows and both wrists.

It is equally specific about limits. The team says it does not claim that eyebrow grammar, emotion or other non-manual meaning is reliably decoded by this model yet. Where tracking fails, the traces break rather than being smoothed into something that looks successful. And because the system still uses appearance-bearing image crops, appearance-free motion understanding is labelled as a research direction, not a privacy property the product already has.

For a field with a long history of overpromising to the Deaf community, that level of disclosure is the most persuasive thing on the page.

## How the money works

This is where UMI differs structurally from a conventional AI start-up.

UMI operates Bittensor Subnet 78. Bittensor is a decentralised network in which independent participants, called miners, compete to produce better models against defined benchmarks, validators score their work, and the network rewards useful results. SN78 has its own protocol-native alpha token that trades within the Bittensor ecosystem. Parker says the current subnet slot is funded through DSV.

He is explicit about the boundary. The token is Bittensor network infrastructure. It is not equity in UMI, does not represent shares in the company, and does not confer ownership of UMI or bitsign. He compares the subnet to a conventional company's research and model-evaluation infrastructure: rather than paying an internal team to iterate on one model, UMI opens the problem to a competitive network that is economically rewarded for measurable improvement.

That is why the frozen baseline matters commercially. A fixed, reproducible benchmark is what gives miners something objective to beat. UMI has also published an open ASL-to-English reference model and miner runtime on GitHub, so participants start from a working system rather than a blank page, and the first miner pilots are already logged publicly in the project's issue tracker.

The company itself, and bitsign as a product, are what UMI is bringing to customers. Readers should treat the token as what it is, a network asset, and nothing in this article as a view on it.

## Five markets, one capability

UMI's own site sets out where it thinks the same motion-to-meaning capability leads, with a market estimate beside each:

- Accessible language and communication, around $70 billion and beginning with bitsign
- Embodied AI and human demonstration, teaching robots action and intent, around $23 billion by 2030
- Human activity recognition and intent, around $18 billion by 2030
- Predictive motion and safety, anticipating falls, injuries and collisions, $10 billion and upward
- Behavioural and multimodal intelligence built on face, gaze, posture and body, $10 billion and upward

What is unusual is the footnote. Because these markets overlap and reuse one foundation, the company says it never adds them up into a single figure. Start-up decks rarely decline to show the biggest number available.

## Built for a hospital, not a demo

Healthcare is the first setting UMI is designing for, and it shapes the engineering.

For clinical deployment, Parker says the team is designing around confidential computing, hardware-isolated processing, encrypted communications, data minimisation and controlled access. Just as important is knowing the system's edges. "Healthcare requires us to know not only when the system performs well, but where it fails, how confident it is and when a human should remain in the loop."

That is also why UMI talks about calibrated uncertainty rather than accuracy alone. A translator that is wrong and sure of itself is more dangerous in an examination room than one that flags its doubt and hands over to an interpreter.

## Transparent, not indiscriminate

Much of UMI's work is public: the subnet code, the reference model, the Sign Lab, the leadership page. Some is not. Parker draws the line plainly.

Technical infrastructure tied to the integrity of the competition, some security mechanisms, and several commercial, healthcare and government conversations stay private, in some cases because the information belongs to the other party as much as to UMI. Some developers on the team work pseudonymously, which the company states openly rather than hiding. Conversations with distribution partners and early investors are under way and are not named.

"Transparency and indiscriminate disclosure are not the same thing," he says. "I am happy to be transparent. I won't be indiscriminate."

## What is a target, and what is next

UMI's site now labels its headline figures, sub-three-second end-to-end latency and broad sign-language coverage, as engineering targets, with verified benchmarks to be published as the platform advances through formal validation.

The subnet code is <a href="https://github.com/Umi-BitSign/umi" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">public on GitHub</a> under an Apache 2.0 licence and defines the competition, the scoring and the evidence trail, including hypotheses, revealed references, exact scores and replayable failures.

Next come competitive improvement on the live network, an iOS product concept for bitsign, and a validation framework built with Deaf participants. That framework is meant to go well beyond whether an English sentence looks roughly right: semantic accuracy, naturalness, contextual understanding, facial and non-manual information, variation between signers, failure modes, uncertainty, and whether users are being asked to change how they sign in order to be understood. Parker is careful to call it something being built into development now, not a completed programme.

The principle underneath it is the line he returns to most often.

"The technology should not ask Deaf people to communicate differently. It should learn how they already communicate."

UMI is at <a href="https://www.umi.vision" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">umi.vision</a>, and bitsign's Sign Lab is at <a href="https://www.bitsign.ai/sign-lab" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">bitsign.ai/sign-lab</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, benchmarks, markets and plans are its own. This article is not investment advice and expresses no view on any token. Building something with AI? [Tell us about it](/submit-your-story).*
