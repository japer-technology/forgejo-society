# 11 — Mapping: SOCIETY-OF-REPO → Implementation

Every section of `SOCIETY-OF-REPO/` maps to either a path under
`.forgejo-society/` or a step in `.forgejo/workflows/forgejo-society.yaml`.
This is the verification table that enforces the *two-target collapse rule*
from `00-overview.md`.

If any row is missing in the implementation, that capability is not yet
built. If any cognitive concept exists in the running repo without a row
here, the mapping is out of date and must be updated.

---

## 00-foundations

| SOR file | Implementation target |
|---|---|
| `00-foundations/01-society-of-mind.md` | reference only — quoted in `.forgejo-society/README.md` and `protocols/identity.md` |
| `00-foundations/02-cognitive-loop.md` | shape of the workflow; mapped step-by-step in `03-runtime-pipeline.md` |
| `00-foundations/03-maturity-model.md` | reference; cited by `evolution/ecology-review.md` |
| `00-foundations/04-anti-patterns.md` | reference; cited by `agencies/meta-admin/*` |
| `00-foundations/05-skills.md` | reference; cited by agency manifests |
| `00-foundations/06-mind-brain-body.md` | reference; informs `lifecycle/` vs `agencies/` separation |
| `00-foundations/07-research-crosswalk.md` | reference only |
| `00-foundations/08-unified-gap-incorporation.md` | reference only |
| `00-foundations/09-cognitive-observability.md` | enforced by `state/`, `report` step, and `evolution/reinforcement-log.md` |
| `00-foundations/10-bootstrap-minimum-viable-sor.md` | concretised in `SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md` |

---

## 01-governance

| SOR file | Implementation target |
|---|---|
| `01-governance/constitution.md` | `.forgejo-society/governance/constitution.md` |
| `01-governance/authority-registry.md` | `.forgejo-society/governance/authority-registry.yml` |
| `01-governance/approval-gate.md` | `.forgejo-society/governance/approval-gate.yml` and the `act` step |
| `01-governance/rights-registry.md` | `.forgejo-society/governance/rights-registry.yml` |
| `01-governance/policy-ledger.md` | `.forgejo-society/governance/policy-ledger.yml` |
| `01-governance/self-ideals.md` | `.forgejo-society/governance/self-ideals.md` |
| `01-governance/self-models.md` | `.forgejo-society/AGENTS.md` (Spock) + `agencies/identity/spock-self-model.md` |
| `01-governance/governance-log/` | `.forgejo-society/governance/governance-log/` |

---

## 02-protocols

| SOR file | Implementation target |
|---|---|
| `02-protocols/01-identity.md` | `.forgejo-society/protocols/identity.md` + ID convention enforced by `schemas/manifest.schema.json` |
| `02-protocols/02-constitution.md` | `.forgejo-society/protocols/constitution.md` (excerpt) + `governance/constitution.md` |
| `02-protocols/03-events.md` | `.forgejo-society/protocols/events.md` + `normalize` step (Forgejo bridge) |
| `02-protocols/04-activation.md` | `.forgejo-society/protocols/activation.md` + `lifecycle/activate.ts` |
| `02-protocols/05-settlement.md` | `.forgejo-society/protocols/settlement.md` + `schemas/settlement.schema.json` + `lifecycle/settle.ts` |
| `02-protocols/06-memory.md` | `.forgejo-society/protocols/memory.md` + `lifecycle/memory.ts` + `memory/` tree |
| `02-protocols/07-service-channel.md` | `.forgejo-society/protocols/service-channel.md` + `services/` + `channels/` |
| `02-protocols/08-governance.md` | `.forgejo-society/protocols/governance.md` + `governance/` tree |
| `02-protocols/09-representation.md` | `.forgejo-society/protocols/representation.md` + write rules in `08-state-and-memory.md` |
| `02-protocols/10-credit-assignment.md` | `.forgejo-society/protocols/credit-assignment.md` + `lifecycle/credit-assignment.ts` |
| `02-protocols/11-introspection.md` | `.forgejo-society/protocols/introspection.md` + `state/.../workspace.md` (`unknowns`/`blind_spots` slots in settlement) |
| `02-protocols/12-insulation.md` | `.forgejo-society/protocols/insulation.md` + workflow `concurrency:` group + per-stimulus state dirs |
| `02-protocols/13-hierarchy-and-summaries.md` | `.forgejo-society/protocols/hierarchy.md` + `agencies/assembly/*` |
| `02-protocols/14-relational-memory.md` | `.forgejo-society/protocols/relational-memory.md` + typed `linked:` fields in record schemas |
| `02-protocols/15-forgejo-environment.md` | `.forgejo-society/protocols/forgejo-environment.md` + workflow itself |
| `02-protocols/16-forgejo-runtime-layers.md` | `.forgejo-society/protocols/forgejo-runtime-layers.md` + folder/presence semantics throughout |
| `02-protocols/17-forgejo-operational-verification.md` | `.forgejo-society/protocols/forgejo-operational-verification.md` + Phase A acceptance checks in `10-bootstrap-checklist.md` |
| `02-protocols/18-bridges.md` | `.forgejo-society/protocols/bridges.md` + `lifecycle/lib/forgejo.ts` |
| `02-protocols/19-b-brain-observation.md` | `.forgejo-society/protocols/b-brain-observation.md` + `agencies/meta-admin/ecology-monitor.md` |

