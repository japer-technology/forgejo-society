# 13 — Inter-Repo (Inter-Society) Communication

This document incorporates the analysis in
[`FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md`](../FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md)
into the plan. It turns the conclusion of that analysis —
*every repo in the federation is a directly addressable, governed cognitive
endpoint* — into concrete obligations on `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`.

The analysis is the *why* and the *what*. This document is the *where it lives
in the two implementation targets*.

---

## The model in one paragraph

Forgejo already provides the transport (REST, webhooks, ActivityPub, runners,
git, signed activities). `THE-SOCIETY-OF-REPO/` provides the cognitive layer
(identity, contract, translation, authority, audit). A call from this society
to another society is therefore never a bare HTTP request: it is a governed
cognitive transaction whose pipe happens to be the Forgejo API. The plan must
honour both layers — addressable *and* governed — without inventing a third
location outside `.forgejo-society/` and the workflow.

---

## The two-layer collapse for inter-repo calls

The analysis identifies six layers (transport, identity, contract,
translation, authority, audit). Each layer maps to a location already
specified by the plan:

| Layer | Provided by | Implementation target in this plan |
| --- | --- | --- |
| Transport | Forgejo (REST, webhooks, ActivityPub, runners, git) | `lifecycle/lib/forgejo.ts` (the single sanctioned API adapter, per §15) |
| Identity | Forgejo URL space + SOR identity protocol | `protocols/identity.md` + ID convention in `schemas/manifest.schema.json` |
| Contract | SOR Service Channel Protocol | `protocols/service-channel.md` + `services/` + `channels/` |
| Translation | SOR Bridges Protocol | `protocols/bridges.md` + bridge agencies under `agencies/integration/` |
| Authority | SOR governance + Forgejo token scopes | `governance/authority-registry.yml` + workflow `permissions:` + token scopes |
| Audit | Forgejo run logs + SOR settlement and event records | `memory/events/`, `memory/decisions/`, `evolution/reinforcement-log.md`, plus the Forgejo run page |

No new directories are introduced. The inter-repo call surface *is* the
existing surface, used end-to-end.

---

## What this adds to the existing plan documents

The plan already references service channels, bridges, and channels (see
`04-folder-spec.md §services/ and §channels/`, `11-mapping-sor-to-implementation.md`
rows for `02-protocols/07-service-channel.md`, `02-protocols/18-bridges.md`,
and `09-channels/`). This document makes the *shape of the call itself*
explicit, so an implementer can recognise an inter-society call when they see
one and route it through the right files.

The four call shapes from the analysis (direct REST, issue/PR as queued
request, webhook-driven event delivery, ActivityPub federation) all collapse
to a single workflow path:

```
external event   ─►  webhook / scheduled poll / ActivityPub inbox
   │
   ▼
.forgejo/workflows/forgejo-society.yaml
   │  normalize      ─►  events/
   │  perceive       ─►  workspace/
   │  activate       ─►  agencies/  + critics/  + censors/
   │  (channel hit)  ─►  protocols/service-channel.md
   │       ├─ authority check  (governance/authority-registry.yml)
   │       ├─ bridge translate (agencies/integration/<bridge>.md)
   │       ├─ censor pass      (censors/cloud-egress-censor.md, payment-censor.md, …)
   │       └─ adapter call     (lifecycle/lib/forgejo.ts → remote Forgejo)
   │  settle         ─►  memory/decisions/ + evolution/reinforcement-log.md
   ▼
remote SOR's normalize step (mirror of the above, on its hardware)
```

Every step has a file. No step has an alternative location.

---

## Concrete obligations on `.forgejo-society/`

The following are pulled from the analysis and stated as plan obligations.

### `lifecycle/lib/forgejo.ts` is the *only* outbound HTTP path

Per `THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md` and reinforced
by the analysis, no agency, critic, censor, or lifecycle step may open ad-hoc
`fetch` calls, shell out to `gh`, or call another forge directly. Every
outbound call — local *or* inter-society — must go through
`lifecycle/lib/forgejo.ts`. Inter-society calls extend the adapter with a
`channelId` argument; they do not bypass it.

### `channels/<peer>/` is the registry the adapter consults

Each remote SOR this society is permitted to call gets a directory under
`channels/`:

```
channels/<peer-sor-id>/
├── reciprocal-agreement.md      ← human-readable contract
├── channel.yml                  ← host, repo, service ids, token ref, censor budget
└── bridges.md                   ← which bridge agency translates this channel
```

