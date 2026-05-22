# Section 18.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.4.md](som-18.4.md) — *Logical chains*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.4 contrasts logical chains with commonsense chains. In logic a
link is either present or absent; there is no weakest link, no
middle ground, no support beyond the deduction itself. In ordinary
reasoning, every step is checked against everyday experience for
plausibility, and additional evidence can shore up a weak step.
Logic's strength is its narrowness; that is also why it shatters.

---

## The ideas Section 18.4 actually carries

1. **Logic has no middle ground.** A logic link is either there or
   it is not. There is no notion of a *partly-supported* step inside
   a deduction.
2. **No weakest link in logic.** Because every link is total, a
   logical chain cannot be diagnosed by looking for the loosest
   step; either the deduction holds or one specified step is wrong.
3. **Common sense checks plausibility at each step.** Ordinary
   reasoning continually asks "does what we have so far sound right
   against everyday experience?" — not just "does the step follow?"
4. **Common sense allows additional support.** A weak step in an
   everyday argument can be reinforced with more evidence. A weak
   step in a logical chain cannot.
5. **Architectural / structural metaphors are pervasive.** "Based
   on weak evidence", "support that with more evidence", "shaky;
   will collapse" — ordinary reasoning is talked about as a building.
6. **Logic's strength is the source of its weakness.** Few
   assumptions means few failure modes — but also no slack when one
   assumption fails.
7. **The proper role of logic.** Logic rarely yields new ideas; it
   detects weaknesses in old ones, and refines tangled networks into
   simple chains useful for explanation.

---

## What the implementation already absorbs

### Plausibility checking at every step (idea 3)

The deliberate loop
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
recomputes activation after each cycle and runs the full critic
matrix at the end of deliberation
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Critics are not a single end-of-pipeline check; activation is
recomputed and `blocking_objection` short-circuits the loop. The
runtime is built around "does this still look right?" at every step,
not "does it follow at the end?".

### Additional support reinforces a step (idea 4)

Claims in a handoff
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carry an `evidence: [ ... ]` array and a `confidence:` score. A
proposal lifted by additional citations gains evidence without
restructuring; `critic.evidence` and `critic.overconfidence` operate
on the relation between evidence count, evidence quality, and the
declared confidence. This is Minsky's "support that with more
evidence" in operational form.

### Middle-ground via parallel evidence (ideas 1, 2 by negation)

The signal record's `energy: 0.0` field
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and the K-line `decay_score`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
both occupy the [0,1] interval. The runtime is built on degrees of
strength, never on binary truth values. This is the structural
opposite of the logic-only model §18.4 critiques.

### Logic-as-cleanup (idea 7)

The settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
is exactly the cleanup §18.4 reserves for logic: it refines the
tangled `signals.jsonl` and per-cycle handoffs into a single
structured record (`proposals`, `critics`, `censors`, `outcome`).
Spock's `final_response`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
`agency.integration.conscious-presenter`) is the further compression
into a readable narrative.

### Detecting weaknesses, not generating new ideas (idea 7)

Critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are explicitly forbidden from authoring candidates; they emit
objections only. They play the role §18.4 reserves for logic: find
the weak places in candidates produced elsewhere. The grammar
metaphor from §18.1 generalises here: critics check structure;
they do not draft.

---

## What the implementation does not yet take into account

### A — No notion of a *minimal* deduction chain

Idea 6 (logic's strength is fewest assumptions) suggests value in
keeping a separate, *minimal* derivation alongside the rich evidence
trail. The plan records every cited decision and prior settlement,
which is the opposite move — *maximal* connection — without also
maintaining the lean deduction underneath. There is no slot for
"the smallest set of premises from which this proposal would follow
deductively". Where such a thing exists, it would be a useful audit
artefact.

### B — Plausibility is not checked against a *world model*

§18.4's "everyday experience" check is matched against the world.
The plan's plausibility checks are against *records* (semantic
decisions, prior settlements, project laws) rather than against an
explicit world model. The closest analogue is
`memory/semantic/project-laws.log`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
which holds invariants the society must respect. That is closer to
"axioms" than to "everyday experience"; the open-ended commonsense
backdrop §18.4 names is not represented.

### C — Weakest-link visibility on logical chains

Idea 2 is paired with §18.3's gap A: logic chains have no internal
weakest link, so when one fails, *the analysis must name the failed
step*. The plan's `objections.against:` slot names a *target agent
or candidate action*. It does not name the *premise* inside the
candidate's argument. For purely logical objections, this is a
missing fineness — the runtime cannot say "step 3 of this
derivation is the one that fails".

### D — Architectural metaphor is in the prose, not in the schema

§18.4 dwells on building metaphors as a signal that reasoning is
*structural*. The plan's prose uses them (foundations, layers,
collapse rule). The schemas do not — there is no
`structural_role: foundation|support|capstone` slot anywhere, and
no analogue for "this argument rests on that one". The dependency
between settlements is recorded only through `linked: derived_from`,
which is provenance, not structural support.

---

## Summary table

| # | Idea from §18.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Logic has no middle ground | Yes (by avoidance) | Signal energy + claim confidence are graded throughout. |
| 2 | No weakest link in logic | Partial | Targeted objections exist; no per-premise targeting (gap C). |
| 3 | Plausibility checked at every step | Yes | Activation recomputed and critics re-run each cycle. |
| 4 | Common sense allows additional support | Yes | Evidence arrays + critic.evidence + reinforcement. |
| 5 | Architectural metaphors of reasoning | Partial | Used in prose; not encoded in schemas (gap D). |
| 6 | Logic's strength is the source of its weakness | Partial | No minimal-derivation slot recorded (gap A). |
| 7 | Logic detects weaknesses; refines for explanation | Yes | Critics detect; settlement + Spock refine. |
| — | Plausibility checked against a world | No | Checks are against records, not an explicit world model (gap B). |

---

## Implication for the plan (no changes proposed here)

§18.4 contrasts two ways of working: the logical chain that holds or
shatters, and the commonsense chain that bends, bears reinforcement,
and is judged against the world at every step. The implementation is
firmly in the commonsense mode: graded signals, graded confidences,
critics that can be sustained or not, evidence arrays that can be
augmented. The plan's settlement and Spock's final response play
exactly the role §18.4 reserves for logic — *after* the fact, to
clean up and explain.

The unfilled half of §18.4 is the *use* of logical analysis: there
is no minimal-derivation slot recording the leanest argument behind
a proposal, no per-premise objection targeting, and no explicit
world model against which plausibility is checked. These are gaps in
audit and in fineness, not in the loop's basic shape.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the settlement and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