---

## 03-agencies

| SOR concept | Implementation target |
|---|---|
| catalogue (perception/memory/code/safety/identity/integration/assembly/meta-admin) | `.forgejo-society/agencies/<family>/<name>.md` per `05-agencies-critics-censors.md` |
| worker vs assembly vs meta-admin distinction | enforced by `agency:` and `kind:` fields in manifest schema |
| forgejo-ops-steward | `.forgejo-society/agencies/meta-admin/forgejo-ops-steward.md` (Phase B) |
| domain-specific bees (contract/tax/staff/calendar/etc.) | not in core; added per deployment via `self-modification` settlement |

---

## 04-critics

| SOR critic | Implementation target |
|---|---|
| evidence-critic | `.forgejo-society/critics/evidence-critic.md` |
| scope-critic | `.forgejo-society/critics/scope-critic.md` |
| cost-critic | `.forgejo-society/critics/cost-critic.md` |
| privacy-critic | `.forgejo-society/critics/privacy-critic.md` |
| risk-critic | `.forgejo-society/critics/risk-critic.md` |
| overconfidence-critic | `.forgejo-society/critics/overconfidence-critic.md` |
| source-quality-critic | `.forgejo-society/critics/source-quality-critic.md` |
| staleness-critic | `.forgejo-society/critics/staleness-critic.md` |

All run in the `criticize` workflow step.

---

## 05-censors

| SOR censor | Implementation target |
|---|---|
| cloud-egress-censor | `.forgejo-society/censors/cloud-egress-censor.md` |
| authority-censor | `.forgejo-society/censors/authority-censor.md` |
| payment-censor | `.forgejo-society/censors/payment-censor.md` |
| delegation-censor | `.forgejo-society/censors/delegation-censor.md` |
| credential-censor | `.forgejo-society/censors/credential-censor.md` |
| pii-exfiltration-censor | `.forgejo-society/censors/pii-exfiltration-censor.md` |
| (added) workflow-danger-censor | `.forgejo-society/censors/workflow-danger-censor.md` |
| (added) secret-smeller | `.forgejo-society/censors/secret-smeller.md` |
| censor vs suppressor distinction | `kind:` field in manifest; enforced in `policy.ts` and `act.ts` |

---

## 06-memory

| SOR memory class | Implementation target |
|---|---|
| events/ | `.forgejo-society/memory/events/` (write: `normalize` + `act`) |
| episodic/ | `.forgejo-society/memory/episodic/` (write: `archivist`) |
| semantic/ | `.forgejo-society/memory/semantic/{decisions,preferences,project-laws}.log` |
| procedural/ | `.forgejo-society/memory/procedural/` (write: `archivist` under `self-modification`) |
| failure/ | `.forgejo-society/memory/failure/` |
| frames/ | `.forgejo-society/memory/frames/` (learned frames; meta-admin) |
| analogies/ | `.forgejo-society/memory/analogies/` (meta-admin + human) |
| concepts/ | `.forgejo-society/memory/concepts/` |
| klines/ | `.forgejo-society/memory/klines/<class>/<date>-<stimulus>.yml` |
| decisions/ | `.forgejo-society/memory/decisions/` (archived settlements) |
| representation discipline | enforced by `policies/memory-policy.yml` + write-rule table in `08-state-and-memory.md` |
| relational links | `linked:` field on every durable record (per `protocols/14-relational-memory.md`) |
| decay | scheduled cron pass + `decay_score` field |

