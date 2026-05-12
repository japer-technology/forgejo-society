# A Public Plea for a Fair Hearing

*An open statement from the owner of the `japer-technology` GitHub Enterprise Cloud organisation regarding the suspension of the business-use GitHub account `japertechnology`.*

---

## Why this document exists

The GitHub account I use for Japer Technology business activity, `japertechnology`, has been suspended. The notice referenced the Terms of Service generally rather than identifying a specific clause, which has made it harder for me to address the concern as precisely as I would like. I have submitted an appeal through the standard channel and am awaiting review.

I am writing this in the open — in a public repository inside the `japer-technology` organisation, which itself remains in good standing — because I want my position on the record alongside that appeal. My intent is simply to ask, in plain language, for a fair hearing.

If a GitHub policy reviewer reads this, I hope it helps you understand who I am, what I was actually trying to do, what I have already done to fix it, and why I believe reinstatement — possibly with conditions — would be a proportionate outcome.

If anyone else reads this, I hope it stands as an honest account of one developer's experience working through the appeal process.

---

## Who I am

I am an independent developer and the owner of Japer Technology. The `japer-technology` organisation is a small Enterprise Cloud account with three members: the suspended business-use account (`japertechnology`), my private GitHub account (`ericmourant`), and `polgov1`, a director of Japer Technology. The organisation itself has not been suspended. The other members remain active and in good standing. The action taken was specifically and narrowly against the `japertechnology` account.

To avoid any misunderstanding, I am not using `ericmourant` or asking `polgov1` to bypass the suspension or continue the suspended activity. Any actions by active organisation members are limited to legitimate containment, preservation, administration, and appeal support.

I have been a paying GitHub customer. I chose Enterprise Cloud because I take the platform seriously and wanted to use it properly. I am not a bad actor, I am not running spam, I am not running malware, and I am not engaged in inauthentic activity. I am a developer who builds things on GitHub because I believe in GitHub.

---

## What I was actually doing

The project that I believe drew attention is `github-minimum-intelligence` ("GMI") — a repository-development tool that uses GitHub Issues as the interaction surface, GitHub Actions as the execution layer, and Git as persistent memory. It uses only documented, publicly supported GitHub APIs and features. It exists to help maintain, test, document, and propose changes to a repository — the same category of work that GitHub itself now ships as a commercial product through **Copilot Coding Agent** and **GitHub Agentic Workflows**.

That is the substance of the project. I want to be honest about two things that I believe, in retrospect, made it look like something more concerning than it was:

### 1. The framing was too broad

Some of my public repository descriptions used language like *"GitHub as Infrastructure,"* *"GitHub is the runtime,"* and *"execution fabric."* I understand now how that reads to a policy reviewer. The Additional Product Terms for Actions are clear that Actions is for the development, testing, deployment, and publication of the software project associated with the repository — not as a general-purpose compute or serverless platform. My language overshot. It described an aspiration in terms that sounded like platformising Actions beyond its permitted scope. That was a framing mistake on my part, not a description of what the code actually does.

### 2. The agent was high-powered without enough guardrails

The public workflow requested broad write permissions (`contents: write`, `issues: write`, `actions: write`), allowed arbitrary bash execution, and pushed directly to `main`. The intent was experimentation. The effect was a configuration that did not match the cautious, guardrailed pattern that GitHub's own agentic-workflows guidance now defines (read-only defaults, safe outputs for writes, sandboxing, allowlisting, human review). I understand why a system that looks like that, running at scale, would be flagged.

I am not pretending those choices were ideal. They were not. I own them.

---

## What I am not saying

I want to be precise about what I am **not** claiming, because credibility matters here:

- **I am not claiming any procedural unfairness.** The Terms of Service permit suspension without prior notice, and I accept that. I am asking for reconsideration on the merits, not on procedure.
- **I am not claiming I was singled out.** I accept that my framing and my agent's configuration could reasonably have looked concerning from the outside, and I want to explain that the underlying activity was legitimate and is now contained.
- **I am not drawing any comparison or equivalence between my project and GitHub's own products.** I mention the broader architectural category only to note that the pattern is now well understood, that my implementation lacked the guardrails GitHub's own published guidance recommends, and that I have already brought it into line with that guidance.
- **I am not minimising any operational impact.** If my workflows placed unwanted load on GitHub's infrastructure, I take responsibility for that. GitHub is best placed to judge that impact, and I accept its assessment.
- **I am not asking anyone to apply pressure on my behalf.** I am stating my position publicly so that it is clearly on the record alongside my appeal. I am not calling for boycotts, brigades, or campaigns, and I would ask anyone reading this not to do so on my behalf.

---

## What has already been done

Containment is not a promise. It is the foundation on which any reinstatement request must stand. The remaining organisation members have already taken the following actions:

