# Section 8.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.5.md](som-8.5.md) — *Level-bands*
(Minsky, §8.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.5 introduces the *level-band* refinement of the K-line: agents
attached at different levels are bound with different strengths, so
the same K-line carries strong central connections and weak fringe
connections, the latter acting as default assumptions that retreat
under stronger present evidence.

---

## The ideas Section 8.5 actually carries

1. **Not all attachments are equal.** K-lines bind some agents
   firmly and others loosely.
2. **A central band, with fringes.** Strong connections lie at a
   particular level of detail; weaker connections lie above and
   below.
3. **Fringes are default assumptions.** Weakly attached agents fire
   only when no stronger present claim contradicts them.
4. **Defaults retreat under conflict.** A green-kite claim
   suppresses a default red-kite assumption with no fuss; only the
   default vanishes.
5. **Defaults supply commonsense.** "Kites have string" and "people
   have hands and feet" are default assumptions, not stored facts
   asserted on every recall.
6. **Default assumptions are valuable knowledge.** They are not
   noise. They are the typical, the usual, the unmarked.

---

## What the implementation already absorbs

### Weights on K-line attachments (idea 1)

The K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes `activation_snapshot.active_agencies` a map from agency id to
weight in `[0, 1]`. Weight differences are recorded; the schema
permits a central-strong-and-fringe-weak shape.

### Frame defaults (ideas 5, 6)

Frames declare `default_actions:`, `default_critics:`,
`default_censors:` and have a `linked_klines:` field that points to
the K-lines they normally co-activate
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
This is Minsky's commonsense layer in operational form: when the
`code-change` frame matches, the `evidence` and `scope` critics are
attached by default and the `revert-path-finder` is named by
default. The defaults are not noise; they are first-class.

### Defaults retreat under stronger evidence (idea 4)

Critics emit objections; censors block; suppressors halt outputs
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
When a critic sustains an objection, the default proposal is
weakened or removed at the settle phase
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
records `critics: sustained: true|false`). A frame's defaults can
be overridden by stimulus-specific evidence without retaliation.

### Graduated inhibition exists (ideas 2, 4)

The "graduated inhibition" step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
updates `activation.jsonl` after critics fire, lowering some weights
without zeroing them. This is the mechanism Minsky needs for "weak
connection retreats under conflict."

---

## What the implementation does not yet take into account

### A — There is no first-class "level-band" structure

Minsky's level-band is a named structural layer of a K-line: the
*upper band*, the *central band*, the *lower band*. The plan's
K-line schema has a flat weighted list. A reviewer cannot ask "what
sits in the upper band of this K-line?" because the schema does not
*partition* the attachments. Levels are encoded only as numbers on
a single axis (weight), not as labelled bands.

### B — Defaults are at the frame, not at the K-line

Idea 5 is that defaults travel *with the K-line*. In the plan they
travel with the frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A K-line can preload files (`useful_context.files_read`) but cannot
declare "by default assume *X* about the stimulus unless
contradicted." Default assumptions of the *experiential* kind ("the
last three times we touched this file, tests broke") live nowhere
on the K-line; they are inferred at retrieval time, if at all.

### C — Default values for missing slots are not named

A frame's required slots produce an objection when unfilled
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
critics on missing slots). Non-required slots are silently absent.
Minsky's section asks the opposite: when the present stimulus does
not specify, *fill in from the default*. The plan has no
`default_value:` on frame slots. The `code-change` frame's
`relevant_files`, when unfilled, is not auto-filled by "the files
most recently touched"; it raises an ambiguity-detector signal
instead
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).

### D — Strength of attachment does not decay differentially

K-lines have a single `decay_score`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
applied to the K-line as a whole. Minsky's mechanism is that *the
fringes weaken first*: an old K-line should keep its central band
intact while its upper and lower bands fade. The plan's decay does
not have per-band granularity, so a stale K-line either survives
intact or is retired wholesale.

### E — Default assumptions are not auditable as such

When a frame default fires (the `evidence` critic runs because the
frame attached it by default), the settlement records the critic
ran — but does not mark *it was a default*. There is no field on
the settlement saying "the following assumptions were drawn from
defaults, the following from present evidence." This makes the
audit asymmetric: the society can prove what it inferred, but it
cannot cleanly mark what it *assumed without checking*.

### F — Reactivation does not partition the attachments by band

When `klines.ts` fires a K-line, it boosts every agency in
`activation_snapshot.active_agencies` proportional to its weight
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is no rule that lower-band attachments fire only when present
evidence is silent, or that upper-band attachments fire only when
no present goal contradicts them. The plan applies weights
uniformly; Minsky's bands apply *conditionally*.

---

## Summary table

| # | Idea from §8.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Not all attachments are equal | Yes | Per-agency weight in `activation_snapshot`. |
| 2 | Central band with fringes | No | Flat weighted list; no labelled bands (gap A). |
| 3 | Fringes are default assumptions | Partial | Frame defaults exist; K-line defaults do not (gap B). |
| 4 | Defaults retreat under conflict | Yes | Critics, suppressors, graduated inhibition. |
| 5 | Defaults supply commonsense | Partial | At frame level only (gap B). |
| 6 | Default assumptions are valuable | Yes | First-class fields in frames. |
| — | Conditional firing by band | No | Weights applied uniformly (gap F). |
| — | Default-vs-evidence audit marker | No | Settlement does not distinguish them (gap E). |
| — | Default values for missing slots | No | Silent absence, not auto-fill (gap C). |
| — | Differential decay across bands | No | Single decay score per K-line (gap D). |

---

## Implication for the plan (no changes proposed here)

§8.5 is the section that turns the K-line from a binary list into a
*shaped* memory. The plan has the *mechanism* for differential
strength (weights) and for default behaviour (frame defaults,
graduated inhibition), but it has not yet introduced the *band*
structure that gives those mechanisms their organising principle.
The biggest unforced gap is auditability (gap E): the plan can
already retreat under conflict, but a reviewer cannot tell which
parts of the settled state were *defaults that no one challenged*
rather than *claims actively supported*. Closing these would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line schema, default fields),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(per-band decay), and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(default-marked proposals on settlements). These are recorded here
as analysis, not as a change request. Any move to close them falls
under the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md)
§12 and [CLAUDE.md](../../../CLAUDE.md).
