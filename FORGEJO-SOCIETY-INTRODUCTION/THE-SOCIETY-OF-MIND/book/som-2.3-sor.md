# Section 2.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.3.md](som-2.3.md) — *Parts and wholes*
(Minsky, §2.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§2.3 is short but load-bearing. It is the section in which Minsky
refuses *holistic* and *gestalt* as explanations and insists that
every "whole that is more than the sum of its parts" — whether a
tower, a chain, a drawing, or a personality — reduces, in principle,
to a story about how the parts interact. The subjective versions feel
harder only because we know less about the parts. This is the
methodological warrant for everything that follows in the book, and
therefore for the implementation plan.

---

## The ideas Section 2.3 actually carries

Pulled from Minsky's text:

1. **"More than the sum of its parts" is an admission of ignorance,
   not an explanatory category.** Reverent words like *holistic* and
   *gestalt* gesture at mysteries rather than dissolving them.
2. **Objective wholes are explained by interaction.** A tower stands
   because every block is held by its neighbours and by gravity. A
   chain holds because each link is in its neighbours' way. The
   explanation is the *mechanism of interaction*, nothing else.
3. **Subjective wholes are explained the same way.** A drawing,
   personality, or culture is also "more than the sum" because of
   interactions — but the interactions are now *among the agents in
   the mind*, not among external objects.
4. **The asymmetry is familiarity, not category.** Children find the
   object-world mysterious too; adults forget how hard it was to
   learn. The subjective questions are not a different kind of
   question; they are the same kind, on parts we have not yet
   itemised.
5. **Naming is not explaining.** Giving the mystery a name can be
   useful when it focuses attention on what is unknown. It is harmful
   when the name persuades us that meaning has arrived.
6. **Subjective questions are technical questions.** "Why is this
   personality more than its traits?" is a question about agent
   interactions inside a brain. It has a mechanism-shaped answer,
   even if we do not yet know the mechanism.

These six items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Interaction is the explanation (ideas 2, 3, 6)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is *entirely* an interaction story. Stimulus → perception → frame
selection → K-line activation → agency response → criticism →
inhibition → censorship → settlement → action → memory. Nothing in
that chain rests on a holistic step. The "whole" the user sees —
Spock's reply — is built block-by-block in the same way Minsky's
tower stands: each part is held by its neighbours (signals exciting
or inhibiting other agencies) and by something analogous to gravity
(the activation, censorship, and settlement rules).

### The settlement is the explicit "more than the sum" (idea 2 again)

The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
makes the composite *legible*. A settlement record names the activated
and inhibited agencies, the proposals, the critics that sustained or
fell, the censors that fired, the ideals cited, the unknowns
acknowledged, the action authorised. The "whole" of a decision is
therefore not a gestalt but a list of interactions with an outcome
attached. This is exactly the methodological move §2.3 demands:
replace the mystery word with the mechanism.

### Naming alone does not bring meaning (idea 5)

The *collapse rule* in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
states that every cognitive structure must collapse to either a file
under `.forgejo-society/` or a step in the workflow. A concept that
exists only as a label, with no file and no step, is by construction
not part of the running mind. The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
is the audit of that rule. Together they enforce the §2.3 discipline
that naming without mechanism is empty.

### Banned vocabulary on the prose surface (idea 1)

[AGENTS.md](../../../AGENTS.md) and [CLAUDE.md](../../../CLAUDE.md)
explicitly forbid "AGI", "AI brain", "autonomous developer",
"revolutionary", "game-changing", and "next-generation", and warn
against anthropomorphic flourishes that imply consciousness or
feelings. These are precisely the kind of *anaesthetising* words
Minsky names. The voice rules close §2.3's pseudo-explanation loophole
on every repository surface.

### The conscious presenter is a mechanism, not a gestalt (idea 3)

`agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the *sole* producer of the visible response, and it is one named
agency reading one settled blackboard. The unity of voice is not
attributed to "emergence" or "the gestalt of the system"; it is
attributed to one file with one job. This is the §2.3 stance applied
to the part of the pipeline most tempted to mystification.

### Frames give parts their fit (idea 2)

Frames
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are the analogue of "gravity and neighbours" for the cognitive
pipeline: they declare which slots must be filled, which agencies
fill them, and which failure conditions block settlement. A frame
makes the *fit* between parts visible. Without a matching frame the
society does not assemble a whole; with one, the assembly is
deterministic and auditable.

---

## What the implementation does not yet take into account

These are the §2.3 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — No critic for pseudo-explanation

The first-ship critic catalogue in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
contains evidence, scope, cost, privacy, risk, overconfidence,
source-quality, and staleness critics. None of these fires on
*hand-waving naming*. A proposal that justifies itself with "the
system will work it out", "the agents will collaborate", "this is
emergent behaviour", or "the gestalt of the pipeline handles it"
would pass every current critic on its evidence and risk grounds
while violating §2.3's central rule. A `critic.mechanism` (or
`critic.pseudo-explanation`) that demands a named interaction for
every claim of composite behaviour is absent from
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).

### B — Agency outputs are not vocabulary-checked against the banned list

[AGENTS.md](../../../AGENTS.md) binds the voice rules on humans
writing prose in the repository. The plan does not state that the
same banned phrases ("AGI", "AI brain", "emergent intelligence",
etc.) are linted out of *agency* outputs — handoffs, claims,
proposals, the final presenter text. There is no censor or critic in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
or in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
that enforces voice on machine-generated prose. The discipline §2.3
asks for is enforced on the repository surface but not on the
running mind's own utterances.

### C — The visible whole is not required to cite its parts

The settlement record carries the full interaction trace
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
but the *user-visible* response produced by
`agency.integration.conscious-presenter` is not required by the plan
to reference its `settlement_id` or otherwise expose the path back to
its parts. A reader who only sees the reply cannot, today, follow it
back to the named interactions that produced it. §2.3 does not
strictly demand a visible citation, but the methodological spirit —
that the whole be auditable to its parts — would suggest at least an
optional, machine-readable footer linking each reply to its
settlement record.

### D — The objective/subjective parallel is not used as a self-check

§2.3's argument turns on a parallel: subjective wholes admit the same
*kind* of explanation as objective ones. The plan has no
self-check that asks, of any proposed cognitive explanation, "would
this style of explanation be acceptable for a tower or a chain?" The
analogy critic family suggested in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
handles between-stimulus analogy, not between-domain analogy of this
methodological kind. This is a small gap, but a clean one: §2.3 names
the test, the plan does not run it.

### E — No record of "this once seemed mysterious"

Minsky observes that adults forget how hard it was to learn the
object-world. The plan has rich provision for *outcomes*
(`memory/decisions/`, `memory/episodic/`, `evolution/reinforcement-log.md`)
but no provision for *demystification history*: the trace of a
concept moving from "handled by a vague label" to "handled by a
named mechanism". An entry shape such as
`memory/demystification/<concept>.md` — recording the prior label,
the agencies and signals that now do the work, and the settlement(s)
in which the move happened — has no counterpart in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
This overlaps with the developmental-timescale gap recorded in
[`som-1.1-sor.md`](som-1.1-sor.md) (gap A), but it is the
*concept-local* form of it.

### F — "Naming focuses attention on a mystery" is not represented as a useful move

§2.3 grants that naming the unknown *can* help, when it focuses the
mind on what is missing. The plan has `unknowns` and `blind_spots`
slots in the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and an introspection protocol
([`02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)),
which is close to this idea. But there is no notion of a *named
pending mystery* — an open record that says "we have no mechanism
for X yet; here is the placeholder name, here is the agency that
will be responsible when there is one". Pending mysteries today
either become full agency manifests or disappear; the intermediate,
methodologically honest state §2.3 sketches has no file shape.

