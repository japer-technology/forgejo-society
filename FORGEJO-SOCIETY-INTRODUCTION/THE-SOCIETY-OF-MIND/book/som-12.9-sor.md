# Section 12.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.9.md](som-12.9.md) — *The exception principle*
(Minsky, §12.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.9 introduces *the exception principle*: "It rarely pays to
tamper with a rule that nearly always works. It's better just to
complement it with an accumulation of specific exceptions." A
rule patched to absorb every counter-example becomes a
monstrosity. Common-sense words like *fish* work precisely because
they tolerate exceptions; only artificial worlds like mathematics
and theology can afford the price of insisting that every
exception be explained away.

---

## The ideas Section 12.9 actually carries

1. **The exception principle.** A nearly-always-correct rule is
   better complemented than rewritten.
2. **Rules are statements of the typical, not the universal.**
3. **Patching every exception destroys the rule.** "Birds can fly,
   unless dead, caged, broken-winged, …" is no rule at all.
4. **Exceptions are a separate substrate.** They deserve their
   own storage, not embedding inside the rule.
5. **Common-sense concepts span many meaning-worlds.** This works
   only because exceptions are tolerated.
6. **Only artificial sciences can afford the no-exceptions
   ideal.** Real-world taxonomies must accept inconsistency.

---

## What the implementation already absorbs

### Append-only correction (ideas 1, 4)

`memory/`'s append-only discipline
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
forbids in-place edits. Corrections come as new entries with
`supersedes:` links. This is structurally what §12.9 asks for:
new entries complement old ones rather than mutating them.

### Failure as first-class substrate (idea 4)

`memory/failure/` and
`memory/failure/rejected-candidates/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are the dedicated home for exceptions. The plan already separates
"what usually works" (semantic logs, K-lines) from "what didn't"
(failure tree). Exceptions are not embedded in rules; they live
beside them.

### Decay rather than rewriting (ideas 2, 3)

A K-line whose `decay_score` falls below the floor
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is retired; it is not patched into a monstrosity. The plan
prefers retirement and replacement over endless qualification.

### Tolerance of imperfection (ideas 5, 6)

The pipeline tolerates `partial` outcomes
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and writes K-lines for partial successes. The runtime does not
require that every settlement be a complete success. This is the
"real world, not theology" posture §12.9 requires.

---

## What the implementation does not yet take into account

### A — No explicit "exception accumulator" linked to a rule

`memory/failure/` is a global accumulator. The plan does not
link each entry to *the K-line, frame, or semantic rule it
violates*. A reviewer cannot ask "show me the exceptions
accumulated against `kline.code-change.foo`" without inspecting
relational links by hand. The exception-as-counterpart-of-rule
relationship is not first-class.

### B — No "exception count" pressure on rules

§12.9 says a rule is fine *until* the exception accumulator grows
unmanageable. The plan has decay (passive) but no metric like
"this K-line accumulated N counter-examples in the last M
runs; consider retiring it". The pressure direction is
exception-based; the plan tracks usage-based decay.

### C — Common-sense vs strict-rule modes are not distinguished

§12.9 distinguishes common-sense concepts (tolerant) from
scientific concepts (intolerant). The plan does not let an
agency or frame declare which mode it is in. The
`critic.staleness` critic, the strictness of the
`security-sensitive` frame, and the looseness of the
`question` frame all live in the same catalogue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
without a `tolerance_mode:` field.

### D — `semantic/project-laws.log` has no explicit exception channel

`semantic/project-laws.log` carries invariants
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Per §12.9 these are the *intolerant* category and should refuse
exceptions. The plan does not enforce this distinction: a law
and a heuristic are stored identically.

### E — No reformulation-on-decay protocol

When a K-line decays, it is retired. §12.9 implies a more
nuanced move: a decaying rule with a sizeable exception
accumulator might be *reformulated* (per som-12.2) rather than
retired. The plan has neither reformulation
(per [som-12.5-sor.md](som-12.5-sor.md)) nor a decay-to-reformulate
hand-off.

---

## Summary table

| # | Idea from §12.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Exception principle | Yes (structurally) | Append-only memory; failure tree distinct from semantic tree. |
| 2 | Rules are typical, not universal | Yes | `partial` outcomes; K-lines for partial success. |
| 3 | Patching every exception destroys the rule | Yes | Decay-then-retire rather than patch. |
| 4 | Exceptions deserve their own substrate | Yes | `memory/failure/`, `failure/rejected-candidates/`. |
| 5 | Common-sense concepts span meaning-worlds | Partial | Tolerated implicitly; no mode field (gap C). |
| 6 | Only artificial sciences afford no-exceptions | Partial | `project-laws.log` not strict-typed (gap D). |
| — | Exception linked to the rule it violates | No | No first-class "exceptions of X" relation (gap A). |
| — | Exception-count pressure on rules | No | Decay is usage-based only (gap B). |
| — | Reformulation-on-decay | No | No reformulation operation; no decay-to-reformulate pathway (gap E). |

---

## Implication for the plan (no changes proposed here)

§12.9 is the section the plan most closely matches by structure
and most distantly matches by mechanism. The append-only
discipline and the failure tree are already the exception
principle written into the substrate. What is missing is the
*pairing*: each exception belongs to a specific rule; each rule
accrues exception pressure; some rules deserve to be strict and
others tolerant.

Closing these gaps would touch the relational schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(`exception_of:` and `tolerates_exceptions:` link kinds), the
frame and K-line schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(`tolerance_mode:` field; exception-count counters), and the
credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
(exception-based pressure beside usage-based decay). These are
governance-shape changes, not edits to runnable code, and fall
under the stop-and-ask rules in [AGENTS.md](../../../AGENTS.md)
§12 and [CLAUDE.md](../../../CLAUDE.md). This file records the
analysis; it does not request the change.
