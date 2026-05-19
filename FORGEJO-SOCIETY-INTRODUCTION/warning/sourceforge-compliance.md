# SourceForge Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, and the
public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**SourceForge is used as a secondary mirror only, if at all.**
Specifically, [SourceForge.net][sourceforge] — and, where applicable,
any other Apache-Allura-based instance — is contemplated for:

- Acting as one of several **mirrors** of the canonical Forgejo
  repository, alongside Codeberg, github.com, GitLab, and Bitbucket —
  see
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md),
  and
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md).
- Providing redundancy and wider ecosystem discoverability for the
  source code, particularly for readers who reach the project through
  SourceForge's long-standing project directory.
- Receiving push-mirrored updates from the canonical Forgejo so that
  any SourceForge copy stays current.

Nothing in this repository is intended to run as a production service on
SourceForge infrastructure. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed to
live inside the maintainers' self-hosted Forgejo, not on SourceForge.

## How that posture maps onto SourceForge's terms

SourceForge's [Terms of Use][sourceforge-tos] and its
[site documentation for projects][sourceforge-docs] govern what
SourceForge infrastructure may be used for. The summary is: SourceForge
project resources (repository hosting, the Files release system, Project
Web hosting, Tickets, Wiki, and the discussion forums) are provided to
support an open-source software project — that is, the development,
release, and documentation of the software hosted in the project — and
not as a free general-purpose compute, storage, hosting, or messaging
backend.

This project's posture aligns with that rule because:

| SourceForge surface | How this project uses it | Why this is compliant |
| --- | --- | --- |
| **Source repository (Git)** | Mirror of the canonical Forgejo repository, for redundancy and discoverability. | Used to host source for a free / open-source project. Not used as a generic backup or file-storage service. |
| **Files (release downloads)** | Not used as a distribution channel from this repository. If ever used, only for tagged source releases of the software itself. | Files is not being used as a general-purpose CDN or as an output dump for AI-generated artefacts. |
| **Project Web** | Not used as a runtime surface for the agent on SourceForge. The agent's public surface is published from the maintainers' self-hosted Forgejo. | Project Web is not being used as a stand-alone application backend. |
| **Tickets** | Optional secondary issue surface during development. The canonical issue tracker is on Forgejo. | Standard collaboration use, not wired to off-platform compute. |
| **Wiki** | If used, only for human-authored documentation that mirrors documentation already in the Forgejo repository. | Standard project-documentation use. |
| **Discussion forums / mailing lists** | Optional secondary discussion surface. | Standard collaboration use, not wired to an LLM responder. |

## Specific subprojects: `FORGEJO-SOCIETY/forgejo-intelligence/` and `FORGEJO-SOCIETY-PRECURSOR/`

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and
they are intended to run only on the maintainers' self-hosted Forgejo
instance, with self-hosted Forgejo Runners. **SourceForge does not
provide a native CI/CD pipeline analogue, and these workflows are not
designed for, nor ported to, any external job-runner harness driven
from SourceForge.**

The directory
[`FORGEJO-SOCIETY-PRECURSOR/`](../../FORGEJO-SOCIETY-PRECURSOR/)
contains the earlier github.com-targeted incarnations of the same agent
(under `**/.github/workflows/`). Those are historical artefacts being
migrated; their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They are
not deployed from this repository to any SourceForge project.

This repository contains **no SourceForge-specific configuration** and
no SourceForge-targeted agent code. The agent runtime is structurally
not present on SourceForge; any SourceForge mirror would carry source
only.

If at any point you (a maintainer or downstream user) intend to wire any
`run-agent`, public-fabric, or installer workflow to a SourceForge
surface — for example by webhooking issue events out to off-platform
compute and posting replies back as Ticket comments, or by publishing
agent output to Project Web or the Files system — re-read the
[SourceForge Terms of Use][sourceforge-tos] and the
[site documentation for projects][sourceforge-docs] first, and confirm
the use still falls within "development, release, and documentation of
the software hosted in the project." If it does not, run that workflow
on the maintainers' self-hosted Forgejo instead.

## What this project does **not** do on SourceForge

To make the boundary explicit, this project does not, and is not
designed to, use SourceForge infrastructure for any of the following —
all of which are inconsistent with the [SourceForge Terms of Use][sourceforge-tos]
or with the documented purpose of SourceForge project resources:

- Cryptocurrency mining or any unrelated compute workload.
- Serving as a content delivery network, generic file backup, or media
  host — including via the Files release system or Project Web.
- Distributing bundled third-party installers, "wrapped" binaries with
  injected adware or telemetry, or anything that resembles the
  historical DevShare pattern. The project's binaries (if any) are
  released only as the unmodified upstream artefacts they claim to be.
- Running a stand-alone SaaS product or providing
  compute-as-a-service to third parties through any SourceForge
  surface.
- Operating a public LLM proxy through Tickets, Discussion, or any
  webhook-driven integration that uses SourceForge as the user-facing
  surface.
- Spam, mass scraping, or automated abuse of SourceForge APIs.
- Hosting malware, phishing content, or content that violates
  third-party rights.
- Holding personal data in a way that SourceForge's privacy posture
  does not contemplate.

No code in this repository implements any of the above. The agent
runtime is structurally *ineligible* for SourceForge deployment: it
requires self-hosted runners with elevated permissions, persistent
server-side state, operator-controlled LLM credentials, and a forge
under operator policy control — none of which a SourceForge project
provides.

## Licence posture

SourceForge has historically required projects hosted in its directory
to carry an OSI-approved open-source licence. This project is published
under the licence declared at the root of the repository (see
[`LICENSE`](../../LICENSE), or the equivalent file on each mirror), and
the SourceForge mirror — if and when one is established — carries the
same licence and the same source as the canonical Forgejo repository.
No additional, SourceForge-specific licence is granted or implied by
the existence of a mirror.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this
  repository.
- Any SourceForge mirror is push-only from the maintainers' self-hosted
  Forgejo. The SourceForge account password or API token used for
  mirroring is held in the operator's vault, not in source, and is
  scoped narrowly to the single project.
- LLM and infrastructure credentials never need to reach SourceForge:
  runners, the LLM server, and the storage are all reachable on the
  same operator-controlled network on the self-hosted Forgejo side.
  SourceForge project settings are not used for agent secrets.

## Reporting a compliance concern

If you believe something in this repository conflicts with
SourceForge's terms once these caveats are taken into account, please
open an issue describing the specific file and the specific clause of
the [SourceForge Terms of Use][sourceforge-tos] or the
[site documentation for projects][sourceforge-docs] you believe
applies. Maintainers will respond by either correcting the content,
moving the affected behaviour to the Forgejo runtime, or explaining
why the use is in fact permitted.

[sourceforge]: https://sourceforge.net/
[sourceforge-tos]: https://sourceforge.net/user/main/tos.php
[sourceforge-docs]: https://sourceforge.net/p/forge/documentation/Docs%20Home/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
