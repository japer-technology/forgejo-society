# Section 13.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.7.md](som-13.7.md) — *Duplications* (Minsky, §13.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.7 closes the chapter with the choice between two description
styles. A *structural* description counts every part exactly once
and refuses to share. A *functional* description counts the
essentials carefully but allows auxiliaries to be reused. The
double-arch is two arches by function and one structure short by
count. Each style is right for some goals and wrong for others; the
functional style is more easily composed by higher-level agencies
but carries a tendency toward wishful thinking.

---

## The ideas Section 13.7 actually carries

1. **Structural and functional descriptions are different
   languages.** Each is internally consistent; they disagree on
   what counts as the same thing.
2. **Structural: each part counted once.** Useful when parts are
   limited resources (build two separate bridges, run out of
   blocks).
3. **Functional: essentials counted, auxiliaries shared.** Useful
   when one part can serve two purposes (a viaduct shares
   supports).
4. **Functional descriptions compose more easily upward.** Higher
   agencies want body-and-support, not block-by-block.
5. **Functional descriptions tend toward wishful thinking.** They
   lose track of real constraints by allowing auxiliaries to be
   reused that, in fact, cannot be.

---

## What the implementation already absorbs

### Functional composition is the dominant upward direction (idea 4)

The assembly family — `agency.assembly.summary-tier-1/2` — and the
`conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
collapse many partial signals into one functional account for the
human reader. The settlement record
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is itself a functional description of an episode.

### Essentials are named per frame (idea 3)

Each frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
marks required slots — its essentials. The auxiliaries
(`risks`, `final_user_response` on a code-change) can be lighter
and may overlap across frames.

### Structural counting exists for limited resources (idea 2)

Budgets on agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
count tokens, calls, and runtime; the runner workspace counts
files; git counts commits. Where the parts are limited, the plan
counts strictly.

### Safety pathway prefers structural strictness (idea 2)

The `security-sensitive.frame.yml` adds `permission_diff`,
`revert_path`, `human_confirmation_state` — each must be present,
each is its own artefact, none is shared with another slot
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
On the safety surface the plan abandons functional sharing and
returns to one-thing-per-slot, in line with §13.7's caution.

---

## What the implementation does not yet take into account

### A — Style choice is not declared per frame

The plan does not write down, for each frame, whether its
description style is structural or functional. A reviewer cannot
read "`code-change` is functional; `security-sensitive` is
structural; here is why." The information is encoded only as the
presence or absence of shareable slots.

### B — No critic for the wishful-thinking hazard

§13.7's final warning — functional descriptions "have a certain
tendency to lead toward overoptimistic, wishful thought" — has no
critic. The evidence-critic and the safety family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
push back at the artefact level, not at the *description-style*
level. Nothing in the deliberation phase asks "is this account
sharing auxiliaries that, in this case, cannot actually be
shared?"

### C — Sharing is not represented as a typed link

When two slots in a settlement are filled by the *same* artefact —
the same file cited by `relevant_files` and treated as
`proposed_patch` target — the relational-memory link types
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
do not include a `shared_with` relation. The double-arch case
collapses to one citation, not two with an explicit sharing edge.

### D — No translation operator between styles

Minsky's chapter is about *moving* between description languages.
The plan does not have an operator that re-renders a settlement in
the other style — for example, "show this functional settlement as
its structural counterpart and list the shared auxiliaries". A
debug surface like that would expose B and C; it is not present.

### E — Reuse vs duplication is not audited

Auxiliary reuse is sometimes correct (one block, two bridges in a
viaduct) and sometimes wrong (one block, two separate bridges,
short by one block). The plan has neither the metric nor the
critic that separates the two cases. The closest analogue is the
suite of safety frame requirements (gap B), which simply forbids
reuse rather than auditing it.

---

## Summary table

| # | Idea from §13.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Structural and functional are different languages | Implicit | Encoded as slot-shape per frame; not named (gap A). |
| 2 | Structural = count once | Yes | Budgets, safety frame, runner workspace. |
| 3 | Functional = essentials counted, auxiliaries shared | Yes | Assembly/integration families, conscious-presenter, settlement record. |
| 4 | Functional composes upward more easily | Yes | The presenter is functional by design. |
| 5 | Functional descriptions tend toward wishful thinking | No | No critic at the description-style level (gap B); no `shared_with` link (gap C); no style-translation operator (gap D); no reuse audit (gap E). |

---

## Implication for the plan (no changes proposed here)

§13.7 closes chapter 13 with the most operational of its lessons:
the plan should know, for each frame, *which description style it
is in*, and should have a critic that catches the wishful
shareability the functional style allows. The implementation
already adopts the functional style upward and the structural
style on the safety surface — it just does not name the choice or
audit its hazard. Closing this would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the relational-memory link types in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and possibly the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
