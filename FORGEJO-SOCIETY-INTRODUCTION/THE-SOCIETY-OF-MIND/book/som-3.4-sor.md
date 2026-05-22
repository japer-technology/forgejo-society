# Section 3.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.4.md](som-3.4.md) — *Heterarchies* (Minsky, §3.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§3.4 is a short, load-bearing section. It does one thing: it argues
that a society of agents cannot in general be a tree. As soon as two
agents *need each other's skills*, neither can be on top, and the
diagrams have to give way to *cross-connected rings and loops*.
Minsky also names the precondition for those rings: *memory*. Without
working memory, agents cannot interrupt one job to do part of another
and come back. With memory, the same agent can be reused inside
several concurrent jobs.

This file pulls out the ideas §3.4 carries and tests each against the
implementation plan.

---

## The ideas Section 3.4 actually carries

Distilled from Minsky's text:

1. **Hierarchy is the default starting shape.** Dividing work into a
   tree is the easiest way to begin: each agent looks *up* for
   instructions and *down* for help, and only has one job.
2. **Hierarchy fails under mutual need.** When two agents each
   require the other's skill (See needs Move to clear the line of
   sight; Move needs See to check the arm's trajectory), neither can
   be the supervisor. The tree breaks.
3. **Heterarchy is the repair.** The fix is *cross-connected* rings
   and loops — agents that can work for several superiors at once,
   subordinates shared between agencies, mutual rather than
   one-directional links.
4. **Memory is the precondition for heterarchy.** Without temporary
   memory, an agent that starts one job before finishing another has
   nowhere to put its in-flight state. The looped structure
   collapses.
5. **Memory enables reuse, which sidesteps resource starvation.**
   "If each of See's agents could do only one thing at a time, it
   would soon run out of resources." With enough memory, the same
   agent can be used *over and over again to do parts of several
   different jobs at the same time*.
6. **Memory is more than recollection.** Memory in §3.4 is not the
   diary of past events — it is the *scratch space* that holds what
   to do next when a job is interrupted. Recollection is a different
   use of the same word.
7. **Books-of-diagrams default to trees; minds do not.** Minsky is
   explicit that the early diagrams are simple hierarchies for
   pedagogical reasons, and that the rest of the book will replace
   them with loops as memory is introduced.

These seven ideas are what the implementation plan is measured
against below.

---

## What the implementation already absorbs

### Communication is heterarchical, not call/return (ideas 2, 3)

The handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
do not give one agency the ability to *call* another. An agency
emits `signals` and `objections` and `candidate_actions`; the
runtime decides what wakes up. Crucially, the signal record carries

```text
suggested_effects: { excite: [...], inhibit: [...] }
```

so any agency may *cross-connect* to any other by name. The
relationship is data, not call-graph topology. The same heterarchical
shape appears in the manifest field `inhibits:` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
which lets any agency suppress any other at activation time. The
substrate is a blackboard
(`state/mind/issues/<n>/signals.jsonl` and `blackboard.md` per
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
not a tree of supervisors.

### Activation by signal, frame, and path — not by parent (idea 3)

`activates_on:` in the manifest schema lets an agency wake on signals,
frames, or paths. A subordinate is therefore *shared by construction*:
any agency whose `activates_on` matches will run, regardless of which
"parent" raised the signal. This is the structural form of Minsky's
"agents that can work for several superiors at once."

### Critics attack any proposal (idea 3)

The critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— `critic.evidence`, `critic.scope`, `critic.cost`, and the rest —
emit objections against *any* candidate action or agent without
regard to family or rank. Authority over a proposal is not assigned
by tree; it is assigned by the critic's competence. This is
heterarchy at the criticism layer.

### Per-stimulus state is a working scratch tree (idea 4, partial)

`state/mind/issues/<n>/` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
gives each open stimulus a private, append-only set of files —
`percepts.jsonl`, `activation.jsonl`, `signals.jsonl`,
`workspace.md`, `blackboard.md`, `candidate-actions.jsonl`,
`objections.jsonl`. This is *some* of what §3.4 means by memory: a
place where an agent's emissions persist while other agencies act.
Combined with the `cycle: 0` field on signals and handoffs in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the runtime can in principle run more than one deliberation cycle on
the same blackboard.

### K-lines as reuse across stimuli (idea 5, partial)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
record which agencies were active at a successful settlement and
allow that activation snapshot to be *restored* later when
`restore_when` matches. This is reuse — the same agency populating
the active set across many different jobs — and it is one form of
the "use the same agents over and over again" that §3.4 names. It is
inter-stimulus reuse rather than intra-stimulus reuse.

---

## What the implementation does not yet take into account

These are the §3.4 ideas the plan leaves implicit, partial, or
absent. None are urgent; all are real.

### A — No primitive for *mutual* need

Idea 2 is the See/Move example: two agencies that each require the
other *within the same cycle*. The plan has no record type that
expresses a *request*. The Signal in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries `suggested_effects.excite` and `suggested_effects.inhibit`,
but only as advisory hints applied by `policy.ts`. There is no
"agency A blocks pending result from agency B, which itself is
waiting on A" construct. The pipeline assumes one-directional
information flow within a cycle; the only multi-cycle device is the
`cycle:` counter, which is not specified as a re-entry mechanism in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).

### B — No working memory for in-flight interruption