---

## Summary table

| # | Idea from §2.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | *Holistic*/*gestalt* anaesthetise ignorance | Yes (on prose) / Partial (on agency outputs) | Voice rules in [AGENTS.md](../../../AGENTS.md) ban the words on repository surfaces; not enforced on machine-generated prose (gap B). |
| 2 | Objective wholes = explained by part interactions | Yes | Pipeline ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)) and settlement schema make every composite a list of interactions. |
| 3 | Subjective wholes = the same, in the mind | Yes | Signals, handoffs, frames, K-lines: a vocabulary for naming interactions among internal agencies. |
| 4 | Asymmetry is familiarity, not kind | Partial | The plan treats internal interactions as ordinary mechanisms, but does not record the demystification history that would *show* this (gap E). |
| 5 | Naming is not explaining | Partial | Collapse rule enforces it for *structure*; no critic enforces it for *proposals* (gap A). |
| 6 | Subjective questions are technical | Yes | Schemas, manifests, and the mapping table convert every "mental" concept into a file or step. |
| — | Whole auditable to its parts | Partial | Settlement carries the trace; the user-visible reply is not required to cite it (gap C). |
| — | Cross-domain self-check (tower-style explanation acceptable here?) | No | No procedure invokes the §2.3 parallel as a test (gap D). |
| — | Named pending mystery as a legitimate intermediate state | No | `unknowns` slot is close; no file shape for an open, named, owner-bearing mystery (gap F). |

---

## Implication for the plan (no changes proposed here)

§2.3 is methodological rather than architectural. Its demand is
narrow: every claim that a whole is "more than the sum" must, on
inspection, reduce to a story about how named parts interact, and
no placeholder word may be allowed to do that work in disguise. The
implementation plan absorbs this demand structurally — through the
collapse rule, the settlement schema, the manifest schema, the
critic and censor catalogues, and the voice rules in
[AGENTS.md](../../../AGENTS.md). The pipeline is, end to end, an
interaction story.

The remaining gaps cluster in one area: the discipline §2.3 imposes
on *humans writing prose in this repository* is not yet imposed on
*agencies writing prose at runtime*, nor on *proposals that explain
themselves by labels*. Gap A (a `critic.mechanism` that fires on
pseudo-explanation) and gap B (voice rules applied to agency
outputs) together would close that asymmetry. Gap C (link replies
back to their settlements) would make the whole-to-parts audit
visible to the user. Gaps D, E, and F are smaller and more
documentary.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the policy surface in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
the settlement and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and possibly the introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
