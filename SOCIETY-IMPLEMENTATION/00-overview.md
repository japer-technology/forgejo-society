# 00 — Overview

## What we are building

A **repo-native cognitive society** that runs entirely from:

1. one Forgejo Actions workflow file:
   `.forgejo/workflows/forgejo-society.yaml`
2. one root folder of cognitive content and runtime state:
   `.forgejo-society/`

The workflow is the **body**. The folder is the **mind**.

The workflow listens for Forgejo events (issues, comments, labels, pushes,
pull-requests, schedule, manual dispatch), then runs the cognitive loop defined
by the contents of `.forgejo-society/`. Everything Spock — the visible voice of
the society — says back to the user is the result of that loop.

This is the operational answer to two existing documents in the repository:

- `THE-REPO-IS-THE-MIND/possibility-2.md` — the *repo-native cognitive
  architecture* thesis. It argues against generic multi-agent routing and in
  favour of activation, inhibition, frames, K-lines, censors, suppressors,
  imagined branches, and a single conscious presenter.
- `THE-SOCIETY-OF-REPO/` — the *governed ecology* specification. It defines
  governance, protocols, agencies, critics, censors, memory, workspace,
  services, channels, and evolution as first-class structures.

`possibility-2.md` answers *how a single repo can think*.
`THE-SOCIETY-OF-REPO/` answers *how a society of repos can govern itself*.

This planning folder collapses both into a single repo and a single workflow,
without losing the structure that makes either of them coherent.

---

## Why one workflow

Multiple workflows would split the cognitive loop across event boundaries that
Forgejo cannot guarantee to coordinate. Settlement, censorship, and credit
assignment would race. Kill switches would partially apply. A single workflow:

- enforces fail-closed behaviour with one enable sentinel
  (`.forgejo-society/forgejo-society-ENABLED.md`)
- gives one concurrency boundary per stimulus key
- gives one place where guardrails run before any agent receives input
- keeps every step inspectable from one run page
- keeps the mapping `event → perception → settlement → action` linear and
  reviewable

Multiple jobs are allowed inside the workflow. Multiple workflows are not.

---

## Why one folder

`THE-SOCIETY-OF-REPO/` is the specification. The implementation deliberately keeps
*all* runtime cognitive content in one root folder so that:

- removing the folder fully disables the society
- a single PR can change the mind
- audit and governance trace one history (`git log .forgejo-society/`)
- the kill-switch invariant from the Forgejo Environment Protocol holds:
  *presence is permission; absence is denial*
- secrets, state, and committed cognition share one boundary

The folder mirrors `THE-SOCIETY-OF-REPO/` section-by-section, but in operational
form: agencies are runnable manifests, critics and censors are runnable
manifests, frames are YAML, K-lines are YAML, the workspace is a live
directory, governance is a small set of YAML files.

The detailed mapping is in `11-mapping-sor-to-implementation.md`.

---

## The collapse rule (restated)

> Every cognitive structure in `THE-SOCIETY-OF-REPO/` must collapse to either a
> file under `.forgejo-society/` or a step in
> `.forgejo/workflows/forgejo-society.yaml`. Nothing else.

The current repository already has the right shape:

```
.forgejo/workflows/forgejo-society.yaml   ← seed workflow exists
.forgejo-society/README.md                ← seed folder exists
THE-SOCIETY-OF-REPO/                          ← full specification
THE-REPO-IS-THE-MIND/possibility-2.md     ← cognitive thesis
```

The plan in this folder fills both targets without inventing a third location.

---

## What “done” looks like

A reviewer can:

1. open `.forgejo-society/` and read the entire mind
2. open `.forgejo/workflows/forgejo-society.yaml` and read the entire body
3. trigger the workflow on any supported event and see a complete cognitive
   trace appear under `.forgejo-society/state/...` for that stimulus
4. delete `.forgejo-society/forgejo-society-ENABLED.md` and confirm the
   society stops responding (presence is permission)
5. point to any line in `THE-SOCIETY-OF-REPO/` and find the corresponding live
   file or workflow step via `11-mapping-sor-to-implementation.md`

If any one of those is impossible, the implementation is not done.

---

## What is explicitly out of scope here

- Choice of LLM provider, model, or vendor SDK (left to a runtime config file
  under `.forgejo-society/config/`)
- Network egress policy specifics beyond the censor catalogue
- Cross-society channels (`THE-SOCIETY-OF-REPO/09-channels/`) — covered as a stub
  in the folder spec; full inter-society work is a later phase
- Public-fabric publishing — Spock is the only public voice; the public-fabric
  agency is listed but not implemented in the first commit

These appear in `10-bootstrap-checklist.md` as deferred items.
