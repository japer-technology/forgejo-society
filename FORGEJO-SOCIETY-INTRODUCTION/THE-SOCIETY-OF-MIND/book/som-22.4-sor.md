# Section 22.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.4.md](som-22.4.md) — *Learning and teaching*
(Minsky, §22.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.4 names a problem teachers know: a child can pass a test and never
apply the skill in real life. The section attributes this to
*representation*: how a skill is stored decides how widely it
transfers. The harder problem behind it is *learning how to learn*,
which is twice removed from observable behaviour and lives in
B-brain machinery the observer cannot see directly.

---

## The ideas Section 22.4 actually carries

1. **Transfer of learning is the real test.** Passing a test is not
   the same as applying the skill in another context.
2. **Representation decides transfer.** Whether a skill survives
   moving to a new context depends on how it was stored, not on how
   thoroughly it was practised.
3. **Teaching is step-sizing.** A good teacher chooses the right
   granularity so that old recognisers and action scripts continue to
   apply.
4. **Analogies bridge unfamiliar territory.** Teachers suggest
   analogies that let prior skills attach to new material.
5. **There is a meta-skill: learning to learn.** Some children
   acquire it; others do not. It is not a single ability but a
   strategy for modifying the learner's own internal structures.
6. **The meta-skill is twice-removed from observation.** We can see
   actions; we can guess A-brain mechanisms; we cannot easily see
   the B-brain machinery that trains the A-brain.
7. **Lucky accidents matter.** The persistent concern with "better
   ways to learn" may itself trace to contingent events in the
   B-brain that nobody observes.

---

## What the implementation already absorbs

### Step-sizing through the pipeline (idea 3)

The pipeline phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
— *perceive → activate → deliberate → criticize → censor → settle →
act → remember → report* — break each stimulus into small,
checkable steps. The settlement layer refuses to act until the
governing frame's required slots are filled. This enforces a uniform
"keep the steps small" discipline.

### Analogy as a recovery mechanism (idea 4)

The analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
fires when no K-line and no frame matches strongly. `memory/analogies/`
holds typed structural mappings between domains. This is the
infrastructure that lets prior skills attach to unfamiliar inputs.

### A B-brain family by name (idea 5)

The `meta-admin` family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`agency.meta-admin.ecology-monitor`,
`agency.meta-admin.differentiation-broker`,
`agency.meta-admin.retirement-broker`) is structurally a B-brain: it
watches the A-brain and proposes changes to its agency set. The
authority level `govern` and the requirement of human confirmation
match the "rare and consequential" character of meta-level moves.

### Procedural memory for learnt practice (idea 2)

`memory/procedural/` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
records *how-to changes* — the closest analogue of a procedural
representation that can later be lifted into a different context.

### Visibility of A-brain decisions (idea 6, partially)

The settlement record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
makes every A-brain decision observable. `proposals[].method`,
`proposals[].alternatives_considered`, and `proposals[].observability_limits`
expose what would normally be invisible. The plan addresses Minsky's
"twice-removed" problem by *committing* the second level (the
settlement) to durable storage.

---

## What the implementation does not yet take into account

### A — No transfer-of-learning measurement

The plan does not have a metric that asks "did this K-line, learnt in
class X, fire usefully in class Y?" `reuse_count` tells us a K-line
was reused; it does not tell us whether the reuse crossed a
*frame-class* boundary. Without that signal the plan cannot
distinguish a rigidly-stored skill from a transferable one.

### B — Teaching has no internal counterpart

§22.4's "teacher" picks step size and supplies analogies on demand.
The plan has *critics* (objection-emitters) and *meta-admin*
(restructurers), but no agency whose role is to *teach* another agency
— to deliver an analogy when the analogy fallback would otherwise
fail, or to break a too-large stimulus into a sequence of smaller
sub-stimuli. The conscious-presenter speaks to the user; nothing
"speaks to" another agency in a teaching register.

### C — No representation-quality signal

Idea 2 implies there is a useful distinction between *versatile* and
*single-purpose* procedural memories. The plan stores procedural
memory but has no field that records its breadth, fragility, or
expected transferability. There is no critic of representation
quality.

### D — Learning to learn is structurally absent

The meta-admin family proposes structural changes (split, retire,
new frame on human confirmation) — but it does not modify the
*learning policy* itself. There is no mechanism by which the rate at
which K-lines are formed, the threshold at which an analogy is
attempted, or the cost of a generalisation is altered as a result of
observed outcomes. The B-brain currently changes A-brain *content*,
not A-brain *learning behaviour*.

### E — Lucky accidents have no recording surface

Idea 7 points at contingent events the observer cannot see. The plan
records *outcomes* and *settlements* — i.e. the visible. It has no
log specifically for *contingent moments that altered learning
behaviour* (e.g. "the rejected-candidates branch from settlement N
turned out to predict the success of settlement N+5"). The relational
links could in principle encode this, but no agency makes the link.

### F — Step-size is fixed, not adaptive

The pipeline's step granularity is the same for every stimulus.
§22.4 makes step-sizing the heart of teaching: it should be smaller
for unfamiliar territory and larger for familiar territory. The plan
has no policy that *changes* phase granularity based on how well the
stimulus matches known frames and K-lines.

---

## Summary table

| # | Idea from §22.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Transfer is the real test | No | No cross-class reuse metric (gap A). |
| 2 | Representation decides transfer | Partial | Procedural memory exists; no quality signal (gap C). |
| 3 | Teaching is step-sizing | Partial | Fixed phase granularity (gap F). |
| 4 | Analogies bridge new material | Yes | Analogy fallback + `memory/analogies/`. |
| 5 | Learning to learn | No | Meta-admin restructures; does not change learning policy (gap D). |
| 6 | Meta-skill is twice-removed | Addressed | Settlement records make second level observable. |
| 7 | Lucky accidents matter | No | No log for contingent learning-shaping events (gap E). |
| — | Teaching-style internal agency | No | Critics and meta-admin are not teachers (gap B). |

---

## Implication for the plan (no changes proposed here)

§22.4 sets a high bar: a society that *learns to learn* requires
B-brain machinery that watches the learning policy itself, not just
the structures the learning policy produces. The plan has the
visibility (settlement records expose A-brain decisions) and the
structural authority (`meta-admin`, `govern`), but the *policy* the
meta-admin would adjust — step size, generalisation cost, analogy
threshold, transfer rate — is not yet first-class.

Any move to add transfer-of-learning measurement, a teaching-style
agency, adaptive step-sizing, or B-brain control of learning policy
would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
