# 08 — State and Memory

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/08-state-and-memory.md`](../FORGEJO-SOCIETY-PLAN/08-state-and-memory.md)
> remains the reference.

## Purpose

The layout of state, episodic memory, semantic memory, procedural
memory, and K-line memory within `.forgejo-society/`.

## What this document will contain

- Where each memory class lives in the cognitive folder.
- How memories are written: which workflow steps write them, in which
  format, and under which authority.
- How memories are read: the indices, lookups, and retrieval
  conventions.
- Retention, archival, and decay rules — including the boundary
  between in-progress settlements in `07-workspace/active-settlements/`
  and archived decisions under `06-memory/decisions/`.

## Source material

- [`FORGEJO-SOCIETY-PLAN/08-state-and-memory.md`](../FORGEJO-SOCIETY-PLAN/08-state-and-memory.md) — working draft.
- `THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`, if present.
- `THE-SOCIETY-OF-REPO/06-memory/`, if present.

## Notes for hand-crafting

- Cognition persists as Git objects. State that is not committed does
  not exist for memory purposes.
- Memory writes are auditable. Do not introduce silent caches.