Idea 4 — "temporary memory in order to keep track of what next to do,
when it starts one job before its previous job is done" — has no
direct analogue. The state tree in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is *episodic per stimulus*, not *per task within a stimulus*. There
is no continuation slot on a handoff: an agency that emits
`status: deferred` has no documented place to record what it was
about to do next, nor any documented way for the same agency
instance to be resumed with that scratch state attached. The
distinction Minsky draws between *recollection* (idea 6) and
*scratch* memory is not yet encoded in the tree layout.

### C — Pipeline is linear; rings are not first-class

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
describes a sequence: `perceive → activate → deliberate → criticize →
censor → settle → act → remember → report`. The `deliberate` phase
is named as a loop (`lifecycle/mind.ts loop`) but the document does
not specify the loop's termination, its cycle bound, or how an
objection raised in `criticize` re-enters `deliberate`. Minsky's
§3.4 explicitly says the diagrams *will* be replaced by rings as
memory is added; the plan still depicts a straight line. The loop
implied by `cycle:` in the schemas is not yet promoted to a named
runtime construct.

### D — No notion of shared subordinates by descent

Idea 3 includes the case of *one* agency that serves as subordinate
to *several* others. The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is flat: each agency is filed under exactly one family, and the
`agency:` frontmatter field takes a single value. Activation can
make an agency *behave* as a shared subordinate (anyone may raise a
signal it listens for), but the *declared* relationship is still a
tree of families. There is no manifest field of the shape "this
agency primarily serves families X and Y."

### E — Resource budget is per-agency, not amortised by reuse

Idea 5 says memory lets the same agent be reused across concurrent
jobs, sidestepping resource starvation. The plan has *budgets* —
`max_tool_calls` and `max_wall_clock_s` per manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— but they are limits on a single run of a single agency on a single
stimulus, not an account of reuse across concurrent sub-jobs. The
runtime currently *prevents* exhaustion by capping; Minsky's move is
to *avoid* exhaustion by reusing. The two are not the same.

### F — Output is hierarchical by design

The conscious bottleneck in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
makes `agency.integration.conscious-presenter` the *sole* producer
of visible text. This is a deliberate hierarchy on top of an
otherwise heterarchical substrate. It is consistent with the §3.4
caveat that the early book uses trees for clarity; it is worth
recording that the public surface of the society is a single output
node, not a ring. This is a *chosen* hierarchy, not an unnoticed
one.

### G — Memory's two senses are not separated in the schema

Idea 6 distinguishes *scratch* memory (what to do next) from
*recollection* memory (records of the past). The plan's `memory/`
tree in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is entirely the second sense: `events/`, `episodic/`, `semantic/`,
`procedural/`, `failure/`, `frames/`, `analogies/`, `concepts/`,
`klines/`, `decisions/`. The `state/` tree is per-run scratch, but
its records are *traces of what happened*, not *plans for what to do
next*. Minsky's "temporary memory" — a continuation surface for an
in-flight agency — is not represented anywhere.

### H — No representation of intra-cycle concurrency

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and the pipeline document do not describe concurrent agency
execution within a single cycle. Idea 5's "doing parts of several
different jobs at the same time" presupposes that the same agency
can be live in multiple sub-tasks at once. The plan implicitly
assumes one activation per agency per cycle (the `activated:` list
in settlement records carries a single `weight:` per agency, per
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Concurrency, if it exists, would have to be expressed by *multiple
stimuli* rather than by one stimulus splitting into mutually-aiding
sub-tasks.

---

## Summary table

| # | Idea from §3.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Hierarchy is the default starting shape | Yes | First-ship catalogue is family-organised; conscious-presenter is a single output node. |
| 2 | Hierarchy fails under mutual need | Partial | Signal substrate is heterarchical, but no *request* record exists (gap A). |
| 3 | Heterarchy is the repair (cross-connections, shared subordinates) | Partial | `activates_on`, `inhibits`, `suggested_effects` give cross-connection; declared family is still single-valued (gap D). |
| 4 | Memory is the precondition for heterarchy | Partial | Per-stimulus scratch exists; per-task continuation does not (gap B). |
| 5 | Memory enables reuse, sidestepping resource starvation | Partial | K-lines give inter-stimulus reuse; budgets cap rather than amortise (gap E); no intra-cycle reuse (gap H). |
| 6 | Scratch memory ≠ recollection memory | No | `memory/` is recollection; `state/` is trace; neither is "what to do next" (gap G). |
| 7 | Diagrams default to trees; minds become loops | Partial | `cycle:` field exists in signal/handoff; the pipeline document still depicts a line (gap C). |
| — | Output as hierarchy | Yes (by design) | Conscious bottleneck; chosen, not missed (gap F, recorded for completeness). |

---

## Implication for the plan (no changes proposed here)

§3.4 is short and makes one move: hierarchy gives way to heterarchy as
soon as two agencies need each other, and *memory* is the price of
admission to the looped structure that replaces the tree. The
implementation plan honours the heterarchical *substrate* — signals,
blackboard, `activates_on`, `inhibits`, `suggested_effects`, critics
that attack any proposal — and it provides one kind of reuse via
K-lines. It does not yet provide the *other* kind of memory §3.4
relies on: a continuation surface that lets one agency pause mid-job
while another agency aids it, and resume with its scratch state
intact. The pipeline document still depicts a line rather than the
rings §3.4 promises the book will draw.

The biggest unforced documentation opportunity is gap C: making the
`deliberate` loop and the `cycle:` field first-class in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
so that re-entry is named rather than implied. The biggest substantive
opportunity is gap B: a continuation slot — possibly on the handoff
record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
possibly as a new record type — that gives an interrupted agency
somewhere to put its in-flight state. Gap D would follow from either.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the handoff and settlement schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the pipeline document
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the corresponding protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
