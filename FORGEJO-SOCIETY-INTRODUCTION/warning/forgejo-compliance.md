# Forgejo Compliance

> **The affirmative document in this folder.** Every other compliance
> file here describes a forge the project either mirrors to under tight
> constraints, or refuses to touch at all. This one describes the forge
> the project is *built for*: download [Forgejo](https://forgejo.org/),
> install it on Ubuntu hardware you own, and run the whole society
> inside it. That is the recommended path. Everything else in this
> folder exists to keep you from accidentally drifting off it.

## Project posture

**`forgejo-society` is a Forgejo project, and Forgejo is its production
runtime.** The forge, the runners, the agent lifecycle, the LLM server,
the storage, and the public surface are all designed to live inside a
self-hosted Forgejo installation on Ubuntu hardware owned and operated
by the project's maintainers (see [`README.md`](../README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)).

When the maintainers say "the forge is the mind," they mean a *specific
forge on specific hardware*: Forgejo, installed by you, on a machine
you own, governed by files you can read. Forgejo is the only platform
in this folder where running the agent is the recommended action rather
than a documented refusal.

## What the recommended path looks like

The recommended deployment is, in order:

1. **Download Forgejo.** Take a current release from
   [forgejo.org](https://forgejo.org/) or from the upstream Forgejo
   repository on [Codeberg](https://codeberg.org/forgejo/forgejo). Use
   the unmodified upstream binary or package; this project does not
   ship a fork of Forgejo and does not require one.
2. **Install it on Ubuntu hardware you own.** The transition plan in
   [`FORGEJO-SOCIETY-INSTALLATION/`](../../FORGEJO-SOCIETY-INSTALLATION/)
   assumes a self-hosted Forgejo on an Ubuntu host the operator
   controls — network, disks, backups, and all.
3. **Attach a Forgejo Runner on the same hardware.** The runner that
   executes the workflows under
   [`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
   must be one the operator owns. Runner cycles, LLM credentials, and
   bandwidth all live on the operator's side of the wire.
4. **Clone this repository into your Forgejo.** Push the canonical
   source into a repository on your own instance and enable the agent
   workflows there. From that point on, every layer the agent touches
   — git, runner, secrets, Pages, federation — is yours.

After step 4 you are running the society as designed. Nothing
described in
[`THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/),
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/),
or [`THE-REPO-IS-THE-MIND/`](../THE-REPO-IS-THE-MIND/) requires anyone
else's infrastructure.

## How that posture maps onto Forgejo's terms

Forgejo itself is free, copyleft software; there is no central operator
imposing acceptable-use rules on every Forgejo deployment. Compliance
on Forgejo therefore has three independent layers, and on the
self-hosted runtime each one resolves cleanly:

1. **The Forgejo source licence (GPLv3+).** The project does not
   modify and redistribute Forgejo itself. It consumes upstream Forgejo
   binaries and packages and runs its own code (under
   [`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
   and elsewhere) on top. The project's own code is published under
   the licence(s) declared in its source tree and inherits no GPL
   obligation from being co-located with Forgejo on the same host.
   See [`forgejo-license`][forgejo-license].
2. **The [Forgejo Code of Conduct][forgejo-coc] and community norms.**
   The project complies as a community participant: issues, pull
   requests, discussions, and federated interactions follow the same
   conduct expectations on the maintainers' instance, on any source
   mirror, and on any federated Forgejo instance the project
   communicates with.
3. **The host instance's terms.** On the maintainers' self-hosted
   Forgejo, those terms are set by the maintainers themselves —
   constrained only by upstream licence, code of conduct, and local
   law. There is no third-party operator quota, acceptable-use policy,
   or shared-resource concern to negotiate.

The result is the simplest compliance posture in this folder. Compare
the other compliance documents — each one has to itemise what cannot
be done on someone else's infrastructure. On Forgejo, on your own
hardware, the answer is: run it.

## Forgejo surfaces, used as intended

| Forgejo surface | How this project uses it on your self-hosted instance | Why this is straightforward |
| --- | --- | --- |
| **Repository storage** | Source of truth for the running system. Holds the spec, the agent payload, the active settlements, the memory. | Used to host source for a free / open-source project on infrastructure you own. |
| **Issues** | Live operations channel for the project and the agent — the conversation surface where agencies, critics, and human governance meet. | A primary collaboration surface used as designed. |
| **Pull requests** | Code review and merge workflow. | A primary collaboration surface used as designed. |
| **Forgejo Actions / Forgejo Runner** | Production CI plus the agent runtime, executing on runners attached to your own Forgejo on your own hardware. | Self-hosted runners on the operator's own hardware are bound by no third-party quota. The runner cycles are paying for your own work. |
| **Forgejo Pages / public web surface** | The agent's public surface (the "public-fabric" output) is published from your self-hosted Forgejo, on your own bandwidth. | Application-style hosting is permitted because the application and the infrastructure belong to the same operator. |
| **Federation (ActivityPub / Forgejo federation)** | Outbound: announce releases, issues, milestones to subscribed instances. Inbound / outbound: participate in federated discussions where supported. | Federation is used in the way it was designed: to share project activity, at human cadence, with federation hygiene the operator can observe. |

This table is the inverse of every other compliance table in this
folder. There, the rows enumerate what is *off*. Here, the rows
enumerate what is *on*.

## Specific subprojects on your self-hosted Forgejo

The directory
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/)
holds the runnable Forgejo runtime — including the workflows under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/)
and the agent payload under
[`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/).
These are the workflows that *are intended* to run as a service, and
they are intended to run on the maintainers' — and on your —
self-hosted Forgejo, with self-hosted Forgejo Runners.

The directory [`../precursors/`](../precursors/) contains the earlier
github.com-targeted incarnations of the same agent (under
`**/.github/workflows/`). Those are historical artefacts being
migrated; their compliance posture is governed by
[`github-compliance.md`](github-compliance.md) and
[`github-warning.md`](github-warning.md), not by this document. On your
self-hosted Forgejo you should be enabling the Forgejo workflows, not
the precursors.

## The two caveats

The recommended path is "install Forgejo on your own hardware." Two
narrow caveats apply.

### Caveat 1: shared Forgejo instances (e.g. Codeberg) are mirrors, never runtimes

Shared public Forgejo instances such as [Codeberg](https://codeberg.org/)
are a legitimate, encouraged destination for **a source mirror** of the
canonical repository — see
[`FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md).
On those instances the project is bound by the
[Codeberg Terms of Use][codeberg-tos] and the
[Codeberg "What Codeberg is not"][codeberg-not] policy in addition to
the upstream Forgejo licence and Code of Conduct, and the consequence
is simple: on a shared instance, the agent workflows must be
**disabled**, or limited to lint / build / test of the mirrored
source. Issue-triggered LLM inference, public-fabric publication, and
any always-on agent loop must not be enabled on a shared instance
under any circumstances. The full enumeration of what would break if
that boundary were ignored lives in
[`forgejo-warning.md`](forgejo-warning.md).

This caveat is not a contradiction of the affirmative posture; it is
the reason the affirmative posture insists on the word *self-hosted*.
Forgejo is the recommended runtime. *Your* Forgejo is the recommended
runtime.

### Caveat 2: self-hosting is permission, not exemption

Owning the hardware removes the third-party-terms layer but does not
remove operator responsibility. Self-hosted runners still have
elevated permissions; LLM credentials still cost money per call;
federation traffic still reaches other people's instances; the agent's
memory still grows on a finite disk. The residual disciplines that
survive self-hosting are enumerated in
[`forgejo-warning.md`](forgejo-warning.md).

## What this project does **not** do on shared Forgejo instances

To make the boundary explicit — and so this document stays consistent
with the rest of the warning folder — the project does not, and is not
designed to, use a shared Forgejo instance (Codeberg or otherwise) for
any of the following, all of which are forbidden by typical
Forgejo-instance terms, including the
[Codeberg Terms of Use][codeberg-tos] and
[Codeberg "What Codeberg is not"][codeberg-not]:

- Cryptocurrency mining or validator hosting.
- Launching denial-of-service attacks, including via Forgejo Actions
  runners or via federation traffic.
- Serving as a content delivery network, generic file backup, or media
  host.
- Running a stand-alone SaaS product or providing compute-as-a-service
  to third parties via runners or Pages.
- Spam, mass scraping, or automated abuse of the Forgejo API or
  ActivityPub federation endpoints.
- Bypassing or circumventing the host instance's rate limits, runner
  quotas, or storage quotas.
- Hosting malware, phishing content, or content that violates third-
  party rights.
- Holding personal data in a way that the host instance's privacy
  posture does not contemplate.

The agent runtime is structurally *ineligible* for shared-instance
deployment: it requires self-hosted runners with elevated permissions,
persistent server-side state, and operator-controlled LLM credentials.
On your own Forgejo, those are unremarkable requirements. On someone
else's Forgejo, they are disqualifying.

## Secrets and credentials

- No secrets, API keys, or credentials are committed to this
  repository.
- Where workflows reference credentials, they do so via Forgejo
  Actions secret indirection (for example `${{ secrets.OPENAI_API_KEY }}`,
  `${{ secrets.ANTHROPIC_API_KEY }}`, the per-runner Forgejo token,
  and so on). The actual values live in repository or organisation
  secret stores on your self-hosted Forgejo instance, not in source.
- LLM and infrastructure credentials never need to leave your
  self-hosted Forgejo: runners, the LLM server, and the storage are
  all reachable on the same operator-controlled network. Forgejo
  Actions secrets must not be propagated to mirrors on Codeberg or
  elsewhere.
- Federation keys (the instance's ActivityPub signing keys,
  registration tokens, and so on) are managed by the Forgejo
  administrator on the self-hosted instance and never appear in
  repository content.

## Reporting a compliance concern

If you believe something in this repository conflicts with the Forgejo
project's licensing, the [Forgejo Code of Conduct][forgejo-coc], or
the terms of a specific Forgejo host instance (such as the
[Codeberg Terms of Use][codeberg-tos]) once these caveats are taken
into account, please open an issue describing the specific file and
the specific clause you believe applies. Maintainers will respond by
either correcting the content, moving the affected behaviour off the
shared instance and onto the self-hosted runtime, or explaining why
the use is in fact permitted.

[forgejo-license]: https://codeberg.org/forgejo/forgejo/src/branch/forgejo/LICENSE
[forgejo-coc]: https://codeberg.org/forgejo/code-of-conduct
[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
