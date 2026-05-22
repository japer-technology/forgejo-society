# Section 29.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.3.md](som-29.3.md) — *Paranomes*
(Minsky, §29.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.3 introduces *paranomes*: pronome-like roles whose analogues
run in *several realms at once*. The Actor pronome of *give* is at
once Mary's hand (physical), Mary's estate (possessional), and
Mary the party guest (social). Higher-level frames are *parallel
arrays of analogous frames, one per realm*. A single
language-utterance activates the paranome family, and each realm's
agency interprets the role in its own way. Episodes of coordinated
"blinking" let one agency temporarily steer all the others while
they otherwise run independently.

---

## The ideas Section 29.3 actually carries

1. **Paranomes are cross-realm role-bundles.** A single role
   (Actor, Origin, Destination) has analogues across multiple
   realms.
2. **Higher-level frames are parallel arrays.** A frame in one
   realm is mirrored by analogous frames in others; they are
   bundled, not unified.
3. **Activation runs crosswise.** A polyneme/paranome activation
   propagates into many realms in a single act.
4. **Each realm keeps its own memory-control.** After activation,
   each realm processes the role using its own methods.
5. **Realms can momentarily synchronise.** One agency can
   "blink" its Origin/Destination paranomes and force others to
   re-focus.
6. **Otherwise the realms run independently.** Synchronisation is
   episodic, not continuous.

---

## What the implementation already absorbs

### Frames and polynemes as named roles (ideas 1, 2)

The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines named slots (Actor, Trans, Origin, Destination, Object)
that any frame may use. Polynemes are first-class. The *shape* of
an Actor role is therefore reusable across frames, which is the
first half of the paranome idea: the bundling base exists.

### Independent per-realm processing (idea 4)

Each agency owns its own files, its own behaviour and its own
slice of the blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Two agencies reading the same polyneme can react in entirely
different ways without interfering. The substrate for "each realm
keeps its own memory-control" is in place.

### Episodic cross-agency steering (idea 5, partial)

The suppressor and conscious-presenter mechanisms
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
can refocus the whole society on a chosen slot of the blackboard.
This is the closest analogue to Minsky's "blinking": a meta-level
nudge that re-aligns several agencies at once.

---

## What the implementation does not yet take into account

### A — A paranome is not first-class

There is no `paranome` type in the schema. A polyneme is defined as
operating in one place; there is no field that says "this polyneme
has these analogues in these other realms" and no mechanism that
activates the analogues together. Idea 1 has no carrier.

### B — Realms are still unnamed (carried over from §29.1)

The paranome construct *requires* a notion of realm: a paranome is
defined by its set of realm-specific analogues. Until realms are
named (see [som-29.1-sor.md](som-29.1-sor.md) gap A), paranomes
cannot be expressed; the missing scope here is the same missing
scope as in §29.1.

### C — Parallel-array frames are not represented

Idea 2: a higher-level frame is a *bundle* of analogous frames,
one per realm. The plan's frame schema yields one frame at a time;
there is no `frame_family` shape, no group-id binding several
frames as analogues, and no way for the runtime to know that two
frames should be activated together.

### D — Episodic synchronisation has no protocol

Idea 5 names a specific pattern: a temporary coordinated re-focus
across several agencies, followed by a return to independent work.
The suppressor mechanism is the closest analogue, but it is a
single-shot inhibit, not a *blink* (on/off/on) with a defined
duration. The handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
do not carry a "synchronise across these realms for this many
cycles" payload.

---

## Summary table

| # | Idea from §29.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Paranomes as cross-realm role-bundles | No | No `paranome` type (gap A). |
| 2 | Higher-level frames are parallel arrays | No | No `frame_family` shape (gap C). |
| 3 | Activation runs crosswise into many realms | No | Depends on realms and paranomes being named (gaps A, B). |
| 4 | Each realm keeps its own memory-control | Yes | Agency-owned files and blackboard slices. |
| 5 | Realms can momentarily synchronise | Partial | Suppressor + presenter approximate; no timed *blink* protocol (gap D). |
| 6 | Realms otherwise run independently | Yes | Default execution model already. |

---

## Implication for the plan (no changes proposed here)

§29.3 is the section that turns "realms" from a description into a
*construct*. Two of Minsky's load-bearing pieces — the paranome
and the frame-family — are not in the plan, and a third (timed
cross-realm synchronisation) is only approximated. The plan
already supplies the substrate (per-agency independence,
polyneme/frame schemas, suppressor mechanism); the additions
would be schema-level rather than runtime-level.

Recorded as analysis, not as a change request. Any move to
introduce paranomes or frame-families would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and depends on the *realm* primitive being added first
(see [som-29.1-sor.md](som-29.1-sor.md)). Both fall under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
