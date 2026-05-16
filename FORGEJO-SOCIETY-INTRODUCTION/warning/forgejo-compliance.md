# Forgejo Compliance

## Project posture

**`forgejo-society` is, first and foremost, a Forgejo project — and Forgejo
is its production runtime, not a mirror.** The forge, the runners, the
agent lifecycle, the LLM server, the storage, and the public surface are
all designed to run inside a self-hosted [Forgejo](https://forgejo.org/)
installation on Ubuntu hardware owned and operated by the project
maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-SETUP/`](../../FORGEJO-SOCIETY-SETUP/)).

The relationship between the project and the wider Forgejo ecosystem is
therefore split across three distinct kinds of host:

- **The maintainers' self-hosted Forgejo instance.** This is the canonical
  home of the project and the only place the agent runtime is intended to
  execute as a long-running service. Policy on this instance is defined by
  the maintainers; the only externally imposed obligations are those that
  follow from the [Forgejo source licence (GPLv3+)][forgejo-license], the
  [Forgejo Code of Conduct][forgejo-coc], and applicable Ubuntu / hardware
  / network rules at the operator's site.
- **A shared public Forgejo instance, primarily
  [Codeberg](https://codeberg.org/), used as a federation mirror.** See
  [`FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md).
  On Codeberg, the project is bound by the
  [Codeberg Terms of Use][codeberg-tos] and the
  [Codeberg "What Codeberg is not"][codeberg-not] policy in addition to
  the upstream Forgejo licence and Code of Conduct.
- **Other forges used as additional mirrors only** — github.com, GitLab,
  and Bitbucket — covered by their own compliance documents (notably
  [`github-compliance.md`](github-compliance.md)).

