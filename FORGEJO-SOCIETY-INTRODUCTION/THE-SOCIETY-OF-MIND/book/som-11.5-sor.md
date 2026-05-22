# Section 11.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.5.md](som-11.5.md) — *Sensing similarities*
(Minsky, §11.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.5 turns the chapter's relational view into a developmental
warning. What we learn depends on what we classify as similar, and
similarity is itself a judgement made by other agencies. Generalise
too much — every flame is "orange" — and the child fears all
orange things. Generalise too little — every flame has unique
features — and the child gets burned. A sensory signal can only
announce its activity; the *quality* of the signal is downstream
work.

---

## The ideas Section 11.5 actually carries

1. **Similarity judgement is a foundational primitive.** What we
   learn is shaped by what we treat as alike.
2. **Generalisation has two failure modes.** Too coarse: false
   alarms and groundless fears. Too fine: missed regularities and
   real harm.
3. **Sensors only announce activity.** "I'm here, at this
   intensity." The quality, meaning, and consequences live in the
   network the signal enters.
4. **Definition is relational.** Words like *bitter*, *bright*,
   *salt* attempt to capture qualities of signals, but those
   qualities are entirely about relationships, not about the signal
   in isolation.
5. **The body cannot ache; you can.** Lower-level signals do not
   carry experience; only higher-level interpretation gives them
   character.

---

## What the implementation already absorbs

### Similarity is a first-class concern (idea 1)

K-line reactivation in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
computes similarity between the current cue and stored cues. The
frame-selection step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
("frame select + K-line/analogy") makes the similarity judgement
the first cognitive act after perception. The runtime, like the
child, decides what to treat as alike before it decides what to
do.

### Signal as announcement (idea 3)

[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
makes the §11.5 reading literal: a signal carries a `name`, an
`energy`, a `source`, and `evidence`. It does *not* carry a
verdict; only `suggested_effects` (advisory) and `evidence`
(citable). The settlement composes the verdict from many such
announcements.

### Quality as downstream linkage (ideas 3, 4)

A signal's downstream meaning is the union of the agencies it
excites and the critics that sustain or refute its proposals. The
polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes that linkage explicit; the settlement schema records what
actually fired.

### The conscious presenter "aches", not the agency (idea 5)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
reserves the visible voice for
`agency.integration.conscious-presenter`. Individual safety
agencies (e.g. `agency.safety.blast-radius-fear`) emit named
scalar appraisals; they do not narrate, do not interpret, and do
not produce visible output. The "fear" is a signal, not an
experience — the §11.5 distinction is honoured in voice rules and
in code.

---

## What the implementation does not yet take into account

### A — No generalisation regulator

§11.5's two failure modes — over- and under-generalisation — have
no critic counterparts in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
The closest is `critic.overconfidence`, but it judges the *strength*
of a claim, not the *breadth* of its category. A
`critic.overgeneralisation` (flame ≠ orange) or
`critic.undergeneralisation` (this flame is special) is not in the
first-ship set.

### B — No feedback loop on K-line breadth

A K-line that reactivates too eagerly is the over-general child; a
K-line that never reactivates is the under-general one. Today, the
`reinforcement` block in the K-line schema records
`tests_passed`, `user_reacted_positive`, `later_reverted`,
`reuse_count`, `decay_score` — but no one *adjusts the cue* in
response. The cue's breadth is fixed at write time.

### C — Authority does not modulate generalisation

`govern`-level meta-admin agencies can propose splitting or
retiring agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but the equivalent move for *categories* — splitting a too-broad
K-line class, merging two too-narrow ones — has no broker. The
society can grow new organs; it cannot easily resize its
categories.

### D — "Quality vocabulary" is not constrained

§11.5 warns that words for sensory qualities (bitter, bright)
pretend to denote the signal itself. The plan's prose discipline in
[AGENTS.md](../../../AGENTS.md) forbids anthropomorphic language at
the surface, but agency *manifests* and signal *names* can still
carry such vocabulary (e.g. a signal called `taste.bitter`). There
is no manifest-time critic that asks "does this name pretend to
describe a quality the signal cannot carry?"

---

## Summary table

| # | Idea from §11.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Similarity is foundational | Yes | K-line cue match; frame selection. |
| 2 | Generalisation has two failure modes | No | No over-/under-generalisation critic (gap A). |
| 3 | Sensors only announce activity | Yes | Signal schema; `evidence` required; verdict composed downstream. |
| 4 | Definition is relational | Yes | Polyneme + settlement linkage. |
| 5 | The body cannot ache; you can | Yes | Conscious-presenter is sole narrator; safety signals are named appraisals. |
| — | K-line breadth is updated by experience | No | Reinforcement logged; cue not adjusted (gap B). |
| — | Category resizing | No | Differentiation/retirement exist for agencies; not for K-line classes (gap C). |
| — | Critic on quality-pretending names | No | Voice rules govern prose; not manifest names (gap D). |

---

## Implication for the plan (no changes proposed here)

§11.5 is generous to the plan on signal discipline and the
conscious bottleneck, and probing on *generalisation*. The plan
treats the similarity judgement as a one-shot decision (which
K-lines fire, which frame wins) but never as a learnable category
that can be too wide or too narrow. The result is a runtime that
classifies and acts, but does not yet observe its own
classification errors.

The openings are small individually but converge on a single
pattern — *reinforcement is recorded but not applied to category
shape*. A `critic.overgeneralisation` (gap A), a cue-update path on
K-lines (gap B), a category-broker analogue of the differentiation-
broker (gap C), and a manifest-time check on quality-pretending
names (gap D) would each close a small part of the same gap.

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the credit-assignment protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the evolution tree at
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
