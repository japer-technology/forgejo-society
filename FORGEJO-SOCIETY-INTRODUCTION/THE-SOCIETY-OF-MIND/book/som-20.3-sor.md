# Section 20.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.3.md](som-20.3.md) — *Visual ambiguity*
(Minsky, §20.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.3 carries the ambiguity argument out of language and into
perception. The same shape is *blocks, an arch of arches, or one
nine-block arch* depending on which interpretation locks in. The same
glyph is read as H or A depending on neighbours. Different figures
look "the same" because the same description fits them all. What we
see is not given by stimulus alone; it depends on what is already
active inside our agencies.

---

## The ideas Section 20.3 actually carries

1. **Ambiguity is not a language phenomenon.** Vision is as
   ambiguous as speech.
2. **Multiple descriptions of one stimulus coexist.** Nine blocks,
   three arches, one super-arch — all are valid; one usually wins.
3. **Resolution is silent.** Higher agencies typically experience
   *no* conflict, even though one was resolved.
4. **Lower-level information is sometimes insufficient.** The
   identical H/A glyph cannot be resolved from the bitmap alone.
5. **Context from non-perceptual agencies feeds perception.**
   Language-related state shapes what perception reports.
6. **One description, many figures.** Different stimuli register as
   "the same" because a single description matches all of them.
7. **What we see depends on internal state.** Perception is the
   composition of input with what is already active.

---

## What the implementation already absorbs

### Stimulus is not raw input (ideas 1, 7)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and the perception family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
do not pass the issue body straight through. `issue-kind-detector`,
`cartographer`, `ambiguity-detector` produce a structured perception
*report* — a description, not a copy of the input. The implementation
acknowledges that perception is interpretation.

### Multiple frames can match (idea 2)

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
have `matches:` clauses that can fire on more than one frame at once
— `bug` and `security-sensitive` can both match a stimulus that
touches a workflow file and reports a defect. The plan represents
the multiplicity at intake.

### Context from non-perceptual sources is permitted (idea 5)

K-lines reactivated by `restore_when`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
inject prior configuration into the present cycle. Polynemes with
`default_frame` overrides
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
let internal state (path, label, phrase) shape framing. The
*conscious-presenter*'s prior settlement records can also bias
intake via memory recall.

---

## What the implementation does not yet take into account

### A — Resolution is loud, not silent

Idea 3 says higher agencies usually feel *no* conflict when an
ambiguity is resolved. The plan does the opposite: when multiple
frames or critics fire, the settlement records every objection
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
For audit this is right; for the §20.3 phenomenon — *silent*
resolution at low levels — there is no mechanism that resolves and
forgets.

### B — Multiple descriptions of one stimulus are not retained

The perception step picks *one* frame and proceeds
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The "blocks / arches / super-arch" multiplicity has no analogue:
runner-up readings are not stored, not weighted, and not available
for re-selection later in the cycle.

### C — No re-perception under higher-level context

The H/A glyph (idea 4) needs higher-level state to disambiguate
*back-into* perception. The plan's pipeline is one-way: perception
runs first, deliberation later
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Deliberation cannot ask perception to re-classify a token under a
new context.

### D — "Same description, different stimuli" is not exploited

Idea 6 — recognising different figures as "the same" because one
description fits all — is the basis of analogy. The plan has
analogies as a memory class
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and a `novel.frame.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
that mandates an analogy pass, but no agency *generates a
description abstract enough to match multiple stimuli*. The analogy
lookup matches by surface cues, not by re-described shape.

### E — Internal-state contribution to perception is not measured

Idea 7's "what we see depends on what is already inside" has no
audit. When perception reports a frame choice, the settlement does
not record *how much* of that choice came from the stimulus and how
much from a reactivated K-line or a `default_frame` override.

---

## Summary table

| # | Idea from §20.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Ambiguity is not just linguistic | Yes | Perception family treats stimulus as interpretable. |
| 2 | Multiple descriptions coexist | Partial | Multiple frames can match; only one is kept (gap B). |
| 3 | Resolution is silent | No | Every objection logged; no silent-resolve mechanism (gap A). |
| 4 | Lower-level info sometimes insufficient | Partial | No re-perception path under higher context (gap C). |
| 5 | Non-perceptual context shapes perception | Yes | K-line reactivation, `default_frame` overrides. |
| 6 | One description, many figures | Partial | Analogy class exists; abstract-description generation does not (gap D). |
| 7 | What we see depends on internal state | Partial | Honoured; not measured (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.3 generalises §20.2 from language to perception and adds two
sharp points: resolution is normally silent, and lower-level data
sometimes cannot decide on its own. The plan accepts that perception
is interpretation but treats the result as a single answer recorded
with all objections visible. The §20.3 gaps are about *retaining
multiplicity* (B), *silent resolution* (A), *back-pressure from
deliberation into perception* (C), and *abstract-description-based
analogy* (D).

Closing these would touch the pipeline shape in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the frame and polyneme schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
