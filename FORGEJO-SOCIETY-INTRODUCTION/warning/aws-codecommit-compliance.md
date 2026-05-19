# AWS CodeCommit Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, and the
public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**AWS CodeCommit is not part of this project.** The maintainers do not
mirror to CodeCommit, do not host a CodeCommit repository for this
project, and do not run any CodeBuild project, CodePipeline pipeline,
CodeDeploy application, or related AWS Developer Tools artefact that is
derived from this repository. CodeCommit is **not** in the mirror list
alongside Codeberg, github.com, GitLab.com, and Bitbucket — see
[`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
[`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md),
and [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md).

This document exists because CodeCommit is the AWS-native Git surface
that an AWS-centric reader might reach for first, and because — since
[AWS closed CodeCommit to new customers on 25 July 2024][aws-codecommit-closure]
— the only deployments that could still exist are *legacy* AWS accounts
where CodeCommit, CodeBuild, CodePipeline, and the surrounding IAM
plumbing are already provisioned. The maintainers' posture for those
environments is: **do not host this project on CodeCommit, and do not
translate the agent workflows into CodeBuild or CodePipeline.**

Nothing in this repository is intended to run as a production service on
AWS CodeCommit, AWS CodeBuild, AWS CodePipeline, or any other AWS
Developer Tools service. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed
to live inside the maintainers' self-hosted Forgejo, not on AWS.

## How that posture maps onto AWS's terms

The AWS [Customer Agreement][aws-customer-agreement], the
[AWS Service Terms][aws-service-terms] (including the CodeCommit,
CodeBuild, CodePipeline, S3, CloudFront, and KMS sections), and the
[AWS Acceptable Use Policy][aws-aup] govern what AWS infrastructure may
be used for. CodeCommit specifically is a managed Git service billed
per active user and per request; CodeBuild and CodePipeline are billed
per build-minute and per pipeline-execution respectively. AWS resources
must be used for the customer's own legitimate workloads, must not
disrupt AWS or third parties, and must not be operated in violation of
AWS's policies on automated abuse, content, or data handling.

This project's posture aligns with that rule because it does **not**
use any of those surfaces at all. To make the intended boundary
explicit, if CodeCommit were ever provisioned for this project the only
acceptable use would be the following — and even then the maintainers
do not currently endorse it:

| AWS Developer Tools surface | How this project would use it | Why this would be the limit |
| --- | --- | --- |
| **CodeCommit repository** | Not used. The canonical repository is the maintainers' self-hosted Forgejo. | CodeCommit is closed to new customers; no new mirror is planned. |
| **CodeBuild project** | Not enabled for agent workloads. If ever used at all, only for lint/build/test of mirrored source. | Permitted by AWS Service Terms only as build infrastructure for the customer's own code. |
| **CodePipeline pipeline** | Not used as a runtime for the agent or its publishers. | Pipelines are for software delivery, not as a general-purpose event-driven LLM backend. |
| **S3 + CloudFront** | Not used as a runtime surface for the agent's public output. The agent's public surface is published from the maintainers' self-hosted Forgejo. | S3 / CloudFront are not being repurposed as the agent's stand-alone application backend. |
| **ECR / Artifact registries** | Not used as a distribution channel from this repository. | No agent images, models, or memory dumps repurposed as a general-purpose object store. |
| **Secrets Manager / SSM Parameter Store** | Not used to hold LLM provider keys for an AWS-side runtime. | LLM credentials never need to reach AWS; the runtime is on operator-owned hardware. |

## Specific subprojects: `FORGEJO-SOCIETY/forgejo-intelligence/` and `FORGEJO-SOCIETY-PRECURSOR/`

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and
they are intended to run only on the maintainers' self-hosted Forgejo
instance, with self-hosted Forgejo Runners. **They are not designed
for, nor ported to, AWS CodeBuild, AWS CodePipeline, or any other AWS
Developer Tools surface.**

The directory [`../precursors/`](../precursors/) contains the earlier
github.com-targeted incarnations of the same agent (under
`**/.github/workflows/`). Those are historical artefacts being migrated;
their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They
are not deployed from this repository to any AWS account.

This repository contains **no `buildspec.yml`**, **no CodePipeline
definition**, **no AWS CDK / CloudFormation / Terraform that provisions
a CodeCommit repository or a CodeBuild project for the agent**, and no
AWS-specific agent code. The agent runtime is structurally not present
on AWS; the AWS posture is "absent by construction."

