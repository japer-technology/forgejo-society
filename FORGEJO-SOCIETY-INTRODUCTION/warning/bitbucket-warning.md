# Bitbucket Warning

> **Adversarial counterpart to [`bitbucket-compliance.md`](bitbucket-compliance.md).**
>
> `bitbucket-compliance.md` describes the maintainers' *intended*
> posture — that bitbucket.org is used only as a tertiary push-mirror
> of the canonical Forgejo source, and that no agent runtime is ported
> to Bitbucket Pipelines. **This document does the opposite.** It
> assumes a reader who naïvely clones this repository into a
> bitbucket.org workspace, writes a `bitbucket-pipelines.yml` that
> translates the agent workflows under
> `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` (or their
> github precursors under
> `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`) into Bitbucket
> Pipelines steps, attaches a runner (shared or self-hosted), wires up
> the LLM API keys as repository or workspace variables, and lets the
> agent loop run as designed. It then enumerates, feature by feature,
> the clauses of the [Atlassian Cloud Terms of Service][bitbucket-tos]
> and the [Atlassian Acceptable Use Policy][atlassian-aup] that such a
> deployment would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on
> bitbucket.org or on a Bitbucket instance they do not own.

---

## 0. The headline risks

This repository ships **no `bitbucket-pipelines.yml`**, no
[Bitbucket Pipes][bitbucket-pipes], and no Bitbucket-targeted
workflows; the agent runtime is structurally absent from the Bitbucket
side. The risks in this document materialise only if a reader
*translates* the existing GitHub Actions or Forgejo Actions workflows
into Bitbucket Pipelines steps and enables them. If you do that and
run them as designed, you are very likely to be in breach of
Bitbucket's terms in at least the following ways:

1. **Bitbucket Pipelines misuse.** The agent uses Pipelines build
   minutes as a general-purpose LLM chatbot backend triggered by issue
   or pull-request events. That is not "production, testing,
   deployment, or publication of the software project associated with
   the repository" — which is the only thing Bitbucket Pipelines and
   the build-minute quota are sold to support.
2. **Downloads area / LFS misuse as a public surface.** Because
   Bitbucket Cloud no longer offers a first-party static-site hosting
   product (the historical "Bitbucket Cloud Pages" was deprecated
   years ago), a port of the `gmi-public-fabric.yml` /
   `publish-public-fabric.yml` publishers would have to use the
   repository **Downloads** section, **LFS**, or
   [**Snippets**][bitbucket-snippets] as a pseudo-host for AI-generated
   output. That is using a code-collaboration surface as a stand-alone
   application backend.
3. **Workspace-wide self-modifying / self-deleting automation.** The
   "emergency" workflows take a token with `repository:admin` and
   `pullrequest:write` scope across the workspace and use it to
   **mass-delete every Pipelines configuration file and every agent
   folder in every repository in that workspace**. On a shared
   Bitbucket workspace this is destructive cross-repository automation
   that interferes with other workspace members' work and trips the
   Atlassian AUP prohibition on disrupting other users.
4. **Self-propagating pipelines.** The installer steps request write
   access to repository contents and to the Pipelines configuration in
   order to download workflow YAML from a remote source and commit it
   into the calling repository as a new `bitbucket-pipelines.yml`. A
   pipeline that installs and upgrades other pipelines on the same
   repository is, functionally, self-replicating code.
5. **Resource / quota abuse on public repositories.** An
   issue-comment-triggered LLM loop on a public bitbucket.org
   repository turns every drive-by comment into shared-runner minutes
   and outbound LLM API calls. On the free tier this is consumption of
   Bitbucket's compute (subject to the workspace
   [build-minute quota][bitbucket-pipelines-pricing]) by anonymous
   third parties for purposes unrelated to building the project's
   software. Quota exhaustion attacks against the owner are the
   obvious follow-on.
6. **Repository as general-purpose data store.** The agent commits its
   conversation memory, session state, and "fabric" output back to git
   on every turn, using the repo as a database / message log rather
   than as source-code storage. The Atlassian AUP forbids using
   Atlassian services as a means of providing file storage, backup, or
   data hosting disconnected from the development of the project's
   code.
