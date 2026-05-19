# SourceForge Warning

> **Adversarial counterpart to [`sourceforge-compliance.md`](sourceforge-compliance.md).**
>
> `sourceforge-compliance.md` describes the maintainers' *intended*
> posture — that [SourceForge.net][sourceforge] is used, if at all, only
> as a secondary push-mirror of the canonical Forgejo source, and that
> no agent runtime is wired to SourceForge surfaces. **This document
> does the opposite.** It assumes a reader who naïvely registers this
> repository as a SourceForge project, mirrors the source there, and
> then attempts to *drive the agent through SourceForge surfaces* — by
> webhooking Ticket events out to off-platform compute, publishing
> agent output to Project Web or the Files release system, treating
> the repository as the agent's memory, or otherwise repurposing the
> SourceForge project as the user-facing layer of an LLM service. It
> then enumerates, surface by surface, the clauses of the
> [SourceForge Terms of Use][sourceforge-tos] and the conventions
> documented in the [SourceForge site documentation][sourceforge-docs]
> that such a deployment would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on a
> SourceForge project they do not fully control.

---

## 0. The headline risks

This repository ships **no SourceForge-specific configuration** — no
project metadata, no Project Web content, no Files release manifest,
no webhook bindings, no Ticket integrations. The agent runtime is
structurally absent from the SourceForge side. The risks in this
document materialise only if a reader *bolts the existing agent loops
onto SourceForge surfaces* and enables them. If you do that, you are
very likely to be in breach of SourceForge's terms in at least the
following ways:

1. **No native CI/CD to translate to.** Unlike github.com or
   GitLab.com, a SourceForge project does not give you a per-project
   job runner. The only way to make the agent "run on SourceForge" is
   to forward events out of SourceForge (over webhooks, polling, or
   email-to-Ticket integrations) into compute you operate elsewhere,
   and post the results back. SourceForge then becomes the *frontend*
   of an off-platform LLM service rather than the platform hosting a
   software project — which is not what a SourceForge project is for.
2. **Files (release downloads) as an output dump.** The Files system is
   a release-distribution channel for the *software hosted in the
   project*. Using it as a publishing surface for agent-generated
   artefacts (rendered "public-fabric" output, K-line snapshots,
   conversation transcripts, periodic memory exports) repurposes a CDN
   intended for software releases as a general-purpose static file
   host.
3. **Project Web as the agent's public surface.** SourceForge's
   per-project web hosting is intended for project pages — homepage,
   documentation, screenshots. Pointing it at the agent's
   `public-fabric/` output and updating it on every commit makes
   Project Web the runtime surface of an autonomous LLM application,
   not the documentation site of a software project.
4. **Tickets / Discussion as a chatbot UI.** Wiring SourceForge
   Tickets or the project's discussion forum to an off-platform LLM
   responder turns the collaboration surfaces of an open-source
   project into an interactive AI service for anyone with a
   SourceForge account.
5. **Repository as agent memory / database.** The agent commits its
   conversation state, `memory.log`, and rendered output back to git
   on every turn. A SourceForge Git repository being written to on
   every inbound Ticket comment is operating Git as a write-heavy
   database rather than as source-code storage.
6. **Mirror-credential blast radius.** A push-mirror that uses a
   SourceForge account password — or a broadly-scoped API token — is
   one leaked secret away from arbitrary writes to every project that
   account controls.
7. **Third-party LLM credentials and PII flowing through SourceForge
   surfaces.** Any deployment that lets SourceForge Tickets reach an
   LLM responder forwards user-supplied Ticket text to a third-party
   inference provider. On a public SourceForge project this is, in
   effect, a public LLM proxy fronted by SourceForge.
8. **The historical bundling memory.** SourceForge's reputation still
   carries the cultural memory of the DevShare era, when third-party
   installer bundling was injected into project downloads. Even though
   that program was discontinued and ownership has changed since, any
   suggestion that this project distributes "wrapped" or
   "agent-augmented" binaries through the Files system reactivates
   that suspicion and damages downstream trust.

The remainder of this document goes through each of these in detail
and points at the specific files in this repository that a reader
would have to wire up to reach the failure mode.

---

## 1. Inventory of source that a reader would wire to SourceForge

There is no SourceForge-targeted code in this repository. The risks
below apply to a hypothetical bolt-on of the following directories to
a SourceForge project:

- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`
  - `forgejo-intelligence-WORKFLOW-AGENT.yml`
  - `forgejo-intelligence-CI.yml`
- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`
  - The agent payload installed by the workflow above, including
    `install/`, `forgejo-intelligence-cron/`,
    `forgejo-intelligence-swarm/`, `forgejo-intelligence-guardrail/`,
    and the per-surface `forgejo-intelligent-*/` directories
    (including `forgejo-intelligent-issue/` and
    `forgejo-intelligent-pull-request/`, whose SourceForge analogues
    would be Tickets and merge-request surfaces).
- `FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
  - The deferred emergency-disable / emergency-kill design (see
    [section 2.4](#24-the-emergency-workflows--destructive-cross-project-automation)).
- `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`
  - The github.com precursors of all of the above, whose policy
    posture is otherwise covered by
    [`github-warning.md`](github-warning.md).

The Forgejo-targeted, github-targeted, and GitLab-targeted runtime
designs are out of scope for this warning in their *own* hosts —
Forgejo coverage lives in [`forgejo-warning.md`](forgejo-warning.md),
github.com coverage lives in [`github-warning.md`](github-warning.md),
GitLab coverage lives in [`gitlab-warning.md`](gitlab-warning.md).
This document is about what happens if any of them is dropped onto
SourceForge.

---

## 2. Detailed infractions if these workflows are wired to SourceForge surfaces

### 2.1 Using SourceForge as the frontend of an off-platform LLM service (most serious)

**Source.** The `run-agent` jobs in `forgejo-intelligence-WORKFLOW-AGENT.yml`
and in the github precursors (`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour after wiring.** Because SourceForge has no per-project
job-runner equivalent to Forgejo Actions, GitHub Actions, or GitLab
CI/CD, the only way to "run the agent on SourceForge" is to:

1. Configure a SourceForge webhook (or a Ticket / Discussion polling
   bridge) that forwards inbound events to a service you operate
   elsewhere.
2. Run the agent on that off-platform compute, sending Ticket text to
   a third-party LLM.
3. Post the model's reply back as a Ticket comment via the SourceForge
   API.

The SourceForge project then exists primarily as the *user-facing
surface* of an LLM service whose compute and storage live elsewhere.

**Clause this likely violates.** The
[SourceForge Terms of Use][sourceforge-tos] and the
[site documentation][sourceforge-docs] describe a SourceForge project
as a place to develop and distribute open-source software. A project
whose Tickets are a chatbot UI, whose Discussion forum is a chatbot
UI, and whose Project Web carries chatbot output is not "developing
and distributing software" — the software has receded into the LLM
behind the wall, and SourceForge is being used to host the social
surface of an unrelated service. Using SourceForge project resources
for a use case other than the development of the project's software is
the pattern those rules exist to forbid.

### 2.2 Ticket-triggered runs on public projects = third-party compute / outbound exposure

**Source.** The same `run-agent` jobs and the issue / merge-request /
pull-request surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour after wiring.** On a *public* SourceForge project, anyone
with a SourceForge account can open Tickets and post comments. A
webhook bridge that forwards every Ticket event to an off-platform LLM
runner turns every drive-by comment into an outbound LLM API call
billed to the project operator. The agent's existing `Authorize` step,
which checks the actor's permission and bails out if it is not
write/maintain/owner, fires only *after* the event has been forwarded
out of SourceForge — the request leaves the platform before the gate
applies.

**Clauses this likely violates.**

1. The [SourceForge Terms of Use][sourceforge-tos] prohibit using
   project resources to impose burdens on or to interfere with the
   normal operation of SourceForge, and prohibit unrelated automated
   activity carried out through project surfaces. A public,
   unauthenticated trigger surface that boots an off-platform LLM
   call per inbound Ticket is a textbook instance of unrelated
   automated activity routed through SourceForge.
2. Forwarding Ticket bodies to an arbitrary inference provider also
   exposes any private data SourceForge users may include in bug
   reports to a third party SourceForge has no relationship with —
   inconsistent with the privacy posture a SourceForge project page
   implicitly advertises.

### 2.3 Project Web used as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and
`publish-public-fabric.yml`.

**Behaviour after wiring.** Translated into a Project Web publish step
(uploading the rendered directory to the project's web host via SFTP
or scp on every push to the default branch), these workflows would
serve a directory called `public-fabric/` from `https://{project}.sourceforge.io/`
or the equivalent project URL. The original header comments are
unambiguous: a live web page powered by the agent's public output,
with "no separate hosting needed." Project Web is deliberately being
used as the substitute for hosting the agent.