Adding a channel is a PR that requires human approval (governance
`approval-gate.yml`). The cloud-egress-censor reads `channels/*/channel.yml`
to know which hosts may be contacted. The payment-censor reads the same file
for spending limits. Removing the directory revokes the channel; no other
action is required (presence-is-permission).

### `services/<service-id>/` is what this society *publishes* outbound

The mirror of `channels/`. Each service this society offers to others is a
directory with a published contract, a confidence policy, a price or
reciprocal-credit term, and a pointer to the agency that fulfils it. The
analysis's "discovery → contract negotiation → … → audit trace" lifecycle is
the lifecycle of one settlement against an entry under `services/`.

### Bridges live as integration-family agencies

`protocols/bridges.md` describes the contract. Each named bridge is an agency
manifest under `agencies/integration/<bridge-name>.md` with the bridge's
input schema, output schema, declared lossiness, and round-trip drift tests.
A channel's `bridges.md` names which bridge translates outbound and inbound
traffic.

### Inter-society calls are settlements, not free actions

An inter-society call always runs inside a settlement. The settlement record
(`workspace/active-settlements/<id>.yml`, archived to `memory/decisions/`)
carries the channel id, the service id, the bridge id, the censor verdicts,
the request payload hash, the response payload hash, the confidence score,
and the credit-assignment outcome. The matching event (`event.channel.tx-opened.{N}`
and its counterpart `event.channel.tx-closed.{N}`) lands in `memory/events/`.

This makes "calling a repo as an API" indistinguishable, in the audit trail,
from any other deliberation.

---

## Concrete obligations on the workflow

`.forgejo/workflows/forgejo-society.yaml` must:

1. Accept the webhook trigger types that carry inter-society activity
   (`repository_dispatch`, `issues` opened from a federated bridge user,
   scheduled poll for ActivityPub inboxes once that phase ships).
2. Run the `cloud-egress-censor` step *before* any step that may call
   `lifecycle/lib/forgejo.ts` with a non-local host. The step reads the
   `channels/` registry and fails closed if a host is not registered.
3. Run the `payment-censor` step against the channel's spending limit before
   committing to a paid inter-society call.
4. Record every inter-society call in `memory/events/` with the bridge id and
   channel id captured, regardless of whether the call succeeded.
5. On the receive side, route incoming webhooks and ActivityPub activities
   through the same `normalize` step that handles local events. There is no
   second entrypoint.

---

## Phase placement

Phase A (the first ship, scoped by `10-bootstrap-checklist.md`) carries:

- `protocols/service-channel.md`, `protocols/bridges.md`, `protocols/forgejo-environment.md` as documents.
- `services/README.md` and `channels/README.md` as stubs.
- `lifecycle/lib/forgejo.ts` as the only outbound HTTP path (local calls only).
- Censor manifests for `cloud-egress-censor` and `payment-censor`, configured to deny by default.

Phase B adds:

- `agencies/meta-admin/forgejo-ops-steward.md` for runner and forge health.
- Webhook receive path through the existing `normalize` step.

Phase C (cross-society activation):

- First real `channels/<peer>/` directory with a human-approved reciprocal agreement.
- First real `services/<service-id>/` directory with a published contract.
- First named bridge under `agencies/integration/`.
- ActivityPub-based federation once the receive side has been hardened.

This sequencing matches the existing `10-bootstrap-checklist.md` deferred
items; this document does not move work earlier, it makes the eventual
landing explicit.

---

## What this does *not* change

- The two-target collapse rule from `00-overview.md` is unchanged. Every
  inter-repo concern lands in `.forgejo-society/` or the workflow, or it does
  not exist.
- The fail-closed posture from `07-policies-and-safety.md` is unchanged.
  Absent channel = no call. Absent censor manifest = no call.
- The single-adapter rule from `02-protocols/15-forgejo-environment.md` is
  unchanged; it is extended, not bypassed.
- The mapping in `11-mapping-sor-to-implementation.md` continues to be the
  verification table of record. This document adds context; it does not
  replace any row.

---

## Cross-references

- Analysis source: [`../FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md`](../FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md)
- Service Channel Protocol: [`../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md`](../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md)
- Bridges Protocol: [`../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)
- Forgejo Environment Protocol (single-adapter rule): [`../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`](../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md)
- Channels registry: [`../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/README.md`](../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/README.md)
- Plan mapping table: [`11-mapping-sor-to-implementation.md`](11-mapping-sor-to-implementation.md)
- Folder spec for `services/` and `channels/`: [`04-folder-spec.md`](04-folder-spec.md)
