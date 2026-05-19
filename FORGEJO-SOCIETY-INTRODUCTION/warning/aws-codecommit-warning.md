# AWS CodeCommit Warning

> **Adversarial counterpart to [`aws-codecommit-compliance.md`](aws-codecommit-compliance.md).**
>
> `aws-codecommit-compliance.md` describes the maintainers' *intended*
> posture — that AWS CodeCommit is not part of this project at all,
> that the runtime target is a self-hosted Forgejo on operator-owned
> Ubuntu hardware, and that no agent runtime is ported to AWS
> CodeBuild, AWS CodePipeline, or any other AWS Developer Tools
> surface. **This document does the opposite.** It assumes a reader
> who is sitting on a legacy AWS account that still has CodeCommit
> available (CodeCommit was [closed to new customers on 25 July
> 2024][aws-codecommit-closure]), pushes a copy of this repository
> into a CodeCommit repository, writes a `buildspec.yml` and a
> CodePipeline definition that translate the agent workflows under
> `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` (or
> their github precursors under
> `FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/`) into CodeBuild
> projects and CodePipeline actions, attaches an IAM role with
> CodeCommit write access and Secrets Manager read access, wires up
> the LLM API keys as Secrets Manager secrets, and lets the agent
> loop run as designed. It then enumerates, feature by feature, the
> clauses of the [AWS Customer Agreement][aws-customer-agreement],
> the relevant [AWS Service Terms][aws-service-terms] sections (for
> CodeCommit, CodeBuild, CodePipeline, S3, and CloudFront), and the
> [AWS Acceptable Use Policy][aws-aup] that such a deployment would
> plausibly violate.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on an AWS
> account that still has CodeCommit, or on any AWS account that uses
> CodeBuild / CodePipeline as a substitute Git-triggered runtime.

---

## 0. The headline risks

This repository ships **no `buildspec.yml`**, **no CodePipeline
definition**, **no CDK / CloudFormation / Terraform that provisions a
CodeCommit repository, a CodeBuild project, or a CodePipeline pipeline
for the agent**, and no AWS-targeted workflows; the agent runtime is
structurally absent from the AWS side. The risks in this document
materialise only if a reader *translates* the existing Forgejo Actions
or GitHub Actions workflows into AWS Developer Tools resources and
enables them. If you do that and run them as designed, you are very
likely to be in breach of AWS's terms in at least the following ways:

1. **CodeBuild misuse as a chat / LLM backend.** The agent uses
   CodeBuild as a general-purpose LLM chatbot backend triggered by
   CodeCommit notifications (via EventBridge or SNS) on pull-request
   or comment events. That is not "building, testing, or deploying
   the customer's software" — which is the role CodeBuild's service
   terms anticipate. CodeBuild is billed per build-minute, so the
   misuse is also a direct cost-amplification vector.
2. **S3 + CloudFront misuse as the agent's public surface.**
   Translating the `gmi-public-fabric.yml` and
   `publish-public-fabric.yml` publishers into a CodeBuild job that
   `aws s3 sync`s into a public S3 bucket fronted by CloudFront would
   publish AI-generated output as a static site whose content is the
   *product* of the agent, not documentation for source code. AWS
   permits this in principle, but the operator becomes a
   content-publisher under the AUP for everything the agent writes.
3. **Account-wide self-modifying / self-deleting automation.** The
   "emergency" workflows take a credential with broad scope across
   the account and use it to **mass-delete every workflow file and
   every agent folder in every repository the credential can reach**.
   A naïve CodeCommit translation would grant the executing IAM role
   `codecommit:GitPush` and `codecommit:DeleteRepository`/
   `codecommit:DeleteFolder`-equivalent access across the account.
   That role can silently rip the agent — and any colocated files —
   out of every CodeCommit repository in the account, including
   repositories owned by other IAM principals.
4. **Self-propagating pipelines.** The installer jobs request write
   access to repository contents and to the build/pipeline
   configuration in order to download workflow YAML from a remote
   source and commit it into the calling repository. A CodeBuild job
   that installs and upgrades the `buildspec.yml` (and the
   CloudFormation / CDK that defines the pipeline) on the same
   repository is, functionally, self-replicating code.
