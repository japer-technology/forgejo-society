# Censors

Censor repos enforce hard limits. They do not argue on merit. They block unconditionally.

---

## Why censors exist

Some limits must hold regardless of the argument for violating them.

A critic can be persuaded. Evidence can be provided. An objection can be resolved.

A censor cannot be persuaded. There is no argument that overrides a censor. The limit is the limit.

Censors exist because some failures are not recoverable:
- Sensitive data sent to a cloud service cannot be retrieved
- A legal commitment made without authority cannot be easily undone
- A payment above the limit has real financial consequences
- A delegation chain that violates authority limits creates unaccountable action

Censors are the constitution enforced in code.

---

## Censor catalogue

| Censor | What it blocks |
|---|---|
| [cloud-egress-censor](cloud-egress-censor/README.md) | Data transmission to external services without policy authorisation |
| [authority-censor](authority-censor/README.md) | Actions that exceed an agency's authority level or bypass the approval gate |
| [payment-censor](payment-censor/README.md) | Payments and financial commitments above the defined spending limit |
| [delegation-depth-censor](delegation-depth-censor/README.md) | Delegation chains longer than 3 hops |

---

## Censor behaviour

When a censor blocks a proposal:

1. The block is applied immediately and unconditionally
2. A `block.applied` event is emitted
3. The block is recorded in the active-settlements record
4. The owner-briefing is notified of the block
5. The censor's violation log is updated

A censor never silently swallows a block.

---

## Censor authority

Censors hold `act` authority — the only agencies with this level apart from owner-briefing.

This authority is tightly scoped: censors may only write to the blocks section of settlements and to their own violation log.

Censors may not modify governance documents.
