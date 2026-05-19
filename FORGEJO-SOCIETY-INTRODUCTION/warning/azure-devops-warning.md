# Azure DevOps Warning

> **Adversarial counterpart to [`azure-devops-compliance.md`](azure-devops-compliance.md).**
>
> `azure-devops-compliance.md` describes the maintainers' *intended*
> posture — that Azure DevOps Services is not part of this project at
> all, that the runtime target is a self-hosted Forgejo on
> operator-owned Ubuntu hardware, and that no agent runtime is
> ported to Azure Pipelines, Azure Repos, Azure Artifacts, or any
> other Microsoft Developer Tools surface. **This document does the
> opposite.** It assumes a reader who is sitting on an existing
> Azure DevOps organization, pushes a copy of this repository into an
> Azure Repos Git repository, writes an `azure-pipelines.yml` and a
> set of YAML pipeline templates that translate the agent workflows
> under `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`
> (or their github precursors under
> `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`) into Azure
> Pipelines stages and jobs, registers either Microsoft-hosted parallel
> jobs or a self-hosted agent pool, wires up the LLM API keys as Azure
> Key Vault secrets surfaced through a variable group, attaches a
> Microsoft Entra ID service principal with `Build Administrators` and
> `Project Collection Administrators` rights, and lets the agent loop
> run as designed. It then enumerates, feature by feature, the clauses
> of the [Microsoft Online Services Terms][mos-terms], the relevant
> [Microsoft Product Terms][mos-product-terms] sections (for Azure
> DevOps Services, Azure, and Azure Key Vault), and the
> [Microsoft Acceptable Use Policy][mos-aup] that such a deployment
> would plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on an Azure
> DevOps organization, or on any Microsoft tenant that uses Azure
> Pipelines as a substitute Git-triggered runtime.

---

## 0. The headline risks

This repository ships **no `azure-pipelines.yml`**, **no Azure
Pipelines YAML template library**, **no ARM / Bicep / Terraform that
provisions an Azure DevOps organization, a project, an Azure Repos
repository, an Azure Pipelines pipeline, an Azure Artifacts feed, an
Azure Key Vault, or a Microsoft Entra ID service principal for the
agent**, and no Azure-targeted workflows; the agent runtime is
structurally absent from the Azure DevOps side. The risks in this
document materialise only if a reader *translates* the existing
Forgejo Actions or GitHub Actions workflows into Azure Pipelines
resources and enables them. If you do that and run them as designed,
you are very likely to be in breach of Microsoft's terms in at least
the following ways:

1. **Azure Pipelines misuse as a chat / LLM backend.** The agent uses
   pipeline runs as a general-purpose LLM chatbot backend triggered by
   Azure Repos pull-request and comment events (via the built-in PR
   triggers, the Azure DevOps REST API, or a service hook posting back
   into the pipeline). That is not "building, testing, or deploying
   the customer's software" — which is the role Azure Pipelines'
   product terms anticipate. Microsoft-hosted parallel jobs are billed
   per minute beyond the free tier, so the misuse is also a direct
   cost-amplification vector.
2. **Azure Artifacts / pipeline artifacts misuse as the agent's
   public surface.** Translating the `gmi-public-fabric.yml` and
   `publish-public-fabric.yml` publishers into a pipeline job that
   uploads `public-fabric/` as a pipeline artifact (or pushes it into
   an Azure Storage static-website container via an Azure CLI task)
   would publish AI-generated output as a static site whose content is
   the *product* of the agent, not documentation for source code.
   Microsoft permits the underlying primitives in principle, but the
   operator becomes a content-publisher under the
   [Microsoft Acceptable Use Policy][mos-aup] for everything the agent
   writes.
3. **Organization-wide self-modifying / self-deleting automation.**
   The "emergency" workflows take a credential with broad scope across
   the project collection and use it to **mass-delete every workflow
   file and every agent folder in every repository the credential can
   reach**. A naïve Azure DevOps translation would grant the
   executing service principal `Project Collection Administrators` or
   `Build Administrators` membership and a PAT scoped to
   `Code (read & write)` and `Build (read & execute)` across the
   organization. That principal can silently rip the agent — and any
   colocated files — out of every Azure Repos repository in the
   organization, including repositories owned by other teams.
4. **Self-propagating pipelines.** The installer jobs request write
   access to repository contents and to the pipeline definition in
   order to download workflow YAML from a remote source and commit it
   into the calling repository. An Azure Pipelines job that installs
   and upgrades the `azure-pipelines.yml` (and the linked YAML
   template repository) on the same repository is, functionally,
   self-replicating code.
