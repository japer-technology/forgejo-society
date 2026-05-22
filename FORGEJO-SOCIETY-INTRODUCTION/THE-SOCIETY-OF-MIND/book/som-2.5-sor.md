# Section 2.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.5.md](som-2.5.md) — *Easy things are hard*
(Minsky, §2.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§2.5 is the section in which Minsky reports what he and Papert found
when they tried to build the Builder agency as an actual robot at the
MIT AI Lab. It is the most operational chapter in *Society of Mind* so
far: it names the components (Hand, Eye, Move, See, Grasp), the
verification loops, the goal-conflict problem, and the uncomfortable
discovery that "ordinary common sense" is the hardest thing of all.
The implementation plan is also operational. The two can be compared
on the same ground.

---

## The ideas Section 2.5 actually carries

Pulled from Minsky's text:

1. **Easy things are hard.** The everyday problems — filling a pail
   with sand, stacking blocks without reusing a committed one — are
   *more* complicated than the puzzles adults call hard. A theory of
   mind is measured against the ordinary, not the contrived.
2. **An agency is hundreds of microskills, not one planner.** Builder
   required Move, See, Grasp *and hundreds of other little programs*.
   The agency name hides a large population of narrow workers.
3. **Cross-modal verification.** Where vision was unreliable, finger
   pressure was added "to verify that things were where they visually
   seemed to be." One sense checks another; no single channel is
   trusted on its own.
4. **Plan, execute, verify, correct.** Higher-level programs plan;
   other programs verify at every step that what was planned inside
   the mind actually took place outside — or else correct the
   mistakes. Verification is not a final stage; it is interleaved.
5. **Resource non-reuse / goal-conflict avoidance.** *Don't use an
   object to satisfy a new goal if that object is already involved in
   accomplishing a prior goal.* Recognising the situations in which
   such conflicts arise is itself learned.
6. **Policies for uncertainty.** Since no plan can be guaranteed,
   what the system needs is *policies* — which strategies are best
   to try, which avoid the worst mistakes. The policies are learned,
   not given.
7. **Anticipation as millions of little processes.** Anticipating,
   imagining, planning, predicting, and preventing are not a single
   faculty. They are thousands or millions of small processes running
   automatically.
8. **We are least aware of what our minds do best.** The most fluent
   capacities are the most opaque. Their machinery is intricate
   precisely because their use is effortless.

These eight items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Many small workers, not one planner (idea 2)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is a population of narrow agencies, not a small set of generalists.
The Perception, Memory, Code, Safety, Identity, Integration, Assembly,
and Meta-admin families together name roughly thirty seed workers —
`intake-bee`, `issue-kind-detector`, `ambiguity-detector`,
`urgency-detector`, `codebase-cartographer`, `patch-imaginer`,
`test-hunger`, `diff-skeptic`, `revert-path-finder`,
`blast-radius-fear`, `permission-minimizer`, and so on. Each one does
a single small job. The `agency.meta-admin.differentiation-broker`
exists precisely to *split* an over-broad agency into smaller ones
when its remit grows, which is the operational form of Minsky's
"hundreds of little programs we needed".

### Plan, execute, verify, correct (idea 4)

This is the strongest area of overlap with §2.5. The candidate-future
branch discipline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
makes the entire `act` phase a plan-and-verify loop:

1. create `society/<stimulus_id>/candidate-<n>` from `main`
2. apply the proposed diff
3. run validation steps in the same workflow run
4. write `diff-summary.md`, link it from the settlement
5. only then fast-forward, open a PR, or leave the branch for review

Step 3 is exactly Minsky's "verify at every step that what had been
planned inside the mind actually take place outside". The `code-change`
and `security-sensitive` frames also mandate
`agency.code.revert-path-finder` as a *required slot filler*
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Reversion guarantee"), which is the "correct the mistakes that
occurred" half of the same loop.

### Anticipation as many small processes (idea 7)

The censor and suppressor catalogues in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
are explicitly a population of narrow preventive processes:
`censor.workflow-danger`, `censor.secret-smeller`,
`censor.cloud-egress`, `censor.authority`, `censor.payment`,
`censor.delegation`, `censor.credential`, `censor.pii-exfiltration`,
and the suppressors `suppressor.workflow-diff-keywords`,
`suppressor.soul-file-diff`, `suppressor.high-entropy-string`. None of
them is a general "safety planner". Each is a small, mechanical
process that fires only on its own narrow trigger. This is the
implementation's answer to "thousands of little processes must be
involved in how we anticipate, imagine, plan, predict, and prevent".

The imagination half is also present: `agency.code.patch-imaginer`
drafts diffs on imagination branches, and the reality-model framing
in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
treats every branch as a *candidate future* the society entertains
without yet adopting.

### "Hundreds" is acknowledged as a target, not as the seed (idea 2 again)

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
"What 'done' looks like" and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
"Adding new agencies" together make clear that the first-ship
catalogue is intentionally small and that growth happens through the
`self-modification` frame, with the `differentiation-broker` and
`retirement-broker` as the two opposed pressures. The plan does not
*claim* hundreds of agencies in the first commit; it claims the
*mechanism* by which that population grows. This is a faithful
reading of §2.5: Builder took several years and many students.

### Goal of describing what looks effortless (idea 8, deliberately inverted)

§2.5 closes with "we're least aware of what our minds do best."
The implementation takes the opposite stance by design. Every safety
decision is logged
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Audit and observability"); a blocked outcome is as fully documented
as a successful one; the runtime writes an explicit signal even when
nothing visible happened, so suppressor-triggered escapes can be
detected later. The plan's *purpose* is to make the automatic *not*
automatic — to drag the invisible work into the git log. This is not
a contradiction of Minsky's observation; it is its operational
counter-position: the society is least *trustworthy* where its work
is least visible, so the work is made visible by construction.

---

## What the implementation does not yet take into account

These are the §2.5 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — Cross-modal verification: one axis only

Idea 3 (cross-modal verification) is the move where Papert and Minsky
added finger pressure *to verify that things were where they visually
seemed to be*. The plan has *one* verification axis: tests and
validation steps run in the same workflow run after a candidate diff
is applied
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
`act` step 3,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
`agency.code.test-hunger`). `agency.code.diff-skeptic` "attacks the
proposed patch on its own terms", which is an adversarial pass, not a
cross-modal one. There is no agency whose job is to *re-perceive* the
candidate state through a different representation (for example, a
type-checker reading what a runtime test produced, or a documentation
reader verifying that what a code patch claims matches what the
README still says). The plan would benefit from naming
*re-perception* as a distinct slot from *adversarial criticism*.

