# GitHub Warning

> **Adversarial counterpart to [`github-compliance.md`](github-compliance.md).**
>
> `github-compliance.md` describes the maintainers' *intended* posture — that
> github.com is used only as a development mirror and that the production
> runtime is self-hosted Forgejo. **This document does the opposite.** It
> assumes a reader who naïvely clones this repository into a github.com
> account, enables the workflows under `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`,
> wires up the LLM API keys as secrets, and lets the agent loop run as
> designed. It then enumerates, file by file and feature by feature, the
> clauses of GitHub's [Acceptable Use Policies][aup], the
> [GitHub Terms of Service][tos], and the
> [Service-Specific Terms for Actions and Pages][actions-tos] that such a
> deployment would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review meant to
> warn anyone considering "just turning it on" on github.com.

---

## 0. TL;DR — the headline risks

If you copy the workflows in this repo into a github.com repository and run
them as designed, you are very likely to be in breach of GitHub's terms in at
least the following ways:

1. **Actions misuse.** The agent uses GitHub Actions runners as a general-purpose
   LLM chatbot backend triggered by issue comments. That is not
   "production, testing, deployment, or publication of the software project
   associated with the repository" — which is the only thing the Actions
   service-specific terms permit.
2. **Pages misuse.** The `gmi-public-fabric.yml` and
   `publish-public-fabric.yml` workflows publish AI-generated output as a
   GitHub Pages site whose content is the *product* of the agent, not
   documentation for source code. That is using Pages as a stand-alone
   application backend.
3. **Account-wide self-modifying / self-deleting automation.** The
   `github-intelligence-emergency` workflows take a Personal Access Token
   with `repo` scope across the whole org and use it to **mass-delete every
   `.github/workflows/*.yml` file and every `.github-*-intelligence/`
   folder in every repo in the org**. This is destructive cross-repo
   automation that, on a shared organisation, can interfere with other
   users' work and trip the AUP's "interferes with… any user, host, or
   network" clause.
4. **Self-propagating workflows.** Multiple installer workflows
   (`run-install` jobs) request `actions: write` and `contents: write`
   in order to download workflow YAML from a remote source and commit it
   into `.github/workflows/`. A workflow that installs and upgrades other
   workflows on the same repo is, functionally, self-replicating code.
5. **Resource / quota abuse on public repos.** An issue-comment-triggered
   LLM loop on a public repository turns every drive-by comment into Actions
   minutes and outbound LLM API calls. On the free tier this is consumption
   of GitHub's compute by anonymous third parties for purposes unrelated
   to building the project's software.
6. **Repository as general-purpose data store.** The agent commits its
   conversation memory, session state, and "fabric" output back to git on
   every turn, using the repo as a database / message log rather than as
   source code storage. The AUP forbids using GitHub services "as a
   means of providing… file storage, backup, or data hosting" disconnected
   from the development of the project's code.
7. **Third-party LLM credentials and PII flowing through Actions.** The
   workflows are designed to be configured with `OPENAI_API_KEY`,
   `ANTHROPIC_API_KEY`, etc., and to forward arbitrary user-supplied issue
   text to those providers. A maintainer who enables this on a public repo
   is implicitly running a free LLM proxy on github.com infrastructure.

The remainder of this document goes through each of these in detail and
points at the specific files in this repository.

---

## 1. Inventory of github.com-targeted code in this repo

The following directories ship workflows, scripts, and installer YAML that
**are written to run on github.com** (i.e. live under `.github/workflows/`
or install themselves there). Everything below this section refers back to
files in these directories:

- `FORGEJO-SOCIETY-PRECURSOR/github-minimum-intelligence/.github/workflows/`
  - `github-minimum-intelligence-agent.yml`
  - `gmi-public-fabric.yml`
- `FORGEJO-SOCIETY-PRECURSOR/github-openclaw-intelligence/.github/workflows/`
  - `github-openclaw-intelligence-agent.yml`
  - `gmi-public-fabric.yml`
- `FORGEJO-SOCIETY-PRECURSOR/github-intelligent-hypervisor/.github/workflows/`
  - `ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`
  - plus the installer YAML in
    `FORGEJO-SOCIETY-PRECURSOR/github-intelligent-hypervisor/.issue-intelligence/`
- `FORGEJO-SOCIETY-PRECURSOR/github-intelligence-overwatch/.github/workflows/`
  - `github-openclaw-intelligence-agent.yml`
- `FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`
  - `github-intelligence-emergency-agent.yml`
  - `github-intelligence-emergency-trigger-disable.yml`
  - `github-intelligence-emergency-trigger-kill.yml`
  - `github-intelligence-emergency-dry-run.yml`
  - `publish-public-fabric.yml`
- `FORGEJO-SOCIETY-PRECURSOR/githubification/.github/workflows/`
  - `github-minimum-intelligence-agent.yml`
  - and the installer payload under `.github-minimum-intelligence/install/`

