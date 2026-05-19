# GitLab Warning

> **Adversarial counterpart to [`gitlab-compliance.md`](gitlab-compliance.md).**
>
> `gitlab-compliance.md` describes the maintainers' *intended* posture —
> that GitLab.com is used only as a secondary push-mirror of the
> canonical Forgejo source, and that no agent runtime is ported to
> GitLab CI/CD. **This document does the opposite.** It assumes a
> reader who naïvely clones this repository into a GitLab.com project,
> writes a `.gitlab-ci.yml` that translates the agent workflows under
> `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` (or their
> github precursors under
> `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`) into GitLab Jobs,
> attaches a runner (shared or self-hosted), wires up the LLM API keys
> as GitLab CI/CD variables, and lets the agent loop run as designed.
> It then enumerates, feature by feature, the clauses of the
> [GitLab Terms of Use][gitlab-tos] and the
> [GitLab Acceptable Use Policy][gitlab-aup] that such a deployment
> would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on GitLab.com
> or on a GitLab instance they do not own.

---

## 0. The headline risks

This repository ships **no `.gitlab-ci.yml`** and no GitLab-targeted
workflows; the agent runtime is structurally absent from the GitLab
side. The risks in this document materialise only if a reader
*translates* the existing GitHub Actions or Forgejo Actions workflows
into GitLab CI/CD jobs and enables them. If you do that and run them as
designed, you are very likely to be in breach of GitLab's terms in at
least the following ways:

1. **GitLab CI/CD misuse.** The agent uses CI runners as a
   general-purpose LLM chatbot backend triggered by issue or merge-request
   events. That is not "production, testing, deployment, or publication
   of the software project associated with the repository" — which is
   the only thing GitLab's CI/CD and shared-runner policies permit
   shared compute to be used for.
2. **GitLab Pages misuse.** Translating the `gmi-public-fabric.yml` and
   `publish-public-fabric.yml` publishers into a GitLab Pages job would
   publish AI-generated output as a Pages site whose content is the
   *product* of the agent, not documentation for source code. That is
   using Pages as a stand-alone application backend.
3. **Group-wide self-modifying / self-deleting automation.** The
   "emergency" workflows take a personal access token with
   `api`/`write_repository` scope across the user or group and use it to
   **mass-delete every workflow file and every agent folder in every
   project owned by that account**. On a shared GitLab instance this is
   destructive cross-project automation that interferes with other
   users' work and trips the GitLab Terms' prohibition on disrupting
   other users.
4. **Self-propagating pipelines.** The installer jobs request write
   access to repository contents and to CI/CD configuration in order to
   download workflow / pipeline YAML from a remote source and commit it
   into the calling project. A pipeline that installs and upgrades
   other pipelines on the same project is, functionally, self-replicating
   code.
5. **Resource / quota abuse on public projects.** An issue-comment-
   triggered LLM loop on a public GitLab.com project turns every
   drive-by comment into shared-runner minutes and outbound LLM API
   calls. On the free tier this is consumption of GitLab's compute
   (subject to the CI/CD minute quota) by anonymous third parties for
   purposes unrelated to building the project's software. Quota
   exhaustion attacks against the owner are the obvious follow-on.
6. **Repository as general-purpose data store.** The agent commits its
   conversation memory, session state, and "fabric" output back to git
   on every turn, using the repo as a database / message log rather
   than as source-code storage. The GitLab AUP forbids using GitLab
   services as a means of providing file storage, backup, or data
   hosting disconnected from the development of the project's code.
