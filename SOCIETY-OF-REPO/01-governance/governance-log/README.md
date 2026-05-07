# Governance Log

The governance log is the permanent archive of governance events.

It records approvals, denials, constitutional changes, policy changes, agency lifecycle changes, and any other event that alters the authority structure of the Society of Repo.

---

## Structure

```
governance-log/
  {year}/
    {event-id}.yaml
```

---

## What is stored here

- `approval.requested`
- `approval.granted`
- `approval.denied`
- `policy.changed`
- `constitution.changed`
- `agency.spawned`
- `agency.retired`

Each record uses the event schema from [../../02-protocols/03-events.md](../../02-protocols/03-events.md), with governance-specific payload fields where needed.

---

## Retention

Governance log entries are permanent audit records.

They are never deleted or temperature-decayed out of audit visibility.
