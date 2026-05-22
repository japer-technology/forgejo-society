# Section 18.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.3.md](som-18.3.md) — *Chaining*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.3 sharpens §18.2 with a structural claim: chains are useful in
thought *because* they share break-properties with chains in the
world. When chains are stressed, the weakest link breaks first; a
broken chain is repaired by fixing only the broken link; nothing can
be removed if both ends are fixed; if pulling A moves B, a chain
must connect them. The analogy between physical chains and lines of
thought is what licenses the metaphor.

---

## The ideas Section 18.3 actually carries

1. **Chaining works across realms.** It moves cleanly from arches
   and bridges to mental sequences without losing its grip.
2. **Within one world, chaining works in several ways at once.** The
   same arch can be a bridge, a tunnel, or a table; the mind chains
   each reading separately and switches between them.
3. **Chains share break-properties.** Weakest link breaks first;
   only broken links need repair; nothing between fixed endpoints
   can be removed; force at A reaching B implies a chain between
   them.
4. **Reasoning fails like chains break.** The analogy between
   physical break and inferential failure is what makes chain talk
   useful for thinking. A bad inference *snaps* at one step; only
   that step needs replacing.
5. **Multiple coexistent readings.** A single situation can support
   several chains at once, each valid for a different purpose.
   Switching readings is itself part of reasoning.

---

## What the implementation already absorbs

### Reasoning that fails one step at a time (ideas 3 and 4)

[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
gives every objection a specific `against:` target — an `agent-id`
or a `candidate-action-id`. An objection breaks the *one link* it
names, not the surrounding chain. The settlement records which
critics' objections were `sustained: true|false`, leaving every
other link intact. This matches Minsky's "only the broken link needs
repair": a sustained objection narrows the failure to one inference
without invalidating the rest of the deliberation.

### Branches as alternative readings (idea 5)

Candidate-future branches
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
let the society hold more than one reading of the same situation at
once: `society/<stimulus_id>/candidate-1`, `candidate-2`, and so on.
Each branch is a different chain from stimulus to action. The
`reality_revision` slot in the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records which chain became reality and which were preserved as
rejected hypotheses
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md):
`memory/failure/rejected-candidates/`).

### Repair localised to the broken link (idea 3)

The revert-path-finder
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
`agency.code.revert-path-finder`) is required to attach a revert path
to every settlement under the `code-change` and
`security-sensitive` frames
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
This is repair targeted at the broken step rather than at the whole
sequence: the chain is restored by reverting one commit, not by
rewinding the whole stimulus.

### Same situation under multiple frames (idea 2)

Frames ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are matched by overlapping criteria (`matches.any_signals`,
`any_labels`, `any_paths`, `any_phrases`), and more than one can
match. The activation phase carries this multiplicity: a stimulus
that hits both `code-change` and `security-sensitive` chains two
different reasoning shapes, with the more restrictive frame
lowering the authority ceiling. The arch-as-bridge-as-tunnel-as-table
reading is mirrored by stimulus-as-bug-as-security-as-self-mod.

---

## What the implementation does not yet take into account

### A — Weakest-link analysis is not computed

Idea 3 — "when chains are stressed, the weakest link breaks first" —
implies that the runtime could measure link strength and predict
where failure will occur. The plan has no analogue. Signals carry an
`energy:` field
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and claims carry `confidence:`, but neither is propagated *along a
chain* to identify which link is the weakest. The runtime cannot
say, before failure, "this inference will snap here".

### B — A chain is not an inspectable object

The plan represents inferences as a *sequence of records*
(`percepts.jsonl` → `signals.jsonl` → `handoff` → settlement). Each
record exists; the sequence as a *chain* — with named endpoints,
intermediate links, and a strength score — does not. A reviewer can
reconstruct a chain by reading the trace; the runtime cannot point
to "the chain that produced this proposal" as one thing.

### C — Repair-only-the-broken-link is informal

The revert-path-finder repairs *the action*, not *the inference*.
When a sustained objection breaks one link in deliberation, the
runtime currently has no mechanism to replace just that link and
re-run the cycle from that point onward. The deliberate loop
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
re-runs from `select_agents`; partial-chain repair is not a phase.

### D — Multiple coexistent readings are not weighted against each other

Candidate-future branches realise idea 5, but the plan does not
include a procedure for *comparing readings* before any becomes
reality. The settlement names the chosen branch and lists the others
as rejected; it does not record a *contest* between them with
per-reading strength scores. §18.3's reading-switching is closer to
"the same situation supports several inferences; pick the one that
serves the current purpose" than to "generate alternatives, then
discard".

### E — "If A moves B there must be a chain" — provenance is implicit

When an outcome surprises a reviewer, the plan offers a settlement
and the per-issue `state/mind/issues/<n>/` trace as the chain. There
is no protocol that, given a surprising outcome, *demands* the chain
that links the stimulus to the action be exhibited. Provenance is
there to be reconstructed; it is not requested mechanically.

---

## Summary table

| # | Idea from §18.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Chaining across realms | Yes | Same loop handles dialogue, code, governance, memory. |
| 2 | Several readings of the same world | Yes | Multi-frame match; multiple candidate branches per stimulus. |
| 3 | Chains share break-properties | Partial | Objections target single links; weakest-link analysis absent (gap A). |
| 4 | Reasoning fails one step at a time | Partial | Sustained objections name a single step; partial-chain re-run not implemented (gap C). |
| 5 | Multiple coexistent readings | Partial | Branches exist; contest between readings is not scored (gap D). |
| — | Chain as a first-class object | No | Records exist; chains are reconstructed, not represented (gap B). |
| — | "Pulling A moves B implies a chain" — provenance | Partial | Trace is available; mechanism does not demand it (gap E). |

---

## Implication for the plan (no changes proposed here)

§18.3 commits to chain-as-metaphor: physical chains and inferential
chains share enough structural properties that talking about one in
the language of the other is *useful*. The implementation absorbs
this where it is most operationally pressing — single-link
objections, localised reverts, multi-frame matching, multi-branch
candidate futures — but does not yet treat *the chain itself* as a
first-class object the runtime can inspect, weight, or repair in
place.

The most useful seam is gap B: there is no "chain" record sitting
between `signals.jsonl` and the settlement, so the runtime cannot
report "which chain produced this candidate" without a reader doing
the reconstruction. The second seam is gap A: signals and claims
already carry numeric energies and confidences, but the runtime does
not propagate them along a chain to find the weakest link before
failure.

These are recorded here as analysis, not as a change request. Any
move to close them would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(a possible chain record), the deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
