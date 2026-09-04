---
title: "He Automated a False Sense of Certainty, Then Fixed It: 25 Days of an AI Presenter That Proves It Posted"
description: "Simon Crack built a disclosed AI version of himself that researches, scripts, presents and publishes a video every morning. The interesting part is not the face. It is what happened when the system reported success for videos nobody had ever seen."
date: "2026-08-26"
author: ""
category: "Startups"
image: "/images/articles/video-production-1.jpg"
keywords: ["Cortex ID", "KlipZi", "AI presenter", "AI avatar video automation", "disclosed AI content", "automated short form video", "AI content pipeline", "Simon Crack"]
partner:
  company: "Dead Cool Apps"
  url: "https://cortexid.klipzi.com"
  founder: "Simon Crack"
---

*Partner Story · in conversation with Dead Cool Apps. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the founder's own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/simon-crack-klipzi.jpg" alt="Simon Crack, founder of Dead Cool Apps" style="width:100%;max-width:400px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Simon Crack, founder of Dead Cool Apps, creator of KlipZi and Cortex ID. Image supplied by the founder.*

At 7:15 every morning, on an always-on Mac in Edinburgh, a locked-down process wakes up and asks Codex to research exactly three current AI stories and pick the strongest one.

By the time most people have finished their coffee, that story has become a script, a voice, a presenter, a vertical video with generated B-roll and burned-in subtitles, and a post on social media. The presenter is a disclosed AI version of Simon Crack, founder of Dead Cool Apps Ltd, the small bootstrapped software company he has run out of Edinburgh since 2012.

He calls it AI Simon, and he is careful about what it is.

"I wanted content to keep moving while I built the business, without pretending the AI was really me or taking my judgement out of the process."

## The face was the easy part

Crack has been building businesses since 2009, with more than 200 apps behind him and fourteen features from Apple. He is unsentimental about what avatar products actually solve.

"Most avatar products only solve the face. The result still needs a worthwhile topic, script, visuals, context, checks and distribution."

That list is the real problem. Being visible online matters, and researching, scripting, filming, editing, subtitling and posting every single day quickly becomes a second full-time job. A talking head waiting for someone to hand it a generic script has removed the least expensive step in that chain.

So AI Simon is the join rather than the component. <a href="https://cortexid.klipzi.com/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Cortex ID</a>, his own product, holds the identity and business context, controls the workflow, and orchestrates voice, avatar, video assembly, captions, fallback rules and final delivery checks. KlipZi, also his, plans and generates the story-specific vertical B-roll. Third-party services do the raw speech synthesis, avatar rendering and video generation, which Crack describes plainly as "replaceable parts rather than the product itself."

Before anything leaves the Mac, a local validator checks the public source, the date, the evidence, the script length and the required disclosure. Both the video and the caption state that the presenter is AI.

## "I had automated a false sense of certainty"

The most useful part of Crack's account is the part most founders leave out.

The first version of the system could not tell the difference between finishing and delivering.

"A finished video reached the publishing queue and my local sender treated Cortex ID's complete status as success. The video existed, but that did not prove a social platform had published it."

Then the sentence that should be printed above every automation project ever built: "I had automated a false sense of certainty."

The fix changed what counts as done. The sender now keeps checking and accepts only a real posting time returned by the downstream service. As Crack puts it: "A rendered video proves production, not delivery."

There was a second failure waiting behind the first. A retry, or a direct publish request, could create a second queue item while the original was still scheduled, which in a daily content system means two versions of the same morning. Every daily package now gets a fixed fingerprint before submission. If the same package is submitted again, it must resolve to the same job and the same queue item, and that identity is checked throughout the handoff. If anything comes back different, the system stops rather than guessing or making another video.

And a third, smaller one: B-roll failures used to kill the whole post. Now, for AI Simon specifically, if the optional B-roll stage fails completely, the system falls back to the clean AI presenter with burned-in captions, and late results are ignored so they cannot overwrite the version already chosen for delivery.

"Those failures made the system real. Receipts, retry safety, duplicate protection and honest fallback matter more than the demo."

## The numbers, counted strictly

Crack is direct about the stage: early and completely bootstrapped, and he declines to inflate it.

KlipZi has more than 1,200 registered profiles. Both KlipZi and Cortex ID have paying customers.

From 2 August to 26 August, AI Simon produced 25 consecutive confirmed daily posts. The word doing the work in that sentence is "confirmed."

"I only count them because each has a genuine downstream posting receipt. Earlier tests that merely completed the video do not count."

That is a harder standard than most companies apply to their own metrics, and he applied it to himself after discovering it was the standard he had been failing.

## What it costs

Cortex ID publishes its pricing: a free trial of three videos with no card, Pro at $97 a month for 60 videos with full autopilot, and Studio at $197 a month for 180 videos with custom API integration.

Set against the alternative, the arithmetic is not subtle. Sixty finished, captioned, published vertical videos a month is somewhere between a freelance editor's retainer and a part-time content hire. The comparison a small business actually makes is not "AI presenter versus real presenter," it is "this versus posting nothing for the fourth week running."

## What is next

Crack wants the machinery to disappear for people who do not want to understand it: better performance feedback, more repeatable formats, and a controlled expansion to more identities and publishing setups.

"I still decide the identity, opinions, boundaries and direction. The system handles the repetitive production."

He is looking for users and partners who want consistent founder-led content without filming and editing every day. The project is at <a href="https://cortexid.klipzi.com/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">cortexid.klipzi.com</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