5. **Resource / quota abuse from public triggers.** If an Azure Repos
   repository is fronted by a service hook or by the public REST API,
   every inbound comment becomes a pipeline run and an outbound LLM
   API call. Microsoft-hosted parallel-job minutes, REST API call
   quotas, and LLM tokens all bill on consumption. Quota exhaustion
   attacks against the owner are the obvious follow-on; Azure cost
   alerts on the linked Azure subscription are the only backstop.
6. **Repository as general-purpose data store.** The agent commits
   its conversation memory, session state, and "fabric" output back
   to git on every turn, using the repo as a database / message log
   rather than as source-code storage. Azure Repos is licensed per
   user under the Azure DevOps Services basic / basic + test plans;
   the [Azure DevOps Data Protection Overview][azure-devops-data-protection]
   describes the service as code-and-work-item storage, not as a
   high-write append-only log store. An append-only LLM transcript
   stored in a managed Git service is exactly the kind of pattern that
   gets flagged.
7. **Third-party LLM credentials and PII flowing through Azure Key
   Vault and Azure Pipelines variable groups.** The workflows are
   designed to be configured with `OPENAI_API_KEY`,
   `ANTHROPIC_API_KEY`, etc., and to forward arbitrary user-supplied
   issue text to those providers. A maintainer who enables this on an
   Azure DevOps organization is implicitly running a free LLM proxy on
   Microsoft infrastructure, with the LLM provider's terms layered on
   top of Microsoft's terms.

The remainder of this document goes through each of these in detail
and points at the specific files in this repository that a reader
would have to translate to reach the failure mode.

---

## 1. Inventory of source that a reader would translate to Azure DevOps

There is no Azure-targeted code in this repository. The risks below
apply to a hypothetical port of the following directories into an
`azure-pipelines.yml`, a set of YAML pipeline templates, and the
supporting Microsoft Entra ID service principal, Azure Key Vault, and
variable groups on an Azure DevOps organization:

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

The Forgejo-targeted, github-targeted, gitlab-targeted, and
AWS-CodeCommit-targeted runtime designs are out of scope for this
warning in their *own* hosts — Forgejo coverage lives in
[`forgejo-warning.md`](forgejo-warning.md), github.com coverage in
[`github-warning.md`](github-warning.md), GitLab coverage in
[`gitlab-warning.md`](gitlab-warning.md), and AWS coverage in
[`aws-codecommit-warning.md`](aws-codecommit-warning.md). This
document is about what happens if any of those is dropped onto Azure
Repos + Azure Pipelines + Azure Key Vault.

---

## 2. Detailed infractions if these workflows are translated and enabled on Azure DevOps

### 2.1 Using Azure Pipelines as a chat / LLM backend (most serious)

