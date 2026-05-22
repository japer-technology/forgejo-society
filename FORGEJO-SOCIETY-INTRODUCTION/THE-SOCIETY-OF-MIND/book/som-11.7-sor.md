# Section 11.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.7.md](som-11.7.md) — *Predestined learning*
(Minsky, §11.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.7 dissolves the inborn-versus-learned dichotomy. Some outcomes
are guaranteed by the world (the geometry of space, the layout of
the body); evolution does not need to specify the wiring of each
nerve, only a learning machine that will *converge* on the
inevitable answer. Minsky calls this *predestined learning*. The
section's quiet lesson: genes set the conditions; learning fills in
the rest; the answer is determined by neither alone.

---

## The ideas Section 11.7 actually carries

1. **The built-in vs. learned line is not sharp.** Most real
   biological structures arise from the interaction of both.
2. **Learning can be cheaper than specifying.** It costs less
   genetic information to build a learning machine that will
   converge than to specify every connection.
3. **Constraints from the world predestine the outcome.** When the
   environment is regular, the learning machine reaches a roughly
   fixed result regardless of detailed history.
4. **Genes scaffold timing and substrate.** Inheritance supplies
   layers of agents at "roughly the right times and places";
   experience does the rest.
5. **Adaptive organs are essential.** A purely pre-specified system
   cannot meet variable conditions; a purely adaptive one cannot
   meet tight constraints. The combination is the point.

---

## What the implementation already absorbs

### Built-in and learned coexist by design (idea 1)

The plan is structurally a *predestined learning* system. The
first-ship catalogues in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are the inborn substrate; the K-line tree under `memory/klines/` is
the learned overlay. The boundary is not policed because the
section says it should not be.

### Cheap specification, expensive learning (idea 2)

The bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
ships a small set of agencies, frames, critics, censors, and
polynemes — far fewer than would be needed to handle every possible
stimulus directly. The plan trusts the runtime to *learn* the rest
via K-line accumulation, ecology review, and (eventually) procedural
memory edits.

### Constraints from the world (idea 3)

The repository itself is the §11.7 "world". Path polynemes, danger
zones, the authority registry, and the policy ledger all bind to
repository structure. Two societies bootstrapped into the same kind
of repository will reach similar effective behaviour, because the
substrate they learn against is the same — exactly the convergence
§11.7 describes.

### Genes as timing and substrate (idea 4)

The phased bootstrap in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
(Phase A, B, C) plays the role of "layers of agents at roughly the
right times". The runtime is not all available at once; it is
staged. Censors and the kill switch in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
play the role of genetic constraints that hold no matter what the
learning process produces.

### Adaptive organs (idea 5)

The `self-modification` frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
plus `agency.meta-admin.differentiation-broker` and
`agency.meta-admin.retirement-broker` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
let the society reshape itself — within the constraints of human
approval and danger zones. The "tightly constrained yet adaptive"
balance §11.7 calls essential is exactly the plan's posture.

---

## What the implementation does not yet take into account

### A — The reinforcement loop is not closed

§11.7's whole argument depends on learning *actually happening*.
The plan logs reinforcement (`evolution/reinforcement-log.md` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
but does not yet feed those weights back into agency selection,
critic weighting, or polyneme weights. The "learning machine" is
present in skeleton; it does not yet converge.

### B — No notion of "predestined target"

§11.7's force is that the world *determines* the answer. The plan
has no place where it states the targets a learning society is
expected to converge upon — what its K-line distribution should
look like at maturity, what its effective frame frequencies should
be, what the steady-state ratio of perception/critic/censor work
should be. Without targets, the question "is this society
learning?" has no measure.

### C — Genetic scaffolding is not separated from runtime state

§11.7's distinction between *genes* (timing, substrate) and *what
the organism becomes* maps cleanly onto first-ship catalogues
versus learned memory — but the plan does not protect that
distinction. The first-ship catalogue files live alongside
everything else under `.forgejo-society/`; nothing prevents a
self-modification from rewriting them. A separate "germline"
designation is not part of the schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).

### D — "Roughly the right times and places" is unscheduled

Idea 4's image is of layered enablement: components arrive when
they are needed and not before. The plan stages bootstrap into
phases but, within a running society, has no analogue of
*timed unlock*: agencies do not become available only after the
society has accumulated enough K-lines of a certain class; danger
zones do not relax as the society's track record lengthens. The
runtime has phases at install time but not in its lived time.

---

## Summary table

| # | Idea from §11.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Built-in vs. learned line is not sharp | Yes | First-ship catalogues + learned K-line tree coexist by design. |
| 2 | Learning can be cheaper than specifying | Yes | Small first-ship; K-lines fill in. |
| 3 | Constraints from the world predestine | Yes | Path polynemes, danger zones, authority registry bind to repo. |
| 4 | Genes scaffold timing and substrate | Partial | Install phases yes; runtime timing no (gap D). |
| 5 | Adaptive organs are essential | Yes | `self-modification` + meta-admin brokers + censors. |
| — | The learning loop is closed | No | Reinforcement logged, not applied (gap A). |
| — | Predestined targets are declared | No | No convergence targets (gap B). |
| — | Germline distinct from soma | No | First-ship files unprotected from self-modification (gap C). |

---

## Implication for the plan (no changes proposed here)

§11.7 is the chapter's most flattering section for the plan's
*architecture* and most exposing for its *operation*. The plan is
shaped exactly as §11.7 recommends — small inborn substrate, large
learning surface, world-bound constraints, adaptive organs under
governance — but the learning is not yet *running*. Reinforcement
is recorded; it does not act. The plan has the body of a
predestined-learning system without (yet) its physiology.

The openings cluster: close the reinforcement loop (gap A),
declare convergence targets (gap B), separate the germline from
the learned tree (gap C), and add timed unlocks within a running
society (gap D).

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the credit-assignment and evolution protocols at
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
