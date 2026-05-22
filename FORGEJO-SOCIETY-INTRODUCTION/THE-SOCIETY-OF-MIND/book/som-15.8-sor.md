# Section 15.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.8.md](som-15.8.md) — *Anatomy of memory*
(Minsky, §15.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.8 sketches the inside of a typical large agency: several
*micromemory-units* — each a kind of temporary K-line that quickly
stores or restores the state of many agents — and several
*short-term memory-units* that store the states of the
micromemories. Long-term transfer is slow (minutes to hours), so
most temporary memories are permanently lost. The memory-
controlling agency itself learns and therefore needs its own memory.

---

## The ideas Section 15.8 actually carries

1. **Each major agency has its own memory anatomy.** No global
   memory store; per-agency machinery.
2. **Micromemory-units are temporary K-lines.** They quickly
   store or restore the state of many agents inside one agency.
3. **Short-term memory-units stack above them.** They hold the
   states of micromemory-units themselves.
4. **Reuse erases.** When a temporary unit is reused, prior
   contents are gone unless transferred.
5. **Long-term transfer is slow.** Minutes-to-hours in the
   biological case; most temporary content is lost.
6. **Most temporary memory is permanently lost.** Forgetting is
   the default, retention the exception.
7. **A memory-controlling agency exists per major agency.** It
   coordinates the units above.
8. **That controller is itself a learner.** It needs its own
   memory-system; control is not exempt from learning.

---

## What the implementation already absorbs

### Per-agency machinery is the basic shape (idea 1)

Every agency is a Markdown file with its own manifest and prompt
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Each has its own `tools`, `outputs`, `inhibits`, and `budget`.
The plan does not pool memory access across agencies; the read
surface is per-agency by frame and authority.

### K-lines as remembered configurations (idea 2)

K-lines are explicitly *remembered mental configurations*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md);
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md))
that boost a set of agencies. They are the durable form of
Minsky's micromemory-units. The schema includes an
`activation_snapshot` that names which agencies were active and
at what weight.

### Reuse-erases pattern in the state tree (idea 4)

`state/mind/issues/<n>/` is per-run; the next run gets a new
issue directory and the previous one is either kept (open
issues) or archived to `memory/episodic/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The pattern is "either consolidate or lose," matching idea 5.

### Long-term transfer is real and gated (idea 5)

`memory/` is written only by the archivist and only on
settlement
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A run that does not reach settlement does not contribute durable
memory. The transfer is not free.

### Most temporary content is lost (idea 6)

The retention policy
([`policies/memory-policy.yml`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
defaults to "keep all state for open issues; archive closed-issue
state into `memory/episodic/` after N days." Most signal-level
detail does not survive into durable memory; what does is
heavily summarised.

### A meta-admin family exists for controller learning (idea 8, partial)

`agency.meta-admin.ecology-monitor`,
`agency.meta-admin.differentiation-broker`,
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
are the closest analogue of memory-controller learners. They
revise the agency set itself, which is a higher-order form of
"controller-side learning."

---

## What the implementation does not yet take into account

### A — Per-agency, intra-run micromemory-units do not exist

Idea 2's micromemory-units are *within one agency, within one
run*. They let an agency hold several alternative configurations
of itself simultaneously and switch between them. The plan's
state buffers are per-issue, not per-agency-within-issue, and an
agency cannot stash several alternative internal states inside
itself. K-lines are durable and read-only; they are not
micromemory.

### B — No two-layer stack of memory-units (idea 3)

Idea 3 is specific: short-term memory-units store the *states of
micromemory-units*. The plan has only one layer of within-run
state (the `state/mind/issues/<n>/` files). There is no second
layer that holds snapshots *of* those files for fast
restoration.

### C — Reuse-erases is at run boundary, not buffer boundary

Idea 4 says reuse of a memory-unit erases its contents *unless*
transferred. The plan's erasure happens at the boundary between
runs (closed-issue archival) or via the scheduled sweep
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Within a run, JSONL files are append-only and nothing is reused
in the Minsky sense.

### D — Long-term transfer has no time signature

Idea 5's *minutes-to-hours* characterises consolidation as slow.
The plan archives at settlement, which is typically seconds-to-
minutes after the contributing material was first written.
Consolidation is fast relative to Minsky's claim. The plan
inherits no protective interval between writing and durabilising.

### E — Per-agency memory-controller is implicit

Idea 7's memory-controlling agency *per major agency* is not in
the catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The memory family has cross-agency members (resonator, retriever,
contradiction-finder, forgetting-critic) but no per-family
controller. The code family has no `agency.code.memory-control`;
the perception family has none either.

### F — Controller learning is at the *society* level, not the
agency level

Idea 8 says the controller learns. Meta-admin agencies learn at
the society level (proposing splits, retirements, evolution
records
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
`evolution/reinforcement-log.md`
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
There is no per-agency controller that learns "how *this* agency
manages its own state." Learning is one level coarser than §15.8
describes.

### G — Diagram of memory flow inside an agency is missing

Idea 1 is the section's diagrammatic claim: the memory flow
inside an agency is part of the agency's anatomy. The plan
describes flow *between* agencies (signals, handoffs,
blackboard) but not *within* one. An agency manifest names its
inputs and outputs; it does not name its internal memory ports.

---

## Summary table

| # | Idea from §15.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Per-agency memory anatomy | Partial | Agencies are autonomous; internal anatomy unspecified (gap G). |
| 2 | Micromemory-units (temporary K-lines) | No | K-lines are durable; intra-run, per-agency analogue absent (gap A). |
| 3 | Short-term units stack above micromemory | No | Only one layer of within-run state (gap B). |
| 4 | Reuse erases | Partial | Erasure at run boundary, not within run (gap C). |
| 5 | Long-term transfer is slow | No | Archival is fast; no interval (gap D). |
| 6 | Most temporary memory is lost | Yes | Retention policy archives summaries, not detail. |
| 7 | Per-agency memory-controller | No | Memory family is cross-agency (gap E). |
| 8 | Controller is itself a learner | Partial | Meta-admin learns at society level, not per-agency (gap F). |

---

## Implication for the plan (no changes proposed here)

§15.8 is the chapter's *anatomy* section, and it is the section
where the plan and Minsky diverge most. The plan operates at the
*between-agencies* and *between-runs* grain; Minsky's claim is
that the interesting memory machinery is *within an agency,
within a run*. The K-line layer is the only place the plan
crosses into Minsky's grain, and even there it is durable rather
than temporary. The most consequential single opportunity is gap
A — a per-agency, intra-run micromemory mechanism — because once
agencies can hold several alternative internal configurations
during a single deliberation, the rest of §15.8 (gaps B, C, E, G)
becomes constructible on top of it. Closing it would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(manifest schema for internal memory ports),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(state tree extended with per-agency buffers), and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line as the durable form of a richer family). These are
recorded here as analysis, not as a change request. Any move to
close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
