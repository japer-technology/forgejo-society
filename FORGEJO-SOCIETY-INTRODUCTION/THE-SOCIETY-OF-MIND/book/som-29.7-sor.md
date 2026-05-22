# Section 29.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.7.md](som-29.7.md) — *Likenesses and
analogies* (Minsky, §29.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.7 turns to the mechanics of analogy. Recollection rarely
matches exactly, so the mind must *force* a memory to fit by
either modifying the memory or restructuring the present scene (a
stone described as a hammer with handle and head, or a hammer
frame relaxed to accept the stone). Either move generates conflict
elsewhere. Difficulty depends on the context already established
— which agents are active, with which priorities — and especially
on the ease of *switching realms*. Poetic metaphor is offered as
the extreme case: literal physical-realm reading defeats the
metaphor; only a switch to other realms makes it work.

---

## The ideas Section 29.7 actually carries

1. **Recollection never matches exactly.** Reuse is always
   approximate.
2. **Two strategies of fit.** Either modify the memory or change
   the description of the present scene.
3. **Either strategy creates new conflicts elsewhere.** Fitting is
   not free; it imports cost to other agencies.
4. **Cost depends on context.** Currently active agents and their
   priorities determine which adjustments are cheap.
5. **Cross-realm switching is often the decisive cost.** Easy
   analogies are those that can stay in a realm; hard analogies
   require a switch.
6. **Metaphor proves the principle.** "She is a flower" needs the
   listener to leave the physical realm and dwell in another
   sphere; literal reading destroys the metaphor.
7. **Listener-private context constrains success.** The metaphor
   must fit the listener's *private love ideal*; analogies are
   tuned to private memory, not just public symbols.

---

## What the implementation already absorbs

### Memory reuse is already approximate (idea 1)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are restored *when* a `restore_when` pattern matches, not when an
identical situation recurs. The restoration is approximate by
design; the plan does not pretend recollection is exact.

### Two-sided adjustment exists informally (idea 2)

An agency can either consult a past K-line and adapt it, or
describe the present situation in terms that fit a past K-line.
Both happen in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)'s
`activate`/`deliberate` phases. The substrate exists, even if the
two moves are not named.

### Cost-induced conflict is captured by critics (idea 3)

Critics in the `criticize` phase
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
exist precisely to flag the conflicts a candidate action creates
elsewhere. The plan acknowledges that fit-driven moves are not
free; it routes the cost through a named mechanism.

### Context-dependent priority (idea 4)

Activation rules (`activates_on`, `inhibits`) and the budget
fields in the manifest schema let the same situation produce
different outcomes depending on which agencies are already
active. The "what's cheap right now" question has a structural
answer in the plan.

---

## What the implementation does not yet take into account

### A — The two adjustment strategies are not named

Idea 2: *modify the memory* versus *change the description of the
scene*. The plan has both moves implicitly but never names them.
There is no record on a K-line that says "this restoration was a
memory-adjustment" or "this was a scene-redescription"; the
introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
does not record which strategy was used. The plan cannot ask
"how often do we adjust the memory rather than the scene?"

### B — Realm-switch cost is not measured

Idea 5 says the decisive cost is often the realm switch. Until
realms are named (see [som-29.1-sor.md](som-29.1-sor.md) gap A),
the plan cannot measure or budget for switching cost. There is
no `budget.realm_switches:` field on a manifest and no telemetry
that records how often a cycle crossed realm boundaries.

### C — Metaphor as a class of move is not represented

Idea 6: metaphor is what licenses a deliberate realm-switch
between source and target. The plan has *frames*, *K-lines*, and
*polynemes*, but no `metaphor` shape that records "this analogy
imports a uniframe from source realm A into target realm B". A
later section (§29.8) makes metaphor central; the absence here
is the absence there.

### D — Listener-private context (idea 7) is not modelled

Idea 7 says metaphor success depends on private memory, not just
public symbols. The plan's memory is per-society; there is no
notion of *per-conversation*, *per-partner*, or *per-listener*
context. The conscious-presenter speaks the same way to every
reader. The federation surfaces in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
hint at per-peer state but do not formalise listener-local
tuning.

---

## Summary table

| # | Idea from §29.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Recollection is approximate | Yes | K-line `restore_when` matching is approximate by design. |
| 2 | Memory-modify vs scene-redescribe | Partial | Both happen; neither is named (gap A). |
| 3 | Fit creates new conflicts | Yes | Critics phase captures them. |
| 4 | Cost is context-dependent | Yes | Activation rules + budgets. |
| 5 | Realm-switch is the decisive cost | No | No realm primitive, no switch-cost metric (gap B). |
| 6 | Metaphor proves the principle | No | No `metaphor` shape (gap C). |
| 7 | Listener-private context matters | No | No per-listener memory (gap D). |

---

## Implication for the plan (no changes proposed here)

§29.7 says that *fit is always paid for*. The plan already pays
for it through critics, but does not *account* for the payment by
strategy or by realm-switch. Naming the two adjustment strategies
(memory-modify vs scene-redescribe) and recording them in K-lines
would be small; measuring realm-switch cost depends on the
realm primitive that the plan does not yet have.

Recorded as analysis. Any move to add adjustment-strategy fields
or realm-switch telemetry would touch the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and the state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
introducing listener-private context would touch the federation
surfaces in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/).
All fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
