# K-lines in Society of Repo

A **K-line** is a remembered activation pattern.

It records:

> “When a situation like this appears again, wake these agencies, memories, critics, censors, habits, and models in this pattern.”

In **Society of Repo**, K-lines are how the system develops instincts.

They are not memories of facts.
They are memories of **what mental state was useful**.

---

# 1. What a K-line is

A K-line is a versioned file, usually stored in a memory repo:

```text
memory/klines/
  supplier-price-increase.yaml
  tax-pack-missing-documents.yaml
  staff-contract-probation-review.yaml
  jwt-auth-regression.yaml
```

Each K-line contains:

```yaml
id: kline.supplier-price-increase
version: 1

purpose: >
  Reactivate the useful agency pattern for detecting and responding
  to supplier price increases.

trigger:
  features:
    document_type.supplier_invoice: ">= 0.80"
    recurring_supplier: ">= 0.70"
    price_increase_detected: ">= 0.60"

activates:
  supplier-bee: 0.95
  finance-watch-bee: 0.85
  contract-bee: 0.70
  owner-briefing-bee: 0.75
  cost-critic: 0.80

suppresses:
  marketing-bee: 0.60
  staff-bee: 0.50

habits:
  - compare_against_last_6_months
  - check_contract_price_terms
  - prepare_owner_question

censors:
  - cloud-egress-censor
  - payment-censor

memory_refs:
  - episode.supplier-price-rise.2026-02
  - settlement.supplier-renegotiation.2026-03

stats:
  activations: 14
  successful_activations: 10
  false_activations: 2
  neutral_activations: 2
  precision: 0.71

reinforcement:
  strengthen_when:
    - owner_marks_useful
    - saving_identified
    - contract_renegotiated
  weaken_when:
    - false_alarm
    - irrelevant_activation
    - owner_dismisses
```

This K-line does not do the work itself.

It wakes the right parts of the society.

---

# 2. How K-lines are created

There are four main ways.

---

## A. Created from a successful settlement

This is the most important path.

Something happens:

```text
Supplier invoice arrives.
Finance bee notices prices are up.
Contract bee checks supplier terms.
Cost critic asks for comparison.
Owner bee prepares a summary.
Owner renegotiates.
Business saves money.
```

The outcome is marked useful.

The memory bee asks:

> “Was this activation pattern worth remembering?”

If yes, it creates a K-line.

### Creation flow

```text
stimulus
→ activation
→ agencies respond
→ settlement
→ action
→ good outcome
→ memory bee extracts pattern
→ K-line proposed
→ K-line reviewed
→ K-line committed
```

Example:

```yaml
kline_candidate:
  source_settlement: settlement.supplier-renegotiation.2026-03
  reason: Same activation pattern produced useful business action.
  proposed_trigger:
    document_type.supplier_invoice: ">= 0.80"
    price_increase_detected: ">= 0.60"
  proposed_activations:
    supplier-bee: 0.95
    finance-watch-bee: 0.85
    contract-bee: 0.70
    cost-critic: 0.80
```

Then a governance or memory agency approves it.

The K-line becomes a committed file.

---

## B. Created from repeated similar events

Sometimes there is no single dramatic success. Instead, the system sees a recurring pattern.

Example:

```text
Every month, staff certificates, licences, insurance, or training records approach expiry.
```

The memory bee notices repeated settlements:

```text
expiry warning
staff bee wakes
compliance bee wakes
deadline bee wakes
owner bee wakes
```

It proposes:

```yaml
id: kline.expiring-staff-compliance-document

trigger:
  features:
    document_type.staff_record: ">= 0.60"
    expiry_date_detected: ">= 0.80"
    expiry_within_days_45: true

activates:
  staff-bee: 0.90
  compliance-bee: 0.85
  deadline-bee: 0.95
  owner-briefing-bee: 0.60
```

This is pattern-mining.

The system says:

> “We keep solving this the same way. Save the mental state.”

---

## C. Created manually by a human

A human can create a K-line directly.

Example:

The office manager says:

> “Whenever we upload a lease or insurance policy, I want contract bee, obligation bee, risk bee, and owner bee to wake up.”

They create:

```yaml
id: kline.important-business-contract-uploaded

trigger:
  features:
    document_type.contract: ">= 0.80"
    high_business_impact: ">= 0.60"

activates:
  contract-bee: 0.95
  obligation-bee: 0.95
  risk-bee: 0.85
  owner-briefing-bee: 0.80

censors:
  - cloud-egress-censor

requires_settlement: true
```

Manual K-lines are useful early, before the system has much history.

---

## D. Created by importing a service or template

A specialist SOR may provide K-line packs.

Example:

```text
small-business-admin-klines
dental-practice-klines
farm-compliance-klines
rental-property-klines
tax-time-klines
```