Nothing in this repository is intended to use a *shared* Forgejo instance
(Codeberg, or anyone else's public Forgejo) as a free general-purpose
compute, storage, or hosting backend. The cognitive ecology described in
[`THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-PLAN/`](../../FORGEJO-SOCIETY-PLAN/), and
[`THE-REPO-IS-THE-MIND/`](../THE-REPO-IS-THE-MIND/) is designed to live
inside the maintainers' own Forgejo, with shared instances treated only
as read-mostly mirrors of source code.

## How that posture maps onto Forgejo's terms

Forgejo itself is free, copyleft software; there is no central operator
imposing acceptable-use rules on every Forgejo deployment. Compliance on
Forgejo therefore has three independent layers, each of which this project
addresses explicitly:

1. **The Forgejo source licence (GPLv3+).** The project does not modify
   and redistribute Forgejo itself; it consumes upstream Forgejo
   binaries / packages and runs its own code (under
   [`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
   and elsewhere) on top. The project's own code is published under the
   licence(s) declared in its source tree and inherits no GPL obligation
   from being co-located with Forgejo on the same host.
2. **The [Forgejo Code of Conduct][forgejo-coc] and community norms.** The
   project complies as a community participant: issues, pull requests,
   discussions, and federated interactions follow the same conduct
   expectations on the maintainers' instance, on Codeberg, and on any
   federated Forgejo instance the project communicates with.
3. **The host instance's terms.** On the maintainers' instance, those
   terms are set by the maintainers themselves. On Codeberg, the
   [Codeberg Terms of Use][codeberg-tos] and
   [Codeberg "What Codeberg is not"][codeberg-not] apply — most
   importantly, that Codeberg is a forge for free / open-source software
   development, not a generic compute, hosting, file storage, or
   media-serving service.

This project's posture aligns with all three layers as follows:

| Forgejo surface | How this project uses it on the maintainers' self-hosted instance | How this project uses it on Codeberg / other shared Forgejo | Why this is compliant |
| --- | --- | --- | --- |
| **Repository storage** | Source of truth for the running system. | Mirror of the canonical repository, for federation, discoverability, and disaster recovery. | Used to host source for a free / open-source project. Not used as a generic backup or file-storage service. |
| **Issues** | Live operations channel for the project and the agent. | Standard development discussion and task tracking. | Standard collaboration use under both the Forgejo CoC and Codeberg's Terms of Use. |
| **Pull requests** | Code review and merge workflow. | Code review during development. | Standard collaboration use. |
| **Forgejo Actions / Forgejo Runner** | Production CI plus the agent runtime, executing on runners attached to the maintainers' own Forgejo instance — i.e. on hardware the maintainers own. | Limited to lint / build / test of the source in the mirror, on Codeberg-provided or self-attached runners, in line with [Codeberg CI policy][codeberg-ci]. | Self-hosted runners on the maintainers' own hardware are not bound by any third-party quota; on Codeberg, runners are used only for SDLC of the mirrored source. |
| **Forgejo Pages / public web surface** | The agent's public surface (the "public-fabric" output) is published from the maintainers' self-hosted Forgejo, on the maintainers' own bandwidth. | Not used. Codeberg Pages is reserved for project documentation only, never as the agent's public output surface. | Application-style hosting is kept on infrastructure the project owns. |
| **Federation (ActivityPub / Forgejo federation)** | Outbound: announce releases, issues, milestones to subscribed instances. | Inbound / outbound: participate in federated discussions where supported. | Federation is used in the way it was designed: to share project activity, not to broadcast spam, scrape data, or proxy traffic. |

## Specific subprojects: `FORGEJO-SOCIETY/forgejo-intelligence/` and `FORGEJO-SOCIETY-PRECURSOR/`

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and they
are intended to run only on the maintainers' self-hosted Forgejo
instance, with self-hosted Forgejo Runners.

The directory [`../precursors/`](../precursors/)
contains the earlier github.com-targeted incarnations of the same agent
(under `**/.github/workflows/`). Those are **historical artefacts being
migrated**; their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. They are
not deployed from this repository to any Forgejo instance.

Within `forgejo-society`, the Forgejo subprojects are **production code**
on the self-hosted instance and **source under development** everywhere
else:

- On the maintainers' Forgejo: the workflows under
  [`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
  may be enabled with secrets wired up, because the maintainers own the
  runners, the bandwidth, the LLM credentials, and the policy.
- On Codeberg or any other shared Forgejo: those same workflows are
  expected to be **disabled**, or limited to lint/build/test of the
  source. Issue-triggered LLM inference, public-fabric publication, and
  any always-on agent loop must not be enabled on a shared instance under
  any circumstances.

If at any point you (a maintainer or downstream user) intend to enable a
`run-agent`, public-fabric, or installer workflow on a Forgejo instance
that is not your own — in particular Codeberg — re-read the
[Codeberg Terms of Use][codeberg-tos] and the
[Codeberg "What Codeberg is not"][codeberg-not] page first, and confirm
the use still falls within "free / open-source software development,
including its CI." If it does not, run that workflow on the maintainers'
self-hosted Forgejo instead.

## What this project does **not** do on shared Forgejo instances

To make the boundary explicit, this project does not, and is not designed
to, use a shared Forgejo instance (Codeberg or otherwise) for any of the
following — all of which are forbidden by typical Forgejo-instance terms,
including the [Codeberg Terms of Use][codeberg-tos] and
[Codeberg "What Codeberg is not"][codeberg-not]:

- Cryptocurrency mining or validator hosting.
- Launching denial-of-service attacks, including via Forgejo Actions
  runners or via federation traffic.
- Serving as a content delivery network, generic file backup, or media
  host.
- Running a stand-alone SaaS product or providing compute-as-a-service to
  third parties via runners or Pages.
- Spam, mass scraping, or automated abuse of the Forgejo API or
  ActivityPub federation endpoints.
- Bypassing or circumventing the host instance's rate limits, runner
  quotas, or storage quotas.
- Hosting malware, phishing content, or content that violates third-party
  rights.
- Holding personal data in a way that the host instance's privacy posture
  does not contemplate.

No code in this repository implements any of the above. The agent runtime
is structurally *ineligible* for shared-instance deployment: it requires
self-hosted runners with elevated permissions, persistent server-side
state, and operator-controlled LLM credentials.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this repository.
- Where workflows reference credentials, they do so via Forgejo Actions
  secret indirection (for example `${{ secrets.OPENAI_API_KEY }}`,
  `${{ secrets.ANTHROPIC_API_KEY }}`, the per-runner Forgejo token, etc.).
  The actual values live in repository or organisation secret stores on
  the self-hosted Forgejo instance, not in source.
- LLM and infrastructure credentials never need to leave the maintainers'
  self-hosted Forgejo: runners, the LLM server, and the storage are all
  reachable on the same operator-controlled network. Forgejo Actions
  secrets are not propagated to mirrors on Codeberg or elsewhere.
- Federation keys (the instance's ActivityPub signing keys, registration
  tokens, etc.) are managed by the Forgejo administrator on the
  self-hosted instance and never appear in repository content.

## Reporting a compliance concern

If you believe something in this repository conflicts with the Forgejo
project's licensing, the [Forgejo Code of Conduct][forgejo-coc], or the
terms of a specific Forgejo host instance (such as the
[Codeberg Terms of Use][codeberg-tos]) once these caveats are taken into
account, please open an issue describing the specific file and the
specific clause you believe applies. Maintainers will respond by either
correcting the content, moving the affected behaviour off the shared
instance and onto the self-hosted runtime, or explaining why the use is
in fact permitted.

[forgejo-license]: https://codeberg.org/forgejo/forgejo/src/branch/forgejo/LICENSE
[forgejo-coc]: https://codeberg.org/forgejo/code-of-conduct
[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>

