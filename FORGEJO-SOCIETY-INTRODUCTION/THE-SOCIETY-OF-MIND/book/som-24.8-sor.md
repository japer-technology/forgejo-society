# Section 24.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.8.md](som-24.8.md) — *How picture-frames
work* (Minsky, §24.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.8 makes picture-frames mechanical: the same direction-neme that
moves the eye also activates the K-line that records or replays what
is seen from that direction. The remarkable consequence is that
*recollection runs through the same machinery as perception*, which
is what gives memory its near-perceptual vividness.

---

## The ideas Section 24.8 actually carries

1. **One handle drives both the act and its recording.** The
   direction-neme that aims the eye also writes (or reads) the
   K-line indexed by that direction.
2. **Recording is symmetric with replay.** The same circuit serves
   intake and recollection; the only difference is which K-lines
   are *ready to learn* at the moment.
3. **Recollection feels real because it uses the perceptual
   substrate.** Memory is vivid not by simulation but by sharing
   wiring.
4. **The mind's eye is the mechanism of imagined movement.**
   Looking-in-imagination is the same operation as looking-in-fact,
   minus the world.

---

## What the implementation already absorbs

### One handle, two roles (idea 1, partial)

The `stimulus_id` in the signal and handoff schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
serves a similar dual purpose: it identifies the live stimulus *and*
keys the per-stimulus K-line cue. Path-polynemes do something
analogous in repo-space — a path glob both routes the live response
and indexes the K-line catalogue.

### Symmetric record/replay around K-lines (ideas 2, 3)

The K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
records `cue`, `activation_snapshot`, and `restore_when`. The
`remember` phase writes K-lines; the `activate` phase replays them
via the same matcher. The runtime modules differ (`memory.ts`
versus `klines.ts`), but the *shape* of the data is the same —
write and read share a schema.

### Imagined branches as "mind's eye" (idea 4)

`possibility-2.md`'s "imagined branches" framing is preserved by
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md):
`society/<stimulus_id>/candidate-<n>` is a *real* branch that
represents an *imagined* future. The branch + diff + (un-merged)
settlement is the operational analogue of looking-in-imagination.

---

## What the implementation does not yet take into account

### A — No "learning mode" flag on K-lines or slots

Idea 2 turns on a switch: K-lines must be *ready to learn* in
record-mode but only ready to fire in replay-mode. The K-line
schema has `reinforcement.reuse_count` and `last_reused_at`, which
imply such states exist, but there is no explicit `mode ∈
{record, replay, frozen}` field on a K-line, and no documented rule
about when a K-line stops accepting new updates.

### B — Same handle for perceive and act is not exploited

Path-polynemes are used in `perceive`; they are not the *same*
object that drives `act`. Each phase reads its own configuration.
The plan could in principle let one handle (a path glob, a stimulus
key) drive both reading from memory and writing to memory at the
same coordinates, the way Minsky's direction-neme does — but the
pipeline keeps the phases sealed.

### C — Imagination is a branch, not a frame state

The "mind's eye" mechanism described in idea 4 is *internal*: the
mind looks without acting. The plan's nearest analogue is a Git
branch, which is *external* (it writes commits, branches, and
diff-summaries to disk). There is no in-memory imagination that
does *not* leave a Git trace. This is a deliberate choice (audit,
governance) but worth recording as a divergence from §24.8's
psychology.

### D — Recollection is not engineered to feel like perception

The conscious presenter assembles a coherent final response from
the settled blackboard
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
but there is no requirement that *quoted memory* be presented in
the same form as *fresh observation*. The voice rules in
[AGENTS.md](../../../AGENTS.md) actually push the other way —
distinguish remembered from new, do not blur. This is a defensible
divergence, again worth noting.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | One handle drives act + recording | Partial | `stimulus_id` and path-polynemes serve dual roles (gap B). |
| 2 | Symmetric record / replay | Partial | Shared K-line schema; no explicit learning-mode flag (gap A). |
| 3 | Recollection uses perceptual substrate | Partial | K-line reactivation reuses activation machinery; no "vividness" intent (gap D). |
| 4 | Mind's eye = imagined movement | Partial | Branches imagine externally, not internally (gap C). |

---

## Implication for the plan (no changes proposed here)

§24.8 highlights a deliberate choice rather than an oversight: the
plan externalises imagination to Git rather than keeping it inside
the runtime. This is right for governance and audit but is a
divergence from Minsky's psychology worth recording so future
maintainers do not "fix" it by accident. The substantive
opportunity is gap A — a `mode ∈ {record, replay, frozen}` flag on
K-lines — and gap B — letting a single handle drive both reading and
writing. Closing any of A–D would touch the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