7. **Third-party LLM credentials and PII flowing through Bitbucket
   Pipelines variables.** The workflows are designed to be configured
   with `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc., and to forward
   arbitrary user-supplied issue text to those providers. A maintainer
   who enables this on a public bitbucket.org repository is implicitly
   running a free LLM proxy on Bitbucket Cloud infrastructure.

The remainder of this document goes through each of these in detail
and points at the specific files in this repository that a reader
would have to translate to reach the failure mode.

---

## 1. Inventory of source that a reader would translate to Bitbucket

There is no Bitbucket-targeted code in this repository. The risks
below apply to a hypothetical port of the following directories into a
`bitbucket-pipelines.yml` (and the corresponding step scripts) on a
bitbucket.org repository:

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

The Forgejo-targeted, github-targeted, and gitlab-targeted runtime
designs are out of scope for this warning in their *own* hosts —
Forgejo coverage lives in [`forgejo-warning.md`](forgejo-warning.md),
github.com coverage lives in [`github-warning.md`](github-warning.md),
gitlab.com coverage lives in [`gitlab-warning.md`](gitlab-warning.md).
This document is about what happens if any of them is dropped onto
bitbucket.org.

---

## 2. Detailed infractions if these workflows are translated and enabled on bitbucket.org

### 2.1 Using Bitbucket Pipelines as a chat / LLM backend (most serious)

**Source.** The `run-agent` jobs in
`forgejo-intelligence-WORKFLOW-AGENT.yml` and in the github precursors
(`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour after translation.** A Bitbucket pipeline triggered on
issue events (via webhook bridge) or pull-request comment events reads
the body, sends it to a third-party LLM (OpenAI / Anthropic / Gemini /
xAI / OpenRouter / Mistral / Groq), and posts the model's reply back
as a comment. The agent exists for *conversational use* — the
workflow comments and surface docs describe issues as "a conversation
thread" with the agent.

**Clause this likely violates.** Bitbucket's
[Pipelines build-minute policy][bitbucket-pipelines-pricing] makes the
shared-runner pool available for CI of the repositories hosted on
bitbucket.org — that is, for building, testing, packaging, and
deploying the project's own software. A general-purpose AI chat
assistant whose CPU work is unrelated to building, testing, or
releasing the host project's source code falls squarely on the wrong
side of that line. The fact that the chat happens to use issues or
pull requests as the UI does not change the underlying use: the
runner cycles are paying for a chatbot, not for CI of the project.
The [Atlassian Acceptable Use Policy][atlassian-aup] further forbids
using Atlassian services to run unrelated workloads or to impose an
undue burden on shared infrastructure.

### 2.2 Issue/PR-triggered runs on public repositories = third-party compute consumption

**Source.** The same `run-agent` jobs and the issue / pull-request
surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour after translation.** On a *public* bitbucket.org
repository, anyone with an Atlassian account can open issues and post
pull-request comments. The workflow has an "Authorize" step that
checks the actor's permission and bails out if it is not
write/admin/owner. That authorisation check fires **after** Bitbucket
has already scheduled the step. Even rejected runs still consume
shared-runner minutes for the authorisation step itself.

**Clause this likely violates.** The
[Atlassian AUP][atlassian-aup] prohibits placing an undue burden on
Atlassian's infrastructure through automated means and the use of
Atlassian services for excessive automated bulk activity. A public,
loosely-authenticated trigger surface that boots a pipeline per
inbound comment is exactly the pattern those clauses target. It also
collides with the per-workspace
[Pipelines build-minute quota][bitbucket-pipelines-pricing]: on the
free tier the owner's monthly quota is the *cap*, not the floor, and
agent traffic will saturate it long before any benefit accrues to
project SDLC.

### 2.3 The Downloads area / LFS / Snippets as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and
`publish-public-fabric.yml`.

**Behaviour after translation.** Bitbucket Cloud has no first-party
static-site hosting product. Translated to a Bitbucket Pipelines
step, the public-fabric publisher would have to push the
`public-fabric/` output directory to one of:

- the repository **Downloads** area (via the
  `/2.0/repositories/{workspace}/{repo_slug}/downloads` REST endpoint),
- Bitbucket **LFS** plus a static-asset reverse proxy,
- a **Snippet** updated on every commit, or
- a third-party object store reached from the pipeline.

The original header comments are unambiguous: a live web surface
powered by the agent's public output, with "no separate hosting
needed." Whatever the chosen Bitbucket surface, it is deliberately
being used as the substitute for hosting the agent.

**Clauses this likely violates.** The
[Atlassian AUP][atlassian-aup] forbids using Atlassian services as a
means of providing file storage, backup, or data hosting disconnected
from the development of the project's code. The
[Bitbucket Cloud documentation][bitbucket-downloads] for the Downloads
area is explicit that it exists for release artefacts associated with
the repository, not for arbitrary web content. Using Snippets as the
backing store of an AI-generated public surface departs equally
clearly from their documented purpose.

