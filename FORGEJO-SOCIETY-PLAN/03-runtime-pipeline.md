# 03 — Runtime Pipeline

The cognitive loop from `THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md`
mapped onto the workflow phases (`02-workflow-design.md`) and onto concrete
files in `.forgejo-society/`.

```
stimulus
  → perception
  → frame selection
  → K-line + analogy activation
  → agency response
  → criticism
  → graduated inhibition
  → censorship
  → settlement
  → action
  → outcome
  → memory
  → credit assignment
  → reinforcement and evolution
```

Each row below ties one cognitive step to one workflow phase, the runtime
module that owns it, and the concrete `.forgejo-society/` files it reads or
writes.

---

## Pipeline mapping table

| Cognitive step | Workflow job/step | Runtime module | Reads | Writes |
| --- | --- | --- | --- | --- |
| Stimulus | `normalize` | `lib/forgejo.ts` | event payload | `state/runs/<run>/stimulus.json` |
| Perception | `perceive` | `perceive.ts` | `stimulus.json`, `nemes/*` | `state/mind/issues/<n>/percepts.jsonl` |
| Frame selection | `activate` | `frames.ts` | `frames/*.frame.yml`, `percepts.jsonl` | adds `frame:` to workspace |
| K-line + analogy activation | `activate` | `klines.ts` | `memory/klines/**`, `memory/analogies/**` | `state/mind/issues/<n>/activation.jsonl` |
| Agency response | `deliberate` | `lifecycle/mind.ts` loop | `agencies/**`, `policies/tool-policy.yml` | `state/.../signals.jsonl`, `blackboard.md`, `candidate-actions.jsonl` |
| Criticism | `criticize` | `critics.ts` | `critics/*.md` | `state/.../objections.jsonl` |
| Graduated inhibition | `criticize` (tail) | `activate.ts` | objections + activation | updates `activation.jsonl` |
| Censorship | `censor` | `censors.ts`, `policy.ts` | `censors/*.md`, `policies/danger-zones.yml`, `policies/write-policy.yml` | tool surface mutated; suppressors fire on candidate outputs |
| Settlement | `settle` | `settle.ts` | full workspace | `workspace/active-settlements/<settlement_id>.yml` and `state/.../final.md` |
| Action | `act` | `act.ts`, `lib/forgejo.ts`, `lib/git.ts` | settlement, `governance/approval-gate.yml` | Forgejo comment / PR / branch / commit; `state/.../diff-summary.md` |
| Outcome | `act` (tail) | `act.ts` | runner exit codes, API responses | `state/runs/<run>/outcome.json` |
| Memory | `remember` | `memory.ts` | settlement + outcome | `memory/events/`, `memory/episodic/`, `memory/decisions/`, optional K-line |
| Credit assignment | `remember` | `credit-assignment.ts` | settlement, agencies that contributed | `evolution/reinforcement-log.md` |
| Reinforcement & evolution | `report` (+ scheduled cron run) | `evolution/` runtime hook | reinforcement log, ecology review | `evolution/reinforcement-log.md`, `evolution/ecology-review.md` |

---

## Two parallel write paths

The pipeline writes into two distinct trees, with different lifetimes:

| Tree | Lifetime | Owner | Purpose |
| --- | --- | --- | --- |
| `.forgejo-society/state/` | per-run, append-only | runtime | episodic / per-stimulus trace |
| `.forgejo-society/memory/` | durable, governed | settled cognition only | semantic, procedural, K-line, decision archive |
| `.forgejo-society/workspace/` | short-term, swept after settlement | settlement layer | active attention |

Only the `settle` and `remember` phases may promote anything from `state/` or
`workspace/` into `memory/`. This enforces the *representation discipline*
protocol (`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`).

---

## Branches as imagination

For any candidate action that touches a path listed in
`policies/danger-zones.yml`, the `act` phase MUST:

1. create branch `society/<stimulus_id>/candidate-<n>`
2. apply the proposed diff there
3. run validation steps in the same workflow run
4. write `diff-summary.md` and link it in the settlement
5. only then either:
   - fast-forward into `main` (if the danger-zone censor allows direct commit)
   - open a PR for review (medium risk)
   - leave the branch for human inspection and post a comment with a link
     (high risk; default for `workflow_mutation` and `soul_mutation`)

This is `possibility-2.md`’s `main = believed world / branch = imagined
world / diff = thought / merge = belief update`.

---

## Conscious bottleneck

Only `agencies/integration/conscious-presenter.md` may produce text that
`act` posts back to the user. Every other agency emits structured signals,
handoffs, or candidate text. The presenter assembles one coherent response
from the settled blackboard. This implements `possibility-2.md`’s rule that
Spock remains the single public voice.

---

## Scheduled (cron) loop

A `schedule:` trigger in the workflow runs:

- ecology review (`evolution/ecology-review.md`)
- K-line decay and reinforcement
- staleness sweep across `memory/semantic/` and frames
- workspace garbage collection (settled items move to `memory/decisions/`)

The cron pass uses the same pipeline; its stimulus is a synthesised
`schedule.<slot>` event. No special-case code path.
