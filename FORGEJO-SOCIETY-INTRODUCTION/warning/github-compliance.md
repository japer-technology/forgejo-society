# GitHub Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the forge,
the runners, the agent lifecycle, the LLM server, the storage, the public
surface — is a self-hosted [Forgejo](https://forgejo.org/) installation on
Ubuntu hardware owned and operated by the project maintainers (see
[`README.md`](../README.md) and [`FORGEJO-SOCIETY-SETUP/`](../../FORGEJO-SOCIETY-SETUP/)).

**GitHub is used as a development environment only.** Specifically, github.com
is used for:

- Hosting the source of the migration plan and the agent code while it is
  being written, reviewed, and refactored.
- Issue-based collaboration during development.
- Acting as one of several **mirrors** of the canonical Forgejo repository
  (alongside Codeberg, GitLab, and Bitbucket — see
  [`FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md),
  [`FORGEJO-SOCIETY-SETUP/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-SETUP/transition-plan/07-gitlab-secondary-forge.md),
  and [`FORGEJO-SOCIETY-SETUP/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-SETUP/transition-plan/06-bitbucket-fallback.md)).

Nothing in this repository is intended to run as a production service on
github.com infrastructure. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-PLAN/`](../../FORGEJO-SOCIETY-PLAN/), and
[`THE-REPO-IS-THE-MIND/`](../THE-REPO-IS-THE-MIND/) is designed to live inside
Forgejo, not GitHub.

## How that posture maps onto GitHub's terms

GitHub's [Acceptable Use Policies][aup] and the
[Actions / Pages service-specific terms][actions-tos] govern what github.com
infrastructure may be used for. The summary is: github.com infrastructure
(Actions minutes, Pages hosting, repository storage) must be used in
connection with developing the software project hosted in the repository,
not as a free general-purpose compute / storage / hosting backend.

This project's posture aligns with that rule because:

| GitHub surface | How this project uses it | Why this is compliant |
| --- | --- | --- |
| **Repository storage** | Source of truth during development; mirrored to Forgejo / Codeberg / GitLab / Bitbucket. | Used to develop the software in the repo. Not used as a generic backup or file-storage service. |
| **Issues** | Development discussion and task tracking. | Standard collaboration use. |
| **Pull requests** | Code review during development. | Standard collaboration use. |
| **GitHub Actions** | Only as needed to develop, lint, build, or test the code in this repo. | Permitted by the [Actions service terms][actions-tos]: Actions are for the production, testing, deployment, or publication of the software project associated with the repository. |
| **GitHub Pages** | Not used as a runtime surface for the agent on github.com. The agent's public surface is published from Forgejo. | Pages is not being used as a stand-alone application backend. |

## Specific subprojects: `FORGEJO-SOCIETY-PAST/` and `REPO/forgejo-intelligence/`

The directory [`FORGEJO-SOCIETY-PAST/`](FORGEJO-SOCIETY-PAST/) contains earlier or sibling experiments —
notably [`FORGEJO-SOCIETY-PAST/github-minimum-intelligence/`](../precursors/github-minimum-intelligence/) —
and [`REPO/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/) (formerly
top-level `.forgejo-intelligence/`, originally `FORGEJO-SOCIETY-PAST/forgejo-intelligence/`)
holds the runnable Forgejo runtime that is
being converted from a GitHub-runtime design to a Forgejo-runtime design. The
conversion is tracked in
[`REPO/forgejo-intelligence/CONVERSION/`](../../FORGEJO-SOCIETY/forgejo-intelligence/CONVERSION/).

Within `forgejo-society`, those subprojects are **source under development**:

- They are not deployed from this repository to run as services on github.com.
- The workflow files they contain
  (`FORGEJO-SOCIETY-PAST/github-minimum-intelligence/.github/workflows/*.yml`) are part of
  the historical artifact being migrated. Where any of them remain enabled
  on github.com they are limited to development purposes for the source
  in this repo (build/lint/test/checkout), not used to provide a
  stand-alone or integrated application or service to third parties.
- The intended runtime for all "intelligence" / agent behaviour is the
  Forgejo-side equivalent under
  [`REPO/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/),
  triggered by [`.forgejo/`](../../.forgejo/) workflows on the self-hosted
  Forgejo instance.

If at any point you (a maintainer) intend to enable one of the
`FORGEJO-SOCIETY-PAST/github-minimum-intelligence/.github/workflows/*.yml` workflows on a
public github.com repository as a user-facing service, re-read the
[Actions service terms][actions-tos] first and confirm the use still falls
within "production, testing, deployment, or publication of the software
project associated with the repository." If it does not, run that workflow
on Forgejo instead.

## What this project does **not** do on github.com

To make the boundary explicit, this project does not, and is not designed
to, use github.com infrastructure for any of the following — all of which
are prohibited by the [AUP][aup] or the [Actions terms][actions-tos]:

- Cryptocurrency mining.
- Launching denial-of-service attacks.
- Serving as a content delivery network, generic file backup, or media host.
- Running a stand-alone SaaS product or providing compute-as-a-service to
  third parties.
- Spam, scraping at scale, or automated abuse of GitHub's APIs.
- Bypassing or circumventing GitHub's rate limits, quotas, or billing.
- Hosting malware, phishing content, or content that violates third-party
  rights.

No code in this repository implements any of the above.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this repository.
- Where workflows reference credentials, they do so via
  `${{ secrets.* }}` indirection (for example
  `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`). The actual
  values live in repository or organisation secret stores, not in source.
- Forgejo-side runtime credentials live on the self-hosted Forgejo
  instance and never transit github.com.

## Reporting a compliance concern

If you believe something in this repository conflicts with GitHub's terms
once these caveats are taken into account, please open an issue describing
the specific file and the specific clause of the
[Acceptable Use Policies][aup] or [Actions service terms][actions-tos]
you believe applies. Maintainers will respond by either correcting the
content, moving the affected behaviour to the Forgejo runtime, or
explaining why the use is in fact permitted.

[aup]: https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies
[actions-tos]: https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#actions

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>
