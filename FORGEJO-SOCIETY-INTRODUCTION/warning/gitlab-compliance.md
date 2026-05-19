# GitLab Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, and the
public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**GitLab is used as a secondary mirror only.** Specifically, GitLab.com
(and, where applicable, any third-party self-managed GitLab instance) is
used for:

- Acting as one of several **mirrors** of the canonical Forgejo
  repository, alongside Codeberg, github.com, and Bitbucket — see
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md),
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
  and [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md).
- Providing redundancy and wider ecosystem discoverability for the
  source code.
- Receiving push-mirrored updates from the canonical Forgejo so that
  GitLab's copy stays current.

Nothing in this repository is intended to run as a production service on
GitLab.com infrastructure. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed to
live inside the maintainers' self-hosted Forgejo, not on GitLab.

## How that posture maps onto GitLab's terms

GitLab.com's [Terms of Use][gitlab-tos] and
[Acceptable Use Policy][gitlab-aup] govern what GitLab.com
infrastructure may be used for. The summary is: GitLab.com infrastructure
(CI/CD compute minutes, Pages hosting, repository storage, container
registry, package registry) must be used in connection with developing
the software project hosted in the repository, not as a free
general-purpose compute, storage, or hosting backend.

This project's posture aligns with that rule because:

| GitLab surface | How this project uses it | Why this is compliant |
| --- | --- | --- |
| **Repository storage** | Mirror of the canonical Forgejo repository, for redundancy and discoverability. | Used to host source for a free / open-source project. Not used as a generic backup or file-storage service. |
| **Issues** | Optional secondary discussion surface during development. The canonical issue tracker is on Forgejo. | Standard collaboration use. |
| **Merge requests** | Optional secondary code-review surface. The canonical review surface is on Forgejo. | Standard collaboration use. |
| **GitLab CI/CD** | Not enabled for agent workloads. If used at all, only for lint/build/test of the mirrored source. | Permitted by GitLab's CI policies: CI is for the production, testing, deployment, or publication of the software project associated with the repository. |
| **GitLab Pages** | Not used as a runtime surface for the agent on GitLab.com. The agent's public surface is published from the maintainers' self-hosted Forgejo. | Pages is not being used as a stand-alone application backend. |
| **Container / package registry** | Not used as a distribution channel from this repository. | No artefact storage repurposed as a general-purpose object store. |

## Specific subprojects: `FORGEJO-SOCIETY/forgejo-intelligence/` and `FORGEJO-SOCIETY-PRECURSOR/`

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and
they are intended to run only on the maintainers' self-hosted Forgejo
instance, with self-hosted Forgejo Runners. **They are not designed for,
nor ported to, GitLab CI/CD.**

The directory [`../precursors/`](../precursors/) contains the earlier
github.com-targeted incarnations of the same agent (under
`**/.github/workflows/`). Those are historical artefacts being migrated;
their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They
are not deployed from this repository to any GitLab instance.

This repository contains **no `.gitlab-ci.yml`** and no GitLab-specific
agent code. The agent runtime is structurally not present on GitLab; the
GitLab mirror carries source only.

If at any point you (a maintainer or downstream user) intend to enable a
GitLab CI/CD pipeline that translates any `run-agent`, public-fabric, or
installer workflow into a GitLab Job — in particular on GitLab.com —
re-read the [GitLab Terms of Use][gitlab-tos] and the
[GitLab Acceptable Use Policy][gitlab-aup] first, and confirm the use
still falls within "production, testing, deployment, or publication of
the software project associated with the repository." If it does not,
run that workflow on the maintainers' self-hosted Forgejo instead.

## What this project does **not** do on GitLab.com

To make the boundary explicit, this project does not, and is not designed
to, use GitLab.com infrastructure for any of the following — all of
which are prohibited by the [GitLab AUP][gitlab-aup] or by GitLab's
CI/CD policies:

- Cryptocurrency mining.
- Launching denial-of-service attacks, including via GitLab Runners.
- Serving as a content delivery network, generic file backup, or media
  host (including via the container or package registry).
- Running a stand-alone SaaS product or providing compute-as-a-service to
  third parties via shared runners or Pages.
- Spam, mass scraping, or automated abuse of the GitLab API.
- Bypassing or circumventing GitLab's CI/CD compute-minute quotas,
  rate limits, or storage quotas.
- Hosting malware, phishing content, or content that violates third-party
  rights.
- Holding personal data in a way that GitLab's privacy posture does not
  contemplate.

No code in this repository implements any of the above. The agent
runtime is structurally *ineligible* for GitLab.com deployment: it
requires self-hosted runners with elevated permissions, persistent
server-side state, operator-controlled LLM credentials, and a forge
under operator policy control.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this repository.
- The GitLab mirror is push-only from the maintainers' self-hosted
  Forgejo (see the push-mirror configuration in
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md)).
  The GitLab personal access token used for mirroring is held in the
  operator's vault, not in source.
- LLM and infrastructure credentials never need to reach GitLab.com:
  runners, the LLM server, and the storage are all reachable on the
  same operator-controlled network on the self-hosted Forgejo side.
  GitLab CI/CD variables are not used for agent secrets.

## Reporting a compliance concern

If you believe something in this repository conflicts with GitLab's
terms once these caveats are taken into account, please open an issue
describing the specific file and the specific clause of the
[GitLab Terms of Use][gitlab-tos] or the
[GitLab Acceptable Use Policy][gitlab-aup] you believe applies.
Maintainers will respond by either correcting the content, moving the
affected behaviour to the Forgejo runtime, or explaining why the use is
in fact permitted.

[gitlab-tos]: https://about.gitlab.com/terms/
[gitlab-aup]: https://handbook.gitlab.com/handbook/legal/acceptable-use-policy/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