**Source.** The `run-agent` jobs in `forgejo-intelligence-WORKFLOW-AGENT.yml`
and in the github precursors (`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour after translation.** A pipeline trigger on Azure Repos
pull-request and comment events starts an Azure Pipelines run. That
run reads the event body, sends it to a third-party LLM (OpenAI /
Anthropic / Gemini / xAI / OpenRouter / Mistral / Groq), and posts
the model's reply back as a pull-request comment via
`az repos pr comment create` or a direct call to the Azure DevOps
REST API. The agent exists for *conversational use* — the workflow
comments and surface docs describe pull requests as "a conversation
thread" with the agent.

**Clause this likely violates.** The
[Microsoft Product Terms][mos-product-terms] for Azure DevOps
Services describe Azure Pipelines as a service for building, testing,
and deploying the customer's own code; the
[Microsoft Acceptable Use Policy][mos-aup] forbids using Microsoft
online services in a manner that is abusive of the service's intended
use or that imposes an undue burden on the platform. A
general-purpose AI chat assistant whose pipeline-minutes are unrelated
to building, testing, or releasing the host repository's source code
falls squarely on the wrong side of that line. The fact that the chat
happens to use Azure Repos pull requests as the UI does not change
the underlying use: the pipeline-minutes are paying for a chatbot,
not for CI of the project.

### 2.2 PR/comment-triggered runs on shared-organization repositories = cross-tenant compute consumption

**Source.** The same `run-agent` jobs and the issue / merge-request /
pull-request surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour after translation.** On a repository whose Azure Repos
permissions are open to multiple project members (employees,
contractors, federated guest users), any member with
`Contribute to pull requests` can fire the pipeline trigger and start
a Microsoft-hosted job. The workflow's "Authorize" step checks the
actor's permission and bails out if it is not one of the trusted
identities. That authorisation check fires **after** the
Microsoft-hosted agent has already been billed for the queue and
agent-provisioning time.

**Clause this likely violates.** The
[Microsoft Acceptable Use Policy][mos-aup] forbids operating
workloads that are abusive of an online service's intended use or
that interfere with other customers' use of the service. A trigger
surface that boots a pipeline run per inbound comment also collides
with the per-organization parallel-job limit (Azure DevOps Services
ships with one free Microsoft-hosted CI/CD parallel job per
organization; additional parallel jobs are paid) and the Azure
DevOps REST API rate-limit "TSTUs"; on a shared organization this
saturates a limit that other teams in the same organization depend
on. The cost-amplification on the organization owner is direct and
unbounded — Microsoft-hosted parallel jobs bill per minute
regardless of whether the eventual `Authorize` step rejects the run.

### 2.3 Azure Artifacts / Azure Storage static site used as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and
`publish-public-fabric.yml`.

**Behaviour after translation.** Translated into an Azure Pipelines
job that ends with `az storage blob upload-batch -d $web -s ./public-fabric`
against an Azure Storage account configured for static website
hosting (often fronted by Azure Front Door or Azure CDN), these
workflows would publish a directory called `public-fabric/` to a
public website on every push to the default branch. The original
header comments are unambiguous: a live web page powered by the
agent's public output, with "no separate hosting needed." Azure
Storage static websites + Azure Front Door are deliberately being
used as the substitute for hosting the agent.

**Clauses / risks this raises.**

1. Microsoft permits static hosting on Azure Storage + Azure Front
   Door for arbitrary content the customer is entitled to publish,
   but the operator becomes the publisher under the
   [Microsoft Acceptable Use Policy][mos-aup] for everything the
   container contains. AI-generated text triggered by anonymous
   inbound traffic means the operator is on the hook for any
   defamatory, infringing, or prohibited output the model produces.
2. Azure Storage and Azure Front Door egress bills on data
   transferred. A public `public-fabric/` site whose content can be
   enlarged by inbound prompt-injection is a cost-amplification
   vector against the subscription owner, not a documentation site.
3. Lack of edit/review between LLM generation and public surface
   means the published content cannot be retracted before it is
   cached at Front Door edge locations.

### 2.4 The "Emergency" workflows — destructive cross-repository automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and
  every agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour after translation.** An Azure DevOps port of the kill
workflow would attach a Microsoft Entra ID service principal (or a
classic PAT) holding `Code (read & write)` and `Build (read,
execute & manage)` scope across every Azure Repos repository and
every Azure Pipelines pipeline in the project collection (and, in
the worst case, `Project Collection Administrators` membership) and
walk every repository in the organization to physically delete
`azure-pipelines.yml`, linked YAML templates, and agent folders. The
corresponding pipeline would be granted a service connection that
lets the original `*-emergency-agent.yml`-equivalent pipeline assume
it. It is gated by deleting a tripwire file in the controlling
repository.

**Clauses / risks this raises.**

1. The [Microsoft Online Services Terms][mos-terms] require that the
   customer use Microsoft online services in a manner consistent with
   the permissions of the underlying tenant and not interfere with
   other customers' use of the service. In a multi-team Azure DevOps
   organization, a single maintainer triggering this workflow would
   silently rip CI out of every sibling team's Azure Repos
   repository. That is interference with other principals' workloads
   inside the same organization boundary.
2. The service-principal design itself is the anti-pattern that
   [Microsoft Entra ID best practices][entra-best-practices] exist to
   discourage. A single Azure Pipelines service connection with
   organization-wide `Code (write)` and `Build (manage)` is precisely
   the credential profile Microsoft Defender for Cloud and Microsoft
   Entra ID Conditional Access are designed to flag.
3. If any deleted repository is mirrored downstream (Azure Repos ↔
   GitHub via Azure Pipelines `checkout` of an external repository,
   or to a downstream release pipeline that builds an actual
   product), the deletion can propagate beyond the Azure DevOps
   organization boundary, depending on the mirroring direction.
4. Azure Repos does not currently expose a per-repository "deletion
   protection" flag equivalent to Azure Storage immutability; once a
   branch or repository is deleted by an authorised principal,
   recovery relies on whatever out-of-band backup the operator
   maintains and on Microsoft's "soft delete" window for the
   organization.

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

**Behaviour after translation.** An Azure DevOps port of these jobs
would be manually-triggered pipeline runs (or
release-pipeline manual-approval stages) that hold a PAT or service
connection with permission to `git push` into the Azure Repos
repository and to mutate the project's own `azure-pipelines.yml` and
linked YAML template repository. They download a release tarball from
a remote upstream, extract it into the current repository's agent
directory, and `git push` the result. On upgrade, they overwrite
their own `azure-pipelines.yml`.

**Clauses / security concerns this raises.**

1. **Supply chain.** An Azure Pipelines job that pulls arbitrary
   content from a remote release and commits it into
   `azure-pipelines.yml` and the project's agent directory is, by
   construction, an automated supply-chain ingestion path. If the
   upstream release is ever compromised, every organization that has
   run the installer auto-upgrades to the compromised version on next
   dispatch.
2. **Self-replication.** The combination of write-contents + write-
   pipeline-definition + manual trigger + downloads-and-commits-
   pipelines is the textbook description of a self-replicating
   pipeline. The [Microsoft Acceptable Use Policy][mos-aup] forbids
   using Microsoft online services to distribute malware or items of
   a destructive nature. Even if the maintainers' intent is benign,
   the *mechanism* matches the pattern abuse enforcement looks for.
3. If the project later adopts workload-identity federation between
   Azure Pipelines and another cloud or SaaS, a subverted installer
   pipeline can exchange those federated tokens for further
   credentials — compounding the blast radius beyond Azure DevOps
   itself.
4. If the same identity can both edit `azure-pipelines.yml` and queue
   pipeline runs, there is no separation of duties between the agent
   identity and the build-configuration identity; standard
   [Azure DevOps security best practices][azure-devops-security] treat
   this combination as a high-risk pattern.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state)
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file)
- `public-fabric/` (rendered output)

**Clause this likely violates.** Azure DevOps Services is licensed
per user under the basic / basic + test plans; Azure Repos storage is
metered indirectly through that licensing and through repository size
soft limits. Append-only conversation logs that grow per pull-request
comment, and a `union`-merged log file specifically engineered to
absorb high write contention from parallel pipeline runs, are
operating Azure Repos as a write-heavy data store rather than as a
source-code archive. The
[Microsoft Acceptable Use Policy][mos-aup] forbids workloads that are
abusive of an online service's intended use; using a managed Git
service as a high-write append-only LLM transcript is the kind of
use pattern the rule is aimed at. An operator who notices the bill
or the repository-size warning late may also be in breach of their
internal change-management policies for "cost surprises."

### 2.7 Third-party LLM API keys flowing through Azure Key Vault and pipeline variable groups

**Source.** Header comments of the agent workflows; the `Authorize`
and `run-agent` job environments. After translation, the equivalent
values would live as Azure Key Vault secrets surfaced through a
linked Azure Pipelines variable group, or as pipeline secret
variables on the pipeline itself.

**Behaviour after translation.** The pipeline is configured with one
or more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`,
`GROQ_API_KEY`, each resolved from Azure Key Vault at job start via
the `AzureKeyVault@2` task or an Azure Resource Manager service
connection. Each invocation forwards user-supplied pull-request
text to the corresponding provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing
   their API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. An Azure
   Repos repository whose pull-request comment surface is wired
   straight to your `OPENAI_API_KEY` is, in effect, a
   private-but-shared LLM proxy. Provider-side ToS violations are
   not Microsoft's problem, but they are *yours* the moment you flip
   the switch.
2. **Microsoft AUP.** Using Microsoft online services to violate the
   rights of others — including any law, regulation, or third-party
   agreement — is forbidden. Running someone else's API in
   violation of their ToS via Azure Pipelines pulls the Microsoft
   side of the operation into that clause too.
3. **PII / data export.** Any contributor's pull-request body —
   potentially including private data in bug reports — is shipped to
   a third-party inference provider. On a corporate Azure DevOps
   organization that is the subject of a GDPR Article 28 processor
   agreement, a SOC 2 boundary, or a HIPAA BAA, this can be a
   data-handling compliance failure independent of Microsoft's own
   posture. The
   [Microsoft Online Services Data Protection Addendum][mos-dpa] for
   Azure DevOps Services does not contemplate user-supplied text
   being routed to arbitrary external inference providers.

### 2.8 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and the
agent runtime — the Azure DevOps equivalents would typically commit
under the build identity (the
`Project Collection Build Service (<org>)` account, or a service
principal) for commits that the *agent itself* (not Azure Pipelines)
generated.

**Concern.** Attributing AI-authored commits to a build-service
identity deliberately hides the LLM as the author. Whether this is
an outright ToS violation is debatable, but it is the kind of
*misattribution* pattern that downstream licence / DCO compliance and
Azure DevOps audit-log forensics rely on commit metadata to
untangle. The Azure DevOps audit log will record
`Git.PushAccepted` against the build identity; nothing in that audit
trail will record that the diff itself was produced by a model
unless the operator explicitly tags it.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The
whole point is to use Azure Pipelines + Azure Storage / Front Door +
Azure Repos history together as a hosting platform for an AI
service. Microsoft does permit operators to assemble such a stack —
but it bills accordingly, and the operator inherits responsibility
for the resulting public surface under the
[Microsoft Acceptable Use Policy][mos-aup]. The maintainers do not
endorse running this project that way. Use the self-hosted Forgejo
runtime instead.

---

## 3. Failure modes that remain even on an Azure DevOps organization you fully control

Owning the Azure DevOps organization removes the *cross-tenant*
layer (you are not sharing Microsoft Entra ID with strangers in the
relevant sense) but it does not remove the *architectural* risks.
Even on an organization where you are the only operator, the design
described in this repo can fail badly if certain disciplines are not
maintained:

1. **Service-principal / PAT privilege.** The agent needs write
   access to the repository and to its own `azure-pipelines.yml` /
   linked YAML templates. A compromised LLM provider key, a prompt
   injection through a pull-request body, or an inbound service hook
   can in principle cause a pipeline run to push arbitrary commits —
   including commits that change `azure-pipelines.yml`. Owning the
   organization does not immunise you against this; it just means
   the blast radius stops at your own Azure DevOps and Azure
   resources.
2. **Cost runaway.** Microsoft-hosted parallel-job minutes, Azure
   Front Door egress, Azure Storage transactions, Azure Key Vault
   secret-retrieval calls, Azure DevOps REST API call quotas, and
   LLM API calls all bill on consumption. A repository + a
   comment-triggered pipeline on a busy Azure Repos repository is a
   cost-amplifying surface for whoever owns the Azure subscription
   *and* the LLM key, with no upper bound short of an explicit Azure
   cost alert.
3. **Cross-service identity sprawl.** Microsoft's identity model
   rewards convenience with broader scopes than necessary. The agent
   design's appetite for cross-repository automation invites granting
   `Project Collection Administrators` or full-scope PATs; on your
   own organization the only thing standing between a leaked PAT and
   the whole estate is your own scoping discipline and Microsoft
   Entra ID Conditional Access policies.
4. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Azure Repos imposes
   repository-size soft limits (and warns above them); the operator
   must keep a retention policy in place or face slow-growing
   per-user-licence charges and eventual repository-size warnings.
5. **Azure DevOps Services posture.** Microsoft has publicly placed
   Azure DevOps Services in maintenance mode, directing new
   investment and new customers to GitHub Enterprise. Building a
   long-lived runtime on top of a service whose feature roadmap is
   explicitly slowing down ties the project's continuity to whatever
   eventual transition Microsoft announces for existing Azure DevOps
   organizations.

These are not Azure-DevOps-organization-specific failures; they are
properties of the agent design itself, and they are why
[`azure-devops-compliance.md`](azure-devops-compliance.md) insists
that even an Azure DevOps organization you fully control is *not*
the target runtime — the target runtime is the maintainers'
self-hosted Forgejo, where the governance model described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/) actually
applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (after translation) | Why |
| --- | --- | --- |
| Microsoft AUP — *no abusive or excessive automated use* | All `run-agent` jobs; emergency-kill | Per-comment pipeline runs; mass cross-repository deletes |
| Microsoft Online Services Terms — *no interference with others' workloads* | `*-emergency-trigger-kill.yml` (deferred) | Deletes `azure-pipelines.yml` and agent folders across the whole organization |
| Microsoft AUP — *no using infrastructure as a generic data backend* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Microsoft AUP — *no malware / self-replicating code* | Installer jobs that download and commit `azure-pipelines.yml` | Pipeline installs and upgrades pipelines from a remote source |
| Microsoft AUP — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| Azure DevOps Services Product Terms — *build infrastructure for customer code* | All `run-agent` jobs | Azure Pipelines is doing AI inference / chatbot, not building/testing the project |
| Azure DevOps parallel-job / REST API quotas (TSTUs) | All `run-agent` jobs on busy repositories | Organization-wide quotas saturated by inbound comment traffic |
| Azure Storage / Front Door publisher liability | `gmi-public-fabric.yml`, `publish-public-fabric.yml` after translation | Static-site container + Front Door would be the agent's public surface; operator is the publisher |
| Microsoft Entra ID least-privilege guidance | Emergency-kill service principal | Organization-wide `Code (write)` + `Build (manage)` on a pipeline service connection |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`azure-devops-compliance.md`](azure-devops-compliance.md) already
says):

