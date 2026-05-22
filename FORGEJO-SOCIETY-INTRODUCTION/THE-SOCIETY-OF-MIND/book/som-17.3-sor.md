# Section 17.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.3.md](som-17.3.md) — *Attachment simplifies*
(Minsky, §17.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.3 gives attachment a *computational* function beyond keeping the
infant near safety: by restricting which adults the child copies
values from, attachment makes building a coherent value-system
tractable. Too many models would produce contradictions; a few
chosen models produce a single workable personality.

---

## The ideas Section 17.3 actually carries

1. **A coherent value system is too hard to invent from scratch.**
   The child must base it on an already-existing model.
2. **Too many models would deadlock the construction.** Fragments
   from many adults would cancel each other.
3. **Attachment restricts the set of role models.** The biological
   function of bonding is to *limit* whom the child imitates.
4. **Imprinting is the precedent.** Animal bonds are formed swiftly
   and firmly, by stable sensory recognition.
5. **Attachment-figures are recognised, then privileged.** Their
   signals route differently from strangers' signals (carried over
   from §17.2).
6. **Attachment teaches ends, not means.** Parents transmit *what
   to want*, not *how to do*.

---

## What the implementation already absorbs

### Bounded model set (idea 3, partial)

The `MAINTAINERS.md` file and the human-approver gate
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
restrict whose merges and approvals reach `act` authority. The set of
*humans* whose decisions actually shape the society's evolution is
small by construction. In bonding terms, the society's
"attachment-figures" are the maintainers listed in `MAINTAINERS.md`.

### Stable recognition of the privileged source (idea 4)

Forgejo authenticates pull-request authors and approvers
cryptographically; the runtime sees a stable identity for each human.
The recognition step that animals do by smell and voice, the plan
does by signed commits and forge identity.

### Values live in identifiable files (idea 1)

`governance/self-ideals.md` and `agencies/identity/*` carry the
society's chosen values
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The "already-existing model" Minsky requires is the prior commit of
these files; nothing in the loop bootstraps values from zero.

---

## What the implementation does not yet take into account

### A — No registry of "attached" maintainers vs incidental contributors

`MAINTAINERS.md` is a list of people with merge rights, not a list of
people whose *values* the society should absorb. The two coincide
today, but only by convention. A contributor whose PR is merged for
technical reasons is not, in any registered sense, an
attachment-figure; nothing prevents their incidental wording from
propagating into `governance/self-ideals.md` through ordinary edit.

### B — No conflict-detection across model values

Idea 2 (fragments cancel) presumes a check that two role models
disagree. The plan has `critic.consistency` for *content*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no critic that compares the *values* expressed by one
attachment-figure with those expressed by another. If two
maintainers favour opposing ideals, the plan does not flag the
conflict at the value level.

### C — Imprinting (early, fast, irreversible) is not modelled

The plan's authority grants are revisable at any time by a
governance change. There is no analogue of the *imprinted* bond —
values absorbed in a society's "infancy" that resist later revision.
A young Forgejo Society is no more committed to its bootstrap
maintainers' values than a mature one.

### D — Ends vs means is not encoded in the file taxonomy

Idea 6 separates *ends* (goals, ideals) from *means* (methods,
skills). The plan's memory classes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
do distinguish procedural from semantic, but the *governance*
surface — `self-ideals.md`, `authority-registry.md` — does not split
"things we want" from "how we do them." A maintainer edit can quietly
move material across the line.

### E — No privileged-source value-routing in the loop

§17.2's routing gap (its gap A) recurs here: an edit by an
attachment-figure (a maintainer) and an edit by an outside
contributor enter the merge process the same way. The plan does not
say "value changes proposed by attached sources land in
`self-ideals.md`; value changes proposed by others land in a
`proposed/` staging area first."

---

## Summary table

| # | Idea from §17.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Values need an existing model | Yes | `self-ideals.md` + identity files. |
| 2 | Too many models cancel | No | No value-conflict critic across role models (gap B). |
| 3 | Attachment restricts model set | Partial | `MAINTAINERS.md` restricts merge rights, not value influence (gap A). |
| 4 | Stable recognition | Yes | Signed commits and forge identity. |
| 5 | Privileged routing | No | Same as §17.2 gap A. |
| 6 | Teaches ends, not means | Partial | Memory split exists; governance split does not (gap D). |
| — | Imprinted (irreversible) early values | No | All authority grants are revisable (gap C). |

---

## Implication for the plan (no changes proposed here)

§17.3 supplies the *reason* for §17.2's routing distinction: without a
restricted set of value-sources, the society cannot acquire a
coherent personality at all. The plan has the structural pieces — a
maintainers file, signed humans, value files — but does not yet name
any human as an *attachment-figure for values*, nor does it detect
when two such figures contradict each other. Closing this would
touch
[`THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md),
[`THE-SOCIETY-OF-REPO/01-governance/self-ideals.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-ideals.md),
and the maintainers / contributor split documented at the repo root.
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
