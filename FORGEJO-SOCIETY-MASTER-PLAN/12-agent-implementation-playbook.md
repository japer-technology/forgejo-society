# 12 — Agent Implementation Playbook

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md`](../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md)
> remains the reference.

## Purpose

The control-flow playbook for AI agents implementing Phase A safely
and completely — the document an assistant should read before touching
any file in the two implementation targets.

## What this document will contain

- The pre-flight checks an agent runs before any edit (read
  [WARNING.md](../WARNING.md), confirm scope, confirm authority).
- The step-by-step order for landing Phase A: kill switch first,
  workflow skeleton second, sentinels and refusals third, then
  agencies, critics, censors, memory.
- The stop-conditions: when an agent must halt and escalate to a
  human maintainer rather than improvise.
- The post-flight checks: what must be true on disk for a change to
  be considered complete.

## Source material

- [`FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md`](../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md) — working draft.
- [`AGENTS.md`](../AGENTS.md) and [`CLAUDE.md`](../CLAUDE.md) — binding
  agent instructions.

## Notes for hand-crafting

- This document is read by agents. Be unambiguous.
- Refusal is a first-class outcome. List the situations in which
  refusal is the correct response.