A tax specialist SOR might sell or share:

```yaml
id: kline.eofy-accountant-pack-preparation
```

Your SOR imports it, but does not trust it blindly.

Imported K-lines should start in probation:

```yaml
status: probation
activation_multiplier: 0.40
requires_human_review: true
```

Over time, if they work, they strengthen.

---

# 3. When K-lines are used

K-lines are used after perception but before agency execution.

The runtime loop looks like this:

```text
1. stimulus arrives
2. perception extracts features
3. K-line matcher compares features to K-lines
4. matching K-lines activate agencies
5. agencies produce proposals
6. critics and censors respond
7. settlement authorises action
8. outcome updates K-line strength
```

Example stimulus:

```yaml
stimulus:
  type: document.uploaded
  file: supplier_invoice_april.pdf
```

Perception extracts:

```yaml
features:
  document_type.supplier_invoice: 0.94
  recurring_supplier: 0.88
  price_increase_detected: 0.72
  amount_large_for_business: 0.61
```

The K-line matcher finds:

```yaml
matched_klines:
  - id: kline.supplier-price-increase
    match_score: 0.86
  - id: kline.duplicate-invoice-risk
    match_score: 0.41
```

Only the first passes threshold.

It activates:

```yaml
activation_plan:
  activated_by:
    - kline.supplier-price-increase

  agencies:
    supplier-bee: 0.95
    finance-watch-bee: 0.85
    contract-bee: 0.70
    owner-briefing-bee: 0.75

  critics:
    cost-critic: 0.80
    evidence-critic: 0.55

  censors:
    cloud-egress-censor: 1.00
```

Now the society knows what kind of mental posture to take.

---

# 4. K-line matching

A K-line matches when the current feature pattern is close enough to its trigger pattern.

A simple scoring formula:

```text
match_score =
  weighted_feature_match
  × confidence
  × freshness
  × policy_validity
```

Example:

```yaml
trigger:
  features:
    document_type.supplier_invoice:
      threshold: 0.80
      weight: 0.35

    recurring_supplier:
      threshold: 0.70
      weight: 0.25

    price_increase_detected:
      threshold: 0.60
      weight: 0.40
```

Current features:

```yaml
document_type.supplier_invoice: 0.94
recurring_supplier: 0.88
price_increase_detected: 0.72
```

All pass.

So the K-line activates.

If one feature is missing, the K-line may still partially activate if the score is high enough.

---

# 5. K-lines do not decide actions

This is important.

A K-line does **not** say:

> “Do this.”

It says:

> “Wake these parts of the society.”

The agencies still need to propose.
The critics still need to object.
The censors still need to block unsafe paths.
The settlement still needs to authorise action.

So a K-line is not an automation rule.

It is closer to an instinct.

Bad:

```text
K-line says supplier price increased → automatically email supplier.
```

Good:

```text
K-line says supplier price increased → wake supplier bee, finance bee, contract bee, cost critic, owner bee.
```

Then settlement decides what to do.

---

# 6. K-line lifecycle

A K-line has a lifecycle.

```text
candidate
→ probation
→ active
→ strong
→ stale
→ retired
```

## Candidate

Proposed but not trusted.

```yaml
status: candidate
```

## Probation

Can activate, but weakly.

```yaml
status: probation
activation_multiplier: 0.40
requires_review: true
```

## Active

Trusted enough for normal use.

```yaml
status: active
activation_multiplier: 1.00
```

## Strong

Repeatedly useful.

```yaml
status: strong
activation_multiplier: 1.20
```

## Stale

Old, rarely useful, or less relevant.

```yaml
status: stale
activation_multiplier: 0.30
```

## Retired

Preserved but no longer activates.

```yaml
status: retired
activation_multiplier: 0.00
```

Retired K-lines should remain in Git history. They are not deleted.

---

# 7. Reinforcement

After each use, the system asks:

> Did this K-line help?

Outcome signals include:

```text
human marked useful
settlement succeeded
money saved
deadline met
PR accepted
error prevented
false alarm
owner dismissed
policy violation
irrelevant activation
```

Then the K-line updates.

Example:

```yaml
reinforcement_event:
  kline: kline.supplier-price-increase
  outcome: useful
  evidence:
    - owner_marked_useful
    - supplier_credit_received
  adjustment:
    strength: +0.04
    successful_activations: +1
```

If bad:

```yaml
reinforcement_event:
  kline: kline.supplier-price-increase
  outcome: false_activation
  evidence:
    - price_change_was_tax_only
    - owner_dismissed
  adjustment:
    strength: -0.06
    false_activations: +1
```

Use slow updates.

Do not let one event radically change the K-line.

---

# 8. K-line strength