7. **Third-party LLM credentials and PII flowing through GitLab CI/CD
   variables.** The workflows are designed to be configured with
   `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc., and to forward arbitrary
   user-supplied issue text to those providers. A maintainer who
   enables this on a public GitLab.com project is implicitly running a
   free LLM proxy on GitLab.com infrastructure.

The remainder of this document goes through each of these in detail and
points at the specific files in this repository that a reader would
have to translate to reach the failure mode.

---

## 1. Inventory of source that a reader would translate to GitLab

There is no GitLab-targeted code in this repository. The risks below
apply to a hypothetical port of the following directories into a
`.gitlab-ci.yml` (and the corresponding job scripts) on a GitLab.com
project:

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
    [section 2.4](#24-the-emergency-workflows--destructive-cross-project-automation)).
- `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`
  - The github.com precursors of all of the above, whose policy posture
    is otherwise covered by [`github-warning.md`](github-warning.md).

The Forgejo-targeted and github-targeted runtime designs are out of
scope for this warning in their *own* hosts — Forgejo coverage lives in
[`forgejo-warning.md`](forgejo-warning.md), github.com coverage lives
in [`github-warning.md`](github-warning.md). This document is about
what happens if either is dropped onto GitLab.com.

---

## 2. Detailed infractions if these workflows are translated and enabled on GitLab.com

### 2.1 Using GitLab CI/CD as a chat / LLM backend (most serious)

**Source.** The `run-agent` jobs in `forgejo-intelligence-WORKFLOW-AGENT.yml`
and in the github precursors (`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour after translation.** A GitLab pipeline triggered on issue
events or merge-request comment events reads the body, sends it to a
third-party LLM (OpenAI / Anthropic / Gemini / xAI / OpenRouter /
Mistral / Groq), and posts the model's reply back as a comment. The
agent exists for *conversational use* — the workflow comments and
surface docs describe issues as "a conversation thread" with the agent.

**Clause this likely violates.** GitLab's [CI/CD usage policy][gitlab-ci-minutes]
makes the shared-runner pool available for CI of the projects hosted on
GitLab.com — that is, for building, testing, packaging, and deploying
the project's own software. A general-purpose AI chat assistant whose
CPU work is unrelated to building, testing, or releasing the host
project's source code falls squarely on the wrong side of that line.
The fact that the chat happens to use issues or merge requests as the
UI does not change the underlying use: the runner cycles are paying for
a chatbot, not for CI of the project. The
[GitLab Acceptable Use Policy][gitlab-aup] further forbids using GitLab
to run unrelated workloads or to impose an undue burden on shared
infrastructure.

### 2.2 Issue/MR-triggered runs on public projects = third-party compute consumption

**Source.** The same `run-agent` jobs and the issue / merge-request /
pull-request surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour after translation.** On a *public* GitLab.com project,
anyone with a GitLab account can open issues and post comments. The
workflow has an "Authorize" step that checks the actor's permission and
bails out if it is not write/maintain/owner. That authorisation check
fires **after** GitLab has already scheduled the job. Even rejected
runs still consume shared-runner minutes for the authorisation step
itself.