- **Automated workflows have been disabled** across the affected repositories.
- **All API secrets and tokens** that ever touched the relevant workflows **have been rotated**.
- **Public framing has been corrected.** Language describing the project as *"GitHub as infrastructure,"* *"the runtime,"* *"execution fabric,"* or *"runnable infrastructure units"* is being removed from all public-facing materials. The project is being re-described, accurately, as repository-development automation.
- **Non-essential repositories are being archived** (read-only, transparent — not hidden) to reduce the public surface while review is pending.
- **Organisation ownership has been verified** to ensure the org cannot be locked out while the `japertechnology` account is suspended.
- **Account data preservation** has been initiated within the 90-day window described in Section L.2 of the Terms of Service.

If reinstated, I will additionally commit to:

- **Read-only-by-default permissions** on all agent workflows, with writes performed via pull requests requiring human review.
- **No direct pushes to `main`.** All changes through branch protection and CODEOWNERS review.
- **Rate limits** on API calls and workflow triggers, sized to be a small fraction of any reasonable per-account budget.
- **Tool allowlisting** instead of arbitrary bash execution.
- **Network restrictions** on agent runners.
- **Scope limited explicitly** to the development, testing, documentation, and maintenance of the repositories the agent is configured for — i.e., the scope permitted by the Additional Product Terms for Actions.

These are not future promises in lieu of action. The org-level containment is already done. No agent workflow will run again from any account unless the guardrails are in place and the activity is clearly permitted.

---

## The proportionality argument

GitHub's Appeal and Reinstatement policy explicitly contemplates outcomes other than a binary keep-or-reverse. It allows a decision to be modified where a lesser severity of action is more appropriate. I would respectfully draw attention to several facts that I believe support a proportionate outcome:

1. **The action was already proportionate at the org level.** GitHub suspended one user account. It did not suspend the organisation, the other members, or the repositories. I read that pattern as a careful, account-level assessment, and I am grateful for it.
2. **The architectural category is well established.** AI agents triggered by Issues, executing in Actions, and proposing changes to repositories with human review before merge is a recognised pattern, and GitHub has published clear guidance on how to do it safely. My earlier implementation did not follow that guidance closely enough; the corrected version does.
3. **Remediation is complete or in progress, not hypothetical.** The unsuspended members have done the containment. The framing has been corrected. The technical guardrails are defined and ready to deploy.
4. **The customer relationship is Enterprise Cloud, paid, and in good standing on the org side.** This is not a throwaway account. I have a long-term commitment to using this platform properly.

The proportionate outcome, as I see it, would be reinstatement of the one user account — with conditions if appropriate, with a probationary period if appropriate, or with a requirement to demonstrate the guardrails are in place before any agent workflow is enabled again. I would welcome any of those.

---

## What I am asking for

In order, in plain language:

1. **Communication.** If it is possible to share which specific policy area is at issue, that would help me address it precisely and in good faith.
2. **Review.** Please consider the appeal I have already submitted alongside the remediation that has already been done.
3. **A proportionate decision.** Reinstatement, with conditions if appropriate. If the answer is no, I would respectfully ask for the secondary review path that the Appeal and Reinstatement policy already provides.
4. **A path forward.** If there are specific changes I should make to the project, the workflows, the public framing, or my conduct as a customer, I would genuinely like to know what they are. I would much rather change my project than lose my account.

---

## A note on tone

I am writing this calmly and on purpose. Suspension is a disorienting experience for any developer, and I want to be clear that I am not approaching this as a grievance. I believe the right way to ask for a fair hearing is to behave like someone who is genuinely seeking one, in good faith and with respect for the people on the other side of the process. That is what I am trying to do here.

---

## A note to other developers

If you are reading this because you are also a developer building on GitHub, I want to leave one thought:

**Keep independent backups.** Section L.3 of the Terms of Service is real. The 90-day data window is real. Whatever you build on this platform, build it so that the loss of any one account is recoverable. That is not paranoia. It is engineering resilience. I wish I had taken it more seriously sooner. Please learn from that, even if nothing else here applies to you.

And if your work touches GitHub Actions in ways that go beyond ordinary CI/CD: read the Additional Product Terms carefully, watch your framing, and adopt the guardrail patterns that GitHub's own agentic-workflows guidance recommends. The platform direction is clear. Build with it, not around it.

---

## Closing

I am one developer. I made some framing mistakes. I built an agent that was too powerful and not guardrailed enough. I have taken responsibility for that, contained it, and am ready to do whatever is needed to bring the work fully inside the boundaries the platform sets.

I would like to be reinstated. I would like a conversation. I would like a chance to do this properly.

I am writing this publicly so that my position is clearly on the record alongside my appeal. If you are at GitHub and you are reading this: thank you for the time. I am ready whenever you are.

— The owner of `japer-technology`

---

*This document represents my personal position. It is not a legal claim, a demand, or a campaign. It is a request for a fair hearing through GitHub's own published processes. Related context is available in this repository's other analysis documents.*
