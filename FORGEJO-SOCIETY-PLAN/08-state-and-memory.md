# 08 — State and Memory

The runtime maintains three trees with different lifetimes and write rules.
This document specifies each tree’s layout, who may write to it, and how
material flows between them.

Sources: `THE-SOCIETY-OF-REPO/06-memory/`, `THE-SOCIETY-OF-REPO/07-workspace/`,
`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`,
`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`,
`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`,
`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`, and
`possibility-2.md`’s *learning levels* and *layered blackboard* sections.

---

## The three trees

| Tree | Lifetime | Write rule | Content |
| --- | --- | --- | --- |
| `state/` | per-run, scratch, append-only | runtime only | episodic per-stimulus trace, run reports |
| `workspace/` | short-term, swept after settlement | settlement layer + integration agencies | active attention, in-progress settlements, owner briefings |
| `memory/` | durable, governed, append-only | `archivist` only, on settlement of relevant outcomes | episodic, semantic, procedural, failure, frames, analogies, concepts, K-lines, decisions |

Promotion is one-way: `state/` and `workspace/` may *feed* `memory/`; `memory/`
may *seed* the workspace at activation; nothing demotes.

---

## `state/`

Runtime per-run scratch. Always committed at the end of each workflow run so
that thinking is reviewable in Git history.

```
state/
├── schema-version
├── sessions/
│   └── <session-key>.json           # per-stimulus session continuity (per protocol 15)
├── runs/
│   └── <run_id>/
│       ├── stimulus.json            # normalized event from `normalize` step
│       ├── guardrail.json           # guardrail result
│       ├── outcome.json             # what happened in `act`
│       └── report.md                # human-readable summary written by `report`
└── mind/
    ├── issues/
    │   └── <number>/
    │       ├── percepts.jsonl       # raw observations from `perceive`
    │       ├── activation.jsonl     # which agencies woke up and why
    │       ├── signals.jsonl        # internal activation messages
    │       ├── workspace.md         # human-readable current situation
    │       ├── blackboard.md        # layered cognitive state
    │       ├── candidate-actions.jsonl
    │       ├── objections.jsonl     # critic + suppressor objections
    │       ├── final.md             # Spock’s final visible response
    │       ├── diff-summary.md      # what changed in the imagination branch
    │       └── kline.yml            # candidate K-line (promoted by archivist)
    └── reports/
        └── <iso8601>-<topic>.md     # cron and meta-admin reports
```

Conventions:

- JSONL files are append-only within a run; one record per line; each record
  validates against its schema (`schemas/signal.schema.json`,
  `schemas/handoff.schema.json`, etc.).
- `workspace.md` and `blackboard.md` are the human-readable face of the
  layered state in `possibility-2.md`’s *blackboard should become layered*
  section.
- `state/` may be cleaned by the meta-admin family per
  `policies/memory-policy.yml` retention rules (default: keep all state for
  open issues; archive closed-issue state into `memory/episodic/` after N days).

---

## `workspace/`

Short-term cognitive attention. The only tree the runtime is allowed to
mutate in place.

```
workspace/
├── global-workspace/
│   └── <stimulus_id>.md             # current proposals visible to critics and censors
├── current-focus/
│   └── current.md                   # the single stimulus currently being processed
├── active-settlements/
│   └── <settlement_id>.yml          # forming | pending | authorised | executing
└── owner-briefings/
    └── <settlement_id>.md           # briefings + approval requests for the human
```

Lifecycle of a settlement file:

```
forming → pending → authorised → executing → archived (moved to memory/decisions/)
                                          ↘ blocked   (kept for audit, then archived)
```

`workspace/` is swept by the `report` phase: completed items move to
`memory/decisions/`; items in `pending` waiting on a human remain.

---

## `memory/`

Long-term, append-only, governed.

