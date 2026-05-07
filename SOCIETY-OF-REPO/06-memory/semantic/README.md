# Semantic Memory

Semantic memory records what the society knows as general facts — truths that apply across many events and are not tied to one specific episode.

---

## Schema

```yaml
# semantic/{domain}/{fact-id}.yaml

fact_id:      string
domain:       string (contracts | suppliers | staff | finance | tax | operations)
statement:    |
  Plain-language statement of the fact.
confidence:   float (0–1)
evidence:
  - settlement-id or source reference
established_date: ISO 8601
last_reinforced:  ISO 8601
memory_temperature: hot | warm | cold | archived
```

---

## Examples

```yaml
fact_id: fact.suppliers.lease-renewal-date
domain: contracts
statement: |
  The practice lease renews every 1 July.
confidence: 1.0
evidence:
  - settlement.contract-renewal.2025-001
established_date: 2025-07-01T00:00:00Z
last_reinforced: 2026-05-01T00:00:00Z
memory_temperature: hot
```

```yaml
fact_id: fact.suppliers.x-billing-cycle
domain: suppliers
statement: |
  Supplier X invoices monthly, typically in the first week of the month.
confidence: 0.95
evidence:
  - settlement.supplier-invoice.2025-003
  - settlement.supplier-invoice.2025-011
established_date: 2025-03-01T00:00:00Z
last_reinforced: 2026-04-07T00:00:00Z
memory_temperature: hot
```

---

## Usage

Semantic memory is read by agencies during the agency-response phase to provide context for their analysis.

It is updated when a new stable fact is established by a completed settlement, or when an existing fact is reinforced or corrected.
