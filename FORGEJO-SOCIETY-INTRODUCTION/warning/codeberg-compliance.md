# Codeberg Compliance

## Project posture

**`forgejo-society` is a Forgejo project.** Its runtime target — the
forge, the runners, the agent lifecycle, the LLM server, the storage,
and the public surface — is a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

**Codeberg is used as a source mirror only.** Codeberg
([codeberg.org](https://codeberg.org/)) is itself a Forgejo instance,
operated as a shared public forge by Codeberg e.V. Because Codeberg
*is* Forgejo, the temptation to treat it as a second runtime — "we
already wrote `.forgejo/workflows/`, we may as well point them at
Codeberg's runners" — is unusually strong, and the rest of this
document exists to draw the line clearly. Specifically, Codeberg is
used for:

- Acting as one of several **mirrors** of the canonical Forgejo
  repository, alongside github.com, GitLab, and Bitbucket — see
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md),
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/07-gitlab-secondary-forge.md),
  and [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/06-bitbucket-fallback.md).
- Providing a public, non-github.com discovery surface that runs on the
  same software stack the project itself targets.
- Receiving push-mirrored updates from the canonical self-hosted
  Forgejo so that Codeberg's copy stays current.
- Participating, where appropriate, in Forgejo federation as a peer
  instance.

Nothing in this repository is intended to run as a production service
on Codeberg infrastructure. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
and [`THE-REPO-IS-THE-MIND/`](../../THE-REPO-IS-THE-MIND/) is designed
to live inside the maintainers' self-hosted Forgejo, not on a shared
Forgejo instance operated by someone else.

The Forgejo-wide posture (Codeberg as one specific case of a shared
Forgejo) is covered in [`forgejo-compliance.md`](forgejo-compliance.md);
this document focuses on the parts that are specifically Codeberg's:
the [Codeberg Terms of Use][codeberg-tos], the
["What Codeberg is"][codeberg-not] policy, and the
[Codeberg CI documentation][codeberg-ci] (Woodpecker CI plus
self-hosted Forgejo Actions runners).

## How that posture maps onto Codeberg's terms

Codeberg e.V. publishes three documents that together govern what
Codeberg infrastructure may be used for:

- The [Codeberg Terms of Use][codeberg-tos].
- The ["What Codeberg is" / "What Codeberg is not"][codeberg-not]
  policy page.
- The [Codeberg CI documentation][codeberg-ci] (Woodpecker CI and the
  guidance on Forgejo Actions runners).

The headline of all three is the same: Codeberg is a forge **for free
and open-source software development**, operated as a non-profit
public good, not a generic compute, storage, or hosting backend.

This project's posture aligns with that rule because:

| Codeberg surface | How this project uses it | Why this is compliant |
| --- | --- | --- |
| **Repository storage** | Mirror of the canonical Forgejo repository, for redundancy and a non-github.com public surface. | The repository contains source for a free / open-source project published under the project's stated licence. Not used as a generic backup or file-storage service. |
| **Issues** | Optional secondary discussion surface during development. The canonical issue tracker is on the maintainers' self-hosted Forgejo. | Standard collaboration use under the [Codeberg Terms of Use][codeberg-tos]. |
| **Pull requests** | Optional secondary code-review surface. The canonical review surface is on the maintainers' Forgejo. | Standard collaboration use. |
| **Codeberg CI (Woodpecker)** | Not enabled for agent workloads. If used at all, only for lint / build / test of the mirrored source. | Permitted by the [Codeberg CI policy][codeberg-ci]: CI is for building, testing, and packaging the project's own software, not for running an LLM service. |
| **Forgejo Actions on Codeberg** | Not enabled for the agent runtime. If runners are attached at all, they are the project's own self-hosted runners and they run only lint / build / test of the mirrored source, never `run-agent`, never installer, never the public-fabric publisher. | Forgejo Actions is supported on Codeberg with self-attached runners; the rule is the same as for Woodpecker — CI of the project's own software, not chatbot hosting. |
| **Codeberg Pages** | Not used as a runtime surface for the agent. The agent's public surface ("public-fabric") is published from the maintainers' self-hosted Forgejo, on the maintainers' own bandwidth. | Pages on Codeberg is for project documentation; using it as an application backend is exactly what the ["What Codeberg is" / "is not"][codeberg-not] page rules out. |
| **Federation** | Outbound only: announce releases, issues, and milestones to subscribed peers. | Federation is used in the way it was designed — to share project activity — not to broadcast spam or to proxy traffic. |

