# Section 4.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.7.md](som-4.7.md) — *Long-range plans*
(Minsky, §4.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.7 addresses what makes long-range projects possible at all.
Adopting a large goal forces the question *how will this change me?*
Long plans require enlisting agencies that *change slowly* —
including the silent character-shaping agencies that govern what we
*want ourselves to be*.

---

## The ideas Section 4.7 actually carries

1. **Long-range projects are categorically different.** Small
   problems can be treated as detached; long projects always
   conflict with other goals.
2. **The "will I remain interested" question is intrinsic.** Adopting
   a long goal raises questions about cost, learning, power, social
   support, identity-effect.
3. **"How will this change me?" is the hardest question.** Large
   commitments alter the self that pursues them; this is recognised
   in advance and resisted.
4. **Easiest self-control: align with existing dispositions.** Plans
   that match what one already is succeed cheaply; plans that
   require self-revision are expensive.
5. **Short-range tricks are insufficient.** When willpower/etc. (cf.
   §4.6) cannot sustain the project, change-resistant *commitment
   mechanisms* are needed — changes that prevent further change-back.
6. **Recruit slow agencies.** The longest-running commitments are
   held by the slowest-changing agencies — those that shape
   *character* and *self-ideals*.

---

## What the implementation already absorbs

### Slow-changing structures exist (idea 6)

The plan has explicitly slow structures:

- `AGENTS.md` and `APPEND_SYSTEM.md` are protected by the
  `soul_mutation` danger zone
  ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
- `governance/constitution.md`, `governance/self-ideals.md`,
  `governance/authority-registry.yml` are protected by the
  `governance_mutation` danger zone.
- The `self-modification` frame
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
  makes structural change expensive by design.

These are the slow agencies §4.7 names.

### Settlements as bound commitments (idea 5, partial)

A settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
is a recorded decision; once archived to `memory/decisions/`, it
cannot be quietly revised. The append-only enforcement in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
means a change of mind must produce a *new record with a `supersedes:`
link*. This is the operational form of "changes that won't let us
change ourselves back again".

### Identity-effect awareness (idea 3, partial)

The `self-modification` frame and the soul-file guardian both treat
"changes to what the society is" as different from "changes to what
the society does." The architecture *knows* identity-changes are a
distinct category, even if it does not yet ask Minsky's full
question.

### Aligning with existing dispositions (idea 4)

K-line reactivation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"When a K-line reactivates") favours reusing prior successful
configurations. This biases the society toward what it *already is
disposed to do*, which is exactly Minsky's "easiest path to
self-control".

---

## What the implementation does not yet take into account

### A — No representation of a long-range project

§4.7 turns on *projects that span larger portions of our lives*.
The plan has no `plans/` or `projects/` tree, no schema for a
commitment that spans many settlements. Every settlement is
per-stimulus
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The closest analogue is `memory/semantic/project-laws.log`, which
records invariants but not goals.

### B — The five identity-effect questions are not asked

Idea 2 lists what a person asks before adopting a long goal:
*what must I give up? what will I learn? will it bring power? will I
remain interested? will others still like me?* The plan has no
settlement slot, frame requirement, or critic that surfaces these.
The `self-modification` frame requires `human_confirmation` but does
not require the society to articulate the cost to itself of holding
the new commitment.

### C — "How will this change me?" is not asked at all

Idea 3 — the hardest of Minsky's questions. The plan has the soul-
file guardian (which forbids unauthorised change to `AGENTS.md`) but
no agency that, *before* a self-modification settlement, predicts
*what aspects of the society will be different after this change*.
There is no impact statement on the self-model itself. The
introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
supplies the *post-hoc* surface (`unknowns`, `blind_spots`) but not
the *pre-hoc* prediction.

### D — Bias toward existing dispositions is implicit, not visible

K-line reactivation produces the bias (gap closed structurally), but
the *settlement* does not record that "this candidate action was
chosen partly because it aligns with prior K-lines." The settlement
records `cited_decisions` and `prior_klines` but does not
distinguish *citation* from *alignment-as-reason*. A reviewer
cannot ask "is this society pursuing only what it already wants?"
and read it from the record.

### E — Commitment lifetimes are absent

Idea 5: changes that won't let us change ourselves back again. The
plan's `supersedes:` mechanism allows supersession but does not
require any *cooling period* before supersession. A settlement made
on Monday can be superseded on Tuesday with the same procedural
cost. There is no notion of "this decision is binding for N stimuli
unless an explicit override under `self-modification` is invoked".

### F — Character is not named as the slowest layer

§4.7 ends by pointing at *character* — the slowest-changing
agencies, concerned not with what we want but with what we want
ourselves to be. The plan has self-ideals (the *what we want to be*
side) and the soul-file guardian (the *protective* side) but no
agency, file, or layer named *character*. The distinction Minsky
makes between *self-images* (capacity, disposition) and *self-
ideals* (what we ought to be) is in `governance/self-ideals.md`
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
row `01-governance/self-ideals.md`), but the *agency family* that
shapes character — the "silent, hidden agencies" — is not in the
catalogue.

---

## Summary table

| # | Idea from §4.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Long projects are categorically different | No | No multi-stimulus project structure (gap A). |
| 2 | Five identity-effect questions | No | Not surfaced at decision time (gap B). |
| 3 | "How will this change me?" | No | No pre-hoc impact statement (gap C). |
| 4 | Align with existing dispositions | Partial | K-line reuse biases; not recorded as reason (gap D). |
| 5 | Commitment that prevents change-back | Partial | `supersedes:` allowed cheaply; no cooling period (gap E). |
| 6 | Recruit slow / character agencies | Partial | Slow files protected; no character family (gap F). |

---

## Implication for the plan (no changes proposed here)

§4.7 is, in retrospect, the clearest source for what the conservative
self of §4.4 actually *needs*: a representation of projects with
duration, an identity-impact prediction step, a cooling period on
supersession, and a character layer. The plan has the slow
*structures* — danger zones, soul-file, governance — but lacks the
*temporal* primitives (long projects, commitment lifetimes) and the
*reflexive* primitive (predicting how a change will alter the
society).

Any move to close gaps A–F would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the frame catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the self-ideals / self-models material in
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
