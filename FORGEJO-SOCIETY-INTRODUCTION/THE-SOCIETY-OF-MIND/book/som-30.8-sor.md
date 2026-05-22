# Section 30.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.8.md](som-30.8.md) — *Intelligence and
resourcefulness* (Minsky, §30.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§30.8 closes the book. There is no trick. The power of intelligence
stems from *diversity* — many subagents, many realms of thought,
several instinctive protominds, administrative hierarchies (Papert's
principle), evolutionary vestiges, growth-stage personalities,
cultural inheritance, and a layer of censors and suppressors. The
practical use of diversity is *resourcefulness*: when one method
fails, route to another branch, ascend a level, or regress to an
earlier version that has already proved itself.

---

## The ideas Section 30.8 actually carries

1. **There is no trick.** Intelligence is not a single perfect
   principle.
2. **Diversity is the source of power.** Subagents, realms,
   protominds, hierarchies, vestiges, growth stages, culture,
   censors.
3. **Redundancy permits routing around failure.** When one method
   fails, another branch may succeed.
4. **Ascent and regression are first-class.** Move up a level for a
   larger strategy change; fall back to a prior version of an agency
   when needed.
5. **Failure is normal.** The architecture is designed for imperfect
   methods used together, not perfect methods used alone.

---

## What the implementation already absorbs

### Diversity by family (idea 2)

The first-ship catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
organises agencies into families — perception, memory, code, safety,
identity, integration, assembly, meta-admin — and seeds multiple
agencies and critics per family. The criticize and censor phases
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
multiply the number of perspectives applied to any candidate.

### Censors and suppressors layer (idea 2)

The censor stage
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is precisely Minsky's "subordination of thought processes to censors
and suppressors". The plan keeps a record of imperfect methods that
must not run.

### Change without total loss (idea 4, partial)

`agency.meta-admin.differentiation-broker` and
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
allow agencies to be split and retired. The git history preserves
earlier versions of every file, so the *raw material* for regression
to an earlier agency is present.

### Failure as ordinary (idea 5)

The pipeline accepts objections, retries, and human escalation
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
as routine phases, not exceptional paths.

---

## What the implementation does not yet take into account

### A — No formal regression protocol

Git history preserves earlier versions of agencies, but the plan has
no documented procedure for *invoking* a prior version when the
current one fails. §30.8 makes this regression — "fall back to an
earlier personality that already coped" — a load-bearing capability,
not an emergency.

### B — No instinctive-protomind tier

Minsky names *instinctive protominds* and *evolutionary vestiges*
as a layer below the negotiable agencies. The plan has no class of
agencies that run *regardless* of higher-level state — no reflex
tier that bypasses deliberation in defined conditions. Safety
censors approximate this in spirit, but they are not framed as
protominds.

### C — Papert's principle is implicit, not policy

Differentiation-broker can create new agencies, but the plan does
not codify *when* a new administrative level is the right answer
versus when another peer agency is. §30.8 makes the principle —
*build a new level when simple methods fail* — a named move.

### D — Cultural inheritance has no layer

The first-ship catalogue treats every agency as locally authored.
There is no representation of "imported from a peer society" as a
distinct provenance, even though
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is the natural site for cultural inheritance.

### E — Growth-stage personalities are absent

§30.8 names *the sequence of stages of the growing child's
personality* as one of its diversity dimensions. The plan has no
notion of an agency holding multiple stage-conditioned personalities
that can be re-engaged when current methods fail.

### F — Routing-around-failure is not a named pattern

When the plan encounters a failing agency, the response is censoring,
escalation, or retirement. There is no documented "route to another
branch" pattern that selects an alternative agency *of the same
intent* without retirement.

---

## Summary table

| # | Idea from §30.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | There is no trick | Yes | The plan is a composite of many small files and steps, not one mechanism. |
| 2 | Diversity is the source of power | Partial | Families + censors strong; protominds, growth stages, cultural layer absent (gaps B, D, E). |
| 3 | Redundancy permits routing around failure | Partial | Objections + retries present; no "route to peer agency" pattern (gap F). |
| 4 | Ascent and regression are first-class | Partial | Differentiation + retirement present; no regression protocol (gap A); Papert's principle implicit (gap C). |
| 5 | Failure is normal | Yes | Pipeline accepts objection, retry, escalation as routine. |

---

## Implication for the plan (no changes proposed here)

§30.8 is the book's quiet summary, and the plan is well-aligned with
its main move — *no trick, only diversity, composed*. The remaining
absences are the lower-tier reflex layer (B), the growth-stage and
cultural-inheritance dimensions (D, E), the missing regression
protocol (A), and the implicit form of Papert's principle (C).

Any work in these directions would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the evolution material under
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and the federation material under
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
