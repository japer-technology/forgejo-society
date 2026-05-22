# Section 16.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.6.md](som-16.6.md) — *Motivation*
(Minsky, §16.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.6 frames a dilemma about learning: how do we keep what was
learned for one goal from being misapplied to another? Two extremes
fail. *Separate memory banks per goal* keep learning clean but waste
storage and prevent generalisation. *A single shared memory* invites
each specialist to rearrange structures the others depend on, with
unpredictable consequences. The good answer must lie between, and
must rely on specialists *exploiting* each other rather than
*understanding* each other.

---

## The ideas Section 16.6 actually carries

1. **Cue-bound learning.** Without restriction, learning a behaviour
   in one context (Thirst → reach for cup) leaks into all others
   (cold, lonely, hungry).
2. **Per-goal memory banks.** One way out: each goal has its own
   memory. Cross-exclusion gates *learning*, not just acting, so
   Hunger's memories only form when Hunger is active.
3. **Per-goal memory is uncomfortably extravagant.** Most real-world
   goals draw on the same world-knowledge; per-goal banks duplicate
   what should be shared.
4. **Shared memory is dangerous.** When any specialist rearranges
   shared structures to its own advantage, the others' assumptions
   silently break.
5. **Specialists cannot negotiate.** They are too small and too
   narrow to communicate, organise, or understand each other.
6. **Exploitation, not understanding.** The only available mode of
   cooperation is one specialist *exploiting* what another can do,
   without knowing how.

---

## What the implementation already absorbs

### Cue-bound activation (idea 1)

Polynemes and frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
make activation cue-bound: an agency wakes only when its
`activates_on:` signals, frames, or paths match. K-line
`restore_when:` clauses are the cue-bound counterpart for *reuse*.
An agency does not run merely because it ran last time; it runs when
the cue is present.

### Per-goal vs shared memory: a layered answer (ideas 2, 3)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
splits memory into three trees:

- `state/` — per-stimulus, per-run, append-only (the per-goal bank).
- `workspace/` — short-term shared attention.
- `memory/` — durable, governed, shared semantic / procedural /
  K-line / decisions store.

This is structurally the *between* Minsky asks for: each stimulus
gets its own scratch space (Hunger's memories form in Hunger's run),
while durable structures sit in a shared, governed pool.

### Shared-memory safety through append-only governance (idea 4)

The plan addresses idea 4 directly. `memory/` is append-only;
corrections are new entries with `supersedes:` links; in-place
rewrites require human confirmation under `governance_mutation` or
`memory_mutation` danger zones
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Only the `archivist` may promote material into `memory/`. No
specialist can rearrange shared structures to its own advantage.

### Exploitation without understanding (ideas 5, 6)

The handoff and signal schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
are the explicit shape of "exploitation without understanding". Each
agency emits structured records the others can consume; none reads
another's prompt or weights. The blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md):
`blackboard.md`) is the shared scratch that several agencies can use
through the same well-typed interface.

### Cross-exclusion gates learning, not just acting (idea 2 refined)

K-line writing rules
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md):
*When a K-line is written*) condition writing on settlement outcome
and on which agencies contributed. K-lines are not formed for every
cycle; the gate runs at settlement, not at every activation. This
gives a discipline analogous to "Hunger's memories form only when
Hunger is active".

---

## What the implementation does not yet take into account

### A — Learning gating is per-stimulus, not per-goal

The plan gates *writes* at settlement, but it has no first-class
notion of which *goal* the writes serve. K-lines are tagged by
`class:` (`code-change`, `security`, `question`, `self-modification`,
...). That is closer to "frame" than to "goal". Minsky's idea 2 is
per-goal; the plan's nearest analogue is per-class. The parent
absence is gap C in [`som-16.2-sor.md`](som-16.2-sor.md): no
first-class agency-local goal.

### B — Shared memory cannot be rearranged, but neither can it be reshaped by use

Append-only is safe but rigid. A specialist that would benefit from
*reshaping* a shared concept cannot do so; it can only append a new
concept. This is a chosen trade-off, consistent with the audit
posture, but it is the opposite of the "shared, mutable, dangerous"
memory Minsky describes — the plan has shared, immutable, safe
memory.

### C — Exploitation has no inventory

Idea 6 says exploitation is *the* cooperation mode. The plan supports
it everywhere but does not inventory which exploitations exist.
There is no map of the form "agency A exploits agency B by emitting
signal S; agency B has no idea." Such a map would help reviewers
trace why a particular signal exists. This is the same gap A as in
[`som-16.1-sor.md`](som-16.1-sor.md) (no `arouses_via:` primitive),
viewed from the cooperation side rather than the arousal side.

### D — Cross-stimulus leakage is not actively prevented

The workflow `concurrency:` group
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
isolates *concurrent* stimuli. Once one stimulus completes, however,
its K-lines and semantic entries become available to every later
stimulus. A behaviour learned in a `code-change` may be retrieved in
a `question` if the cue matches loosely enough. This is intentional
(generalisation), but there is no *guard* that flags
suspicious cross-class K-line reuse the way `critic.scope` flags
out-of-scope proposals.

---

## Summary table

| # | Idea from §16.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Cue-bound learning | Yes | Polynemes, frames, K-line `restore_when:`. |
| 2 | Per-goal memory banks | Partial | Per-stimulus `state/`; per-class K-lines; per-goal not represented (gap A). |
| 3 | Per-goal memory is extravagant | Yes (avoided) | Three-tree split shares durable memory. |
| 4 | Shared memory is dangerous | Yes (mitigated by append-only) | Plan's shared memory is immutable rather than mutable (gap B). |
| 5 | Specialists cannot negotiate | Yes | No agency reads another's prompt; only handoffs/signals. |
| 6 | Exploitation, not understanding | Yes | Handoff/signal schemas are exactly this; not inventoried (gap C). |
|   | Cross-stimulus leakage prevention | No | Generalisation is allowed; no suspicious-reuse guard (gap D). |

---

## Implication for the plan (no changes proposed here)

§16.6's dilemma is resolved in the plan by separating *episodic
scratch* (`state/`) from *durable shared memory* (`memory/`), gating
writes at settlement, and making the durable side append-only. The
plan is one careful interpretation of Minsky's middle ground.

The substantive opportunities are gap C — an inventory of which
agencies exploit which others, by which signals — and gap D — a
critic or censor that flags improbable cross-class K-line reuse. Gap
A is a parent gap shared with [`som-16.2-sor.md`](som-16.2-sor.md);
gap B is a chosen divergence (audit over malleability).

These are recorded here as analysis, not as a change request. Any
move to add an exploitation map, a cross-class reuse critic, or
agency-local goals would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
