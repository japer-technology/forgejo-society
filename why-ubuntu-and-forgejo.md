# Why I'm Moving to Ubuntu and Forgejo

*A companion note from the owner of the `japer-technology` GitHub Enterprise Cloud organisation.*

---

## Why this document exists

I have separately set out my position on the suspension of the `japertechnology` business-use account: I have appealed, I have contained, I have corrected the framing, and I would like a fair hearing. That position is about GitHub.

This document is about me.

It is about a parallel decision I am making for my own work, independently of how the appeal turns out: I am standing up a self-hosted **[Forgejo](https://forgejo.org/)** instance on **[Ubuntu Server LTS](https://ubuntu.com/server)** as the primary, durable home for Japer Technology's source code, issues, and CI.

I want to explain that decision in plain language, in the same calm tone as the public plea, and on the record.

---

## What this is not

Before anything else, I want to be precise about what this move is **not**:

- **It is not a boycott.** I am not asking anyone to leave GitHub. I am not "going dark" on GitHub. The `japer-technology` organisation remains in good standing and I intend to keep using it.
- **It is not a campaign.** I am not framing this as a protest, a statement, or a "goodbye to GitHub" post. It is an engineering decision about resilience.
- **It is not a claim of equivalence.** Forgejo is excellent open-source software, but it is not a like-for-like replacement for GitHub. GitHub's product surface — Copilot, the marketplace, Discussions, Sponsors, the network effects of millions of developers — is its own thing. I am not pretending otherwise.
- **It is not a complaint about the suspension.** As I said in the plea: I accept that the Terms of Service permit suspension without prior notice, and I am not asking for procedural relief. The reason I am moving is forward-looking, not retaliatory.
- **It is not contingent on the appeal.** Whether the appeal succeeds or fails, I am doing this. If `japertechnology` is reinstated tomorrow, the Forgejo instance still goes up.

This is an architectural choice, not a grievance.

---

## The lesson I am acting on

I have said elsewhere, in a note addressed to other developers, that independent backups matter: that Section L.3 of the Terms of Service is real, that the 90-day data window is real, and that whatever you build on this platform should be built so that the loss of any one account is recoverable. That is not paranoia; it is engineering resilience.

I wrote that sincerely, and I have to act on it sincerely. It would be incoherent to publicly tell other developers to build for resilience and then leave my own setup in the same single-provider posture that made the suspension feel as disorienting as it did.

So this is me taking my own advice. The point of the move is not "instead of GitHub." The point is "in addition to GitHub, under my own control, on my own hardware, recoverable by me."

---

## Why Ubuntu

I considered several Linux distributions. I am picking **Ubuntu Server LTS** because it is, deliberately, the boring choice:

- **Long-term support.** Five years of standard support per LTS release, with the option to extend further. For a Git forge that I want to forget about for years at a time, that horizon matters more than novelty.
- **Predictable, well-documented, well-trodden.** Forgejo, container runtimes, reverse proxies, backup tooling, monitoring agents — everything I need has first-class instructions for Ubuntu. When something breaks at 02:00, I want the search results to be obvious.
- **Sensible defaults.** Unattended security upgrades, AppArmor, UFW, systemd, journald — the basics are already there and configured the way most operators expect.
- **Hardware-agnostic.** It runs equally well on a small VPS, a home server, a NUC, or a cloud instance. That flexibility matters because the *point* of this exercise is not to be tied to one provider's environment.
- **Familiarity.** I already operate Ubuntu. Choosing the OS I know best minimises the chance that I introduce a security or availability problem through unfamiliarity.

Ubuntu is not the most interesting answer. It is the answer least likely to surprise me. For infrastructure that has to *just keep working*, that is the right tradeoff.

---

## Why Forgejo

For the forge itself, I am picking **Forgejo**. The reasoning, in order of importance to me:

### 1. It is genuinely community-governed and copyleft

Forgejo is a [Codeberg e.V.](https://codeberg.org/) project, [licensed GPLv3+](https://codeberg.org/forgejo/forgejo) (with AGPLv3+ for newer code), and developed in the open by a community of contributors rather than a single company. The whole reason I am doing this is to reduce single-point-of-control risk over my own work. Picking a forge whose own governance reduces that risk is consistent.

### 2. It is a Git forge, not a reinvention

Forgejo is "Git, with a web UI and the surrounding bits a small team needs": repositories, issues, pull/merge requests, wikis, releases, an API, webhooks, and a CI runner system ([Forgejo Actions](https://forgejo.org/docs/latest/user/actions/)) that is broadly compatible with the GitHub Actions workflow syntax. That last point matters practically — it means the workflows I have already written for GitHub are mostly portable, and I am not locking myself into a third bespoke CI dialect.

### 3. The data is mine, in formats I understand

Repositories are bare Git repositories on disk. Issues, users, and metadata live in a standard relational database. Attachments live in a directory or in object storage I control. I can `tar` it, I can `rsync` it, I can restore it on another machine in an afternoon. There is no proprietary export format and no vendor in the loop.

### 4. It is operationally small enough for one person

Forgejo runs as a single binary or a single container, with modest resource requirements. It is realistic for one developer to operate it, patch it, back it up, and monitor it without a platform team. That fits the size of Japer Technology honestly.

### 5. It coexists cleanly with GitHub

Git is distributed by design. The same repository can have `origin` pointing at GitHub and a second remote pointing at Forgejo, with mirror pushes in either direction. I do not have to choose. The Forgejo instance can be the durable copy of record while GitHub remains the public collaboration surface — or vice versa, or both, depending on the project.

I considered other options (notably Gitea, GitLab CE, and just-bare-Git over SSH). Gitea is excellent, and Forgejo is its community-governed soft fork; the governance argument tipped me to Forgejo. GitLab CE is more capable but materially heavier to operate solo. Bare Git over SSH is the most minimal answer but gives up issues, CI, and a UI — the things I actually use.

---

## What this looks like in practice

I am not going to describe the specific deployment in detail in a public document, for the obvious operational reasons. In broad strokes, the intent is:

- An Ubuntu Server LTS host I control, running a current Forgejo release.
- HTTPS via a standard reverse proxy and an automated certificate.
- Off-host, encrypted backups of the Git data, the database, and the attachments, on a regular schedule, with restore tested.
- A small number of self-hosted runners for CI, scoped narrowly and configured according to the same guardrail patterns I have committed to elsewhere: least-privilege tokens, no arbitrary network egress from runners, allowlisted tools, and human review before anything merges.
- Mirroring between Forgejo and the relevant GitHub repositories where it is useful, so the two stay in sync rather than diverging.
- Clear separation between *Japer Technology business code* (which moves to Forgejo as the primary home) and *public open-source projects and analyses* (which continue to live happily on GitHub).

Nothing here is novel. It is a standard small-shop self-hosted forge setup, deliberately so.

---

## What this does *not* change about my relationship with GitHub

To be unambiguous:

- The `japer-technology` GitHub organisation stays. The repositories there stay. My remediation commitments — read-only-by-default agent permissions, no direct pushes to `main`, rate limits, tool allowlisting, network restrictions, scope limited to the Additional Product Terms for Actions — all stand.
- I am still a paying Enterprise Cloud customer. I still want the `japertechnology` business-use account reinstated. I still want a conversation. I still want to do this properly on the platform.
- Public collaboration on open work continues to make sense on GitHub. That is where the developers are, and I respect that.

Standing up Forgejo is about making sure that the loss of any one account, on any one platform — including this one — is recoverable. That is engineering resilience. The plea and the move are not in tension. They come from the same place: a developer trying to behave responsibly on platforms he depends on.

---

## A note to other developers

If you are reading this because you are also a developer thinking about your own resilience posture, two thoughts:

1. **Do not move in anger.** A migration done because you are upset is a migration done badly. Whatever you set up in that mood will be operated in that mood, and it will hurt you later. Wait until the decision is boring.
2. **Mirror, don't migrate, first.** The cheapest, lowest-risk first step is *additive*, not *substitutive*: get a second copy of your important repositories somewhere you control, on hardware or a VPS you pay for directly, with backups you have actually restored once. You do not need to leave anywhere to do that. You just need to stop being one account away from a bad day.

That is what I am doing. It is not dramatic. It is just overdue.

---

## Closing

I am moving Japer Technology's source-of-truth onto Ubuntu and Forgejo because the suspension reminded me, in a way I cannot un-learn, that any single platform — however good, however well-intentioned, however much I like using it — is a single point of failure for work I care about. The right response to that lesson is not to leave GitHub. The right response is to make sure I can survive being parted from it.

The appeal still stands. So does my preference, all things being equal, to keep building on GitHub. This document just says, plainly, what I am doing in parallel so that the answer to "what happens if the platform says no?" is no longer "I find out the hard way."

— The owner of `japer-technology`: Eric Mourant

---

*This document represents my personal position. It is not a legal claim, a demand, or a campaign. It is an engineering note about resilience, written to sit on the public record alongside the other analysis documents in this repository.*
