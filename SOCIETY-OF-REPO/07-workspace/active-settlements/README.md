# Active Settlements

Active settlements holds all settlements that are in progress: forming, pending approval, authorised, or executing.

Completed settlements are archived to [../06-memory/decisions/](../06-memory/decisions/).

---

## Structure

```
active-settlements/
  {settlement-id}.yaml
```

---

## Settlement states in this repo

| State | Meaning |
|---|---|
| `forming` | Proposals being submitted; criticism and censorship in progress |
| `pending_approval` | Settlement formed; waiting for human approval |
| `authorised` | Approved and ready for execution |
| `executing` | Action in progress |

When a settlement reaches `completed`, `failed`, `blocked`, or `cancelled`, it is moved to decisions/.

---

## Example

See [../02-protocols/05-settlement.md](../02-protocols/05-settlement.md) for the full settlement schema and an example record.