The Forgejo-targeted code under `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/`
is **out of scope** for this warning — it is intended for self-hosted
Forgejo and never touches github.com runners.

---

## 2. Detailed infractions if these workflows are enabled on github.com

### 2.1 Using Actions as a chat / LLM backend (most serious)

**Files.** `github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`, plus their `run-agent` jobs.

**Behaviour.** The `run-agent` job triggers on `issues.opened` and
`issue_comment.created`, reads the issue/comment body, sends it to a
third-party LLM (OpenAI / Anthropic / Gemini / xAI / OpenRouter / Mistral /
Groq), and posts the model's reply back as an issue comment. The agent
exists for *conversational use* — the workflow comments explicitly say
"Open an issue — the agent reads your message and replies!" and "Every
issue is a conversation thread."

**Clause this likely violates.** The
[Actions service-specific terms][actions-tos] state Actions may be used for
*"the automation of the software development lifecycle"* — specifically
"production, testing, deployment, or publication of the software project
associated with the repository." They explicitly forbid using Actions for:

- *"…any other activity unrelated to the production, testing, deployment,
  or publication of the software project associated with the repository
  where the GitHub Actions are used."*
- *"serverless computing"* and *"any other activity that places undue
  burden on GitHub's servers."*

A general-purpose AI chat assistant whose CPU work is unrelated to
building, testing, or releasing the host repository's source code falls
squarely on the wrong side of that line. The fact that the chat happens
to use issues as the UI does not change the underlying use: the runner
cycles are paying for a chatbot, not for a CI of the repo.

### 2.2 Issue-triggered runs on public repos = third-party compute consumption

**Files.** Same `run-agent` jobs as in 2.1.

**Behaviour.** On a *public* repository, anyone with a GitHub account can
open issues and post comments. The workflow has an "Authorize" step that
checks the actor's permission and bails out if it is not write/maintain/
admin (e.g. `github-minimum-intelligence-agent.yml` lines ~308–336). That
authorisation check fires **after** GitHub has already scheduled the
runner. Even rejected runs still consume Actions minutes for the
authorisation step itself.

**Clause this likely violates.** The [AUP][aup] prohibits *"using the
Service to… place an undue burden on our servers through automated means"*
and *"using our servers for any form of excessive automated bulk activity."*
A public, unauthenticated trigger surface that boots a runner per inbound
comment is exactly the pattern those clauses target. It also overlaps with
the Actions terms' prohibition on *"any activity that places undue burden
on GitHub's servers."*

### 2.3 GitHub Pages used as the agent's public surface ("public-fabric")

**Files.** `gmi-public-fabric.yml`,
`FORGEJO-SOCIETY-PRECURSOR/github-openclaw-intelligence/.github/workflows/gmi-public-fabric.yml`,
`publish-public-fabric.yml`.

**Behaviour.** These workflows publish a directory called `public-fabric/`
to GitHub Pages on every push to `main`. The header comment of
`gmi-public-fabric.yml` is unambiguous: *"Publishes the agent's
public-fabric directory as a GitHub Pages site… a live web page powered by
the agent's public output — no separate hosting needed."* So Pages is
deliberately being used as the substitute for hosting the agent.

**Clause this likely violates.** The
[Pages service-specific terms][pages-tos] prohibit using Pages
*"as a free web hosting service to run your online business, e-commerce
site, or any other website that is primarily directed at either commercial
transactions or commercial software-as-a-service (SaaS) operations."* They
also limit Pages to *"personal, organization, or project pages."* A site
whose entire content is generated by an autonomous LLM agent and updated
by a runner on every commit is not a project-documentation site — it is
an application surface, which is precisely what `github-compliance.md`
itself acknowledges is **not** allowed (see line 47 of that file:
"Pages is not being used as a stand-alone application backend").

### 2.4 The "Emergency" workflows — destructive cross-repo automation