**Clause this likely violates.** The [GitLab AUP][gitlab-aup]
prohibits placing an undue burden on GitLab's infrastructure through
automated means and the use of GitLab services for excessive automated
bulk activity. A public, unauthenticated trigger surface that boots a
job per inbound comment is exactly the pattern those clauses target.
It also collides with the per-namespace CI/CD compute-minute quota
described in [GitLab's pricing and quotas documentation][gitlab-ci-minutes]:
on the free tier the owner's quota is the *cap*, not the floor, and
agent traffic will saturate it long before any benefit accrues to
project SDLC.

### 2.3 GitLab Pages used as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and `publish-public-fabric.yml`.

**Behaviour after translation.** Translated into a GitLab Pages job,
these workflows would publish a directory called `public-fabric/` to
GitLab Pages on every push to the default branch. The original header
comments are unambiguous: a live web page powered by the agent's
public output, with "no separate hosting needed." Pages is deliberately
being used as the substitute for hosting the agent.

**Clause this likely violates.** GitLab's
[Pages documentation][gitlab-pages] and the
[GitLab AUP][gitlab-aup] limit Pages to project, group, or user pages
in support of the project hosted in the repository. A site whose entire
content is generated by an autonomous LLM agent and updated by a runner
on every commit is not a project-documentation site — it is an
application surface, which is precisely what
[`gitlab-compliance.md`](gitlab-compliance.md) itself acknowledges is
**not** allowed on GitLab.com.

### 2.4 The "Emergency" workflows — destructive cross-project automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and every
  agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour after translation.** A GitLab port of the kill workflow
would use a GitLab personal access token (with `api` and
`write_repository` scope across the user or group, equivalent to the
github `INTELLIGENCE_EMERGENCY_TOKEN`) to walk every project belonging
to the controlling user or group and physically delete pipeline files
and agent folders. It is gated by deleting a tripwire file in the
controlling project.

**Clauses this likely violates.**

1. The [GitLab Terms of Use][gitlab-tos] forbid interfering with or
   disrupting the access of any user or the operation of GitLab. In a
   multi-member group, a single maintainer pushing one file deletion
   would silently rip CI out of every sibling project. That is
   interference with other members' service.
2. PAT-based cross-project writes from a pipeline trigger also strain
   GitLab's [scoped-token guidance][gitlab-tokens] — the very design
   ("a PAT with `api` scope across the group, stored as a single-
   project CI/CD variable") is the anti-pattern that group access
   tokens and project access tokens were introduced to discourage.
3. If any deleted project belongs to a different legal owner (e.g. a
   contributor's fork that landed under the group), the deletion
   crosses into the GitLab AUP's prohibition on accessing data or
   accounts without authorisation, depending on consent.

The fact that there is a tripwire fail-safe mitigates accidents but
does not change the policy posture — the production code path is
destructive automated bulk modification of other projects.

### 2.5 Self-installing / self-upgrading pipelines

**Source.** Every `run-install` job under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/install/`,
the corresponding job in `forgejo-intelligence-WORKFLOW-AGENT.yml`, the
github precursors' installer jobs (e.g.
`github-minimum-intelligence-agent.yml`), and the deferred
`*-emergency-agent.yml`.

**Behaviour after translation.** A GitLab port of these jobs would be
manually-triggered (or `workflow:` rules-triggered) pipelines that
declare write access to the project's repository and to its CI/CD
configuration, download a release tarball from a remote upstream,
extract it into the current project's agent directory, and `git push`
the result. On upgrade, they overwrite their own pipeline contents.

**Clauses / security concerns this raises.**

1. **Supply chain.** A pipeline that pulls arbitrary content from a
   remote release and commits it into `.gitlab-ci.yml` and the
   project's agent directory is, by construction, an automated
   supply-chain ingestion path. If the upstream release is ever
   compromised, every project that has run the installer auto-upgrades
   to the compromised version on next dispatch.
2. **Self-replication.** The combination of write-contents + write-CI +
   manual trigger + downloads-and-commits-pipelines is the textbook
   description of a self-replicating pipeline. The
   [GitLab AUP][gitlab-aup] forbids distributing malware or any item
   of a destructive nature. Even if the maintainers' intent is benign,
   the *mechanism* matches the pattern abuse enforcement looks for.
3. If the project later adopts OIDC integration with a cloud provider
   via GitLab's [JWT ID tokens][gitlab-oidc], a subverted installer
   pipeline can exchange those tokens for cloud credentials —
   compounding the blast radius beyond GitLab itself.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state)
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file)
- `public-fabric/` (rendered output)

**Clause this likely violates.** The [GitLab AUP][gitlab-aup] forbids
using GitLab services as a means of providing file storage, backup, or
data hosting unrelated to software development. Append-only conversation
logs that grow per issue comment, and a `union`-merged log file
specifically engineered to absorb high write contention from parallel
CI runs, are operating Git as a write-heavy data store. That is the
use pattern the rule is aimed at.

### 2.7 Third-party LLM API keys flowing through GitLab CI/CD variables

**Source.** Header comments of the agent workflows; the `Authorize` and
`run-agent` job environments. After translation, the equivalent values
would live as protected, masked CI/CD variables on the GitLab project
or group.

**Behaviour after translation.** The pipeline is configured with one or
more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, `GROQ_API_KEY`.
Each invocation forwards user-supplied issue text to the corresponding
provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing their
   API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A public
   GitLab.com project whose issue tracker is wired straight to your
   `OPENAI_API_KEY` is, in effect, a public LLM proxy. Provider-side
   ToS violations are not GitLab's problem, but they are *yours* the
   moment you flip the switch.
2. **GitLab AUP.** Using GitLab to violate the rights of others —
   including any law, regulation, or third-party agreement — is
   forbidden. Running someone else's API in violation of their ToS via
   GitLab CI/CD pulls the GitLab.com side of the operation into that
   clause too.
3. **PII / data export.** Any contributor's issue body — potentially
   including private data in bug reports — is shipped to a third-party
   inference provider. On public projects this needs at minimum a clear
   notice; on internal or private projects it can be a data-handling
   compliance failure (GDPR, HIPAA, etc., depending on the deployment).
   GitLab.com's own privacy posture does not contemplate user issue
   bodies being routed to arbitrary external inference providers.

### 2.8 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and the
agent runtime — the GitLab equivalents would typically set a generic
`gitlab-ci-token`, `project-bot`, or group-bot author for commits that
the *agent itself* (not the GitLab CI/CD service) generated.

**Concern.** Attributing AI-authored commits to a CI/bot identity
deliberately hides the LLM as the author. Whether this is an outright
ToS violation is debatable, but it is the kind of *misattribution*
pattern that GitLab's policies on authentic identity and the
expectation of accurate commit metadata are written to discourage, and
it makes downstream licence / DCO compliance much harder for anyone
who later audits the repository.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The whole
point is to use CI runners + Pages + Git history together as a free
hosting platform for an AI service. That is precisely the use pattern
the GitLab CI/CD quota system and the [GitLab AUP][gitlab-aup] exist to
prevent, and it is what would prompt GitLab's abuse team to suspend the
offending project.

---

## 3. Failure modes that remain even on a self-managed GitLab

Running a self-managed GitLab on hardware you own removes the
*terms-of-service* layer (you are your own operator) but it does not
remove the *architectural* risks. Even on a self-managed instance, the
design described in this repo can fail badly if certain disciplines are
not maintained:

1. **Runner privilege.** The agent needs write access to the project
   and to its own pipeline configuration. A compromised LLM provider
   key, a prompt injection through an issue body, or an inbound
   webhook can in principle cause the runner to push arbitrary commits
   — including commits that change `.gitlab-ci.yml`. Self-managing
   GitLab does not immunise you against this; it just means the blast
   radius stops at your own infrastructure.
2. **Cost runaway.** Self-managed runners do not charge per minute, but
   LLM API calls do. A public project + an issue-comment trigger on a
   self-managed GitLab is still a cost-amplifying surface for whoever
   owns the LLM key.
3. **Group access token sprawl.** GitLab's group and project access
   tokens are convenient and dangerous in equal measure. The agent
   design's appetite for cross-project automation invites granting
   broader scopes than necessary; on a self-managed instance the only
   thing standing between a leaked token and the whole group is your
   own scoping discipline.
4. **Backups vs. memory bloat.** The agent's `memory.log` and `state/`
   directories grow without bound. Self-managed disk is finite too;
   the operator must keep a retention policy in place.

These are not GitLab.com-specific failures; they are properties of the
agent design itself, and they are why
[`gitlab-compliance.md`](gitlab-compliance.md) insists that even a
self-managed GitLab deployment is *not* the target runtime — the
target runtime is the maintainers' self-hosted Forgejo, where the
governance model described in [`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/)
actually applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (after translation) | Why |
| --- | --- | --- |
| GitLab AUP — *no excessive automated bulk activity* | All `run-agent` jobs; emergency-kill | Per-comment runner spawns; mass cross-project deletes |
| GitLab Terms of Use — *no interfering with other users* | `*-emergency-trigger-kill.yml` (deferred) | Deletes pipelines in other projects owned by the account |
| GitLab AUP — *no using infrastructure for file storage / data hosting* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| GitLab AUP — *no malware / self-replicating code* | Installer jobs that download and commit pipeline YAML | Pipeline installs and upgrades pipelines from a remote source |
| GitLab AUP — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| GitLab CI/CD usage policy — *only for SDLC of the host project* | All `run-agent` jobs | Runner is doing AI inference / chatbot, not building/testing the project |
| GitLab CI/CD compute-minute quota | All `run-agent` jobs on public projects | Free-tier quota saturated by inbound issue traffic |
| GitLab Pages — *not a stand-alone application backend* | `gmi-public-fabric.yml`, `publish-public-fabric.yml` after translation | Pages would be the agent's public surface, not project docs |
| Scoped-token guidance | Emergency-kill PAT | Group-scoped `api` PAT stored as a single-project CI/CD variable |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`gitlab-compliance.md`](gitlab-compliance.md) already says):

