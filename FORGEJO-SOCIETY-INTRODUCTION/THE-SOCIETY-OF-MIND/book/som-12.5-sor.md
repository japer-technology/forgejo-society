# Section 12.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.5.md](som-12.5.md) — *The function of structures*
(Minsky, §12.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.5 takes the chair as its test case. "Things with legs, back,
and seat" is too narrow; "things you can sit upon" is too thin.
Minsky's resolution is to *interweave* the two and add intimate
connections between chair parts and the requirements of the human
body. With such cross-detail in hand, a person can *reformulate*
both box and chair so that they match and a box becomes
chair-shaped enough to sit on.

---

## The ideas Section 12.5 actually carries

1. **Many things we treat as physical are partly psychological.**
   The category *chair* depends on a sitter.
2. **Two descriptions are needed, not one.** Structural (for
   recognition) and functional (for use).
3. **The two descriptions must be *interwoven*.** A vague
   association is not enough; specific links between parts and
   purposes do the work.
4. **Reformulation is what makes old knowledge fit new
   circumstances.** Without it, knowledge applies only to the
   exact context in which it was learned.
5. **Powerful concepts cross structure and function flexibly.**
   This is what lets a *box* serve as a *chair* of suitable
   height.

---

## What the implementation already absorbs

### Two descriptions per cognitive unit (idea 2)

Every agency manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
already carries a structural side (`id`, `agency`, `kind`,
`tools`, `outputs`, `budget`) and a functional side (`description`,
`activates_on`, the prose body that becomes the prompt). Frames do
the same: `matches:` is the recognition side, `default_actions:`
and `default_critics:` are the functional side.

### Interweaving via typed links (idea 3)

Relational memory
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
gives durable records typed links (`derived_from`, `cites`,
`reinforces`, `analogous_to`). This is the substrate for binding a
structural record to its functional companion.

### Recognition coupled to use (ideas 1, 5)

Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
bind a structural cue (a path glob, a label, a phrase) to a
functional consequence (excite this agency, bias this frame). The
`path-polynemes` table is the cleanest example: `workflow-file`
*means* "treat as security-sensitive" — a recognition fused with a
use.

---

## What the implementation does not yet take into account

### A — No explicit *reformulation* operation

Idea 4 is §12.5's pivot. The plan has no agency, critic, or frame
that *reformulates* a description so an old K-line or frame can
match a new stimulus. The closest move is the analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
but analogy is fallback, not active reformulation. The "box as
chair" inference — *re-describe the candidate so the existing
concept fits* — has no operational analogue.

### B — Structural / functional sides are co-located but not co-typed

A manifest's structural and functional halves live in the same
file but are not represented as *two descriptions that bridge*.
The runtime cannot answer "what is the functional description
without the structural one?" or vice-versa. §12.5's interweaving
is achieved by *co-location* rather than by *explicit binding*.

### C — No "fit predicate" between candidate and concept

§12.5's example — recognising that a box of suitable height with
no need for backrest could serve as a chair — requires a runtime
operation that *evaluates an existing concept against a new
candidate under explicit conditions*. The plan has critics that
attack proposals, but no agency that asks "does this novel object
satisfy the conditions under which the concept *chair* applies?"

### D — `memory/concepts/` does not carry interwoven sides

`memory/concepts/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds candidate abstractions but has no schema requiring both a
structural description and a functional one, nor the cross-links
between their parts. A concept entry could today be purely
structural or purely functional, which §12.5 says is exactly what
fails.

### E — The "body of the user" is unrepresented

Minsky's chair-example leans on the *requirements of the human
body*. The plan has a user-model
(`agency.identity.user-model-keeper`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
that tracks preferences and prior dialogue, but no representation
of the *operational constraints* of the user, the runner, or the
forge. The functional half of any "chair" the society reasons
about is incomplete.

---

## Summary table

| # | Idea from §12.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Physical categories are partly psychological | Yes | Polynemes fuse cue with consequence. |
| 2 | Two descriptions per concept (structural + functional) | Partial | Co-located in manifests; not co-typed (gap B). |
| 3 | Descriptions must be interwoven | Partial | Relational memory permits it; concepts do not require it (gap D). |
| 4 | Reformulation makes old knowledge fit new circumstances | No | No reformulation operation (gap A). |
| 5 | Powerful concepts cross structure and function | Partial | No fit-predicate runtime operation (gap C). |
| — | Body / operational constraints of the user | Partial | User-model exists; constraints layer absent (gap E). |

---

## Implication for the plan (no changes proposed here)

§12.5 makes one demand the plan honours and another it does not.
The honoured demand is *two-sided description*: every agency,
critic, censor, and frame carries both a recognition side and a
use side. The unmet demand is *reformulation*: the plan has no
operation by which a stored description is reshaped on the fly so
that an existing concept fits a near-miss candidate, the way
chair-knowledge reshapes to admit a box of the right height.

Closing the reformulation gap would touch the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a reformulator agency), the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(an explicit `applies_when:` predicate that can be re-evaluated),
and the concept schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(required structural-and-functional sides). These are
governance-shape changes, not edits to runnable code, and fall
under the stop-and-ask rules in [AGENTS.md](../../../AGENTS.md) §12
and [CLAUDE.md](../../../CLAUDE.md). This file records the
analysis; it does not request the change.
