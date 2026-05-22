# Section 22.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.10.md](som-22.10.md) — *Verbal expression*
(Minsky, §22.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.10 offers the *re-duplication* theory of speech. Mary, wanting to
convey a structure p inside her mind to Jack, proceeds step by step to
build a new version q in her *own* mind; each internal operation has a
matching grammar-tactic that her speech-agency emits; the listener's
agencies, recognising those tactics, perform the same operations.
Mary compares p with the growing q and applies operations to close
the difference.

---

## The ideas Section 22.10 actually carries

1. **Speaking constructs a parallel object.** Mary builds q in her
   own mind as the source of what she will say.
2. **Each mental operation has a grammar-tactic.** A learned
   correspondence maps internal moves onto verbal forms.
3. **The listener mirrors the operations.** Recognising the
   grammar-tactic triggers the same internal move in Jack.
4. **Output is goal-directed difference reduction.** Mary repeatedly
   compares p with q and applies operations to remove differences.
5. **Sub-structures are recursive.** A complex pronome value is
   expressed by interrupting and recursively describing it.
6. **Significance is speaker-relative.** What counts as a "remaining
   difference" depends on what Mary wants to say.
7. **Later stages buffer grammar-tactics.** Mature speakers store
   sequences of tactics temporarily so they can rearrange before
   pronouncing.

---

## What the implementation already absorbs

### A sole narrator (ideas 1, 2)

`agency.integration.conscious-presenter` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is the *sole producer* of Spock's visible response. The architecture
is committed to a single bridge from internal state to spoken text —
the structural precondition of any speech-tactic mapping.

### A self-model that constrains expression (ideas 1, 6)

`agency.identity.spock-self-model` keeps the response consistent with
`AGENTS.md`, and `agency.identity.tone-stabilizer` enforces the
register defined there
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
"What Mary wants to say" has a society-level analogue: the soul
files declare what register and stance the response must conform to.

### Settlement as the source structure (idea 1)

The settlement carries proposals, evidence, citations, ideals, and
the action authorised
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
It is the *p* the presenter is trying to convey to the user.

### A staging surface (idea 7)

`state/mind/issues/<n>/final.md` and `workspace.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
provide a place where the presenter's output is staged before it is
sent. Buffer-and-rearrange has at least a surface.

### Critics on the candidate response (ideas 4, 6)

Suppressors like `suppressor.workflow-diff-keywords`,
`suppressor.soul-file-diff`, and `suppressor.high-entropy-string`
fire at `post_candidate_output`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— after the presenter has produced text but before it ships. This is
the "compare and remove" loop, narrowly applied to safety.

---

## What the implementation does not yet take into account

### A — No q-construction step

§22.10's heart is that Mary builds q *in her own mind*. The presenter
in the plan composes output directly; there is no intermediate
internal copy of the message that the presenter then *compares*
against the source structure (the settlement). The mapping is
one-shot, not iterative.

### B — No grammar-tactic catalogue

The plan has no list of "mental operation → expressive form" pairs.
Tone is enforced as a whole, not as a sequence of recognisable
tactics. A reader cannot ask "which grammar-tactic did the presenter
use to mark this Origin?" because no such catalogue exists.

### C — No listener model

§22.10 presupposes that Mary's tactics will trigger the *same*
operations in Jack. The plan has `agency.identity.user-model-keeper`
for *preferences and prior dialogue*, but no representation of the
listener's *current cognitive state* — what is active, what has been
referenced, what would attach easily (see also
[som-22.9-sor.md](som-22.9-sor.md), gap E). Without a listener model,
the re-duplication theory cannot be implemented.

### D — Difference reduction is not the production loop

Idea 4 — "find a difference, apply an operation, repeat" — is not the
presenter's loop. The presenter runs once and emits. Suppressors fire
*after* output; they do not steer iterative refinement.

### E — Recursion in expression is implicit only

Idea 5 — sub-structures expressed by recursive interruption — has the
same shape as the nested-frame gap in
[som-22.8-sor.md](som-22.8-sor.md). The presenter's output may
recurse linguistically (sentences embed clauses) but the society does
not model the recursion as nested expressive operations.

### F — Buffering of tactics is not represented

Idea 7 — mature speakers store sequences of tactics before
pronouncing — would require a *tactic queue* between operation and
emission. The staging surface (`final.md`) buffers *text*, not
*tactics*. Whatever rearrangement occurs is opaque to the rest of the
society.

### G — Significance is undeclared

What counts as a remaining difference between p and q (idea 6) would,
in a society, correspond to a *priority list* that the presenter
consults: "which discrepancies must be removed, which may be left."
The plan has ideals (`self-ideals.md`) and the
`ideals_cited` field in the settlement, but no presenter-local
priority that says "this kind of discrepancy must be resolved before
shipping."

---

## Summary table

| # | Idea from §22.10 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Speaking constructs a parallel q | No | Presenter emits directly (gap A). |
| 2 | Each operation has a grammar-tactic | No | No tactic catalogue (gap B). |
| 3 | Listener mirrors the operations | No | No listener model (gap C). |
| 4 | Difference-reduction loop | Partial | Suppressors post-hoc; no iterative refinement (gap D). |
| 5 | Recursion in expression | Implicit | No modelled recursion (gap E). |
| 6 | Significance is speaker-relative | Partial | Ideals exist; no presenter priority list (gap G). |
| 7 | Buffering of tactics | Partial | Buffers text, not tactics (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.10 makes the strongest case yet for a *second* identity-side
artefact in the plan: a *listener model* paired with a *tactic
catalogue*. Without these, the conscious-presenter is a one-shot
emitter; with them, it could implement re-duplication as a real loop.
The plan's existing pieces — sole narrator, self-model, settlement
as source structure, suppressors — are the right ingredients; the
missing piece is the comparative loop that turns them into
re-duplication.

Any move to add q-construction, a grammar-tactic catalogue, a
listener model, an iterative production loop, or a tactic queue
would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the representation and channel protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
