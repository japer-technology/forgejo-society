# Section 22.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.3.md](som-22.3.md) — *De-specializing*
(Minsky, §22.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.3 takes the polyneme/isonome distinction of §22.2 and turns it
into a *learning move*: a script becomes more general when its
polynemes (specific to *apples* and *pails*) are replaced by isonomes
(Origin, Destination). The same move, applied recklessly, produces
absurdity (*put the ocean in the cup*), so the script must also
acquire constraints. Generalisation is a society of methods, not one.

---

## The ideas Section 22.3 actually carries

1. **De-specialisation is a real cognitive move.** Children acquire
   the ability to apply a script learned in one situation to another.
2. **The mechanism is polyneme-to-isonome substitution.** Replacing a
   specific activator with a general slot is one way the move
   happens.
3. **Without constraints, the move overshoots.** *Put the ocean in
   the cup* exposes the need for *appropriate* limits on what each
   slot may bind.
4. **Constraints belong to the script, not to the world.** They sit
   in the procedure: the Destination must be a container, open at
   the top, large enough for the Origin.
5. **Generalisation is plural.** No single policy works for all
   domains; it is "the huge societies of different methods we use to
   extend the powers of our skills."
6. **Uniframes encode constraints learned from many examples.** After
   enough successes and failures, the good constraints can be
   summarised in a single frame.
7. **Some generalisations are not worth keeping.** When accumulated
   exceptions and censors exceed the gain, it is better to retain the
   original polynemes.

---

## What the implementation already absorbs

### Constraints in the script (idea 4)

Frame schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carry `slots`, each of which may declare `required: true|false` and
`filled_by: [<agent-id>]`. The `security-sensitive` frame, for
example, requires `permission_diff`, `revert_path`, and
`human_confirmation_state`. These are the script-level constraints
§22.3 demands.

### Critics as exception-enforcers (idea 3)

The critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`critic.evidence`, `critic.scope`, `critic.cost`, `critic.risk`,
`critic.overconfidence`) is precisely the "list of conditions under
which an over-general script must not fire." A diff that
over-generalises gets caught in `criticize`, not after the act.

### Pluralism of method (idea 5)

The activation pipeline does not commit to one selection mechanism:
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
stacks polynemes, frames, K-lines, and an *analogy fallback*. When no
K-line and no frame matches strongly, the analogy pass runs. This is
the "society of methods" character §22.3 calls for.

### Memory of failure (idea 7)

`memory/failure/` and `memory/failure/rejected-candidates/` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
preserve the cases where a generalisation went wrong. The
infrastructure for "watch generalisations fail and decide not to
keep them" exists.

---

## What the implementation does not yet take into account

### A — No polyneme-to-isonome substitution step

The central move of §22.3 — taking a working script and *replacing* a
specific polyneme with a general slot — is not a runtime operation.
Polynemes are authored manually in `nemes/`; there is no agency whose
job is to look at a successful K-line, identify the polynemes that
could have been isonomes, and propose a more general version. The
*meta-admin* family is the natural home for this, but its current
roles are `ecology-monitor`, `differentiation-broker`,
`retirement-broker` — *none* of which propose generalisation.

### B — Constraints are authored, not learned

Frame slots are written by humans; they are not derived from observed
successes and failures. §22.3 explicitly describes the process by
which a child *accumulates* constraints from many trials. The plan
has the failure log (see absorption above) but no agency that reads
the failure log and proposes tighter `slots` for the frame that
failed.

### C — No uniframe-formation mechanism

Idea 6 — "build a uniframe to embody good constraints" — has a
specification home in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md)
and a memory home in
`.forgejo-society/memory/concepts/`, but no agency that *forms* a
uniframe from a cluster of related K-lines. `memory/frames/` is
written by `meta-admin.differentiation-broker`, but only on human
confirmation, and the broker has no procedure for *summarisation*
across instances — it only proposes *splits*.

### D — No exception-cost / generalisation-cost ledger

Idea 7 requires comparing the cost of carrying many exceptions against
the cost of keeping the script specific. The plan has `decay_score`
per record, `reuse_count` per K-line, and a retirement broker, but
no scalar that captures the *exception burden* of a frame or
procedural rule.

### E — Reckless generalisation has no specific guard

The plan can stop *unsafe* actions (censors) and *unsupported* claims
(critics), but it cannot specifically detect "this generalisation has
become broader than the evidence supports." `critic.overconfidence`
is the nearest match; it operates on per-proposal confidence, not on
the breadth of a learned procedural rule.

### F — Specific-to-general is a one-way relation, not a graph

When a generalised script is later cut back to a specific case, that
return move is also a real cognitive move. The plan has no record of
the lineage between a specific and a general version of a procedural
memory. The relational link types in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
(`derived_from`, `supersedes`, `contradicts`) do not include
`generalises` or `specialises`.

---

## Summary table

| # | Idea from §22.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | De-specialisation as a cognitive move | No | No agency performs it (gap A). |
| 2 | Polyneme-to-isonome substitution | No | Polynemes authored manually (gap A). |
| 3 | Need for constraints | Yes | Frame `slots`; critics. |
| 4 | Constraints live in the script | Yes | Frame schema. |
| 5 | Generalisation is plural | Yes | Polynemes + frames + K-lines + analogy. |
| 6 | Uniframes from many examples | No | No formation mechanism (gap C). |
| 7 | Some generalisations not worth keeping | Partial | Failure log exists; no exception-cost ledger (gap D); no guard against over-broad rules (gap E). |
| — | Specific ↔ general lineage | No | Relational link types lack `generalises` / `specialises` (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.3 describes generalisation as a *learnt operation*, not a one-shot
authoring decision. The plan currently leaves generalisation to
humans: frames and polynemes are written, not derived. The
infrastructure that *would* support a learnt generalisation pass is
already present — failure log, K-line snapshots, relational links,
meta-admin family — but the pass itself, and the cost ledger that
would tell it when to stop, are absent.

Any move to add a generalisation broker, learnt constraint
tightening, or uniframe formation would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the representation and relational-memory protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