5. **Resource / quota abuse from public triggers.** If a CodeCommit
   repository is fronted by a Lambda-backed webhook or by a public
   issue tracker (CodeCommit has no native issues, so this typically
   means routing GitHub or Jira webhooks into EventBridge), every
   inbound comment becomes a CodeBuild execution and an outbound LLM
   API call. CodeBuild build-minutes, EventBridge invocations, and
   LLM tokens all bill on consumption. Quota exhaustion attacks
   against the owner are the obvious follow-on; AWS billing alarms
   are the only backstop.
6. **Repository as general-purpose data store.** The agent commits
   its conversation memory, session state, and "fabric" output back
   to git on every turn, using the repo as a database / message log
   rather than as source-code storage. CodeCommit is billed per
   active user and per request (S3 PUTs against the underlying
   storage). The AWS AUP forbids using AWS services to operate
   workloads that are abusive of the service's intended use; an
   append-only LLM transcript stored in a managed Git service is
   exactly the kind of pattern that gets flagged.
7. **Third-party LLM credentials and PII flowing through AWS Secrets
   Manager and CodeBuild environment variables.** The workflows are
   designed to be configured with `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
   etc., and to forward arbitrary user-supplied issue text to those
   providers. A maintainer who enables this on an AWS account is
   implicitly running a free LLM proxy on AWS infrastructure, with
   the LLM provider's terms layered on top of AWS's terms.

The remainder of this document goes through each of these in detail
and points at the specific files in this repository that a reader
would have to translate to reach the failure mode.

---

## 1. Inventory of source that a reader would translate to AWS

There is no AWS-targeted code in this repository. The risks below
apply to a hypothetical port of the following directories into a
`buildspec.yml`, a CodePipeline definition, and the supporting IAM
roles, EventBridge rules, and Secrets Manager secrets on an AWS
account that still has CodeCommit:

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
and GitLab coverage lives in [`gitlab-warning.md`](gitlab-warning.md).
This document is about what happens if any of those is dropped onto
AWS CodeCommit + CodeBuild + CodePipeline.

---

## 2. Detailed infractions if these workflows are translated and enabled on AWS

### 2.1 Using CodeBuild as a chat / LLM backend (most serious)

**Source.** The `run-agent` jobs in `forgejo-intelligence-WORKFLOW-AGENT.yml`
and in the github precursors (`github-minimum-intelligence-agent.yml`,
`github-openclaw-intelligence-agent.yml`,
`ISSUE-INTELLIGENCE-WORKFLOW-AGENT.yml`), plus the agent payload they
install.

**Behaviour after translation.** An EventBridge rule on CodeCommit
pull-request and comment events (or on a webhook bridge from an
external issue tracker, since CodeCommit has no native issues) starts
a CodeBuild project. That project reads the event body, sends it to a
third-party LLM (OpenAI / Anthropic / Gemini / xAI / OpenRouter /
Mistral / Groq), and posts the model's reply back as a CodeCommit
pull-request comment via `aws codecommit post-comment-for-pull-request`.
The agent exists for *conversational use* — the workflow comments and
surface docs describe pull requests as "a conversation thread" with
the agent.

**Clause this likely violates.** The [AWS Service Terms][aws-service-terms]
for CodeBuild describe it as a service for building and testing the
customer's own code; the [AWS AUP][aws-aup] forbids using AWS services
in a manner that is abusive of the service's intended use or that
imposes an undue burden on AWS. A general-purpose AI chat assistant
whose CodeBuild minutes are unrelated to building, testing, or
releasing the host repository's source code falls squarely on the
wrong side of that line. The fact that the chat happens to use
CodeCommit pull requests as the UI does not change the underlying use:
the build-minutes are paying for a chatbot, not for CI of the
project.

### 2.2 PR/comment-triggered runs on shared-account repositories = cross-tenant compute consumption

**Source.** The same `run-agent` jobs and the issue / merge-request /
pull-request surface code under `forgejo-intelligent-issue/`,
`forgejo-intelligent-pull-request/`, and their github precursors.

**Behaviour after translation.** On a repository whose CodeCommit
permissions are open to multiple IAM principals (developer accounts,
federated SSO users, contractor roles), any principal with
`codecommit:PostCommentForPullRequest` can fire the EventBridge rule
and start a CodeBuild execution. The workflow's "Authorize" step
checks the actor's permission and bails out if it is not one of the
trusted IAM principals. That authorisation check fires **after**
CodeBuild has already been billed for the build start-up time and the
container provisioning.

**Clause this likely violates.** The [AWS AUP][aws-aup] forbids
operating workloads that are abusive of an AWS service's intended use
or that interfere with other customers' use of the service. A
trigger surface that boots a CodeBuild project per inbound comment
also collides with the per-account CodeBuild concurrent-build limit
and the EventBridge invocation quotas; on a shared account this
saturates a limit that other workloads in the same account depend on.
The cost-amplification on the account owner is direct and
unbounded — CodeBuild bills per build-minute regardless of whether
the eventual `Authorize` step rejects the run.

### 2.3 S3 + CloudFront used as the agent's public surface ("public-fabric")

**Source.** The public-fabric publishers in
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` and the
github precursors `gmi-public-fabric.yml` and
`publish-public-fabric.yml`.

