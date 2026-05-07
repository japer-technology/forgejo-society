# Settlement Protocol

A settlement is a visible record of how a decision formed in the society.

No non-trivial action may occur without a settlement.

---

## What a settlement is

A settlement is not just a decision. It is:

```text
the stimulus that triggered the process
the agencies that woke
what each agency proposed
what critics objected to
what censors blocked
what action was authorised
what evidence was used
whether human approval was required
what memory should be updated
```

A settlement makes reasoning visible. It is the difference between "AI did something" and "the society formed a traceable judgment."

---

## Settlement schema

```yaml
settlement_id:          # settlement.{domain}.{year}-{sequence}
stimulus:               # The originating event or issue ID
stimulus_type:          # Event type from the events taxonomy
timestamp:              # ISO 8601 when settlement was formed

# Which agencies were activated and at what weight
activated:
  - agency: agency-id
    weight: float (0–1)

# What each activated agency proposed
proposals:
  - from: agency-id
    proposal: |
      Human-readable description of the proposed action.
    evidence:           # Supporting data or prior settlements cited
    confidence: float   # Confidence in the proposal (0–1)

# What critics objected to
objections:
  - from: critic-id
    objection: |
      Human-readable description of the objection.
    proposal_targeted: agency-id
    severity: low | medium | high

# What censors blocked (if any)
blocks:
  - from: censor-id
    block: |
      Human-readable description of what was blocked.
    reason: policy-id or rule reference
    unconditional: true | false

# The settled outcome
settlement:
  action: |
    What will happen, in plain language.
  approval_required: true | false
  approval_type:     # null, or the approval-gate category
  cloud_allowed:     true | false
  authorised_executor: agency-id
  estimated_completion: ISO 8601 timestamp

# Approval record (populated after human approval, if required)
approval:
  granted_by:    # human identifier
  method:        # pr_merge | issue_comment | label
  timestamp:     # ISO 8601
  reference:     # PR number, issue URL, or commit SHA

# Memory updates to apply after action completion
memory_updates:
  episodic:  true | false
  semantic:  list of new facts to record
  kline_review: reinforce_metadata | weaken_metadata | no_change | propose_structural_change
  failure:   true | false (if action failed)
```

---

## Settlement process

```text
1. Stimulus arrives and agencies are activated.

2. Each activated agency submits a proposal to the global workspace.
   Proposals are emitted as events (proposal.submitted).

3. Critics evaluate all proposals.
   Critics raise objections as events (objection.raised).
   Critics may propose modifications to proposals.

4. Censors evaluate all proposals.
   Censors block any proposal that violates a hard limit.
   Blocks are unconditional and cannot be overridden by any agency.
   Blocks are emitted as events (block.applied).

5. The settlement layer evaluates:
   - Which proposals survived criticism without objection (or with resolved objection)
   - Which proposals are blocked by censors (excluded)
   - Whether human approval is required

6. A settlement record is formed and written to active-settlements.

7. If human approval is required:
   a. The owner-briefing writes a request to the owner.
   b. The settlement waits in pending state.
   c. When approval arrives, the settlement advances to authorised.

8. The authorised executor is identified and the action is queued.
   A `propose`-level executor may perform only internal analysis and writes within its declared proposal/report targets.
   Any external effect requires an `act`-level executor (or human executor where required).

9. After the action completes, the settlement is updated with the outcome.

10. Memory is updated according to the settlement's memory_updates field.
```

---

## Settlement states

| State | Meaning |
|---|---|
| `forming` | Proposals are being submitted; criticism and censorship in progress |
| `pending_approval` | Settlement formed; waiting for human approval |
| `authorised` | Approved and ready for execution |
| `executing` | Action in progress |
| `completed` | Action completed successfully |
| `failed` | Action failed during execution |
| `blocked` | All proposed actions were blocked by censors; no action possible |
| `cancelled` | Owner cancelled the settlement |

---

## Trivial actions

Not every action requires a full settlement.

An action is **trivial** when:
- It involves no data in sensitive categories
- It requires no human approval
- It has no external effects (cloud calls, payments, disclosures)
- It is a pure read or a write to a workspace/draft folder
- It is covered by an existing K-line with high confidence

Trivial actions may proceed with a minimal settlement record:

```yaml
settlement_id: settlement.trivial.{sequence}
stimulus: event-id
action: brief description
trivial: true
authorised_executor: agency-id
timestamp: ISO 8601
```

---

## Settlement storage

Settlements are stored in [../07-workspace/active-settlements/](../07-workspace/active-settlements/).

Completed settlements are archived to [../06-memory/decisions/](../06-memory/decisions/) after the memory-protocol retention period.

All settlements are permanently preserved in Git history.

---

## Example settlement

```yaml
settlement_id: settlement.supplier-invoice.2026-001
stimulus: event.invoice.price-increase-detected.evt-042
stimulus_type: invoice.price-increase-detected
timestamp: 2026-05-07T09:15:42Z

activated:
  - agency: agency.supplier-bee
    weight: 0.95
  - agency: agency.finance-watch
    weight: 0.84
  - agency: critic.cost
    weight: 0.88

proposals:
  - from: agency.supplier-bee
    proposal: Flag 18% price increase from Supplier X for owner review.
    evidence: last-12-months-invoice-data
    confidence: 0.92
  - from: agency.finance-watch
    proposal: Compare new pricing against 12-month average and generate trend chart.
    evidence: financial-history-q1-q4-2025
    confidence: 0.87

objections:
  - from: critic.evidence
    objection: finance-watch comparison requires historical data to be loaded first.
    proposal_targeted: agency.finance-watch
    severity: low

blocks: []

settlement:
  action: >
    Run price comparison (finance-watch), then prepare owner briefing with
    price trend and comparison to alternatives (supplier-bee).
  approval_required: false
  cloud_allowed: false
  authorised_executor: agency.finance-watch

memory_updates:
  episodic: true
  semantic:
    - "Supplier X increased prices 18% in May 2026"
  kline_review: reinforce_metadata
  failure: false
```