**Clause this likely violates.** The
[SourceForge site documentation][sourceforge-docs] describes Project
Web as a place to publish project pages — homepage, documentation,
screenshots, and the like — for the software hosted in the project. A
site whose entire content is generated by an autonomous LLM agent and
updated by an off-platform runner on every commit is not a
project-documentation site — it is an application surface, which is
precisely what [`sourceforge-compliance.md`](sourceforge-compliance.md)
itself acknowledges is **not** an appropriate use of SourceForge
Project Web.

### 2.4 The "Emergency" workflows — destructive cross-project automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and every
  agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour after wiring.** A SourceForge port of the kill workflow
would use a SourceForge API token (or, more dangerously, the
operator's account password) with broad project-admin scope to walk
every project belonging to the controlling account and physically
delete workflow-equivalent files and agent folders from each project's
Git repository. It is gated by deleting a tripwire file in the
controlling project.

**Clauses this likely violates.**

1. The [SourceForge Terms of Use][sourceforge-tos] forbid interfering
   with or disrupting the operation of SourceForge or the use of
   SourceForge by other users. If the controlling account
   co-administers projects with other people, a single tripwire-file
   deletion would silently rewrite code in every sibling project. That
   is interference with other members' service.
2. If any deleted project belongs to a different legal owner (for
   example, a contributor admin who joined for one feature), the
   deletion crosses into the SourceForge ToS prohibition on accessing
   or modifying data without authorisation, depending on consent.
3. SourceForge does not expose finely-scoped per-repository tokens the
   way modern forges do. A "credentials variable" that can perform
   mass deletes across projects is, in practice, the operator's
   primary account credentials — concentrating blast radius in a
   single secret.

The fact that there is a tripwire fail-safe mitigates accidents but
does not change the policy posture — the production code path is
destructive automated bulk modification of other projects on the same
account.

### 2.5 Self-installing / self-upgrading bridges

**Source.** Every `run-install` job under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/install/`,
the corresponding job in `forgejo-intelligence-WORKFLOW-AGENT.yml`, the
github precursors' installer jobs (e.g.
`github-minimum-intelligence-agent.yml`), and the deferred
`*-emergency-agent.yml`.

**Behaviour after wiring.** Because SourceForge has no native runner,
the equivalent of the installer is an *off-platform* job that holds
write access to the SourceForge Git repository, downloads a release
tarball from a remote upstream, extracts it into the project's agent
directory, and `git push`es the result. On upgrade, this job
overwrites its own configuration files inside the repository.

**Clauses / security concerns this raises.**

1. **Supply chain.** A bridge that pulls arbitrary content from a
   remote release and commits it into the SourceForge project on a
   schedule is, by construction, an automated supply-chain ingestion
   path. If the upstream release is ever compromised, the SourceForge
   project auto-upgrades to the compromised version on next dispatch
   — and is then offered to every user who downloads from the
   project's Files page.
2. **Self-replication.** The combination of write-contents +
   downloads-and-commits-from-remote, applied to a project whose
   stated purpose is to *distribute software to other people*, is the
   pattern SourceForge moderation looks at most carefully. Even if
   the maintainers' intent is benign, the *mechanism* matches the
   pattern that abuse enforcement is written to catch.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state)
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file)
- `public-fabric/` (rendered output)

**Clause this likely violates.** The [SourceForge Terms of Use][sourceforge-tos]
expect a project's Git repository to be the source for the software
hosted in that project. Append-only conversation logs that grow per
Ticket comment, and a `union`-merged log file specifically engineered
to absorb high write contention from parallel off-platform runs, are
operating SourceForge's Git hosting as a write-heavy data store. That
is the use pattern those rules are aimed at.

### 2.7 Files (release downloads) as an artefact dump

**Source.** Any output the agent produces that a reader might be
tempted to publish via the SourceForge Files system — for example,
rendered "public-fabric" bundles, periodic memory exports, K-line
snapshots, or `agent-augmented` builds.

**Behaviour after wiring.** A scheduled off-platform job uploads new
files to the project's Files area on every cycle, so the Files page
becomes a rolling output dump for whatever the agent produced today.

**Clauses / risks.**

1. **Files is for software releases.** The
   [SourceForge site documentation][sourceforge-docs] describes Files
   as the release-distribution channel for the project's software.
   Using it as a general-purpose CDN for AI-generated artefacts
   misrepresents what the project is releasing and to whom.
2. **Bundling / wrapping perception.** Anything that looks like an
   "agent-augmented" or "wrapped" binary in the Files area
   reactivates the historical DevShare reputation issue. Even if the
   wrapping is technically benign — say, a launcher that pings an
   inference provider for telemetry — downstream users have learned
   to treat such artefacts as untrustworthy.
3. **Third-party rights.** Publishing model output as downloadable
   files inherits whatever licence and attribution constraints the
   underlying provider's terms impose on generated content. A
   download page that distributes such output without those notices
   pushes the licence problem onto every user who downloads.

### 2.8 Third-party LLM API keys flowing through SourceForge-driven bridges

**Source.** Header comments of the agent workflows; the `Authorize`
and `run-agent` job environments. In a SourceForge bolt-on, the
equivalent values would live as configuration of the off-platform
bridge — but, fatally, they are *triggered* by SourceForge user
input.

**Behaviour after wiring.** The bridge is configured with one or more
of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`,
`GROQ_API_KEY`. Each Ticket-triggered invocation forwards
user-supplied Ticket text to the corresponding provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing
   their API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A public
   SourceForge project whose Tickets are wired straight to your
   `OPENAI_API_KEY` is, in effect, a public LLM proxy. Provider-side
   ToS violations are not SourceForge's problem, but they are
   *yours* the moment you flip the switch.
2. **SourceForge ToU.** Using SourceForge in a way that violates the
   rights of others — including third-party agreements — is
   forbidden. Running someone else's API in violation of their ToS
   via a SourceForge-driven bridge pulls the SourceForge side of the
   operation into that clause too.
3. **PII / data export.** Any contributor's Ticket body — potentially
   including private data in bug reports — is shipped to a
   third-party inference provider. On public projects this needs at
   minimum a clear notice; on internal projects it can be a
   data-handling compliance failure (GDPR, HIPAA, etc., depending on
   the deployment). SourceForge's privacy posture does not
   contemplate Ticket bodies being routed to arbitrary external
   inference providers.

### 2.9 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and the
agent runtime — the SourceForge equivalents would typically set a
generic project-bot author for commits that the *agent itself* (not
any SourceForge service, of which there is none in this picture)
generated.

**Concern.** Attributing AI-authored commits to a bot identity
deliberately hides the LLM as the author. The SourceForge project
page implicitly presents commits as the work of human contributors;
mis-attributing model output to a bot account makes downstream
licence / DCO compliance much harder for anyone who later audits the
repository, and makes the project's claim to "open-source software
developed by contributors" misleading in the SourceForge directory.

### 2.10 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, 2.6, and 2.7 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The whole
point is to use a SourceForge project + Project Web + Files + Git
history together as a free hosting platform for an AI service whose
compute lives off-platform. That is precisely the use pattern the
[SourceForge Terms of Use][sourceforge-tos] exist to prevent, and it is
what would prompt SourceForge's abuse team to suspend the offending
project.

---

## 3. Failure modes that remain even on a self-managed Allura

Running a self-managed [Apache Allura][allura] instance (the
open-source codebase SourceForge is built on) on hardware you own
removes the *terms-of-service* layer (you are your own operator) but
it does not remove the *architectural* risks. Even on a self-managed
Allura instance, the design described in this repo can fail badly if
certain disciplines are not maintained:

1. **No native runner.** Allura still does not provide a per-project
   job runner; the off-platform bridge problem from section 2.1
   persists. Self-hosting Allura does not turn it into a CI/CD
   platform.
2. **Bridge privilege.** The off-platform bridge needs write access to
   the Allura project's repository and Tickets. A compromised LLM
   provider key, a prompt injection through a Ticket body, or an
   inbound webhook can in principle cause the bridge to push
   arbitrary commits — including commits that change the project's
   own configuration. Self-managing Allura does not immunise you
   against this; it just means the blast radius stops at your own
   infrastructure.
3. **Cost runaway.** Self-managed Allura does not charge for project
   resources, but LLM API calls do. A public project + a
   Ticket-triggered bridge on a self-managed Allura is still a
   cost-amplifying surface for whoever owns the LLM key.
4. **Credential sprawl.** Allura does not expose finely-scoped
   per-repository tokens the way modern forges do. The agent design's
   appetite for cross-project automation invites granting broader
   credentials than necessary; on a self-managed instance the only
   thing standing between a leaked secret and every project on the
   instance is your own discipline.
5. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Self-managed disk is
   finite too; the operator must keep a retention policy in place.

These are not SourceForge.net-specific failures; they are properties
of the agent design itself, and they are why
[`sourceforge-compliance.md`](sourceforge-compliance.md) insists that
even a self-managed Allura deployment is *not* the target runtime —
the target runtime is the maintainers' self-hosted Forgejo, where the
governance model described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/) actually applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (after wiring) | Why |
| --- | --- | --- |
| SourceForge ToU — *project resources are for the project's software* | All `run-agent` jobs wired to Tickets / Discussion | SourceForge becomes the frontend of an off-platform LLM service |
| SourceForge ToU — *no interfering with other users* | `*-emergency-trigger-kill.yml` (deferred) | Mass-deletes files in other projects on the same account |
| SourceForge ToU — *no using project resources for unrelated automated activity* | Ticket / Discussion → off-platform LLM bridge | Per-comment outbound LLM calls, billed to the operator |
| Project Web purpose — *project pages, not a stand-alone application backend* | `gmi-public-fabric.yml`, `publish-public-fabric.yml` after wiring | Project Web becomes the agent's public surface, not project docs |
| Files purpose — *release distribution for the project's software* | Off-platform job uploading agent output to Files | Files turned into a CDN for AI-generated artefacts |
| Repository-as-source expectation | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Third-party rights (LLM providers) | LLM-key wiring of the off-platform bridge | Forwards user input to third-party LLM APIs via SourceForge Tickets |
| Credential scope | Cross-project emergency-kill credentials | Mass-write credentials stored where any compromise reaches every project on the account |
| Reputation (DevShare-era bundling) | Any "wrapped" or "agent-augmented" binary in Files | Reactivates downstream distrust of SourceForge downloads |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`sourceforge-compliance.md`](sourceforge-compliance.md) already
says):

