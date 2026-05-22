# Section 27.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.3.md](som-27.3.md) — *Censors*
(Minsky, §27.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.3 sharpens the difference between suppressors and censors. A
censor intercedes *earlier* in the line of thought, costs less time,
and can *deflect* rather than block. The price is memory: a censor
must recognise all the precursor states, and that memory grows
quickly as you push the intercept earlier. Minsky also notes that
censors must themselves sometimes be suppressed (for long-range
planning), and that introspection cannot see them.

---

## The ideas Section 27.3 actually carries

1. **Early interception is cheaper than late suppression.** A censor
   that fires during deliberation costs no backtracking.
2. **Censors deflect; suppressors block.** A censor can nudge thought
   into an acceptable direction without halting it.
3. **Early interception costs memory.** The further back the censor
   acts, the more precursor states it must recognise.
4. **Negative recognisers may constitute large portions of mind.**
   We cannot see them through introspection because absence is
   invisible.
5. **Censors must sometimes be suppressed.** Sketching long-range
   plans needs a mode where minor obstacles are set aside.
6. **A positive plan is needed.** Censorship alone cannot solve
   complex problems; you still need a constructive proposer.

---

## What the implementation already absorbs

### Early interception (ideas 1, 6)

The plan separates *critics* (evaluators in `criticize`) from
*censors* (vetoers in `censor`) in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
Critics are the early interceptors: they fire *during* deliberation,
score candidates, and never directly block. Censors are the late
suppressors. This is exactly Minsky's split, with critics doing the
deflection work and proposers (agencies of family `code`, `assembly`,
`integration`) supplying the positive plan.

### Negative recognisers as first-class (idea 4)

The censor family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`agency.censor.cloud-egress`, `agency.censor.blast-radius`,
`agency.censor.identity-leak`, and the `safety` family more broadly)
is a real category in the manifest schema. The `inhibits` field gives
a censor a *named* list of what it can stop, which is the file form
of "I am a recogniser of these undesirable precursors."

### Introspection of negatives (idea 4, partial)

The introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
includes `blind_spots` and `unknowns` slots in the settlement, which
is the closest the plan comes to noticing what *did not happen*.
Censor fires are logged into the settlement record, so the negative
work is at least *visible* in audit, even though it is invisible to
the conscious bottleneck while it happens.

---

## What the implementation does not yet take into account

### A — Critics do not actually deflect

Idea 2 — that the early interceptor *redirects* thought into a better
direction — is not how critics work in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
A critic emits an objection or a score; it does not propose a
substitute candidate. The "deflection" semantics would need critics
to be allowed to emit a `revised_candidate` field, which the signal
schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
does not currently carry.

### B — Memory cost of early censorship is not modelled

Idea 3 says: the earlier a censor acts, the more precursor states it
must remember. The plan has no concept of a censor's *recogniser
size*. A censor manifest does not declare how many trigger patterns
it carries, nor is there a budget that grows with that count.
Long-running societies could accumulate enormous censor manifests
with no visibility into the cost.

### C — Censors cannot be suppressed for planning mode

Idea 5 is interesting and absent. The plan has no "long-range
planning mode" in which censors are deliberately quieter. Every run
of the pipeline applies the full censor set. A `planning_mode` flag
in the settlement or a `suspendable: true` field on censor manifests
would be the file forms; neither exists. Note that this is *also* a
safety question: hard censors (e.g. `cloud-egress`) must never be
suspended, and the plan does not yet distinguish suspendable from
non-suspendable censors.

### D — No theory of "negative recognisers are most of the mind"

Idea 4's stronger half — that the mind is *mostly* negative — is not
reflected in the plan's expected agency counts. The first-ship
catalogue lists more proposers than censors. Whether that should be
inverted is a real design question that the plan does not yet ask.

---

## Summary table

| # | Idea from §27.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Early interception is cheaper | Yes | Critics fire during `criticize`; censors are the late layer. |
| 2 | Censors deflect; suppressors block | Partial | Critics score but do not substitute (gap A). |
| 3 | Early interception costs memory | No | No recogniser-size representation (gap B). |
| 4 | Negative recognisers are large portions of mind | Partial | Censor family is first-class; first-ship is proposer-heavy (gap D). |
| 5 | Censors must sometimes be suppressed | No | No planning-mode suspension; safety-critical censors must stay on regardless (gap C). |
| 6 | A positive plan is also needed | Yes | Proposer agencies and assembly families. |

---

## Implication for the plan (no changes proposed here)

§27.3 reinforces a split the plan already makes — critics versus
censors, early versus late — and lands two distinct missing pieces:
critics that *substitute*, and censors that can be *quieted* for
long-range planning while safety censors stay armed.

Any move to close these would touch the critic and censor manifest
schemas in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the policy-and-safety document in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
