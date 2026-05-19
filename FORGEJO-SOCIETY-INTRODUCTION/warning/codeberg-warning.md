# Codeberg Warning

> **Adversarial counterpart to [`codeberg-compliance.md`](codeberg-compliance.md).**
>
> `codeberg-compliance.md` describes the maintainers' *intended*
> posture — that Codeberg is used only as a source mirror of the
> canonical self-hosted Forgejo, and that no agent runtime is
> deployed onto Codeberg's Woodpecker CI, Codeberg's Forgejo Actions
> surface, or Codeberg Pages. **This document does the opposite.**
> It assumes a reader who sees that Codeberg runs Forgejo, notices
> that this repository already ships `.forgejo/workflows/`, and
> concludes that "we can just turn them on" against a Codeberg
> repository — either by enabling Codeberg's Woodpecker CI on the
> mirror, by attaching a self-registered Forgejo Actions runner to a
> Codeberg repository, or by porting the agent payload into a
> Codeberg-hosted Pages site. It then enumerates, feature by feature,
> the clauses of the [Codeberg Terms of Use][codeberg-tos], the
> ["What Codeberg is" / "is not"][codeberg-not] policy, and the
> [Codeberg CI documentation][codeberg-ci] that such a deployment
> would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on Codeberg
> or on a shared Forgejo instance they do not own.

---

## 0. The headline risks

This repository ships no Codeberg-targeted CI configuration: no
`.woodpecker.yml`, no Codeberg-specific Forgejo Actions workflows
distinct from the self-hosted set, and no Codeberg runner
registration. The agent runtime is structurally absent from the
Codeberg side. The risks in this document materialise only if a
reader **enables CI on the Codeberg mirror** — either Woodpecker, or
Forgejo Actions with a runner attached to the Codeberg repository —
and lets the workflows under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` (or their
github precursors under
`FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`) run as designed.
If you do that, you are very likely to be in breach of Codeberg's
terms in at least the following ways:

1. **Codeberg CI misuse.** The agent uses CI runners as a
   general-purpose LLM chatbot backend triggered by issue or
   pull-request events. That is not "building, testing, or packaging
   the project's own software" — which is the only thing Codeberg's
   Woodpecker CI policy and Codeberg's Forgejo Actions guidance
   permit shared CI to be used for.
2. **Codeberg Pages misuse.** Deploying the `gmi-public-fabric.yml`
   or `publish-public-fabric.yml` publishers (or their Forgejo
   equivalents) onto a Codeberg Pages branch would publish
   AI-generated output as a Pages site whose content is the *product*
   of the agent, not documentation for source code. That is using
   Pages as a stand-alone application backend, which the
   ["What Codeberg is" / "is not"][codeberg-not] page explicitly
   rules out.
3. **Repository as agent memory / database.** The agent commits its
   conversation memory, session state, and "fabric" output back to
   git on every turn, using the repo as a database / message log
   rather than as source-code storage. The
   [Codeberg Terms of Use][codeberg-tos] limit Codeberg to free /
   open-source software development; an append-only conversation log
   committed at the rate of inbound issue comments is not that.
4. **Self-installing / self-upgrading workflows.** The installer
   jobs request write access to repository contents and to workflow
   configuration in order to download workflow YAML from a remote
   source and commit it back into the calling repository. A pipeline
   that installs and upgrades pipelines on the same repository is,
   functionally, self-replicating code.
5. **Resource abuse on public Codeberg repositories.** An
   issue-comment-triggered LLM loop on a public Codeberg repository
   turns every drive-by comment into Woodpecker agent time (or
   Forgejo Actions runner time) and outbound LLM API calls. Codeberg
   is operated as a non-profit public good; consumption of its CI
   capacity by anonymous third parties for purposes unrelated to
   building the project's software is exactly what the Codeberg CI
   policy is written to prevent.
6. **Federation amplification.** The agent emits commits, releases,
   and (in some configurations) issue events that are visible to
   Codeberg's ActivityPub federation peers. Wiring an LLM into that
   loop means inbound issue text from any federated peer can drive
   outbound LLM calls *and* outbound federated activity, multiplying
   the load on Codeberg's federation surface for content that has
   nothing to do with software development.
7. **Third-party LLM credentials and PII flowing through Codeberg
   CI secrets.** The workflows are designed to be configured with
   `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc., and to forward
   arbitrary user-supplied issue text to those providers. A
   maintainer who enables this on a public Codeberg repository is
   implicitly running a free LLM proxy on Codeberg infrastructure.

