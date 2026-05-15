# Forgejo Society: Plan

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/SOCIETY-OF-REPO.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> See the [repository overview](../README.md) for how this folder fits with
> `THE-SOCIETY-OF-REPO/`, `.forgejo-society/`, and `REPO/forgejo-intelligence/`.

Planning documents for the implementation of the **Society of Repo** specification
(`THE-SOCIETY-OF-REPO/`) and the **repo-as-mind** thesis
(`THE-REPO-IS-THE-MIND/possibility-2.md`) into the two operational targets that
already exist in this repository:

```
.forgejo/workflows/forgejo-society.yaml   ← single workflow file (the body)
.forgejo-society/                         ← single root folder (the mind)
```

> The forge is the mind. The repo is an agency. The society thinks.
> The workflow is the heart-beat. The folder is the cortex.

This folder contains **planning only**. It does not contain runtime code,
agency manifests, or runtime state. It is the bridge between the abstract
specification (`THE-SOCIETY-OF-REPO/`) and the operational implementation
(`.forgejo/workflows/forgejo-society.yaml` + `.forgejo-society/`).

---

## How this folder is organised

| Document | Purpose |
|---|---|
| [00-overview.md](00-overview.md) | The synthesis. What we are building, why, and the two-target collapse rule. |
| [01-target-layout.md](01-target-layout.md) | Final directory layout for `.forgejo-society/` and the workflow file. |
| [02-workflow-design.md](02-workflow-design.md) | Design of the single `.forgejo/workflows/forgejo-society.yaml`: triggers, jobs, steps, env, concurrency, kill switch. |
| [03-runtime-pipeline.md](03-runtime-pipeline.md) | The cognitive loop mapped to concrete workflow steps and `.forgejo-society/` paths. |
| [04-folder-spec.md](04-folder-spec.md) | Per-subfolder specification of `.forgejo-society/`. |
| [05-agencies-critics-censors.md](05-agencies-critics-censors.md) | First-ship catalogue of agencies, critics, censors and their manifest schema. |
| [06-frames-polynemes-klines.md](06-frames-polynemes-klines.md) | Frame, polyneme, and K-line schemas and bootstrap files. |
| [07-policies-and-safety.md](07-policies-and-safety.md) | Danger zones, suppressors, approval gates, kill switch, fail-closed posture. |
| [08-state-and-memory.md](08-state-and-memory.md) | State, episodic, semantic, procedural, and K-line memory layout. |
| [09-handoff-and-signal-schemas.md](09-handoff-and-signal-schemas.md) | Signal, handoff, settlement, and K-line schema sketches. |
| [10-bootstrap-checklist.md](10-bootstrap-checklist.md) | Minimum-viable first-commit file list and acceptance checks. |
| [11-mapping-sor-to-implementation.md](11-mapping-sor-to-implementation.md) | Explicit mapping from every `THE-SOCIETY-OF-REPO/` section to its concrete `.forgejo-society/` path or workflow step. |
| [12-agent-implementation-playbook.md](12-agent-implementation-playbook.md) | Control-flow playbook for AI agents implementing Phase A safely and completely. |
| [13-inter-repo-communication.md](13-inter-repo-communication.md) | Inter-society (inter-repo) communication plan: incorporates `FORGEJO-SOCIETY-INTRODUCTION/analysis/inter-repo-protocols.md` into the two implementation targets. |

---

## The two-target collapse rule

`THE-SOCIETY-OF-REPO/` is the specification. It is large and many-folder.
`.forgejo-society/` is the implementation. It must be **operational** and live
beside one workflow file that runs it.

The collapse rule is:

> Everything in `THE-SOCIETY-OF-REPO/` becomes either
> (a) a file under `.forgejo-society/`, or
> (b) a step in `.forgejo/workflows/forgejo-society.yaml`,
> or it does not exist.

Nothing cognitive lives outside those two targets in the runtime body.
`THE-SOCIETY-OF-REPO/` remains the specification of record; `.forgejo-society/`
remains the running mind.

---

## Reading order

The recommended order is non-sequential: it leads with *why* and *what runs*
before *where it lives*, because the workflow design is what makes the
folder layout meaningful. Strict numeric order also works for reference
reading.

1. `00-overview.md` — synthesis and the two-target collapse rule.
2. `12-agent-implementation-playbook.md` — control-flow playbook for AI agent
   implementation before touching files
3. `10-bootstrap-checklist.md` — scope Phase A before attempting later
   cognition.
4. `02-workflow-design.md` — read the body before the cortex, so the
   layout in `01` is grounded in what actually runs.
5. `01-target-layout.md` — the folder tree, now interpretable.
6. `03-runtime-pipeline.md` — how the cognitive loop drives the layout.
7. `04-folder-spec.md`, `05-agencies-critics-censors.md`,
   `06-frames-polynemes-klines.md`, `07-policies-and-safety.md`,
   `08-state-and-memory.md`, and `09-handoff-and-signal-schemas.md`.
8. `13-inter-repo-communication.md` — how addressable, governed inter-society
   calls land in the two implementation targets (read before opening any
   real `channels/<peer>/` directory).
9. `11-mapping-sor-to-implementation.md` last, as a verification table.

If any implementation instruction appears ambiguous, preserve these priorities:
fail-closed safety first, Phase A scope second, auditability third, and
capability last.