Each K-line should have a strength value.

```yaml
strength: 0.74
```

This affects activation.

A strong K-line wakes agencies more easily.

A weak K-line only wakes them when the match is very clear.

Example:

```text
effective_activation = match_score × strength × freshness
```

If:

```text
match_score = 0.86
strength = 0.74
freshness = 0.90
```

Then:

```text
effective_activation = 0.86 × 0.74 × 0.90 = 0.57
```

If activation threshold is `0.50`, it fires.

---

# 9. K-line freshness and decay

K-lines should decay if unused or contradicted.

Example:

```yaml
decay:
  half_life_days: 180
  decay_if_unused: true
  preserve_if_compliance_related: true
```

A K-line about an old supplier may become stale if the supplier contract changes.

A K-line about tax obligations may remain important but should be reviewed yearly.

A K-line about software debugging may decay faster if the codebase changes.

Decay does not delete memory.
It lowers activation.

---

# 10. K-lines can suppress as well as activate

K-lines are not only “wake this.”

They can also say:

> “Do not bother waking that.”

Example:

```yaml
id: kline.tax-document-uploaded

trigger:
  features:
    document_type.tax_record: ">= 0.80"

activates:
  tax-bee: 0.95
  accountant-pack-bee: 0.80
  finance-watch-bee: 0.75

suppresses:
  marketing-bee: 0.90
  staff-training-bee: 0.70
  customer-comms-bee: 0.85
```

This prevents noise.

A good mind is not only what wakes.
It is also what stays asleep.

---

# 11. K-lines can activate censors

This is essential.

Example:

```yaml
id: kline.patient-record-detected

trigger:
  features:
    patient_data: ">= 0.70"

activates:
  privacy-censor: 1.00
  clinical-governance-bee: 0.90

censors:
  - cloud-egress-censor
  - external-sharing-censor

rules:
  cloud_allowed: false
  human_approval_required: true
```

This means sensitive context automatically wakes protective systems.

---

# 12. K-lines can activate external Society services

A K-line may say:

> “This looks like a case where we often need outside specialist help.”

Example:

```yaml
id: kline.complex-lease-review

trigger:
  features:
    document_type.lease: ">= 0.80"
    high_value_contract: ">= 0.70"
    unusual_clause_detected: ">= 0.60"

activates:
  contract-bee: 0.95
  risk-bee: 0.85
  owner-briefing-bee: 0.80

possible_external_services:
  - sor.service.lease-obligation-review.v1

external_service_policy:
  auto_call: false
  requires_owner_approval: true
  send_redacted_summary_only: true
```

The K-line does not call the service itself.

It makes the option visible.

---

# 13. Full example: tax-time K-line

Suppose the office manager uploads EOFY documents.

Features:

```yaml
features:
  tax_period_end: 0.95
  payroll_summary: 0.88
  asset_purchase_list: 0.72
  accountant_request_detected: 0.84
```

K-line:

```yaml
id: kline.eofy-accountant-pack

trigger:
  features:
    tax_period_end: ">= 0.80"
    accountant_request_detected: ">= 0.60"

activates:
  tax-bee: 0.95
  finance-watch-bee: 0.85
  payroll-bee: 0.75
  asset-register-bee: 0.75
  owner-briefing-bee: 0.80
  accountant-pack-bee: 0.95

critics:
  missing-document-critic: 0.90
  classification-critic: 0.80

censors:
  tax-file-number-censor: 1.00
  cloud-egress-censor: 1.00

habits:
  - collect_payroll_summary
  - identify_asset_purchases
  - flag_unusual_expenses
  - prepare_accountant_questions
  - produce_missing_document_list

possible_external_services:
  - sor.service.tax-pack-review.v1

settlement_preferences:
  prefer_local_processing: true
  require_owner_review_before_accountant_send: true
```

Used result:

```md
EOFY Accountant Pack Draft

Ready:
- payroll summary
- invoice index
- P&L summary
- insurance documents

Missing:
- June bank statement
- equipment finance document
- superannuation payment confirmation

Questions:
- How should scanner lease be treated?
- Should repair invoice be capitalised?
```

Outcome:

```yaml
outcome:
  accountant_accepted_pack: true
  missing_docs_reduced: true
  owner_marked_useful: true
```

K-line strengthens.

---

# 14. Full example: household K-line

Trigger:

```text
home insurance renewal arrives
```

K-line:

```yaml
id: kline.home-insurance-renewal

trigger:
  features:
    document_type.insurance_policy: ">= 0.80"
    renewal_notice: ">= 0.70"

activates:
  insurance-bee: 0.95
  household-finance-bee: 0.75
  obligation-bee: 0.80
  owner-briefing-bee: 0.85

critics:
  coverage-change-critic: 0.90
  price-increase-critic: 0.80

habits:
  - compare_last_year_premium
  - check_excess_change
  - check_coverage_exclusions
  - create_renewal_deadline
```