### 2.4 The "Emergency" workflows — destructive cross-repository automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and
  every agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour after translation.** A Bitbucket port of the kill workflow
would use a [Workspace Access Token][bitbucket-tokens] (with
`repository:admin` and `pullrequest:write` scope across the workspace,
equivalent to the github `INTELLIGENCE_EMERGENCY_TOKEN`) to walk every
repository in the controlling workspace and physically delete
`bitbucket-pipelines.yml` and agent folders. It is gated by deleting
a tripwire file in the controlling repository.

**Clauses this likely violates.**

1. The [Atlassian Cloud Terms of Service][bitbucket-tos] forbid
   interfering with or disrupting the access of any user or the
   operation of the service. In a multi-member workspace, a single
   admin pushing one file deletion would silently rip CI out of every
   sibling repository. That is interference with other members'
   service.
2. Token-based cross-repository writes from a pipeline trigger also
   strain Atlassian's [access-token guidance][bitbucket-tokens] — the
   very design ("a workspace-scoped admin token, stored as a single-
   repository pipelines variable") is the anti-pattern that
   Repository, Project, and Workspace Access Tokens were introduced
   to discourage, by encouraging the narrowest viable scope.
3. If any deleted repository belongs to a different legal owner (e.g.
   a contributor's fork that landed in the workspace), the deletion
   crosses into the Atlassian AUP's prohibition on accessing data or
   accounts without authorisation, depending on consent.

The fact that there is a tripwire fail-safe mitigates accidents but
does not change the policy posture — the production code path is
destructive automated bulk modification of other repositories.

### 2.5 Self-installing / self-upgrading pipelines

**Source.** Every `run-install` job under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/install/`,
the corresponding job in `forgejo-intelligence-WORKFLOW-AGENT.yml`,
the github precursors' installer jobs (e.g.
`github-minimum-intelligence-agent.yml`), and the deferred
`*-emergency-agent.yml`.

**Behaviour after translation.** A Bitbucket port of these jobs would
be manually-triggered (or `custom:`-pipeline-triggered) pipelines that
declare write access to the repository and to its Pipelines
configuration, download a release tarball from a remote upstream,
extract it into the current repository's agent directory, and
`git push` the result. On upgrade, they overwrite their own
`bitbucket-pipelines.yml`.

**Clauses / security concerns this raises.**

1. **Supply chain.** A pipeline that pulls arbitrary content from a
   remote release and commits it into `bitbucket-pipelines.yml` and
   the repository's agent directory is, by construction, an automated
   supply-chain ingestion path. If the upstream release is ever
   compromised, every repository that has run the installer
   auto-upgrades to the compromised version on next dispatch.
2. **Self-replication.** The combination of write-contents +
   write-Pipelines-config + manual trigger + downloads-and-commits-
   pipelines is the textbook description of a self-replicating
   pipeline. The [Atlassian AUP][atlassian-aup] forbids distributing
   malware or any item of a destructive nature. Even if the
   maintainers' intent is benign, the *mechanism* matches the pattern
   abuse enforcement looks for.
3. If the project later adopts
   [OpenID Connect for Pipelines][bitbucket-oidc] to assume a cloud
   role, a subverted installer pipeline can exchange those tokens for
   cloud credentials — compounding the blast radius beyond Bitbucket
   itself.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state)
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file)
- `public-fabric/` (rendered output)

**Clause this likely violates.** The
[Atlassian AUP][atlassian-aup] forbids using Atlassian services as a
means of providing file storage, backup, or data hosting unrelated to
software development. Append-only conversation logs that grow per
issue comment, and a `union`-merged log file specifically engineered
to absorb high write contention from parallel pipeline runs, are
operating Git as a write-heavy data store. That is the use pattern
the rule is aimed at, and it additionally collides with the
documented Bitbucket Cloud
[soft repository-size limits][bitbucket-repo-limits] (the threshold
above which Atlassian asks repositories to be split or reduced).

### 2.7 Third-party LLM API keys flowing through Pipelines variables

**Source.** Header comments of the agent workflows; the `Authorize`
and `run-agent` job environments. After translation, the equivalent
values would live as
[secured repository, deployment, or workspace variables][bitbucket-variables]
on the Bitbucket repository or workspace.

**Behaviour after translation.** The pipeline is configured with one
or more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`,
`GROQ_API_KEY`. Each invocation forwards user-supplied issue text to
the corresponding provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing
   their API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A public
   bitbucket.org repository whose issue tracker is wired straight to
   your `OPENAI_API_KEY` is, in effect, a public LLM proxy.
   Provider-side ToS violations are not Bitbucket's problem, but they
   are *yours* the moment you flip the switch.
2. **Atlassian AUP.** Using Atlassian services to violate the rights
   of others — including any law, regulation, or third-party
   agreement — is forbidden. Running someone else's API in violation
   of their ToS via Bitbucket Pipelines pulls the bitbucket.org side
   of the operation into that clause too.
3. **PII / data export.** Any contributor's issue body — potentially
   including private data in bug reports — is shipped to a third-party
   inference provider. On public repositories this needs at minimum a
   clear notice; on private repositories it can be a data-handling
   compliance failure (GDPR, HIPAA, etc., depending on the
   deployment). Atlassian's own privacy posture does not contemplate
   user issue bodies being routed to arbitrary external inference
   providers.

### 2.8 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and the
agent runtime — the Bitbucket equivalents would typically set a
generic `pipelines`, `repository-bot`, or workspace-bot author for
commits that the *agent itself* (not Bitbucket Pipelines) generated.

**Concern.** Attributing AI-authored commits to a CI/bot identity
deliberately hides the LLM as the author. Whether this is an outright
ToS violation is debatable, but it is the kind of *misattribution*
pattern that Atlassian's policies on authentic identity and the
expectation of accurate commit metadata are written to discourage,
and it makes downstream licence / DCO compliance much harder for
anyone who later audits the repository.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The
whole point is to use Pipelines minutes + the Downloads area + Git
history together as a free hosting platform for an AI service. That
is precisely the use pattern the Pipelines build-minute quota and the
[Atlassian AUP][atlassian-aup] exist to prevent, and it is what would
prompt Atlassian's abuse team to suspend the offending repository.

---

## 3. Failure modes that remain even on a self-managed Bitbucket Data Center

Running a self-managed [Bitbucket Data Center][bitbucket-data-center]
instance on hardware you own removes the *terms-of-service* layer
(you are your own operator) but it does not remove the
*architectural* risks. Even on a self-managed instance, the design
described in this repo can fail badly if certain disciplines are not
maintained:

1. **Runner privilege.** The agent needs write access to the
   repository and to its own pipeline configuration. A compromised
   LLM provider key, a prompt injection through an issue body, or an
   inbound webhook can in principle cause the runner to push
   arbitrary commits — including commits that change
   `bitbucket-pipelines.yml`. Self-managing Bitbucket does not
   immunise you against this; it just means the blast radius stops at
   your own infrastructure.
2. **Cost runaway.** Self-managed runners do not charge per minute,
   but LLM API calls do. A public repository + an issue-comment
   trigger on a self-managed Bitbucket is still a cost-amplifying
   surface for whoever owns the LLM key.
3. **Access-token sprawl.** Bitbucket's Repository, Project, and
   Workspace Access Tokens are convenient and dangerous in equal
   measure. The agent design's appetite for cross-repository
   automation invites granting broader scopes than necessary; on a
   self-managed instance the only thing standing between a leaked
   token and the whole workspace is your own scoping discipline.
4. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Self-managed disk is
   finite too; the operator must keep a retention policy in place.

These are not bitbucket.org-specific failures; they are properties of
the agent design itself, and they are why
[`bitbucket-compliance.md`](bitbucket-compliance.md) insists that even
a self-managed Bitbucket deployment is *not* the target runtime — the
target runtime is the maintainers' self-hosted Forgejo, where the
governance model described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/) actually applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (after translation) | Why |
| --- | --- | --- |
| Atlassian AUP — *no excessive automated bulk activity* | All `run-agent` jobs; emergency-kill | Per-comment pipeline spawns; mass cross-repository deletes |
| Atlassian Cloud ToS — *no interfering with other users* | `*-emergency-trigger-kill.yml` (deferred) | Deletes Pipelines configs in other repositories in the workspace |
| Atlassian AUP — *no using infrastructure for file storage / data hosting* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Atlassian AUP — *no malware / self-replicating code* | Installer jobs that download and commit pipeline YAML | Pipeline installs and upgrades pipelines from a remote source |
| Atlassian AUP — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| Bitbucket Pipelines usage policy — *only for SDLC of the host project* | All `run-agent` jobs | Pipelines is doing AI inference / chatbot, not building/testing the project |
| Bitbucket Pipelines build-minute quota | All `run-agent` jobs on public repositories | Free-tier quota saturated by inbound issue traffic |
| Downloads area / Snippets — *not a stand-alone application backend* | `gmi-public-fabric.yml`, `publish-public-fabric.yml` after translation | Downloads / Snippets become the agent's public surface, not release artefacts |
| Access-token guidance | Emergency-kill Workspace Access Token | Workspace-scoped admin token stored as a single-repository pipelines variable |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`bitbucket-compliance.md`](bitbucket-compliance.md) already says):

