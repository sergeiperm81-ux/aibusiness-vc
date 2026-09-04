---
title: "The AI Host Interviews a Real Human: Inside mato's Bet on Live Conversation"
description: "Most AI audio generates a script and a synthetic voice. mato does the opposite: a real guest, an AI interviewer that reacts to the answers, and a human who decides what gets published. Co-founder Alexander Benz on why the bottleneck was never the conversation."
date: "2026-08-15"
author: ""
category: "Startups"
image: "/images/articles/podcast-mic-2.jpg"
keywords: ["mato", "AI podcast platform", "AI host interview", "AI voice agents", "podcast production automation", "ElevenLabs", "AI interview workflow"]
partner:
  company: "mato"
  url: "https://heymato.com"
  founder: "Alexander Benz"
---

*Partner Story · in conversation with mato. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the company's own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/alexander-benz-mato.jpg" alt="Alexander Benz, co-founder and CEO of mato" style="width:100%;height:auto;border-radius:16px;margin:28px 0 8px" />

*Alexander Benz, co-founder and CEO of mato. Photo credit: mato.*

Alexander Benz and his husband Edward started <a href="https://heymato.com/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">mato</a> in 2024. The company is headquartered in Los Angeles with a distributed team across the Americas and Europe, and it is doing something the rest of the AI audio market largely is not: keeping a human being on the other end of the microphone.

## What the company actually does

mato is an AI-native podcast platform. An AI host conducts a live interview with a real guest, and the recording then moves through a production workflow that a person reviews before anything is published.

The target customer is not an individual with one story to tell. By the company's account it is built for companies, agencies and networks that have useful people and stories available but cannot justify a full audio team for every recurring show.

"The objective is not to remove the guest, the editor, or the person accountable for publication," Benz says. "It is to remove the production bottleneck around them."

## The problem, as they frame it

A good expert conversation is valuable. Producing one repeatedly is operationally awkward.

Someone has to research the guest, build an angle, prepare questions, host the call, notice the unexpected answer, ask the right follow-up, recover from tangents, edit the recording and route it through approval. Most teams can do that once. By mato's reckoning, far fewer can do it every week across several clients or shows.

The industry's usual answer is to generate a script and hand it to synthetic voices. Efficient, and in Benz's words, it removes the part that makes an interview worth hearing: a real person saying something the producer did not already know.

That is the wager the company has made. Automate the work around a live conversation without replacing the live conversation itself.

## Where the AI actually sits

This is the part worth reading closely, because it is more specific than most companies are willing to be.

The interview itself runs through a real-time conversational voice layer over an ElevenLabs WebSocket connection. Before the call, mato prepares a bounded set of topics, source facts, callbacks and editorial guardrails for the selected AI host.

During the call, a separate server-side producer layer tracks what has been covered, which threads are still open, what has been corrected, the current phase of the interview and the recent turns. An Anthropic Claude Sonnet planning model can suggest the next beat or a producer cue, while deterministic controls limit which cues are allowed and when they are permitted to interrupt.

The separation is the design, not an implementation detail. The voice agent handles the immediate exchange. The slower planner protects the long arc of the interview. Safety and state controls sit around both.

The guest can correct the record or take something off the record, and the resulting recording still goes to a human for review before publication.

## What they claim is different

Not that the AI voice sounds polished. Plenty of tools clear that bar.

The claim is that the host is participating in a real interview: the next question can change because of what the guest just said, a useful tangent can continue, a weak one can be closed, and the system can return to an unanswered point later instead of marching through a fixed list.

At the same time the company is explicit about what it is not claiming. "We do not pretend the model is an autonomous journalist," Benz says. The person running the show keeps the guest choice, the editorial rules, the factual review, the final approval and the release decision. For agency partners, that also means the agency keeps the client relationship and the judgment that makes the work theirs.

## Proof, and the limits of it

Asked for evidence, Benz points at something inspectable rather than a metric.

mato has published live interview episodes with real guests. One example features Kevin DeMeritt, founder and CEO of 2X Solutions, discussing why AI calling systems fail before anyone answers. DeMeritt is a real and checkable subject for that topic: he spent 37 years running the precious metals firm Lear Capital before launching 2X Solutions, an AI-powered outbound calling platform, in 2024. The episode has a named source, questions that respond to the answers, a finished cut and a transcript that can be reviewed after the fact.

The company is also clear about a line it will not cross. "We are deliberately not using an unedited recording as marketing proof without the guest's and editor's permission," Benz says. "The accountable version of this product is not 'the model said something interesting.' It is a workflow where a real guest, an AI interviewer and a human publisher each have a clear role."

One note of context we would add as the publisher rather than the company: the live-interview format is the newest part of the product, and much of mato's visible catalogue today is AI hosts discussing industry news with each other rather than interviewing guests. Nothing in the company's account contradicts that. It is simply worth knowing which part of the catalogue demonstrates which claim.

## The lesson that cost them the most

"The hardest lesson was that more autonomy does not automatically produce a better conversation," Benz says.

Early versions could cover every planned topic and still feel flat. The system was behaving like a checklist with a voice.

What fixed it was treating the interview as two different timing problems rather than one. The live host needs to respond quickly and naturally. The producer needs to think more slowly about the arc: what the guest is actually saying, what tension is unresolved, and when the conversation has earned a transition.

"Giving those jobs separate lanes made the system more useful," he says. "Keeping human publication control outside both lanes made it more trustworthy."

It is a useful principle well beyond podcasting. Most agent products fail in the same direction: a single model asked to be fast and thoughtful at once ends up being neither.

## Where the money question sits

mato is not selling a one-off recording, and the economics only make sense if you were going to run a show anyway.

The company is looking for agencies, content teams and podcast networks that already know how to choose a strong guest and make an editorial decision, but need a repeatable production layer around that work. Their suggested starting point is deliberately small: one client, one format, three episodes.

That is enough, they argue, to measure the things that decide whether this is a business or a novelty: preparation time, review rounds, agency hours, reusable assets, and whether the workflow actually saves effort. Pricing is published on their site.

It is a sober way to sell an AI product, and rarer than it should be. The pitch is not "replace your team." It is "run the test on three episodes and count the hours."

The product and the live interview format are at <a href="https://heymato.com/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">heymato.com</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