It outputs:

```md
Home Insurance Renewal Summary

Premium increased 17%.
Excess changed from $700 to $1,000.
Storm damage wording changed.
Renewal date: June 12.
Suggested: compare alternatives before June 1.
```

That is a simple but highly useful K-line.

---

# 15. Difference between K-lines, habits, and memories

They are related but not the same.

## Memory

Stores what happened or what is known.

```text
Supplier X raised prices in March.
```

## Habit

Stores a useful action sequence.

```text
When supplier price rises, compare last six months and check contract terms.
```

## K-line

Stores what to wake.

```text
When supplier price rises, activate supplier bee, finance bee, contract bee, cost critic, owner bee.
```

The K-line is the activation pattern.

The habit is the action pattern.

The memory is the evidence/history.

---

# 16. Best practice for creating K-lines

## Keep them specific

Good:

```text
supplier price increase on recurring invoice
```

Bad:

```text
business problem
```

## Make triggers observable

Good:

```yaml
price_increase_detected: ">= 0.60"
```

Bad:

```yaml
seems important: true
```

## Activate small agencies

Good:

```text
contract-bee
cost-critic
owner-briefing-bee
```

Bad:

```text
master-business-agent
```

## Include censors early

Sensitive situations should wake protection.

## Track outcomes

No K-line should live forever without metrics.

## Let humans pin critical K-lines

Some K-lines should not decay automatically.

Example:

```text
patient data detected
payroll data detected
tax file number detected
legal contract detected
```

---

# 17. Failure modes

## Overgeneral K-lines

They wake too often.

Fix:

```text
tighten triggers
raise thresholds
add suppressions
```

## Stale K-lines

They reflect old business reality.

Fix:

```text
decay
review
retire
```

## Noisy K-lines

They wake too many agencies.

Fix:

```text
reduce activations
add activation budget
suppress irrelevant bees
```

## Dangerous K-lines

They automate too much.

Fix:

```text
K-lines should activate, not execute
require settlement
add censors
```

## Imported bad K-lines

External templates may not fit.

Fix:

```text
probation mode
low strength
human review
local adaptation
```

---

# 18. The exact creation algorithm

A practical algorithm:

```text
1. Record every settlement.
2. Record agencies activated during the settlement.
3. Record outcome.
4. If outcome is useful, extract common features from stimulus.
5. Compare to existing K-lines.
6. If existing K-line matches, reinforce it.
7. If no existing K-line matches, create K-line candidate.
8. Run candidate in shadow mode for future similar events.
9. If candidate performs well, promote to active.
10. If it performs poorly, weaken or retire.
```

Pseudo-code:

```python
def process_outcome(settlement, outcome):
    features = settlement.stimulus_features
    activation_pattern = settlement.activated_agencies
    useful = score_outcome(outcome)

    matching_kline = find_matching_kline(features, activation_pattern)

    if matching_kline:
        update_kline_strength(matching_kline, useful)
        return

    if useful >= 0.75:
        candidate = create_kline_candidate(
            features=extract_minimal_trigger(features),
            activates=extract_useful_agencies(settlement),
            suppresses=extract_suppressed_agencies(settlement),
            memory_refs=[settlement.id],
            status="candidate"
        )
        submit_for_review(candidate)
```

---

# 19. The exact use algorithm

```text
1. Receive stimulus.
2. Extract features.
3. Load active and probation K-lines.
4. Score each K-line against features.
5. Discard those below threshold.
6. Combine activations from matching K-lines.
7. Apply suppressions.
8. Apply activation budgets.
9. Wake selected agencies, critics, censors, and habits.
10. Record which K-lines influenced the settlement.
```

Pseudo-code:

```python
def activate_from_stimulus(stimulus):
    features = perceive(stimulus)

    matches = []
    for kline in load_klines():
        score = match(kline.trigger, features)
        effective = score * kline.strength * freshness(kline)

        if effective >= kline.activation_threshold:
            matches.append((kline, effective))

    activation_plan = combine(matches)
    activation_plan = apply_suppressions(activation_plan)
    activation_plan = apply_budgets(activation_plan)
    activation_plan = apply_censors(activation_plan)

    record_activation(stimulus, features, matches, activation_plan)

    return activation_plan
```

---

# 20. The key principle

A K-line is not a rule.

A rule says:

> “If X, do Y.”

A K-line says:

> “If X, restore this useful state of mind.”

That is the whole point.

In Society of Repo:

> **K-lines are versioned instincts.**

They let the society remember not just facts, but **how to become useful again** when a familiar situation returns.
