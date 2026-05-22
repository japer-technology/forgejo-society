# Section 16.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.5.md](som-16.5.md) — *Avalanche effects*
(Minsky, §16.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.5 generalises the warning from §16.4. Any agency in which each
typical agent arouses several others will collapse into useless
activity — the cognitive analogue of epilepsy. Three control schemes
are named: *conservation* (a fixed-quantity resource), *negative
feedback* (a summary device that broadcasts inhibition proportional
to total activity), and *censors and suppressors* (selective
pattern-recognising blockers). The first two are blunt; the third is
versatile. None alone is sufficient for the more complex societies
needed for hard problems.

---

## The ideas Section 16.5 actually carries

1. **Unconstrained activation is epileptiform.** Without control,
   activity spreads faster than work gets done.
2. **Conservation.** Tie all activities to a shared finite quantity;
   only so many agents can be active at once.
3. **Negative feedback.** Compute a *total activity* summary, then
   broadcast an inhibition proportional to it.
4. **Censors and suppressors.** Recognise specific patterns of
   activity that have caused trouble, and selectively block them.
5. **Blunt schemes are indiscriminate.** Conservation and feedback
   stop activity without knowing which activity is worth keeping.
6. **Complex societies need their own self-regulation.** Bigger minds
   formulate and solve their own self-regulation problems.
7. **Self-regulation is partly cultural.** Communities — through
   common sense, law, religion, philosophy — work out collective
   self-regulation schemes that individual minds inherit.

---

## What the implementation already absorbs

### Conservation as budgets (idea 2)

Every agency manifest carries a `budget:` block:

```yaml
budget:
  max_tool_calls: 8
  max_wall_clock_s: 60
```

([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The normalized stimulus carries an initial budget for time, cost,
cycles, and workspace size
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)).
These are exactly Minsky's *fixed-quantity* throttles, applied per
agent and per stimulus.

### Negative feedback through cycle ceilings (idea 3)

The deliberate loop's `max_cycles` and `activation_threshold` in
`config/society.yml`
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
are a coarse summary-driven brake: as the loop accumulates activity,
the ceilings damp further expansion. The assembly tier
(`agency.assembly.summary-tier-1/2`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
plays the *summary device* role for downstream consumers, even if it
does not itself emit a global inhibition signal.

### Censors and suppressors as first-class code (idea 4)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
make censors and suppressors *manifest files* with `fires_at` and
`unconditional:` fields. They mechanically alter the tool surface
(censors) or block candidate outputs (suppressors). This is the
selective, pattern-recognising control Minsky calls for, named
exactly as he names it.

### Bluntness recognised by layering (idea 5)

The layered safety model in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
puts the blunt mechanisms (kill switch, budget caps) first and the
selective ones (censors, suppressors, approval gate) later. This is
the implicit acknowledgement that blunt controls cannot do the whole
job.

### Self-regulation by the meta-admin family (idea 6)

`agency.meta-admin.ecology-monitor`,
`agency.meta-admin.differentiation-broker`, and
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
plus the scheduled cron pass
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
are precisely "the society formulating and solving its own
self-regulation problems." Ecology review and reinforcement run on
schedule.

---

## What the implementation does not yet take into account

### A — No global activity summary

Idea 3's *summary device* computes total activity and broadcasts an
inhibition proportional to it. The plan has per-agent budgets and a
loop ceiling, but no signal of the form "total-activity-too-high →
inhibit everyone". A burst of many low-cost agents could exhaust
total cycles without any single agent crossing a budget threshold.

### B — Conservation is per-agent, not pooled

Idea 2 is shared finite quantity. Plan budgets are per-agent
allocations. There is no *shared pool* of, e.g., total tool calls per
stimulus that all agents draw from. Snarc-style "only a few may be
active at once" is not a constraint the runtime can express directly.

### C — Pattern memory of past avalanches is not built

Idea 4's censors recognise patterns *that have caused trouble in the
past*. The plan's censor catalogue is hand-authored
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
*First-ship censor catalogue*). New censors do not arise
automatically from failure records in `memory/failure/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The loop logs failures; it does not learn new censors from them. This
is the parent of gap D in [`som-1.1-sor.md`](som-1.1-sor.md) at the
safety surface.

### D — Cultural self-regulation has no entry point

Idea 7 places much self-regulation outside the individual mind, in
the community. The plan has no inter-society mechanism by which a
peer society's policies or critics could be adopted. The channels
stub
([`THE-SOCIETY-OF-REPO/09-channels/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/))
and the federation directory
([`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/))
are where this would live; today, every society regulates itself in
isolation.

---

## Summary table

| # | Idea from §16.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Unconstrained activation is epileptiform | Yes | Loop ceilings + budgets + fail-closed posture. |
| 2 | Conservation | Partial | Per-agent budgets; no shared pool (gap B). |
| 3 | Negative feedback | Partial | Cycle/budget ceilings; no global activity summary (gap A). |
| 4 | Censors and suppressors | Yes | First-class manifest files with `fires_at`. |
| 5 | Blunt schemes are indiscriminate | Yes | Layered safety puts blunt first, selective later. |
| 6 | Complex societies self-regulate | Yes | Meta-admin family + scheduled ecology review. |
| 7 | Self-regulation is partly cultural | No | No cross-society policy adoption (gap D). |
|   | Censors learned from past failures | No | Catalogue is hand-authored (gap C). |

---

## Implication for the plan (no changes proposed here)

§16.5's three control schemes are all named, in name, in the plan:
budgets are conservation, cycle ceilings are negative feedback,
censors and suppressors are themselves. The plan is unusually close
to Minsky's vocabulary here.

The substantive opportunities are gap A — a global activity summary
signal — and gap B — a pooled per-stimulus quota in addition to
per-agent budgets. Gap C (learned censors) is the safety-surface form
of the same learning-loop opportunity flagged in
[`som-1.1-sor.md`](som-1.1-sor.md). Gap D (cultural self-regulation)
is federation-scope and a long-horizon item.

These are recorded here as analysis, not as a change request. Any
move to add a global activity summary signal, a pooled stimulus
quota, learned censors, or cross-society policy adoption would touch
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and
[`THE-SOCIETY-OF-REPO/05-censors/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/05-censors/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
