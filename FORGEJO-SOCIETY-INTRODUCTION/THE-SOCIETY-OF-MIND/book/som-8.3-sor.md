# Section 8.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.3.md](som-8.3.md) — *Mental states and
dispositions* (Minsky, §8.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.3 argues that *what is easy to recall is often hard to describe*
— and that K-line memory naturally produces this asymmetry, because
verbal expression must summarise a diffuse activity that K-lines
record in raw form.

---

## The ideas Section 8.3 actually carries

1. **K-lines record diffuse, widespread activity.** A disposition or
   sentiment may involve many agents at once; the K-line captures
   all of them.
2. **Reactivation is cheap; description is expensive.** Re-evoking
   the state is one wire-pull; describing it requires compressing
   that wide activity into compact verbal form.
3. **Easy to recall, hard to describe.** This is the empirical fact
   the section names and the K-line theory explains. The novice
   recalls *how it felt*; the expert recalls *the music itself*.
4. **Mental-state complexity ≠ verbal complexity.** A state can be
   enormous and diverse yet not "complicated" in any interesting
   sense.
5. **Public words versus private signals.** Words must obey public
   discipline to be predictable across people; internal signals need
   not. Private signal vocabularies can be wider than public ones.
6. **Branching of internal signals.** A nonverbal signal with one
   hundred connections per step can touch a million agents in three
   or four hops.
7. **The traditional view is upside down.** It is *not* harder to
   represent diffuse dispositions than crisp propositions; the
   K-line theory makes dispositions easy and propositions the
   harder case.

---

## What the implementation already absorbs

### Two vocabularies: signals (private) and presenter text (public)

The plan separates the two by construction.
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
defines `Signal` and `Handoff` as the internal record types —
dotted-lowercase names, energy levels, evidence, suggested effects
— with no requirement that any signal be expressible in user-facing
prose. Only `agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
produces visible text, and the plan calls this the *conscious
bottleneck* in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
This is the operational form of Minsky's "private signals need not
be so constrained."

### K-lines record raw activity (idea 1)

The `activation_snapshot.active_agencies` field carries the agencies
as they were, with weights, without trying to summarise into a
phrase
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The diffuse picture is preserved.

### Compression layers are explicit (idea 2)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
ships an *assembly family* — `agency.assembly.summary-tier-1`,
`agency.assembly.summary-tier-2` — whose only job is to compress
diffuse signals into per-family and then settlement-ready briefs.
The presenter sits above that. Compression is a *named step*, not
something the public output silently performs.

### Branching propagation (idea 6, partial)

Polynemes excite many agencies at once
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
signals carry `suggested_effects` with multi-agent excite/inhibit
lists
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md));
deliberation cycles let those propagate. The mechanism for
three-hop branching exists.

---

## What the implementation does not yet take into account

### A — There is no notion of "disposition" distinct from "state"

The plan has *signals* (per-cycle), *frames* (situational
expectation), *settlements* (per-stimulus decisions), and *K-lines*
(reactivatable configurations). It has no analogue of a
*disposition* — a persistent partial bias of the society that is
not tied to a specific stimulus. Idea 1's "widespread and diffuse
activity" with no single naming is not a structure the plan models.
Closest neighbours are `governance/self-ideals.md` and the
identity-family agencies, but neither is the per-society mood-like
configuration Minsky names.

### B — "Easy to recall, hard to describe" is not a runtime check

Idea 3 is empirically diagnostic: the society should be able to
*re-evoke* states that it cannot *describe*. The plan's presenter,
however, is the only voice; if the presenter cannot summarise a
state, that state effectively does not exist on the dialogue
surface. There is no path by which the society says "I have entered
a configuration I cannot describe but recognise" — the workspace's
`blackboard.md` and `workspace.md` are human-readable Markdown by
construction
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
which forces a description.

### C — Diffuse-state K-lines are unusual cases in the plan's catalogue

The K-line classes ship as `code-change`, `security`, `question`,
`self-modification`, plus on-demand classes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
These are all *task* classes; none is a *disposition* class. A
K-line that captures "the society was in a cautious mood across the
last twenty stimuli" has no class to live under, and the
`restore_when` schema is keyed to cues from a single stimulus.

### D — Private signal vocabulary is narrow, by design

The plan caps signal names to dotted-lowercase and asks each to
carry evidence. This is correct for safety and for "no evidence, no
trust" — but Minsky's idea 5 is that internal signals can be
*wider* than public words. The plan's internal vocabulary is in
practice *narrower* than the prose surface, because every signal
must validate against `schemas/signal.schema.json` and must be
explainable in a settlement. The branching mechanism exists; the
*linguistic permissiveness* that would make non-verbal patterns
possible does not.

### E — "Mental-state complexity ≠ verbal complexity" is not represented

Idea 4 demands a way to say "this state involves a great deal but is
not intricate." The settlement schema records `unknowns`,
`blind_spots`, `analogies_used`, `ideals_cited`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
but not a *breadth-vs-depth* characterisation of the state itself.
A reviewer cannot ask "was this a wide-and-simple state or a
narrow-and-intricate one?" and get a recorded answer.

### F — The presenter is forced to summarise diffuse states (idea 7)

The "traditional view is upside down" conclusion is exactly the
position the conscious presenter sits in: it must always produce
prose, which means diffuse dispositions must always be summarised
into propositions before they leave the society. This is a *chosen*
inversion of Minsky's claim — the plan privileges the
proposition-shaped output for safety and reviewability — and the
plan should record it as such. At present
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
explains the conscious bottleneck without flagging that it commits
to the "easier to express propositions" side of Minsky's dichotomy.

---

## Summary table

| # | Idea from §8.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | K-lines record diffuse activity | Partial | Per-stimulus activity captured; cross-stimulus dispositions absent (gap A). |
| 2 | Reactivation cheap, description expensive | Yes | Assembly tiers + presenter as named compression. |
| 3 | Easy to recall, hard to describe | No | Presenter must always describe (gap B). |
| 4 | State complexity ≠ verbal complexity | No | No breadth-vs-depth field on settlements (gap E). |
| 5 | Private signals wider than public words | Partial (inverted) | Internal vocabulary in practice narrower than prose (gap D). |
| 6 | Branching propagation | Yes | Polynemes + multi-effect signals + deliberation cycles. |
| 7 | Traditional view upside down | No (by design) | Plan commits to the proposition side via the presenter (gap F). |

---

## Implication for the plan (no changes proposed here)

§8.3 is where Minsky says feelings and dispositions are *easier*
than propositions for a K-line architecture, and where the plan's
safety posture (everything that leaves must be a settled,
prose-expressible decision) commits to the opposite trade-off. The
plan absorbs the compression mechanism (assembly + presenter) and
the private/public separation (signals vs presenter text), but it
does not model *dispositions* as a distinct structure, does not
record the breadth-vs-depth character of a state, and forces every
diffuse configuration into a proposition at the bottleneck. These
are deliberate choices made by the safety layer; they are also gaps
relative to §8.3. Closing them would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
