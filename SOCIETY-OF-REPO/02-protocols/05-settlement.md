# Settlement Protocol

A settlement is a visible record of how a decision formed in the society.

No non-trivial action may occur without a settlement.

---

## What a settlement records

A settlement records:
- the stimulus that triggered the process
- the governing frame and any analogies used
- the agencies that woke and any routes that were inhibited
- what each agency proposed
- the evidence, method, confidence, and alternatives behind each proposal
- the unknowns, blind spots, and observability limits still present
- what critics objected to and what censors blocked
- which ideals, procedures, and prior decisions shaped the outcome
- what action was authorised and how memory should be updated

---

## Settlement schema

```yaml
settlement_id:          # settlement.{domain}.{year}-{sequence}
stimulus:               # originating event or issue ID
stimulus_type:          # event taxonomy value
timestamp:              # ISO 8601 when settlement formed
governing_frame: frame-id
analogies_used:
  - analogy-id

activated:
  - agency: agency-id
    weight: float
inhibited:
  - agency: agency-id
    weight_delta: float
    reason: text

proposals:
  - from: agency-id
    proposal: |
      Human-readable description of the proposed action.
    evidence:
      - citation or record reference
    method: retrieval | rule | local-model | hybrid
    confidence: float
    alternatives_considered:
      - text
    observability_limits:
      - text
    opaque_model_dependencies:
      - text
    cited_procedures:
      - procedure-id
    cited_decisions:
      - settlement-id
    cited_ideals:
      - ideal-id
    introspection:
      unknowns:
        - text
      blind_spots:
        - text
      explanation_quality: low | medium | high

objections:
  - from: critic-id
    objection: |
      Human-readable objection.
    proposal_targeted: agency-id
    severity: low | medium | high
    usefulness_score: float

blocks:
  - from: censor-id
    block: |
      What was blocked.
    reason: policy-id or rule reference
    unconditional: true

settlement:
  action: |
    What will happen.
  approval_required: true | false
  approval_type: null | category-id
  cloud_allowed: true | false
  authorised_executor: agency-id
  summary_tier: settlement-summary | executive-briefing
  forgejo_execution:
    surface: issue | pull-request | action | release | wiki | none
    target: issue-or-pr-number-url-or-path
    api_method: createIssueComment | editIssue | createPullRequest | createRelease | updateWikiPage | none
    workflow_run_id: string or null
    commit_sha: string or null

resource_budget:
  max_agencies: int
  max_critic_passes: int
  max_wall_clock_seconds: int
  max_workspace_items: int
resource_usage:
  agencies_used: int
  critic_passes_used: int
  wall_clock_seconds: int
  workspace_items_used: int

dialogical_metrics:
  diversity_of_proposal_sources: float
  disagreement_resolution_quality: float
  unnecessary_deliberation_rate: float

memory_updates:
  episodic: true | false
  semantic: []
  frame_update: no_change | reinforce_defaults | propose_new_frame
  kline_update: reinforce_metadata | weaken_metadata | propose_structural_change
  analogy_update: no_change | reinforce | propose_new_analogy
  concept_candidates: []
  failure: true | false
```

---

## Major proposal rule

Major proposals must cite the frame, procedures, prior decisions, and ideals used. They must also record what the society still does not know.

A society cannot truly criticise what it cannot inspect.

---

## Example settlement

```yaml
settlement_id: settlement.supplier-invoice.2026-001
stimulus: event.invoice.price-increase-detected.evt-042
stimulus_type: invoice.price-increase-detected
timestamp: 2026-05-07T09:15:42Z
governing_frame: frame.supplier-price-review
analogies_used: []

activated:
  - agency: agency.supplier-bee
    weight: 0.95
  - agency: agency.finance-watch
    weight: 0.84
inhibited:
  - agency: agency.contract-bee
    weight_delta: -0.20
    reason: contract review is usually noise for simple price spikes

proposals:
  - from: agency.finance-watch
    proposal: Compare the new price against the last 12 months and prepare a summary.
    evidence:
      - semantic.suppliers.supplier-x-history
      - episodic.2026.05.evt-042
    method: retrieval
    confidence: 0.87
    alternatives_considered:
      - Immediate owner escalation without comparison
    observability_limits:
      - No competitor quote yet available
    opaque_model_dependencies: []
    cited_procedures:
      - procedure.supplier.price-review
    cited_decisions:
      - settlement.supplier-invoice.2025-011
    cited_ideals:
      - evidence-before-confidence
    introspection:
      unknowns:
        - Whether the increase reflects a temporary surcharge
      blind_spots:
        - No live market quote
      explanation_quality: high
```

---

## Source notes

- **Minsky 1986** grounds visible settlements and competing proposals.
- **Minsky 1988** motivates better inhibition, alternatives, and developmental caution.
- **2025 Society of Minds research** motivates introspection, provenance depth, and dialogical quality metrics.
