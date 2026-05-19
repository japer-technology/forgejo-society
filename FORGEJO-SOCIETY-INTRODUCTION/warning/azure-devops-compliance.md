# Azure DevOps Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, and the
public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**Azure DevOps Services is not part of this project.** The maintainers
do not mirror to Azure Repos, do not host an Azure DevOps organization
or project for this repository, and do not run any Azure Pipelines
pipeline, Azure Artifacts feed, Azure Boards workflow, or related
Microsoft Developer Tools artefact that is derived from this
repository. Azure DevOps is **not** in the mirror list alongside
Codeberg, github.com, GitLab.com, and Bitbucket — see
[`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
[`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md),
and [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md).

This document exists because Azure DevOps Services is the
Microsoft-native Git + CI surface that an Azure-centric or
Microsoft-stack reader might reach for first, and because Microsoft has
formally placed [Azure DevOps Services in maintenance mode and is
directing new customers to GitHub][azure-devops-future]. The
maintainers' posture for environments that already have an Azure DevOps
organization is: **do not host this project on Azure Repos, and do not
translate the agent workflows into Azure Pipelines.** This is
distinct from the
[`ci-cd-functionality`](README.md#git-hosts-with-native-cicd-execution-capability) shortlist, which
catalogues Azure DevOps as a *capability* match for the architectural
pattern; capability is not endorsement.

Nothing in this repository is intended to run as a production service
on Azure DevOps Services, Azure DevOps Server, Azure Pipelines, Azure
Repos, Azure Artifacts, or any other Microsoft Developer Tools
service. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed
to live inside the maintainers' self-hosted Forgejo, not on Azure
DevOps.

## How that posture maps onto Microsoft's terms

The [Microsoft Online Services Terms][mos-terms] and the
[Microsoft Product Terms][mos-product-terms] (including the Azure
DevOps Services, Azure, and Microsoft Entra ID sections), together
with the [Microsoft Acceptable Use Policy][mos-aup] and the
[Microsoft Online Services Data Protection Addendum][mos-dpa], govern
what Microsoft online services may be used for. Azure DevOps Services
is licensed per user, per Microsoft-hosted parallel job, and per GB
of Azure Artifacts storage; Azure Pipelines bills additional
Microsoft-hosted parallel jobs by the minute. Microsoft resources
must be used for the customer's own legitimate workloads, must not
disrupt the service or third parties, and must not be operated in
violation of Microsoft's policies on automated abuse, content, or
data handling.

This project's posture aligns with that rule because it does **not**
use any of those surfaces at all. To make the intended boundary
explicit, if Azure DevOps Services were ever provisioned for this
project the only acceptable use would be the following — and even
then the maintainers do not currently endorse it:

| Azure DevOps surface | How this project would use it | Why this would be the limit |
| --- | --- | --- |
| **Azure Repos repository** | Not used. The canonical repository is the maintainers' self-hosted Forgejo. | Azure DevOps Services is in maintenance mode for new customers; no new mirror is planned. |
| **Azure Pipelines pipeline** | Not enabled for agent workloads. If ever used at all, only for lint/build/test of mirrored source. | Permitted by the Product Terms only as build infrastructure for the customer's own code. |
| **Microsoft-hosted agents** | Not used as a runtime for the agent or its publishers. | Microsoft-hosted parallel-job minutes are for software delivery, not for general-purpose event-driven LLM inference. |
| **Self-hosted agents** | Not used. The agent runtime lives on Forgejo Runners on operator-owned Ubuntu hardware, attached to the maintainers' self-hosted Forgejo, not to an Azure DevOps organization. | Pointing a self-hosted agent at an Azure DevOps organization would still route trigger events, telemetry, and metadata through Azure DevOps Services. |
| **Azure Artifacts feed** | Not used as a distribution channel from this repository. | No agent images, models, memory dumps, or rendered output repurposed as a general-purpose package or object store. |
| **Azure Key Vault / variable groups** | Not used to hold LLM provider keys for an Azure-side runtime. | LLM credentials never need to reach Microsoft; the runtime is on operator-owned hardware. |
| **Azure Boards** | Not used as the issue / pull-request surface that triggers the agent. | The agent is designed to be driven by Forgejo issues and pull requests, governed by the policies in `THE-SOCIETY-OF-REPO/`. |
| **Microsoft Entra ID / PATs / service connections** | Not issued, rotated, or audited by this project. | The project does not act as an Entra ID tenant administrator or as the owner of any Azure DevOps service connection. |

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
for, nor ported to, Azure Pipelines, Azure Repos, or any other
Microsoft Developer Tools surface.**

The directory [`../precursors/`](../precursors/) contains the earlier
github.com-targeted incarnations of the same agent (under
`**/.github/workflows/`). Those are historical artefacts being
migrated; their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They
are not deployed from this repository to any Azure DevOps
organization.

This repository contains **no `azure-pipelines.yml`**, **no
`azure-pipelines/` template library**, **no ARM / Bicep / Terraform
that provisions an Azure DevOps organization, an Azure Repos
repository, an Azure Pipelines pipeline, an Azure Artifacts feed, or
an Azure Key Vault for the agent**, and no Azure-specific agent code.
The agent runtime is structurally not present on Azure DevOps; the
Azure DevOps posture is "absent by construction."

If at any point you (a maintainer or downstream user) intend to enable
an Azure Pipelines pipeline that translates any `run-agent`,
public-fabric, or installer workflow into an Azure Pipelines job — in
particular on an existing Azure DevOps organization with paid parallel
jobs — re-read the [Microsoft Online Services Terms][mos-terms], the
relevant [Microsoft Product Terms][mos-product-terms] for Azure
DevOps Services and Azure, and the
[Microsoft Acceptable Use Policy][mos-aup] first. Confirm that the
use still falls within "the customer's own legitimate workload" and
does not amount to running a general-purpose third-party LLM proxy on
Microsoft infrastructure. If you cannot confirm that, run the
workflow on the maintainers' self-hosted Forgejo instead.

## What this project does **not** do on Azure DevOps

To make the boundary explicit, this project does not, and is not
designed to, use Azure DevOps Services for any of the following —
all of which are forbidden by the
[Microsoft Acceptable Use Policy][mos-aup] or by Azure DevOps
service-specific terms in the [Product Terms][mos-product-terms]:

- Cryptocurrency mining on Microsoft-hosted agents, self-hosted
  agents registered to an Azure DevOps organization, or any other
  Microsoft compute surface.
- Launching denial-of-service attacks, including via Azure Pipelines
  jobs or scheduled triggers.
- Serving as a content delivery network, generic file backup, or
  media host (including via Azure Artifacts, Azure Pipelines
  artifacts, or the Azure Repos LFS store) for content unrelated to
  this project's source code.
- Running a stand-alone SaaS product or providing compute-as-a-service
  to third parties via Azure Pipelines, Microsoft-hosted agents, or
  REST-API-triggered pipeline runs.
- Spam, mass scraping, or automated abuse of any Microsoft or
  third-party API from Microsoft-hosted networks.
- Bypassing or circumventing Azure DevOps service quotas, parallel-
  job limits, or billing controls.
- Hosting malware, phishing content, or content that violates third-
  party rights on any Azure DevOps service.
- Holding personal data in a way that the
  [Microsoft Online Services Data Protection Addendum][mos-dpa] and
  the [Azure DevOps Data Protection Overview][azure-devops-data-protection]
  do not contemplate.

No code in this repository implements any of the above. The agent
runtime is structurally *ineligible* for Azure DevOps deployment in
the form the repository describes: it requires self-hosted runners
with elevated permissions on the forge, persistent server-side state
held in git on the forge, operator-controlled LLM credentials, and a
forge under operator policy control rather than under Microsoft
Entra ID and Azure DevOps organization-administrator control.
Microsoft-managed Git (Azure Repos) does not host the Forgejo Actions
side of that runtime at all.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this
  repository, and in particular no Microsoft Entra ID tenant IDs,
  service principal client IDs or secrets, Azure DevOps personal
  access tokens (PATs), Azure Pipelines service connection IDs, Azure
  Key Vault names, or variable-group names appear in tracked files.
- LLM and infrastructure credentials never need to reach Azure:
  runners, the LLM server, and the storage are all reachable on the
  same operator-controlled network on the self-hosted Forgejo side.
  Azure Key Vault, Azure DevOps variable groups, and Azure Pipelines
  pipeline secret variables are not used for agent secrets.
- The maintainers do not issue, rotate, or audit Microsoft Entra ID
  identities, Azure DevOps PATs, service connections, or self-hosted
  agent pools on behalf of this project. A reader who already
  operates an Azure DevOps organization is responsible for their own
  identity and secret-management posture under the
  [Microsoft Shared Responsibility Model][azure-shared-responsibility].

## Reporting a compliance concern

If you believe something in this repository conflicts with
Microsoft's terms once these caveats are taken into account, please
open an issue describing the specific file and the specific clause of
the [Microsoft Online Services Terms][mos-terms], the
[Microsoft Product Terms][mos-product-terms], the
[Microsoft Acceptable Use Policy][mos-aup], or the
[Azure DevOps Services notes][azure-devops-data-protection] you
believe applies. Maintainers will respond by either correcting the
content, moving the affected behaviour to the Forgejo runtime, or
explaining why the use is in fact permitted.

[mos-terms]: https://www.microsoft.com/licensing/terms/
[mos-product-terms]: https://www.microsoft.com/licensing/terms/productoffering
[mos-aup]: https://www.microsoft.com/licensing/terms/product/ForOnlineServices/all
[mos-dpa]: https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA
[azure-devops-future]: https://devblogs.microsoft.com/devops/
[azure-devops-data-protection]: https://learn.microsoft.com/en-us/azure/devops/organizations/security/data-protection
[azure-shared-responsibility]: https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
