# Section 15.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.6.md](som-15.6.md) — *Many kinds of
memory* (Minsky, §15.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.6 denies the existence of a single common memory system. Each
part of the brain runs several memory-agencies in different ways
for different purposes. The section also notes that long-term
consolidation has prerequisites and rate limits, and that lesion
evidence proves the systems are dissociable.

---

## The ideas Section 15.6 actually carries

1. **There is no single, common memory system.** Each part of
   the brain has several memory-agencies of different kinds.
2. **Different content has different lifetimes.** Sensations
   linger seconds; habits and styles persist days to weeks;
   attachments endure months or years.
3. **Some knowledge is timeless.** Facts like "twelve inches make
   a foot" feel detached from any episode.
4. **Some knowledge is bound to place or time.** Memories of
   places lived; episodes that can be re-experienced.
5. **Forgetting may not be decay.** Apparent fade may be
   interference from other memories rather than inherent loss.
6. **Lesions dissociate memory kinds.** Loss of names, faces, or
   tunes can occur independently; new-formation can fail while
   old-recall succeeds.
7. **Long-term consolidation has prerequisites.** Long-term
   memory cannot form unless short-term antecedents persist for
   certain intervals.
8. **Long-term construction has a rate limit.** Despite legends,
   long-term encoding is bounded.

---

## What the implementation already absorbs

### Many memory kinds, with different write rules (idea 1)

`memory/` is subdivided into `events/`, `episodic/`, `semantic/`,
`procedural/`, `failure/`, `frames/`, `analogies/`, `concepts/`,
`klines/`, `decisions/` — each with its own owner and write rule
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The plan never treats memory as one mechanism.

### Multiple lifetimes are first-class (idea 2)

`state/` (per-run), `workspace/` (short-term, swept after
settlement), and `memory/` (durable) are explicitly three
lifetimes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Within `memory/`, decay scores and the meta-admin sweep create
further lifetime gradations.

### Timeless vs episodic knowledge (ideas 3, 4)

`memory/semantic/` carries time-detached facts —
`decisions.log`, `preferences.log`, `project-laws.log`.
`memory/episodic/` carries `<iso8601>-issue-<n>.md` narratives
bound to a stimulus moment. The semantic / episodic split tracks
Minsky's distinction.

### Consolidation has prerequisites (idea 7)

Promotion is one-way: `state/` and `workspace/` may feed
`memory/`; nothing demotes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The archivist writes to `memory/` only on settlement, and a
K-line is written only when the settlement outcome is `success`
or `partial` and the useful context is non-empty
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is a real "you must reach settlement first" prerequisite.

### Dissociability (idea 6, partial)

The memory family has separate agencies for separate jobs:
`prior-decision-resonator` reads semantic-style memory,
`kline-retriever` reads K-lines, `contradiction-finder` reads
semantic against new actions, `forgetting-critic` marks stale
records
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
A failure in one would not silently take down the others.

---

## What the implementation does not yet take into account

### A — Lifetimes are coarse-grained (idea 2)

The plan has three buckets (run, workspace, durable). Minsky's
seconds / minutes / days / weeks / months / years is finer. There
is no "habit / style" tier with a weeks-long retention rule, no
"attachment" tier with a months-long one. The decay score is one
scalar across all classes, modulated by reuse, rather than
class-typed lifetimes.

### B — Interference is not modelled (idea 5)

Minsky's preferred explanation for fade — interference — has no
operational counterpart. Decay is treated as a time-and-reuse
score
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
not as competition between similar memories. Two K-lines whose
`restore_when` overlap heavily compete only at retrieval (the cap
on `max_k_lines_loaded`), not at storage.

### C — Consolidation interval is not enforced

Idea 7's precise claim — *certain intervals* of short-term
persistence are required for long-term formation — has no analogue.
The archivist can write to `memory/` immediately at settlement,
regardless of how briefly the contributing material existed in
`state/`. A K-line built from a one-phase deliberation enters
durable memory under the same rule as one built from many phases.

### D — Rate limit on consolidation is absent

Idea 8 — long-term encoding is bounded — is not in the plan. There
is no cap on how many K-lines, semantic entries, or episodic
narratives a single settlement may write. A pathological run
that touches many concerns could write many durable records in one
archiver call.

### E — Lesion-style dissociability is not tested

Idea 6 is operationalised in cognitive science by *injury*:
remove one mechanism, see what fails. The plan has no fault-mode
test that says "with `agency.memory.prior-decision-resonator`
disabled, the loop should still settle." Dissociability is true
by construction (separate files); it is not verified by drill.

### F — No "timeless facts" partition within semantic

`semantic/` mixes `decisions.log` (which can be superseded),
`preferences.log` (which evolves), and `project-laws.log` (which
"the society must respect"
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The third is the closest to Minsky's "twelve inches make a foot"
shape, but the schema does not separate timeless facts from
revisable ones beyond the file name. A timeless fact and a
revisable preference can both be written with the same record
format.

### G — Place- and time-bound retrieval has no cue

Idea 4 — memories bound to place or time — would be served by
retrieval cues of the form "what did we decide when working on
this file" or "what happened during the last week". The plan
indexes `episodic/` by `<iso8601>-issue-<n>` filename only; there
is no temporal-window query, no path-bound query.

---

## Summary table

| # | Idea from §15.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No single memory system | Yes | Ten memory subtrees. |
| 2 | Many lifetimes | Partial | Three buckets; finer grain absent (gap A). |
| 3 | Timeless knowledge | Partial | `project-laws.log` exists; not schema-separated (gap F). |
| 4 | Place- and time-bound | Partial | `episodic/` carries timestamps; no temporal-window retrieval (gap G). |
| 5 | Forgetting may be interference | No | Decay is reuse-only (gap B). |
| 6 | Lesions dissociate | Partial | Separate agencies; not drill-tested (gap E). |
| 7 | Consolidation has prerequisites | Partial | Settlement gate yes; interval rule no (gap C). |
| 8 | Consolidation has rate limit | No | No cap on per-settlement durable writes (gap D). |

---

## Implication for the plan (no changes proposed here)

§15.6 lands a long list of empirical constraints on what memory
mechanisms must look like. The plan honours the *multiplicity*
(many subtrees, many lifetimes, many memory agencies) and the
*direction* of consolidation (one-way, settlement-gated). What it
does not yet honour are the *bounds*: interference (gap B),
consolidation interval (gap C), encoding rate (gap D), and the
dissociability drill (gap E). The most consequential single
opportunity is gap B — modelling interference — because it is the
mechanism that would make the K-line subsystem *behave* more like
the memory it imitates: closely-overlapping K-lines should compete
for storage, not just for retrieval. Closing any of these would
touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(retention rules; consolidation gates),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line schema for interference scoring), and
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