The remainder of this document goes through each of these in detail
and points at the specific files in this repository that a reader
would have to enable to reach the failure mode.

---

## 1. Inventory of source that a reader would enable on Codeberg

There is no Codeberg-targeted code in this repository. The risks
below apply if the existing workflows are enabled as-is on the
Codeberg mirror — Codeberg understands Forgejo Actions, so the
`.forgejo/workflows/` files would be picked up by any attached
runner without modification — or if their github precursors are
ported into a `.woodpecker.yml`:

- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`
  - `forgejo-intelligence-WORKFLOW-AGENT.yml`
  - `forgejo-intelligence-CI.yml`
- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`
  - The agent payload installed by the workflow above, including
    `install/`, `forgejo-intelligence-cron/`,
    `forgejo-intelligence-swarm/`, `forgejo-intelligence-guardrail/`,
    and the per-surface `forgejo-intelligent-*/` directories.
- `FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
  - The deferred emergency-disable / emergency-kill design (see
    [section 2.4](#24-the-emergency-workflows--destructive-cross-repository-automation)).
- `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`
  - The github.com precursors of all of the above, whose policy
    posture is otherwise covered by
    [`github-warning.md`](github-warning.md).

The Forgejo-targeted runtime design as a whole is out of scope for
this warning on its *own* host (the maintainers' self-hosted
Forgejo) — that coverage lives in
[`forgejo-warning.md`](forgejo-warning.md). This document is about
what happens if those same workflows are enabled on Codeberg, which
runs Forgejo but is not the project's runtime.

---

## 2. Detailed infractions if these workflows are enabled on Codeberg

### 2.1 Using Codeberg CI as a chat / LLM backend (most serious)

**Source.** The `run-agent` jobs in
`forgejo-intelligence-WORKFLOW-AGENT.yml` and in the github precursors
(`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour if enabled.** A Codeberg CI pipeline (Woodpecker, or
Forgejo Actions with an attached runner) triggered on issue events or
pull-request comment events reads the body, sends it to a third-party
LLM (OpenAI / Anthropic / Gemini / xAI / OpenRouter / Mistral /
Groq), and posts the model's reply back as a comment. The agent
exists for *conversational use* — the workflow comments and surface
docs describe issues as "a conversation thread" with the agent.

**Clause this likely violates.** The
[Codeberg CI documentation][codeberg-ci] makes Codeberg's Woodpecker
CI available for building, testing, packaging, and publishing the
software the repository contains, and the same principle is repeated
for self-attached Forgejo Actions runners. A general-purpose AI chat
assistant whose CPU work is unrelated to building, testing, or
releasing the host project's source code falls squarely on the wrong
side of that line. The ["What Codeberg is" / "is not"][codeberg-not]
page is even more direct: Codeberg is not a free hosting provider
for unrelated workloads, and the
[Codeberg Terms of Use][codeberg-tos] frame Codeberg as a forge for
free and open-source software development, not as general compute.

### 2.2 Issue/PR-triggered runs on public repositories = third-party compute consumption

**Source.** The same `run-agent` jobs and the issue / pull-request
surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour if enabled.** On a *public* Codeberg repository, anyone
with a Codeberg account (and, through federation, anyone with an
account on a federated Forgejo peer) can open issues and post
comments. The workflow has an "Authorize" step that checks the
actor's permission and bails out if it is not write/maintain/owner.
That authorisation check fires **after** the runner has already
picked up the job. Even rejected runs still consume Woodpecker agent
time (or runner time) for the authorisation step itself.

**Clause this likely violates.** The
[Codeberg Terms of Use][codeberg-tos] and the ["What Codeberg is" /
"is not"][codeberg-not] page together prohibit using Codeberg in
ways that impose an undue burden on Codeberg infrastructure or on
the volunteers and donors who keep it running. A public,
unauthenticated trigger surface that boots a job per inbound comment
is exactly that pattern. It also collides with the spirit of
Codeberg's CI capacity policy: shared Woodpecker agents are a
finite, donation-funded resource, and the per-repository fair-use
expectation set out in the [Codeberg CI documentation][codeberg-ci]
is "CI for your project", not "LLM proxy for anyone with an
account".

### 2.3 Codeberg Pages used as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and
`publish-public-fabric.yml`.

**Behaviour if enabled.** Translated into a Codeberg Pages
deployment, these workflows would publish a directory called
`public-fabric/` to a `pages` branch on every push to the default
branch. The original header comments are unambiguous: a live web
page powered by the agent's public output, with "no separate hosting
needed." Pages is deliberately being used as the substitute for
hosting the agent.

