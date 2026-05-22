# Figure Appendix-1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-1.md](Appendix-1.md) — *A person-recognizing
agency.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-1 and
checks each one against the implementation plan. The aim is to mark,
plainly, what the plan already absorbs and what it does not yet name.

---

## The ideas Figure Appendix-1 actually carries

Pulled from the figure caption and Minsky's appendix prose on
*predestined learning*:

1. **Inherited wiring, learned content.** The figure encodes what is
   *given by construction* (which sensors feed which downstream
   agency) and leaves what those agencies learn as a separate matter.
2. **Modality-typed perception.** Inputs are partitioned first by
   modality (vision, hearing, touch, smell) and only then by
   sub-specialty (faces, voices, soft touch, human odour).
3. **Specialist sensors within a modality.** Each modality contains
   narrow detectors (`FACES`, `VOICES`, `SOFT`, `HUMAN`) plus a
   residual `OTHER` channel.
4. **Convergence into a typed aggregator.** Wires from the
   human-relevant sensors all terminate in a single named agency
   (`HUMANOID OBJECTS`) whose identity is fixed before any learning.
5. **A parallel residual aggregator.** The non-person wires terminate
   in `ALL OTHER OBJECTS`, so the architecture commits, up front, to a
   *two-class* topology.
6. **Routing as the carrier of meaning.** The dedicated agency learns
   "person" *because* it is the only thing its inputs ever describe;
   the concept is enforced by topology, not by a label.
7. **No central classifier.** There is no upstream unit that decides
   "this is a person" and dispatches; the decision is implicit in
   where the wires go.
8. **Architecture as inherited prior.** The figure treats the wiring
   diagram itself as a kind of inherited knowledge, separate from
   anything the agencies later compute.

---

## What the implementation already absorbs

### 1 — Perception as a typed family

[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
makes `perception` a first-class family under
`.forgejo-society/agencies/perception/`. Members such as
`kline-retriever`, `frame-matcher`, and `signal-classifier` are narrow
specialists, matching the figure's "small detectors inside a larger
modality" shape at one level of abstraction.

### 2 — Signal-typed routing into deliberation

[`02-workflow-design.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and [`09-handoff-and-signal-schemas.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
define signals with explicit `kind` and `source` fields; downstream
units subscribe via `activates_on`. This is the operational form of
Figure Appendix-1's "wires from this sensor go to that agency" — the
topology is declared, not learned at runtime.

### 3 — A residual / catch-all channel

The plan's `agency.code.unknown-shape` and the `revert-path-finder`
behave as the figure's `OTHER` lanes: explicit destinations for input
that does not match any specialist's `activates_on`. There is a place
for "everything else" rather than silent drop.

---

## What the implementation does not yet take into account

### A — Modality as a top-level partition of perception

The figure's first cut is *vision vs hearing vs touch vs smell*. The
plan's perception family is a flat folder; signals carry a `kind`,
but there is no modality-level container (`perception/vision/*`,
`perception/audio/*`) and no manifest that *is* a modality. There is
therefore nothing to "turn on the vision side only," and no audit
surface for "which modalities are wired into which downstream
agency."

### B — Inherited wiring as a separate artefact

Figure Appendix-1 treats the connection map as *given*. The plan
expresses connectivity only as the union of every member's
`activates_on`, scattered across manifests. There is no
`.forgejo-society/topology/perception.md` (or equivalent) that
declares the routing as a single object, no diff target for "the
wiring changed," and no schema for "this wire is inherited and not to
be rewired by a runtime agency."

### C — A typed aggregator agency with no body of its own

`HUMANOID OBJECTS` does nothing except *be the place those wires
converge*. The plan has no `kind: aggregator` whose manifest body is
empty and whose only role is "receive these signals, emit one typed
signal." Anything that needs to play that role today has to be a full
agency with a prompt, which fuses routing and reasoning.

### D — Two-class commitment at the architecture level

The figure's `HUMANOID OBJECTS` / `ALL OTHER OBJECTS` split is a
*structural* decision. The plan's classifications (`event.kind`,
`agency` family) are configurable per-manifest; there is no
mechanism that says "exactly these two destinations exist for this
class of perception, and no third is allowed." The closest analogue
is censor policy, but censors gate behaviour, not topology.

### E — Cross-modal pre-wiring before any learning

In the figure, *several modalities* feed *one* downstream agency
before that agency has learned anything. The plan's assembly family
([`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
combines outputs, but only after each contributing agency has
already run as a full prompt. There is no pre-deliberation merge of
signals from heterogeneous modalities into a single typed channel.

### F — Concept-by-position rather than concept-by-prompt

The figure's central claim is that *position in the wiring* fixes
what an agency is about. The plan's agencies are *about* whatever
their manifest body and prompt say they are about; their `id` and
their `activates_on` set are advisory, not constitutive. There is no
guarantee that the unit currently named `agency.perception.humanoid`
is the unique destination of any particular signal class.

### G — A vocabulary for "inherited" vs "acquired" structure

[`07-policies-and-safety.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and the differentiation flow named in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
allow agencies to split and evolve, but the schema has no field that
marks a manifest or a wire as *inherited and not subject to
self-modification*. Figure Appendix-1's distinction between the
genome-fixed routing and the agency's later learning is therefore
not representable.

---

## Summary table

| # | Idea from Figure Appendix-1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Inherited wiring, learned content | No | No inherited-vs-acquired marker on manifests or wires (gap G). |
| 2 | Modality-typed perception | Partial | Signals carry `kind`; no modality container (gap A). |
| 3 | Specialist sensors within a modality | Yes | Perception family members are narrow specialists. |
| 4 | Convergence into a typed aggregator | Partial | Assembly family aggregates outputs; no pre-deliberation aggregator (gap C, E). |
| 5 | Parallel residual aggregator | Yes | Catch-all / unknown-shape agencies exist. |
| 6 | Routing as the carrier of meaning | No | Meaning lives in manifest prose, not in topology (gap F). |
| 7 | No central classifier | Partial | Signal subscription is decentralised; structural uniqueness is not enforced (gap D). |
| 8 | Architecture as inherited prior | No | No topology artefact, no inherited flag (gap B, G). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-1 argues that an architecture can *commit* to a
concept by where it routes wires, before any learning happens. The
implementation plan honours the *outcome* (narrow perception
specialists, declared subscription, an explicit catch-all) but not
the *commitment mechanism* (a topology artefact, inherited wires,
typed aggregators that are pure destinations).

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — a `perception/<modality>/`
container, a topology document, a `kind: aggregator`, or an
`inherited: true` field — would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).
