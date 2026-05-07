# Constitution Protocol

Every durable agency in a Society of Repo must have a constitution.

A constitution is a YAML file that declares what the agency is, what it does, what it must not do, and how it is evaluated.

Without a constitution, a repo is not an agency. It is just a folder.

---

## Required fields

Every `constitution.yaml` must contain the following fields:

```yaml
# -- Identity --
id:          # agency ID in the format: agency.{name}
name:        # Human-readable name
kind:        # agency | critic | censor | memory | workspace | service
status:      # active | probation | retired

# -- Purpose --
purpose:
  summary:     # One sentence description of what this agency does
  non_goals:   # List of things this agency explicitly does NOT do

# -- Authority --
authority:
  level:              # read | draft | propose | act | govern
  can_read:           # List of repo paths or data categories this agency may read
  can_write:          # List of repo paths or data categories this agency may write
  requires_approval_for:  # List of action categories requiring human approval

# -- Models --
models:
  default:   # local | none | rule-based
  cloud:     # forbidden | approval_required | permitted (with policy_id)

# -- Outputs --
outputs:   # List of output types this agency produces

# -- Evaluation --
evaluation:
  metrics:   # List of metrics used to evaluate this agency's performance
```

---

## Optional fields

```yaml
# -- Service (for service repos) --
service:
  id:         # service ID
  version:    # version number
  pricing:    # pricing mode and amount

# -- Memory (for memory repos) --
memory:
  scope:      # what this memory system covers
  decay:      # memory temperature decay policy

# -- Evolution --
evolution:
  probation_trigger:   # condition that puts agency on probation
  retirement_trigger:  # condition that retires agency
  spawn_condition:     # condition under which a child agency may be spawned
```

---

## Example minimal constitution

```yaml
id: agency.contract-bee
name: Contract Bee
kind: agency
status: active

purpose:
  summary: Extract obligations, dates, risks, and questions from contracts.
  non_goals:
    - provide legal advice
    - approve contracts
    - send private documents externally without permission

authority:
  level: propose
  can_read:
    - documents/contracts
    - memory/contracts
  can_write:
    - reports/contract-obligations
    - tasks/owner-review
  requires_approval_for:
    - external_service_call
    - legal_escalation
    - sharing_contract_text

models:
  default: local
  cloud: approval_required

outputs:
  - obligation_summary
  - renewal_warning
  - owner_question_list
  - risk_flag

evaluation:
  metrics:
    - missed_obligation_rate
    - false_alarm_rate
    - owner_usefulness_score
```

---

## Constitution lifecycle

| State | Meaning |
|---|---|
| `active` | Agency is operating normally |
| `probation` | Agency performance is below threshold; under review |
| `retired` | Agency is no longer active; constitution preserved for lineage |

State changes require a PR and owner approval.

---

## Constitution review

Agency constitutions are reviewed:
- When the agency's performance metrics fall below threshold
- When the agency's scope needs to change
- When a new authority level is requested
- At the quarterly evolution review

All reviews produce a commit record in Git history.
