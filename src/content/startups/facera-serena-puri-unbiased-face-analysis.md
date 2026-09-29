---
title: "Facera: An Honest Look at Your Face, Before Anyone Tries to Sell You One"
description: "Serena Puri walked out of a consultation with a quote and no idea whether she needed any of it. So she built Facera, an AI that studies three photographs of your face and tells you, gently and with real prices, what it sees, what your options are, and when the wisest choice is to do nothing at all."
date: "2026-09-29"
author: ""
category: "Startups"
image: "/images/articles/ai-face-1.jpg"
keywords: ["Facera", "Serena Puri", "AI face analysis", "aesthetic medicine AI", "unbiased second opinion", "Gemini API product", "cosmetic treatment costs", "AI consumer health"]
---

*Partner Story · in conversation with Serena Puri of Facera. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are her own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/serena-puri-facera.jpg" alt="Serena Puri, founder of Facera" style="width:100%;max-width:340px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Serena Puri, founder of Facera. Photo: Facera Team.*

There is a particular kind of loneliness in wondering about your own face.

You notice something in the mirror one morning, a shadow that was not there before, a line that seems deeper than last year. You want someone to tell you the truth about it. And the moment you go looking, you discover that almost everyone with an opinion also has something to sell you. The clinic that offers the consultation also performs the procedure. The website with the dramatic before-and-after photographs is, one way or another, paid by the after.

Serena Puri knows this feeling from the inside.

"I built Facera out of my own experience of being upsold treatments and coming away confused about what I actually needed, if anything," she says. She left that appointment with a quote, and with a question no one in the room had been paid to answer honestly: did she need any of it?

<a href="https://myfacera.com" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Facera</a>, built from Chicago, is her answer to that question, offered to anyone else standing in front of the same mirror.

## A report written for the person whose face it is

The experience is simple by design. You upload three photographs: your face from the front, then smiling, then in profile. You choose which concerns you would like to understand. A little later, you receive a report that walks through your face area by area, in plain language, the way a knowledgeable friend might if that friend had no stake in your decision.

Puri describes its purpose in one sentence: "It's the honest second opinion you'd want before your first appointment."

What makes the report unusual is not that it names what it sees. It is what it does with that observation. For every area, it lays out the full range of paths, beginning with the gentlest, and it always includes the one that clinics rarely mention: doing nothing.

The company shows a real page of a report on its homepage, and it is worth reading slowly. For mild hollowing under the eyes, the kind that is common and entirely within the normal range, the report offers three roads. A caffeine and retinol routine, $30 to $60, no recovery, gradual improvement over eight to twelve weeks. Under-eye filler, $800 to $1,500, a few days of bruising, results lasting nine to eighteen months. Lower blepharoplasty, $3,500 to $6,000, two to three weeks of swelling, results essentially permanent.

And then, in a voice no clinic uses: in your case, the skincare route is worth a full twelve weeks before considering anything else. Under-eye filler is one of the most frequently oversold treatments, and one of the trickiest to get right.

"The decision stays with the person whose face it is," Puri says.

## Why honesty here is a matter of structure

It would be easy to read that report as a matter of tone, as though Facera were simply a kinder voice in a hard industry. Puri is clear that the kindness is built into the company's bones, not its manners.

"Facera has no clinic partnerships, no procedure commissions, and no sponsored recommendations. That means we have no financial reason to make a normal feature sound like a problem."

This is the quiet heart of the product. An analysis that earns a fee whenever you book a treatment cannot, in any lasting way, recommend twelve patient weeks of a $40 cream over a $1,200 injection. The recommendation is not forbidden by malice; it is forbidden by arithmetic. Facera can say it because nothing downstream is paying it to say otherwise.

There are two more things it refuses to do, and both are acts of care.

It gives no attractiveness score. "A number out of 100 is easy to share," Puri says, "but it tells you almost nothing about what you're actually seeing or what to do about it." And it never shows you a simulated, improved version of your own face, the image that the industry relies on to turn curiosity into a purchase.

"Our goal is for the report to be useful even when the most useful answer is to wait, try something conservative, or do nothing at all."

## What the machine actually does

"AI is what makes Facera possible," Puri says, and she is precise about how.

From the three photographs, Facera's own facial mapping, developed in house, places hundreds of points across the face and builds a measured picture of what is actually there. That measurement is combined with clinical observation models to produce the educational report. The analysis runs on Google's Gemini API, which reads the images and helps compose the plain-language text. The interface is built in React, and each finished report lives in the user's own account.

The shape of every report is deliberate: observations first, then options and their trade-offs, then the questions worth taking to a licensed provider if you decide to see one. Facera does not diagnose and does not prescribe. It exists to inform a decision, never to make it for you.

A face is among the most intimate data a person can hand over, and Puri treats the handling of it as part of the product rather than a footnote. Photographs are encrypted. A user can delete scans and reports at any time. The company says it never sells facial data and never uses it for advertising. The images sent to Gemini for analysis carry no name, no email address, no account identifier: only the face, and only for as long as the analysis takes.

## The number she will not dress up

Facera is live, and free while it is in beta. Just under 100 people have used it.

Puri says so plainly. "That's an early number, and I won't dress it up as proof that we've solved the whole problem. What matters right now is whether people feel comfortable completing a scan, understand the report, and find it useful enough to inform a real decision."

So the beta is, in large part, a listening exercise. The team asks users which explanations landed, which questions the report left unanswered, and where the experience asked for more trust than it had yet earned.

## What a visit is not

The lesson Puri offers from building Facera is one about trust, and it arrived through the analytics.

Much of the early traffic reached the site through the small browsers that live inside social media apps. There, the path from a post to an account to a completed scan is long, and every step of it costs something.

"A visit was easy to count," she says. "A person feeling ready to upload three photos of their own face was something else entirely."

She could have chased the visits. Instead she took the gap seriously. "People need to understand what the analysis does, what happens to their photos, and what they'll get back. Earning that trust isn't marketing around the technology. For Facera, it's part of making the technology work."

## What comes next

More people in the beta, and more honest accounts of where the report falls short. The work ahead is about clarity: a clearer analysis, a smoother path from the first visit to a finished report, and a better understanding of what people need to know before they sit down across from a provider.

How Facera will one day earn its keep is still an open question, and Puri does not pretend otherwise. The product is free during beta, with no subscription or fee announced. Whatever the model turns out to be, it cannot be a commission on the treatments the report describes. That would quietly undo the very thing that makes the report worth trusting.

For now, the promise is simple, and it is printed on the homepage in six words: "We don't sell treatments. We just tell you what we see."

Facera is free during beta and is at <a href="https://myfacera.com" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">myfacera.com</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, users and results are its own. Facera does not provide medical advice. Building something with AI? [Tell us about it](/submit-your-story).*
