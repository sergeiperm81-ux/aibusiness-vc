---
title: "He Sold His Last Company to Swisscom. Now He Wants to Move a Million Pages Off WordPress"
description: "Alexander Spahn built ShiftPress so the people who own websites but do not have a developer can change them by typing a sentence. Two months in, more than 100 sites have moved, and load times drop from four to six seconds to under one."
date: "2026-09-02"
author: ""
category: "Startups"
image: "/images/articles/laptop-work-1.jpg"
keywords: ["ShiftPress", "Alexander Spahn", "WordPress alternative", "AI website editor", "migrate off WordPress", "static site hosting", "AI website builder", "Claude agent website"]
---

*Partner Story · in conversation with ShiftPress. This is a written interview submitted through [Submit Your Story](/submit-your-story). The claims below are the founder's own, presented as they were given to us. No payment was involved.*

<img src="/images/articles/alexander-spahn-shiftpress.jpg" alt="Alexander Spahn, co-founder of ShiftPress" style="width:100%;max-width:380px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Alexander Spahn, co-founder of ShiftPress. Photo: courtesy of the founder.*

There is a particular kind of business owner who has been quietly paying for the same problem for a decade.

They have a website. It works, mostly. It was built years ago by an agency or a freelancer or a nephew, and it runs on WordPress. And when they want to change one sentence on the homepage, they cannot. They open a ticket, or they message a developer who may reply tomorrow, or they log into an editor that fights them for twenty minutes over a paragraph break.

That person is the customer <a href="https://shiftpress.ai" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">ShiftPress</a> was built for, and Alexander Spahn is unusually well placed to build it.

## The founder who has done this before

Spahn is a father of two daughters and, by his own description, a serial entrepreneur who likes taking products from zero to one.

The record backs that up. He co-founded Veertly in 2020, a platform for virtual and hybrid events that raised CHF 2 million in seed funding from investors including coparion and Ronald Straessler, co-founder of the Swiss banking software company Avaloq. Veertly served clients in more than twenty countries and was acquired by Swisscom Broadcast in December 2023. Before that he worked at Deloitte.

So when he says he wants to move a million pages off WordPress by 2030, it comes from someone who has already built a company through funding and out the other side into an exit.

After the Veertly acquisition, Spahn founded CSR Tools, a sustainability reporting business, and MaterialityMaster, a software platform for double materiality assessments. While running it, the team moved their own websites off WordPress onto fast static code and started editing them with Claude. That turned out to be an eye-opening experience: sites got dramatically faster, and making changes became as simple as asking. ShiftPress grew out of wanting to open that up to everyone.

## The problem, stated plainly

"Most businesses, agencies and solo operators are stuck on WordPress or other content management systems," Spahn says. "It's slow, it breaks, it needs plugins and updates and someone technical on call."

The consequence is the bit that costs money. When the owner wants to change a sentence or add a page, they either wait on a developer or wrestle with a clunky editor. Both are expensive: one in invoices, the other in hours that the owner of a small business does not have.

"It matters now because the people who own these sites are exactly the ones who don't have a developer, and AI is finally good enough to be that developer for them."

## What actually happens

ShiftPress does two things in sequence, and the order is the product.

First it takes the existing site and migrates it as it is onto modern static hosting, so it loads fast and stops breaking. Nothing gets redesigned, nothing gets thrown away, and the company says rankings are preserved through automatic 301 redirects.

Then it hands the owner a chat box.

"Make the hero shorter." "Add a pricing page." "Translate this into German." They describe the change, and the site changes.

## The AI is the editor, not a wrapper

This is where Spahn draws the line between his product and the category it will be lumped into.

"It's not a template picker dressed up as AI."

Under the chat box runs an agent built on Anthropic's Claude models, chosen per task, with direct read and write access to the actual code of the site. It runs in a durable server-side session, so a long edit survives a page refresh. The agent reads the real page files, plans the change, edits the code, and commits it through the same review and publish gate a human edit would pass through.

