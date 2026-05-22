# Section 25.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.6.md](som-25.6.md) — *The frame idea*
(Minsky, §25.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.6 is part history, part regret. Minsky recalls that the 1974
essay's frame idea took hold while the *frame-array* idea — which he
considered the more important — did not. He also flags an open
question: how the mind recognises *many instances* of the same kind
at once (faces in a crowd, bricks in a wall) without making many
copies of a frame.

---

## The ideas Section 25.6 actually carries

1. **Just-vague-enough specifications.** The 1974 essay worked
   because it left room for others to contribute; over-specification
   would have invited testing rather than extension.
2. **The frame-array was undersold.** The frame is famous; the
   family-with-shared-terminals is the deeper idea.
3. **Nemes, K-lines, and pronomes crystallised on different
   timescales.** The vocabulary of mind theory accreted over a
   decade.
4. **Parallel recognition is an open problem.** Many instances of
   the same kind at once cannot plausibly mean many copies of the
   same frame.
5. **A plausible answer: match one, assume the rest.** Apply the
   frame to one example under attention and *assume* it covers the
   visibly similar neighbours.

---

## What the implementation already absorbs

### Vocabulary accreted in layers (idea 3)

The SOR specification — frames, polynemes, K-lines, settlements,
agencies, critics, censors — and its compressed re-statement in the
plan
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
already mirrors Minsky's accreted vocabulary. The plan does not
collapse these primitives into one; each carries its own shape, its
own file, its own moment in the workflow.

### Frames are first-class files (idea 2, partially)

Frames live as Markdown manifests in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
The plan does not yet name *frame-arrays* (see §25.2 gap A), but the
frame itself is given the dignity Minsky's 1974 essay gave it.

### Specification at the right level (idea 1)

The mapping in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
keeps every concept tied to a file or a workflow step without
fixing implementation detail. The plan deliberately stops at
"manifest + step" and leaves prompt body, runner choice, and model
choice open. This is the same just-vague-enough discipline Minsky
credits with the 1974 essay's reach.

---

## What the implementation does not yet take into account

### A — Parallel recognition has no protocol

Idea 4 is an open question, and the plan inherits it. Nothing in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
or
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
addresses how a single frame could "cover" many simultaneous
similar items in one turn. An agency operates on the polyneme state
as a whole; per-instance fan-out is not a primitive.

### B — "Match one, assume the rest" is not a shape

Minsky's tentative answer (idea 5) would be a typed signal: "frame
F was matched to instance I; the visibly similar set S is assumed to
share F's interpretation." The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
does not carry an *assumption-over-set* signal. The economy Minsky
proposes has no place to live.

### C — Frame-arrays underbuilt (carried forward)

Idea 2's worry — that frame-arrays were ignored — applies to the
plan as well, as already recorded in §25.2's gap A. Without a
named frame-array, the deeper of the two 1974 ideas remains the
one less honoured.

### D — Historical layering is not preserved in the manifest

Idea 3 records that the vocabulary was discovered over years. The
plan's agency and frame manifests
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
carry no provenance field — no `introduced_at:`, no
`derived_from:` — to mark which primitives are foundational and
which were added later. The accretion is real; it is not
auditable from inside the manifests.

### E — Specification level is not policed

Idea 1's discipline — "say enough to be useful, not so much as to
be testable into death" — has no enforcement in the plan. There is
no critic or style rule that flags a manifest for being either too
vague to act on or too prescriptive to evolve. The level-band is
left to maintainer judgement.

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Just-vague-enough specifications | Partial | Mapping discipline embodies it; no critic enforces the level (gap E). |
| 2 | The frame-array was the deeper idea | Partial | Frames first-class; arrays unnamed (gap C; see §25.2 gap A). |
| 3 | Vocabulary accreted over time | Yes | SOR primitives kept distinct; provenance not recorded in manifests (gap D). |
| 4 | Parallel recognition is open | No | No fan-out primitive for many-instance recognition (gap A). |
| 5 | Match one, assume the rest | No | No assumption-over-set signal in the handoff schema (gap B). |

---

## Implication for the plan (no changes proposed here)

§25.6 is a retrospective with one live question — parallel
recognition — and one live regret — that frame-arrays remained
under-explored. The plan inherits both, which is honest: it leaves
the open problem open and carries forward the same emphasis on
single frames over families. The biggest opportunity is to name the
frame-array as a first-class shape (already noted in §25.2 gap A)
and to add a signal kind for "match one, assume the rest" in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
Provenance fields in agency and frame manifests
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
would close the auditability side of idea 3. These are recorded as
analysis only, and any such move falls under the "stop and ask"
rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