**Behaviour after translation.** Translated into a CodeBuild job that
ends with `aws s3 sync ./public-fabric s3://<bucket>/ --delete` behind
a CloudFront distribution, these workflows would publish a directory
called `public-fabric/` to a public website on every push to the
default branch. The original header comments are unambiguous: a live
web page powered by the agent's public output, with "no separate
hosting needed." S3 + CloudFront is deliberately being used as the
substitute for hosting the agent.

**Clauses / risks this raises.**

1. AWS permits static hosting on S3 + CloudFront for arbitrary
   content the customer is entitled to publish, but the operator
   becomes the publisher under the [AWS AUP][aws-aup] for everything
   the bucket contains. AI-generated text triggered by anonymous
   inbound traffic means the operator is on the hook for any
   defamatory, infringing, or prohibited output the model produces.
2. CloudFront and S3 egress bills on data transferred. A public
   `public-fabric/` site whose content can be enlarged by inbound
   prompt-injection is a cost-amplification vector against the
   account owner, not a documentation site.
3. Lack of edit/review between LLM generation and public surface
   means the published content cannot be retracted before it is
   cached at CloudFront edge locations.

### 2.4 The "Emergency" workflows — destructive cross-repository automation

**Source.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
and the github precursor under
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `*-emergency-trigger-kill.yml` — *"Deletes all workflow YAML and every
  agent folder in each owner repo."*
- `*-emergency-trigger-disable.yml`
- `*-emergency-agent.yml` — installs the others.

**Behaviour after translation.** An AWS port of the kill workflow
would assume an IAM role with `codecommit:GitPush` across every
CodeCommit repository in the account (and, in the worst case,
`codecommit:DeleteRepository`) and walk every repository in the
account to physically delete pipeline files, `buildspec.yml`, and
agent folders. The corresponding CodeBuild project would be granted a
trust policy that lets the original `*-emergency-agent.yml`-equivalent
pipeline assume it. It is gated by deleting a tripwire file in the
controlling repository.

**Clauses / risks this raises.**

1. The [AWS Customer Agreement][aws-customer-agreement] requires that
   the customer use AWS services in a manner consistent with the
   permissions of the underlying account and not interfere with
   other customers' use of AWS. In a multi-team AWS account, a
   single maintainer triggering this workflow would silently rip CI
   out of every sibling team's CodeCommit repository. That is
   interference with other principals' workloads inside the same
   account boundary.
2. The IAM role design itself is the anti-pattern that
   [AWS IAM least-privilege guidance][aws-iam-best-practices]
   exists to discourage. A single CodeBuild execution role with
   account-wide `codecommit:*` is precisely the credential profile
   AWS Security Hub and IAM Access Analyzer are designed to flag.
3. If any deleted repository is mirrored downstream (CodeCommit ↔
   CodeStar Connections to GitHub, or to a downstream pipeline that
   builds an actual product), the deletion can propagate beyond the
   AWS account boundary, depending on the mirroring direction.
4. CodeCommit does not currently expose a per-repository "deletion
   protection" flag equivalent to S3 Object Lock; once a branch or
   repository is deleted by an authorised IAM principal, recovery
   relies on whatever out-of-band backup the operator maintains.

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

