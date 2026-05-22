# Section 10.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.1.md](som-10.1.md) — *Piaget's experiments*
(Minsky, §10.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.1 opens chapter 10 by recalling Piaget's conservation
experiments: a child watches eggs spread apart or water poured into
a taller jar and judges the *amount* to have changed. The same child,
months or years later, gives the adult answer without instruction.
Minsky uses the observation to introduce a different idea — that
mind-societies *grow*, and that the growth is visible from outside
as a change of judgment over time. This analysis checks what the
implementation plan does, and does not, take into account about that
external visibility of growth.

---

## The ideas Section 10.1 actually carries

1. **Watching children is a method.** Mind-societies are large enough
   and slow enough to grow that an outside observer can see the
   growth happen. Behaviour at time *t1* is materially different from
   behaviour at *t2*, given the same prompt.
2. **A conservation question is a probe.** Asking "are there more
   eggs or more egg cups?" is a single, repeatable test whose answer
   discloses the current organisation of the underlying agency.
3. **The change is universal but un-instructed.** Each normal child
   eventually acquires the adult judgment. Nobody is taught it
   directly; the reorganisation happens from inside.
4. **Age varies; the process is regular.** When the change happens
   varies; what changes is the same shape across children and across
   cultures.
5. **A "Society-of-More" hides behind the simple word.** What looks
   like one concept (`more`) is in fact a layered agency that takes
   years to assemble.

---

## What the implementation already absorbs

### A repeatable probe surface (idea 2)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
gives every incoming request a stable shape (perceive → activate →
deliberate → criticize → censor → settle → act → remember → report).
Asking "the same question" twice — on two days, against two states
of `.forgejo-society/` — is a real, supported operation. The
settlement record produced by each run captures the society's answer
in a form that can be diffed across time.

### Externally visible history (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
puts every settlement under `memory/episodic/` and every consequential
decision under `memory/decisions/`. The git log itself, combined with
those files, lets a maintainer compare the society's judgment on
"the same egg-cup question" at two points in its life. The probe is
recorded; the change of answer would also be recorded.

### Universality through structure (idea 4)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
guarantee that two Forgejo societies start from the same agencies. The
"regular process across instances" half of idea 4 is therefore
trivially satisfied by construction; the *change over time within an
instance* half is the harder half (gap A below).

### `More` is composite, not atomic (idea 5)

The assembly family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`agency.assembly.summary-tier-1` and `summary-tier-2`) and the
single narrator `agency.integration.conscious-presenter` enact the
intuition that what looks like one judgment is in fact a stack of
intermediate aggregations. The plan does not have a `more` agency,
but it does honour the shape Minsky points at: visible answers are
the top of a layered society, not a primitive.

---

## What the implementation does not yet take into account

### A — Developmental time as a first-class axis

§10.1's central claim is that the *same* society gives *different*
answers at *different stages of its development*. The plan has rich
historical memory, but no notion of a society's *developmental
stage*. There is no field on a settlement that records "this is the
answer the society would have given at this maturity"; no place where
"infant", "stabilising", and "mature" phases of an agency's life
admit different rules
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
This is the same gap recorded against §1.1 (three timescales) and is
re-noted here because §10.1 makes it concrete.

### B — No conservation probe in the bootstrap or evolution layer

The bootstrap checklist
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md))
does not include a "growth probe" — a small, stable question the
society is asked at every release of `.forgejo-society/` so that the
shape of its answer can be tracked across versions. Piaget's method
is precisely this: a fixed probe, repeated, to expose hidden
reorganisation. The plan has the recording surface (`memory/episodic/`)
but no canonical probe set.

### C — Un-instructed change is not modelled

Idea 3 ("the reorganisation happens from inside, without explicit
instruction") is the deep Piagetian claim. The plan's mechanisms for
change — `self-modification` frame, `differentiation-broker`,
`retirement-broker`, `evolution/reinforcement-log.md` — are all
*instructed*: an agency or maintainer triggers them. There is no
mechanism by which the society *spontaneously* reorganises in
response to repeated experience. As §1.1 already noted, reinforcement
is logged, not applied; §10.1 reframes that gap as a developmental
one.

### D — No external observer agency

§10.1's epistemology depends on an outside watcher. The plan has the
introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
which lets the society describe its own state, but no analogue of a
human-style developmental observer who asks Piagetian questions and
diffs the answers. The maintainer plays that role implicitly; no
agency does so explicitly.

---

## Summary table

| # | Idea from §10.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Mind-societies grow visibly over time | Partial | Episodic memory + git log support the recording; no developmental phases (gap A). |
| 2 | A repeatable probe discloses organisation | Yes (mechanism) / No (catalogue) | Pipeline supports re-asking the same question; no canonical probe set (gap B). |
| 3 | Reorganisation is un-instructed | No | All change mechanisms are instructed (gap C). |
| 4 | Process universal, timing variable | Partial | Universal by construction across instances; intra-instance timing un-modelled (gap A). |
| 5 | Society-of-More: layered, not atomic | Yes | Assembly tiers + conscious-presenter enact the layered shape. |

---

## Implication for the plan (no changes proposed here)

§10.1 lands two of its five ideas cleanly into the implementation —
the layered nature of judgments (idea 5) and the existence of a
recordable, repeatable answer surface (idea 2 mechanism). The
remaining three — visible growth over developmental time
(idea 1 / gap A), un-instructed reorganisation (idea 3 / gap C), and
the presence of an external probe set (idea 2 catalogue / gap B) —
are the parts of Piaget's lesson that the current plan does not yet
take into account. None require change today; closing them would
touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md),
the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and possibly the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
