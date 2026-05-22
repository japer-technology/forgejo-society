# Section 10.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.2.md](som-10.2.md) — *Reasoning about amounts*
(Minsky, §10.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.2 sorts the candidate explanations for the conservation
phenomenon — QUANTITY, EXTENT, REVERSIBILITY, CONFINEMENT, LOGIC —
and rejects all of them as primary. The younger children, Minsky
argues, already *possess* the relevant abilities; what they lack is
knowledge about *when to apply* them. The load-bearing idea is the
distinction between *having* a skill and *knowing when to use it*.

---

## The ideas Section 10.2 actually carries

1. **There is no single concept of quantity.** What is learned is a
   multilevel agency (Society-of-More), not a unitary idea.
2. **Adults also fail without context.** Strip the history away and
   adults misjudge the taller jar too. Conservation is not a fact
   about the percept but about *what is known of the percept's
   history*.
3. **Capability ≠ deployment.** Younger children can give the
   correct answer when the experiment is described abstractly or
   performed out of sight. The skill is present; the *application
   policy* is not.
4. **Meta-knowledge about one's knowledge is itself a skill.**
   "Knowing which to use in different circumstances" is a separate
   competence from possessing the constituent reasoners.
5. **Learning is not accumulation.** Whatever has been learned,
   there is always more to learn *about how to use it*.

---

## What the implementation already absorbs

### Many narrow reasoners (idea 1)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
keeps reasoners small and narrow: perception, memory, code, safety,
identity, integration, assembly, meta-admin. No agency claims to
*be* the concept of quantity, contracts, or risk. The collapse rule
in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
forbids a monolithic "concept-holder" by construction.

### Context-sensitive activation (idea 2)

The `activates_on` field in the manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the polyneme typing in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are the mechanisms by which the right reasoners come on for the
right input. The implementation does not assume that the percept is
self-interpreting; it activates reasoners by frame slot and signal
type.

### A settlement layer that adjudicates (idea 1, idea 4)

The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is the place where many narrow signals become one decision. It
honours the "Society-of-More" shape: the visible answer is composed,
not primitive.

---

## What the implementation does not yet take into account

### A — Application policy is implicit

Idea 3 — capability ≠ deployment — is the load-bearing distinction
of §10.2 and has no first-class home in the plan. The manifest field
`activates_on`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
encodes *that* an agency activates on a frame slot but not *whether
the agency should be trusted* in this context. There is no
"deployment policy" file that ranks the same reasoner higher in one
situation than another. Priority is implicit in the manifest, not in
a separate, inspectable policy.

### B — No meta-knowledge agency

Idea 4 ("knowing which to use is itself a skill") would suggest a
class of agencies whose *job* is to choose among other agencies for
this input. The plan has critics (who object to proposals) and
censors (who veto on safety), and `agency.meta-admin.*` agencies
that maintain other agencies' definitions, but none whose purpose is
to *select the applicable reasoner per case*. The implicit selector
is the workflow plus `activates_on` — fixed at authoring time, not
chosen at run time by a dedicated agent.

### C — Out-of-sight reasoning is not modelled

§10.2's striking observation is that the same child gives the
correct answer when the experiment is *described* rather than
*shown*. The plan does not distinguish between *direct perception*
(a freshly-ingested document, an issue body) and *described
perception* (the same content paraphrased into the frame). The
perception phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
treats both alike. There is no toggle that says "this percept is
reported, not observed; weight the percept-driven reasoners lower."

### D — Learning loop missing (cross-reference)

Idea 5 — "there is always more to learn about how to use what was
already learned" — is the *meta-learning* claim. The plan logs
outcomes (`memory/episodic/`, `evolution/reinforcement-log.md`) but
does not feed them back into changes of application policy (gap D in
[som-1.1-sor.md](som-1.1-sor.md), restated here in §10.2's terms:
the society could discover when its existing reasoners are
mis-applied, but currently does not).

### E — Older-vs-younger has no analogue

The plan has no notion of an agency being *too immature to override*
in a given context. The authority levels (`read`, `draft`,
`propose`, `act`, `govern`, `human`) say *what* an agency may do;
they do not say *when* it has earned the right to over-rule another.
A maturity- or trust-graded selector is not part of the manifest
schema.

---

## Summary table

| # | Idea from §10.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No single concept of quantity | Yes | Family taxonomy + collapse rule forbid monolithic concept-holders. |
| 2 | Conservation is about history, not percept | Partial | Frames carry history slots; no explicit "percept vs. report" distinction (gap C). |
| 3 | Capability ≠ deployment | No | No deployment-policy primitive (gap A). |
| 4 | Meta-knowledge is itself a skill | No | No agency whose purpose is selecting other agencies per case (gap B). |
| 5 | Learning is not accumulation | Partial | Outcome logged, policy not updated (gap D). |
| — | Maturity-graded over-rule | No | Authority levels do not encode earned trust (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.2 strengthens an argument that is already visible in the plan —
that the visible answer is composed from narrow reasoners — but it
adds a distinction that the plan does not yet make: *having* a
reasoner is not the same as *knowing when to deploy it*. The plan
encodes the first half; the second half lives in implicit decisions
of the manifest authors. The largest unforced opportunities are
gap A (an inspectable application policy) and gap B (an agency whose
role is reasoner-selection). Both would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and would interact with the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md).
Neither is proposed here. Any move on either falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
