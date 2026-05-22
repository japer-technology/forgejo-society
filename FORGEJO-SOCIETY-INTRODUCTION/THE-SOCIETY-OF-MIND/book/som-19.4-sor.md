# Section 19.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.4.md](som-19.4.md) — *Objects and properties*
(Minsky, §19.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.4 argues that *useful* properties are those that **do not change
capriciously** and **do not interact too much** with one another. This
non-interaction is what makes imagination practical: we can vary
colour without varying shape. The section claims that the mind
*represents each property in a separate agency*, which is why a single
word can fan out into many partial states at once.

---

## The ideas Section 19.4 actually carries

1. **A word means many things at once.** *Apple* names a thousand
   things; no single phrase captures them.
2. **Definition by listing properties.** Imperfect, but usable.
3. **Stability:** good properties do not change capriciously.
4. **Non-interaction:** the most useful sets of properties are those
   whose members do not interact (size, colour, shape, substance).
5. **Non-interaction makes imagination practical.** Mental
   recombination works because the axes are independent.
6. **Separate agencies for separate properties.** Independence in the
   world is mirrored by independence in the *representation*.
7. **A polyneme triggers many agencies simultaneously.** This is the
   mechanism by which one word fans out into many partial states.

---

## What the implementation already absorbs

### Polynemes fan out across families (idea 7)

Exactly the mechanism Minsky names: the `excite:` map in any polyneme
entry
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
addresses multiple agency ids, each weighted independently. The
`workflow-file` polyneme, for example, excites perception, safety, and
identity agencies at once via the `security-sensitive` default frame.

### Separate agencies for separate concerns (idea 6)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is itself the implementation's version of the "independent property
axes" claim: perception, memory, code, safety, identity, integration,
assembly, meta-admin. Each is roughly orthogonal — a change in code
intent does not change identity. The composition rule (each agent has
one job, one manifest) preserves the orthogonality.

### Definition by property list (idea 2)

Frame slots in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are the operational form. `code-change.frame.yml` has slots
`user_goal`, `relevant_files`, `proposed_patch`, `tests`, `risks`,
`final_user_response`. A "code change" is *defined* by that list,
exactly in the imperfect-but-usable sense Minsky describes.

---

## What the implementation does not yet take into account

### A — Non-interaction is not declared

Ideas 4 and 5 hinge on the property axes being *known* to be
independent. The plan's agency families *behave* independently
(distinct manifests, distinct outputs) but no document records the
non-interaction property explicitly. There is no schema field on a
family or a frame slot saying "this dimension varies independently of
those." A reviewer cannot ask "which slots in `code-change.frame.yml`
are orthogonal to which?" and get an answer.

### B — Stability of properties is implicit

Idea 3: stability is what makes a property worth tracking. The plan
has no explicit `stability` or `volatility` annotation on any field.
Some fields (e.g. `permission_diff` in `security-sensitive.frame.yml`)
are clearly volatile, others (e.g. `user_goal`) clearly stable, but
the distinction is left to the reader.

### C — Imagination as recombination is absent as a primitive

Idea 5. The plan has *candidate actions* and *imagination branches*
(`society/<stimulus_id>/candidate-<n>` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
which is real imagination at the *code* level. There is no analogous
machinery at the *idea* level — no "vary one slot of the frame and
hold the rest constant" pass. The patch-imaginer
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
imagines diffs, not property combinations.

### D — The plan does not articulate "why these families and not others"

The justification implicit in §19.4 — *because these axes do not
interact* — is not the reason given for the plan's family list. The
families are inherited from the SOR catalogue and the
`possibility-2.md` document. The non-interaction warrant for the
choice is not made.

---

## Summary table

| # | Idea from §19.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A word means many things at once | Yes | Polyneme `excite:` maps multiple agencies. |
| 2 | Definition by property list | Yes | Frame slots in `*.frame.yml`. |
| 3 | Stability matters | Partial | Implicit only (gap B). |
| 4 | Non-interaction matters | No | Not declared on families or slots (gap A). |
| 5 | Non-interaction makes imagination practical | Partial | Imagination branches exist for code; not for ideas (gap C). |
| 6 | Separate agencies for separate properties | Yes | Family taxonomy. |
| 7 | A polyneme fans out across many | Yes | Multi-target `excite:`. |

---

## Implication for the plan (no changes proposed here)

§19.4 reads as a defence of the architecture the plan already uses,
with two missing labels: an explicit statement that the family axes
are chosen for non-interaction (gap A) and an explicit annotation of
slot stability (gap B). The deeper opening is gap C — recombinational
imagination at the idea level — which would require a new pass
between `activate` and `deliberate` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and a new agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
Any move to formalise property independence or to introduce a
recombination pass would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the family list in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
