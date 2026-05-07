# Decisions

Decisions is the archive of completed settlement records.

Active settlements live in [../07-workspace/active-settlements/](../07-workspace/active-settlements/). When a settlement is completed (state: `completed`, `failed`, `blocked`, or `cancelled`), it is archived here.

---

## Organisation

```
decisions/
  {year}/
    {settlement-id}.yaml
```

---

## Retention

Decisions are permanently preserved.

They are the authoritative audit trail of the society's reasoning.

Memory temperature decay applies to query priority, but decision records are never deleted.

---

## Usage

Decisions are queried when:
- An agency needs context about how a similar situation was handled before
- A critic needs to verify that a proposal is consistent with prior settlements
- A human requests an audit of past decisions
- An evolution review evaluates the quality of past reasoning

---

## Schema

Decision records use the same schema as the settlement protocol. See [../02-protocols/05-settlement.md](../02-protocols/05-settlement.md).
