# MIND / Publicity

> *How does the world come to know us, and how do we keep that record honest?*

This folder declares the **society of minds in charge of publicity** for the
Forgejo Society project. It is the Federation's wiring diagram for the
sub-society that, once launched, owns the responsibilities described in
[`FORGEJO-SOCIETY-PUBLICITY/`](../../../FORGEJO-SOCIETY-PUBLICITY/README.md).

The Publicity sub-society is itself a small federation: a set of Forgejo
repositories, each a society in its own right, wired together through the
inter-repo channel/bridge/censor protocol defined by
[`FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md).

## What lives here

| File / Folder | Purpose |
|---|---|
| [`society.yml`](society.yml) | The sub-society's identity, role, owning Federation, and the set of member repos that compose it. |
| [`repos/`](repos/README.md) | One declarative file per member repo, naming the repo, its remit, its lead agency, the publicity strategy document it implements, and its inbound/outbound channel surface. |
| [`wiring/`](wiring/README.md) | Channel declarations: how the member repos are wired to each other (`channels.yml`) and how the sub-society reports back to the Federation root (`federation-uplink.yml`). |

## The repos in this society

The Publicity sub-society is composed of one repo per top-level publicity
pillar, plus a coordinating "presenter" repo that holds the public voice and
brokers calls between the member repos and the Federation. Each member repo
implements one numbered strategy document from
[`FORGEJO-SOCIETY-PUBLICITY/`](../../../FORGEJO-SOCIETY-PUBLICITY/README.md).

| Repo (planned) | Role | Implements |
|---|---|---|
| `forgejo-society-publicity-presenter` | Presenter & broker — the only repo that speaks back to the Federation. | [`00-overview.md`](../../../FORGEJO-SOCIETY-PUBLICITY/00-overview.md), [`01-principles.md`](../../../FORGEJO-SOCIETY-PUBLICITY/01-principles.md) |
| `forgejo-society-publicity-announcements` | Owns dated public-facing announcements. | [`02-announcements.md`](../../../FORGEJO-SOCIETY-PUBLICITY/02-announcements.md) |
| `forgejo-society-publicity-media-relations` | Owns the media list and outreach protocols. | [`03-media-relations.md`](../../../FORGEJO-SOCIETY-PUBLICITY/03-media-relations.md) |
| `forgejo-society-publicity-events` | Owns talks, demos, podcasts, panels. | [`04-events.md`](../../../FORGEJO-SOCIETY-PUBLICITY/04-events.md) |
| `forgejo-society-publicity-coverage` | Owns the append-only external coverage log. | [`05-coverage.md`](../../../FORGEJO-SOCIETY-PUBLICITY/05-coverage.md) |
| `forgejo-society-publicity-statements` | Owns official public statements. | [`06-statements.md`](../../../FORGEJO-SOCIETY-PUBLICITY/06-statements.md) |
| `forgejo-society-publicity-crisis` | Owns crisis communications. | [`07-crisis.md`](../../../FORGEJO-SOCIETY-PUBLICITY/07-crisis.md) |
| `forgejo-society-publicity-recognition` | Owns awards, mentions, citations. | [`08-recognition.md`](../../../FORGEJO-SOCIETY-PUBLICITY/08-recognition.md) |
| `forgejo-society-publicity-metrics` | Owns publicity metrics and learning. | [`09-metrics.md`](../../../FORGEJO-SOCIETY-PUBLICITY/09-metrics.md) |

## How the wiring is shaped

The wiring follows the **single-presenter** rule from
[`THE-REPO-IS-THE-MIND/possibility-2.md`](../../../THE-REPO-IS-THE-MIND/README.md)
applied at the federation scale:

- **Inbound** to the sub-society: the Federation calls
  `forgejo-society-publicity-presenter` only. The presenter is the sub-society's
  one conscious voice.
- **Outbound** from the sub-society: any member repo that publishes
  externally (announcements, statements, crisis) does so through a censor-gated
  channel declared in [`wiring/channels.yml`](wiring/channels.yml). No member
  repo speaks directly to the outside world without the presenter's settlement
  or, for crisis communications, an explicit `govern`-level approval gate.
- **Lateral** between members: members exchange settlements (e.g. an event
  becomes an announcement becomes a coverage entry) through named channels in
  the same file. Every lateral call is a settlement, not a free action, per
  [`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md).
- **Uplink** to the Federation: declared in
  [`wiring/federation-uplink.yml`](wiring/federation-uplink.yml). The presenter
  reports settled publicity events back to the Federation's `memory/events/`
  via a single bridged channel.

## Status

This folder is **scaffold-only** at first commit. The repos named in
[`society.yml`](society.yml) and [`repos/`](repos/README.md) are *planned*,
not yet provisioned. Activation requires:

1. Creating the named repos under `japer-technology/` on the Federation forge.
2. Bootstrapping each with `.forgejo-society/` and the single workflow per
   [`FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md).
3. Adding a matching `channels/<peer>/` directory under the runtime
   `.forgejo-society/` of every participating society (Federation and each
   member), with a human-approved reciprocal agreement.
4. Registering the resulting hosts in the cloud-egress-censor and the
   spending limits in the payment-censor.

Until those steps land, the files here are the Federation's **declared
intent** for the Publicity sub-society and its wiring.

## Can a member repo spawn its own sub-society?

Yes — by the recursion rule declared in
[`../README.md`](../README.md#recursion-when-a-member-spawns-its-own-sub-society).
The shape used in this folder (`society.yml` + `repos/` + `wiring/`) is
fractal: any member listed here may, in turn, declare its own `MIND/<id>/`
folder using the same shape.

Each `repos/<member>.yml` file in this folder declares a `decomposition:`
field — `leaf`, `presenter`, or `federated` — that records whether that
member is expected to spawn a sub-society. Today every Publicity member is
declared `leaf` (with `presenter` reserved for the presenter), and the files
for `crisis`, `events`, and `media-relations` carry an inline note marking
them as candidates for promotion to `federated` once a real second authority
or censor profile appears.
