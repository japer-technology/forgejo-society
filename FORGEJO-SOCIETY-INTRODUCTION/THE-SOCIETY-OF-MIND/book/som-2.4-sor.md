# Section 2.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.4.md](som-2.4.md) — *Holes and parts*
(Minsky, §2.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§2.4 is a short, load-bearing section: it dismantles the Holist's
mistake of looking for a whole's property *inside* a single part. A
box has no "mousetightness" in any one board; containment is in *how
the boards are arranged*. By the same move, "life" and "mind" name
phenomena that live in the *combination of relationships* between
parts, not in the parts themselves. Mystery dissolves precisely when
those relationships are understood.

This analysis distils the ideas the section carries and checks each
against the implementation plan.

---

## The ideas Section 2.4 actually carries

Pulled from Minsky's text:

1. **The Holist's fallacy.** Searching for a whole's property *inside*
   a single part, and concluding the property cannot exist when no
   part holds it, is a category error.
2. **Containment is arrangement, not substance.** No board contains
   "containment"; the box contains because the boards are *arranged
   to prevent motion in all directions*. Each board bars escape in
   one direction; the property is the conjunction.
3. **A whole-property is a combination of relationships.** Like the
   cards of a straight flush, "only the full hand has any value at
   all". Partial hands have no fractional value.
4. **Words for wholes mis-applied to parts mislead.** "Life" and
   "mind" were invented to describe how larger assemblies interact;
   using them at the smallest scale produces nonsense.
5. **Mystery dissolves as interactions become legible.** Life lost
   most of its mystery for biologists once the chemistry of cells was
   understood; mind retains its mystery only because we still do not
   know how mental agents interact.

These five items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### The Holist's fallacy is structurally refused (idea 1)

No single file in the plan claims to *be* the mind. The collapse rule
in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
states that every cognitive structure must collapse to either a file
under `.forgejo-society/` or a step in the workflow. An agency
manifest is a worker, not a mind in miniature; a critic is a check,
not a conscience; a censor is a gate, not a will. The "mind" referred
to throughout the plan is the *folder plus the workflow*, never a
component of either.

The voice rules in [AGENTS.md](../../../AGENTS.md) reinforce this on
the prose surface: the banned terms ("AGI", "AI brain", "autonomous
developer") are precisely the words that would invite the reader to
look for mind *inside* a single part.

### Containment is arrangement (idea 2)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is the operational form of "boards arranged to prevent motion in all
directions". Each phase blocks an escape route:

- `guard` blocks unauthorised stimulus;
- `perceive` blocks unframed input;
- `activate` blocks ungrounded agency wake-up (no evidence, no trust);
- `criticize` blocks unwitnessed candidates;
- `censor` blocks danger-zone tool grants
  ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md));
- `settle` blocks dispersed conclusions by requiring one record;
- `act` blocks unapproved effects via the approval gate;
- `remember` blocks unsettled material from reaching `memory/`
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).

