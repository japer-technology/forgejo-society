# Section 29.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.4.md](som-29.4.md) — *Cross-realm
correspondences* (Minsky, §29.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.4 observes that we routinely import skills from one realm into
another: time is described in spatial terms, problems are
*obstacles*, ideas are *high* or *low*. These transports are the
work of polynemes and paranomes that already wire the realms
together. At any moment several realms compete for control of the
ascending nemes that drive the language-agency; only one usually
wins, and which one wins shifts moment to moment. Each realm
accumulates its own skills but also borrows skills from others,
and chaining — sequences of any kind — is offered as the
clearest example of a skill that learns to leave its home realm.

---

## The ideas Section 29.4 actually carries

1. **Cross-realm correspondences are systematic.** The
   space-for-time, obstacle-for-problem, diagram-for-abstraction
   patterns are not accidental.
2. **Polynemes and paranomes carry the wiring.** The
   correspondences live in the shared role structures, not in the
   words.
3. **The language-agency has a one-realm-at-a-time bottleneck.**
   Several realms compete; usually one wins control of the
   ascending nemes.
4. **Realm-of-control shifts moment to moment.** The realm that is
   succeeding (or struggling) tends to capture attention.
5. **Each realm accumulates its own skills.** Skills do not start
   universal.
6. **Skills migrate between realms with use.** Mastery in one
   realm can become a resource for another.
7. **Chaining is the clearest portable skill.** Sequences (spatial,
   causal, social-dominance) all reuse the same chain machinery.

---

## What the implementation already absorbs

### A one-realm-at-a-time output bottleneck (idea 3)

The conscious-presenter in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is the sole producer of visible text, and the settlement layer
collapses many partial signals into one decision before it
narrates. This is the structural analogue of "only one realm at a
time wins the language-agency".

### Realm-of-control shifts moment to moment (idea 4)

Per-cycle activation in the workflow means that which agencies
win attention depends on which signals are strongest *this
cycle*. The plan does not promise stable attention across cycles;
the conscious-presenter narrates whichever settlement won. This
matches the shifting-realm behaviour Minsky describes.

### Skill accumulation in distinct families (idea 5)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(perception / memory / code / safety / identity / integration /
assembly / meta-admin) gives each *kind* of work its own home.
Skills accumulate where they belong; the plan does not push every
agency to be general.

### Reusable role machinery (ideas 7, partial)

Generic slot machinery in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
means a Trans-frame works the same way wherever it is used. The
*shape* of a chain — origin → step → step → destination — is
already a portable structure. The substrate for idea 7 exists.

---

## What the implementation does not yet take into account

### A — Cross-realm correspondences are not catalogued

Idea 1 says the correspondences are *systematic*. The plan has no
`cross-realm-correspondences.md` (or similar) in
[`THE-SOCIETY-OF-REPO/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/);
no list, for example, that records "this society treats time
spatially, this society treats problems as obstacles". Without
realms being named (see [som-29.1-sor.md](som-29.1-sor.md) gap A),
there is also nothing to correspond *between*.

### B — Skill migration between realms has no protocol

Idea 6: a skill earned in one realm becomes a resource in another.
The plan has differentiation and retirement
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no notion of *transposition* — taking an agency or K-line
trained for one realm and re-deploying it in another. K-lines have
no `transposed_from:` field; agencies have no `derived_from:`
field for cross-family lineage. Migration in the Minsky sense is
not representable.

### C — Realm-level competition for the presenter is not measured

Idea 3 describes competition among realms for the language-agency.
The plan has competition for *agency activation* (via activation
rules and inhibits) but does not track competition at the *realm*
level. No introspection record reports "this cycle the social
realm won the presenter; last cycle the physical realm did". The
introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records unknowns and blind spots, not realm-of-control.

### D — Chains as portable structures are not isolated

Idea 7 holds up chaining as the clearest portable skill. The plan
uses sequencing — workflow steps, pipeline phases — but does not
expose `chain` as a first-class transferable shape that an agency
or K-line can declare it operates on. There is no `chain` schema
under
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/);
sequencing is structural rather than primitive.

---

## Summary table

| # | Idea from §29.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Cross-realm correspondences are systematic | No | No catalogue (gap A). |
| 2 | Polynemes and paranomes carry the wiring | Partial | Polynemes exist; paranomes do not (see [29.3](som-29.3-sor.md)). |
| 3 | One-realm-at-a-time bottleneck | Yes | Conscious-presenter + settlement. |
| 4 | Realm-of-control shifts moment to moment | Partial | Cycle-by-cycle attention exists; not measured at realm level (gap C). |
| 5 | Each realm accumulates its own skills | Yes | Family taxonomy. |
| 6 | Skills migrate between realms with use | No | No transposition protocol (gap B). |
| 7 | Chaining as the clearest portable skill | Partial | Sequencing is structural, not a first-class shape (gap D). |

---

## Implication for the plan (no changes proposed here)

§29.4 layers two missing pieces over §29.3: a catalogue of which
correspondences a given society actually uses, and a protocol for
moving skills across realms. The plan has the substrate (per-cycle
attention, family separation, generic slot machinery); it lacks
the bookkeeping. Both pieces depend on the *realm* primitive
introduced in §29.1's gap.

Recorded as analysis. Any move to catalogue correspondences or
formalise skill transposition would touch
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
