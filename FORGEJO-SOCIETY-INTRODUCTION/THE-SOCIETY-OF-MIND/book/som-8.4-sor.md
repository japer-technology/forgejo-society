# Section 8.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.4.md](som-8.4.md) — *Partial mental
states* (Minsky, §8.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.4 introduces *partial mental states*: descriptions that specify
the activity of some agencies and stay silent about the rest. The
section also asserts that minds are organised into *divisions*, each
holding its own partial state, and that two partial states imposed
on the same division produce conflict.

---

## The ideas Section 8.4 actually carries

1. **Divisions exist.** The mind is composed of divisions — vision,
   locomotion, language, and so on — each with its own activity.
2. **Recursive division.** The same pattern repeats inside each
   division on smaller scales.
3. **Total state vs partial state.** A total state names every
   agent's on/off value; a partial state names only some agents and
   says nothing about the rest.
4. **One total state at a time, many partial states at a time.**
   Partial states *coexist* because they are incomplete descriptions.
5. **On/off simplification.** Agents are treated as either active or
   quiet; partial arousal is set aside for technical reasons.
6. **Many thoughts at once.** Because partial states coexist, the
   mind can think several thoughts simultaneously — speech and
   vision at once, for example.
7. **Same-division conflict.** Two K-lines imposing different
   partial states on the same division compete; "round square" leaves
   the shape division undefined under noncompromise.

---

## What the implementation already absorbs

### Divisions as agency families (ideas 1, 2)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
groups agencies into families — perception, memory, code, safety,
identity, integration, assembly, meta-admin — and each family has a
directory under `agencies/<family>/`. The recursive pattern (idea 2)
is also visible: within `code/` there are workers, critics in
`critics/`, and meta agencies in `meta-admin/`. The identifier
protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
makes the family the first segment after the scope.

### Partial state as recorded data (ideas 3, 4)

The activation record at `state/mind/issues/<n>/activation.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
lists which agencies woke and by how much, and is silent about the
rest. The K-line's `activation_snapshot.active_agencies`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
names some agencies and is silent about the others. Both are
partial states in Minsky's sense, recorded as such.

### Parallel activity within a cycle (idea 6)

The deliberate phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
runs across agencies — multiple families fire signals into the
same `signals.jsonl` per cycle. Perception and memory agencies can
emit signals in the same cycle as code agencies. The job topology
in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
sequences *phases*, but within a phase agencies operate in parallel.

### Same-division conflict has a name (idea 7)

When two proposals in the same family conflict (two code-patches
that touch the same lines, two memory suggestions that point to
opposite prior decisions), the critic and censor passes treat that
as an objection
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
and `policy.ts` may remove the conflicting tools
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
A noncompromise outcome is a *blocked* settlement.

---

## What the implementation does not yet take into account

### A — The agency family is a coarser unit than Minsky's division

Minsky's "division" is the unit on which two partial states
*compete*. The plan's family is an organisational grouping, but the
conflict surface is the *file* (a code-patch hunk, a settlement
slot), not the family. Two code-family agencies can edit different
files without conflict; two memory-family agencies can record into
different memory subtrees. The plan does not have a named
"competing partial state" boundary; the conflict surface is
implicit in the artefact being written.

### B — On/off is the only granularity that exists in K-lines

Idea 5 is the simplification Minsky adopts for pedagogy: agents are
on or off. The K-line schema's `activation_snapshot.active_agencies`
is a weight in `[0, 1]`, not a boolean. This is *richer* than
Minsky's pedagogical move, which is fine, but it also means the
plan's "partial state" definition is *agency → weight*, not *agency
→ {on, off}*. Idea 3's clean partial-vs-total distinction blurs:
every state is partial in some weight sense, and "total" loses its
meaning.

### C — There is no "total state" record

The plan can construct a partial state at any moment (signals,
activation log, settlement snapshot). It cannot construct a *total*
state — the full list of every agency with its value at one moment
— because some agencies never fire on a given stimulus and never
appear in the activation log. Minsky's total state is conceptual;
the plan would need a *complete enumeration* against the agency
catalogue to produce one, and that enumeration is not a recorded
artefact.

### D — Several thoughts at once is bounded by the workflow phase

The plan does support parallel agency activity (idea 6), but only
*within* a single workflow phase
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
linear job chain). Two stimuli with separate stimulus keys do run
concurrently (the workflow concurrency group is per-stimulus), but
a single stimulus does not pursue two independent thought-streams
through the same cycle. Minsky's "speech while looking for a door"
is *one stimulus, two divisions in parallel*; the plan's analogue
is closer to *one stimulus, one cycle, multiple agencies within
each phase*.

### E — Round-square is the unhandled case

Idea 7's noncompromise outcome — both shape-claims suppressed,
leaving an undefined shape — is not a settlement status the plan
records explicitly. The settlement outcome enum
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
is `success | partial | failed | blocked | pending_human`. A
*self-cancelling* outcome — two strong proposals that mutually
suppressed each other and left a *gap* in the settlement slots —
falls under `partial` or `blocked` but has no distinguishing
marker. A reviewer cannot tell "this was blocked by external policy"
from "this was blocked by internal contradiction."

### F — Default assumptions for unfilled slots are not yet partial-state-aware

The frame schema declares `slots:` with `required: true|false`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
An unfilled non-required slot is *silently absent*, not *explicitly
unspecified*. Minsky's partial state distinguishes "not said" from
"not active"; the plan tends to collapse them. The settlement's
`unknowns:` field is the closest analogue but is for items the
society itself flagged as unresolved, not for items left unspecified
because the frame did not need them.

---

## Summary table

| # | Idea from §8.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Divisions exist | Partial | Agency families exist; not the conflict surface (gap A). |
| 2 | Recursive division | Yes | Family → kind → file hierarchy. |
| 3 | Total vs partial state | Partial | Partial recorded; total not constructible (gap C). |
| 4 | Many partial states at once | Yes | activation log + signals are simultaneously valid. |
| 5 | On/off simplification | No (richer) | Weights, not booleans (gap B; arguably an improvement). |
| 6 | Many thoughts at once | Partial | Parallel within a phase; not parallel streams within a stimulus (gap D). |
| 7 | Same-division conflict | Partial | Detected; round-square outcome not distinct (gap E). |
| — | Unfilled slots as partial-state markers | No | `unknowns:` covers a different case (gap F). |

---

## Implication for the plan (no changes proposed here)

§8.4 supplies the vocabulary the plan implicitly uses: families
behave as divisions, activation logs as partial states, parallel
agencies within a phase as simultaneous thoughts. The mismatches
are around *granularity* (weights instead of on/off; family
organisation instead of competing-state divisions), *completeness*
(no total state), and *unhandled outcomes* (round-square is not a
distinct settlement status). These are recorded here as analysis,
not as a change request. Closing them would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(settlement status enum, slot-state markers),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(frame slot defaults), and
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md).
Any move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