### B — Resource non-reuse across stimuli is not modelled

Idea 5 (don't use an object already involved in a prior goal) is the
problem the implementation is most exposed to and least equipped
for. The runtime has *one concurrency boundary per stimulus key*
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
"Why one workflow"), and `workspace/active-settlements/` lists the
settlements that are forming, pending, authorised, or executing
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"`workspace/`"). What does *not* exist is a *reservation table*: a
file that records, per in-flight settlement, which paths and which
resources are already committed to that prior goal, and that a new
stimulus must consult before its `patch-imaginer` proposes anything
overlapping. Two concurrent stimuli editing overlapping files would
each open their own candidate branch and discover the conflict only
at merge. Minsky's question — *recognise the situations in which
difficulties are likely to occur* — is left to git, not to the
society.

### C — Policies for uncertainty are static, not learned

Idea 6 (learned policies for uncertainty) is partially answered by
the static policy catalogue: `policies/danger-zones.yml`,
`policies/write-policy.yml`, `policies/kill-switch.yml`, and the
frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
that select defaults for a kind of situation. These are *encoded*
policies, not *learned* policies. Outcomes are recorded in
`evolution/reinforcement-log.md`
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
pipeline mapping table), but the log does not feed back into the
policies themselves. This is the same gap recorded as gap D in
[`som-1.1-sor.md`](som-1.1-sor.md) under Learning, surfaced again
here by §2.5 from a different angle: §2.5 frames it as *how do you
know which strategy to try?*, and the plan's current answer is
"whichever the static frame selects".

### D — Goal-conflict recognition is not a first-class agency

Idea 5, restated as a workshop question: which agency, in the
first-ship catalogue, is responsible for recognising that the current
candidate action conflicts with another goal *the society itself*
already committed to? `agency.memory.contradiction-finder` flags
candidate actions that contradict *semantic memory*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
which catches conflict with *past* decisions. No agency catches
conflict with *concurrent in-flight* decisions. The closest existing
shape is `workspace/active-settlements/`, but no agency reads it as
input. Closing this would mean either a new agency
(`agency.memory.in-flight-conflict-finder`) or a new slot on the
existing contradiction-finder — recorded here as observation, not
as a change.

### E — The Builder mapping (Eye, Hand, Computer) is implicit

