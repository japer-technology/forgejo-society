# Section 8.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.7.md](som-8.7.md) — *Fringes* (Minsky, §8.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.7 names the two fringes by what they *carry*: the **lower fringe**
holds objective structural detail; the **upper fringe** holds
subjective goals and intentions. The same K-line spans both because
thinking requires connections between *things* and the *purposes
they serve*.

---

## The ideas Section 8.7 actually carries

1. **Too much detail destroys recognition.** Beyond a point, more
   detail makes a memory match fewer present situations, not more.
2. **Lower fringe weakens for that reason.** Memories must
   *forget* the last few layers of detail to remain reusable.
3. **Too much past goal destroys present purpose.** A memory that
   imposed the old goal would erase the current task.
4. **Upper fringe weakens for that reason.** Goals from the old
   task fade so present goals can lead.
5. **Both fringes serve relevance.** Each fringe weakens for a
   different reason but with the same effect: memories adapt to
   present purposes.
6. **Lower = structures = objective.** Things, parts, features.
7. **Upper = functions = subjective.** Goals, purposes, intentions.
8. **Things and purposes interpenetrate.** Language uses the same
   words for tools and for the acts they enable (saw, clamp, glue).
   Thinking depends on this link.

---

## What the implementation already absorbs

### Detail caps exist on perception (ideas 1, 2)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and the perception family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
do not load arbitrary detail: the `issue-kind-detector` and
`ambiguity-detector` classify and flag missing slots rather than
recording every token of the stimulus. The `cartographer`'s job is
to *map relevant files*, not to copy them. The plan's instinct
against unbounded detail capture is present.

### Forgetting exists (idea 2)

`memory/` records carry `decay_score` and a scheduled cron pass
proposes retirement of low-scored items
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The forgetting-critic
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
marks stale records for decay. Forgetting is a *named mechanism*.

### Goals do not survive into the next stimulus uncontrolled (ideas 3, 4)

Settlements close per-stimulus
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md));
the workspace sweep moves settled items into `memory/decisions/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A K-line's `restore_when` must match the new stimulus before any
of its old configuration is reused. Old goals do not silently
propagate into the new cycle.

### Things-and-purposes linkage (idea 8, partial)

Polynemes wake agencies across families simultaneously
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)):
`workflow-file` wakes safety *and* code agencies; `soul-file` wakes
identity *and* governance pathways. A single symbol carries both
the *what* (a path) and a hint at the *what-for* (a frame).

---

## What the implementation does not yet take into account

### A — Upper and lower fringes are not labelled

The K-line schema has weights but no per-agency *band* annotation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan cannot mark "these attachments carry lower-fringe
structural detail; these carry upper-fringe goal residue." Both
weaken together under decay; both fire together on reactivation.

### B — No "objective vs subjective" split in memory

Minsky's mapping is direct: lower fringe = things; upper fringe =
goals. The plan's memory classes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are organised by *write path*: events, episodic, semantic,
procedural, failure, frames, analogies, concepts, K-lines,
decisions. None is *thing-vs-goal* shaped. `semantic/` is closer
to things; `procedural/` is closer to goals — but no schema
enforces the distinction, and a K-line's attachments freely mix.

### C — Past goals can leak through reactivated K-lines

Idea 3's warning — "memories that arouse agents at too high a level
would tend to provide us with goals that are not appropriate" — is
not blocked by the plan. When `klines.ts` reactivates a successful
prior settlement, the entire `activation_snapshot` is boosted,
including agencies whose contribution to that old success was *to
articulate the old goal*. There is no upper-fringe gating that
checks "is this agency's role to set a goal, and if so, does the
new stimulus already have one?"

### D — Detail-overload protection is per-call, not per-memory

The cartographer's "map the relevant files" is a *budget* discipline
applied at the present stimulus
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
It does not apply to K-line `useful_context.files_read`, which
preloads whatever the old settlement said was useful
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A K-line from an old, larger task could preload more files than the
new, smaller task warrants — the lower-fringe overload Minsky
describes.

### E — Saw-vs-saw (noun-vs-verb) collapsing is not modelled

Idea 8's linguistic fact — the same word for a tool and the act —
is the kind of cross-family activation Minsky uses to motivate
upper-and-lower fringes meeting. Polynemes do excite multiple
agencies, but a *phrase* polyneme excites by surface pattern only
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is no structural polyneme that says "this token may name a
thing or an act; activate the agencies for both."

### F — Relevance-to-present is not measured per-fringe

The plan measures relevance to the present stimulus once, at
K-line match time (similarity of `restore_when`). Minsky measures
it twice, separately: lower fringe asks "do the present structural
features still match?" and upper fringe asks "is the present goal
still the old goal?" A single similarity score cannot answer both;
a K-line could match its `restore_when` features perfectly while
the new task has an entirely different goal.

---

## Summary table

| # | Idea from §8.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Too much detail destroys recognition | Yes | Cartographer + ambiguity-detector keep detail bounded. |
| 2 | Lower fringe weakens | Partial | Decay exists; per-agency band weakening does not (gap A). |
| 3 | Too much past goal destroys present purpose | No | Old goals can leak through reactivation (gap C). |
| 4 | Upper fringe weakens | No | No upper-fringe labelling (gap A). |
| 5 | Both fringes serve relevance | Partial | Relevance measured once, not per-fringe (gap F). |
| 6 | Lower = structures = objective | No | No thing-vs-goal split in memory (gap B). |
| 7 | Upper = functions = subjective | No | Same gap (gap B). |
| 8 | Things and purposes interpenetrate | Partial | Polynemes cross families; noun-vs-verb absent (gap E). |
| — | Detail-overload protection on K-line preload | No | Preloads whatever old settlement listed (gap D). |

---

## Implication for the plan (no changes proposed here)

§8.7 supplies the *meaning* of the two fringes: they are not just
mathematical fringes but two different kinds of content, with
different reasons for weakening. The plan absorbs detail-bounding
and forgetting as *quantitative* disciplines, but does not yet
record the *qualitative* split — objective structure vs subjective
goal — that gives Minsky's fringes their work. The most consequential
gap is goal-residue leakage (gap C): an old goal smuggled into a new
stimulus via K-line reactivation could quietly redirect a present
task. The most structural gap is band labelling (gap A), which
would make the others tractable. Closing these would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line schema; per-agency band field),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(memory class organisation), and
[`THE-SOCIETY-OF-REPO/06-memory/klines/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/klines/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
