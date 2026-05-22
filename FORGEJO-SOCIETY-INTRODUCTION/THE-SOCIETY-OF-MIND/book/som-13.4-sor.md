# Section 13.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.4.md](som-13.4.md) — *Children's Drawing-Frames* (Minsky, §13.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.4 continues the previous section's argument with three extra
notes. First, *not all agencies inside a child agree* that the
body-head drawing is satisfactory — only the agency currently in
control does. Second, the difference between immature and mature
drawing can be made by a *very small change to the procedure* —
"each feature in the list will be represented only once." Third,
that change presupposes a capacity (counting) that has to be
acquired separately.

---

## The ideas Section 13.4 actually carries

1. **A child is not a single agent.** Agencies inside disagree;
   what the procedure produces is what the *currently controlling*
   agency accepts.
2. **Small procedural rules cause large representational
   differences.** Adding "represent each feature only once" turns
   childish drawings into mature ones, without changing the feature
   list.
3. **There are alternative explanations.** Adding a `neck` to the
   feature list, or a `head above body` relation, would produce a
   similar mature result. The change can sit in the procedure, in
   the network, or in an added relation.
4. **Representational maturity depends on a separately acquired
   capacity** — here, the ability to count each item once.
5. **Progress is not always linear.** After mastering the
   body-head figure, children may *not* go on refining the figure;
   they go on to depict relationships between figures.

---

## What the implementation already absorbs

### Society-not-single-agent is the founding move (idea 1)

The whole catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
treats internal disagreement as normal: critics object, censors
block, and the settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
resolves disagreement explicitly. The conscious-presenter is the
single visible voice
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
matching the §13.4 observation that *what is produced* is what the
currently-controlling agency accepts.

### Small procedural changes are possible without schema changes (idea 2)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
let an agency's prompt body change without touching its manifest
schema or the frame. The differentiation-broker can edit a prompt
under `self-modification` governance. A small rule change is a
small file edit.

### Multiple paths to the same outcome (idea 3)

Three ways are open in the plan: edit the procedure (an agency's
prompt), add a slot to the frame (a new required filler), or add a
relation through critics (a new objection condition). All three
correspond to Minsky's three remedies for the body-head error.

### Different ambition over time (idea 5)

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records changes to the society's behaviour over time, and the
differentiation- and retirement-brokers
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
allow the society's focus to shift across families. The capacity
to shift ambition exists.

---

## What the implementation does not yet take into account

### A — Internal disagreement is settled, not preserved

The settlement layer collapses objections into a decision and an
outcome. It does not preserve *which agencies remained
dissatisfied* in a form a later run could see. §13.4's observation
— that the agencies that *would* be terrified by the body-head
creature are still inside the child — has no direct counterpart;
once a settlement closes, the dissenting positions live only in the
raw `objections.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
not as durable internal disagreement.

### B — Small procedural rule changes are not versioned as such

When an agency's prompt is edited under self-modification, the git
diff captures the byte-level change but
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
does not require the settlement to record the *rule* the change
introduces or removes. "Represent each feature only once" would
appear as a wording diff, not as a named rule with a name a later
audit could look up.

### C — Capacity prerequisites are not declared

§13.4's point that mature representation *requires the ability to
count* has no schema in the plan. Agency manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declare `authority`, `activates_on`, `outputs`, `budget`. They do
not declare *prerequisite capacities*. If a new critic depends on
an upstream agency producing a particular index, the dependency is
implicit in the prompts.

### D — No metric for "mature vs immature" output

The plan has no scalar or evaluator for representational maturity
under a frame. A mature `code-change` and an immature one both
close as long as required slots are filled and no failure
condition is hit. The forgetting-critic and the integration family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
can object, but there is no graded ladder.

### E — Ambition shift is not represented as a developmental stage

§13.4's note that children stop refining figures and start drawing
*relationships* between figures has no analogue in the plan: there
is no "the society has now mastered intake and has moved on to
inter-stimulus integration" record. The reinforcement and
retirement logs note individual changes; they do not group them
into stages.

---

## Summary table

| # | Idea from §13.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A mind contains disagreeing agencies | Yes | Critics, censors, settlement — but dissent not durably preserved (gap A). |
| 2 | Small procedural rules → large output differences | Yes | Prompt edits under self-modification; rules not named (gap B). |
| 3 | Same effect via procedure, slot, or relation | Yes | All three editing surfaces exist. |
| 4 | Mature representation needs separately acquired capacity | No | Agency manifests do not declare prerequisite capacities (gap C). |
| 5 | Developmental progress is not linear | Partial | Reinforcement and retirement logs exist; no stage representation (gap E). |

---

## Implication for the plan (no changes proposed here)

§13.4 reminds the plan that the visible answer reflects the
currently-controlling agency rather than internal consensus, and
that maturity often arrives as a small procedural rule that sits on
top of a separately-acquired capacity. The implementation has the
disagreement machinery and the procedure-editing path, but does not
preserve dissent past settlement, does not name the rules that
small edits introduce, and does not declare capacity prerequisites.
Closing these would touch the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
the agency manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the evolution log in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
