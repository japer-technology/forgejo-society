# 13 — Inter-Repo Communication

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md)
> remains the reference.

## Purpose

The inter-society (inter-repo) communication plan, landed in the two
implementation targets: how one Forgejo Society addresses, authorises,
and audits a call to another.

## What this document will contain

- The addressing scheme for peer societies and the placement of
  `channels/<peer>/` under `.forgejo-society/`.
- The authority handshake: which authority levels are required on
  both ends for a channel to open.
- The bridge protocol: how signals, handoffs, and settlements cross
  the boundary without losing audit.
- The compliance posture for inter-repo calls — never on shared
  Forgejo infrastructure as a runtime, never on github.com.

## Source material

- [`FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md) — working draft.
- `FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md`, if
  present.
- [`WARNING.md`](../WARNING.md) and the compliance documents.

## Notes for hand-crafting

- Do not open a real `channels/<peer>/` directory before this
  document is hand-crafted and the channel is explicitly authorised.
- Federation does not relax sovereignty. Owned hardware, owned forge,
  owned files remain the rule on each side of any channel.