---

## 07-workspace

| SOR workspace concept | Implementation target |
|---|---|
| global-workspace/ | `.forgejo-society/workspace/global-workspace/<stimulus_id>.md` |
| current-focus/ | `.forgejo-society/workspace/current-focus/current.md` |
| active-settlements/ | `.forgejo-society/workspace/active-settlements/<settlement_id>.yml` |
| owner-briefings/ | `.forgejo-society/workspace/owner-briefings/<settlement_id>.md` |
| sweep after settlement | `report` step + `archivist` |

---

## 08-services

| SOR concept | Implementation target |
|---|---|
| services/README.md | `.forgejo-society/services/README.md` (stub for Phase A) |
| individual service repos | `.forgejo-society/services/<service-id>/` (Phase C) |

---

## 09-channels

| SOR concept | Implementation target |
|---|---|
| channels/README.md | `.forgejo-society/channels/README.md` (stub) |
| reciprocal-agreement.example.md | `.forgejo-society/channels/<peer>/reciprocal-agreement.md` (Phase C) |

---

## 10-evolution

| SOR concept | Implementation target |
|---|---|
| reinforcement-log.md | `.forgejo-society/evolution/reinforcement-log.md` (write: `credit-assignment.ts`) |
| retirement-log.md | `.forgejo-society/evolution/retirement-log.md` (write: `meta-admin.retirement-broker`) |
| ecology review | `.forgejo-society/evolution/ecology-review.md` + scheduled cron pass |
| differentiation | `agencies/meta-admin/differentiation-broker.md` + `self-modification` frame |

---

## THE-REPO-IS-THE-MIND/possibility-2.md cross-mapping

Concepts from `possibility-2.md` that are not in `SOCIETY-OF-REPO/`:

| possibility-2 concept | Implementation target |
|---|---|
| signals as the unit of internal communication | `schemas/signal.schema.json` + `state/.../signals.jsonl` |
| polynemes | `.forgejo-society/nemes/{path,label,phrase}-polynemes.yml` + `symbols.yml` |
| frames as repo-native expectations | `.forgejo-society/frames/*.frame.yml` + `schemas/frame.schema.json` |
| K-lines as reusable mental states | `.forgejo-society/memory/klines/**` + `schemas/kline.schema.json` |
| censors and suppressors as first-class code | `.forgejo-society/censors/*.md` + `policies/danger-zones.yml` + `policy.ts` |
| branches as imagination | `act` step’s `society/<stimulus_id>/candidate-<n>` branch protocol |
| layered blackboard | `state/.../workspace.md` + `blackboard.md` + `signals.jsonl` etc. |
| difference engines | implicit in frame `slots:` (required slots == differences from desired state) |
| direct internal addressing (`society <target>:`) | `nemes/phrase-polynemes.yml` `directive.*` symbols |
| Spock as the conscious bottleneck | `agencies/integration/conscious-presenter.md` is the sole producer of visible response |
| evidence-bearing handoffs (no evidence, no trust) | `schemas/handoff.schema.json` requires `evidence` on every claim |
| mental physics (path → activation, diff → thought, branch → imagination, etc.) | runtime semantics encoded across `nemes/`, `act` step, `state/`, `memory/` |

---

## Verification

A reviewer can:

1. Pick any line in `SOCIETY-OF-REPO/` or `possibility-2.md`.
2. Find it in this table.
3. Open the corresponding implementation target.
4. Confirm the capability is either present (Phase A done) or explicitly
   deferred to Phase B/C in `10-bootstrap-checklist.md`.

If a row’s implementation target does not exist and no phase claims it,
the implementation is incomplete.