## Specific subprojects: `FORGEJO-SOCIETY/forgejo-intelligence/` and `FORGEJO-SOCIETY-PRECURSOR/`

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and
they are intended to run only on the maintainers' self-hosted Forgejo
instance, with self-hosted Forgejo Runners. They are **not** to be
enabled on Codeberg, even though Codeberg supports both Woodpecker CI
and Forgejo Actions runners. The
[`forgejo-compliance.md`](forgejo-compliance.md) document spells out
the same posture for shared Forgejo instances generally; the line on
Codeberg is the strictest expression of that posture, because Codeberg
is the largest shared Forgejo that someone might plausibly mistake for
a "free runtime".

The directory [`../precursors/`](../precursors/) contains the earlier
github.com-targeted incarnations of the same agent (under
`**/.github/workflows/`). Those are historical artefacts being
migrated; their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They
are not deployed from this repository to Codeberg.

This repository contains no Codeberg-specific agent code: no
Woodpecker `.woodpecker.yml`, no Codeberg-targeted Forgejo Actions
workflow that is distinct from the self-hosted set, no Codeberg
runner registration. The agent runtime is structurally absent from
the Codeberg side; the Codeberg mirror carries source only.

If at any point you (a maintainer or downstream user) intend to
enable Woodpecker CI on the Codeberg mirror, attach a Forgejo Actions
runner to a Codeberg repository, or translate any `run-agent`,
public-fabric, or installer workflow into a job that runs on Codeberg
infrastructure, re-read the [Codeberg Terms of Use][codeberg-tos],
the ["What Codeberg is" / "is not"][codeberg-not] page, and the
[Codeberg CI documentation][codeberg-ci] first, and confirm the use
still falls within "free / open-source software development,
including its CI." If it does not, run that workflow on the
maintainers' self-hosted Forgejo instead.

## What this project does **not** do on Codeberg

To make the boundary explicit, this project does not, and is not
designed to, use Codeberg infrastructure for any of the following —
all of which are forbidden by the [Codeberg Terms of Use][codeberg-tos],
the ["What Codeberg is" / "is not"][codeberg-not] policy, or the
[Codeberg CI documentation][codeberg-ci]:

- Cryptocurrency mining, validator hosting, or any "free CPU" workload.
- Launching denial-of-service attacks, including via Codeberg CI
  Woodpecker agents or via Forgejo Actions runners attached to a
  Codeberg repository.
- Serving as a content delivery network, generic file backup, or media
  host (including via Codeberg Pages or the attachments mechanism).
- Running a stand-alone SaaS product or providing compute-as-a-service
  to third parties via Codeberg CI or Pages.
- Spam, mass scraping, or automated abuse of the Codeberg API or of
  Codeberg's federation surface.
- Bypassing or circumventing Codeberg's CI quotas, rate limits, or
  storage quotas.
- Hosting malware, phishing content, or content that violates
  third-party rights.
- Holding personal data in a way that Codeberg's privacy posture, as
  set out by Codeberg e.V., does not contemplate.
- Using Codeberg as the "public face" of an LLM service whose
  inference happens on third-party APIs paid for elsewhere — even
  though that would visually appear to be "just CI".

No code in this repository implements any of the above. The agent
runtime is structurally ineligible for Codeberg deployment: it
requires self-hosted runners with elevated permissions, persistent
server-side state, operator-controlled LLM credentials, and a forge
under operator policy control.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this
  repository.
- The Codeberg mirror is push-only from the maintainers' self-hosted
  Forgejo (see the push-mirror configuration in
  [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md)).
  The Codeberg API token used for mirroring is held in the operator's
  vault, not in source, and is scoped to the minimum permissions
  needed to push the mirror.
- LLM and infrastructure credentials never need to reach Codeberg:
  runners, the LLM server, and the storage are all reachable on the
  same operator-controlled network on the self-hosted Forgejo side.
  Codeberg CI secrets and Forgejo Actions secrets on the Codeberg
  side are not used for agent credentials.

## Reporting a compliance concern

If you believe something in this repository conflicts with the
[Codeberg Terms of Use][codeberg-tos], the ["What Codeberg is" /
"is not"][codeberg-not] policy, or the
[Codeberg CI documentation][codeberg-ci] once these caveats are taken
into account, please open an issue describing the specific file and
the specific clause you believe applies. Maintainers will respond by
either correcting the content, moving the affected behaviour off the
Codeberg mirror and onto the self-hosted Forgejo runtime, or
explaining why the use is in fact permitted.

[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>
