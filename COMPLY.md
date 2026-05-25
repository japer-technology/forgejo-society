# COMPLY

> How this repository is **assured of compliance** with the two GitHub
> regimes named in the project question:
>
> 1. **GitHub Agentic Workflows (`gh-aw`)** — the design and guardrail
>    documentation published at <https://github.github.com/gh-aw>.
> 2. **GitHub Site Policy** — the binding terms published under
>    <https://docs.github.com/en/site-policy/>, including the Terms of
>    Service, the Acceptable Use Policies, and the Service-Specific
>    Terms for additional products and features (Actions, Pages, etc.).
>
> This file is an **assurance map**, not a re-statement of either body
> of rules. It points at the structural facts of this repository that
> make compliance the default rather than the exception, and it points
> readers at the load-bearing documents that already define the
> posture in detail.
>
> Read [`WARNING.md`](WARNING.md) and the four-document compliance set
> it references **first**. This file only makes sense on top of them.

---

## 0. The short version

Forgejo Society is a **self-hosted, local-first cognitive forge**. Its
runtime is a Forgejo instance on Ubuntu hardware owned and operated by
the maintainers. **github.com is a development mirror only**: no
agent execution, no runners attached, no agent secrets, no
agent-produced public surface.

That single structural fact is what makes compliance with both
regimes tractable:

