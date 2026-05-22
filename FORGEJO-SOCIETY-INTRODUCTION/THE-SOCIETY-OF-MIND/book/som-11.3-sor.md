# Section 11.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.3.md](som-11.3.md) — *Nearnesses* (Minsky, §11.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.3 turns the §11.2 abstraction into mechanism. Nerves from the
skin run in roughly parallel bundles, so nearby skin spots map to
nearby brain spots. Two stimuli that excite overlapping sensors
produce overlapping inner states, and that overlap *is* their
perceived similarity. A mapping agency can then *tidy up* the
inevitable wiring crossings into a usable map.

---

## The ideas Section 11.3 actually carries

1. **Wiring topology preserves nearness.** Parallel nerve bundles
   carry adjacency forward; that adjacency is the substrate for
   later concepts of space.
2. **Overlap of activation is similarity.** Two stimuli "feel" alike
   to the extent that they recruit the same downstream agencies.
3. **Maps are constructed, not given.** A second-order agency
   *builds* the spatial map from co-activation over time; the map
   is not pre-wired.
4. **Tidy-up agencies correct irregularities.** Real wiring crosses;
   the brain compensates. The map is the result of work, not of raw
   geometry.
5. **Learning the layout is a long journey.** Even after the skin
   map is built, the world beyond the skin takes years of further
   construction.

---

## What the implementation already absorbs

### Wiring topology as path polynemes (idea 1)

`path-polynemes.yml` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
groups paths by their *adjacency in the repository*: everything
under `.forgejo/workflows/**` excites the same agencies; everything
under `.forgejo-society/agencies/**` excites another set. The
repository's directory tree is the runtime's "skin", and the path
polynemes are its parallel nerve bundles — co-located paths feed
co-located cognition.

### Activation overlap as similarity (idea 2)

The K-line `restore_when` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
matches against the *symbols* (polyneme symbols) active at success.
Two stimuli that wake the same symbols inherit the same K-lines.
That is §11.3's "overlap is similarity" in operational dress.

### Maps are constructed (idea 3)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
specifies `memory/concepts/` as a tree of *candidate abstractions
awaiting governance*, and `memory/frames/` as *learned frames
produced by meta-admin*. The structural maps of the runtime's world
are first-class artefacts, written by the meta-admin family over
time, not bolted on at boot.

### Tidy-up agencies (idea 4)

The meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
exists for exactly this: `agency.meta-admin.differentiation-broker`
splits over-broad agencies; `agency.meta-admin.retirement-broker`
removes dead ones; `agency.meta-admin.ecology-monitor` runs the
scheduled tidy-up over the whole runtime.

---

## What the implementation does not yet take into account

### A — No co-activation index

Idea 2 says similarity *is* overlap of activation. The plan records
`activation.jsonl` per stimulus
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
but never aggregates across stimuli into "which agencies tend to
fire together". Without that index, no map of the society's own
internal nearness is built. The skin-to-brain step happens; the
brain-to-map step does not.

### B — Polyneme weights are authored, not learned

In §11.3, parallel bundles produce the initial map *and then* the
map is corrected by experience. The plan's polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
have weights in `excite:` and `inhibit:` that are written by hand
and changed only by `self-modification` settlement. There is no
runtime mechanism that nudges a weight up when the excitation
proved useful.

### C — No "advancing edge" detector

§11.3 makes the lovely point that as a finger moves, *new* sensors
fire on the advancing edge — and that change itself is the cue. The
plan's `perceive` phase records percepts but does not distinguish
*new* polyneme activations from continuing ones. A "delta" view of
activation is not part of `activation.jsonl`.

### D — Cron tidy-up exists; cartographic tidy-up does not

The meta-admin family tidies *agencies* (differentiation,
retirement). It does not tidy the *map*: there is no scheduled pass
that re-clusters K-lines by cue similarity, no pass that proposes a
new polyneme when two existing ones always fire together. The cron
loop in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
sweeps state and decays K-lines; it does not redraw the map.

---

## Summary table

| # | Idea from §11.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Wiring topology preserves nearness | Yes | Path polynemes mirror directory adjacency. |
| 2 | Overlap of activation is similarity | Partial | K-line `restore_when` uses it; no aggregated co-activation index (gap A). |
| 3 | Maps are constructed | Yes | `memory/concepts/`, `memory/frames/`, meta-admin authorship. |
| 4 | Tidy-up agencies | Partial | Agency-level tidy exists; map-level tidy does not (gap D). |
| 5 | Learning the layout is a long journey | Yes (implicit) | Phased bootstrap; first-ship catalogue admits successors. |
| — | Polyneme weights learned by use | No | Weights authored; reinforcement is logged not applied (gap B). |
| — | New-edge / delta perception | No | Activation recorded as state; not as change (gap C). |

---

## Implication for the plan (no changes proposed here)

§11.3 reads the plan's polynemes as a successful first step — a
parallel-bundle topology that preserves directory adjacency in
cognitive adjacency. The unfinished part is everything that comes
*after* the wiring: a co-activation index (gap A), a learned weight
on a polyneme link (gap B), a delta-activation view of the percept
stream (gap C), and a scheduled cartographic tidy-up that proposes
new symbols or re-clusters K-lines (gap D).

Gaps B and D in particular connect to a recurring opening: the
plan's `evolution/reinforcement-log.md` is a *log* and not yet a
*loop*. §11.3 sharpens the cost of that — without the loop, the
society's inner geometry cannot be redrawn by experience.

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the credit-assignment protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
