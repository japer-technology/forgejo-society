# Approval Gate

The approval gate is a list of action categories that **always require human approval**, regardless of the authority level of any requesting agency.

No agency in this SOR may bypass the approval gate. The authority-censor enforces this unconditionally.

---

## Hard approval requirements

### Constitutional and governance changes

```yaml
category: constitutional_change
description: Any amendment to the master constitution or any agency constitution.
who_approves: owner
how: PR with owner review and explicit merge approval
```

```yaml
category: authority_level_increase
description: Any increase in an agency's authority level.
who_approves: owner
how: PR with owner review; updated constitution and authority registry required
```

```yaml
category: policy_change
description: Any change to the policy ledger.
who_approves: owner
how: PR with owner review
```

---

### Financial actions

```yaml
category: payment_above_limit
description: Any payment, commitment, or purchase above the defined spending limit.
limit: AUD 500.00 per transaction (adjustable by owner via policy amendment)
who_approves: owner
how: Issue comment with explicit confirmation text
```

```yaml
category: service_contract_above_limit
description: Signing any SOR service contract with a total value above the defined limit.
limit: AUD 1,000.00 per contract
who_approves: owner
how: Issue comment with explicit confirmation text
```

---

### Data egress

```yaml
category: cloud_egress_sensitive
description: >
  Sending any data in sensitive categories (patient data, financial records,
  employment records, private contracts, personal identification) to any
  external service, including cloud model APIs.
who_approves: owner
how: Issue with full data classification and destination declared; explicit owner approval required
```

```yaml
category: external_disclosure
description: >
  Sharing any non-public data outside the local SOR to any external party
  not previously authorised in the rights registry.
who_approves: owner
how: Issue with disclosure scope declared; explicit owner approval required
```

---

### Legal and professional decisions

```yaml
category: legal_commitment
description: >
  Any action that creates a legal obligation on behalf of the owner:
  signing a contract, accepting terms, making a legal representation.
who_approves: owner + legal professional if value above AUD 10,000
how: Issue with commitment scope declared; explicit owner approval required
```

```yaml
category: clinical_decision
description: >
  Any clinical or medical recommendation or action affecting patient care.
who_approves: licensed clinician
how: Never automated; flagged for human clinical review only
```

---

### Employment decisions

```yaml
category: employment_decision
description: >
  Any decision or action affecting employment: hiring, termination, salary change,
  performance review, formal warning.
who_approves: owner
how: Issue with decision scope declared; explicit owner approval required
```

---

### Structural changes to the SOR

```yaml
category: agency_spawn
description: Creating a new agency and adding it to the ecology.
who_approves: owner
how: PR with constitution draft; owner review and merge
```

```yaml
category: agency_retirement
description: Retiring an active agency from the ecology.
who_approves: owner
how: PR with retirement rationale; owner review and merge
```

```yaml
category: external_service_registration
description: Registering a new external SOR or cloud provider.
who_approves: owner
how: PR with service description, rights terms, privacy terms; owner review and merge
```

---

### Forgejo runtime authority

```yaml
category: runtime_enablement_change
description: >
  Restoring the Forgejo runtime enable sentinel, re-enabling a disabled
  workflow, or otherwise allowing write-capable Forgejo automation to run after
  it was stopped.
who_approves: owner
how: PR or settlement record explaining why re-enablement is safe; owner review and merge
```

```yaml
category: surface_activation_change
description: >
  Adding or restoring any `forgejo-intelligent-*` surface folder, changing the
  selected surface set, or enabling a previously retired Forgejo surface.
  Emergency removal of a surface is allowed but must be logged and reviewed.
who_approves: owner
how: PR with surface purpose, triggers, API writes, state files, and test fixtures declared
```

```yaml
category: token_scope_change
description: >
  Increasing the scope of `FORGEJO_TOKEN`, introducing a repository PAT for the
  runtime, adding a new model provider secret, or changing secret mappings in a
  way that expands runtime capability.
who_approves: owner
how: PR or issue with token purpose, minimum scope, expiry/rotation plan, and censor review
```

```yaml
category: workflow_trigger_expansion
description: >
  Adding Forgejo Actions triggers, loosening actor/label/fork conditions, or
  allowing public or fork-originated events to reach write-capable automation.
who_approves: owner
how: PR with threat model, fork policy, public-repo policy, and rollback path
```

---

## How approval is recorded

Human approval is always a **traceable event** in version control:

| Method | When used |
|---|---|
| PR merge by owner | Constitutional changes, policy changes, agency changes |
| Issue comment with confirmation text | Payments, data egress, legal commitments |
| Explicit label applied by owner | Routine approvals with lower stakes |

The settlement record for any action requiring approval must include:
- The approval gate category triggered
- The method of approval
- The timestamp of approval
- The identity of the approving human

---

## Censor enforcement

The [authority-censor](../05-censors/authority-censor/README.md) monitors for any attempt to bypass the approval gate.

Any bypass attempt is:
1. Blocked immediately
2. Recorded in the censor's violation log
3. Surfaced to the owner-briefing immediately
4. Never silently swallowed
