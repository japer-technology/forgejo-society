# Authority Registry

The authority registry defines which agencies hold which authority levels and what each level permits them to do.

Authority levels are defined in the [constitution](constitution.md).

---

## Authority level definitions

| Level | Name | Can read | Can write | Can open issues/PRs | Can merge | Can act on production | Can modify governance |
|---|---|---|---|---|---|---|---|
| `read` | Read only | designated repos | no | no | no | no | no |
| `draft` | Draft only | designated repos | draft folders only | no | no | no | no |
| `propose` | Propose | designated repos | workspace + designated proposal/report paths | yes | no | no | no |
| `act` | Act | designated repos | authorised write targets | yes | own-scope only | yes, authorised actions | no |
| `govern` | Govern | all governance repos | governance repos | yes | governance scope | yes | yes, with human co-signature |
| `human` | Human | all | all | yes | all | all | all |

---

## Agency authority assignments

### Worker agencies

| Agency | Authority level | Rationale |
|---|---|---|
| `intake-bee` | `propose` | Classifies and routes; does not act directly |
| `contract-bee` | `propose` | Extracts and proposes; owner decides |
| `tax-bee` | `propose` | Surfaces obligations; owner decides |
| `staff-bee` | `propose` | Flags expiries and compliance; owner decides |
| `supplier-bee` | `propose` | Analyses and proposes; owner decides |
| `finance-watch` | `propose` | Reports and proposes; owner decides |
| `forgejo-ops-steward` | `propose` | Observes Forgejo runtime health, surface activation, token scope, and state integrity; owner decides changes |
| `owner-briefing` | `act` | Writes briefings to workspace; authorised to act |

### Critic agencies

| Agency | Authority level | Rationale |
|---|---|---|
| `evidence-critic` | `propose` | Challenges proposals; does not block alone |
| `scope-critic` | `propose` | Challenges proposals; does not block alone |
| `cost-critic` | `propose` | Challenges proposals; does not block alone |
| `privacy-critic` | `propose` | Challenges proposals; does not block alone |
| `risk-critic` | `propose` | Challenges proposals; does not block alone |
| `overconfidence-critic` | `propose` | Challenges proposals; does not block alone |
| `source-quality-critic` | `propose` | Challenges proposals citing low-quality or unverifiable sources |
| `staleness-critic` | `propose` | Challenges proposals relying on evidence past its freshness threshold |

### Censor agencies

| Agency | Authority level | Rationale |
|---|---|---|
| `cloud-egress-censor` | `act` | Enforces blocking unconditionally |
| `authority-censor` | `act` | Enforces authority limits unconditionally |
| `payment-censor` | `act` | Enforces payment limits unconditionally |
| `delegation-depth-censor` | `act` | Enforces chain depth limits unconditionally |
| `credential-censor` | `act` | Blocks exposure of secrets, API keys, passwords, or tokens unconditionally |
| `pii-exfiltration-censor` | `act` | Blocks PII leaving the local-access boundary without authorisation |

### Memory agencies

| Agency | Authority level | Rationale |
|---|---|---|
| `episodic-memory` | `act` | Writes to memory repos on authorised trigger |
| `semantic-memory` | `act` | Writes to memory repos on authorised trigger |
| `procedural-memory` | `act` | Writes to memory repos on authorised trigger |
| `failure-memory` | `act` | Writes to memory repos on authorised trigger |
| `klines` | `govern` | Modifies K-lines; requires governance authority |
| `decision-memory` | `act` | Writes settlements to decisions repo |

### Workspace agencies

| Agency | Authority level | Rationale |
|---|---|---|
| `global-workspace` | `act` | Writes to shared workspace on authorised trigger |
| `current-focus` | `act` | Updates focus state |
| `active-settlements` | `act` | Writes settlement records |
| `owner-briefings` | `act` | Writes briefings visible to owner |

---

## Authority escalation

An agency may not escalate its own authority level.

Authority escalation requires:
1. A proposal from the agency or its owner
2. Review by the governance layer
3. Human approval
4. A new or amended constitution for the agency
5. A commit to this registry reflecting the change

---

## Authority audit

The authority assignments in this registry are reviewed:
- When a new agency is added
- When an agency's behaviour changes significantly
- At the quarterly evolution review
- When any censor fires and records a violation

All changes to this registry are preserved in Git history.

---

## Execution boundary

`propose` authority permits an agency to perform bounded internal processing and to write proposal artefacts only within the write targets named in its constitution and the rights registry.

`propose` authority does **not** permit external effects: no merges, no payments, no external disclosures, no governance changes, and no production actions outside those designated proposal/report paths.
