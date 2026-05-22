# Section 21.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.4.md](som-21.4.md) — *Communication among
agents* (Minsky, §21.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.4 argues that lower agents need not be addressed by name. Get
does not message Look-for; Look-for reads whatever context is already
in place. The second, more natural script uses *apple* and *pail*
only once, and replaces the rest with *it*. Communication runs
through shared context, not explicit envelopes.

---

## The ideas Section 21.4 actually carries

1. **Most agents are middle-level managers.** Get, Find, Move do not
   touch the world; only Look-for and Grasp do.
2. **Information reaches low agents without explicit messages.** They
   inherit from the active context.
3. **Pronouns replace names once context is established.** Speech
   compresses; later mentions are *it*, not the original noun.
4. **The communication discipline mirrors the memory discipline.**
   Sentences mirror how the mind manages its state, because both must
   share machinery.

---

## What the implementation already absorbs

- **A layered blackboard exists.**
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  pairs `workspace.md` (human-readable) with `blackboard.md` (layered
  cognitive state), so later steps can read shared context rather
  than be addressed.
- **Polynemes bias without addressing.**
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  excites and inhibits agencies by weight — a polyneme never sends a
  message to a particular agent.
- **The middle-manager structure is reflected in family taxonomy.**
  The `assembly` and `integration` families in
  [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
  are explicit middle managers; they coordinate rather than act on
  the world.

## What the implementation does not yet take into account

### A — Every record still names everything in full

The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
requires `agent`, `stimulus_id`, and full evidence on every record.
There is no second, compressed form analogous to Minsky's second
script. This is correct for audit but is the opposite of *replace the
name with it*.

### B — Inheritance of fill-by-context is partial

Polynemes excite agencies but do not pre-fill *slots*. Look-for in
§21.4 receives Color, Shape, Size by inheritance from the active
context; in the plan, a slot is filled by a named agency's handoff,
not by reading whatever happens to be present.

### C — No distinction between *act-on-world* and *manage-others*

§21.4's central observation is that only Look-for and Grasp touch the
world. The plan distinguishes families but does not flag, on each
agency, whether it is a *world-touching* or *middle-manager* agency.
Authority levels
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
distinguish `read`, `draft`, `propose`, `act`, `govern`, `human` but
the act/manage axis is orthogonal to those.

---

## Summary table

| # | Idea from §21.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Most agents are middle-level managers | Partial | Family taxonomy implies it; no explicit flag (gap C). |
| 2 | Information reaches low agents through context | Partial | Polynemes excite; slots are filled explicitly (gap B). |
| 3 | Pronouns replace names after first mention | No | Every record names everything in full (gap A). |
| 4 | Communication mirrors memory discipline | Yes | Shared blackboard, append-only memory. |

---

## Implication for the plan (no changes proposed here)

§21.4 trades verbosity for context-inheritance. The plan trades
context-inheritance for audit-readable verbosity. The trade is
deliberate, but it is a trade — Minsky's compression buys cheap
communication that the plan does not have. Closing this would touch
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md).

Recorded here as analysis only. Any move to compress records by
substituting handles for full identifiers would weaken the audit
discipline and falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