- The maintainers state explicitly that the production runtime is the
  maintainers' self-hosted Forgejo, not Bitbucket, and that the
  bitbucket.org mirror is for source redundancy and
  concentration-risk reduction only.
- This repository contains **no `bitbucket-pipelines.yml`** and no
  Bitbucket-targeted agent code. The infractions catalogued here are
  conditional on a third party translating the existing GitHub,
  GitLab, or Forgejo workflows into Bitbucket Pipelines steps and
  enabling them.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which are
  by name historical or deferred archives being held for reference
  rather than active deployment.
- Nothing in this repo, on its own, is currently *running* as a
  service on bitbucket.org infrastructure.

The warning is therefore aimed at:

- Anyone forking this repo, writing a `bitbucket-pipelines.yml` that
  ports the agent workflows, and turning it on against a
  bitbucket.org repository.
- Reviewers evaluating whether the design described in this repo is
  appropriate for a Bitbucket deployment (it is not — it is
  appropriate only for the maintainers' self-hosted Forgejo runtime
  the project actually targets).

If you are a maintainer or downstream user and you intend to run *any*
of the `run-agent`, `run-install`, `kill`, or public-fabric workflows
on Bitbucket — bitbucket.org or self-managed — re-read the linked
policies first, scope a fresh, *least-privilege* Repository Access
Token (never a workspace-wide App password), and treat
issue-triggered LLM inference as something that must move to your own
self-hosted Forgejo before going anywhere near a public Bitbucket
repository.

