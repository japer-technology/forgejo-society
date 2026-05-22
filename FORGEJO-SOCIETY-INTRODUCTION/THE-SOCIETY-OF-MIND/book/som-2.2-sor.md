# Section 2.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.2.md](som-2.2.md) — *Novelists and reductionists*
(Minsky, §2.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§2.2 is short but does two distinct kinds of work. It names a *temperament*
(reductionist vs novelist), and it lays down a *methodological constraint*
on any theory of mind: general laws apply but cannot explain particulars,
so the explanation has to add higher-level principles built on top of the
lower ones, never replacing them. This analysis treats both strands.

---

## The ideas Section 2.2 actually carries

Pulled from Minsky's text:

1. **Two temperaments.** *Reductionists* prefer to build on existing
   theories; *novelists* prefer to propose new ones. Both are needed; the
   science's "cautious core" rewards reduction, the frontier rewards
   novelty.
2. **Physics-as-ideal does not transfer.** Even total knowledge of every
   brain cell would not explain the brain as an agency, because the laws
   of thought depend on *how the cells are connected*, not only on what
   the cells are.
3. **Connections are particular, not general.** The wiring is set by
   inherited arrangements (genes), not by the universal laws of physics.
4. **General laws explain little in particular.** Precisely *because*
   they apply to everything, the basic laws cannot single out the
   behaviour of a specific system.
5. **Higher levels add, they do not replace.** Psychology does not reject
   the laws of physics; it adds principles that operate at higher levels
   of organisation. Each higher level must be consistent with the lower
   ones.
6. **Level is a recurring primitive.** Minsky flags that *the idea of
   level* will return throughout the book — it is not a one-off remark.
7. **Hundreds, not a dozen.** A workable psychology will combine
   *hundreds* of smaller theories. Physics-sized parsimony is the wrong
   target; humanities-sized profusion is the wrong target too.

These seven items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Connections are first-class, not derived from substrate (idea 2, idea 3)

The plan treats *connectivity* as an explicit artefact rather than an
emergent property of agents. Polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carry `excite:` and `inhibit:` weight tables; agency manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
carry `activates_on:` and `inhibits:` fields; frames declare
`slots`, `default_critics`, `default_censors`, and `linked_klines`.
The wiring is *named, versioned, and editable* independently of the
agents it connects. This is exactly Minsky's "laws of thought depend on
how cells are connected" point, made operational.

### Higher levels that add rather than replace (idea 5)

The assembly tier
([`agency.assembly.summary-tier-1`, `agency.assembly.summary-tier-2`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
compresses raw signals into per-family summaries and then into a
settlement brief, but the lower-level `signals.jsonl` is preserved
intact in
[`state/.../signals.jsonl`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
Higher tiers *add* a representation; they do not overwrite the lower
one. The same shape holds for the conscious bottleneck: the
`conscious-presenter` ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
produces one visible response *on top of* a fully retained workspace
and settlement. Nothing at a higher level invalidates the trace below.

### Layered representations as a stated commitment (idea 6)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
explicitly cites *possibility-2.md*'s "learning levels" and "layered
blackboard", and the runtime maintains `workspace.md` and
`blackboard.md` as the human-readable face of that layering. The
hierarchy protocol
([`02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md))
gives `level` a protocol slot rather than leaving it implicit.

### General laws kept separate from particulars (idea 4)

The plan uses *universal schemas* — `manifest.schema.json`,
`frame.schema.json`, `kline.schema.json`, `settlement.schema.json` — to
carry the form that applies to everything, and the *prose body* of each
manifest plus the YAML *arrangement* of frames and polynemes to carry
the particular behaviour. The schemas are the "general laws"; the
arrangements are what makes any given society this society and not
another. This separation is consistent with Minsky's warning that
universal laws "rarely explain anything in particular."

### Hundreds-not-a-dozen, as a posture (idea 7)

The first-ship catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is deliberately small (eight families, roughly two dozen agencies,
eight critics, eight censors). Growth is delegated to the
`self-modification` frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and to `agency.meta-admin.differentiation-broker`, so the plan does
not treat the seed catalogue as the final theory. The *direction* of
growth — many small specialised agencies rather than a few large ones
— matches Minsky's "hundreds of smaller theories".

---

## What the implementation does not yet take into account

These are the §2.2 ideas that the plan currently leaves implicit,
partial, or absent.

### A — Reductionist vs novelist temperaments are not represented

Idea 1 names a *cognitive style* split: prefer-the-old vs
prefer-the-new. The plan has a `novel.frame.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
for the case where no frame matches, and an analogy pass that prefers
prior K-lines. But there is no critic or scalar that *weighs the cost
of novelty* against the cost of extending an old theory. No agency
plays "reductionist" (push the proposal into an existing frame or
K-line); no agency plays "novelist" (argue the situation needs a new
frame). The first-ship critic catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
includes `critic.overconfidence`, `critic.evidence`, `critic.scope`,
but nothing like `critic.novelty-cost` or `critic.reduction-missed`.

### B — Inherited wiring is not represented as inherited

Idea 3 ties connections to *inheritance*: the particular arrangement
of connections is what each system is born with. The plan supplies
the wiring (polynemes, frames, K-line seeds) via the first-ship
catalogue and bootstrap, but there is no representation of *that
wiring as descent from a parent society*. No diff against an
ancestral polyneme table, no genome file for the frame set, no record
of which connections were inherited and which were learned. This is
the same shape as the heredity gap noted in §1.1's analysis
([som-1.1-sor.md](som-1.1-sor.md)), narrowed here to the *connection*
layer specifically.

### C — Level exists as a slot, not as a generative idea

Idea 6 promises that *level* will return throughout the book. The
plan honours level *operationally* — two assembly tiers, three
memory/workspace/state trees, a hierarchy protocol — but level is
not a *generative* primitive. There is no agency whose job is to
*discover a new level*: e.g. to notice that three critics' joint
output is itself a recurring pattern and deserves a higher-level
abstraction. New levels would have to be authored by a human via the
`self-modification` frame; the society cannot propose them. The plan
records this implicitly by routing all structural growth through
`agency.meta-admin.differentiation-broker`, which splits within a
level rather than between levels.

### D — Higher levels are summarising, not theorising

Idea 5 distinguishes *adding a principle* from *summarising a lower
level*. The current higher-level structures —
`agency.assembly.summary-tier-1` and `-tier-2`, the
`conscious-presenter`, the settlement layer — *compress*. They do
not *posit new principles* that the lower levels are then evaluated
against. The plan has no analogue of, for example, an agency that
proposes a project-law in
[`memory/semantic/project-laws.log`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
from observed lower-level regularities. Project-laws are *written*
by the archivist when settlements record them; they are not
*discovered* by a level above the signals. This is a partial gap:
the slot exists, the discovery mechanism does not.

### E — "Hundreds of theories" is implicit, not budgeted

Idea 7 names a population size — *hundreds*. The plan acknowledges
growth via `self-modification`, differentiation, and retirement, but
nowhere does it state the *target order of magnitude* of the mature
agency / critic / censor / frame / K-line population, nor what the
society's ecology should look like at that scale.
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
sets the seed; the ecology review
([`evolution/ecology-review.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md))
is the recurring check, but no document records that "few" and "many"
have meaning here and what those numbers should be. Without that, the
plan cannot tell whether the society is healthily proliferating or
unhealthily sprawling.

### F — No explicit conformance-to-lower-levels check

Idea 5's second half says higher levels must *not conflict* with what
is known at lower levels. The plan has the structural property
(higher levels read lower-level state and never delete it), but no
*check* that a higher-level summary or settlement is *consistent with*
the lower-level signals it draws on. A settlement could in principle
contradict the `objections.jsonl` it summarises; nothing in the
`criticize` or `settle` phases verifies otherwise. The
`critic.evidence` and `critic.overconfidence` critics approximate this
at the agency-output level, but there is no critic at the
*settlement-versus-signals* level.

---

## Summary table

| # | Idea from §2.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Two temperaments (reductionist / novelist) | No | `novel.frame.yml` exists; no novelty-cost critic, no reductionist counterpart (gap A). |
| 2 | Physics-as-ideal does not transfer; connections matter | Yes | Polynemes, frame slots, `activates_on`, `inhibits`, weighted excite/inhibit. |
| 3 | Connections are particular, set by inheritance | Partial | Wiring is explicit; descent / inheritance of wiring is not represented (gap B). |
| 4 | General laws explain little in particular | Yes | Universal schemas vs prose-body / YAML arrangement separation. |
| 5 | Higher levels add, do not replace | Partial | Lower levels preserved; but higher levels summarise rather than posit principles (gap D), and no conformance check (gap F). |
| 6 | Level is a recurring primitive | Partial | Level is a slot in protocols and assembly tiers; not a generative primitive the society itself can extend (gap C). |
| 7 | Hundreds, not a dozen | Partial | Direction is right; target population size and ecology shape are not stated (gap E). |

---

## Implication for the plan (no changes proposed here)

§2.2 lands on the plan in a more focused way than §1.1 did. The
implementation already takes the section's *strongest* claim seriously:
connectivity is a first-class, editable, governed artefact, separated
from the agents it connects. This is the load-bearing absorption, and
it is genuine.

The remaining gaps cluster around two themes. First, *novelty as a
weighted concern* — the temperaments split (A) and the unstated
population budget (E) both describe choices the society currently
cannot reason about. Second, *level as a generative idea* — the
summarising-vs-theorising distinction (D), the missing conformance
check (F), and the inability to propose new levels (C) all share the
same shape: level is present as scaffolding but not as something the
society can extend on its own. Inherited wiring (B) sits beside the
heredity gap already recorded in [som-1.1-sor.md](som-1.1-sor.md).

These are recorded here as analysis, not as a change request. Any
move from "noticed" to "proposed" goes through
[`AGENTS.md`](../../../AGENTS.md) §12: stop and ask the maintainer
before adding authority levels, identifier scopes, governance
primitives, or new top-level documents.
