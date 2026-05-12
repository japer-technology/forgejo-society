# 01 — Target Layout

The complete target layout for the two implementation surfaces.

This is the *destination*. The bootstrap checklist (`10-bootstrap-checklist.md`)
defines what subset ships in the first commit.

---

## The body

```
.forgejo/
└── workflows/
    └── forgejo-society.yaml      ← single workflow, one entrypoint
```

Design details: `02-workflow-design.md`.

---

## The mind

```
.forgejo-society/
├── README.md                     ← visible self-description; points at AGENTS.md
├── forgejo-society-ENABLED.md    ← kill-switch sentinel (presence = permission)
├── AGENTS.md                     ← Spock's self-model, public identity
├── APPEND_SYSTEM.md              ← character law / drives / boundaries
│
├── config/
│   ├── society.yml               ← top-level runtime config (see §02-workflow-design)
│   ├── tools.yml                 ← default tool surface and write/execute groups
│   ├── providers.yml             ← model/provider settings (referenced, not committed-secret)
│   └── budgets.yml               ← per-stimulus time/cost/cycle budgets
│
├── governance/
│   ├── constitution.md
│   ├── authority-registry.yml    ← agency → authority level (read|draft|propose|act|govern|human)
│   ├── approval-gate.yml         ← actions that require human approval
│   ├── rights-registry.yml       ← per-agency read/write/transmit rights
│   ├── policy-ledger.yml         ← active policies, versioned and dated
│   ├── self-ideals.md
│   └── governance-log/           ← append-only governance event archive
│
├── protocols/                    ← runtime-relevant excerpts of THE-SOCIETY-OF-REPO/02-protocols
│   ├── identity.md
│   ├── events.md
│   ├── activation.md
│   ├── settlement.md
│   ├── memory.md
│   ├── representation.md
│   ├── credit-assignment.md
│   ├── introspection.md
│   ├── insulation.md
│   ├── hierarchy.md
│   ├── relational-memory.md
│   ├── service-channel.md
│   ├── governance.md
│   ├── forgejo-environment.md
│   ├── forgejo-runtime-layers.md
│   └── forgejo-operational-verification.md
│
├── frames/
│   ├── question.frame.yml
│   ├── bug.frame.yml
│   ├── feature.frame.yml
│   ├── code-change.frame.yml
│   ├── security-sensitive.frame.yml
│   ├── self-modification.frame.yml
│   └── novel.frame.yml
│
├── nemes/                        ← polynemic activators
│   ├── path-polynemes.yml
│   ├── label-polynemes.yml
│   ├── phrase-polynemes.yml
│   └── symbols.yml
│
├── policies/                     ← danger zones, suppressors, write/tool/memory policy
│   ├── danger-zones.yml
│   ├── tool-policy.yml
│   ├── write-policy.yml
│   ├── memory-policy.yml
│   ├── self-modification-policy.yml
│   └── kill-switch.yml
│
├── schemas/                      ← canonical data shapes the runtime emits and reads
│   ├── signal.schema.json
│   ├── handoff.schema.json
│   ├── settlement.schema.json
│   ├── kline.schema.json
│   ├── frame.schema.json
│   └── manifest.schema.json
│
├── agencies/                     ← worker, assembly, meta-admin (see §05)
│   ├── perception/
│   ├── memory/
│   ├── code/
│   ├── safety/
│   ├── identity/
│   ├── integration/
│   ├── assembly/
│   └── meta-admin/
│
├── critics/                      ← challenge repos (see §05)
│   ├── evidence-critic.md
│   ├── scope-critic.md
│   ├── cost-critic.md
│   ├── privacy-critic.md
│   ├── risk-critic.md
│   ├── overconfidence-critic.md
│   ├── source-quality-critic.md
│   └── staleness-critic.md
│
├── censors/                      ← block repos (see §05)
│   ├── workflow-danger-censor.md
│   ├── secret-smeller.md
│   ├── cloud-egress-censor.md
│   ├── authority-censor.md
│   ├── payment-censor.md
│   ├── delegation-censor.md
│   ├── credential-censor.md
│   └── pii-exfiltration-censor.md
│
├── memory/                       ← long-term, committed memory (see §08)
│   ├── events/
│   ├── episodic/
│   ├── semantic/
│   │   ├── decisions.log
│   │   ├── preferences.log
│   │   └── project-laws.log
│   ├── procedural/
│   ├── failure/
│   ├── frames/                   ← learned frames (procedural)
│   ├── analogies/
│   ├── concepts/
│   ├── klines/
│   │   ├── code-change/
│   │   ├── security/
│   │   ├── question/
│   │   └── self-modification/
│   └── decisions/                ← archived settlements
│
├── workspace/                    ← short-term attention (see §08)
│   ├── global-workspace/
│   ├── current-focus/
│   ├── active-settlements/
│   └── owner-briefings/
│
├── services/                     ← capabilities exposed by this society
│   └── README.md
│
├── channels/                     ← SOR-to-SOR channel agreements (stubs)
│   └── README.md
│
├── evolution/                    ← reinforcement, differentiation, retirement
│   ├── reinforcement-log.md
│   ├── retirement-log.md
│   └── ecology-review.md
│
├── lifecycle/                    ← runtime entrypoint and library code (called by the workflow)
│   ├── mind.ts                   ← society entrypoint (the “runMind” loop)
│   ├── perceive.ts
│   ├── activate.ts
│   ├── frames.ts
│   ├── klines.ts
│   ├── critics.ts
│   ├── censors.ts
│   ├── settle.ts
│   ├── act.ts
│   ├── memory.ts
│   ├── credit-assignment.ts
│   ├── policy.ts
│   └── lib/
│       ├── forgejo.ts            ← Forgejo API adapter (issues, comments, labels, PRs)
│       ├── git.ts                ← commit/push/branch/worktree
│       ├── pi.ts                 ← agent-engine adapter
│       ├── sessions.ts
│       ├── comments.ts
│       └── config.ts
│
└── state/                        ← runtime state (committed; see §08)
    ├── schema-version
    ├── sessions/
    ├── runs/
    └── mind/
        ├── issues/
        │   └── <number>/
        │       ├── percepts.jsonl
        │       ├── activation.jsonl
        │       ├── signals.jsonl
        │       ├── workspace.md
        │       ├── blackboard.md
        │       ├── candidate-actions.jsonl
        │       ├── objections.jsonl
        │       ├── final.md
        │       ├── diff-summary.md
        │       └── kline.yml
        └── reports/
```

---

## Notes on the layout

- Every top-level subfolder of `.forgejo-society/` corresponds to a numbered
  section of `THE-SOCIETY-OF-REPO/`. The exhaustive mapping is in
  `11-mapping-sor-to-implementation.md`.
- `lifecycle/` and `state/` are runtime-only and have no counterpart in the
  specification; they are the body that runs the mind.
- `protocols/` are *runtime excerpts* of `THE-SOCIETY-OF-REPO/02-protocols/`. The
  specification remains the source of truth; the runtime keeps the parts the
  loop must consult on every cycle.
- `forgejo-society-ENABLED.md` is the operational kill-switch. The workflow’s
  first guard step verifies its presence and exits cleanly otherwise.
- All folders are *presence-is-permission*: removing one disables that
  capability at the next workflow run, in line with the Forgejo Runtime Layers
  protocol.