- For **`gh-aw`**: this repository does not install or run agentic
  workflows on github.com. There is no `.github/workflows/` directory
  at the repository root, no `gh-aw` extension is invoked against
  github.com, and the runnable agent code under
  [`.forgejo-intelligence/`](.forgejo-intelligence/) targets
  self-hosted [Forgejo Actions](https://forgejo.org/docs/latest/admin/actions/)
  via [`.forgejo/workflows/`](.forgejo/workflows/), not GitHub Actions.
- For **GitHub Site Policy**: the only uses this repository makes of
  github.com are the ones explicitly permitted by the
  [Acceptable Use Policies][aup] and the
  [Service-Specific Terms for Actions and Pages][actions-tos] —
  hosting source, issues, pull requests, and (where enabled at all)
  Actions limited to building, linting, or testing the software in
  this repository.

The detailed mapping lives in the four-document compliance set under
[`FORGEJO-SOCIETY-INTRODUCTION/warning/`](FORGEJO-SOCIETY-INTRODUCTION/warning/).
This file does not replace those documents; it makes their joint
conclusion explicit.

---

## 1. Compliance regime 1: GitHub Agentic Workflows (`gh-aw`)

`gh-aw` is GitHub Next's design for authoring agentic workflows in
natural-language Markdown and running them on GitHub Actions, with an
explicit guardrail model: read-only permissions by default,
write operations only through sanitised `safe-outputs`, sandboxed
execution, network isolation, SHA-pinned dependencies, tool
allow-listing, and compile-time validation. See
<https://github.github.com/gh-aw/> and the
[security architecture](https://github.github.com/gh-aw/introduction/architecture/).

### 1.1 How this repository relates to `gh-aw`

This repository is **not** a `gh-aw` deployment. It is structurally
adjacent — both projects describe governed AI agents running inside a
forge — but the runtime substrate is different:

| Question | `gh-aw` answer | This repository's answer |
| --- | --- | --- |
| Where do workflows execute? | GitHub Actions runners on github.com (or self-hosted runners attached to github.com). | Forgejo Actions runners attached to a self-hosted Forgejo on owned Ubuntu hardware. |
| Where do workflows live? | `.github/workflows/` and the `gh-aw` extension. | [`.forgejo/workflows/`](.forgejo/workflows/), invoking code in [`.forgejo-intelligence/`](.forgejo-intelligence/). |
| Where is the public surface? | GitHub Pages / GitHub UI. | Forgejo UI on the maintainers' own infrastructure. |
| Where do LLM API keys live? | GitHub Actions secrets on github.com. | Secrets on the self-hosted Forgejo; never on github.com. |

### 1.2 How `gh-aw`'s guardrails map onto this repository

The `gh-aw` guardrails are a reasonable independent yardstick for any
agent-on-forge design. The following table records how this
repository satisfies each guardrail **on its own (Forgejo) runtime**,
and why each guardrail is satisfied **trivially on github.com** by
not running the agent there at all.

| `gh-aw` guardrail | Posture on the Forgejo runtime | Posture on github.com |
| --- | --- | --- |
| Read-only permissions by default; writes only via sanitised `safe-outputs`. | Authority levels are strictly `read`, `draft`, `propose`, `act`, `govern`, `human` — see [`SOCIETY-OF-REPO/01-governance/authority-registry.md`](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md). Defaults are `read` / `draft`; `act` and above require an explicit grant. | No agent runs on github.com, so no write capability is exposed. |
| Sandboxed execution. | Agent processes run inside the self-hosted Forgejo runner fleet on Ubuntu 24.04 LTS (see [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/09-runner-scale-strategy.md`](FORGEJO-SOCIETY-INSTALLATION/transition-plan/09-runner-scale-strategy.md)), under the censor / critic governance described in [`THE-SOCIETY-OF-REPO/`](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/). | Not applicable — no agent on github.com. |
| Input sanitisation. | Bridge and guardrail modules under [`.forgejo-intelligence/`](.forgejo-intelligence/) gate every external signal before it reaches an agency. | Not applicable. |
| Network isolation / egress control. | Documented in the censor model (e.g. `censor.cloud-egress`) inside [`THE-SOCIETY-OF-REPO/`](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/). | Not applicable. |
| Supply-chain security / SHA-pinned dependencies. | Bun lockfile and pinned runtimes inside [`.forgejo-intelligence/`](.forgejo-intelligence/); Forgejo Actions references are pinned per [`forgejo-compliance.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md). | github.com has no agent workflows to pin. |
| Tool allow-listing. | Agencies declare their tool surface; the orchestrator refuses tools that are not on the allow-list. | Not applicable. |
| Compile-time validation. | Type-checked TypeScript under [`.forgejo-intelligence/`](.forgejo-intelligence/), tested with `bun test` and `bun run check:phase9`. | Not applicable. |
| Access gating to team members; human approval gates for critical operations. | Encoded in the `human` authority level and the settlement process under [`THE-SOCIETY-OF-REPO/07-workspace/active-settlements/`](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/active-settlements/). | Not applicable. |

### 1.3 Why this repository is *assured* of compliance with `gh-aw`

Assurance — as opposed to good intentions — rests on four
structural properties of the repository, each of which can be
inspected without running anything:

1. **Absence of `.github/workflows/`.** The repository root contains
   no `.github/` directory at all. There is therefore no GitHub
   Actions surface for `gh-aw` (or any agentic workflow) to attach
   itself to on github.com.
2. **All runtime artefacts target Forgejo.** The runnable agent code
   lives under [`.forgejo-intelligence/`](.forgejo-intelligence/) and
   is invoked exclusively from [`.forgejo/workflows/`](.forgejo/workflows/).
   These paths are meaningful to Forgejo, not to github.com.
3. **Documented refusal of cross-platform execution.** The four-
   document compliance set under
   [`FORGEJO-SOCIETY-INTRODUCTION/warning/`](FORGEJO-SOCIETY-INTRODUCTION/warning/)
   explicitly forbids enabling agent workflows on github.com, on
   Codeberg, on GitLab, on Bitbucket, on Azure DevOps, on AWS
   CodeCommit, and on SourceForge.
4. **Auditable governance.** The authority levels (`read`, `draft`,
   `propose`, `act`, `govern`, `human`) and identifier format
   (`{scope}.{kind}.{name}[.{version}]`, with scopes such as `agency`,
   `critic`, `censor`, `kline`, `settlement`, `event`) are normative.
   Any change that would relax a guardrail must therefore amend a
   named document, in git, under review — which leaves a record.

If, at some future point, a maintainer wishes to run any portion of
this system on github.com using `gh-aw` itself, the compliance work
must begin by amending [`github-compliance.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md)
and [`github-warning.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-warning.md)
in the same change. Until then, the assurance above holds by
construction.

---

## 2. Compliance regime 2: GitHub Site Policy

The site-policy documents that bind any use of github.com are:

- [GitHub Terms of Service][tos]
- [GitHub Acceptable Use Policies][aup]
- [GitHub Community Guidelines][community]
- [Service-Specific Terms for additional products and features][actions-tos] (Actions, Pages, Packages, etc.)
- [Privacy Statement][privacy]
- [DMCA Takedown Policy][dmca]

The relevant clauses for an agentic-workflow project are the AUP's
restrictions on using github.com infrastructure as a generic backend,
and the Actions/Pages service terms restricting those services to the
production, testing, deployment, or publication of the software
project associated with the repository.

### 2.1 Site-policy mapping

| GitHub surface | How this repository uses it | Site-policy basis |
| --- | --- | --- |
| Repository storage | Source of truth during development; mirrored to Forgejo / Codeberg / GitLab / Bitbucket. Not a generic backup or file-storage service. | [AUP][aup] — permitted use of repository storage in connection with developing the project's software. |
| Issues | Development discussion, task tracking, and security triage per [`SECURITY.md`](SECURITY.md). | [AUP][aup] / [Community Guidelines][community] — standard collaboration use. |
| Pull requests | Code review during development. | [AUP][aup] — standard collaboration use. |
| GitHub Actions | Not used as an agent runtime. Where enabled at all, limited to building, linting, or testing the source in this repository. | [Service-Specific Terms — Actions][actions-tos] — Actions are for the production, testing, deployment, or publication of the software project associated with the repository. |
| GitHub Pages | Not used as a runtime surface for the agent. The agent's public surface is published from Forgejo. | [Service-Specific Terms — Pages][actions-tos] — Pages is not used as a stand-alone application backend. |
| Packages / Releases | Not used as a distribution channel for agent runtime artefacts. | [Service-Specific Terms][actions-tos] — not used as a generic distribution service. |
| Secrets | No secrets, API keys, or credentials are committed. The Forgejo-side runtime credentials never transit github.com. | [AUP][aup] — credentials are not stored in source, and agent credentials are not configured on github.com at all. |

The full clause-by-clause mapping, together with an adversarial
re-reading of what would break each clause if the posture were
ignored, lives in [`github-compliance.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md)
and [`github-warning.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-warning.md).

### 2.2 Things this repository explicitly does **not** do on github.com

To make the boundary explicit, this project does not — and is not
designed to — use github.com infrastructure for any of the following,
all of which are prohibited by the [AUP][aup] or the
[Actions terms][actions-tos]:

- Cryptocurrency mining.
- Launching denial-of-service attacks.
- Serving as a content delivery network, generic file backup, or media host.
- Running a stand-alone SaaS product, or providing compute-as-a-service to third parties.
- Spam, scraping at scale, or automated abuse of GitHub's APIs.
- Bypassing or circumventing GitHub's rate limits, quotas, or billing.
- Hosting malware, phishing content, or content that violates third-party rights.
- Running an issue-comment-triggered LLM loop on github.com infrastructure.
- Using GitHub Pages as the public surface of an agent.
- Storing or proxying third-party LLM credentials through GitHub Actions on a public repository.

No code in this repository implements any of the above, and the
warning documents under
[`FORGEJO-SOCIETY-INTRODUCTION/warning/`](FORGEJO-SOCIETY-INTRODUCTION/warning/)
document — file by file — why a naïve "just turn it on" deployment
would breach the relevant clauses.

### 2.3 Privacy, takedowns, and reporting

- **Privacy.** The repository does not collect personal data from
  visitors of github.com beyond what GitHub itself records under its
  [Privacy Statement][privacy].
- **DMCA / content complaints.** Follow the
  [GitHub DMCA Takedown Policy][dmca].
- **Security reporting.** Follow [`SECURITY.md`](SECURITY.md). Do
  not include exploit details, secrets, or personal data in a public
  github.com issue.
- **Site-policy compliance concerns.** Open a github.com issue
  identifying the file and the specific site-policy clause you
  believe applies. Maintainers will respond by correcting the
  content, moving the affected behaviour to the Forgejo runtime, or
  explaining why the use is in fact permitted.

---

## 3. Structural assurances (what to inspect)

A reader who wants to verify the claims above without trusting any
single document can inspect the following structural properties of
the repository:

1. **No `.github/workflows/` directory at the repository root.** No
   GitHub Actions surface exists for an agent to attach itself to.
2. **All workflow YAML lives under `.forgejo/workflows/`.** That path
   is meaningful to Forgejo, not to github.com.
3. **All runnable agent code lives under `.forgejo-intelligence/`.**
   It is invoked only from `.forgejo/workflows/`, and its
   `package.json` and `README.md` document the local
   `bun test` / `bun run check:phase9` workflow.
4. **Authority levels are closed.** They are strictly `read`,
   `draft`, `propose`, `act`, `govern`, `human`, with no other
   values permitted.
5. **Identifiers are closed.** They follow
   `{scope}.{kind}.{name}[.{version}]` with a documented scope list,
   so any new capability is visible as a new identifier under review.
6. **Compliance is paired with warning.** Every platform has both a
   compliance document *and* an adversarial warning document; the
   compliance document alone is not treated as a defence.
7. **The runtime target is named and owned.** Self-hosted Forgejo on
   owned Ubuntu hardware (see [`FORGEJO-SOCIETY-INSTALLATION/`](FORGEJO-SOCIETY-INSTALLATION/)).
   Shared Forgejo instances are mirrors, not runtimes.

If any of these properties ceases to hold, this file becomes
inaccurate and should be updated in the same change that breaks the
property — together with the affected document under
[`FORGEJO-SOCIETY-INTRODUCTION/warning/`](FORGEJO-SOCIETY-INTRODUCTION/warning/).

---

## 4. Where to read next

- [`WARNING.md`](WARNING.md) — the load-bearing entry point.
- [`FORGEJO-SOCIETY-INTRODUCTION/warning/README.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/README.md)
  — the full platform-by-platform compliance / warning index.
- [`FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md)
  and [`github-warning.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/github-warning.md)
  — the detailed clause-by-clause mapping for github.com.
- [`FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md)
  and [`forgejo-warning.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-warning.md)
  — the posture on the actual runtime.
- [`SECURITY.md`](SECURITY.md) — how to report a security or
  compliance issue privately.
- [`GOVERNANCE.md`](GOVERNANCE.md) — who decides what, and how.

[tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service
[aup]: https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies
[community]: https://docs.github.com/en/site-policy/github-terms/github-community-guidelines
[actions-tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
[privacy]: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
[dmca]: https://docs.github.com/en/site-policy/content-removal-policies/dmca-takedown-policy

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80" title="Forgejo Society">
  </picture>
</p>