- The maintainers state explicitly that the production runtime is the
  maintainers' self-hosted Forgejo, not GitLab, and that the GitLab.com
  mirror is for source redundancy and discoverability only.
- This repository contains **no `.gitlab-ci.yml`** and no
  GitLab-targeted agent code. The infractions catalogued here are
  conditional on a third party translating the existing GitHub or
  Forgejo workflows into GitLab CI/CD pipelines and enabling them.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which are by
  name historical or deferred archives being held for reference rather
  than active deployment.
- Nothing in this repo, on its own, is currently *running* as a service
  on GitLab.com infrastructure.

The warning is therefore aimed at:

- Anyone forking this repo, writing a `.gitlab-ci.yml` that ports the
  agent workflows, and turning it on against a GitLab.com project.
- Reviewers evaluating whether the design described in this repo is
  appropriate for a GitLab deployment (it is not — it is appropriate
  only for the maintainers' self-hosted Forgejo runtime the project
  actually targets).

If you are a maintainer or downstream user and you intend to run *any*
of the `run-agent`, `run-install`, `kill`, or public-fabric workflows
on GitLab — GitLab.com or self-managed — re-read the linked policies
first, scope a fresh, *least-privilege*, single-project access token
(never a group-wide PAT), and treat issue-triggered LLM inference as
something that must move to your own self-hosted Forgejo before going
anywhere near a public GitLab project.

