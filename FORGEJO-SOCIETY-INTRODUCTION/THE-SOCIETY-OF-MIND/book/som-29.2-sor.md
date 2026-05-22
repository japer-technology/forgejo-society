# Section 29.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.2.md](som-29.2.md) — *Several thoughts
at once* (Minsky, §29.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.2 takes *Mary gives Jack the kite* and shows the single verb
*give* carrying at least three meanings simultaneously: a physical
trajectory (the kite moves), a transfer of ownership in the realm
of *estates*, and a social act involving generosity and
obligation. The realms run in parallel because their agencies do
not compete — much as colour and shape can describe an apple at
once. Possession is named as a realm in its own right, sitting
between objects and ideas.

---

## The ideas Section 29.2 actually carries

1. **One symbol, several simultaneous meanings.** The verb *give*
   carries three meanings at once, not in sequence.
2. **The realms run in parallel without conflict.** Different
   agencies handle different aspects without competing for the
   same resources.
3. **Trans-frames in the physical realm.** A trajectory from one
   location to another.
4. **The realm of *estates*.** Ownership is its own realm, not a
   sub-case of the physical realm; nothing physical need move.
5. **Possession is prerequisite to action.** Plans require not only
   what to do but the right to use the materials and ideas
   involved.
6. **The social realm.** Generosity, affection, and obligation are
   yet another parallel interpretation.
7. **Parallelism is possible because the agencies are different
   enough.** The colour/shape analogy: non-competing resources can
   run concurrently.

---

## What the implementation already absorbs

### Trans-frames and trajectories (idea 3)

The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
already includes a Trans-frame shape with `origin` and
`destination` slots. A physical move of an artefact (a file, a
permission, a runner allocation) can be represented directly.

### Non-competing concurrency (idea 7)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
runs many agencies in the `activate` and `deliberate` phases in
parallel — each writes to its own slot of the blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and the settlement layer combines their outputs only at the end.
Two agencies that read different slots do not compete; this is
exactly the colour/shape pattern at the file level.

### A social-style realm is partially present

The governance and authority surfaces
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
`governance/authority-registry.yml`) carry the social-realm load
implicitly: who *may* act, who *must* approve, what is *owed*. Idea
6 is therefore not absent in spirit; it is folded into the
governance layer.

---

## What the implementation does not yet take into account

### A — *Estates* / possession is not a realm

Idea 4 names possession as a realm distinct from both objects and
ideas. The plan has *ownership-like* fields — `outputs:` for an
agency declares what it produces, `authority:` declares what it
may do — but there is no `possession`, `estate`, or `holding`
shape. A K-line cannot record that an agency *holds* a given
artefact for a period of time; only that the artefact was *read*
or *written*. The protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/)
have no `08-possession.md` analogue.

### B — A single symbol carrying parallel meanings is not modelled

Idea 1: the same word triggers three frames at once. The handoff
and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carry *one* payload typed for *one* recipient. There is no notion
of a polyneme that fans out, in a single emission, into multiple
realm-specific frame activations. Each agency interpreting a signal
in its own way is *possible* (any agency that reads the blackboard
can interpret it), but it is not *first-class*; the
multi-realm-by-design behaviour Minsky describes is left to ad-hoc
re-interpretation.

### C — Possession-as-prerequisite is not a precondition primitive

Idea 5 makes possession a precondition for action. The plan has
authority checks (the censor phase) and budget checks, but not
*holding* checks: an agency cannot declare in its manifest "I may
only run if I currently hold X", where X is an estate-like
artefact. The closest analogue is the lock or queue an external
service might enforce; nothing in `.forgejo-society/` itself
represents it.

---

## Summary table

| # | Idea from §29.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | One symbol, several simultaneous meanings | No | Signals carry one payload (gap B). |
| 2 | Realms run in parallel without conflict | Yes | Activate/deliberate phases run agencies concurrently on different blackboard slots. |
| 3 | Trans-frames in the physical realm | Yes | Frame schema includes `origin`/`destination`. |
| 4 | *Estates* as a realm | No | No `possession` primitive (gap A). |
| 5 | Possession is prerequisite to action | No | Authority and budget yes; *holding* no (gap C). |
| 6 | The social realm | Partial | Folded into governance/authority. |
| 7 | Parallelism requires non-competing agencies | Yes | Blackboard separation + per-agency manifests. |

---

## Implication for the plan (no changes proposed here)

§29.2 names *possession* as a realm and *simultaneous multi-realm
interpretation* as a mechanism. The plan handles parallelism well
and handles a social-realm subset through governance; what it
lacks is the *vocabulary of estates* and a *signal shape that fans
out across realms by construction*. Both are coherent extensions,
but both touch shared primitives.

Recorded as analysis. Any move to introduce a possession realm
would touch the protocol set under
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/)
and the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
introducing multi-realm fan-out would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
Both fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
