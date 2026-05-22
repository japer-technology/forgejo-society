# Section 3.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.3.md](som-3.3.md) — *Hierarchies* (Minsky, §3.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§3.3 is the section in which Minsky names the *bureaucratic* character
of an agent society: Builder does no physical work, only switches Begin,
Add and End; Add only orders Find, Put and Get; the chain descends
through many layers before any muscle moves. The section asks who
chooses which agents do which jobs, who decides which jobs are done at
all, who decides what effort to expend, and how conflicts are settled —
and then warns that the analogy with human supervisors cannot be pushed
far, because relations are not strictly hierarchical and roles are
relative. This file inventories those ideas and checks each against the
implementation plan.

---

## The ideas Section 3.3 actually carries

Pulled from Minsky's text:

1. **Layered control.** Between the top-level executive agent and the
   muscle-motor primitives there are many layers. Most agents in a
   working society do no physical work; they switch other agents on
   and off.
2. **Administrative work is real work.** An agent that produces no
   visible output is not therefore unimportant. Control of other
   agents is a load-bearing job.
3. **Four design questions for any society.** Who assigns which
   agents to which jobs? Who decides which jobs are done at all? Who
   decides what efforts to expend? How are conflicts settled?
4. **Builder is not a human supervisor.** Builder does not choose its
   subordinates (the assignment is pre-arranged), does not plan its
   future work (it follows fixed steps), and has no repertoire for
   unexpected accidents. The mental supervisor analogy must not be
   pushed beyond these limits.
5. **Relations are not strictly hierarchical.** Roles are relative:
   the same agent (Add) is subordinate to one neighbour (Builder)
   and boss to another (Find). A society does not reduce to a tree.
6. **The reflexive turn.** The section closes by turning the same
   question on the reader: which sort of thoughts concern you most —
   the orders you are made to take, or those you are forced to give?
   Awareness of one's own role-position across the hierarchy is part
   of what the section is about.

These six items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Layered control (idea 1)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is itself a hierarchy of phases — `perceive → activate → deliberate →
criticize → censor → settle → act → remember → report` — and within
the `deliberate` phase the assembly family compresses upward in
explicit tiers: `agency.assembly.summary-tier-1` aggregates raw
signals into per-family summaries, `agency.assembly.summary-tier-2`
compresses family summaries into a settlement-ready brief, and
`agency.integration.conscious-presenter` produces the single visible
response
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
That is the Builder shape — many quiet layers between the work and
the visible output.

### Administrative work as real work (idea 2)

Critics emit objections only and never act; censors mechanically alter
the tool surface without producing user-visible text; suppressors
gate candidate outputs at the effect boundary; the
`agency.integration.archivist` promotes settled material from `state/`
to `memory/`; the `agency.meta-admin.ecology-monitor` runs scheduled
review. None of these produce the final response, yet they are
first-class manifests with `id`, `authority`, `budget`, and
`activates_on`, exactly like producing agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
The plan does not treat control as decoration.

### Three of the four design questions (idea 3, partial)

