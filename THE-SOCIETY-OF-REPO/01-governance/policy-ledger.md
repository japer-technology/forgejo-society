# Policy Ledger

Active policies governing this Society of Repo.

All policies are versioned and dated. Superseded policies are retained for audit purposes.

---

## Format

Each policy entry follows this schema:

```yaml
policy_id: pol.NNN
title: Human-readable title
category: category name
version: N
status: active | superseded | archived
effective_date: YYYY-MM-DD
supersedes: policy_id or none
rationale: Why this policy exists.
rule: The policy rule in plain language.
enforcement: Which censor or mechanism enforces this.
```

---

## Active policies

### Cloud model access

```yaml
policy_id: pol.001
title: Cloud model access — default forbidden
category: model_access
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Data sovereignty requires that sensitive business data does not leave the
  local system by default. Cloud model calls must be an explicit governed choice.
rule: >
  No agency may call an external cloud model API by default.
  Cloud model access requires a task-class-specific authorisation listed in
  this ledger (see pol.002+) or explicit owner approval for the specific call.
enforcement: cloud-egress-censor
```

```yaml
policy_id: pol.002
title: Cloud model — code review escalation permitted
category: model_access
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Security-critical code review may require frontier model capability not
  available locally. A controlled escalation path is needed.
rule: >
  Agencies performing code review may escalate to cloud models for
  security-critical review tasks only, provided:
  (a) the code does not contain sensitive business data (patient, financial, employment),
  (b) the escalation is recorded in the settlement,
  (c) the cloud provider is on the approved providers list.
enforcement: cloud-egress-censor, settlement-protocol
approved_providers: []  # to be populated when providers are approved
```

### Spending limits

```yaml
policy_id: pol.010
title: Agency spending limit
category: financial
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Agencies must not be able to commit funds without human oversight.
rule: >
  No agency may initiate, authorise, or commit any payment or purchase above
  AUD 500.00 per transaction without explicit owner approval recorded in an issue.
enforcement: payment-censor, approval-gate
```

```yaml
policy_id: pol.011
title: SOR service contract spending limit
category: financial
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  External SOR service contracts represent ongoing financial commitments.
  Owner oversight is required above a threshold.
rule: >
  No service contract with a total value above AUD 1,000.00 may be entered
  into without explicit owner approval.
enforcement: payment-censor, approval-gate
```

### Delegation depth

```yaml
policy_id: pol.020
title: Maximum delegation depth
category: authority
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Deep delegation chains obscure accountability and allow authority to diffuse
  beyond its intended scope.
rule: >
  No delegation chain — the sequence of agencies that requested and sub-delegated
  a task — may exceed 3 hops. The originating stimulus is hop 0.
enforcement: delegation-depth-censor
```

### Memory retention

```yaml
policy_id: pol.030
title: Memory temperature decay
category: memory
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Without decay, memory repos accumulate noise that degrades K-line matching
  and owner briefing quality.
rule: >
  Memory records are assigned a temperature on creation: hot, warm, cold, or archived.
  Hot records not reinforced within 30 days are downgraded to warm.
  Warm records not reinforced within 90 days are downgraded to cold.
  Cold records not reinforced within 365 days are archived.
  Archived records are preserved but not actively matched against stimuli.
enforcement: memory-protocol, quarterly-evolution-review
```

### Human approval

```yaml
policy_id: pol.040
title: Approval gate enforcement
category: governance
version: 1
status: active
effective_date: 2026-05-07
supersedes: none
rationale: >
  Constitutional actions require human authority. This cannot be waived by any agency.
rule: >
  All actions listed in the approval-gate must receive explicit human approval
  before execution. No settlement may authorise these actions without a
  recorded human approval event.
enforcement: authority-censor, approval-gate
```

### Forgejo runtime operations

```yaml
policy_id: pol.050
title: Forgejo runtime fail-closed operations
category: forgejo_runtime
version: 1
status: active
effective_date: 2026-05-10
supersedes: none
rationale: >
  The Society of Repo runs inside Forgejo through write-capable Actions,
  surfaces, API tokens, and committed state. Runtime capability must be visible,
  narrow, reversible, and governed.
rule: >
  The Forgejo runtime may run only when the enable sentinel exists, the event
  maps to an active surface folder, the guardrail passes, and the requested
  write stays inside rights, censor, settlement, and approval boundaries.
  Restoring the sentinel, adding active surfaces, expanding workflow triggers,
  loosening fork policy, adding provider secrets, or increasing token scope
  requires owner approval through the approval gate. Emergency disablement may
  narrow automation immediately but must be logged and reviewed afterward.
enforcement: authority-censor, credential-censor, cloud-egress-censor, approval-gate, forgejo-environment-protocol
```

---

## Superseded policies

*None yet. Superseded policies will be listed here when active policies are amended.*

---

## Policy amendment procedure

1. Open a PR with the proposed new or amended policy entry
2. Record the rationale for the change in the PR description
3. Owner reviews and approves
4. If the new policy supersedes an existing policy, update the `supersedes` field
5. Merge the PR
6. The effective date is the merge date
