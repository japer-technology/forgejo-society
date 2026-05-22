# Section 7.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.1.md](som-7.1.md) — *Intelligence* (Minsky, §7.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.1 opens Chapter 7 by refusing to define *intelligence* as a fixed
property. Minsky treats the word as a stage-magician's trick: a name we
give to the parts of problem-solving we *do not yet understand*, and
which dissolves as soon as the underlying mechanisms are made plain.
The section is therefore as much methodological as it is descriptive,
and the plan must be measured against the method, not against any
definition.

---

## The ideas Section 7.1 actually carries

1. **No fixed definition of intelligence.** An author's job is to
   follow usage, not to legislate it. Pinning down the word would
   freeze the science around current ignorance.
2. **Intelligence is residual.** The word names *whichever problem-
   solving processes we don't yet understand*. As mechanisms are
   exposed, the word retreats.
3. **The "hard problem" test is contextual.** Coral reefs are hard,
   but reefs are not intelligence; the difficulty must belong to the
   *solver*, not to the artefact.
4. **Evolution solves problems but is not intelligent.** Speed and
   efficiency are part of what people mean by the word; processes
   whose time-rate is geological do not qualify.
5. **Exploitation versus solution.** Birds, beavers, orioles do not
   *solve* their characteristic problems; they *exploit* procedures
   their gene-built brains already carry. Mistaking exploitation for
   solution overstates an organism's intelligence.
6. **Intelligence is a moving frontier.** It is a name for what is
   currently mysterious in a mind, and its content changes as
   psychology learns.

---

## What the implementation already absorbs

### Intelligence as residual (idea 2)

The plan never claims to *be* intelligent. Every visible faculty is
collapsed into a file or a workflow step. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every cognitive structure must collapse to either a file under
`.forgejo-society/` or a step in the workflow") is the operational
form of Minsky's retreat: whatever the society can do is by
construction *not* mysterious, because it can be opened. The voice
rules in [AGENTS.md](../../../AGENTS.md) explicitly forbid the word
*intelligence* in its anthropomorphic sense.

### Exploitation versus solution (idea 5)

The plan recognises the exploitation/solution distinction in two
places. K-lines
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are explicitly *reusable mental configurations* — the society
*exploits* a prior winning configuration when one matches. Frames are
*pre-shaped expectations* with default slots, critics, and censors;
when a frame fires, the society is exploiting an inheritance, not
solving from scratch. The implementation makes the distinction
*visible*: each settlement records which K-lines and which frame were
used, so a reviewer can tell exploitation from solution after the
fact.

### Speed and efficiency as part of the word (idea 4)

Budgets are first-class. The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declares `budget.max_tool_calls` and `budget.max_wall_clock_s` per
agent; the stimulus carries an initial budget
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
"normalize"); cost is recorded in the handoff schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
`tool_usage`). The plan refuses to call slow processes intelligent.

### Hard problems belong to the solver (idea 3)

The frame catalogue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
distinguishes `question`, `bug`, `feature`, `code-change`,
`security-sensitive`, `self-modification`, `novel`. The `novel` frame
is the *only* frame that admits "this is hard for *us*"; it mandates
an analogy pass. Difficulty is thus a property the society declares
about itself, not a property of the artefact.

---

## What the implementation does not yet take into account

### A — No retreat protocol for the word

Idea 2 says the content of *intelligence* should change as mechanisms
are exposed. The plan has no place where, when a new agency or frame
is added, the corresponding "mysterious" capability is *removed* from
some catalogue of unknowns. Introspection
([`02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records `unknowns` and `blind_spots` per settlement, but there is no
durable, society-level *frontier file* that shrinks as mechanisms are
made explicit. The retreat is therefore implicit in the git log, not
modelled.

### B — Exploitation and solution are not separated in the outcome

Idea 5 distinguishes exploiting a prior procedure from solving a new
problem. The settlement schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records `analogies_used`, `activated`, `proposals.method`
(`retrieval|rule|local-model|hybrid`), and K-lines under
`memory_updates.klines`. From those a reviewer can *reconstruct*
whether the society exploited or solved, but the settlement carries
no first-class `mode: exploit | solve` distinction. Credit
assignment
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment") therefore cannot reinforce solving differently
from exploiting.

### C — Time-rate is bounded per run, not measured per capability

Idea 4 makes time-rate part of the word. The plan budgets
*per agent* and *per run* but does not measure *capability-level*
latency over time. A K-line might be reused for years; nothing in the
plan records whether the reuse is becoming faster (mechanisation) or
slower (drift). `evolution/reinforcement-log.md` updates `reuse_count`
and `decay_score`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but not a time-rate trend. Minsky's word-test would be invisible.

### D — Coral-reef problem: no separation between artefact difficulty and agent difficulty

Idea 3 separates the impressiveness of an *artefact* (the reef) from
the intelligence of the *builder* (the coral). The plan judges
candidate actions by `estimated_risk`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
`candidate_actions[].estimated_risk`) and by critic objections, but
not by *whether the difficulty belongs to the producer or to the
output*. A complex diff produced by trivial retrieval and a trivial
diff produced by hard deliberation are indistinguishable in the
settlement.

### E — No catalogue of currently-mysterious capabilities

Idea 6 invites a project to keep an honest list of *what it does not
yet understand about its own behaviour*. The plan has
`unknowns` and `blind_spots` per settlement, ecology reviews
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"`evolution/ecology-review.md`"), and a `concepts/` directory for
candidate abstractions, but no single durable register of "things this
society does that it cannot yet explain." Without it, the *retreating
frontier* never has a name in the file tree.

---

## Summary table

| # | Idea from §7.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | No fixed definition of intelligence | Yes | Voice rules in `AGENTS.md`; the word is never used as a property. |
| 2 | Intelligence is residual | Partial | Collapse rule exposes mechanisms; no durable shrinking frontier file (gap A, E). |
| 3 | Hard problems belong to the solver | Partial | `novel` frame names self-declared difficulty; artefact/solver split not in the settlement (gap D). |
| 4 | Evolution-rate disqualifies the word | Partial | Budgets are per-run; capability-level time-rate not tracked (gap C). |
| 5 | Exploitation versus solution | Partial | K-lines and frames record exploitation; settlement has no first-class `mode` field (gap B). |
| 6 | Moving frontier | Partial | Per-settlement `unknowns`/`blind_spots` exist; no society-level frontier register (gap E). |

---

## Implication for the plan (no changes proposed here)

§7.1 is a discipline about a word. The implementation already honours
the discipline by collapsing every faculty to inspectable files and by
forbidding the word in prose. Where it falls short is bookkeeping: the
society cannot yet *show* the residue shrinking. The five gaps cluster
around a single missing artefact — a durable, society-level frontier
record that tracks what is mechanised, what is exploited, and what
remains unexplained — together with two missing distinctions in the
settlement schema (`mode: exploit|solve`; producer-difficulty versus
artefact-complexity).

These are recorded here as analysis, not as a change request. Closing
them would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the credit-assignment and evolution protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and possibly the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