**Files.** Everything under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`,
in particular:

- `github-intelligence-emergency-trigger-kill.yml` — *"Deletes all
  `.github/workflows/*.yml` files AND every `.github-*-intelligence`
  folder in each org repo"* (header comment, lines 1–6).
- `github-intelligence-emergency-trigger-disable.yml`
- `github-intelligence-emergency-agent.yml` — installs the others.

**Behaviour.** The kill workflow uses
`secrets.INTELLIGENCE_EMERGENCY_TOKEN` (a Personal Access Token with
`repo` scope across the org) to walk every repository in
`github.repository_owner` and physically delete workflow files and agent
folders. It is gated by deleting a tripwire file in the controlling repo.

**Clauses this likely violates.**

1. The AUP forbids *"interfering with or disrupting the access of any
   user, host, or network."* In a multi-user organisation, a single
   maintainer pushing one file deletion would silently rip CI out of every
   sibling project. That is interference with other users' service.
2. PAT-based cross-repo writes from a workflow trigger also strain
   GitHub's [scoping guidance for tokens][gh-tokens] — the very design
   ("a PAT with `repo` scope across the organisation, stored as a
   single-repo Actions secret") is the anti-pattern the documentation
   warns against.
3. If any deleted repository belongs to a different legal owner (e.g. a
   contributor's fork that landed under the org), the deletion crosses
   into *"access… any data, account, or network without authorisation"*
   territory under the AUP, depending on consent.

The fact that there is a "dry-run" fail-safe (`DELETE-TO-ACTIVATE.md`)
mitigates accidents but does not change the policy posture — the
production code path is destructive automated bulk modification of other
repositories.

### 2.5 Self-installing / self-upgrading workflows (`actions: write`)

**Files.** Every `run-install` job in the agent workflows — e.g.
`github-minimum-intelligence-agent.yml` lines 75–276 and the corresponding
job in `github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`, and the
`github-intelligence-emergency-agent.yml`.

**Behaviour.** These jobs are `workflow_dispatch`-triggered, declare
`permissions: actions: write` (see `github-minimum-intelligence-agent.yml`
line 70: *"Allow the run-install job to push commits that subsequently
trigger workflows"*), download a release tarball from a remote
`japer-technology/...` repo, extract it into the current repo's
`.github-*-intelligence/` directory, and `git push` the result. On
upgrade, they overwrite their own workflow contents.

**Clauses / security concerns this raises.**

1. **Supply chain.** A workflow that pulls arbitrary content from a remote
   GitHub release and commits it into `.github/workflows/` of the calling
   repo is, by construction, an automated supply-chain ingestion path.
   If the upstream release is ever compromised, every repo that has run
   the installer auto-upgrades to the compromised version on next dispatch.
2. **Self-replication.** The combination of `contents: write +
   actions: write + workflow_dispatch + downloads-and-commits-workflows`
   is the textbook description of a self-replicating workflow. The AUP
   forbids *"using GitHub to… distribute malware"* and *"any virus,
   worm, defect, Trojan horse, or any item of a destructive nature."*
   Even if the maintainers' intent is benign, the *mechanism* matches
   the pattern policy enforcement looks for.
3. The `id-token: write` permission used in the Pages publishers compounds
   the blast radius if the installer pipeline is ever subverted, because
   OIDC tokens minted from these workflows can be exchanged for cloud
   credentials at third-party providers.

### 2.6 Repository as agent memory / database

**Files.** All `run-agent` jobs commit to:

- `.github-minimum-intelligence/state/` (session state)
- `.github-minimum-intelligence/memory.log` (configured with
  `merge=union` in `.gitattributes` precisely because it is a high-write
  log file — see `github-minimum-intelligence-agent.yml` lines ~246–252)
- `public-fabric/` (rendered output)

**Clause this likely violates.** The [AUP][aup] forbids *"use our servers
for… file storage, backup, or data hosting [unrelated to development]."*
Append-only conversation logs that grow per issue comment, and a
`union`-merged log file specifically engineered to absorb high write
contention from parallel Actions runs, are operating Git as a write-heavy
data store. That is the use pattern the rule is aimed at.

### 2.7 Third-party LLM API keys flowing through Actions secrets

**Files.** Header comments of the agent workflows; the `Authorize` and
`run-agent` job environments.

**Behaviour.** The workflows are designed to be configured with one or
more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, `GROQ_API_KEY`.
Each invocation forwards user-supplied issue text to the corresponding
provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing their
   API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A public repo
   whose issue tracker is wired straight to your `OPENAI_API_KEY` is, in
   effect, a public LLM proxy. Provider-side ToS violations are not
   GitHub's problem, but they are *yours* the moment you flip the switch.
2. **GitHub AUP.** *"You may not use the Service to violate the rights
   of others, including… any law, regulation, or third-party agreement."*
   Running someone else's API in violation of their ToS via Actions
   pulls the github.com side of the operation into that clause too.
3. **PII / data export.** Any contributor's issue body — potentially
   including private data in bug reports — is shipped to a third-party
   inference provider. On public projects this needs at minimum a clear
   notice; on internal/enterprise repos it can be a data-handling
   compliance failure (GDPR, HIPAA, etc., depending on the deployment).

### 2.8 Bot impersonation and audit-trail laundering

**Files.** `Commit and push` steps in the installer jobs — e.g.
`github-minimum-intelligence-agent.yml` lines 256–276 — set
`git config user.name "github-actions[bot]"` /
`user.email "github-actions[bot]@users.noreply.github.com"` for commits
that the *agent itself* (not the GitHub Actions service) generated.

**Concern.** Attributing AI-authored commits to `github-actions[bot]`
deliberately hides the LLM as the author. Whether this is an outright
ToS violation is debatable, but it is the kind of *misattribution*
pattern that GitHub's policies on authentic identity and "no
misrepresentation" are written to discourage, and it makes downstream
licence / DCO compliance much harder for anyone who later audits the
repo.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed"*
(`gmi-public-fabric.yml` header). The whole point is to use Actions
runners + Pages + Git history together as a free hosting platform for an
AI service. That is precisely the use pattern the Actions and Pages
service-specific terms exist to prevent.

---

## 3. Per-policy summary

| Policy clause | Triggering files | Why |
|---|---|---|
| Acceptable Use Policy — *no excessive automated bulk activity* | All `run-agent` jobs; emergency-kill | Per-comment runner spawns; mass cross-repo deletes |
| Acceptable Use Policy — *no interfering with other users / hosts* | `github-intelligence-emergency-trigger-kill.yml` | Deletes workflows in other repos in the org |
| Acceptable Use Policy — *no using servers for file storage / data hosting* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Acceptable Use Policy — *no malware / self-replicating code* | Installer jobs with `actions: write` | Workflow installs and upgrades workflows from a remote source |
| Acceptable Use Policy — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| Actions service terms — *only for SDLC of the host repo* | All `run-agent` jobs | Runner is doing AI inference / chatbot, not building/testing the repo |
| Actions service terms — *no serverless computing / undue burden* | All `run-agent` jobs | Runner used as on-demand compute for an external workload |
| Pages service terms — *no stand-alone application backend* | `gmi-public-fabric.yml`, `publish-public-fabric.yml` | Pages is the agent's public surface, not project docs |
| Token-scoping guidance | `INTELLIGENCE_EMERGENCY_TOKEN` PAT | Org-wide `repo`-scoped PAT stored as a single-repo Actions secret |

---

## 4. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`github-compliance.md`](github-compliance.md) already says):

- The maintainers state explicitly that the production runtime is
  Forgejo, not github.com, and that the github.com mirror is for
  development of source only.
- The Forgejo-side workflows under `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/`
  are not subject to GitHub's terms at all — Forgejo's licence and
  policies apply there instead.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/`, which is by name a historical / precursor
  archive being migrated away from a github.com runtime.
- Nothing in this repo, on its own, is currently *running* as a service on
  github.com infrastructure. The infractions catalogued here are
  conditional on a third party enabling the workflows.

The warning is therefore aimed at:

- Anyone forking this repo and turning on the workflows under
  `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/` on a github.com repo.
- Reviewers evaluating whether the design described in this repo is
  appropriate for a github.com deployment (it is not — it is
  appropriate only for the Forgejo runtime the project actually targets).

If you are a maintainer or downstream user and you intend to run *any*
of the `run-agent`, `run-install`, `kill`, or `gmi-public-fabric`
workflows on github.com, re-read the linked policies first, scope a
fresh, *least-privilege*, single-repo PAT (never an org-wide one), and
treat issue-triggered LLM inference as something that must move to
Forgejo before going anywhere near a public repo.

---

## 5. Recommended remediations (if you must run on github.com at all)

Listed without changing the project's stated direction (move to Forgejo):

1. **Disable** every workflow under `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`
   on any github.com fork by default; require an explicit opt-in.
2. **Drop `actions: write`** from every installer job. Distribute the
   agent as a release artefact users install manually, not as a workflow
   that rewrites `.github/workflows/`.
3. **Remove the `gmi-public-fabric` and `publish-public-fabric`
   workflows** from any github.com deployment; serve the agent's public
   surface from Forgejo Pages or another host.
4. **Replace `INTELLIGENCE_EMERGENCY_TOKEN`** (org-wide PAT) with
   per-repo, fine-grained tokens scoped only to the repo they manage,
   and remove the cross-repo "kill all" mode entirely from the github.com
   variant.
5. **Gate `run-agent`** behind a private repo or a strict allowlist
   *before* the runner boots (e.g. a `repository_dispatch`-only trigger
   that an out-of-band authorisation service fires) so that anonymous
   issue traffic cannot consume Actions minutes.
6. **Rate-limit and log** every LLM call, and document a privacy notice
   that issue contents are forwarded to third-party providers.
7. **Stop committing per-turn memory** (`memory.log`, `state/`) on
   github.com; keep that data on the Forgejo side only, where the
   repository-as-database pattern is not a ToS issue.

---

## 6. References

- GitHub Acceptable Use Policies — [`aup`][aup]
- GitHub Terms of Service — [`tos`][tos]
- Service-Specific Terms (Actions, Pages, etc.) — [`actions-tos`][actions-tos],
  [`pages-tos`][pages-tos]
- Existing maintainer posture document — [`github-compliance.md`](github-compliance.md)

[aup]: https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies
[tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service
[actions-tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#actions
[pages-tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages
[gh-tokens]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
