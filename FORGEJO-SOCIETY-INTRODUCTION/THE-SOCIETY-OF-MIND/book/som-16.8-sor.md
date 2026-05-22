# Section 16.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.8.md](som-16.8.md) — *Stimulus vs.
simulus* (Minsky, §16.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.8 introduces *simulus*: a reproduction of a stimulus at the
*high* levels of the mind only, skipping the millions of sensory
nerves the real thing would excite. A simulus need not be a picture;
it need only reproduce the effect a scene would have on other
agencies. Vision is multi-level (retina → boundaries → regions →
frames → relations → goals), so an imagination can be injected at
any of those levels. A simulus is fast, cheap, and combinable — it
allows imagining things never seen, even things that could not
exist.

---

## The ideas Section 16.8 actually carries

1. **Internal arousal of another agency.** One agency can activate
   another by *imagining* a stimulus, not only by referring to a real
   one.
2. **Picture-images are extravagant.** Reproducing detail at the
   sensor level would require enormous machinery.
3. **Effect-replication is enough.** A simulus reproduces only the
   *effect* a scene would have on downstream agencies.
4. **Multi-level vision.** Vision proceeds through retinal sensors,
   boundary/texture detectors, region/shape describers, object
   frames, structural relationships, function/goal mapping.
5. **Inject at the top.** The cheapest illusion is at the *highest*
   level — force the highest-level vision agents into the state a
   real scene would produce, by activating K-lines.
6. **Simulus advantages.** Faster, less machinery, *combinable* —
   simuli from different sources can be merged into novel scenes,
   including impossible ones.
7. **Implicit definition.** A *simulus* is the K-line cast as
   experience-substitute: the same mechanism, used to imagine
   instead of to recall.

---

## What the implementation already absorbs

### Multi-level representation (idea 4)

The layered blackboard from `possibility-2.md`, realised as
`workspace.md` + `blackboard.md` + `signals.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md):
*layered blackboard*), distinguishes raw observations
(`percepts.jsonl`) from interpreted state (`workspace.md`) from
shared cognitive space (`blackboard.md`). Frames, polynemes, and
K-lines all operate at different *levels* of abstraction. The
plan's perception stack is shorter than Minsky's vision stack, but
the layered idea is present.

### Inject at the top through K-line reactivation (idea 5)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*are* the highest-level injection mechanism. A K-line's
`activation_snapshot:` reactivates the agency configuration *and*
preloads `useful_context.files_read` so the cartographer "sees" them.
This is exactly the simulus pattern: not raw bytes from the
codebase, but the higher-level state the cartographer would be in
*as if* it had read those files in this run.

### Branches as imagination (idea 1, 3)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
make every candidate write a *candidate-future branch*. The branch
*is* the imagined scene; the rest of the loop reads it as if it were
real and reports the *effect* it would have. Critics, censors, and
the validation pipeline appraise the imagined state without it ever
becoming reality.

### Effect-replication, not pixel-replication (idea 3)

K-line schema's `cue:` and `restore_when:` describe the *symbolic*
shape of the situation — terms, labels, paths, symbols — not the
literal stimulus payload. This matches Minsky's claim that the
effect, not the detail, is what matters.

### Conscious bottleneck as the consumer of simulus (idea 5)

The conscious presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
reads the *settled* blackboard, which is a high-level summary
produced by the assembly tier. The presenter never sees raw signals;
it sees the simulus equivalent of the settled situation.

---

## What the implementation does not yet take into account

### A — No primitive for combining multiple K-lines into a novel state

Idea 6 — the *combinability* of simuli into novel scenes — is the
section's most original claim. The plan can reactivate multiple
K-lines (`memory.max_k_lines_loaded` in `config/society.yml`,
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but it has no operator for *blending* them into a synthetic
configuration that was not in any single K-line. The current pattern
is union, not synthesis.

### B — No representation of impossible imaginations

Minsky specifically allows imagining things that could not exist.
The plan's candidate-future branches must validate; if they
contradict invariants, critics object and censors block. There is no
sandbox in which an explicitly *impossible* configuration is held
for examination — useful, for instance, when trying to *prove*
something is impossible.

### C — Simulus injection is restricted to K-line classes

K-lines are reactivated only when their `restore_when:` matches the
current stimulus. There is no operational path by which an agency
*requests* a particular K-line as a simulus regardless of cue. This
is the same gap A as in [`som-16.1-sor.md`](som-16.1-sor.md) and
[`som-16.7-sor.md`](som-16.7-sor.md), seen one more time.

### D — The "perception levels" are not enumerated

Idea 4's six-level vision stack has no counterpart in the plan. The
plan distinguishes percepts, workspace, blackboard, and settlement,
but does not name *levels of interpretation* the way Minsky does.
A simulus that targeted a *specific* level cannot today be
addressed, because the levels are not named.

### E — Simulus is not given a name in the spec

The implementation uses the *mechanism* of simulus (K-line + branch
+ effect-replication) throughout, but does not use the *word*. A
reviewer reading
[`THE-SOCIETY-OF-REPO/06-memory/klines/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/klines/)
would not find "simulus" anywhere; this is editorial, but it makes
the §16.8 connection invisible.

---

## Summary table

| # | Idea from §16.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Internal arousal by imagined stimulus | Partial | Branches + K-lines provide it; no `arouses_via:` primitive (gap C). |
| 2 | Picture-images are extravagant | Yes (avoided) | No raw-payload replication anywhere. |
| 3 | Effect-replication is enough | Yes | K-line cues are symbolic, not literal. |
| 4 | Multi-level vision | Partial | Layered blackboard exists; levels not enumerated (gap D). |
| 5 | Inject at the top | Yes | K-line reactivation + preload. |
| 6 | Combinable simuli | No | Union of K-lines, not synthesis (gap A); impossible states not allowed (gap B). |
| 7 | Simulus as named concept | No | Mechanism present; word not used (gap E). |

---

## Implication for the plan (no changes proposed here)

§16.8's mechanism is in the plan under a different name. K-line
reactivation, branch-as-imagination, and the layered blackboard
together implement effect-replication at high levels of
interpretation. The plan is closer to Minsky here than the
vocabulary suggests.

The substantive opportunities are gap A — a K-line *blend*
operator that produces novel synthetic configurations — and gap B —
a sandbox for explicitly impossible imaginations, useful for
disproofs. Gap D (named levels) and gap E (naming the *simulus*
concept) are editorial. Gap C recurs across §§16.1, 16.7, 16.8 and
is best read as a single shared opportunity.

These are recorded here as analysis, not as a change request. Any
move to add a K-line blend operator, a counterfactual sandbox,
named perception levels, or the word "simulus" in the spec would
touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`THE-SOCIETY-OF-REPO/06-memory/klines/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/klines/),
and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
