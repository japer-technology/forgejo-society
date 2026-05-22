# Section 15.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.10.md](som-15.10.md) — *Losing track*
(Minsky, §15.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.10 observes that solving complex problems piles subjobs into
something programmers call a *stack*. Untrained minds are bad at
stacks — hence the famous "malt that the rat that the cat that
the dog worried killed ate." Vision parallelises better than
language because it can choose its own attention order; speakers
cannot. The section ends with the suggestion that machines can
be designed with better self-records than humans naturally have —
and that this capability cuts both ways (easier to change, easier
to wreck).

---

## The ideas Section 15.10 actually carries

1. **Complex problems accumulate subjobs.** What programmers call
   a stack is a natural feature of hard thinking.
2. **Untrained minds handle stacks poorly.** Centre-embedded
   sentences expose the limit.
3. **Three deep is roughly the failure point.** When several
   similar processes are still active at the end, role assignment
   collapses.
4. **Vision parallelises; language serialises.** Vision can run
   more simultaneous processes; language is forced into one stream
   by the speaker.
5. **Visual attention chooses its own order.** Whereas language
   agencies are paced by the speaker.
6. **Stack skill is years of learning.** Children are not bad at
   stacks because they are stupid; they are still learning.
7. **Could a person ever be conscious?** Minsky inverts the
   question: humans may be poorly equipped to know themselves.
8. **Machines can be designed with better self-records.**
   Architecture is not fixed by evolution for designed systems.
9. **Better self-records cut both ways.** Easier to change, easier
   to wreck — knowledge alone does not promote development.

---

## What the implementation already absorbs

### Subjobs are real and trackable (idea 1)

The deliberate phase loops over agencies, each producing signals,
candidate actions, and possible handoffs
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Each handoff is a record on disk in `state/mind/issues/<n>/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
so accumulated subjobs are explicit.

### Multiple processes run in parallel within a phase (ideas 4, 5)

Within `deliberate`, agencies whose `activates_on` conditions
match the current state all contribute
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan is closer to Minsky's vision-system than to his
language-system: agencies are not forced into a single serial
stream by an external pacer.

### Self-records exist by construction (idea 8)

Every run leaves `state/mind/issues/<n>/` and (on settlement)
`memory/decisions/<settlement_id>.yml`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Idea 8's "machines can have better self-records than humans" is
structural here: the entire deliberation is on disk.

### Self-modification is gated (idea 9)

The `self-modification` frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
the soul-file guardian, and the governance approval-gate
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
together prevent "the easier to change themselves, the easier to
wreck themselves." Better self-records do *not* translate into
unsupervised mutation; that pairing is exactly what the plan
forbids.

### Budgets bound runaway recursion (idea 3)

Per-agency `budget.max_tool_calls` and `max_wall_clock_s`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
prevent unbounded subjob accumulation. The "three deep and
collapse" failure mode is structurally replaced by "budget cap
and exit."

---

## What the implementation does not yet take into account

### A — No actual stack data structure

Idea 1 is named: a *stack*. The plan accumulates handoffs and
signals into JSONL files but does not maintain a stack of
suspended-then-resumed work units. There is no
"current-call-stack.json" that lists "deliberating P, paused on
sub-question Q, paused on sub-sub-question R." Accumulation is
flat in time; nesting is implicit.

### B — Centre-embedded reasoning has no detector

Idea 3's failure mode — many similar processes still active at
the end — has no in-run detector. If the same agency is activated
many times in nested handoffs and each instance is still waiting,
the plan does not flag "we have three of you open; one will
mis-attribute roles." Critics do not target this shape.

### C — Speaker-paced serial fall-back is absent

Idea 4 contrasts vision (parallel) with language (serialised by
the speaker). The plan is parallel. There is no rule that says
"when the response will be linear text, force the deliberation
into a single chain so the presenter is not asked to serialise an
unserialisable thicket." The presenter is left to flatten
whatever it receives.

### D — Visual-attention-chooses-its-own-order has no analogue

Idea 5's vision behaviour — the agency chooses its own sequence
of attention to details — is *not* how the plan's perception runs.
The perceive phase classifies the stimulus by predefined
polynemes and frames; it does not iterate over the stimulus in
its own order
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Perception is *pulled* by the stimulus shape, not driven by the
agency's choice.

### E — Stack skill is not learned

Idea 6 — handling stacks improves over years — would suggest the
plan should record per-frame or per-agency *control-flow
maturity*. There is no such measure. The pipeline runs the same
way on day one as on day one thousand; nothing accrues that
shifts how deep nestings are handled.

### F — "Could a person ever be conscious?" inversion is not
named

Idea 7 is rhetorical but operationally important: it reminds the
designer not to take human introspective fluency as the
benchmark. The plan's voice rules (AGENTS.md) avoid claiming
introspective fluency, but there is no place in the implementation
documents that *names* this inversion — that says "the bar is not
to behave like a fluent human introspector; the bar is honest
trace plus auditable change."

### G — "Knowledge alone does not promote development" is
practised but unstated

Idea 9 is operationally lived by the gating around self-
modification, but the *principle* — that capability without
training is destructive — is not stated in the implementation
prose. A future contributor adding a powerful new self-modifying
agency could miss the principle and still ship the agency.

---

## Summary table

| # | Idea from §15.10 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Complex problems accumulate subjobs | Partial | Handoffs accumulate; no stack structure (gap A). |
| 2 | Untrained minds handle stacks poorly | Partial | Budgets cap depth; no failure-mode detector (gap B). |
| 3 | Three deep is the failure point | No | No nested-call detector (gap B). |
| 4 | Vision parallel, language serial | Partial | Plan is parallel; presenter-serialise rule absent (gap C). |
| 5 | Visual attention chooses order | No | Perception is polyneme-driven, not agency-driven (gap D). |
| 6 | Stack skill takes years | No | No control-flow maturity measure (gap E). |
| 7 | "Could a person ever be conscious?" | No | Inversion not named (gap F). |
| 8 | Machines can have better self-records | Yes | Full per-run trace on disk. |
| 9 | Better records cut both ways | Yes (in practice) | Self-modification is gated; principle unstated (gap G). |

---

## Implication for the plan (no changes proposed here)

§15.10 is one of the two sections in the chapter (with §15.8) where
the plan's machine architecture *could* exceed the human baseline
Minsky describes, and where the project deliberately chooses
restraint. Self-records are structurally good; self-modification is
deliberately restricted. The interesting gaps are the missing
*control-flow* representations — an explicit stack (gap A), a
nested-call detector (gap B), and a presenter-serialise rule (gap
C) — and the missing *principles* that the plan lives but does not
state (gaps F, G). The most consequential single opportunity is
gap A — an explicit call stack within the run — because it is the
structure Minsky says humans lack and machines *can* have. Closing
it would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(state tree extended with a call-stack file),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(handoff records that nest), and
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(deliberate-loop semantics). These are recorded here as analysis,
not as a change request. Any move to close them falls under the
"stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