---

## 6. References

- GitLab Terms of Use — [`gitlab-tos`][gitlab-tos]
- GitLab Acceptable Use Policy — [`gitlab-aup`][gitlab-aup]
- GitLab CI/CD compute minutes / quotas — [`gitlab-ci-minutes`][gitlab-ci-minutes]
- GitLab Pages documentation — [`gitlab-pages`][gitlab-pages]
- GitLab personal / group / project access tokens —
  [`gitlab-tokens`][gitlab-tokens]
- GitLab OIDC / JWT ID tokens — [`gitlab-oidc`][gitlab-oidc]
- Existing maintainer posture document —
  [`gitlab-compliance.md`](gitlab-compliance.md)
- Sibling counterparts — [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`bitbucket-compliance.md`](bitbucket-compliance.md),
  [`bitbucket-warning.md`](bitbucket-warning.md),
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md)

[gitlab-tos]: https://about.gitlab.com/terms/
[gitlab-aup]: https://handbook.gitlab.com/handbook/legal/acceptable-use-policy/
[gitlab-ci-minutes]: https://docs.gitlab.com/ee/ci/pipelines/cicd_minutes.html
[gitlab-pages]: https://docs.gitlab.com/ee/user/project/pages/
[gitlab-tokens]: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
[gitlab-oidc]: https://docs.gitlab.com/ee/ci/cloud_services/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>
