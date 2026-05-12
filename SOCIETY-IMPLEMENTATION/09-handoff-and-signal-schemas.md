# 09 — Handoff and Signal Schemas

The runtime communicates internally via four well-defined record types.
Every emitted record validates against its schema in `.forgejo-society/schemas/`.
This document is the source-of-record for those schemas in *narrative* form;
the JSON Schema files are the machine-checked form.

Sources: `THE-REPO-IS-THE-MIND/possibility-2.md` (signals, handoffs, “no
evidence, no trust”), `THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`,
`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`,
`THE-SOCIETY-OF-REPO/deep-dive/klines-functional-spec.md`.

---

## Signal

The unit of internal communication. Cheap, high-frequency, structured.

```json
{
  "name": "<dotted.signal.name>",
  "energy": 0.0,
  "source": "<emitter-id>",
  "stimulus_id": "<stimulus_id>",
  "cycle": 0,
  "evidence": [
    { "kind": "path|label|phrase|symbol|diff|metric|...", "value": "..." }
  ],
  "suggested_effects": {
    "excite":  ["<agent-id>", "..."],
    "inhibit": ["<agent-id>", "..."]
  },
  "frame_hint": "<frame-id|null>"
}
```

Conventions:

- `name` is dotted-lowercase, e.g. `danger.workflow_file`,
  `diff.needs_tests`, `agent.blocked_by_policy`.
- `energy` ∈ [0,1].
- `evidence` MUST be non-empty. *No evidence, no trust* is a runtime law.
- `suggested_effects` is advisory; only `policy.ts` actually applies them.

Stored at `state/mind/issues/<n>/signals.jsonl`, one record per line.

---

## Handoff

The structured return value of one agency run. Replaces freeform prose. Every
agent — perception, code, critic, censor, integration — returns one of these.

```json
{
  "agent": "<agent-id>",
  "stimulus_id": "<stimulus_id>",
  "cycle": 0,
  "status": "pass|fail|blocked|deferred",
  "confidence": 0.0,
  "signals": [ /* Signal records */ ],
  "claims": [
    {
      "text": "<one-line claim>",
      "evidence": [ /* citations or record references */ ],
      "method": "retrieval|rule|local-model|hybrid",
      "confidence": 0.0
    }
  ],
  "objections": [
    {
      "against": "<agent-id|candidate-action-id>",
      "reason": "<text>",
      "kind": "evidence|scope|cost|privacy|risk|overconfidence|source-quality|staleness|other",
      "blocking": false
    }
  ],
  "candidate_actions": [
    {
      "id": "<candidate-id>",
      "kind": "comment|patch|run_command|open_pr|merge|label|react|noop",
      "payload": { /* shape depends on kind */ },
      "rationale": "<text>",
      "estimated_risk": "low|medium|high"
    }
  ],
  "tool_usage": {
    "calls": 0,
    "wall_clock_s": 0,
    "cost_estimate": 0.0
  }
}
```

Validated by `schemas/handoff.schema.json`.

A handoff with `status=fail` or any `objections[].blocking=true` short-
circuits the current cycle and may block settlement.

---

## Settlement

The visible record of how a decision formed. One settlement per stimulus;
mirrors `THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md` and is stored under
`workspace/active-settlements/<settlement_id>.yml` until archived to
`memory/decisions/`.

Required fields:

```yaml
settlement_id:        # settlement.<domain>.<year>-<seq>
stimulus_id:
stimulus_type:        # event taxonomy
timestamp:            # ISO 8601 when formed
governing_frame:      # frame-id
analogies_used: [ ... ]

activated:            # per-agency final activation weight after all passes
  - agency: <agent-id>
    weight: 0.0
inhibited:
  - agency: <agent-id>
    weight_delta: -0.0
    reason: <text>

proposals:
  - from: <agent-id>
    proposal: <text>
    evidence: [ ... ]
    method: <retrieval|rule|local-model|hybrid>
    confidence: 0.0
    alternatives_considered: [ ... ]
    observability_limits: [ ... ]
    opaque_model_dependencies: [ ... ]
    cited_procedures:  [ <procedural-id>, ... ]
    cited_decisions:   [ <settlement-id>, ... ]

critics:
  - critic: <critic-id>
    objection: <text>
    sustained: true|false
censors:
  - censor: <censor-id>
    blocked: true|false
    reason: <text>

ideals_cited: [ <self-ideal-id>, ... ]
unknowns: [ <text>, ... ]
blind_spots: [ <text>, ... ]

action_authorised:
  kind: <comment|patch|open_pr|merge|noop|escalate_human>
  payload_ref: <state path or branch ref>
  approval_state: <not_required|pending|granted|denied>

memory_updates:
  episodic:    [ <path>, ... ]
  semantic:    [ <path>, ... ]
  procedural:  [ <path>, ... ]
  failure:     [ <path>, ... ]
  klines:      [ <kline-id>, ... ]
  decisions:   [ <settlement-id>, ... ]

outcome:
  status: <success|partial|failed|blocked|pending_human>
  observed_at: <iso8601>
  notes: <text>

linked:               # typed relational links to prior records
  - kind: <supersedes|derived_from|contradicts|cites|reinforces|analogous_to>
    target: <record-id>
```

Validated by `schemas/settlement.schema.json`.

Invariant: **no non-trivial action may occur without a settlement.** The
`act` step refuses to run if the settlement file is missing required slots
for the governing frame.

---

## K-line

Schema previously sketched in `06-frames-polynemes-klines.md`. Restated here
in canonical form so all four record types live in one document.

```yaml
id: kline.<class>.<date>.<stimulus_id>
class: <code-change|security|question|self-modification|...>
stimulus_id: <stimulus_id>
settlement_id: <settlement_id>
outcome: success|partial|failed

cue:
  title_terms: [ ... ]
  labels:      [ ... ]
  paths_touched: [ ... ]
  symbols:     [ ... ]            # active polyneme symbols at success

activation_snapshot:
  frame: <frame-id>
  active_agencies:
    <agent-id>: 0.0

useful_context:
  files_read:        [ ... ]
  commands_run:      [ ... ]
  prior_settlements: [ <settlement-id>, ... ]
  prior_klines:      [ <kline-id>, ... ]

decision:
  summary: <one-line>
  caveat:  <one-line|null>

restore_when:
  any_terms:   [ ... ]
  any_labels:  [ ... ]
  any_paths:   [ ... ]
  any_symbols: [ ... ]

reinforcement:
  tests_passed: bool
  user_reacted_positive: bool|null
  later_reverted: bool
  reuse_count: 0
  last_reused_at: <iso8601|null>
  decay_score: 0.0
```

Validated by `schemas/kline.schema.json`.

---

## Manifest (frontmatter)

The frontmatter schema for any agency, critic, or censor manifest is
specified in `05-agencies-critics-censors.md` and validated by
`schemas/manifest.schema.json`. It is listed here for completeness so the
five canonical record types are co-located:

1. Signal
2. Handoff
3. Settlement
4. K-line
5. Manifest (frontmatter)

---

## Validation rule

Every artifact written under `.forgejo-society/state/`,
`.forgejo-society/workspace/`, or `.forgejo-society/memory/` MUST pass
schema validation in `lifecycle/lib/` before commit. Validation failure is
an *internal failure*, not a user-facing one: the runtime writes a
`failure/` record describing the schema violation and reports a *blocked*
settlement. This protects the long-term inspectability of the mind.
