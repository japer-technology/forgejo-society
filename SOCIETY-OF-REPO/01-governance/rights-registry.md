# Rights Registry

The rights registry defines what data each agency in this SOR may read, write, and transmit.

All agencies must operate within the rights declared in this registry. The authority-censor enforces compliance.

---

## Data categories

### Sensitive categories

These categories are subject to the strictest access controls. Any action involving these categories requires explicit policy authorisation and may require human approval.

```yaml
sensitive_categories:
  patient_data:
    description: Any data identifying or relating to individual patients.
    cloud_allowed: never
    external_allowed: never_without_explicit_approval

  financial_records:
    description: Bank statements, invoices, payroll, tax filings, financial reports.
    cloud_allowed: never_for_raw_data
    external_allowed: never_without_explicit_approval

  employment_records:
    description: Staff contracts, performance records, salary information, disciplinary records.
    cloud_allowed: never
    external_allowed: never_without_explicit_approval

  private_contracts:
    description: Business contracts not intended for public disclosure.
    cloud_allowed: summary_only_with_approval
    external_allowed: never_without_explicit_approval

  personal_identification:
    description: Tax file numbers, identity documents, personal addresses, biometrics.
    cloud_allowed: never
    external_allowed: never

  runtime_secrets:
    description: Forgejo tokens, model provider keys, PATs, passwords, webhook secrets, and credentials.
    cloud_allowed: never
    external_allowed: never
```

### Operational categories

These categories support normal SOR operations. Standard access controls apply.

```yaml
operational_categories:
  issues_and_tasks:
    description: Forge issues, task lists, project tracking items.
    cloud_allowed: yes_with_pii_scrubbing
    external_allowed: yes_with_approval

  code_and_documentation:
    description: Source code, technical documentation, READMEs.
    cloud_allowed: yes_unless_marked_private
    external_allowed: yes_unless_marked_private

  settlement_records:
    description: Decision records produced by the SOR.
    cloud_allowed: no
    external_allowed: no_unless_anonymised

  performance_metrics:
    description: Agency accuracy, usefulness, and evaluation data.
    cloud_allowed: anonymised_only
    external_allowed: anonymised_only

  forgejo_runtime_state:
    description: `.forgejo-intelligence/state/` mappings, transcripts, schema versions, migrations, runtime health reports, and redacted event diagnostics.
    cloud_allowed: no
    external_allowed: no_unless_anonymised

  forgejo_runtime_control:
    description: `.forgejo/workflows/`, `.forgejo-intelligence/` surface folders, runtime config, installer choices, and enable sentinel state.
    cloud_allowed: no
    external_allowed: no
```

---

## Path interpretation

Rights in this registry are declared as **logical paths**, not a requirement that every deployment use the same physical repository layout.

For this scaffold:
- `governance/*` maps to `01-governance/*`
- `memory/*` maps to `06-memory/*`
- `workspace/*` maps to `07-workspace/*`
- `service/*` maps to `08-services/*`
- `forgejo/workflows/*` maps to `.forgejo/workflows/*`
- `forgejo/runtime/*` maps to `.forgejo-intelligence/*`
- `forgejo/state/*` maps to `.forgejo-intelligence/state/*`

The following prefixes are agency-local namespaces unless a deployment promotes them into dedicated repos:
- `documents/*`
- `reports/*`
- `tasks/*`
- `logs/*`

This keeps protocol names stable while allowing either a single-repo scaffold or a multi-repo deployment.

---

## Agency read rights

| Agency | May read |
|---|---|
| `intake-bee` | documents/intake, issues/incoming |
| `contract-bee` | documents/contracts, memory/contracts, memory/semantic |
| `tax-bee` | documents/tax, memory/tax, memory/semantic, financial_records (read-only) |
| `staff-bee` | documents/staff, memory/staff, memory/procedural |
| `supplier-bee` | documents/suppliers, memory/suppliers, memory/semantic |
| `finance-watch` | financial_records, memory/financial, memory/semantic |
| `forgejo-ops-steward` | forgejo/workflows, forgejo/runtime, forgejo/state, performance_metrics, governance policies |
| `owner-briefing` | workspace/active-settlements, workspace/current-focus |
| All critics | proposals in global-workspace |
| All censors | all proposals, all active-settlements, governance policies |
| All memory repos | their own memory scope + settlement records |
| `global-workspace` | all active proposals |

---

## Agency write rights

| Agency | May write to |
|---|---|
| `intake-bee` | issues (labels only), workspace/current-focus |
| `contract-bee` | reports/contract-obligations, tasks/owner-review |
| `tax-bee` | reports/tax-obligations, tasks/owner-review |
| `staff-bee` | reports/staff-compliance, tasks/owner-review |
| `supplier-bee` | reports/supplier-analysis, tasks/owner-review |
| `finance-watch` | reports/finance-watch, tasks/owner-review |
| `forgejo-ops-steward` | reports/forgejo-ops, workspace/current-focus, tasks/owner-review |
| `owner-briefing` | workspace/owner-briefings |
| Critics | objections in global-workspace |
| Censors | blocks in active-settlements, violation-log |
| `episodic-memory` | memory/episodic |
| `semantic-memory` | memory/semantic |
| `procedural-memory` | memory/procedural |
| `failure-memory` | memory/failure |
| `klines` | memory/klines (governance authority required) |
| `active-settlements` | workspace/active-settlements |

---

## Transmit rights

No agency may transmit data outside the local SOR unless:

1. The data category is listed as `cloud_allowed` or `external_allowed` in the table above
2. An explicit policy authorisation exists in the policy ledger
3. Human approval has been granted (for sensitive categories)
4. The cloud-egress-censor has confirmed the transmission is permitted

All transmissions are logged with:
- sending agency
- destination
- data category classification
- authorising policy
- timestamp

Runtime secrets are never transmit-eligible. They may be referenced by secret
name only, never copied into prompts, issues, comments, wiki pages, workflow
logs, memory records, or committed state.

---

## Rights amendment

Rights may only be expanded through:
1. A PR proposing the change
2. Owner review and approval
3. A corresponding update to the policy ledger

Rights may never be expanded by an agency's own action.