The example he gives is the one that separates a real code agent from a text box. A site-wide change, a header, a footer, an announcement bar, is handled by the agent marking the shared block, after which ShiftPress's own code fans that single edit out to every page deterministically. A site-wide change cannot half land.

There is also a Plan Mode, where the agent reads the site and writes down exactly what it would do, changing nothing, until the owner approves. The same agent powers the migration cleanup, blog drafting, internal link suggestions and SEO work.

## Migrating the site you already have

The competitive distinction is worth stating carefully, because the market is crowded with things that sound similar.

"Most AI website tools generate a brand new site from a prompt. We take the site you already have, make it fast, and give you an AI that understands and edits it."

For a business with years of pages, accumulated rankings and a design someone was paid for, those are very different offers. One asks you to abandon your asset. The other asks you to keep it and make it faster.

## The numbers, and where they come from

ShiftPress launched in July 2026. By Spahn's account more than 100 websites have been migrated since.

The immediate win he points to is speed. Sites typically go from four to six second WordPress load times to under one second on static hosting, with PageSpeed and Core Web Vitals scores moving from the red and orange range into the nineties. Several migrated sites, he says, have seen rankings and search impressions climb in the weeks after moving, which is what you would expect if Google rewards fast, stable pages.

Those figures are the company's own. What is independently checkable is that the product ships what it sells: shiftpress.ai and its blog pages returned in roughly two to three tenths of a second when we loaded them, which is the behaviour a company selling speed ought to demonstrate on its own site.

Pricing is published in full, which is rarer than it should be. A free tier at zero, Start at €8 a month, Smart at €20, Growth at €50, and a custom Pro tier for agencies, with the plans differing on AI changes per month, number of sites, languages and team seats. Migration is €149 one time for a small site, €299 for medium, €599 for large, and free with any yearly plan. Extra AI changes beyond the plan are €39 each. A free preview shows the owner their new homepage within 24 hours before they commit to anything.

## The lesson: an AI that said it had saved

Asked what building this taught him, Spahn does not reach for a capability story. He tells one about honesty, and it is the best answer we have had to that question.

"Early on, the AI would occasionally tell the user it had saved a change when it actually hadn't committed anything. The edit sounded done, the chat was confident, and the file was untouched."

Consider what that means for the customer. Their live business website, the page a client is looking at right now, and a confident assistant reporting a change that never happened.

"That taught us that with an AI that touches someone's live website, being impressive matters far less than being honest."

What they did about it is the part worth copying. The database became the source of truth for whether something actually happened, not the chatbot's own reply. Long jobs were made durable so they survive a refresh. And the agent is now required to say "I changed nothing" when it changed nothing, rather than narrate a success.

"A confident but wrong AI editing your business's website is worse than no AI at all. Everything we've built since is designed so the user can always see what really changed."

That sentence is a better statement of AI product discipline than most published frameworks manage, and it came out of a bug.

## What is next

The last stretch went into everything that happens after the migration, and the list is long: editing the whole site by chat, a Blog Autopilot that researches keywords and drafts articles, automatic internal linking and GEO/AEO, a lead inbox with editable forms, meeting booking, an AI chat widget for visitors, and adding languages.

"The product is deep. Now the job is to scale it."

Two groups interest him. Businesses and freelancers who want off WordPress without losing the site they have built. And above all agencies, who can move whole batches of client sites and run them from one place, which is the route to volume in a market where the sites are numerous and each owner is small.

The mission stays the same, and it is pleasingly concrete for a company two months old: a million pages off WordPress by 2030.

ShiftPress is at <a href="https://shiftpress.ai" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">shiftpress.ai</a>, and migrations start free at <a href="https://shiftpress.ai/migrate" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">shiftpress.ai/migrate</a>.

---

*This is a Partner Story: a written interview with a company building with AI, submitted through [Submit Your Story](/submit-your-story) and published free of charge. Statements about the company's product, customers and results are its own. Building something with AI? [Tell us about it](/submit-your-story).*
