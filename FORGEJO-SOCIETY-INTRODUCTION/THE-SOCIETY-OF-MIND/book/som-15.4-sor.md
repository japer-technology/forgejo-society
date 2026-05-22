# Section 15.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.4.md](som-15.4.md) — *Memories of
memories* (Minsky, §15.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.4 makes a load-bearing claim: a memory is not a stored object
but a *process that makes some agents act as they did before*.
Recall is reconstruction. Early memories are unreadable in adult
script. Recent perception is mostly memory. Recognition is silent;
*remembering* is the word reserved for processes slow enough to be
noticed.

---

## The ideas Section 15.4 actually carries

1. **Memories are processes, not records.** "Memories are
   processes that make some of our agents act in much the same ways
   they did at various times in the past."
2. **Recall is reconstruction.** What is retrieved is not the past
   state but a re-creation by the present mind.
3. **Old memories require their old reader.** To recover an
   infant memory you would have to become an infant again; the
   script is unreadable to the later self.
4. **Outgrowing infancy requires sacrificing its memories.** The
   amnesia is structural, not decay.
5. **Recent perception is also reconstruction.** Most of what we
   "see" is what the seeing-agents evoked from memory.
6. **Fast retrieval is invisible.** When recognition is quick we
   say "seeing"; only slow retrieval is called "remembering".
7. **Consciousness requires short-term memory traces.** Processes
   that leave too few traces for the rest of the mind to
   contemplate are unconscious by that fact alone.
8. **"Memory" is not one thing.** The word covers many mechanisms
   and only loose general usage holds them together.

---

## What the implementation already absorbs

### Memory-as-process appears in K-lines (idea 1)

K-lines are explicitly *remembered configurations*, not stored
content
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md);
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md)).
Reactivation boosts the agencies that worked before; it does not
replay the prior settlement. The closest match to Minsky's
"process that makes some of our agents act in much the same
ways" is the K-line `activation_snapshot`.

### Recall is reconstruction (idea 2)

`klines.ts` reactivates an `activation_snapshot` against the
current stimulus, and the resulting deliberation runs from the
boosted agencies forward
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The settlement is composed anew each run; nothing is *replayed*.
Even `memory/episodic/<iso8601>-issue-<n>.md` is consulted as
material, not enacted as a playback.

### Many memory mechanisms exist (idea 8)

`memory/` is subdivided into `events/`, `episodic/`, `semantic/`,
`procedural/`, `failure/`, `frames/`, `analogies/`, `concepts/`,
`klines/`, `decisions/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Each has its own write rule and its own grain. The plan never
treats "memory" as a single thing in the runtime; the singular
appears only in headings.

### Recognition is mostly silent (ideas 5, 6)

The perception family — `issue-kind-detector`, `intake-bee`,
`ambiguity-detector`, `urgency-detector`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— classifies the stimulus by matching against polynemes, frames,
and prior K-line cues without narrating "I remembered that
`security-sensitive` matches files in `.forgejo/workflows/**`".
The match happens; the presenter speaks only at settlement.

### The conscious / unconscious split tracks trace-leaving (idea 7)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)'s
conscious-bottleneck rule makes the visible response the only
public output. Agencies that emit no signal, leave no row in
`signals.jsonl`, and do not feed the settlement are, in this
project's sense, unconscious — they happened and were not made
into public text.

---

## What the implementation does not yet take into account

### A — Episodic records are stored, not reconstructed

Idea 1's strongest reading is the strongest gap.
`memory/episodic/` files are written as Markdown narratives by
the archivist and *read back as text*
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A later agency that consults an episodic entry gets the narrative
*directly*, not a reconstruction by the *present* mind from
sparser cues. For episodic memory, the plan still treats memory
as stored object, not process.

### B — No analogue of "the script becomes unreadable"

Idea 3 (and idea 4) — old memories whose readers no longer exist
— has no counterpart. The plan retires K-lines via `decay_score`
and the meta-admin sweep, but nothing represents the case where a
record is still on disk yet *the current agency set can no longer
make sense of it*. An old `procedural/` entry written for a now-
retired agency still parses; the implementation has no test that
asks whether the agencies it references still exist.

### C — Schema versioning is a discipline, not a reader check

`state/` carries a `schema-version` file
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
but there is no per-record schema check at read time. Records
written under an earlier schema would be read as if under the
current one, with no version-aware accommodation. Minsky's
"unreadable script" gets *closer* to operational form here than
anywhere else in the plan, but the check is not made.

### D — Recognition is not labelled as "memory in disguise"

Idea 5 — most perception is reconstruction from memory — is not
how the plan describes its own perception phase.
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
lists perception, frame selection, and K-line activation as three
*separate* steps. In §15.4's reading they would be one process in
which perception is mostly the retrieval step. The plan's
modularity here is operationally clean but loses Minsky's point.

### E — "Memories that leave no trace are unconscious" is not a rule

Idea 7 is operationally precise: trace-presence determines
conscious-status. The plan has the conscious bottleneck but no
explicit gate that says "an agency's contribution becomes
public-text-eligible only if it left a row in `signals.jsonl`
that the settlement consumed." The presenter could in principle
narrate something for which no trace exists.

### F — No "fast retrieval is invisible" gate on the presenter

Idea 6's distinction — `seeing` for fast retrievals, `remembering`
for slow ones — could be honoured by the presenter, which today
treats every read of memory as equally narratable. A reuse of a
fresh, just-written K-line and a retrieval of a months-old
analogy both surface (or both stay silent) by the same rules. The
plan has no latency-of-retrieval lens.

---

## Summary table

| # | Idea from §15.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Memories are processes | Partial | True for K-lines; not for `episodic/` and `semantic/` (gap A). |
| 2 | Recall is reconstruction | Partial | True for K-line activation; episodic recall is text replay (gap A). |
| 3 | Old memories need their old reader | No | No reader-fit check (gap B). |
| 4 | Outgrowing infancy sacrifices its memories | No | No structural retirement of unreadable records (gap B). |
| 5 | Recent perception is reconstruction | No (by structure) | Perception, frames, K-lines are separate phases (gap D). |
| 6 | Fast retrieval is invisible | No | Presenter has no latency-of-retrieval lens (gap F). |
| 7 | Consciousness requires short-term traces | Partial | Conscious bottleneck exists; trace-presence is not a gate (gap E). |
| 8 | "Memory" is not one thing | Yes | Ten memory subtrees with different write rules. |
| — | Schema-readability of old records | Partial | `schema-version` exists; no read-time check (gap C). |

---

## Implication for the plan (no changes proposed here)

§15.4 quietly redefines memory. The plan's K-line layer absorbs the
redefinition; the rest of memory still operates on the
stored-object model the section argues against. The most
consequential single opportunity is gap A — recasting episodic
recall as *cues plus present reconstruction* rather than narrative
retrieval — because that would propagate Minsky's "memories are
processes" beyond K-lines into the rest of `memory/`. The most
characteristically Minskyan gap is gap B: representing the case
where a record outlives the readers that could make sense of it.
Closing any of these would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(memory class shapes),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line schema and reactivation), and
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
