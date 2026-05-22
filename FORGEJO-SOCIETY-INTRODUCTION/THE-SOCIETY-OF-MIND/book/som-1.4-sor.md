# Section 1.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.4.md](som-1.4.md) — *The world of blocks*
(Minsky, §1.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§1.4 introduces *Builder* and decomposes it into *See*, *Find*,
*Get*, *Move*. The section's load-bearing moves are recursive
decomposition ("whenever we find that an agent has to do anything
complicated, we'll replace it with a subsociety"), the explicit
*sense-of-loss* warning, the *common-sense-as-society* claim, and
the *agent / agency* dyad that the plan must respect at every
level. §1.4 also names the failure modes — Find seeing a supporting
block; Builder striking the tower — that any honest implementation
must be able to represent.

---

## The ideas Section 1.4 actually carries

Pulled from Minsky's text:

1. **Recursive decomposition is the construction rule.** Builder is
   not a primitive; it is a *role* assembled from smaller roles,
   each of which is itself a candidate for decomposition.
2. **No agent may be intelligent.** At every step, the analyst must
   check that the parts have not smuggled the whole back in. The
   chess-playing-machine warning is binding.
3. **Goals require a theory of understanding.** Find must
   *understand the scene in terms of what it is trying to do* — so
   any implementation of goal-following must carry a representation
   of goal *and* of scene-relative-to-goal.
4. **Practical judgement is part of the agent set.** Builder must
   judge whether blocks are *enough*, *strong enough*, *wide
   enough*; whether the foundation is secure; whether the last
   placement was rough. These judgements are themselves agencies.
5. **Failure has many possible causes.** When the tower sways, the
   diagnosis is *guessed* from several candidate causes (bad joint,
   weak foundation, too tall, rough placement). The plural is
   essential.
6. **Common sense is an immense society of practical ideas.** Not a
   single faculty but a multitude of rules, exceptions,
   dispositions, balances, and checks.
7. **The amnesia of infancy.** The reason common sense looks simple
   is that we have lost the layers it was built on. The
   implementation must not *also* lose them.
8. **The sense-of-loss warning.** Decomposed parts look "dry as
   dust". The implementation must accept this aesthetic cost; it
   cannot recover the wholeness by re-anthropomorphising the pieces.
9. **The agent / agency dyad.** From the outside, an agency
   "knows"; from the inside, an agent only switches. *Both* views
   are required, and which one is correct depends on the question
   being asked.

---

## What the implementation already absorbs

### Recursive decomposition (idea 1)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
permits any agency to be replaced by a sub-society without changing
the workflow. The meta-admin family includes
`agency.meta-admin.differentiation-broker`, whose explicit job is
to split an agency into smaller ones. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
guarantees that the result is still files-and-steps.

### No agent may be intelligent (idea 2)

The voice rules in [AGENTS.md](../../../AGENTS.md) forbid the prose
moves that would re-introduce a hidden chess-machine dwarf. The
manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
narrows each agency's capability to its declared `outputs` and
`authority`. The closed authority set (`read`, `draft`, `propose`,
`act`, `govern`, `human`) is the structural form of "no agent is
intelligent": each one is bounded.

### Failure has many candidate causes (idea 5)

The deliberate-then-criticize-then-censor sequence in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
allows multiple critics to file objections against the same
candidate, and the settlement
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
records all of them, not just the prevailing one. Plural diagnosis
is a first-class shape.

### Common sense as society (idea 6)

`memory/semantic/` and `memory/concepts/` plus the relational
links in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
let "rules, exceptions, dispositions" live as many small files
rather than as a single ontology. The first-ship catalogue is small
on purpose; the catalogue *grows by accumulation*, which is the
right shape for common sense.

### Sense-of-loss accepted (idea 8)

The promotion style guide
([`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md))
and the prose rules in [AGENTS.md](../../../AGENTS.md) *embrace*
the "dry as dust" register: specifics over slogans, mechanisms over
mystique. The plan does not re-anthropomorphise the pieces to
recover wholeness.

### Agent vs agency (idea 9)

The plan keeps both views available. From outside, an agency is its
manifest's `outputs` and `authority`. From inside, an agency is the
text of its prompt body plus its `activates_on` triggers. The
mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
is the place where both views meet.

---

## What the implementation does not yet take into account

### A — Goals are not first-class

Idea 3 says: a Find-like agency must hold a representation of goal
*and* of scene-relative-to-goal. The plan has *signals*,
*candidates*, *objections*, and *budgets*, but no manifest field for
a *goal*. The closest existing analogue is
`governance/self-ideals.md`, which sits at the society level. An
agency-local goal slot — what this agency is currently trying to
achieve, in scene-relative terms — does not exist. (See gap E in
[`som-1.1-sor.md`](som-1.1-sor.md) for the related "intention"
gap.)

### B — Practical judgement is not a declared family

Idea 4 names *enough*, *strong enough*, *wide enough* as
agencies in their own right. The plan has critics, which are
analogous, but the critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is generic; it does not enumerate the *kinds* of practical
judgement (sufficiency, strength, fit, recency) that Minsky's
example implies. Specific judgement-critics would have to be
introduced ad hoc.

### C — Recursive decomposition has no termination criterion

Idea 1 implies a stopping rule (decompose *until* the parts are not
intelligent). The plan has the differentiation-broker but no
declared limit: nothing says "this agency is small enough; do not
split further", and nothing says "this agency is too complex; it
must be split". The depth of the resulting tree is left to taste.

### D — The amnesia of infancy is not engineered against

Idea 7 warns that early layers vanish from view. The plan has
`memory/episodic/` and `evolution/reinforcement-log.md`, but no
*provenance link* on a mature agency back to the earlier, simpler
agencies it was differentiated from. A mature agency forgets its
own genealogy. A `derived_from` field on the manifest would be the
small change; it does not exist today.

### E — Diagnosis ranking is not structured

Idea 5 (many candidate causes) is honoured by allowing many
objections, but the plan has no schema for *ranking* diagnoses,
attaching prior weights, or marking one as the *current best guess*
distinct from the *settled* explanation. The settlement records
*what was decided*, not *what was hypothesised and dropped*.

---

## Summary table

| # | Idea from §1.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Recursive decomposition | Partial | Differentiation-broker exists; no termination rule (gap C). |
| 2 | No agent may be intelligent | Yes | Closed authority set; voice rules; manifest narrows capability. |
| 3 | Goals require theory of understanding | No | No agency-local goal slot (gap A). |
| 4 | Practical judgement as agency set | Partial | Critics are generic; specific judgement kinds not enumerated (gap B). |
| 5 | Plural candidate causes | Partial | Multiple objections allowed; no ranking schema (gap E). |
| 6 | Common sense as society | Yes | `memory/semantic/`, `memory/concepts/`, relational links. |
| 7 | Amnesia of infancy | No | No `derived_from` provenance on mature agencies (gap D). |
| 8 | Sense-of-loss accepted | Yes | Style guide and voice rules embrace the dry register. |
| 9 | Agent / agency dyad | Yes | Manifest (outside view) + prompt body and triggers (inside view). |

---

## Implication for the plan (no changes proposed here)

§1.4 is the section that legitimises the *shape* of the manifest:
small, narrow, decomposable, not-itself-intelligent agents, viewed
sometimes as agency-with-knowledge and sometimes as agent-without-it.
The plan honours that shape. The unforced opportunities are A
(goal as a first-class manifest field) and D (a `derived_from`
provenance pointer that resists the amnesia of infancy). Both are
small additions to the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and both interact with the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md).

These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
