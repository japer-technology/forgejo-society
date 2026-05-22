# Section 6.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.11.md](som-6.11.md) — *In-sight*
(Minsky, §6.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§6.11 dismisses biofeedback-style insight as an answer to mind. Even
if every neural signal were visible, no theory would emerge from the
data; and inside the brain, the many specialised organs share no
common code that would let them inspect each other.

---

## The ideas Section 6.11 actually carries

1. **Seeing the signals does not yield understanding.** Observation
   without theory is insufficient.
2. **Data needs *at least* the beginning of a theory.**
   Interpretation precedes reading.
3. **Ideas come from communities — outside *and inside* the head.**
   No agency manufactures thought directly; it convenes
   sub-machines.
4. **Hundreds of kinds of submachines, evolved at different times.**
   Each has its own architecture.
5. **No common language code across submachines.** Each
   specialised agency uses its own form of representation.
6. **Most pairs of agents cannot communicate at all.** P asking Q
   a question often fails not because Q is silent but because
   P–Q is not a translatable pair.

---

## What the implementation already absorbs

### Observation needs theory (ideas 1–2)

The Handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
requires every claim to carry `method` (`retrieval | rule |
local-model | hybrid`) along with evidence. A raw signal cannot
become a claim without a method that interpreted it. The Signal
schema's mandatory non-empty `evidence` array, combined with
`critic.source-quality` and `critic.evidence`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
enforces idea 1 directly.

### Ideas come from sub-machines, not from one agency (ideas 3–4)

The first-ship agency catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
splits cognition into families: perception, memory, code, safety,
identity, integration, assembly, meta-admin. No agency thinks for
the society alone; each one contributes a fragment. The integration
family explicitly *convenes* the others into the settled brief.

### Different forms of representation (ideas 4–5)

The runtime carries multiple record types — Signal, Handoff,
Settlement, K-line, Manifest — each with a different schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Frames are YAML; K-lines are YAML; agency prompts are Markdown
bodies; relational memory is graph-typed; reinforcement logs are
free-form per
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
The plan does not pretend to a single internal language.

### Communication has structure (idea 6, partial)

`activates_on` and `inhibits` in the Manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
declare *which* signals an agency reacts to; an agency does not
respond to arbitrary signals from arbitrary peers. P–Q communication
is mediated by the signal vocabulary and by the polyneme/frame
layer, never by direct call.

---

## What the implementation does not yet take into account

### A — A common JSON-Schema-typed substrate hides the §6.11 reality

The plan absorbs idea 5 *partially* but undermines it in one
direction: every record (Signal, Handoff, Settlement, K-line,
Manifest) is validated against a JSON Schema, and all of them share
the same fundamental envelope (JSON/YAML, dotted identifiers, typed
links, timestamps). Minsky's claim is that subsystems do *not* share
a representation; the plan gives them a *minimal* shared
representation by construction. This is a deliberate tractability
move, but it is a divergence worth recording.

### B — No notion of "P and Q cannot translate"

Idea 6 says most pairs cannot communicate at all. The plan has no
record of *which agency pairs are translation-failure pairs*. Every
agency in principle can read every signal whose name it declares in
`activates_on`. There is no concept of an *untranslatable* claim —
a signal that exists but that the target agency cannot interpret.
Either an agency subscribes to the signal name (and reads it) or it
does not (and ignores it). Silent partial comprehension has no
representation.

### C — No biofeedback-style "raw signal" view that proves useless

§6.11's rhetorical move is to imagine *being able* to see all neural
signals and then noting it would not help. The plan does have a
biofeedback-equivalent — the JSONL traces in
`state/mind/issues/<n>/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
— and arguably *does* help, because schemas type the signals. This
inverts Minsky's claim. Whether that inversion is faithful to the
section's broader argument (theory still required to *interpret*
the typed trace) is not articulated.

### D — Hundreds-of-kinds-of-submachines is not a goal

The first-ship agency catalogue is intentionally small
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Minsky's §6.11 implies that genuine cognition will require *many
more*, with *different* architectures, evolved at different times.
The plan has differentiation- and retirement-brokers for population
change, but no statement of an *expected eventual scale* — no
target like "a mature society has hundreds of agencies." The shape
of growth is left implicit.

### E — Evolved-at-different-times is structurally absent

The evolutionary timescale gap noted in the §1.1 analysis (gap A
there) recurs here: §6.11 explicitly says these specialists exist
*because* of millions of years of differentiated selection. The
plan's evolution tooling (`evolution/reinforcement-log.md`,
ecology review) operates on *current* statistics, not on
*phylogenetic* descent. The history of why this agency exists is
recorded only as a procedural-memory entry, not as a lineage.

---

## Summary table

| # | Idea from §6.11 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Observation needs theory | Yes | Required `method` field on claims; evidence critic. |
| 2 | Data interpretation precedes reading | Yes | Schema validation, typed signals. |
| 3 | Ideas come from sub-machines | Yes | Agency family catalogue. |
| 4 | Many kinds, different architectures | Partial | Multiple schemas; small catalogue (gap D). |
| 5 | No common language across submachines | Partial | Distinct record types share a typed envelope (gap A). |
| 6 | Most pairs cannot communicate | Partial | `activates_on` mediates; no untranslatability slot (gap B). |
| — | Biofeedback-inversion articulation | No | Gap C. |
| — | Phylogenetic descent of agencies | No | Gap E. |

---

## Implication for the plan (no changes proposed here)

§6.11's challenge is uncomfortable: the plan's typed-schema substrate
makes the society *more* observable than the brains Minsky describes,
which is a feature for safety but a divergence from the theory. The
recorded gaps are about *naming the divergence* (A, C),
*representing translation failure as data* (B), *stating expected
growth* (D), and *recording lineage* (E).

Any move to close them would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(untranslatability slot),
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
(typed-substrate divergence; growth shape), and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(lineage field on the manifest), and so fall under the "stop and
ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