- The maintainers state explicitly that the production runtime is the
  maintainers' self-hosted Forgejo, not SourceForge, and that any
  SourceForge mirror is for source redundancy and discoverability
  only.
- This repository contains **no SourceForge-specific configuration**
  and no SourceForge-targeted agent code. The infractions catalogued
  here are conditional on a third party bolting the existing Forgejo
  or GitHub workflows onto SourceForge surfaces and enabling them.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which are
  by name historical or deferred archives being held for reference
  rather than active deployment.
- The historical SourceForge DevShare bundling programme was
  discontinued some years ago and SourceForge has changed ownership
  since. This warning references that history only because the
  cultural memory persists in downstream users' reactions to
  SourceForge downloads, not because the current platform engages in
  that practice.
- Nothing in this repo, on its own, is currently *running* as a
  service on SourceForge infrastructure.

The warning is therefore aimed at:

- Anyone forking this repo, registering a SourceForge project, and
  trying to drive the agent through SourceForge Tickets, Project Web,
  or the Files system via an off-platform bridge.
- Reviewers evaluating whether the design described in this repo is
  appropriate for a SourceForge deployment (it is not — it is
  appropriate only for the maintainers' self-hosted Forgejo runtime
  the project actually targets).

If you are a maintainer or downstream user and you intend to wire
*any* of the `run-agent`, `run-install`, `kill`, or public-fabric
workflows to SourceForge — SourceForge.net or a self-managed Allura
instance — re-read the linked policies first, scope a fresh,
*least-privilege*, single-project credential (never the account
password), and treat Ticket-triggered LLM inference as something that
must move to your own self-hosted Forgejo before going anywhere near
a public SourceForge project.

---

## 6. References

- SourceForge Terms of Use — [`sourceforge-tos`][sourceforge-tos]
- SourceForge site documentation — [`sourceforge-docs`][sourceforge-docs]
- Apache Allura (the open-source codebase SourceForge runs on) —
  [`allura`][allura]
- Existing maintainer posture document —
  [`sourceforge-compliance.md`](sourceforge-compliance.md)
- Sibling counterparts —
  [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`gitlab-compliance.md`](gitlab-compliance.md),
  [`gitlab-warning.md`](gitlab-warning.md),
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md)

[sourceforge]: https://sourceforge.net/
[sourceforge-tos]: https://sourceforge.net/user/main/tos.php
[sourceforge-docs]: https://sourceforge.net/p/forge/documentation/Docs%20Home/
[allura]: https://allura.apache.org/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>
