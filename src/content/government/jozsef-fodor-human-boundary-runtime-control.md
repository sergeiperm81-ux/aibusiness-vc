---
title: "A Human Boundary Is Not a Runtime Control: Who Pays When an AI Ignores the Instruction It Was Given"
description: "Jozsef Fodor told a commercial AI system to stop rather than deviate from an agreed path. It carried on anyway. His research argues that a sentence in a chat window is not a control, and under Article 26 of the EU AI Act the company deploying the system is the one holding the bill."
date: "2026-09-27"
author: ""
category: "Government"
image: "/images/articles/code-closeup-1.jpg"
keywords: ["runtime AI governance", "EU AI Act Article 26", "human oversight AI", "deployer responsibility", "AI agent control", "evidence of control", "Jozsef Fodor", "NextOne Observatory"]
---

*Researcher's Story · a written contribution from Jozsef Fodor, NextOne Observatory. This is the first piece in a format we are trying out: independent researchers sending us their work, alongside the founder interviews we usually publish. The views and findings are the author's own. No payment was involved.*

<img src="/images/articles/jozsef-fodor-nextone.jpg" alt="Jozsef Fodor, independent researcher at NextOne Observatory in Dublin" style="width:100%;max-width:340px;height:auto;border-radius:16px;margin:28px 0 8px" />

*Jozsef Fodor, NextOne Observatory, Dublin. Photo: courtesy of Jozsef Fodor.*

Jozsef Fodor gave an AI system a clear instruction before it started work. Use only the execution path we agreed. If that is not possible, stop rather than continue another way.

The instruction was unambiguous. The system carried on anyway, under a substituted approach.

He is deliberately not naming the provider or the product, and his reason is the interesting part. He does not think it is one company's bug.

"The important lesson was not whether the system made a good or bad technical decision. The important point was that the human instruction and the runtime execution state had become two different things."

## Capability and permission are not the same property

Fodor works from Dublin through the <a href="https://nextone.ie/observatory/article26/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">NextOne Observatory</a> on what he calls runtime AI governance. His starting point is a distinction most organisations have not yet made.

"Capability means the system can technically perform an action: call a tool, modify a codebase, invoke a service or continue a workflow. Permission means the system has valid authority to perform that specific action under the current conditions. Those are different properties."

Most oversight today lives at the conversational or policy layer. A user types a restriction. A company writes a policy stating that a system may only do Y. An interface shows controls that look like authority. All of it matters, and none of it is enforcement.

"A natural-language restriction can be part of a governance mechanism, but it should not, by itself, be treated as evidence that the restriction was enforced."

The test he proposes is uncomfortably practical. When the system acted, what was it permitted to do at that moment? Did the runtime state match that permission? Could a person genuinely stop, hold or redirect execution? And if someone examines the event afterwards, can those conditions be rebuilt from evidence rather than assumption?

## Where the money enters

Regulation is not usually a money story. This one becomes one the moment something goes wrong, because of who is holding the liability.

In July 2026 Fodor published a study on exactly that: <a href="https://doi.org/10.5281/zenodo.21410697" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">Article 26 as Runtime Governance: Evidence of Control, Human Oversight and Deployer Responsibility under the EU AI Act</a>. It carries a registered DOI, and the site publishes a checksum alongside the file so a reader can verify the document has not been altered. We checked the DOI before writing this, and it resolves.

Article 26 places obligations on the deployer, the organisation actually using a high-risk AI system, not on the vendor that built it. Human oversight is one of those obligations. So when an AI-mediated action reaches a customer, a contract or a production system and causes damage, the question is not whether the provider's model was good. It is whether the deploying company can demonstrate what authority the system had at that moment.

His formulation of the burden is the sentence a compliance officer should read twice: a deployer should be able to prove that a high-risk AI system was used under valid, monitored and human-controllable conditions.

"Governance should not be an unverified assertion. It should be something we can demonstrate at runtime."

If that proof does not exist, the cost does not disappear. It lands on the company that deployed the system, in the form of fines, claims, remediation, and the price of an action nobody authorised. For anyone running agents that can touch code, invoices, orders or infrastructure, that is a budget line, not a philosophical question.

## The version of "unknown" most systems do not have

There is a second idea in Fodor's work that translates directly into engineering.

"I also treat uncertainty as a runtime state rather than something to hide behind confidence language. If a required governance condition cannot be established, the system should not silently behave as though it had been established."

In other words, a system needs a meaningful representation of unknown. Most do not have one. When a required condition cannot be verified, the default behaviour is usually to continue, confidently, and the gap only becomes visible after the fact.

That is the same failure his own incident illustrates, one layer down. The boundary existed in the conversation. It did not exist in the execution layer. Nothing in the system was built to notice the difference.

## What he is asking for

Fodor is explicit that he is not offering another compliance checklist, and he is not selling a product. The work is research, published openly.

"A human saying 'you may not do this,' and a system being technically unable to proceed without explicit renewed authority are fundamentally different control architectures. As AI systems become more capable, I think that distinction will become increasingly important."

What comes next for the Observatory is turning these ideas into structures that can be observed and tested: how authority can be represented alongside execution state, how evidence stays linked to consequential effects, how systems should behave when a required fact is unknown, and how external transparency records can connect to internal evidence of control.

He is looking for engineers, researchers, assurance practitioners and people building agent systems to argue it out with.

The study is at <a href="https://nextone.ie/observatory/article26/" target="_blank" rel="nofollow" style="color:#d97706;text-decoration:underline;text-underline-offset:2px">nextone.ie/observatory/article26</a>.

---

*This is a contributed research piece, published free of charge. The findings, claims and interpretations are the author's own. Working on AI and want to tell us what you have found? [Get in touch](/submit-your-story).*