**Behaviour after translation.** An AWS port of these jobs would be
manually-triggered CodeBuild executions (or CodePipeline manual-
approval stages) that hold IAM permissions to `git push` into the
CodeCommit repository and to mutate the project's own `buildspec.yml`
and CDK / CloudFormation pipeline definition. They download a release
tarball from a remote upstream, extract it into the current
repository's agent directory, and `git push` the result. On upgrade,
they overwrite their own `buildspec.yml`.

**Clauses / security concerns this raises.**

1. **Supply chain.** A CodeBuild job that pulls arbitrary content
   from a remote release and commits it into `buildspec.yml` and the
   project's agent directory is, by construction, an automated
   supply-chain ingestion path. If the upstream release is ever
   compromised, every account that has run the installer auto-
   upgrades to the compromised version on next dispatch.
2. **Self-replication.** The combination of write-contents + write-
   buildspec + manual trigger + downloads-and-commits-pipelines is
   the textbook description of a self-replicating pipeline. The
   [AWS AUP][aws-aup] forbids using AWS services to distribute
   malware or items of a destructive nature. Even if the
   maintainers' intent is benign, the *mechanism* matches the
   pattern abuse enforcement looks for.
3. If the project later adopts OIDC integration between CodeBuild and
   another cloud or SaaS, a subverted installer pipeline can
   exchange those tokens for further credentials — compounding the
   blast radius beyond AWS itself.
4. If the same IAM role can both edit `buildspec.yml` and start
   builds, there is no separation of duties between the agent
   identity and the build-configuration identity; standard
   [AWS Well-Architected security guidance][aws-well-architected-security]
   treats this combination as a high-risk pattern.

### 2.6 Repository as agent memory / database

**Source.** All `run-agent` jobs commit to:

- the agent's `state/` directory (session state)
- the agent's `memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file)
- `public-fabric/` (rendered output)

**Clause this likely violates.** CodeCommit's pricing model bills per
active user and per Git request; the underlying storage is metered
indirectly. Append-only conversation logs that grow per pull-request
comment, and a `union`-merged log file specifically engineered to
absorb high write contention from parallel CodeBuild runs, are
operating CodeCommit as a write-heavy data store rather than as a
source-code archive. The [AWS AUP][aws-aup] forbids workloads that
are abusive of an AWS service's intended use; using a managed Git
service as a high-write append-only LLM transcript is the kind of
use pattern the rule is aimed at. An operator who notices the bill
late may also be in breach of their internal change-management
policies for "cost surprises."

### 2.7 Third-party LLM API keys flowing through Secrets Manager and CodeBuild environment

**Source.** Header comments of the agent workflows; the `Authorize`
and `run-agent` job environments. After translation, the equivalent
values would live as Secrets Manager secrets (or SSM Parameter Store
SecureString parameters) attached to the CodeBuild project's
execution role.

**Behaviour after translation.** The CodeBuild project is configured
with one or more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
`GEMINI_API_KEY`, `XAI_API_KEY`, `OPENROUTER_API_KEY`,
`MISTRAL_API_KEY`, `GROQ_API_KEY`, each resolved from Secrets Manager
at build start. Each invocation forwards user-supplied pull-request
text to the corresponding provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing
   their API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A CodeCommit
   repository whose pull-request comment surface is wired straight to
   your `OPENAI_API_KEY` is, in effect, a private-but-shared LLM
   proxy. Provider-side ToS violations are not AWS's problem, but
   they are *yours* the moment you flip the switch.
2. **AWS AUP.** Using AWS services to violate the rights of others —
   including any law, regulation, or third-party agreement — is
   forbidden. Running someone else's API in violation of their ToS
   via CodeBuild pulls the AWS side of the operation into that
   clause too.
3. **PII / data export.** Any contributor's pull-request body —
   potentially including private data in bug reports — is shipped
   to a third-party inference provider. On a corporate AWS account
   that is the subject of a GDPR Article 28 processor agreement, a
   SOC 2 boundary, or a HIPAA BAA, this can be a data-handling
   compliance failure independent of AWS's own posture. AWS's
   data-processing addendum for CodeCommit / CodeBuild does not
   contemplate user-supplied text being routed to arbitrary external
   inference providers.

