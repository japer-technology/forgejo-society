# Section 1.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.2.md](som-1.2.md) — *The mind and the brain*
(Minsky, §1.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§1.2 is a short historical essay. It does almost no engineering: it
recounts how Life ceased to need a vital force once cells, chemistry
and reproduction were understood, and proposes that mind can close
the same gap once we have the right *particles*. Minsky's final
sentence names those particles: the *agents of the mind*. So the
section is light on concrete primitives but heavy on a single
methodological commitment, and that commitment is exactly what the
plan must be measured against.

---

## The ideas Section 1.2 actually carries

Pulled from Minsky's text:

1. **The dualist temptation must be refused.** Thoughts seemed
   "ghostly" relative to matter; that appearance is the obstacle,
   not the evidence.
2. **The Life-precedent.** Life looked irreducible until cells,
   biochemistry, and a *reproduction mechanism* (von Neumann; Watson
   and Crick) closed the gap. Mind is offered the same trajectory.
3. **The gap closes by finding the right particles, not by adding a
   new force.** No vital force was needed for Life; no special
   "thinking substance" is needed for mind.
4. **Two streams had to merge.** Developmental psychology (Freud,
   Piaget) and theory of computation (Gödel, Turing, McCulloch and
   Pitts) only became a *single* explanatory programme in the 1940s
   and 1950s.
5. **AI is the merger, not a rival.** Minsky frames the present
   project as the continuation of that 1940s convergence, not as a
   philosophical position.
6. **The book's load-bearing claim.** *Agents* are the long-sought
   particles. Everything that follows in the book — and any honest
   implementation of it — must be reducible to agents and their
   composition.
7. **Caveat of remaining distance.** Minsky concedes machines are
   "still far from" doing all a person does; the deficit is in
   *theory*, not in principle.

---

## What the implementation already absorbs

### No vital force, no ghost (ideas 1, 3)

The plan never reaches outside its substrate for explanation. Every
agency, critic and censor is a Markdown file with YAML frontmatter,
executed by Forgejo Actions runners
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The voice rules in [AGENTS.md](../../../AGENTS.md) forbid the prose
moves that would re-introduce a ghost: no "AGI", no "AI brain", no
anthropomorphic flourish.

### Agents as the particles (idea 6)

The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
— "every structure collapses to either a file under
`.forgejo-society/` or a step in the workflow" — is the operational
form of Minsky's commitment. There is nothing in the plan that is
*not* an agent-file or a workflow-step composing them. The manifest
schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
fixes the particle's shape: `id`, `kind`, `authority`,
`activates_on`, `inhibits`, `outputs`, `budget`.

### Two streams merged (ideas 4, 5)

The plan is itself a merger. The developmental side appears in
`memory/episodic/`, the K-line frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
and the self-modification frame. The computational side appears in
the workflow pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
and the typed handoff/signal schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Neither half is treated as decorative.

### Honest distance (idea 7)

The plan is explicit about what it does *not* claim. The compliance
documents in [WARNING.md](../../../WARNING.md) and its referenced
set keep the runtime scoped to "self-hosted Forgejo on owned Ubuntu
hardware", and the policies in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
keep the authority levels closed to `read`, `draft`, `propose`,
`act`, `govern`, `human`. The "still far from" is honoured by what
the plan refuses to promise.

---

## What the implementation does not yet take into account

§1.2 is short, so the gaps are few but real.

### A — The Life-precedent is not invoked as a design rubric

The plan absorbs the *commitment* (idea 3) but never cites the
*precedent* (idea 2) as a check on its own moves. There is no place
in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or [`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
that asks, of each primitive, "is this a *cell* and a *chemistry*,
or have we smuggled in a vital force?" A reviewer could not today
use §1.2 as a checklist against the plan.

### B — The 1940s merger has no parallel in the toolchain story

Idea 4 (two streams merging) is reflected in the *content* of the
plan but not in its *bibliography*. The plan has no short note that
says: this loop descends from McCulloch–Pitts on the computation
side and from Piaget on the developmental side, and the agent
manifest is where the two meet. A one-paragraph lineage in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
would close it.

### C — "AI is the continuation" is not how the prose frames itself

Idea 5 — that this work is the continuation of a converging
scientific programme, not a philosophical position — is consistent
with the plan but not stated by it. The promotion style guide
([`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md))
correctly avoids hype, but the implementation prose nowhere
positions itself as *the operational continuation of Society of
Mind*. The framing is implicit. §1.2 would license making it
explicit.

### D — No "ghost detector"

Idea 1 (refuse the ghost) is enforced by voice rules on prose. The
plan has no equivalent enforcement on *structure*: nothing checks,
during review, that a newly added agency does not silently rely on
an unaccounted-for capability (a "ghost" in the dependency graph).
The closest analogue is the authority-registry check in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
which catches authority drift but not capability smuggling.

---

## Summary table

| # | Idea from §1.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Refuse the dualist temptation | Yes (prose) | Voice rules in [AGENTS.md](../../../AGENTS.md); no anthropomorphism allowed. |
| 2 | The Life-precedent (cells + chemistry + reproduction) | No | Not invoked as a design rubric (gap A). |
| 3 | Particles, not a new force | Yes | Collapse rule in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md); nothing outside files + steps. |
| 4 | Two streams (psychology + computation) merging | Partial | Both halves present in plan content; not stated as a lineage (gap B). |
| 5 | AI as the continuation, not a rival | Partial | Consistent with plan; not framed this way in prose (gap C). |
| 6 | Agents as the particles | Yes | Manifest schema in [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md). |
| 7 | Honest acknowledgement of remaining distance | Yes | Compliance scope; closed authority set; refusal to over-claim. |
| — | Structural ghost-check | No | No automated check for smuggled capability (gap D). |

---

## Implication for the plan (no changes proposed here)

§1.2 is a methodological commitment more than a design. The plan
honours that commitment: it refuses the ghost, it treats agents as
the unsplittable unit, and it composes the loop out of files and
workflow steps that make no claim on inner life. The four gaps are
all *legibility* gaps rather than *structural* ones. The plan
behaves correctly under §1.2; it just does not yet *cite* §1.2 as
the rubric it is being measured against.

Closing any of A–D would touch
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
or [`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
