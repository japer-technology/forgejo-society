# Section 24.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.5.md](som-24.5.md) — *Nonverbal reasoning*
(Minsky, §24.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.5 argues that everyday inference is *not* deduction; it is
*memory manipulation* — substituting one polyneme into the slot that
another usually occupies, then watching what the rest of the
agencies do. It also flags the penguin-bird problem: a specific
representation should not be silently overwritten by its generic.

---

## The ideas Section 24.5 actually carries

1. **Common-sense reasoning is substitution, not deduction.** To
   reason about a Boojum, attach the Snark polyneme and observe.
2. **Logic is the special case, not the rule.** Logical reasoning is
   simpler and weaker than commonsense reasoning, and frequently
   wrong (Boojums turn out albino).
3. **Specific knowledge must override generic inheritance.** When
   penguin-facts conflict with bird-facts, the specific wins.
4. **Reasoning needs movable, comparable representations.** The mind
   must hold two representations *side by side* and edit one without
   destroying the other.
5. **Memory-control is the substrate of inference.** Inference
   competence depends on isonomes that govern level-bands inside
   agencies.
6. **Most of this is invisible.** Commonsense inference happens
   without conscious effort and largely without conscious trace.

---

## What the implementation already absorbs

### Substitution-style activation (idea 1, partial)

Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
work by *exciting* a configuration of agencies — wake the right set
and the system behaves as if the symbol were active. This is the
same shape Minsky describes: bring a polyneme online and let the
agencies state-change.

### Specific over generic in memory tree (idea 3, partial)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
separates `memory/episodic/` (specific instance traces) from
`memory/semantic/` (durable generic claims). The order-of-precedence
during recall is not explicitly written, but the per-stimulus
workspace
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
holds the *specific* situation in `state/mind/issues/<n>/`,
distinct from the durable beliefs.

### Side-by-side representation (idea 4, partial)

Branches-as-candidate-futures
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
explicitly let two versions of reality co-exist (`main` and
`society/<stimulus_id>/candidate-<n>`). This is closer to Minsky's
*two representations* than the agency catalogue alone would be.

### Invisible-by-design inference (idea 6)

The conscious bottleneck ensures that only
`agency.integration.conscious-presenter` produces visible text
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The mass of internal handoffs and signals stay below the surface,
which matches the "without the slightest conscious effort" character
Minsky describes — though for governance reasons every signal is
still committed to `state/`.

---

## What the implementation does not yet take into account

### A — No polyneme-substitution mechanism

Idea 1 is mechanical: take polyneme A and *attach it to the slot
usually filled by polyneme B*. The plan has no operation of this
shape. Polynemes are catalogued
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but never substituted; nothing in the runtime modules takes
"polyneme P fills the role that polyneme Q normally occupies" as an
input.

### B — No precedence rule between specific and generic

Idea 3 demands that penguin-facts beat bird-facts. The plan has no
written rule for which tree wins when `memory/episodic/` and
`memory/semantic/` disagree. The memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)
governs *writing*, not *resolution at recall*.

### C — Isonome-style level-band control is absent

Idea 5 names the cognitive primitive: *isonomes* control level-bands
across agencies. The plan has polynemes but no isonomes — no agent
type whose job is "do the *same* operation across all agencies",
which is what Minsky uses isonomes for in this chapter. The
mapping table
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md))
does not list an isonome catalogue.

### D — Logic-as-special-case is unstated

Idea 2 is a stance. The plan's critic family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
includes evidence and scope critics, but the *primacy of
commonsense over logic* is not recorded. A future maintainer might
reasonably read the critic catalogue as "logical attack on claims is
the goal," which is the opposite of Minsky's emphasis.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Reasoning by substitution | Partial | Polynemes excite; no substitution operation (gap A). |
| 2 | Logic is the special case | No (unstated) | Stance not recorded (gap D). |
| 3 | Specific overrides generic | Partial | Episodic/semantic split exists; precedence undefined (gap B). |
| 4 | Movable, comparable representations | Partial | Branches enable side-by-side; in-memory comparison weaker. |
| 5 | Memory-control via isonomes | No | Isonome layer absent (gap C). |
| 6 | Mostly invisible | Yes | Conscious bottleneck. |

---

## Implication for the plan (no changes proposed here)

§24.5 names a primitive — the *isonome* — that the plan does not
have, and an operation — *polyneme substitution* — that the plan
does not perform. The episodic/semantic precedence rule (gap B) is
the cheapest to close; the isonome gap (gap C) is the deepest.
Closing any of A–D would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md),
and possibly the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