- The maintainers state explicitly that the production runtime is
  the maintainers' self-hosted Forgejo, not Azure DevOps, and that
  Azure DevOps is not even on the project's mirror list.
- This repository contains **no `azure-pipelines.yml`**, **no Azure
  Pipelines YAML template library**, **no ARM / Bicep / Terraform
  that provisions an Azure DevOps organization, an Azure Repos
  repository, an Azure Pipelines pipeline, an Azure Artifacts feed,
  an Azure Key Vault, or a Microsoft Entra ID service principal**
  for the agent, and no Azure-targeted agent code. The infractions
  catalogued here are conditional on a third party translating the
  existing Forgejo Actions or GitHub Actions workflows into Azure
  DevOps resources and enabling them.
- Microsoft has placed Azure DevOps Services in maintenance mode and
  is directing new customers to GitHub Enterprise, so for many
  readers this document is moot by default — they will provision a
  new GitHub organization instead, in which case
  [`github-warning.md`](github-warning.md) applies.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which are
  by name historical or deferred archives being held for reference
  rather than active deployment.
- Nothing in this repo, on its own, is currently *running* as a
  service on any Azure DevOps organization.

The warning is therefore aimed at:

- Anyone working in an existing Azure DevOps organization, forking
  this repo, writing an `azure-pipelines.yml` that ports the agent
  workflows, and turning it on against an Azure Repos repository.