§2.5 names the components of the embodied loop very precisely: a
mechanical Hand with finger pressure sensors, a television Eye, a
computer that plans, and verification programs that close the loop.
The implementation has structural analogues — Forgejo events are the
Eye, the Forgejo runner is the Hand, the agencies are the planner,
and the validation step is the verification loop — but the plan does
not declare this mapping explicitly. The Perception family is
identifiably sensory and the Code/Integration families are
identifiably motor, but the *split* between sensory and motor work
is not named anywhere in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
A reviewer reading §2.5 cannot find the line in the plan where
"this is the Eye; this is the Hand". It is implicit in the family
taxonomy, not declared.

### F — Ecology growth is not sized

§2.5 reports "thousands and, perhaps, millions of little processes."
The implementation has the *mechanism* for growth
(`differentiation-broker`, `retirement-broker`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
"Adding new agencies") but no *target ecology size* and no rule for
when the population is too small or too large. The cron-scheduled
ecology review in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Scheduled (cron) loop" produces a report; what the report compares
against is not specified. Without a sizing rule, the
differentiation-broker has no signal for when to act other than
human judgement. This is a soft gap — §2.5 itself does not specify
a target — but worth recording.

### G — Microskill granularity is not bounded below

Idea 2 says "hundreds of microskills". The plan has nothing that
*resists* an agency growing into a generalist — only the
`differentiation-broker` that proposes splitting after the fact, and
the `budget` field on each manifest that caps wall-clock and tool
calls per agency. There is no critic in the catalogue whose job is
to detect when an agency's prompt body has drifted into doing more
than one job. `critic.scope` is the closest, but it targets
*proposals* exceeding their declared scope, not *agencies* exceeding
theirs
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
"First-ship critic catalogue"). A critic of agency scope is missing.

---

## Summary table

| # | Idea from §2.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Easy things are hard | Yes (implicit) | Composite pipeline; every act is expensive; verification interleaved. |
| 2 | Hundreds of microskills, not one planner | Partial | Seed catalogue is ~30 small agencies; `differentiation-broker` is the growth mechanism; ecology size is not sized (gap F) and microskill granularity is not bounded below (gap G). |
| 3 | Cross-modal verification | Partial | Validation runs after diff apply; `diff-skeptic` adds adversarial pass; re-perception via a different representation is not a declared slot (gap A). |
| 4 | Plan, execute, verify, correct | Yes | Candidate-future branches + validation in same run + `revert-path-finder` required slot. |
| 5 | Resource non-reuse / goal conflict | No | No reservation table; no in-flight conflict finder (gaps B and D). |
| 6 | Policies for uncertainty are learned | Partial | Static policies in `policies/*.yml` and frames; reinforcement logged but not applied (gap C). |
| 7 | Anticipation as many little processes | Yes | Censor + suppressor catalogues; imagination branches; `patch-imaginer`; `blast-radius-fear`. |
| 8 | Least aware of what minds do best | Yes (inverted by design) | The plan makes the automatic visible by construction; audit-and-observability section is the operational counter-position. |
| — | Builder = Eye / Hand / Computer | Partial | Structural analogues exist (events / runner / agencies / validation) but the split is not declared (gap E). |

---

## Implication for the plan (no changes proposed here)

§2.5 is *Society of Mind*'s most operational chapter so far, and the
implementation plan is at its strongest where Minsky was most
operational: it has the many-small-workers shape, the
plan/execute/verify/correct loop in the candidate-future branch
discipline, and the many narrow preventive processes in the censor
and suppressor catalogues. It even takes a defensible inverse
position on Minsky's closing line, choosing to make the automatic
visible rather than leaving it opaque.

The gaps cluster around two questions §2.5 asks that the plan
currently answers thinly:

- **"Which object is already committed to a prior goal?"** — gaps
  B and D. The plan has no reservation table and no in-flight
  conflict finder. Concurrent stimuli rely on git to surface
  conflict at merge, not on the society to anticipate it.
- **"How do we know which strategy to try?"** — gaps A and C.
  Verification is single-axis (tests), policies are static, and
  reinforcement is logged but not applied. This echoes gap D in
  [`som-1.1-sor.md`](som-1.1-sor.md) from a different angle.

The remaining items (gaps E, F, G) are about *declaration*: the
Builder mapping is implicit rather than named, ecology size has no
target, and agency-scope drift has no critic. These are
documentation-shaped gaps.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema and family
taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the reservation and conflict shape that would need a new section in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the credit-assignment and evolution protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and possibly the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
