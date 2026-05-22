# Section 18.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.1.md](som-18.1.md) — *Must machines be logical?*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.1 opens Minsky's chapter on reasoning with a deliberate refusal:
machines need not — and minds do not — *think* in logic. Logic is a
post-hoc cleanup, a way to talk about thoughts after the fact. The
real engine is "generate and test", with logic playing only the test
role, and only sometimes.

---

## The ideas Section 18.1 actually carries

1. **Confusing agent with agency.** The error in "machines must be
   logical" is the same error as confusing one component with the
   whole. How parts work in isolation does not predict how the
   composite behaves.
2. **Logical description ≠ logical behaviour.** A machine can be
   built from neat parts and still display untidy behaviour. The
   chess-playing engine can lose; that does not prove fraud.
3. **Logic is post-hoc.** People rarely use logic to *find* an
   answer. They use it after the fact: to simplify, summarise,
   explain to others, persuade, and clean up the tangle of how the
   thought actually arose.
4. **Generate and test.** Real problem solving is generative; logic
   serves only as the *test* filter. It cannot say which ideas to
   produce, which memories to use, or which directions to try.
5. **Grammar analogy.** Logic is to thinking as grammar is to
   speech: both tell you whether a result is well formed, neither
   tells you what to say.
6. **A logical system without goals is madness.** Pure deduction
   with no intention generates pointless truths (`A implies A`,
   `P or not P`). Intelligence requires *intentions* binding logic
   to goals.

---

## What the implementation already absorbs

### Generate and test as the loop shape (idea 4)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
describe an explicitly generative loop: `perceive → activate →
deliberate → criticize → censor → settle → act`. The *generation*
happens in `deliberate` (agencies emit candidate actions); the
*testing* happens in `criticize` and `censor`. Critics and censors do
not author candidates — they reject. This is exactly Minsky's split
between the productive and the verifying halves of cognition.

### Logic is a test, not a generator (ideas 3 and 5)

The critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`critic.evidence`, `critic.scope`, `critic.cost`, `critic.risk`,
`critic.overconfidence`, `critic.source-quality`, `critic.staleness`)
plays Minsky's "test" role. Each critic returns an objection record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
never a candidate action. Critics are forbidden from acting — their
`outputs:` slot is restricted, and their authority defaults to `read`.
This implementation discipline mirrors the grammar analogy: critics
say *whether* a candidate is well formed; they cannot say what to
make.

### Confusing agent with agency, refused (idea 1)

The manifest schema separates `agent` (a single unit with `id`,
`agency`, `kind`) from `agency` (a family of related units). The
`agent`/`agency` distinction is enforced by
[`schemas/manifest.schema.json`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and by the identity protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)).
A reviewer cannot accidentally describe the system at the wrong
granularity; the schema forces them to name which they mean.

### Settlement as the post-hoc clean-up (idea 3)

The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
is precisely what Minsky describes as the "logical" residue: it is
written *after* the deliberation cycle settles, summarising
proposals, evidence, sustained objections, and the chosen action. The
society's visible reasoning — what Spock posts in `act` — is a
*clean-up* of the messier `signals.jsonl` and `handoffs` produced
during deliberation. The system does not pretend the clean
explanation was the actual generative path.

---

## What the implementation does not yet take into account

### A — Intentions are not first-class

Idea 6 (logic without goals is madness) requires intentions to be
*explicit*. The plan has frames with `slots:` (required fillers) and
`failure_conditions:`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
that approximate "what we want to be true at the end". It does not
have an *intention* primitive — a stated goal that a cycle is *for*.
A `stimulus_id` says what the cycle is *about*; nothing says what it
*wants*. This is the same gap recorded in the §1.1 analysis under
Question 9 (Intention) and is unchanged here.

### B — No explicit "logic is one mode among many" marker

§18.1 makes a sharp claim: ordinary thinking is not approximate
logic; logic is one *part* of a richer chaining repertoire (§18.2
will name causes, similarities, dependencies as siblings of
implication). The plan's critic set is logic-flavoured: evidence,
overconfidence, source-quality. None of them are *causal* critics,
*analogical* critics, or *similarity* critics. The plan would treat
"this conclusion follows logically but is causally implausible" with
`critic.evidence` rather than a dedicated mode. The mode is missing,
not the machinery.

### C — Generation and test are not separately budgeted

The budget model
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
`max_tool_calls`, `max_wall_clock_s`) is per-agency. There is no
distinct budget for *generation* versus *test*. Minsky's point that
test is cheap and generation is expensive is not reflected in
allocation; a critic and a code-imaginer can compete for the same
pool. This is a small operational gap rather than a structural one.

### D — Post-hoc explanation is not labelled as such

The settlement contains `proposals`, `critics`, `censors`,
`reality_revision`, and Spock's `final_response`. Nothing in the
schema records *which parts are reconstructed* versus *which parts
were live in the deliberation*. A reader of a settlement could
mistake Spock's narrative for a transcript of the actual generative
path. §18.1 specifically warns against this confusion (the chess
machine reasoning fallacy). A small slot — say
`narrative_method: reconstructed | live` — would mark the seam.

---

## Summary table

| # | Idea from §18.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Confusing agent with agency | Yes | Manifest schema separates `agent` / `agency`; identity protocol enforces. |
| 2 | Logical description ≠ logical behaviour | Yes | The composite pipeline is generative; no claim that the whole behaves logically because the parts do. |
| 3 | Logic is post-hoc | Partial | Settlement is the post-hoc record; nothing labels it as a reconstruction (gap D). |
| 4 | Generate and test | Yes | `deliberate` generates, `criticize` + `censor` test. |
| 5 | Grammar analogy | Yes | Critics emit objections only; cannot author candidates. |
| 6 | Logic without goals is madness | Partial | Frames give slot-shaped goals; no explicit *intention* primitive (gap A). |
| — | Logic is one mode among many | No | Critic catalogue is logic-flavoured; no causal/analogical critics yet (gap B). |
| — | Generation vs test as distinct budgets | No | Per-agency budgets only (gap C). |

---

## Implication for the plan (no changes proposed here)

§18.1 sets the chapter's frame: the society must reason without
becoming a deduction engine. The implementation already honours the
move — generation lives in `deliberate`, test lives in `criticize`
and `censor`, and critics are forbidden from authoring. The
settlement plays the role Minsky reserves for logic: clean-up after
the fact.

What is unrepresented is the *texture* §18.1 hints toward and §18.2
will make explicit: that logic is one chain among many (causal,
similarity, dependency). The plan currently treats reasoning quality
through logic-flavoured critics and reserves causal or analogical
checks for ad hoc objections. The other open seam is the absence of
a label distinguishing live deliberation from reconstructed
narrative, and the absence of a first-class *intention* primitive
beneath the frame.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the critic catalogue and manifest
schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and possibly the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
