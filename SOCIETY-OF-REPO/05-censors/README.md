# Censors and Suppressors

Censor and suppressor repos enforce hard limits. They do not argue on merit. They block unconditionally.

Following Minsky 1986, this realm distinguishes two firing stages:

| Mechanism | Where it fires | What it stops | Cost |
|---|---|---|---|
| **Censor** | *Upstream* — before an agency runs, or before a known-bad reasoning path is entered | The path that would have produced the harmful output | Cheap once trained; requires recognising bad *patterns of activity*, not bad outputs |
| **Suppressor** | *Output stage* — after an agency has produced a candidate output, before that output crosses an effect boundary | The candidate output itself | Cheap to add; reactive; requires only recognising the wrong output |

A society that has only one of the two is missing one of its learning signals. Censors handle recurring patterns. Suppressors handle residual surprises.

> **Minsky:** "Censors don't suppress the bad ideas themselves; they suppress whatever processes were about to produce those ideas."

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

## Why suppressors exist separately

A working censor leaves no trace — its only signal is the *absence* of a class of mistake (Insight I5, censor invisibility). That invisibility is exactly what makes residual escapes dangerous: when a censor misses, nothing else upstream is going to catch the failure.

A suppressor is the boundary catch. Its job is narrower than a censor's:

- it does not need to know *why* the path was bad;
- it only needs to recognise the *output* as one of a known wrong class;
- it must fire *before* the output crosses an effect boundary (a Forgejo write, a payment call, an outbound message, a memory promotion).

Suppressors are also the cheapest place to capture new failure data. When a suppressor fires on something the censor layer did not catch, that firing is a structural learning event: the censor catalogue is incomplete, and the missing pattern is now visible.

---

## Censor catalogue

| Censor | What it blocks |
|---|---|
| [cloud-egress-censor](cloud-egress-censor/README.md) | Data transmission to external services without policy authorisation |
| [authority-censor](authority-censor/README.md) | Actions that exceed an agency's authority level or bypass the approval gate |
| [payment-censor](payment-censor/README.md) | Payments and financial commitments above the defined spending limit |
| [delegation-depth-censor](delegation-depth-censor/README.md) | Delegation chains longer than 3 hops |
| [credential-censor](credential-censor/README.md) | Exposure of secrets, API keys, passwords, or tokens in any output or log |
| [pii-exfiltration-censor](pii-exfiltration-censor/README.md) | Personal identifying information leaving the local-access boundary without authorisation |

---

## Suppressor catalogue

Suppressors live alongside censors. They mirror the censor catalogue but bind at the *output* boundary, not at the path.

| Suppressor | What it catches | Boundary it guards |
|---|---|---|
| `cloud-egress-suppressor` | Outbound payloads that contain marked-sensitive content the cloud-egress censor failed to interdict upstream | Network egress |
| `payment-suppressor` | Payment instructions whose final amount or recipient differs from the settlement record | Payment system call |
| `pii-suppressor` | Outputs that contain unredacted PII before they reach a low-trust surface | Issue/PR/email/wiki write |
| `credential-suppressor` | Outputs that contain candidate secrets before any commit, log, or comment | Any external write |
| `forgejo-write-suppressor` | Forgejo API writes whose target, surface, or scope diverges from the authorised settlement | Forgejo API adapter |

Every suppressor firing must be logged with:
- the candidate output (redacted as needed)
- the upstream censor it caught for (if any)
- the agency that produced the output
- the boundary it would have crossed
- a `learning_proposal` field naming the censor or rule that *should* have caught the path earlier

A suppressor that fires repeatedly is evidence that the censor layer needs extension. The pattern caught by the suppressor becomes a candidate for promotion into a censor.

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

Censors hold `act` authority, but their write scope is tightly restricted: censors may only write to the blocks section of settlements and to their own violation log.

Other agencies that hold `act` authority (such as `owner-briefing`, memory agencies, and workspace agencies) are scoped to different write targets, declared in the [authority registry](../01-governance/authority-registry.md).

Censors may not modify governance documents.