No phase contains "safety" or "judgement" by itself. Safety is the
arrangement. The layered safety model in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("kill switch / guardrails / authority / censors / approval gate /
suppressors / candidate-future branches / reversion") is explicit
about this: each layer blocks one direction; safety is their
conjunction.

### The straight-flush principle (idea 3)

The settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is where "only the full hand has any value". A frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
declares required slots and `failure_conditions`; the `code-change`
frame, for example, requires `user_goal`, `relevant_files`,
`proposed_patch`, `tests`, `risks`, `final_user_response`. A
settlement is not valid as a fractional hand. The handoff and signal
schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
also encode this: a signal without `evidence` is rejected ("no
evidence, no trust"), and a handoff is a structured return, not a
free-form contribution.

### Words for wholes are kept at the right scale (idea 4)

The plan's vocabulary discipline keeps whole-words at the whole-scale.
"Mind" appears in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
only as *"The folder is the mind"* — i.e. the assembly, not any file.
Agency families in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are named at the right grain (`perception`, `memory`, `code`,
`safety`, `identity`, `integration`, `assembly`, `meta-admin`), and
individual workers carry small, mechanical names (`intake-bee`,
`kline-retriever`, `ambiguity-detector`) that do not borrow the
vocabulary of the whole.

### Mystery dissolves through legible interactions (idea 5)

The `state/` tree in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is the operational form of Minsky's "we now know how chemicals in
cells interact". Every cycle leaves an append-only trace —
`percepts.jsonl`, `activation.jsonl`, `signals.jsonl`,
`objections.jsonl`, `candidate-actions.jsonl`, `final.md`,
`diff-summary.md`, the settlement YAML — committed to Git. The
cognitive observability requirement in
`THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md`,
mapped at row 9 of
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
makes the *interactions between agents* the unit of inspection. To
the extent that the plan dissolves mystery, it dissolves it the way
Minsky asks: by making the relationships legible.

---

## What the implementation does not yet take into account

These are the §2.4 ideas that the plan currently leaves implicit,
partial, or absent.

### A — The "no whole-property in a part" rule is enacted, not stated

Idea 1 is enforced in practice (collapse rule, voice rules, manifest
discipline) but the plan does not contain a paragraph that *names*
the Holist's fallacy and forbids it as a design move. A reviewer who
proposed an "agency that decides" or a "critic of overall quality"
would have to be refused on the basis of taste, not citation. There
is no anchor in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
that says, in §2.4's own terms, "whole-properties are arrangements
and may not be assigned to a single agent".

### B — Settlement does not yet require a quorum of contributing parts

Idea 3 ("only the full hand has any value") is honoured at the *slot*
level — required slots in a frame must be filled — but not at the
*contributing-agency* level. A settlement that fills the slots from
fewer agencies than the frame expects (for example, one
`code-family` worker filling all slots) is not currently flagged.
The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
lists `slots.filled_by` agents but does not require *at least N
distinct fillers* or *at least one of each named family*. The
"straight flush" check is, at present, structural rather than social.

### C — No "emergence index" inverse of the agency catalogue

The catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
lists agents and what they do. There is no inverse document of the
form *"property P (e.g. mousetightness, refusal, comprehension) is
produced by the combination of agents {A, B, C} in arrangement R"*.
Without this, a reader cannot trace a whole-property back to the
relationships that make it. The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
indexes specification → implementation, not whole-property →
arrangement. Closing this would be a single new document; nothing
in the runtime would change.

### D — Integration / identity names sit close to the whole-word line

Idea 4 asks that words for wholes not be applied to parts. The plan
mostly holds the line, but a few names — `agency.integration.conscious-presenter`
and `agencies/identity/spock-self-model.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)) —
borrow whole-scale vocabulary ("conscious", "self") for a single
file. Their role is narrowly mechanical (sole producer of visible
text; one self-description), but their *names* read as if the
whole-property lives there. §2.4 would prefer narrower names
(`agency.integration.final-presenter`, `identity/society-self-model.md`),
or an explicit note next to each saying that the name describes a
*function in the arrangement*, not a property of the file.

### E — No standing reminder that mystery is dissolved by interaction, not by introspection

Idea 5 says mystery yields to legible interactions between parts. The
plan dissolves mystery on the per-run axis (the `state/` trace) and
on the per-decision axis (settlements, governance log). It does not
yet have an artefact that surfaces *cross-run interaction patterns*
— for example, "agency A and critic B co-fire 73% of the time in
the `code-change` frame, and their disagreement predicts
`final_user_response` rewrites". The credit-assignment log
([`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
mapped via `evolution/reinforcement-log.md`) is the closest, but it
records *credit*, not *relationship structure*. §2.4 would value the
relationship structure as the thing that, made legible, retires the
mystery.

### F — The Holist as a named anti-pattern is absent

`THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md` is the file
where this would live, and is referenced from the mapping table as
"cited by `agencies/meta-admin/*`"
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)).
The Holist's move — assuming a property must live *in* a part — is
not currently among the named anti-patterns. As long as it is not
named, it can be repeated in good faith by a future agency author.

---

## Summary table

| # | Idea from §2.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The Holist's fallacy is a category error | Partial | Enforced by collapse rule and voice rules; not stated as a design rule (gap A); not named as an anti-pattern (gap F). |
| 2 | Containment is arrangement, not substance | Yes | Pipeline phases and layered safety model are the arrangement. |
| 3 | A whole-property is a full-hand combination | Partial | Slot-level "full hand" enforced by frames; no quorum across contributing agencies (gap B). |
| 4 | Words for wholes mis-applied to parts mislead | Partial | Vocabulary discipline mostly holds; a few integration/identity names sit close to the line (gap D). |
| 5 | Mystery dissolves through legible interactions | Partial | Per-run trace and observability strong; cross-run interaction structure not yet surfaced (gap E); no inverse index from whole-property to arrangement (gap C). |

---

## Implication for the plan (no changes proposed here)

§2.4 is the section that justifies the whole shape of
`.forgejo-society/`: the reason there is a folder of small files and
a workflow of small phases is precisely that mind is the arrangement,
not any part. The plan honours this in its structure — collapse rule,
phased pipeline, layered safety, settlement quorum at the slot level,
append-only state trace — and in its voice discipline. The gaps are
not structural failures; they are unspoken commitments.

The cleanest unforced additions §2.4 suggests, recorded here only as
analysis, would be: a one-paragraph statement of the Holist's
fallacy in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
(closing gap A); an entry for it in
`THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md` (closing
gap F); an inverse "whole-property → arrangement" index alongside
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
(closing gap C); and, in time, a cross-run interaction report under
`memory/` or `evolution/` (closing gap E).

These are recorded here as analysis, not as a change request. Any
move to close them would touch
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
and the anti-patterns and credit-assignment files in
[`THE-SOCIETY-OF-REPO/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
