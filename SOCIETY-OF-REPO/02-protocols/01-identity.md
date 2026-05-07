# Identity Protocol

Every element in a Society of Repo has a stable, machine-readable identity.

Identity is the foundation of accountability, memory matching, and governance enforcement.

---

## ID format

All IDs use dot-separated hierarchical namespaces in lowercase with hyphens for multi-word segments.

```
{scope}.{kind}.{name}[.{version}]
```

---

## Scopes

| Scope | Description | Example |
|---|---|---|
| `sor` | A Society of Repo | `sor.forgejo-mind` |
| `agency` | A worker agency | `agency.contract-bee` |
| `critic` | A critic repo | `critic.evidence` |
| `censor` | A censor repo | `censor.cloud-egress` |
| `memory` | A memory system | `memory.episodic` |
| `workspace` | A workspace repo | `workspace.global` |
| `service` | A published service | `service.contract-extraction.v1` |
| `channel` | A SOR-to-SOR channel | `channel.sor.forgejo-mind.sor.dental-compliance` |
| `kline` | A K-line record | `kline.supplier-price-increase` |
| `settlement` | A settlement record | `settlement.contract-renewal.2026-001` |
| `event` | An event | `event.document.ingested.evt-001` |
| `policy` | A policy | `pol.001` |
| `transaction` | A service transaction | `tx.2026.001` |

---

## Agency IDs

```
agency.{name}

Examples:
  agency.intake-bee
  agency.contract-bee
  agency.tax-bee
  agency.staff-bee
  agency.supplier-bee
  agency.finance-watch
  agency.owner-briefing
```

---

## Critic and censor IDs

```
critic.{name}
censor.{name}

Examples:
  critic.evidence
  critic.scope
  critic.cost
  critic.privacy
  critic.risk
  critic.overconfidence
  censor.cloud-egress
  censor.authority
  censor.payment
  censor.delegation-depth
```

---

## Event IDs

Event IDs are generated at emission time and must be unique.

```
event.{domain}.{type}.{sequence}

Examples:
  event.document.ingested.evt-001
  event.invoice.price-increase-detected.evt-042
  event.staff.certificate-expiry-warning.evt-007
  event.settlement.completed.evt-099
```

---

## Settlement IDs

```
settlement.{domain}.{year}-{sequence}

Examples:
  settlement.contract-renewal.2026-001
  settlement.supplier-invoice.2026-042
  settlement.code-review.2026-007
```

---

## Transaction IDs

```
tx.{year}.{sequence}

Examples:
  tx.2026.001
  tx.2026.042
```

---

## Versioning

Services and protocols include a version segment:

```
service.{name}.v{N}
protocol.{name}.v{N}

Examples:
  service.contract-extraction.v1
  service.tax-pack-review.v2
```

---

## Stability requirement

IDs must be stable once assigned. An ID issued for an agency, settlement, event, or service may not be reassigned to a different entity.

Retiring an agency does not free its ID.

Superseding a service version does not invalidate the old ID — the old version ID remains valid in audit history.
