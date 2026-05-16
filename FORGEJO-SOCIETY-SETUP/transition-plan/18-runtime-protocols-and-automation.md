# Runtime Protocols, Privacy Controls, and Reinforcement

This document defines the operating contract for live Forgejo-Society execution. Use it with
[SOR-to-Forgejo Mapping and Bootstrap](17-sor-bootstrap-and-mapping.md) and the settlement
protocol in `THE-SOCIETY-OF-REPO`.

---

## Runtime state machine

| State | Meaning | Entry trigger | Exit trigger |
| --- | --- | --- | --- |
| `discovered` | Activation candidate found | Label, webhook, schedule, or manual dispatch | Agent accepts or ignores |
| `claimed` | One agent owns the work | Settlement ID created | Draft proposal or timeout |
| `proposed` | Agent output is ready for review | PR opened and settlement file written | Critic review starts |
| `under-critique` | Critics and censors are evaluating | Required critic requested | Approve, object, or timeout |
| `ready-to-merge` | All required gates passed | No blocking objections remain | Human/governed merge |
| `settled` | Merge or rejection recorded | Outcome written to memory | Reinforcement review |

---

## Activation discovery in practice

### Supported activation sources

- issue labels such as `activate:intake`, `activate:review`, `activate:memory`
- webhook events for issue creation, PR updates, and schedule ticks
- manual `workflow_dispatch` for controlled testing
- periodic scans of `workspace-current-focus`

### Discovery rules

1. Ignore events with no matching activation label or policy entry.
2. Resolve the target repo class before any inference step.
3. Reject activation immediately if the actor or repo lacks authority.
4. Create the settlement ID before external calls or file writes.

---

## Critic response windows

| Gate type | Default response window | Failure mode |
| --- | --- | --- |
| Local automated critic | 5 minutes | Retry once, then fail closed |
| Repo-scoped critic service account | 30 minutes | Reassign to backup critic |
| Human governor review | 24 hours | Hold open until explicit decision |
| Cloud-egress approval | 24 hours | No escalation without approval |

### If a critic is offline

- Mark the critic `unavailable` in the settlement record.
- If a governed backup critic exists, re-route once.
- If no backup exists for a required critic, the settlement fails closed.

### Multiple objections

- Any blocking objection prevents merge.
- The settlement owner must answer each objection in order.
- Governance decides when critic conclusions conflict.
- If conflict persists beyond the response window, the action is rejected and logged.

---

## Timeout, retry, and fail-closed rules

| Event | Retry policy | Final state |
| --- | --- | --- |
| Activation claim race | No retry; attach to existing settlement | `claimed` under original owner |
| Local model inference failure | Retry once with same model, once with larger local model | `rejected` if still failing |
| Critic timeout | Retry via backup critic if policy allows | `rejected` |
| Memory write failure | Retry once after integrity check | `blocked` until fixed |
| Cloud escalation unavailable | No automatic retry | `rejected` or `deferred` |

Fail closed by default for governance, privacy, credential, and publication tasks.

---

## Cloud-egress and privacy enforcement

### Network layer

- Runner nodes default to **deny outbound** except package mirrors, Forgejo, and approved model endpoints.
- Cloud model traffic must exit through a dedicated allowlist proxy.
- Sensitive repos never receive proxy credentials.

### Policy layer

Classify repositories before automation begins:

| Repo class | Cloud use | Rule |
| --- | --- | --- |
| `core` | Forbidden by default | Human override only |
| `governance` | Forbidden | No exception |
| `memory` | Forbidden unless records are already public | Human override only |
| `agent` | Allowed only if labelled and approved | Must pass censors |
| `public-showcase` | Allowed for publication drafting | Must scrub secrets and PII |

### Prompt screening

Before any cloud escalation, run three local gates:

1. **credential censor** — block secrets and tokens
2. **PII censor** — block personal or regulated data
3. **scope/privacy critic** — block content from non-approved repos

### Enforcement rule

A cloud call is allowed only when **all** are true:

- the repo class permits escalation
- the settlement record says `cloud_allowed: true`
- the censors pass
- approval is recorded when the task class requires it

---

## Reinforcement algorithm

Track each agent and K-line with the same minimum fields:

- `reinforcement_count`
- `weakening_count`
- `success_rate_30d`
- `false_positive_rate_30d`
- `median_settlement_latency`
- `last_reviewed_at`

### K-line lifecycle

| State | Promotion rule | Demotion rule |
| --- | --- | --- |
| `experimental` | 5 successful uses with human confirmation | 1 harmful or 2 low-value uses |
| `active` | 20 successful uses and false-positive rate under 10% | false-positive rate over 20% |
| `preferred` | 50 successful uses and best latency in class | two monthly reviews below target |
| `retired` | Not applicable | 90 days unused or repeated failure |

### Agency lifecycle

| State | Promotion rule | Demotion rule |
| --- | --- | --- |
| `experimental` | 10 settled actions, zero harmful merges | 1 severe incident |
| `probation` | 30 days stable and false-positive rate under 10% | false-positive rate over 15% |
| `trusted` | Governance approval after metrics review | 2 monthly reviews below target |
| `retired` | Not applicable | repeated noise or obsolete capability |

An agency is considered **too noisy** when either of these is true for 30 days:

- false-positive rate exceeds 15%
- more than 25% of activations end without a useful proposal

---

## Cost accounting

### Per-task budget rules

| Task class | Default model route | Hard budget |
| --- | --- | --- |
| Triage and routing | Local small model | $0 cloud |
| Code review | Local reasoning model | $0 unless security review is approved |
| Architecture synthesis | Local first, cloud by approval | capped per settlement |
| Publication draft | Cloud optional | capped per document |

### Provider selection order

1. Local LM Studio model meeting the quality bar
2. Approved lowest-cost cloud model meeting the task requirement
3. Human fallback if policy or budget blocks automation

### Attribution and review

- Attribute every cloud call to settlement ID, repo, and agent.
- Review monthly totals by repo class and agent.
- Trigger governance review when monthly cloud spend exceeds the approved ceiling or any repo exceeds its class budget.

---

## Definition of done for runtime governance

- [ ] Every activation source maps to a documented settlement ID path
- [ ] Required critic windows are explicit
- [ ] Offline critic behaviour is documented
- [ ] Cloud escalation is gated by network and policy controls
- [ ] Reinforcement and retirement thresholds are numeric
- [ ] Monthly cost review thresholds are defined