| Minsky's question | Plan's answer | Where |
| --- | --- | --- |
| Who assigns agents to jobs? | Frames + polynemes + `activates_on` matching | [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md), [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) |
| Who decides which jobs are done at all? | Frame selection + activation / inhibition | [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md), [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| How are conflicts settled? | Settlement layer + authority registry + approval gate | [`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md), [`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) |

The fourth question (effort) is only partially answered; see gap C.

### Builder is not a human supervisor (idea 4)

The plan honours Minsky's warning. No agency at runtime chooses which
other agencies to assign for the current stimulus: assignment is
pre-arranged by frames and polynemes, not negotiated. No agency
maintains a plan-of-future-work that survives a cycle. The workflow
phases follow a fixed order specified in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
not a runtime-chosen one. The voice rules in
[AGENTS.md](../../../AGENTS.md) keep the prose from sliding into
"executive" or "manager" metaphors. The plan is, by construction,
Builder-like and not boss-like.

### Non-strict hierarchy (idea 5, partial)

Signals carry `suggested_effects.excite` and `suggested_effects.inhibit`
across family boundaries
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
so a perception agency can inhibit a code agency, a safety agency can
excite a memory agency, and so on. The `inhibits:` field in the
manifest schema is also unrestricted by family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The runtime graph is therefore not a tree even though the pipeline is.
The plan absorbs the shape; it does not yet *display* it (see gap E).

### Limits of the analogy (idea 4, continued)

The plan treats every agency as a Markdown file with a small prompt
body and a tightly-scoped manifest, not as a person with a desk.
There is no "promotion", no "delegation memo", no role drift. This is
the same discipline as §1.1's "mind from mindless stuff" and is the
operational form of Minsky's caution.

---

## What the implementation does not yet take into account

These are the §3.3 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — Hierarchical depth is shallow

Minsky's Builder example has at least four levels (Builder → Add →
Find / Put / Get → Move / Grasp → muscle-motor agents). The plan has
roughly two cognitive levels in `deliberate` — raw agencies, then
`assembly.summary-tier-1`, then `assembly.summary-tier-2`, then the
`conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— and the families do not nest inside each other. There is no notion
of a deep call-chain in which one agency's job is to switch on three
others which each switch on three more. Builder-depth is not
represented.

### B — No agent-issued sub-call (Builder's "turns on Begin, Add, End")

In §3.3, Builder's behaviour is precisely *to switch its three
subordinates on in order*. The plan's agencies do not switch each
other on in order. They emit signals; activation is computed by the
runtime from those signals
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Activate" phase). There is no manifest field of the form
`calls_in_order: [<agent-id>, <agent-id>, …]`, and no scripted
sub-routine. The "Builder turns on Begin, then Add, then End" pattern
— ordered invocation of subordinates by a parent agent — is not a
first-class shape.

### C — Effort is mostly static

Minsky's third design question asks who decides what efforts to expend.
The plan's budgets are declared in the manifest as
`budget.max_tool_calls` and `budget.max_wall_clock_s`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
and initial per-stimulus budgets are written into
`state/runs/<run>/stimulus.json` by the `normalize` step
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)).
The `agency.perception.urgency-detector` exists. But no agency *decides*
at runtime to spend more effort on this stimulus than on the next, and
no agency has authority to top up another agency's budget. Effort
allocation is a configuration concern, not a cognitive one.

### D — No repertoire for "unexpected accidents"

Minsky flags this explicitly as a limit of the Builder design.
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
specify *blocked* settlements when something fails, plus owner
briefings when human approval is needed, but there is no agency whose
job is to *recover* from a downstream failure within the same
cycle — no fallback path-finder, no contingency planner. The
`agency.code.revert-path-finder` covers a different question (how to
undo a successful action), not in-flight accident recovery. This is a
chosen absence consistent with Minsky's own warning; it is recorded
here because §3.3 names it directly.

### E — Relative roles are not surfaced

The runtime *supports* non-tree relations (gap E from idea 5 above is
absorbed structurally), but no document or settlement field shows that
`agency.X` is excited by `agency.Y` while inhibiting `agency.Z`, i.e.
that X is "subordinate to Y" and "boss to Z" for this stimulus. The
settlement record includes `activated:` per-agency weights
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
but not the relational graph of who-excited-whom. A reviewer cannot
ask "for stimulus S, what was the effective hierarchy?" and get an
answer that respects Minsky's relativity-of-roles point.

### F — The reflexive question has no operational form

§3.3 closes by asking the reader which they notice more: the orders
they take, or the orders they give. The plan has an introspection
protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
and a settlement that records `unknowns` and `blind_spots`, but no
agency reports on its own role-position — whether on this cycle it
was mostly excited by others, mostly inhibiting others, or
predominantly assembling. The relational self-view that §3.3's last
paragraph invites is not represented.

### G — "Who assigns jobs?" answered implicitly, not named

Minsky's first design question is *who chooses which agents do what
jobs*. The plan's answer is "frames and polynemes and the
`activates_on` clause of each manifest". This is a *rule-based*
assignment system rather than a *designated assigning agent*. No
agency has the kind `assigner`; no manifest field names the
authority-for-assignment. The function exists; the explicit owner
does not. This is closely related to gap B but distinct: B is about
ordered sub-invocation, G is about the institutional place where
assignment is *attributed*.

---

## Summary table

| # | Idea from §3.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Layered control | Partial | Pipeline phases + assembly tiers exist; hierarchical depth shallow (gap A). |
| 2 | Administrative work is real work | Yes | Critics, censors, suppressors, archivist, ecology-monitor share first-class manifest with producers. |
| 3a | Who assigns jobs? | Partial | Frames + polynemes + `activates_on`; no designated assigner agent (gap G). |
| 3b | Who decides which jobs run? | Yes | Frame selection + activation / inhibition pass. |
| 3c | Who decides effort? | Partial | Budgets are static manifest fields; no runtime effort-allocation agency (gap C). |
| 3d | How are conflicts settled? | Yes | Settlement layer + authority registry + approval gate. |
| 4a | Builder is not a human supervisor | Yes | Assignment pre-arranged; no runtime planning; voice rules forbid the metaphor. |
| 4b | No repertoire for unexpected accidents | No (by acknowledged design) | Blocked-settlement path exists; in-cycle recovery agency does not (gap D). |
| 5 | Relations not strictly hierarchical | Partial | Cross-family excite / inhibit supported; relational graph not surfaced in settlement (gap E). |
| 6 | The reflexive turn (orders given vs taken) | No | No agency reports on its own role-position; introspection protocol covers unknowns, not relational self-view (gap F). |
| — | Builder's ordered sub-invocation pattern | No | No `calls_in_order:` field; activation, not scripted invocation (gap B). |

---

## Implication for the plan (no changes proposed here)

§3.3's load-bearing point — that most of a working society is quiet
administrative work — is honoured by the plan: critics, censors,
suppressors, the assembly tiers and the meta-admin family are
first-class manifests with budgets and authority. Three of Minsky's
four design questions are answered cleanly, and the plan correctly
refuses the human-supervisor metaphor that §3.3 itself warns against.

The remaining gaps are recognisable as Minsky's own limits. Builder's
depth (gap A), Builder's ordered sub-call pattern (gap B), runtime
effort allocation (gap C), and the absence of an accident-recovery
repertoire (gap D) are exactly the four points the section flags when
it says the analogy with human supervisors must not be pushed too far.
The most distinctive unforced opportunity is the relational
self-view: surfacing per-stimulus excite / inhibit relations in the
settlement (gap E) would give the plan an operational handle on
Minsky's "roles are relative" remark, and recording each agency's
role-position would give §3.3's reflexive question (gap F) somewhere
to land. Gap G is documentary: naming the assigner function — even if
it remains "frames and polynemes" rather than an agency — would close
Minsky's first design question explicitly rather than implicitly.

These are recorded here as analysis, not as a change request. Any move
to close them would touch the manifest schema and the assembly /
meta-admin families in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the activation pass in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
