# Procedural Memory

Procedural memory records how to do things — standard procedures that the society has learned and refined through practice.

---

## Schema

```yaml
# procedural/{domain}/{procedure-id}.yaml

procedure_id: string
domain:       string
title:        string
context:      when this procedure applies
steps:
  - step: 1
    description: First step description
  - step: 2
    description: Second step description
notes:        optional caveats or exceptions
established_date: ISO 8601
last_used:    ISO 8601
last_refined: ISO 8601
memory_temperature: hot | warm | cold | archived
```

---

## Examples

```yaml
procedure_id: proc.tax.bas-preparation
domain: tax
title: BAS Preparation
context: End of each BAS quarter (March, June, September, December)
steps:
  - step: 1
    description: Export bank transactions for the quarter from accounting software.
  - step: 2
    description: Run finance-watch anomaly check on the export.
  - step: 3
    description: Tax-bee generates the structured BAS summary.
  - step: 4
    description: Owner reviews and confirms categories.
  - step: 5
    description: Accountant receives the pack for lodgement.
notes: Owner confirms final figures before accountant submission.
established_date: 2025-09-30T00:00:00Z
last_used: 2026-03-31T00:00:00Z
last_refined: 2026-03-31T00:00:00Z
memory_temperature: hot
```

---

## Usage

Procedural memory is read when a known class of task arrives, allowing the society to follow an established path rather than reason from scratch.

Procedures are refined after each use if the owner identifies improvements or corrections.

---

## Current procedures

| Procedure | Purpose |
|---|---|
| [forgejo-runtime-operations.md](forgejo-runtime-operations.md) | Enable, disable, validate, and govern the Forgejo runtime safely |