- Reviewers evaluating whether the design described in this repo is
  appropriate for an Azure DevOps deployment (it is not — it is
  appropriate only for the maintainers' self-hosted Forgejo runtime
  the project actually targets).

If you are a maintainer or downstream user and you intend to run
*any* of the `run-agent`, `run-install`, `kill`, or public-fabric
workflows on Azure DevOps — Azure Repos, Azure Pipelines, Azure
Artifacts, Azure Key Vault, or Azure Storage / Front Door — re-read
the linked policies first, scope a fresh, *least-privilege*,
per-repository service principal (never a `Project Collection
Administrators` PAT), set explicit Azure cost alerts on the linked
subscription, and treat comment-triggered LLM inference as something
that must move to your own self-hosted Forgejo before going anywhere
near a shared Azure DevOps organization.

---

## 6. References

- Microsoft Online Services Terms — [`mos-terms`][mos-terms]
- Microsoft Product Terms — [`mos-product-terms`][mos-product-terms]
- Microsoft Acceptable Use Policy — [`mos-aup`][mos-aup]
- Microsoft Online Services Data Protection Addendum —
  [`mos-dpa`][mos-dpa]
- Azure DevOps Services data protection overview —
  [`azure-devops-data-protection`][azure-devops-data-protection]
- Microsoft Entra ID best practices —
  [`entra-best-practices`][entra-best-practices]
- Azure DevOps security best practices —
  [`azure-devops-security`][azure-devops-security]
- Microsoft Shared Responsibility Model —
  [`azure-shared-responsibility`][azure-shared-responsibility]
- Existing maintainer posture document —
  [`azure-devops-compliance.md`](azure-devops-compliance.md)
- Sibling counterparts —
  [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`gitlab-compliance.md`](gitlab-compliance.md),
  [`gitlab-warning.md`](gitlab-warning.md),
  [`bitbucket-compliance.md`](bitbucket-compliance.md),
  [`bitbucket-warning.md`](bitbucket-warning.md),
  [`aws-codecommit-compliance.md`](aws-codecommit-compliance.md),
  [`aws-codecommit-warning.md`](aws-codecommit-warning.md),
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md)

[mos-terms]: https://www.microsoft.com/licensing/terms/
[mos-product-terms]: https://www.microsoft.com/licensing/terms/productoffering
[mos-aup]: https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all
[mos-dpa]: https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA
[azure-devops-data-protection]: https://learn.microsoft.com/en-us/azure/devops/organizations/security/data-protection
[entra-best-practices]: https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/best-practices
[azure-devops-security]: https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-best-practices
[azure-shared-responsibility]: https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
