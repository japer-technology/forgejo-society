# Section 2.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.6.md](som-2.6.md) — *Are people machines?*
(Minsky, §2.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§2.6 is a short, almost rhetorical section, but it carries a precise
disciplinary load. Minsky rejects two equally bad moves: dismissing the
machine framing because *machine* once meant pulleys and locomotives,
and accepting the framing only in its 1940s sense. The lesson for any
implementation is that what counts as a *mechanism* must be allowed to
include very large composite arrangements, and that introspective
disbelief is not evidence.

---

## The ideas Section 2.6 actually carries

Pulled from Minsky's text:

1. **Using a mind is not understanding a mind.** "I drive my car,
   therefore I know how its engine works" is the form of the mistake.
   First-person familiarity with thought confers no authority over
   the mechanism of thought.
2. **The word *machine* is dated.** Centuries of *pulleys, levers,
   locomotives, typewriters* have loaded the word with pettiness.
   Using that loaded sense to dismiss the question is rhetoric, not
   argument.
3. **Scale changes what is possible.** A 1940s computer had thousands
   of parts; today's have millions; a brain has billions, each
   connected to thousands of others. Composition at scale produces
   capacities that the parts do not individually exhibit.
4. **We are in the early era of machines.** The Mars-visitor-a-
   billion-years-ago analogy: judging the fate of machines by the
   current generation is judging earthly life from pre-Cambrian
   sludge. Treat the catalogue as provisional.
5. **Defer rhetoric; describe mechanism.** Self-respect comes from
   understanding what kind of machine one is, not from denying that
   one is a machine.
6. **The explanation must be mechanistic without being trivialising.**
   "Mind from mindless stuff" (§1.1) is preserved, but the parts may
   be large, composite, and connected at scales the word *machine*
   does not connote.

These six items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Mechanism without anthropomorphism (ideas 1, 5)

The plan refuses both halves of the bad move. On one side,
[AGENTS.md](../../../AGENTS.md) §4 bans "AGI", "AI brain",
"autonomous developer" and anthropomorphic flourishes — the prose may
not claim inner life. On the other side,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
describe everything as named files and named workflow phases. There
is no place where the system's *self-report* substitutes for its
*mechanism*: the introspection that exists
([`02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
emits structured `unknowns` and `blind_spots` slots into the
settlement, not first-person testimony about how the society works.
Minsky's driver/engine warning is honoured.

### Mind from mindless parts at workable scale (ideas 3, 6)

The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file under
`.forgejo-society/` or a step in the workflow") and the first-ship
catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
give the society *many* small parts — perception, memory, code,
safety, identity, integration, assembly, meta-admin families — each
of which is a Markdown manifest with no claim to inner life. The
runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
composes them into perceive / activate / deliberate / criticize /
censor / settle / act / remember / report. This is the operational
form of "billions of cells, each connected to thousands of others",
compressed to a tractable count but with the same compositional
shape.

### Composition is the source of capacity (idea 3)

The settlement layer
([`07-workspace/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/)
and
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
`settle` phase) and the conscious bottleneck
(`agency.integration.conscious-presenter` as the sole producer of
visible text) are explicit declarations that the society's visible
behaviour is *composed*, not located in any single agency. No agent
"thinks"; the workflow run thinks. This is the §2.6 point about
scale and connection, rendered as engineering.

### Provisional vocabulary, planned evolution (idea 4)

The plan treats its first-ship catalogue as a *first* catalogue, not
a final one. The `self-modification` frame and the meta-admin agencies
`agency.meta-admin.differentiation-broker` and
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
are the structural acknowledgement that what is shipped today is the
pre-Cambrian sludge of this society — to be revised under governance,
not frozen. The evolution log
(`evolution/reinforcement-log.md`,
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records that revision history.

---

## What the implementation does not yet take into account

These are the §2.6 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — No explicit statement that introspection is not evidence

Minsky's strongest move in §2.6 is the driver/engine reversal: the
system's first-person familiarity with itself confers no authority
over its own mechanism. The plan has the *mechanism* for principled
introspection (the `unknowns` / `blind_spots` slots in the settlement,
the introspection protocol), but it does not anywhere *state* that
self-report from the conscious presenter is not authoritative
testimony about how the society works. A reader could read
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)'s
"Conscious bottleneck" section and infer the opposite — that what
Spock says about the society *is* the society's account of itself.
A one-paragraph note in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
recording that the presenter's voice is not a privileged epistemic
channel into the runtime would close this.

### B — Scale assumptions are not declared

Idea 3 turns on numbers: thousands of parts, millions, billions. The
plan has no declared scale envelope. How many agencies does the
first-ship catalogue contain? Around two dozen. How many is the plan
prepared to compose at runtime — ten, a hundred, a thousand? The
budget primitives in the manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
constrain per-agent cost, but there is no document that says "this
runtime is designed for *N* agencies, with composition at *M*
co-active per stimulus." Minsky's §2.6 point is that capacity changes
with scale; the plan should at least record the scale it is currently
designed for, so that future revisions can be compared against a
baseline.

### C — Provisionality of the first-ship catalogue is not stated as such

Idea 4 — the Mars-visitor analogy — implies that today's machine
catalogue is *the wrong reference class* for judging what the system
will eventually look like. The plan ships a catalogue and ships the
machinery to revise it, but it does not anywhere say "this catalogue
is provisional; the eventual ecology will not resemble it." The
omission is small but matters: a reviewer encountering the first-ship
catalogue may treat it as the design, rather than as the seed of one.
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
already lists deferred items; a sibling paragraph on the provisional
status of the catalogue would carry the §2.6 point.

### D — "Machine" is used in its loaded sense in places

The plan generally avoids the word *machine*, but where it does
appear — in inherited phrasing, in references to "the runtime",
"the workflow", "the body" — it inherits the connotations Minsky
warned about. There is no glossary entry that distinguishes the
*Forgejo Society* sense of mechanism (composite, layered, governed,
file-defined) from the 1940s sense (small, deterministic, petty).
The promotion style guide
([`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md))
gives voice rules but does not give a positive definition of
*mechanism* as the project uses it. The repository
[`GLOSSARY.md`](../../../GLOSSARY.md) would be the right place.

### E — No representation of "early era" — no archive of prior shapes

Idea 4 also implies a *time depth* to the catalogue: that this is one
slice of a longer history of forms. The plan's evolution surface
(`evolution/reinforcement-log.md`, `evolution/ecology-review.md`,
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records *changes* but does not curate a *museum* of retired shapes.
The retirement-broker removes agencies; the git log preserves their
text; but there is no living document — under `memory/concepts/` or
similar — that says "these are the shapes we used to have, and these
are the reasons we no longer do." Without such a document, the
society loses the §2.6 lesson that today's catalogue is a moment, not
a destination.

### F — Self-respect through mechanism is asserted, not surfaced

Idea 5 — that respect for what one is comes from understanding the
mechanism, not from denying the framing — is honoured implicitly by
the whole plan (mechanism is exhaustively documented; denial is
rejected), but it is not surfaced as a *stated value*. The
[`README.md`](../../../README.md) and the introduction essays in
[`FORGEJO-SOCIETY-INTRODUCTION/essay/`](../../../FORGEJO-SOCIETY-INTRODUCTION/essay/)
carry the voice; the implementation plan itself does not. A reviewer
who reads only the implementation files learns *what* the society is
made of, not *why* that mechanistic description is itself the form of
seriousness Minsky asks for. This is a documentation gap, not a
structural one.

---

## Summary table

| # | Idea from §2.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Using a mind is not understanding a mind | Partial | Mechanism exhaustively documented; self-report not stated as non-authoritative (gap A). |
| 2 | The word *machine* is dated | Partial | Voice rules forbid the loaded sense; no positive definition of mechanism exists (gap D). |
| 3 | Scale changes what is possible | Partial | Composition is real; scale envelope is not declared (gap B). |
| 4 | We are in the early era of machines | Partial | Self-modification frame exists; catalogue's provisional status not stated (gap C); no museum of retired shapes (gap E). |
| 5 | Defer rhetoric; describe mechanism | Yes | The entire plan is mechanism; the *reason* this is the form of respect is not surfaced (gap F). |
| 6 | Mechanism without trivialising | Yes | Collapse rule, manifest schema, settlement layer, conscious bottleneck. |

---

## Implication for the plan (no changes proposed here)

§2.6 is a disciplinary section: it does not introduce new structures
but tells the reader how to read the structures that follow. The
implementation plan honours the disciplinary core — refusing
anthropomorphism on one side and refusing trivialised "machine"
language on the other — and gives the mechanism in detail.

The remaining gaps are all *legibility* gaps. Mechanism is present;
the meta-statements that frame it in Minsky's §2.6 terms are not.
The biggest unforced opportunity is gap A: stating, somewhere visible,
that the conscious presenter's voice is not an epistemic channel into
the runtime. The next is gap C: stating that the first-ship catalogue
is a seed, not a design. Gaps B, D, E, and F are smaller and could
be absorbed into existing documents
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
[`GLOSSARY.md`](../../../GLOSSARY.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).

These are recorded here as analysis, not as a change request. Any move
to close them would touch the overview, the glossary, the
state-and-memory document, and possibly the style guide
([`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md)),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