**Clause this likely violates.** The
["What Codeberg is" / "is not"][codeberg-not] page explicitly
excludes using Codeberg Pages (or Codeberg in general) as a generic
web host or as a stand-alone application backend. A site whose
entire content is generated by an autonomous LLM agent and updated
by a runner on every commit is not a project-documentation site — it
is an application surface, which is precisely what the
[`codeberg-compliance.md`](codeberg-compliance.md) document itself
acknowledges is **not** allowed on Codeberg.

### 2.4 The "Emergency" workflows — destructive cross-repository automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and
  every agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour if enabled on Codeberg.** A Codeberg port of the kill
workflow would use a Codeberg API token (with `repository` and
`write:repository` scope across the user or organisation,
equivalent to the github `INTELLIGENCE_EMERGENCY_TOKEN`) to walk
every repository belonging to the controlling account and physically
delete workflow files and agent folders. It is gated by deleting a
tripwire file in the controlling repository.

**Clauses this likely violates.**

1. The [Codeberg Terms of Use][codeberg-tos] forbid interfering with
   or disrupting the access of any other user or the operation of
   Codeberg itself. In a multi-member organisation, a single
   maintainer pushing one file deletion would silently rip CI out
   of every sibling repository in the same Codeberg org. That is
   interference with other members' service.
2. Token-based cross-repository writes from a CI pipeline also
   strain the spirit of Codeberg's API and token guidance — a
   user-scoped API token wired into a CI job is the broad, blast-
   radius-maximising pattern that scoped tokens were introduced to
   discourage.
3. If any deleted repository belongs to a different legal owner
   (e.g. a contributor's fork that landed under the same
   organisation), the deletion crosses into the unauthorised-access
   territory the [Codeberg Terms of Use][codeberg-tos] are written
   to prevent, depending on consent.

The fact that there is a tripwire fail-safe mitigates accidents but
does not change the policy posture — the production code path is
destructive automated bulk modification of other repositories on a
shared, donation-funded forge.

### 2.5 Self-installing / self-upgrading workflows

**Source.** Every `run-install` job under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/install/`,
the corresponding job in `forgejo-intelligence-WORKFLOW-AGENT.yml`,
the github precursors' installer jobs (e.g.
`github-minimum-intelligence-agent.yml`), and the deferred
`*-emergency-agent.yml`.

**Behaviour if enabled on Codeberg.** A Codeberg port of these jobs
would be manually-triggered (or `on:` rules-triggered) workflows
that declare write access to the repository contents and to the
workflow configuration, download a release tarball from a remote
upstream, extract it into the current repository's agent directory,
and `git push` the result. On upgrade, they overwrite their own
workflow contents.

**Clauses / security concerns this raises.**

1. **Supply chain.** A workflow that pulls arbitrary content from a
   remote release and commits it into `.forgejo/workflows/` and the
   repository's agent directory is, by construction, an automated
   supply-chain ingestion path. If the upstream release is ever
   compromised, every Codeberg repository that has run the
   installer auto-upgrades to the compromised version on next
   dispatch.
2. **Self-replication.** The combination of write-contents +
   write-workflows + manual trigger + downloads-and-commits-workflows
   is the textbook description of a self-replicating workflow. The
   [Codeberg Terms of Use][codeberg-tos] forbid distributing malware
   or any item of a destructive nature on Codeberg infrastructure.
   Even if the maintainers' intent is benign, the *mechanism*
   matches the pattern abuse enforcement looks for.
3. Because Codeberg is operated by Codeberg e.V. on donated funds
   and volunteer time, the blast radius of a subverted installer is
   not just one repository — it is a measurable hit on a non-profit
   forge that exists to serve the wider free-software community.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state),
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file),
- `public-fabric/` (rendered output).

**Clause this likely violates.** The
["What Codeberg is" / "is not"][codeberg-not] page makes clear that
Codeberg is for source code and project documentation, not for
generic data storage. Append-only conversation logs that grow per
issue comment, and a `union`-merged log file specifically engineered
to absorb high write contention from parallel CI runs, are operating
Git on Codeberg as a write-heavy data store. That is the use
pattern the rule is aimed at, and on Codeberg specifically it also
imposes ongoing storage and bandwidth costs on the e.V.

### 2.7 Third-party LLM API keys flowing through Codeberg secrets

**Source.** Header comments of the agent workflows; the `Authorize`
and `run-agent` job environments. On Codeberg, the equivalent values
would live as repository or organisation secrets on either the
Woodpecker CI side or the Forgejo Actions side.

**Behaviour if enabled.** The pipeline is configured with one or
more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`,
`GROQ_API_KEY`. Each invocation forwards user-supplied issue text to
the corresponding provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing
   their API to anonymous third parties without rate limiting,
   abuse monitoring, and a Terms-of-Use surface of your own. A
   public Codeberg repository whose issue tracker is wired straight
   to your `OPENAI_API_KEY` is, in effect, a public LLM proxy.
   Provider-side ToS violations are not Codeberg's problem, but
   they are *yours* the moment you flip the switch.
