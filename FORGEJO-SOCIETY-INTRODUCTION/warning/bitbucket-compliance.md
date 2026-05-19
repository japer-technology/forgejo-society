# Bitbucket Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, and the
public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**Bitbucket Cloud is used as a tertiary mirror only.** Specifically,
bitbucket.org (and, where applicable, any third-party self-managed
Bitbucket Data Center instance) is used for:

- Acting as one of several **mirrors** of the canonical Forgejo
  repository, alongside Codeberg, github.com, and GitLab — see
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md),
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
  and [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md).
- Providing concentration-risk reduction across an unrelated commercial
  provider for critical source repositories.
- Receiving push-mirrored updates from the canonical Forgejo so that
  Bitbucket's copy stays current (the mirror's documented sync interval
  is 24 hours).

Nothing in this repository is intended to run as a production service on
bitbucket.org infrastructure. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed to
live inside the maintainers' self-hosted Forgejo, not on Bitbucket.

## How that posture maps onto Bitbucket's terms

Bitbucket Cloud is governed by the
[Atlassian Cloud Terms of Service][bitbucket-tos] and the
[Atlassian Acceptable Use Policy][atlassian-aup], with Bitbucket
Pipelines additionally subject to
[Atlassian's build-minutes and resource limits][bitbucket-pipelines-pricing].
The summary is: Bitbucket Cloud infrastructure (Pipelines build minutes,
repository storage, the Downloads area, Snippets, Pipes) must be used in
connection with developing the software project hosted in the
repository, not as free general-purpose compute, storage, or hosting.

This project's posture aligns with that rule because:

| Bitbucket surface | How this project uses it | Why this is compliant |
| --- | --- | --- |
| **Repository storage** | Push-mirror of the canonical Forgejo repository for redundancy and concentration-risk reduction. | Used to host source for a free / open-source project. Not used as a generic backup or file-storage service. |
| **Issues / Jira link** | Not enabled on the mirror. The canonical issue tracker is on Forgejo. | No collaboration surface is being relied on. |
| **Pull requests** | Not relied on. The canonical review surface is on Forgejo. | The mirror is one-way. |
| **Bitbucket Pipelines** | **Not enabled.** No `bitbucket-pipelines.yml` is present. If ever enabled, it would be limited to lint/build/test of the mirrored source. | Permitted by Bitbucket's Pipelines policy: build minutes are for the production, testing, deployment, or publication of the software project associated with the repository. |
| **Pipes / custom pipes** | None published from this repository. | No artefact distribution channel is repurposed. |
| **Downloads area** | Not used. | No file-storage misuse. |
| **Snippets** | Not used. | No general-purpose paste-bin use. |
| **Static hosting** | Not used. Bitbucket Cloud has no first-party static-site hosting equivalent to GitHub Pages or GitLab Pages; the agent's public surface is published from the maintainers' self-hosted Forgejo. | No application backend on Bitbucket. |

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
for, nor ported to, Bitbucket Pipelines.**

The directory
[`../precursors/`](../precursors/) contains the earlier github.com-targeted
incarnations of the same agent (under `**/.github/workflows/`). Those
are historical artefacts being migrated; their compliance posture is
governed by [`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They
are not deployed from this repository to any Bitbucket instance.

This repository contains **no `bitbucket-pipelines.yml`**, no
[Bitbucket Pipes][bitbucket-pipes], and no Bitbucket-specific agent
code. The agent runtime is structurally not present on Bitbucket; the
Bitbucket mirror carries source only.

If at any point you (a maintainer or downstream user) intend to enable
a Bitbucket Pipelines configuration that translates any `run-agent`,
public-fabric, or installer workflow into a Pipelines step — in
particular on bitbucket.org — re-read the
[Atlassian Cloud Terms of Service][bitbucket-tos], the
[Atlassian Acceptable Use Policy][atlassian-aup], and the
[Pipelines pricing and limits page][bitbucket-pipelines-pricing] first,
and confirm the use still falls within "production, testing,
deployment, or publication of the software project associated with the
repository." If it does not, run that workflow on the maintainers'
self-hosted Forgejo instead.

## What this project does **not** do on Bitbucket Cloud

To make the boundary explicit, this project does not, and is not
designed to, use bitbucket.org infrastructure for any of the following
— all of which are prohibited by the
[Atlassian Acceptable Use Policy][atlassian-aup] or by Bitbucket's
Pipelines and storage policies:

- Cryptocurrency mining.
- Launching denial-of-service attacks, including via Bitbucket
  Pipelines runners or self-hosted runners attached to a Bitbucket
  workspace.
- Serving as a content delivery network, generic file backup, or media
  host (including via the Downloads area, Snippets, or LFS).
- Running a stand-alone SaaS product or providing compute-as-a-service
  to third parties via Pipelines.
- Spam, mass scraping, or automated abuse of the Bitbucket REST API.
- Bypassing or circumventing Bitbucket Pipelines build-minute quotas,
  storage quotas, or LFS bandwidth limits.
- Hosting malware, phishing content, or content that violates
  third-party rights.
- Holding personal data in a way that Atlassian's privacy posture and
  the [Atlassian Trust Center][atlassian-trust] do not contemplate.

No code in this repository implements any of the above. The agent
runtime is structurally *ineligible* for bitbucket.org deployment: it
requires self-hosted runners with elevated permissions, persistent
server-side state, operator-controlled LLM credentials, and a forge
under operator policy control.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this repository.
- The Bitbucket mirror is push-only from the maintainers' self-hosted
  Forgejo (see the push-mirror configuration in
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md)).
  The Bitbucket App password used for mirroring is scoped to
  `Repositories: Write` and `Pull requests: Write` only, and held in
  the operator's vault, not in source. Where available, a narrower
  [Repository Access Token][bitbucket-tokens] should be preferred over
  a user-scoped App password.
- LLM and infrastructure credentials never need to reach
  bitbucket.org: runners, the LLM server, and the storage are all
  reachable on the same operator-controlled network on the self-hosted
  Forgejo side. Bitbucket Pipelines repository, deployment, and
  workspace variables are not used for agent secrets.

## Reporting a compliance concern

If you believe something in this repository conflicts with Bitbucket's
or Atlassian's terms once these caveats are taken into account, please
open an issue describing the specific file and the specific clause of
the [Atlassian Cloud Terms of Service][bitbucket-tos] or the
[Atlassian Acceptable Use Policy][atlassian-aup] you believe applies.
Maintainers will respond by either correcting the content, moving the
affected behaviour to the Forgejo runtime, or explaining why the use is
in fact permitted.

[bitbucket-tos]: https://www.atlassian.com/legal/cloud-terms-of-service
[atlassian-aup]: https://www.atlassian.com/legal/acceptable-use-policy
[bitbucket-pipelines-pricing]: https://support.atlassian.com/bitbucket-cloud/docs/what-are-build-minutes/
[bitbucket-pipes]: https://support.atlassian.com/bitbucket-cloud/docs/use-pipes-in-bitbucket-pipelines/
[bitbucket-tokens]: https://support.atlassian.com/bitbucket-cloud/docs/repository-access-tokens/
[atlassian-trust]: https://www.atlassian.com/trust

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
