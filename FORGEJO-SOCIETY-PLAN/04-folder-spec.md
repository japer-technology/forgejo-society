# 04 — Folder Specification

Per-subfolder specification for `.forgejo-society/`. Companion document to
`01-target-layout.md`, which gave the tree; this document gives the
*responsibilities*, *conventions*, and *invariants* of each subfolder.

Section numbers below follow the order of the target layout.

---

## `README.md`

Visible self-description of the running mind. One file. Points readers at:

- `AGENTS.md` — Spock’s self-model
- `FORGEJO-SOCIETY-PLAN/` — these planning documents
- `THE-SOCIETY-OF-REPO/` — the specification of record

Convention: under 200 lines.

---

## `forgejo-society-ENABLED.md`

The enable sentinel. Presence is permission. Removing it disables the runtime
on the next workflow run.

Contents are informational only. The workflow checks **only** the file’s
existence. Editing the file does not enable or disable anything; deleting it
does. This matches `THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`.

---

## `AGENTS.md` and `APPEND_SYSTEM.md`

Carried over verbatim from the GMI thesis in `possibility-2.md`:

- `AGENTS.md` — Spock’s self-model and public identity (tone, values, scope)
- `APPEND_SYSTEM.md` — character law, drives, boundaries

Edits to either file are governed by the `self-modification` frame and the
`soul-mutation` danger zone (see `07-policies-and-safety.md`). They cannot be
edited by the society without a human-confirmed settlement.

---

## `config/`

Operational knobs only. No cognitive content.

| File | Purpose |
| --- | --- |
| `society.yml` | top-level: mode, max_cycles, activation_threshold, default_frame, state_root, paths |
| `tools.yml` | tool group catalogue: read/grep/find/ls, edit/write, bash, plus per-agency overrides referenced from manifests |
| `providers.yml` | model provider settings; secrets referenced by name only |
| `budgets.yml` | per-stimulus default budgets (time, cost, cycles, workspace size, max critic passes) |

Convention: every value here is a small leaf YAML; no embedded scripts.

---

## `governance/`

Direct, runtime-readable subset of `THE-SOCIETY-OF-REPO/01-governance/`.

| File | Source spec | Format | Read by |
| --- | --- | --- | --- |
| `constitution.md` | `01-governance/constitution.md` | prose | humans + audit only |
| `authority-registry.yml` | `01-governance/authority-registry.md` | `agent_id → level` | `policy.ts` |
| `approval-gate.yml` | `01-governance/approval-gate.md` | list of `requires_human_approval` action patterns | `act.ts` |
| `rights-registry.yml` | `01-governance/rights-registry.md` | per-agent read/write/transmit allowlists | `policy.ts` |
| `policy-ledger.yml` | `01-governance/policy-ledger.md` | active policies with effective dates | `policy.ts` |
| `self-ideals.md` | `01-governance/self-ideals.md` | prose; cited by high-impact settlements | settlement template |
| `governance-log/` | `01-governance/governance-log/` | append-only event archive | audit |

Authority levels MUST be exactly one of `read | draft | propose | act | govern
| human` per the existing repository convention.

---

## `protocols/`

Runtime excerpts of `THE-SOCIETY-OF-REPO/02-protocols/`. Source remains the spec.
The runtime needs a local copy because the loop must read these on every
cycle without crossing folder boundaries that govern presence-is-permission.

Each file MUST start with a one-line link back to its source in
`THE-SOCIETY-OF-REPO/`. Edits to a runtime protocol file are themselves a
governance change and require a settlement under the `self-modification` frame.

---

## `frames/`

Frames are structured expectations. One YAML per frame. Schema in
`schemas/frame.schema.json` and detailed in `06-frames-polynemes-klines.md`.

Required slots in every frame file:

```yaml
name:                     # frame id
slots: { ... }            # required and optional information slots, with filled_by lists
default_actions: [ ... ]  # ordered phase hints for the loop
failure_conditions: [ ... ] # objections that block settlement
```

---

## `nemes/`

Polynemic activators. One YAML per neme class:

| File | Activated by |
| --- | --- |
| `path-polynemes.yml` | file paths in the stimulus or in candidate diffs |
| `label-polynemes.yml` | issue/PR labels |
| `phrase-polynemes.yml` | natural-language phrases in the stimulus |
| `symbols.yml` | abstract symbols emitted by perception (e.g. `api-boundary`) |