2. **Codeberg Terms of Use.** Using Codeberg to violate the rights
   of others — including any law, regulation, or third-party
   agreement — is forbidden by the
   [Codeberg Terms of Use][codeberg-tos]. Running someone else's
   API in violation of their ToS via Codeberg CI pulls the
   Codeberg side of the operation into that clause too.
3. **PII / data export.** Any contributor's issue body — potentially
   including private data in bug reports — is shipped to a
   third-party inference provider. On public repositories this
   needs at minimum a clear notice; on private repositories it can
   be a data-handling compliance failure (GDPR, etc., depending on
   the deployment). Codeberg's privacy posture does not contemplate
   user issue bodies being routed to arbitrary external inference
   providers.

### 2.8 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and
the agent runtime — the Codeberg equivalents would typically set a
generic `forgejo-actions[bot]`, `woodpecker[bot]`, or named CI
identity as the author of commits that the *agent itself* (not the
CI service) generated.

**Concern.** Attributing AI-authored commits to a CI/bot identity
deliberately hides the LLM as the author. Whether this is an
outright ToS violation is debatable, but it is the kind of
*misattribution* pattern that the [Forgejo Code of Conduct][forgejo-coc]
and Codeberg's general expectation of authentic identity are
written to discourage, and it makes downstream licence / DCO
compliance much harder for anyone who later audits the repository.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The
whole point is to use CI runners + Pages + Git history together as
a free hosting platform for an AI service. On a commercial forge,
that is a quota problem. On Codeberg, it is the **purpose-mismatch**
problem the
["What Codeberg is" / "is not"][codeberg-not] page is written to
prevent: Codeberg is not free hosting for application backends, and
the maintainers' donations are not a substitute for paying for the
compute, bandwidth, and storage your AI service actually needs.

### 2.10 Federation as an amplification surface

**Source.** The agent's outbound activity (commits, issue
comments, release notes) plus any future
`forgejo-intelligent-issue/` or `forgejo-intelligent-pull-request/`
configuration that processes inbound federated events as triggers.

**Concern.** Codeberg participates in Forgejo's federation. An
LLM-on-issues setup running on a public Codeberg repository turns
every federated peer into a potential trigger source and every
agent reply into a federated activity. Even without a deliberate
abuse, that increases the load on Codeberg's federation
infrastructure for content unrelated to software development, and
gives any compromised or malicious peer a way to drive Codeberg CI
indirectly. None of this is a problem with federation as such; it
is a problem with attaching a chatbot to it.

---

## 3. Failure modes that remain even on a Codeberg organisation you control

Owning the Codeberg account (rather than running on a shared one)
removes the *terms-of-service* concern about other users sharing
the same org, but it does not remove the *architectural* risks.
Even on a Codeberg organisation entirely under your control, the
design described in this repo can fail badly if certain disciplines
are not maintained:

1. **Runner privilege.** The agent needs write access to the
   repository and to its own workflow configuration. A compromised
   LLM provider key, a prompt injection through an issue body, or
   an inbound webhook can in principle cause the runner to push
   arbitrary commits — including commits that change
   `.forgejo/workflows/*.yml`. Running on your own Codeberg org
   does not immunise you; it just means the blast radius stops at
   your repositories — and at the shared Codeberg infrastructure
   underneath them.
2. **Cost runaway.** Codeberg CI is donation-funded rather than
   per-minute-billed, but LLM API calls are not. A public
   repository + an issue-comment trigger on Codeberg is still a
   cost-amplifying surface for whoever owns the LLM key.
3. **Token sprawl.** Codeberg API tokens are convenient and
   dangerous in equal measure. The agent design's appetite for
   cross-repository automation invites granting broader scopes
   than necessary; on Codeberg the only thing standing between a
   leaked token and the whole organisation is your own scoping
   discipline.
4. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Codeberg storage is
   finite too, and the operator must keep a retention policy in
   place — both for the sake of Codeberg's hosts and for the sake
   of the repository's own clone time.

