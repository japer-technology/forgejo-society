# Section 21.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.1.md](som-21.1.md) — *The pronouns of the mind*
(Minsky, §21.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.1 opens the *Trans-frames* chapter with the claim that a pronoun
does not stand for a phrase but for a *currently aroused partial state
of mind*. The listener does not look up a word; she examines a fragment
already active. The section closes by naming such handles *pronomes*.

---

## The ideas Section 21.1 actually carries

1. **Pronouns are handles for active mental states.** Words like *it*
   and *this* point at fragments already aroused in the listener, not
   at earlier phrases.
2. **Disambiguation by agency-local refusal.** *Buy Jane* fails not
   because grammar forbids it but because the Buy agency cannot accept
   the thought of buying a person. Conflict at one agent escalates
   upward.
3. **Defaults from current context.** *Find* will look for a block when
   it is already working for Builder, because its sub-agents inherit
   the description in play.
4. **Pronomes generalise beyond language.** The same handle-mechanism
   operates in every higher-level function, not only in speech.
5. **Handles are first-class machinery.** Pronomes are introduced as
   structural objects, not as syntactic shorthand.

---

## What the implementation already absorbs

- **Active state is named and addressable.** Every record carries a
  `stimulus_id`
  ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
  and the workspace pins one stimulus at a time in
  `workspace/current-focus/current.md`
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
  That single pinned stimulus is the structural ancestor of *it*.
- **Agency-local refusal.** A handoff may carry
  `objections[].blocking=true`
  ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
  and short-circuit the cycle; censors in `07-policies-and-safety.md`
  refuse outright. This corresponds to Buy refusing to accept Jane.
- **Contextual defaults via polynemes.**
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  lets a polyneme bias frame selection and excite agencies, so an
  active context modifies what a later step looks for, without that
  later step being told.

## What the implementation does not yet take into account

### A — No pronome as a typed handle

A pronome is meant to be a *named slot whose value is whichever
fragment is currently aroused*. The plan has frame slots
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but slots are filled by named agencies, not by *whatever happens to be
in attention*. There is no `pronome:` field, no registry of standard
handles such as Object or Actor.

### B — Escalation on conflict is loop-level, not agency-local

Buy's refusal is local: the agent itself rejects the thought. In the
plan, refusal arrives through critics and censors, after the
deliberation pass
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The cheaper, *type-mismatch-at-the-agent* refusal is not represented.

### C — Default fill from inherited context

*Find under Builder* inherits the description in play. The
implementation has frame defaults and polyneme excitation, but no
explicit *inherit-from-parent-frame* mechanic. A nested or chained
frame begins with empty slots.

### D — Pronouns in non-language thought are unmodelled

Idea 4 (pronomes operate in all higher functions) has no analogue.
Internal records refer to things by full identifier, never by *it*.
This is defensible (audit clarity favours full names) but should be
noted as a deliberate departure from Minsky's claim.

---

## Summary table

| # | Idea from §21.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Pronouns as handles for active state | Partial | `current-focus/current.md` pins one stimulus; no typed pronome (gap A). |
| 2 | Agency-local refusal | Partial | Critics and censors refuse at loop level, not at agent input (gap B). |
| 3 | Defaults from current context | Partial | Polynemes bias selection; no parent-frame inheritance (gap C). |
| 4 | Pronomes generalise beyond language | No | Internal records always use full IDs (gap D). |
| 5 | Handles are first-class machinery | No | No `pronome:` field in any schema (gap A). |

---

## Implication for the plan (no changes proposed here)

§21.1 introduces a structural object — the pronome — that the plan
approximates with stimulus IDs, focus pinning, and polyneme excitation
but does not yet name. The closest opportunity is to ask whether frame
slots should carry an optional `pronome:` tag, so that a chain of
frames could share *the same Object* without restating it. That change
would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and possibly the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md).

Recorded here as analysis only. Any move to introduce pronomes as
typed handles is a schema change and falls under the "stop and ask"
rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