---

## 6. References

- Atlassian Cloud Terms of Service — [`bitbucket-tos`][bitbucket-tos]
- Atlassian Acceptable Use Policy — [`atlassian-aup`][atlassian-aup]
- Bitbucket Pipelines build minutes / pricing —
  [`bitbucket-pipelines-pricing`][bitbucket-pipelines-pricing]
- Bitbucket Pipes — [`bitbucket-pipes`][bitbucket-pipes]
- Bitbucket Repository / Project / Workspace Access Tokens —
  [`bitbucket-tokens`][bitbucket-tokens]
- Bitbucket Pipelines OpenID Connect — [`bitbucket-oidc`][bitbucket-oidc]
- Bitbucket Pipelines variables — [`bitbucket-variables`][bitbucket-variables]
- Bitbucket repository Downloads area — [`bitbucket-downloads`][bitbucket-downloads]
- Bitbucket repository size guidance — [`bitbucket-repo-limits`][bitbucket-repo-limits]
- Bitbucket Snippets — [`bitbucket-snippets`][bitbucket-snippets]
- Bitbucket Data Center — [`bitbucket-data-center`][bitbucket-data-center]
- Existing maintainer posture document —
  [`bitbucket-compliance.md`](bitbucket-compliance.md)
- Sibling counterparts — [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`gitlab-compliance.md`](gitlab-compliance.md),
  [`gitlab-warning.md`](gitlab-warning.md),
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md)

[bitbucket-tos]: https://www.atlassian.com/legal/cloud-terms-of-service
[atlassian-aup]: https://www.atlassian.com/legal/acceptable-use-policy
[bitbucket-pipelines-pricing]: https://support.atlassian.com/bitbucket-cloud/docs/what-are-build-minutes/
[bitbucket-pipes]: https://support.atlassian.com/bitbucket-cloud/docs/use-pipes-in-bitbucket-pipelines/
[bitbucket-tokens]: https://support.atlassian.com/bitbucket-cloud/docs/repository-access-tokens/
[bitbucket-oidc]: https://support.atlassian.com/bitbucket-cloud/docs/integrate-pipelines-with-resource-servers-using-oidc/
[bitbucket-variables]: https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
[bitbucket-downloads]: https://support.atlassian.com/bitbucket-cloud/docs/download-a-file-from-bitbucket/
[bitbucket-repo-limits]: https://support.atlassian.com/bitbucket-cloud/docs/reduce-repository-size/
[bitbucket-snippets]: https://support.atlassian.com/bitbucket-cloud/docs/create-a-snippet/
[bitbucket-data-center]: https://www.atlassian.com/software/bitbucket/enterprise

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
