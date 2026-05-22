# Section 19.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.9.md](som-19.9.md) — *Recognizing thoughts*
(Minsky, §19.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.9 is the move that closes Minsky's recognition loop: the same
machinery that recognises a thing in the world can recognise *a
configuration of inner partial states*. A recognizer whose inputs come
from agency states rather than from sensors is what makes naming
imagined apples possible — and demands a *second kind of memory*, a
recognition dictionary, alongside the activation dictionary.

---

## The ideas Section 19.9 actually carries

1. **Recognition of thoughts is structurally like recognition of
   things.** "Inside the brain, these situations really aren't so
   different."
2. **Inputs from memory, not sensors.** A recognizer can be wired to
   agency states instead of perception channels.
3. **Two kinds of memory per agency.** One memory says what state to
   *enter* (activation); the second says what configurations to
   *name* (recognition).
4. **Mental objects engage the same machinery as physical ones.**
   This is what justifies talking about "thinking about" apples.
5. **Simple property lists are not enough.** Real ideas need
   *constraints and relations* — the wheel-under-the-car kind of
   structural knowledge.

---

## What the implementation already absorbs

### Recognition of inner state at the settlement layer (ideas 1, 4)

The settlement layer in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and the settlement record described in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
read the *current state of the society* — the blackboard, the active
agencies, the objections — and name it: "this is a code-change," "this
is a security-sensitive change," "this is a self-modification." That
naming is recognition over inner state.

### Memory of "what state to enter" exists (idea 3, half of it)

K-line `activation_snapshot.active_agencies` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is exactly the *activation* dictionary Minsky names: given a cue,
restore this configuration of weights.

### Mental and physical inputs use the same downstream machinery (idea 4)

The frame layer's `matches.any_signals` can be triggered by polynemes
that originated from a path-match, a label-match, or a phrase-match —
and a phrase can come from a user (external) or from a prior
settlement (internal). The same frame fires either way.

---

## What the implementation does not yet take into account

### A — No *recognition* dictionary distinct from the activation one

Idea 3 is the section's central architectural claim. The plan has
the *activation* half (K-lines tell the runtime what configuration to
enter on a cue). It has no *recognition* half: nothing in the plan
takes a current configuration of agency activations and asks "what
is the *name* of this configuration?" The settlement layer names
*the stimulus*, not *the inner state*.

### B — No recognizer wired to memory inputs

Idea 2. Every recognition surface in the plan
(frame `matches:`, polyneme `match:`, critic activation) reads the
*stimulus* or its derived percepts. None reads `state/.../signals.jsonl`
or `state/.../activation.jsonl` and says "this pattern of activation
means something." The introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
is the surface where this would live and is currently descriptive
rather than recognitional.

### C — No name for "the thought of X without X"

Minsky's example: hearing *those round, red, thin-peeled fruits*
arouses the apple-neme even though no apple is present. The plan can
construct multi-feature evidence (a polyneme can be excited by
several phrase polynemes via the frame layer), but there is no
*name-by-inner-evidence* path that maps "Taste=apple-flavour AND
Structure=thin-peeled AND Substance=fruit" back into an
*apple-polyneme* activation. Polynemes flow from stimulus to
agencies, not from agencies back into polynemes.

### D — Constraints and relations are absent (idea 5)

Repeats the warning from §19.6. The plan represents stimuli and
candidate actions as sets of features; it has no schema for
structural constraints among them. The relational-memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
introduces typed links between records, but it does not yet feed a
*recognizer* that fires on structural patterns.

---

## Summary table

| # | Idea from §19.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Recognition of thoughts is like recognition of things | Partial | Settlement names the stimulus; not the inner state (gap A). |
| 2 | Recognizer can read agency states | No | No recognizer wired to `activation.jsonl` (gap B). |
| 3 | Two kinds of memory per agency | Partial | Activation half present; recognition half absent (gap A). |
| 4 | Mental and physical objects use the same machinery | Partial | Same frame layer; no back-arrow from inner state to polyneme (gap C). |
| 5 | Constraints and relations needed | No | Sets of features only (gap D). |

---

## Implication for the plan (no changes proposed here)

§19.9 names a structural addition the plan does not yet have: a
recognition dictionary that reads inner state and produces a name.
The closest existing surface is the introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
which currently inventories `unknowns` and `blind_spots` rather than
*naming the current mental configuration*. Any move to add inner-
state recognizers — even as a single agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— would touch the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the introspection protocol, and the relational-memory protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