If at any point you (a maintainer or downstream user) intend to enable
a CodeBuild project or CodePipeline pipeline that translates any
`run-agent`, public-fabric, or installer workflow into an AWS build or
pipeline action — in particular on a legacy AWS account that still has
CodeCommit available — re-read the [AWS Customer
Agreement][aws-customer-agreement], the relevant
[AWS Service Terms][aws-service-terms] for CodeCommit, CodeBuild,
CodePipeline, S3, and CloudFront, and the
[AWS Acceptable Use Policy][aws-aup] first. Confirm that the use still
falls within "the customer's own legitimate workload" and does not
amount to running a general-purpose third-party LLM proxy on AWS
infrastructure. If you cannot confirm that, run the workflow on the
maintainers' self-hosted Forgejo instead.

## What this project does **not** do on AWS

To make the boundary explicit, this project does not, and is not
designed to, use AWS infrastructure for any of the following — all of
which are forbidden by the [AWS AUP][aws-aup] or by AWS service-
specific terms:

- Cryptocurrency mining on CodeBuild, EC2, Lambda, or any other AWS
  compute service.
- Launching denial-of-service attacks, including via CodeBuild jobs or
  Lambda functions.
- Serving as a content delivery network, generic file backup, or media
  host (including via S3, CloudFront, or ECR) for content unrelated to
  this project's source code.
- Running a stand-alone SaaS product or providing compute-as-a-service
  to third parties via CodeBuild, CodePipeline, Lambda, or API
  Gateway.
- Spam, mass scraping, or automated abuse of any AWS or third-party
  API from AWS-managed networks.
- Bypassing or circumventing AWS service quotas, rate limits, or
  billing controls.
- Hosting malware, phishing content, or content that violates third-
  party rights on any AWS service.
- Holding personal data in a way that the relevant AWS service's data-
  processing addendum and the [AWS GDPR / privacy posture][aws-privacy]
  do not contemplate.

No code in this repository implements any of the above. The agent
runtime is structurally *ineligible* for AWS deployment in the form the
repository describes: it requires self-hosted runners with elevated
permissions on the forge, persistent server-side state held in git on
the forge, operator-controlled LLM credentials, and a forge under
operator policy control rather than under AWS-managed IAM. AWS-managed
Git (CodeCommit) cannot host the Forgejo Actions side of that runtime
at all.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this
  repository, and in particular no AWS access keys, IAM role ARNs,
  CodeCommit Git credentials (HTTPS GRC), KMS key IDs, or Secrets
  Manager / SSM Parameter Store names appear in tracked files.
- LLM and infrastructure credentials never need to reach AWS:
  runners, the LLM server, and the storage are all reachable on the
  same operator-controlled network on the self-hosted Forgejo side.
  AWS Secrets Manager, SSM Parameter Store, and CodeBuild environment
  variables are not used for agent secrets.
- The maintainers do not issue, rotate, or audit IAM users, IAM roles,
  or CodeCommit Git credentials on behalf of this project. A reader
  who already operates an AWS account is responsible for their own IAM
  posture under the AWS [Shared Responsibility Model][aws-shared-responsibility].

## Reporting a compliance concern

If you believe something in this repository conflicts with AWS's terms
once these caveats are taken into account, please open an issue
describing the specific file and the specific clause of the
[AWS Customer Agreement][aws-customer-agreement], the
[AWS Service Terms][aws-service-terms], or the
[AWS Acceptable Use Policy][aws-aup] you believe applies. Maintainers
will respond by either correcting the content, moving the affected
behaviour to the Forgejo runtime, or explaining why the use is in fact
permitted.

[aws-customer-agreement]: https://aws.amazon.com/agreement/
[aws-service-terms]: https://aws.amazon.com/service-terms/
[aws-aup]: https://aws.amazon.com/aup/
[aws-privacy]: https://aws.amazon.com/compliance/gdpr-center/
[aws-shared-responsibility]: https://aws.amazon.com/compliance/shared-responsibility-model/
[aws-codecommit-closure]: https://aws.amazon.com/blogs/devops/how-to-migrate-your-aws-codecommit-repository-to-another-git-provider/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
