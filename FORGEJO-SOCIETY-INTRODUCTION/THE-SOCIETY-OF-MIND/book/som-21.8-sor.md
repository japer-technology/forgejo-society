# Section 21.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.8.md](som-21.8.md) — *Attention*
(Minsky, §21.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.8 frames attention as memory-control. An infant first acquires
control over a single pronome — a single IT — and only later learns
to hold several. Even maintaining one IT requires tolerating
interruption: the ball that rolls behind the box should not vanish
from mind. A child shifting from doll to shoe to shoelace loses the
prior IT entirely; an adult learns to keep several.

---

## The ideas Section 21.8 actually carries

1. **Attention is short-term memory under control.** Focus is what
   you can hold, not what you can see.
2. **The simplest attention is a single IT.** One pronome held over
   time.
3. **Holding IT requires interruption tolerance.** The ball behind
   the box must persist as expected reappearance.
4. **Level shifts dissolve prior ITs unless protected.**
   Doll → shoe → shoelace replaces the previous focus by default.
5. **Adulthood means several ITs at once.** Comparison, prediction,
   imagined plans, and causal chains require multi-IT.
6. **Attention is developmental.** Memory-control matures over
   months and years.

---

## What the implementation already absorbs

- **Single-IT structure is in place.**
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  reserves `workspace/current-focus/current.md` for exactly one
  stimulus, and the *Conscious bottleneck* in
  [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
  enforces a single visible voice through
  `agency.integration.conscious-presenter`. The infant IT is the
  plan's adult IT.
- **Interruption tolerance via persisted state.** Every run commits
  `state/` and `workspace/` at its end
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
  When a later run picks up the same stimulus, it can recover the
  previous focus from Git — the structural analogue of remembering
  the ball.
- **Per-stimulus session continuity.** `state/sessions/<session-key>.json`
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
  carries continuity across runs.

## What the implementation does not yet take into account

### A — Multi-IT is not represented

The plan enforces a single focus by design. §21.8's adult competence
— holding several ITs at once for comparison and prediction — has no
analogue. A run cannot, by construction, juggle two stimuli in
parallel attention.

### B — Level shifts are not protected

The doll/shoe/shoelace example asks: when a sub-feature becomes the
new focus, what happens to the parent? In the plan, a new stimulus
*replaces* the focus in `current-focus/current.md`. There is no stack
of suspended ITs; there is no resume protocol.

### C — Attention has no developmental shape

Minsky describes IT as something that matures over months. The plan
has no developmental phase for an agency's or society's
attention-machinery. The same single-IT discipline applies on day one
and on day one thousand. (This connects to gap A in
[som-1.1-sor.md](som-1.1-sor.md) on developmental timescale.)

### D — Expected-reappearance is not modelled

The older infant *expects* the ball to come back. The plan has no
record kind for an *expected return*: a signal saying "this stimulus
will recur, hold its context warm". K-lines reactivate on similarity,
not on expectation.

### E — Memory-control is not its own agency family

§21.8 treats memory-control as the central skill of attention. The
plan's families
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
include `memory` (archivist, librarian) and `integration` (conscious
presenter), but no *attention-control* family that owns the
single-IT/multi-IT distinction explicitly.

---

## Summary table

| # | Idea from §21.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Attention is short-term memory under control | Partial | `current-focus/current.md` is the locus; no dedicated controller (gap E). |
| 2 | Single IT | Yes | Enforced by `current-focus/current.md`. |
| 3 | Interruption tolerance | Yes | Persisted state and session continuity. |
| 4 | Level-shift protection | No | New stimulus replaces focus; no stack (gap B). |
| 5 | Multi-IT in adulthood | No | Single-focus by construction (gap A). |
| 6 | Attention develops over time | No | No developmental phases (gap C). |

---

## Implication for the plan (no changes proposed here)

§21.8 reads against the implementation as a description of a
deliberate single-IT architecture that has all of the simple
attention machinery and none of the developmental, multi-IT, or
level-shift machinery. The biggest unforced opportunity is a
*suspended-IT stack*: a small workspace folder beside
`current-focus/` for stimuli whose attention has been pre-empted but
not abandoned. That would touch the workspace layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the workspace protocol in
[`THE-SOCIETY-OF-REPO/07-workspace/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/).

Recorded here as analysis only. Any move to add multi-IT or a
suspended-IT stack is a structural change to attention and falls
under the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12
and [CLAUDE.md](../../../CLAUDE.md).
