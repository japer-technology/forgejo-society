# Section 30.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.2.md](som-30.2.md) — *Knowing and
believing* (Minsky, §30.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§30.2 takes apart the everyday vocabulary of certainty —
*fact*, *opinion*, *belief* — and refuses to treat the distinctions as
robust. The same astronomer holds folk-sunrise and physical-sunrise
*simultaneously*, switching by realm. The reason our beliefs feel
firm is *decisiveness*: speech and action force the suppression of
most agencies, and what remains is reported as if it were knowledge.

---

## The ideas Section 30.2 actually carries

1. **Know / believe / think do not pick out kinds.** They summarise
   *degrees of certainty in action-oriented states*.
2. **No test for "justified true belief".** People know things that
   are false; the philosophical definition does not survive contact
   with practice.
3. **The "I" is not stable.** Different realms of mind hold different
   views of the same fact; which prevails depends on the moment's
   balance of agencies.
4. **Decisiveness compresses certainty.** Acting and speaking require
   collapsing the field; suppressed agencies leave no trace in the
   utterance.
5. **Moral and legal schemes rely on the *genuine* distinction.**
   That distinction is shakier than ordinary moral grammar admits.

---

## What the implementation already absorbs

### Decisiveness as a phase (idea 4)

The settle phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is literally Minsky's "decisiveness compresses certainty": many
partial signals become one decided action, with objections preserved
but suppressed from the visible utterance produced by
`agency.integration.conscious-presenter`.

### Action-oriented states (idea 1)

The authority levels `propose` and `act`
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
mark the move from deliberation to commitment. A signal at `propose`
is opinion; once promoted to `act` (via settlement + gates) it
behaves as decided belief. The vocabulary distinction is shadowed by
an authority distinction.

### Pluralism in the criticism phase (idea 3)

Multiple critics may dispute the same candidate
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
This is the structural analogue of "different realms hold different
views" — the same fact is permitted to be assessed differently by
different parts at the same time.

---

## What the implementation does not yet take into account

### A — The minority view is logged but not graded

Objections are kept in the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
but the visible report shows only the decided action. There is no
*belief gradient* surfaced alongside the utterance — no way for a
reader to see "the society decided X with 60% internal support".
§30.2 implies this is precisely the information collapsed away.

### B — No realm-conditional belief

Minsky's astronomer holds folk-physics and physical-physics for the
same proposition, used in different realms. The plan has no
`applies_in_realm` tag on an agency's claims, and no policy for
selecting which realm an agency speaks from. Concepts in
[`memory/concepts/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
are not partitioned by domain of applicability.

### C — No graded vocabulary in the signal schema

The signal schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carries a numeric `confidence` but not the lexical distinction
(guess / believe / know) Minsky says people actually rely on. The
report surface has nowhere to render the difference between "we
guess" and "we know" beyond the bare number.

### D — Genuineness has no operational definition

§30.2 closes on the moral weight of *genuine* belief. The plan has no
schema for distinguishing a *committed* claim from a *staged* one — a
draft critic exercise produces the same signal shape as a real
appraisal. Accountability via
[`02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
attributes outputs to authors but does not mark them by genuineness.

---

## Summary table

| # | Idea from §30.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Certainty words summarise action-states | Partial | Authority levels approximate the gradient; lexical distinctions absent (gap C). |
| 2 | No "justified true belief" test | Yes | Plan never claims truth; only agency claims with rationales. |
| 3 | The "I" is not stable | Partial | Critic pluralism present; no realm-conditional belief (gap B). |
| 4 | Decisiveness compresses certainty | Yes | Settle phase + conscious-presenter perform the compression. |
| 5 | Moral schemes lean on "genuine" | No | No genuineness marker on signals (gap D); minority view hidden (gap A). |

---

## Implication for the plan (no changes proposed here)

§30.2 is well-matched to the strongest part of the plan — the settle
phase is exactly the action-oriented compression Minsky describes —
but four absences are real: the belief gradient is hidden (A), realm
conditioning is missing (B), the certainty vocabulary is flattened to
a number (C), and genuineness has no operational form (D).

Any move to surface a belief gradient, partition concepts by realm,
extend the signal schema, or add a genuineness marker would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and therefore falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