Each entry excites one or more agencies and may inhibit others. Optional
`default_frame` field overrides the loop’s default frame selection.

---

## `policies/`

Mechanically-applied policy. Read by `policy.ts`, **not** the model.

| File | Effect |
| --- | --- |
| `danger-zones.yml` | named zones with paths/patterns + censor + suppressor entries |
| `tool-policy.yml` | tool defaults per agency, overridden by danger zones |
| `write-policy.yml` | which agencies may ever request `write`/`edit`/`bash` and under which frames |
| `memory-policy.yml` | what may be promoted from `state/` to `memory/`, and how |
| `self-modification-policy.yml` | rules for editing `agencies/`, `frames/`, `policies/`, `governance/`, `AGENTS.md`, `APPEND_SYSTEM.md` |
| `kill-switch.yml` | `enabled: bool` and reasons; checked by the guard step |

These files **alter the tool surface** before any agent runs. They are not
advice to the model.

---

## `schemas/`

Canonical data shapes. JSON Schema for machine validation; the runtime
validates every emitted artifact against the appropriate schema.

| Schema | Validates |
| --- | --- |
| `signal.schema.json` | one record in `signals.jsonl` |
| `handoff.schema.json` | one agency return value |
| `settlement.schema.json` | one `workspace/active-settlements/*.yml` |
| `kline.schema.json` | one `memory/klines/**/*.yml` |
| `frame.schema.json` | one `frames/*.frame.yml` |
| `manifest.schema.json` | one agency/critic/censor manifest frontmatter |

---

## `agencies/`

Each agency is a Markdown file with YAML frontmatter (the *manifest*) plus a
prose body that becomes the agent prompt. Subfolder = agency family. Detailed
in `05-agencies-critics-censors.md`.

Conventions:

- one file per agency
- agency `id` matches its filename without `.md`
- `id` follows the dot-separated lowercase rule from
  `02-protocols/01-identity.md`: `agency.<family>.<name>`
- `writes: false` is the default; setting `true` requires a `write-policy.yml`
  entry that explicitly allows it

---

## `critics/`

Same manifest schema as agencies, with `kind: critic`. Critics challenge on
merit; they emit objections, never actions. Catalogue mirrors
`THE-SOCIETY-OF-REPO/04-critics/`.

---

## `censors/`

Same manifest schema as agencies, with `kind: censor` or `kind: suppressor`.
Censors fire upstream (before tool grants); suppressors fire on candidate
outputs. Catalogue mirrors `THE-SOCIETY-OF-REPO/05-censors/`.

A censor’s manifest MUST declare:

```yaml
kind: censor               # or: suppressor
fires_at: pre_tool_grant   # or: post_candidate_output
unconditional: true        # censors cannot be argued with
```

---

## `memory/`

Long-term, governed memory. Subfolders mirror
`THE-SOCIETY-OF-REPO/06-memory/`. Detailed in `08-state-and-memory.md`.

Invariants:
- append-only (corrections via PR, never in-place rewrites)
- typed relational links between durable records (per
  `02-protocols/14-relational-memory.md`)
- decay metadata on each record (per `06-memory/README.md`)

---

## `workspace/`

Short-term attention. Subfolders mirror `THE-SOCIETY-OF-REPO/07-workspace/`.
Items move out (to `memory/decisions/`) once their settlement is finalised.
Workspace is the only place the runtime is allowed to mutate in place.

---

## `services/` and `channels/`

Stubs in the first commit. `services/` lists capabilities this society
exposes; `channels/` lists agreements with other societies. Per
`THE-SOCIETY-OF-REPO/08-services/` and `THE-SOCIETY-OF-REPO/09-channels/`. Empty
README files are acceptable until inter-society work is scoped.

---

## `evolution/`

Reinforcement, retirement, and ecology review logs. Written by the
`remember` and scheduled `report` steps. Read by humans during review and by
the meta-admin agency family.

---

## `lifecycle/`

The runnable code that the workflow invokes. The only TypeScript/JavaScript
in `.forgejo-society/`. Each file maps to a phase from `02-workflow-design.md`.

Conventions:
- `mind.ts` is the sole entrypoint called from the workflow
- shared logic lives in `lib/`
- no business prompts here — prompts live in `agencies/`
- no policy logic here — policy lives in `policies/` and `governance/`

---

## `state/`

Runtime per-run scratch and per-stimulus episodic trace. Detailed in
`08-state-and-memory.md`. Always committed at the end of each run so the
society’s thinking is reviewable in Git history.