### 2.8 Bot impersonation and audit-trail laundering

**Source.** The `Commit and push` steps in the installer jobs and the
agent runtime — the AWS equivalents would typically commit under an
IAM-user or IAM-role identity (the CodeBuild execution role) for
commits that the *agent itself* (not AWS CodeBuild) generated.

**Concern.** Attributing AI-authored commits to an IAM role identity
deliberately hides the LLM as the author. Whether this is an outright
ToS violation is debatable, but it is the kind of *misattribution*
pattern that downstream licence / DCO compliance and CloudTrail-based
forensics rely on commit metadata to untangle. CloudTrail will log
`codecommit:GitPush` against the IAM role; nothing in that audit
trail will record that the diff itself was produced by a model
unless the operator explicitly tags it.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The
whole point is to use CodeBuild + S3/CloudFront + CodeCommit history
together as a hosting platform for an AI service. AWS does permit
operators to assemble such a stack — but it bills accordingly, and
the operator inherits responsibility for the resulting public surface
under the [AWS AUP][aws-aup]. The maintainers do not endorse running
this project that way. Use the self-hosted Forgejo runtime instead.

---

## 3. Failure modes that remain even on an AWS account you fully control

Owning the AWS account removes the *cross-tenant* layer (you are not
sharing AWS infrastructure with strangers in the relevant sense) but
it does not remove the *architectural* risks. Even on an account
where you are the only operator, the design described in this repo
can fail badly if certain disciplines are not maintained:

1. **IAM role privilege.** The agent needs write access to the
   repository and to its own `buildspec.yml` / pipeline definition.
   A compromised LLM provider key, a prompt injection through a
   pull-request body, or an inbound webhook can in principle cause
   CodeBuild to push arbitrary commits — including commits that
   change `buildspec.yml`. Owning the account does not immunise you
   against this; it just means the blast radius stops at your own
   AWS resources.
2. **Cost runaway.** CodeBuild minutes, CloudFront egress, EventBridge
   invocations, Secrets Manager API calls, and LLM API calls all
   bill on consumption. A repository + a comment-triggered pipeline
   on a busy CodeCommit repository is a cost-amplifying surface for
   whoever owns the AWS account *and* the LLM key, with no upper
   bound short of an explicit AWS Budgets alarm.
3. **Cross-service IAM sprawl.** AWS's identity model rewards
   convenience with broader scopes than necessary. The agent design's
   appetite for cross-repository automation invites granting `*:*`
   on `codecommit:*` and `codebuild:*`; on your own account the only
   thing standing between a leaked role and the whole estate is your
   own scoping discipline and IAM Access Analyzer findings.
4. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. CodeCommit-side storage
   is finite (and metered indirectly); the operator must keep a
   retention policy in place or face slow-growing per-request
   charges.
5. **CodeCommit closure.** AWS has closed CodeCommit to new customers
   as of 25 July 2024, and AWS's own published migration guidance
   recommends moving off CodeCommit for new projects. Building a
   long-lived runtime on top of a service that is no longer accepting
   new customers ties the project's continuity to whatever
   end-of-life timeline AWS eventually announces.

These are not AWS-account-specific failures; they are properties of
the agent design itself, and they are why
[`aws-codecommit-compliance.md`](aws-codecommit-compliance.md) insists
that even an AWS account you fully control is *not* the target
runtime — the target runtime is the maintainers' self-hosted
Forgejo, where the governance model described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/) actually applies.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering source (after translation) | Why |
| --- | --- | --- |
| AWS AUP — *no abusive or excessive automated use* | All `run-agent` jobs; emergency-kill | Per-comment CodeBuild executions; mass cross-repository deletes |
| AWS Customer Agreement — *no interference with others' workloads* | `*-emergency-trigger-kill.yml` (deferred) | Deletes `buildspec.yml` and agent folders across the whole account |
| AWS AUP — *no using infrastructure as a generic data backend* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| AWS AUP — *no malware / self-replicating code* | Installer jobs that download and commit `buildspec.yml` | Pipeline installs and upgrades pipelines from a remote source |
| AWS AUP — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| AWS CodeBuild service terms — *build infrastructure for customer code* | All `run-agent` jobs | CodeBuild is doing AI inference / chatbot, not building/testing the project |
| AWS CodeBuild concurrent-build / EventBridge invocation quotas | All `run-agent` jobs on busy repositories | Account-wide quotas saturated by inbound comment traffic |
| AWS CloudFront / S3 publisher liability | `gmi-public-fabric.yml`, `publish-public-fabric.yml` after translation | S3 + CloudFront would be the agent's public surface; operator is the publisher |
| IAM least-privilege guidance | Emergency-kill role | Account-wide `codecommit:*` execution role on a CodeBuild project |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`aws-codecommit-compliance.md`](aws-codecommit-compliance.md) already
says):

