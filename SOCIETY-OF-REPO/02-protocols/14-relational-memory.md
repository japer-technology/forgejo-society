# Relational Memory Protocol

Typed memory silos are useful, but they are not enough.

Durable cognition also needs explicit links between records.

---

## Required link types

Every durable record may declare links such as:
- `caused-by`
- `supports`
- `contradicts`
- `specialized-from`
- `analogous-to`
- `supersedes`
- `activated-by`
- `derived-from`

---

## Traversal rules

1. Start with the governing frame or cited decision.
2. Traverse only links relevant to the task.
3. Prefer hot and warm artifacts first.
4. Escalate to cold or archived artifacts only when justified.
5. Record the traversal path when it materially influenced a proposal.

---

## Storage model

SOR keeps YAML and Git.

Relational memory adds link semantics, not a replacement datastore.

---

## Source notes

This protocol is mainly an incorporation of the association-heavy memory assumptions present in Minsky and made more explicit by the 2025 Society of Minds work.
