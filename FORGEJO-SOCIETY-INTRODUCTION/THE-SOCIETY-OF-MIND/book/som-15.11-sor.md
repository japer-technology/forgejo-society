# Section 15.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.11.md](som-15.11.md) — *The recursion
principle* (Minsky, §15.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.11 closes the chapter with a precise design rule: when a
problem splits into parts, you cannot split the *agency* into
parts to match — that path leads to fragmentation. You must reuse
the same agency in serial order, applying full power to each
subjob. This requires short-term memory to hold the *state* of
interrupted agencies. And short-term memory must work too fast to
have any time for consciousness.

---

## The ideas Section 15.11 actually carries

1. **Fragmenting an agency by subjob count fails.** Each subjob
   would inherit too little of the agency.
2. **Serial reuse with full power is the alternative.** One
   agency processes subjobs one at a time, each with all of its
   capability.
3. **Serial reuse costs time but preserves competence.** This is
   the trade.
4. **The recursion principle.** When a problem splits, unless the
   mind's full power is applied to each subjob, intelligence
   disperses and less cleverness is left for each task.
5. **Serial reuse needs interruption-state machinery.** "Where we
   were" must be saved and re-created.
6. **Short-term memory-devices are substantial.** Each is
   intricate and specialised; the brain cannot afford many
   duplicates.
7. **Reuse requires erasure.** Each time a unit is reused, the
   prior contents go (or must be moved elsewhere).
8. **Movement to elsewhere also costs time.** And it interrupts
   the flow of thought.
9. **Short-term memory must work too fast for consciousness.**
   The speed required is incompatible with leaving traces a
   conscious process could read.

---

## What the implementation already absorbs

### Same agency processes many subjobs (ideas 1, 2)

Agencies are not partitioned per subjob. A single
`agency.code.patch-imaginer` handles each candidate patch with
its full prompt and tool surface
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Within one run, the same agency may be invoked multiple times via
handoffs
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
There is no fragmentation rule that says "split the agency."

### Serial reuse is the default within a phase (idea 2, 3)

The deliberate loop processes subjobs in sequence within a phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The branch model — `society/<stimulus_id>/candidate-<n>` — uses
the *same* code path for each candidate, paying time to keep
power per candidate.

### Substantial short-term machinery (idea 6, partial)

Each run carries a substantial `state/mind/issues/<n>/` tree
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and the workspace carries the global blackboard and current focus.
These are not cheap; they are the substrate that lets the
deliberation reuse the same agencies cleanly.

### Reuse-implies-erase pattern at run boundary (idea 7)

When a new run begins for a new stimulus, the run's state
directory is fresh. Prior temporary content is either archived
into `memory/episodic/` or pruned per the retention policy
([`policies/memory-policy.yml`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The "or moved elsewhere" alternative Minsky describes (idea 7) is
the archival path.

### Movement-elsewhere costs are real (idea 8, partial)

The archivist's promotion of state to memory takes a discrete
phase (`remember` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The cost shows up as wall-clock between settlement and the next
stimulus.

---

## What the implementation does not yet take into account

### A — The recursion principle is not stated as a design rule

Idea 4 is the section's named principle. It would belong in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
as a constraint on how new agencies are introduced ("do not split
an agency by subjob count; reuse one agency serially with full
power"). The plan honours the rule in practice — there is no
`agency.code.patch-imaginer.first-half` and
`agency.code.patch-imaginer.second-half` — but the constraint is
not written down. A future contributor could add such an agency
without violating any explicit rule.

### B — Within-agency serial subjob state has no carrier

Idea 5's "save where we were" is the same machinery §15.7 and
§15.9 require, and the plan lacks it (see those analyses). When
a single agency invocation must process several subjobs serially
(say, three candidate patches), the agency must hold its
"between-patches" state inside its own prompt or output —
there is no per-agency, per-subjob scratch buffer.

### C — Per-call power is not enforced

Idea 2 says each subjob gets *full* power. The plan's per-agency
budget is per-invocation, not per-subjob: an agency given three
subjobs in one invocation gets one budget for all three. The
"full power per subjob" guarantee would require either separate
invocations per subjob or a budget rule that scales with detected
subjob count.

### D — Erase-on-reuse is implicit, not enforced

Idea 7 makes erasure a *guarantee* about temporary memory-units.
The plan's per-run state is fresh per run but, within a run,
JSONL files are append-only — nothing is erased on reuse because
nothing is reused. The plan does not have the kind of per-agency,
per-run scratch slot whose contents would *need* erasing.

### E — "Too fast for consciousness" is a constraint the plan
does not face

Idea 9's claim — short-term memory works too fast to leave
conscious-readable traces — is a *cost* the plan happily pays the
other way: every signal *is* a trace, and the cost is not speed
but verbosity. The plan does not have unsurfaced, fast,
unrecorded operations *by design*. This is a defensible reversal
of Minsky's claim — disk is cheaper than neural tissue — but it
should be acknowledged: the plan's conscious bottleneck is
about *audience*, not about *trace existence*.

### F — Cost of "moving elsewhere" is not bounded per run

Idea 8 — archival is not free — has no per-run accounting. The
remember phase can in principle write many durable records from
one settlement. There is no cap on per-run archival work, nor a
deferral mechanism for "settle now, archive overnight."

### G — Reuse-with-full-power has no asymmetry detector

Idea 4 implies that if cleverness is being dispersed across
subjobs, that is itself observable. The plan does not measure
per-subjob cleverness or detect dispersion. A run that drives
the cartographer twelve times for one settlement does not
trigger a "you are dispersing" signal that a critic could
amplify.

---

## Summary table

| # | Idea from §15.11 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Fragmenting agencies by subjob count fails | Partial | Honoured in practice; not stated as rule (gap A). |
| 2 | Serial reuse with full power | Partial | Default within a phase; per-subjob power not enforced (gap C). |
| 3 | Serial reuse costs time | Yes | Branch model pays per-candidate time. |
| 4 | The recursion principle | No | Not stated as a design rule (gap A); no dispersion detector (gap G). |
| 5 | Interruption-state machinery | No | No per-agency scratch buffer (gap B). |
| 6 | Substantial short-term machinery | Yes | `state/` tree is non-trivial. |
| 7 | Reuse requires erasure | Partial | Erase at run boundary; not at intra-run reuse (gap D). |
| 8 | Movement-elsewhere costs time | Partial | Remember phase costs wall-clock; per-run cap absent (gap F). |
| 9 | Short-term memory too fast for consciousness | No (by design) | The plan trades speed for trace (gap E, acknowledged absence). |

---

## Implication for the plan (no changes proposed here)

§15.11 closes the chapter with a constraint whose first half — *do
not fragment* — the plan structurally honours, and whose second
half — *therefore you need short-term memory and accept its
costs* — the plan only partly absorbs. The most consequential
single opportunity is gap A: writing the recursion principle into
the implementation prose, so that future agencies are added by
*serial reuse* rather than by splitting an existing one. It is a
documentation move, not a structural one, and it would prevent the
specific failure Minsky names. The most distinctively Minskyan
absence is gap E — the plan deliberately reverses Minsky's
"too fast for consciousness" trade by paying disk for traces — and
this reversal deserves to be named, not left implicit, so that the
plan's conscious bottleneck is understood as a rule about
*audience and authorship* rather than about trace scarcity.
Closing any of these would touch
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
(stated design rules),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(agency-introduction discipline; per-subjob budgeting), and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(per-agency scratch buffers; per-run archival caps). These are
recorded here as analysis, not as a change request. Any move to
close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