- The maintainers state explicitly that the production runtime is
  the maintainers' self-hosted Forgejo, not AWS, and that AWS
  CodeCommit is not even on the project's mirror list.
- This repository contains **no `buildspec.yml`**, **no CodePipeline
  definition**, **no CDK / CloudFormation / Terraform that provisions
  CodeCommit, CodeBuild, CodePipeline, or related resources** for the
  agent, and no AWS-targeted agent code. The infractions catalogued
  here are conditional on a third party translating the existing
  Forgejo Actions or GitHub Actions workflows into AWS Developer
  Tools resources and enabling them.
- AWS CodeCommit itself is closed to new customers as of 25 July
  2024, so for many readers this document is moot by default — the
  service simply is not available to them.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY-PRECURSOR/` or in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, both of which are
  by name historical or deferred archives being held for reference
  rather than active deployment.
- Nothing in this repo, on its own, is currently *running* as a
  service on any AWS account.

The warning is therefore aimed at:

- Anyone working in a legacy AWS account that still has CodeCommit
  enabled, forking this repo, writing a `buildspec.yml` that ports
  the agent workflows, and turning it on against a CodeCommit
  repository.
- Reviewers evaluating whether the design described in this repo is
  appropriate for an AWS Developer Tools deployment (it is not — it
  is appropriate only for the maintainers' self-hosted Forgejo
  runtime the project actually targets).

If you are a maintainer or downstream user and you intend to run
*any* of the `run-agent`, `run-install`, `kill`, or public-fabric
workflows on AWS — CodeCommit, CodeBuild, CodePipeline, S3, or
CloudFront — re-read the linked policies first, scope a fresh,
*least-privilege*, per-repository IAM role (never an account-wide
`codecommit:*` role), set explicit AWS Budgets alarms on CodeBuild
and CloudFront, and treat comment-triggered LLM inference as
something that must move to your own self-hosted Forgejo before
going anywhere near a shared AWS account.

---

## 6. References

- AWS Customer Agreement — [`aws-customer-agreement`][aws-customer-agreement]
- AWS Service Terms — [`aws-service-terms`][aws-service-terms]
- AWS Acceptable Use Policy — [`aws-aup`][aws-aup]
- AWS CodeCommit closure announcement — [`aws-codecommit-closure`][aws-codecommit-closure]
- AWS IAM best practices — [`aws-iam-best-practices`][aws-iam-best-practices]
- AWS Well-Architected security pillar — [`aws-well-architected-security`][aws-well-architected-security]
- AWS Shared Responsibility Model — [`aws-shared-responsibility`][aws-shared-responsibility]
- Existing maintainer posture document —
  [`aws-codecommit-compliance.md`](aws-codecommit-compliance.md)
- Sibling counterparts — [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md),
  [`gitlab-compliance.md`](gitlab-compliance.md),
  [`gitlab-warning.md`](gitlab-warning.md),
  [`forgejo-compliance.md`](forgejo-compliance.md),
  [`forgejo-warning.md`](forgejo-warning.md)

[aws-customer-agreement]: https://aws.amazon.com/agreement/
[aws-service-terms]: https://aws.amazon.com/service-terms/
[aws-aup]: https://aws.amazon.com/aup/
[aws-codecommit-closure]: https://aws.amazon.com/blogs/devops/how-to-migrate-your-aws-codecommit-repository-to-another-git-provider/
[aws-iam-best-practices]: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
[aws-well-architected-security]: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
[aws-shared-responsibility]: https://aws.amazon.com/compliance/shared-responsibility-model/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>
