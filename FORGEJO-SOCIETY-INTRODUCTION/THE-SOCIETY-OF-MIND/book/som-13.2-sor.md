# Section 13.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.2.md](som-13.2.md) — *Boundaries* (Minsky, §13.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.2 makes a stronger claim than §13.1. Reformulation works by
*moving boundaries* — sometimes inventing lines that are not there
(splitting a single block into body and supports), sometimes
ignoring real lines that are there (treating a tower of blocks as
one support). The mind *must* do this; otherwise nothing would ever
seem the same twice and nothing could be learned.

---

## The ideas Section 13.2 actually carries

1. **Imagined boundaries split one thing into many.** A single arch
   is divided into body and support by a line the world does not
   contain.
2. **Ignored boundaries merge many things into one.** A tower of
   stacked blocks becomes one support by treating real boundaries
   as absent.
3. **Mind-constructed boundaries are continuous, not occasional.**
   The same operation runs all the time — elbows, youth and
   adulthood, ocean and sea.
4. **Without these boundaries, nothing would seem the same twice.**
   Every viewpoint, light, and background differs; only the
   discarding of inessential aspects lets recollection match
   appearance.
5. **The boundaries serve *present purposes*.** What counts as
   essential depends on what the mind is doing now.

---

## What the implementation already absorbs

### Polynemes draw boundaries by pattern (ideas 1, 2)

Path-, label-, and phrase-polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
group disparate stimuli under a single symbol (`workflow-file`
covers any path under `.forgejo/workflows/**`) and split apparently
similar stimuli into different symbols (`memory-file` vs
`state-file`). These are exactly mind-constructed boundaries on the
incoming stream.

### Frames carve the situation into slots (idea 1)

The slot list in any frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
imposes named subdivisions on the stimulus that do not exist in the
stimulus itself. A code-change has a `user_goal` slot and a
`proposed_patch` slot whether or not the issue text marks them.

### Current focus is a single discarded-context boundary (idea 4)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keeps `workspace/current-focus/current.md` as a single-stimulus
window. Everything else is intentionally outside attention. The
plan *does* discard most of what is present so the one thing being
worked on can match prior episodes.

### Memory cues match by stripped-down features (idea 4)

A K-line's `restore_when`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
matches on `any_terms`, `any_labels`, `any_paths`, `any_symbols` —
a small bag of features, not the full stimulus. This is the same
move Minsky names: keep only what lets the present look like the
past.

### Settlement scope is a closure boundary (idea 3)

A settlement file in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
collects the events, signals, objections, and outcomes considered
*for this stimulus* and excludes the rest. The boundary is
constructed: the world does not natively divide into settlements.

---

## What the implementation does not yet take into account

### A — Boundary-drawing is not a named operation

There is no critic, censor, or phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
whose job is to *propose a new boundary*. Polynemes match
boundaries that already exist in the polyneme file; frames carve at
slots already defined. The mind-drawn line is always pre-drawn.

### B — Splitting and merging are not symmetrical operations

Minsky pairs splitting (one arch → body + support) with merging
(tower of blocks → one support) as the same skill. The plan has
*aggregation* (the `assembly` family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
combines signals into summaries) and *decomposition* via slots, but
neither is described as the inverse of the other, and no schema
links a split to its merge or vice versa.

### C — Boundaries do not move with present purposes (idea 5)

A polyneme's match patterns are static. The set of paths that
`workflow-file` covers does not change because the present task is
about secrets rather than CI. Frames are selected per stimulus, but
*within* a frame the slot boundaries are fixed. The plan has no
mechanism by which the *same* description carves differently for
different goals.

### D — Discarding inessential aspects is implicit, not policed

Idea 4 says the mind *must* discard to recognise. The plan discards
in many places — cartographer maps only relevant files
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md));
K-line cues are small; conscious-presenter emits one voice — but
there is no critic that *checks* the discard was right. A
"discarded too much" or "kept too much" objection would belong to
the deliberation phase and does not exist.

### E — No representation of *which* boundaries were constructed

When a settlement closes, the record in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
captures the slot fillers and the decision. It does not capture
*the boundaries the deliberation drew that the stimulus did not
contain* — for example, the slot the deliberation decided to treat
as essential, or the file boundary it decided to merge across.
Constructed boundaries are operationally present and recorded
nowhere.

---

## Summary table

| # | Idea from §13.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Imagined boundaries split one thing into many | Partial | Polyneme matches, frame slots — but pre-drawn (gap A). |
| 2 | Ignored boundaries merge many things into one | Partial | Assembly family aggregates; no schema pairing with splits (gap B). |
| 3 | Boundary-drawing is continuous | Partial | Per-stimulus polynemes and frames; no dynamic boundary operator (gap A). |
| 4 | Without discarding, nothing seems the same twice | Partial | K-line cues, cartographer, conscious-presenter discard; no critic on the discard (gap D). |
| 5 | Boundaries serve present purposes | No | Polyneme patterns and slot definitions are static across goals (gap C). |

---

## Implication for the plan (no changes proposed here)

§13.2 makes boundary-drawing constitutive of seeing-as-the-same.
The implementation has many static boundaries — polynemes, frames,
workspace scope, settlement closure — and uses them well, but it
has no operation that *constructs* a new boundary for the present
purpose, no critic that audits the discard, and no record of which
boundaries the deliberation drew rather than inherited. Closing
these would touch the polyneme and frame schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the deliberation phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and possibly the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