```
memory/
├── events/
│   └── <iso8601>-<event>.jsonl      # raw events kept for audit
├── episodic/
│   └── <iso8601>-issue-<n>.md       # consolidated per-stimulus narrative
├── semantic/
│   ├── decisions.log                # one line per durable decision
│   ├── preferences.log              # learned user preferences
│   └── project-laws.log             # invariants the society must respect
├── procedural/
│   └── <iso8601>-<change>.md        # how-to changes (frame edits, agency edits)
├── failure/
│   └── <iso8601>-<topic>.md         # what went wrong and why
├── frames/
│   └── <frame-id>.md                # learned frames produced by meta-admin
├── analogies/
│   └── <analogy-id>.yml             # cross-domain mappings
├── concepts/
│   └── <concept-id>.md              # candidate abstractions awaiting governance
├── klines/
│   ├── code-change/
│   ├── security/
│   ├── question/
│   └── self-modification/
└── decisions/
    └── <settlement_id>.yml          # archived settlement records
```

### Write rules

| Subtree | Written by | When |
| --- | --- | --- |
| `events/` | `normalize` + `act` | every run, append |
| `episodic/` | `archivist` | end of every settled stimulus |
| `semantic/decisions.log` | `archivist` | when settlement carries a `durable_decision` slot |
| `semantic/preferences.log` | `agency.identity.user-model-keeper` via `archivist` | when a preference is observed |
| `semantic/project-laws.log` | `archivist`, **only** with `human` authority confirmation | rare |
| `procedural/` | `archivist`, **only** under `self-modification` frame | when the society changes its own behaviour |
| `failure/` | `archivist` | on `outcome=failed` or `outcome=blocked` settlements |
| `frames/` | `meta-admin.differentiation-broker` via `archivist` + human confirmation | rare |
| `analogies/` | `meta-admin` via `archivist` + human confirmation | rare |
| `concepts/` | any agency via `archivist`, but governance must approve before promotion | as candidates |
| `klines/<class>/` | `archivist` | end of every successful or partial-success settlement |
| `decisions/` | `archivist` | when an `active-settlement` finalises |

### Append-only enforcement

Edits in place are forbidden. Corrections happen via:

1. a new entry that supersedes the old (with `supersedes:` link)
2. a governance settlement that records the supersession

This is the *append-only with linked corrections* convention from
`THE-SOCIETY-OF-REPO/06-memory/README.md`.

### Decay metadata

Every durable record carries:

```yaml
created_at: <iso8601>
last_referenced_at: <iso8601>
reuse_count: <int>
decay_score: <float>
supersedes: <record-id|null>
linked: [ <record-id>, ... ]   # typed relational links
```

The scheduled cron pass updates `decay_score` and proposes retirements via
`evolution/retirement-log.md`.

---

## Relational memory

Per `THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`, durable records
carry typed graph links. The runtime indexes these on first read of each
record into a transient index outside the committed tree, for example under the
runner workspace temporary directory. The index is never committed.

Link types include `supersedes`, `derived_from`, `contradicts`, `cites`,
`reinforces`, `analogous_to`, `learned_from`. The schema is shared by all
durable records.

---

## Credit assignment

The `remember` step runs `credit-assignment.ts`, which:

1. reads the settlement and the outcome
2. attributes outcome credit to:
   - the agencies that contributed proposals
   - the K-lines that were reactivated
   - the frame that was selected
   - the critics whose objections were sustained
3. writes per-attribution updates into `evolution/reinforcement-log.md`
4. updates `reuse_count` and `decay_score` on referenced K-lines

Negative credit (a sustained objection that the loop ignored, leading to a
failed outcome) is recorded the same way; reinforcement is always two-sided.

---

## Memory policy file

`policies/memory-policy.yml` is the single source for retention thresholds:

```yaml
state_retention_days_open_issue: null        # keep until issue closes
state_retention_days_closed_issue: 30        # then move to memory/episodic and prune state
workspace_retention_days_after_settled: 7
kline_decay_floor: 0.05                      # below this, propose retirement
semantic_dedup_window_days: 90
failure_review_cadence: weekly
```

Changes to this file are themselves a `self-modification` settlement.