These are not Codeberg-specific failures; they are properties of
the agent design itself, and they are why
[`codeberg-compliance.md`](codeberg-compliance.md) insists that
even a Codeberg deployment under your sole control is *not* the
target runtime — the target runtime is the maintainers' self-hosted
Forgejo, where the governance model described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/) actually
applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (if enabled on Codeberg) | Why |
| --- | --- | --- |
| Codeberg ToU — *no interfering with other users* | `*-emergency-trigger-kill.yml` (deferred) | Deletes workflows in sibling repositories under the same Codeberg org |
| Codeberg ToU — *forge for free / open-source software development* | All `run-agent` jobs | Runner cycles spent on LLM chat, not on SDLC |
| "What Codeberg is" / "is not" — *not a generic hosting / file storage service* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| "What Codeberg is" / "is not" — *Pages is not an application backend* | `gmi-public-fabric.yml`, `publish-public-fabric.yml` | Pages would be the agent's public surface, not project docs |
| Codeberg CI documentation — *CI is for building the project's software* | All `run-agent` jobs | Woodpecker / Forgejo Actions runner is doing AI inference, not building/testing the project |
| Fair-use / capacity expectation on shared CI | All `run-agent` jobs on public repositories | Donation-funded CI capacity consumed by inbound issue traffic |
| Codeberg ToU — *no malware / no destructive items* | Installer jobs + `*-emergency-agent.yml` | Pipeline installs and upgrades workflows from a remote source; emergency-kill mass-deletes pipelines |
| Codeberg ToU — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| API-token / scoped-token discipline | Emergency-kill token | Account-scoped token with broad write capability stored as a single-repository CI secret |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`codeberg-compliance.md`](codeberg-compliance.md) already says):

- The maintainers state explicitly that the production runtime is
  the maintainers' self-hosted Forgejo, not Codeberg, and that the
  Codeberg mirror is for source redundancy and a non-github.com
  public surface only.
- This repository contains **no Codeberg-specific CI configuration**
  — no `.woodpecker.yml`, no Codeberg-only Forgejo Actions
  workflows, no Codeberg runner registration. The infractions
  catalogued here are conditional on a third party enabling
  Woodpecker CI on the Codeberg mirror, attaching a Forgejo Actions
  runner to a Codeberg repository, or porting the github precursors
  into Codeberg-hosted jobs.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which
  are by name historical or deferred archives being held for
  reference rather than active deployment.
- Nothing in this repo, on its own, is currently *running* as a
  service on Codeberg infrastructure.
- Codeberg itself is a project the maintainers respect and rely on
  as a free-software public good. The point of this document is
  precisely to keep things that way — not to suggest that Codeberg
  is in any way at fault for the misuse patterns described.

The warning is therefore aimed at:

- Anyone forking this repository to a Codeberg account, enabling
  CI on the mirror, and turning the agent workflows on against a
  Codeberg repository.
- Anyone who notices that Codeberg "speaks Forgejo Actions" and
  reasons that the `.forgejo/workflows/` files can therefore be
  used as-is on Codeberg with a runner attached.
- Reviewers evaluating whether the design described in this repo
  is appropriate for a Codeberg deployment (it is not — it is
  appropriate only for the maintainers' self-hosted Forgejo
  runtime the project actually targets).

If you are a maintainer or downstream user and you intend to run
*any* of the `run-agent`, `run-install`, `kill`, or public-fabric
workflows on Codeberg, re-read the linked policies first, scope a
fresh, *least-privilege* token for the specific repository (never an
account-wide API token), and treat issue-triggered LLM inference as
something that must move to your own self-hosted Forgejo before
going anywhere near a public Codeberg repository.

---

## 6. References

- Codeberg Terms of Use — [`codeberg-tos`][codeberg-tos]
- Codeberg "What Codeberg is" / "is not" — [`codeberg-not`][codeberg-not]
- Codeberg CI documentation — [`codeberg-ci`][codeberg-ci]
- Forgejo Code of Conduct — [`forgejo-coc`][forgejo-coc]
- Existing maintainer posture document —
  [`codeberg-compliance.md`](codeberg-compliance.md)
- Sibling counterparts —
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md),
  [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`gitlab-compliance.md`](gitlab-compliance.md),
  [`gitlab-warning.md`](gitlab-warning.md),
  [`bitbucket-compliance.md`](bitbucket-compliance.md),
  [`bitbucket-warning.md`](bitbucket-warning.md)

[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/
[forgejo-coc]: https://codeberg.org/forgejo/code-of-conduct

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>
