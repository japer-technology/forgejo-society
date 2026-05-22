# Section 5.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.4.md](som-5.4.md) — *Personal identity*
(Minsky, §5.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.3 demolished the homunculus. §5.4 then asks a more difficult
question: if the singleton Self is incoherent as theory, why does the
singleton picture persist in practice? Minsky's answer is that it
*works* — for the physical world, for privacy and responsibility,
for the management of overlapping mental work, and for the stream-of-
consciousness narrative we impose on ourselves to retain control. The
trouble begins when this practical convenience is mistaken for a
description of how minds work. The chapter calls the singleton "a
grave impediment" *for psychology*, while admitting it is
indispensable for daily life.

---

## The ideas Section 5.4 actually carries

1. **Bodies enforce a singleton.** Two persons cannot occupy one
   place; plans must be made for a single body.
2. **Privacy and responsibility presuppose an individual.** Mary
   must remember to whom she told something; without individuality
   there is no sense of responsibility.
3. **Mental activity contends over shared agencies.** Two similar
   thoughts at once confuse, because the same agencies are asked to
   do different jobs.
4. **The stream-of-consciousness is a simplification for control.**
   We straighten the complicated mental scene to keep control; it
   then *seems* to flow as a single pipeline.
5. **For psychology, the single-agent image is "a grave impediment."**
   It diverts inquiry from the actual structure of mind.
6. **People can hold multiple beliefs, plans, and dispositions
   simultaneously.** Identity does not entail uniformity.

---

## What the implementation already absorbs

### One visible voice as operational singleton (ideas 1, 2)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
declare `agency.integration.conscious-presenter` as the only
producer of visible text. Forgejo issues, comments, and PRs each
receive *one* response per stimulus, attributable to one society.
This carries Minsky's "single body" practicality at the publication
layer.

### Per-stimulus concurrency prevents two thoughts at one location (idea 3)

The concurrency group in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
is `forgejo-society/<event>/<issue|pr|comment|ref|run_id>`. Two
parallel runs cannot operate on the same issue. The same agencies
are not asked to do two different jobs *for the same stimulus* at
the same time.

### Settlement gives one decision per stimulus (idea 2)

[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
specifies one `settlement_id` per `stimulus_id`. Responsibility for
an outcome is locatable: a settlement file under
`memory/decisions/<settlement_id>.yml`. The audit trail behaves
like Minsky's "Mary told Jack."

### Internal plurality is preserved (idea 6)

Inside any run, the deliberate loop
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
admits many agencies emitting many signals, candidate actions, and
objections. The settlement records multiple `proposals` and
`alternatives_considered`. The plan does not flatten internal
plurality to fit the external singleton.

### Self-model and tone as the held-together personality (ideas 1, 2)

`AGENTS.md`, `agency.identity.spock-self-model.md`, and
`agency.identity.tone-stabilizer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
deliver the predictability that responsibility needs. A reader can
trust that messages from this society will sound like this society.

### Straightening at the boundary, not at the centre (idea 4)

The plan straightens *for output*: the final response is a
simplified projection of the layered blackboard. The blackboard
itself remains layered
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
This is the right place for the simplification, not the wrong one.

---

## What the implementation does not yet take into account

### A — Cross-stimulus agency contention is unbounded

Idea 3 — two similar thoughts overlap because the same agencies are
asked to do different jobs — is not modelled across stimuli.
Concurrency groups isolate *one issue from another*; they do not
notice that `agency.code.implementer` may be active on Issue #42
and Issue #57 simultaneously, contending for the same notional
attention. The plan has no contention metric for agencies-across-
stimuli, no analogue of Minsky's "confused" state.

### B — No "responsible party" field in settlement

Settlement records who *contributed* (the `activated` and
`proposals` arrays in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
but does not record an external responsibility relation: "the human
maintainer is the owner of this settlement", "this society stands
behind this commit." Minsky's point is that responsibility *requires*
identity; the plan delivers the identity (one society, one voice)
without naming the responsibility relation explicitly.

### C — Stream-of-consciousness is not visibly labelled as simplification

The visible response straightens the blackboard, but does not say
so. A reader cannot tell from Spock's prose alone that the
narrative is a *control simplification* and that more material lies
in `state/`. The settlement file carries the fuller picture; the
*response* implies the singleton more strongly than it should.

### D — No "grave impediment" caveat surface

Minsky's framing — that the singleton is useful but, taken as
psychology, misleading — is structurally honoured (the runtime is
plural inside, singular at the boundary) but is nowhere stated as
guidance. Future maintainers, agencies, or downstream societies
that read the plan and the responses could mistake Spock for the
deciding entity. There is no narrative surface that explicitly
warns "the visible singleton is a publication convenience, not a
model of how this society thinks."

### E — Multiple simultaneous beliefs not represented per agency

Idea 6 — one person can hold incompatible beliefs simultaneously —
is mirrored at the *society* level by parallel proposals in a
settlement. It is not mirrored at the *agency* level: no agency
manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declares the right to hold mutually inconsistent positions in a
single handoff. The handoff schema's `claims:` array could carry
contradictions, but no rule names this as legitimate behaviour.

### F — User-model and dialogue continuity are shallow

`agency.identity.user-model-keeper` tracks user preferences and
prior dialogue context
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Minsky's privacy example ("Mary told Jack") requires per-recipient
memory: who has been told what. The current plan tracks user
preferences in aggregate; it does not yet differentiate "what this
society has told *to this audience*."

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Bodies enforce a singleton | Yes | Sole-presenter rule + one settlement per stimulus ([`03`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md), [`09`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)). |
| 2 | Privacy and responsibility presuppose an individual | Partial | One voice exists; "responsible party" not a field; per-recipient memory not modelled. |
| 3 | Mental activity contends over shared agencies | Per-stimulus only | Cross-stimulus contention is invisible ([`02`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)). |
| 4 | Stream-of-consciousness is a simplification | Structural | Done at output; not *named* as simplification. |
| 5 | Singleton is a grave impediment for psychology | Honoured at runtime | No narrative caveat anywhere in the plan. |
| 6 | Multiple beliefs simultaneously | Society-level yes | No agency-level licence to hold inconsistent positions. |

---

## Implication for the plan (no changes proposed here)

§5.4 reads, against the plan, as a description of where the
singleton is doing useful work and where it could quietly become
misleading. The plan installs the singleton exactly where Minsky
recommends — at the boundary — and refuses it at the centre. The
unfinished business is *legibility*: the plan does not yet label
the boundary singleton as a publication convenience, and it does
not yet track the cross-stimulus contention that Minsky names as
the cost of having shared cognitive parts. The risk is that readers
of Spock's prose, including future agencies, will treat the visible
unity as the underlying psychology.

This file records the gap; it does not propose changes. Per
[`AGENTS.md`](../../../AGENTS.md) §12, adding new schema fields,
authority levels, identifier scopes, or governance primitives
requires the maintainer's explicit direction. This analysis is
offered as a reading, not a request.
