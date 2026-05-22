# Section 5.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.7.md](som-5.7.md) — *Permanent identity*
(Minsky, §5.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.7 is the closing section of Chapter 5 and asks the harder version
of the self question: not *who narrates now*, but *what stays the
same across years* when the agents themselves change. Minsky's
candidate answers — body of slowly-changing memories, never-ending
side-effects of experience, the agents that change least — are all
that the chapter is willing to offer. The section also notices the
generosity of present-self toward future-self (saving today for a
self that has done nothing in return) as evidence that the continuity
is real even when its substrate is not.

---

## The ideas Section 5.7 actually carries

1. **Continuity despite change.** A person reports being the same
   *me* across decades, even when almost every constituent has
   changed.
2. **Earlier selves are unreachable.** We cannot recall how things
   appeared before we learned to read them; we therefore cannot
   recall how we ourselves appeared either.
3. **Generosity across time.** Present-self acts on behalf of
   future-self without reciprocation, treating future-self as the
   same self.
4. **Three candidate substrates for identity.** Slow-changing
   memories; the residue of all prior experience; the subset of
   agents that change least.
5. **No single answer is offered.** Minsky leaves the question open;
   identity is *attributed*, not *located*.

---

## What the implementation already absorbs

### A stable, file-shaped self-model (idea 1)

The society has a *stated* identity in
[AGENTS.md](../../../AGENTS.md), the spec-level identity protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)),
and the per-instance self-model written by
`agency.identity.spock-self-model`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
A society's `sor_id` is invariant across the life of the repository,
and the manifest catalogue under `agencies/`, `critics/`, `censors/`
gives the society a body that an outsider can inspect at any point
in time. Identity is *asserted* in files, in exactly the calm voice
Minsky's section asks the question in.

### A residue of all prior experience (idea 4, substrate two)

The git log itself, plus `memory/episodic/`, `memory/decisions/`,
`memory/semantic/`, and `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
is the never-ending side-effect of every previous run. The plan's
append-only discipline means that nothing is forgotten by overwrite;
older states remain reachable.

### Slow-changing agents (idea 4, substrate three)

The plan separates routine reinforcement (logged, currently
non-applied) from *structural* change to the catalogue, which
requires the `self-modification` frame and a human approval gate
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
Routine signals are fast; the identity layer changes only by
governed settlements. This produces — by construction — a subset of
agents that change least, which is exactly Minsky's third candidate.

### Continuity across runs (idea 1)

Settlements, K-lines, and frames are stable records under
[`THE-SOCIETY-OF-REPO/07-workspace/active-settlements/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/active-settlements/)
and `memory/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
each cycle restores prior context via the `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The society of one cycle and the society of the next can fairly be
called the same society.

---

## What the implementation does not yet take into account

### A — No marked distinction between slow-self and fast-self

Idea 4 specifically separates "slowly-changing memory body" from
"agents that change least". The plan has both, but does not mark
them as different *kinds* of self. The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
has no `stability` field; an agency that has been unchanged for a
year and one that has been edited yesterday are indistinguishable in
the catalogue. The "agents that change least" candidate identity has
no operational tag.

### B — Earlier self-states are reachable but unreadable in their own terms

Idea 2 — the older self cannot be re-experienced — has a literal
analogue in the plan. The git log preserves earlier manifests, but
re-running a past cycle with the *current* model and *current*
prompts would not reconstruct the old behaviour. The plan does not
note this, and has no policy on whether an older self-model should
be loaded *as-was* when reviewing an older settlement, or merely
*read* from the new vantage. The introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
does not address this asymmetry.

### C — Future-self generosity has no representation

Idea 3 — saving for a future self — has no slot in the plan. A
settlement has `decision`, `attributions`, `commitments`, but no
notion of "obligation deferred to a future cycle on behalf of a
future society"
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
K-lines preserve *useful context*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
which is generosity to future cycles in effect, but is not labelled
as such. The plan saves for the future; it does not *acknowledge*
saving for the future.

### D — Identity invariants are not checked

The society *has* a self-model (`spock-self-model.md`) and a
governance file
([`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/)),
but no critic family asks, after a `self-modification` settlement,
"is the result still the same society?" The `self-ideals.md` file
exists, but there is no automated check that a structural change
leaves the stated ideals intact. Continuity is preserved by
*absence of edit*, not by *test of identity*.

### E — Identity is asserted, not attributed by an observer

Idea 5 reframes identity as something the observer assigns. The
plan's identity is internal: the society names itself. There is no
external attribution loop — no federated audit that says "instances
X and Y are the same society now and were the same society a year
ago" — even though federation material under
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
would be the place for such a loop. The asymmetry between
*asserted* and *attributed* identity is not represented.

### F — No "rate of change" telemetry on the catalogue

Idea 4's "agents that change least" implies a *rate*. The plan has
git as the change record but does not surface a churn metric per
agency, frame, K-line, or critic. A reviewer wanting to ask "which
parts of this society have been stable for a year?" must derive it
from the log; no file under
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
publishes it.

---

## Summary table

| # | Idea from §5.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Continuity despite change | Yes | Stable `sor_id`, file-shaped self-model, append-only memory. |
| 2 | Earlier selves are unreachable | Partial | Earlier states preserved in git; reading them *as-was* is undefined (gap B). |
| 3 | Generosity across time | Partial | K-lines + commitments help future cycles; no labelled "future-self obligation" slot (gap C). |
| 4 | Three identity substrates | Partial | All three present; only the "residue" substrate is operationally clear; no stability tag (gap A); no churn telemetry (gap F). |
| 5 | Identity is attributed, not located | Partial | Self-assertion strong; external attribution absent (gap E); no identity-invariant check (gap D). |

---

## Implication for the plan (no changes proposed here)

§5.7 is gentle; it asks the plan to be honest about *what stays the
same* across structural change. The plan's strongest answer is its
append-only memory and its `self-modification`-with-approval rule,
which together produce a defensible continuity. The weaker answers
are the absences: no per-agency stability marker, no future-self
slot, no identity-invariant check after a structural settlement, no
external attribution loop, no churn metric.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the introspection and identity protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
