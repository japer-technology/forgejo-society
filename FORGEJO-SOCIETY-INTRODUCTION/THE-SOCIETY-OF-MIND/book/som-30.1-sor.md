# Section 30.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.1.md](som-30.1.md) — *Knowing* (Minsky,
§30.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§30.1 opens Chapter 30 by refusing to treat *knowing* as a property
that lives inside a head. The claim "Mary knows geometry" is recast
as a claim about a *speaker*'s expectations: it predicts that some
observer, holding some stereotype of *typical* answers, would be
satisfied by Mary's replies. Knowledge is observer-relative,
question-relative, and stereotype-relative. The section ends by
defending doubt against perfect faith.

---

## The ideas Section 30.1 actually carries

1. **Knowing is observer-relative.** A statement of the form *X
   knows A* is shorthand for *some observer, holding some
   questions, would be satisfied by X's answers about A*.
2. **The speaker's role conditions the meaning.** "Mary knows
   geometry" said by a mathematician and by a stranger are not the
   same claim.
3. **Default stereotypes do the silent work.** We omit the observer
   because we assume *typical*. Communication leans on a hidden
   appeal to convention.
4. **No absolute description.** Even "this is a painting of a horse"
   resolves only to "this displays a representation that, in
   someone's view, resembles a horse in some respects".
5. **The internal observer.** Self-attribution of knowledge ("I know
   geometry") is itself made by an inner part — and that part is not
   the part that does geometry.
6. **Doubt as discipline.** Perfect faith, not doubt, is the danger
   to mental growth.

---

## What the implementation already absorbs

### Observer-relative knowledge (ideas 1, 2, 5)

The plan never asserts that a society *knows* a fact in the abstract.
A claim becomes visible only through a settlement
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
which records *who said it* (an agency with an `id` and an
`authority` level), *what was said* (a candidate action with a
rationale), and *which critics found it satisfying* (the criticize
phase). The conscious-presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is structurally the "internal observer" Minsky describes: the part
that claims, distinct from the parts that produce.

### Stereotyped audiences (idea 3)

The authority registry
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
fixes a stable set of roles (`read`, `draft`, `propose`, `act`,
`govern`, `human`) that act as the "typical" observers for whose
satisfaction a claim is staged. A `propose`-level signal is implicitly
addressed to a `govern` or `human` reader.

### Doubt as a slot (idea 6)

The introspection protocol
([`02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
gives the settlement explicit `unknowns` and `blind_spots` slots.
Doubt is structurally first-class, not a defect.

---

## What the implementation does not yet take into account

### A — The audience is implicit

The plan records the *speaker* of a claim (agency id, authority) but
not the *intended observer-stereotype* against which the claim should
be judged. A handoff
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
has no `for_audience` field. §30.1 makes that audience load-bearing.

### B — No separation between "can answer" and "holds the belief"

The plan does not distinguish "the society can produce an answer about
A" (operational) from "the society holds a belief about A" (avowed).
Both collapse into the same kind of signal. Minsky's §30.1 implies
these should be different shapes.

### C — No critic dedicated to introducing doubt

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
has critics for evidence, consistency, and blast radius, but none
whose role is to argue against high-confidence settlements — a
`critic.devil-advocate` analogue. Doubt is a logged slot, not an
active voice.

---

## Summary table

| # | Idea from §30.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Knowing is observer-relative | Yes | Settlement carries speaker, claim, and satisfying critics. |
| 2 | Speaker's role conditions meaning | Partial | Authority levels fix roles but do not appear on the claim. |
| 3 | Default stereotypes do the work | Partial | Authority registry supplies stereotyped audiences implicitly. |
| 4 | No absolute description | Yes | All facts are recorded as agency claims, not as world-truth. |
| 5 | Internal observer is distinct | Yes | `conscious-presenter` separates claimant from producer. |
| 6 | Doubt as discipline | Partial | `unknowns` / `blind_spots` slots exist; no critic actively introduces doubt (gap C). |

---

## Implication for the plan (no changes proposed here)

§30.1 lands cleanly on the plan's strongest move — making the
*speaker* and the *audience* visible — but exposes two small absences:
the audience is unnamed (gap A), and doubt is passive (gap C). The
weakest is gap B: the plan does not yet carry the distinction between
*answer-capability* and *avowed belief*.

Closing any of these would touch the signal and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and possibly the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md).
Such changes fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
