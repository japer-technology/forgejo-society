# Governance

The governance layer defines the law of the Society of Repo.

Every agency, critic, censor, memory repo, and workspace repo operates under these governance documents.

| Document | Contents |
|---|---|
| [constitution.md](constitution.md) | Master constitution of this SOR — who it is, what it does, what it must not do |
| [authority-registry.md](authority-registry.md) | Which agencies hold which authority levels and what each level permits |
| [approval-gate.md](approval-gate.md) | Actions that always require human approval, regardless of agency authority |
| [rights-registry.md](rights-registry.md) | What data each agency may read, write, and transmit |
| [policy-ledger.md](policy-ledger.md) | All active policies governing the SOR, versioned and dated |

---

## Governance principle

Governance in a Society of Repo is not a bureaucratic overhead.

It is the mechanism that makes the society **trustworthy and improvable.**

Without governance:
- Agencies act without limits
- Decisions have no record
- Memory has no authority
- Cloud calls have no restriction
- Humans cannot intervene

With governance:
- Every agency knows what it may and may not do
- Every important decision is recorded
- Memory is authoritative and correctable
- Cloud calls are explicitly permitted or forbidden
- Humans are constitutional anchors, not optional reviewers

---

## Authority levels

| Level | Name | What it permits |
|---|---|---|
| `read` | Read only | Can read designated repos; cannot write |
| `draft` | Draft only | Can write to designated draft folders; cannot open issues or PRs |
| `propose` | Can propose | Can open issues and PRs; cannot merge or act on production data |
| `act` | Can act | Can execute authorised actions; cannot modify governance or constitutions |
| `govern` | Governance | Can modify governance documents with human co-signature |
| `human` | Human only | Reserved for human actors; no agency may claim this level |

---

## Constitutional anchors

Some decisions are reserved for humans. No agency, at any authority level, may act in these categories unilaterally:

```text
constitutional changes
authority level increases
cloud egress for sensitive data
payment above defined limits
legal commitments
clinical decisions
employment decisions
external disclosure of private data
```

The [approval-gate.md](approval-gate.md) enumerates every action that requires human approval.

---

## Policy versioning

Every policy in the [policy-ledger.md](policy-ledger.md) is dated and versioned.

Old policies are not deleted — they are superseded and archived.

This means the SOR can answer: "What policy governed this action at the time it was taken?"
