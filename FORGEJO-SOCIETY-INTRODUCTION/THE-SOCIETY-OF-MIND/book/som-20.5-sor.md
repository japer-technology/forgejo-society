# Section 20.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.5.md](som-20.5.md) — *Micronemes*
(Minsky, §20.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.5 introduces *micronemes*: inner contextual K-lines that shade
the mind's activities but for which we usually have no words. They
sit beneath the polynemes, contribute small biases — outdoors,
indoors, safety, danger, cooperation, conflict — and combine
combinatorially: even forty independent micronemes can specify a
trillion contexts. Word-senses learn to recognise *patterns* of
microneme activation, not single context labels.

---

## The ideas Section 20.5 actually carries

1. **Property-based classification is insufficient.** Qualities
   interact in too many ways for a static taxonomy.
2. **Every situation is tinted by thousands of context shades.**
   Material, perceptual, locational, environmental, relational,
   safety-related, and many more.
3. **Most of these shades have no word.** They are inexpressible
   but operationally real.
4. **Micronemes are K-lines that span many agencies.** They reach
   widely; their individual effects are small; their *combined*
   effect establishes context.
5. **Word-senses recognise microneme patterns, not single shades.**
   A word-sense agent learns to fire when a certain *combination*
   of micronemes is active.
6. **Combinatorial reach.** Forty independent micronemes carry a
   trillion contexts; brains likely have thousands or millions.
7. **Individuality lives in micronemes.** Their inexpressibility
   *is* the reason different people respond differently to the same
   word.

---

## What the implementation already absorbs

### Path / label / phrase polynemes carry a thin slice (ideas 2, 4)

`path-polynemes.yml`, `label-polynemes.yml`, `phrase-polynemes.yml`
in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
shade the cycle with low-effort, ambient cues — a path under
`secrets/` biases toward `security-sensitive` *before* any agency
deliberates. This is the polyneme-microneme spectrum in operation,
though under one name.

### Activation snapshots are pattern-shaped (idea 5)

A K-line's `activation_snapshot` is a *map* of agency weights, not a
single category
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
`restore_when` matches against `any_terms`, `any_labels`,
`any_paths`, `any_symbols` — a combination, not a single key. The
plan already recognises that reactivation is pattern-keyed.

### Per-society variation is allowed (idea 7)

The plan's first-ship catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is a starting set; each society's `agencies/`, `policies/`, and
memory grow differently
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
"Individuality lives in what got learned" is at least *possible*
under the plan.

---

## What the implementation does not yet take into account

### A — Micronemes are not a distinct category

The plan has *polynemes* with `excite`/`inhibit` weights
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but no *micronemes*: low-amplitude, widely-reaching, often
unnameable contextual K-lines. The schema has no `band: ambient`
or `amplitude: low` distinction. Every polyneme is currently
high-amplitude enough to shift frame selection.

### B — Inexpressibility has no place to live

Idea 3 — most context shades are inexpressible — has no analogue.
The plan's polynemes carry human-readable `symbol:` names
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is no provision for a context cue without a label, no
mechanism by which "the cycle felt outdoors-y" could be recorded.

### C — Combinatorial reach is limited by catalogue size

Idea 6's "forty cues, a trillion contexts" relies on cues being
*independent* and *combined*. The plan's frames are mutually
exclusive
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)):
exactly one is chosen per cycle. Context is encoded by *which
frame*, not by *which combination of micronemes*. The expressive
range is the number of frames, not the product of context cues.

### D — Word-senses do not learn microneme patterns

Idea 5 has agents *learning* to recognise combinations. The plan's
agencies carry a static `activates_on` clause
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and a static prompt body. There is no training loop that *adjusts*
which microneme pattern wakes an agency. Reinforcement is logged
but not applied — the same gap noted in many earlier sections (see
e.g. §1.1's gap D).

### E — Per-society microstructure is allowed but not represented

Idea 7's "individuality lives in micronemes" needs a place for that
individuality to *live*. The plan has society-level governance and
memory, but no `micronemes/` directory under `.forgejo-society/`
([`04-folder-spec.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/04-folder-spec.md)),
and no per-society "context palette" that two sister societies could
differ on.

---

## Summary table

| # | Idea from §20.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Property-based classification insufficient | Partial | Frame catalogue is closed; polynemes blur frames somewhat. |
| 2 | Thousands of context shades | Partial | A few polyneme categories; not "thousands" (gap C). |
| 3 | Most shades have no word | No | Polynemes require named symbols (gap B). |
| 4 | Micronemes as wide-reaching K-lines | Partial | Polynemes excite many agencies; band/amplitude distinction missing (gap A). |
| 5 | Word-senses learn microneme patterns | No | Static `activates_on`; no learning loop (gap D). |
| 6 | Combinatorial reach | No | Frames mutually exclusive; reach is catalogue-sized (gap C). |
| 7 | Individuality in microneme microstructure | Partial | Per-society variation possible but not located (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.5 is where the plan and Minsky part company most clearly on
*representation*. The plan has one tier of waking-symbols (polynemes)
where Minsky has at least two (polynemes plus the much larger,
quieter, often-nameless microneme layer). The combinatorial reach
that gives Minsky's society its expressive range is therefore not
available.

Closing gaps A, C, E would touch the polyneme/microneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the folder layout in
[`04-folder-spec.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/04-folder-spec.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
