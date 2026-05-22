# Section 23.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-23.4.md](som-23.4.md) — *The meanings of more*
(Minsky, §23.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§23.4 dissects the word *more* as an example of a symbol that does
many jobs at once. It must (a) summon the time-blink comparator from
§23.3, (b) attach to *some* dimension of comparison (more red, more
expensive — bare *more* is almost never used), (c) carry a learned
polarity that says which direction counts as *more* and which as
*less*, and (d) sometimes drive a search for an intermediate
standard ("a suitcase is bigger than the largest mouse but smaller
than the smallest elephant") to chain comparisons across distant
referents.

---

## The ideas Section 23.4 actually carries

1. **A polysemous symbol is a polyneme.** Each use of *more* engages
   a different adjective-agent; the word itself is the broadcast.
2. **The symbol summons the comparator.** *More* primes the
   time-blink mechanism of §23.3 — pronomes for the two compared
   things, then a difference read-out.
3. **A dimension modifier is required.** *Which one is more, an
   apple or a pear?* is incomplete; *more red* or *more expensive*
   is what people actually say. Context (already-shared focus) can
   supply the modifier implicitly.
4. **Polarity is learned, not given.** Taller=*more* and
   thinner=*less* are conventions a child acquires; some adjectives
   (red, triangular) have no natural polar opposite and so attach
   *more* via word-modification (*redder*, *more triangular*).
5. **Pair-words encode polarity.** *Large/small*, *thick/thin*,
   *fast/slow* are pre-computed polarity pairs; the lack of such a
   pair for *triangular* or *red* exposes which dimensions feel
   "naturally polar" to ordinary thought.
6. **Transitive comparison via intermediates.** When two things
   cannot be compared directly (mouse vs elephant under different
   size modifiers), the mind searches memory for an intermediate
   (suitcase) and chains.
7. **Concept-elaboration over a lifetime.** *More similar*, *more
   interesting*, *more difficult* are open-ended; *more* grows in
   power as more dimensions and chains accumulate.

---

## What the implementation already absorbs

### Polynemes as polysemous activators (idea 1)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines polynemes as exactly the broadcast activators Minsky asks
for: a single `symbol` whose match wakes a list of agencies with
weighted `excite` and `inhibit`. A future `comparative-more`
polyneme would slot into the same `phrase-polynemes.yml`
mechanism without inventing new vocabulary. The substrate is right;
the catalogue does not yet include comparatives.

### Implicit dimension via the current frame (idea 3)

§23.4's "if our focus of concern is already clear from the context"
maps cleanly onto the plan's `governing_frame` slot in the
settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and `frames.ts`'s frame selection
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
A `code-change` frame supplies a default dimension (correctness,
test pass-rate), a `security-sensitive` frame supplies another
(permission diff, blast radius). A comparative inside one of these
frames *would* be interpretable under the frame's default
dimension, even with the modifier omitted.

### Preferences as learned polarity (idea 4)

`memory/semantic/preferences.log` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
("written by `agency.identity.user-model-keeper` via `archivist`
when a preference is observed") is the natural home for learned
polarity. Preferences such as "the user prefers smaller diffs" or
"the user prefers explicit error handling" encode *more X is
better* / *less X is better*. The schema does not name polarity
explicitly, but the storage substrate exists.

### Chained reasoning through linked memory (idea 6)

The relational-memory protocol at
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
gives every durable record typed links (`supersedes`, `derived_from`,
`contradicts`, `cites`, `reinforces`, `analogous_to`,
`learned_from`). A reviewer or agency can in principle walk from
one record to another through these links, which is the substrate
Minsky's intermediate-standard search needs. The plan exposes the
graph; it does not yet exploit it for transitive comparison.

### Concept elaboration as memory growth (idea 7)

`memory/concepts/` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
("candidate abstractions awaiting governance") is the place where
new dimensions of comparison would accumulate. Each new concept is
a potential modifier for a future *more*. The pipeline for
promotion (any agency proposes; governance approves) is in place.

---

## What the implementation does not yet take into account

### A — No comparative polynemes

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)'s
`phrase-polynemes.yml` catalogue covers memory requests, safety
concerns, ownership questions, and `society <target>:` directives.
It has no entry for *more X*, *less X*, *bigger*, *safer*, *cheaper*,
*riskier*. A user request of the form "give me a smaller diff" or
"propose a safer change" does not fire any comparative-summoning
polyneme; it lands as ordinary text in the workspace.

### B — No comparator protocol behind *more*

Idea 2 wants *more* to summon the time-blink mechanism (see the
[§23.3 analysis](som-23.3-sor.md), gap A). The plan has no
*comparison* protocol at all in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/);
*more* therefore has no operational definition. A comparative-bearing
phrase that arrived today would be interpreted only as ordinary
prose by whichever agency happened to read it.

### C — Polarity is not represented as a first-class field

Idea 4 / 5 require some agency-readable marking that *small = less,
large = more* or *cheaper = better, more expensive = worse*. The
preference log in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
can hold these sentences, but the *schema* has no `dimension:` or
`polarity:` field; the records are freeform lines. A
`cost-critic` ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has the polarity *cheaper is better* baked into its prose body but
not exposed for reuse by other critics.

### D — No intermediate-standard search

Idea 6 is concrete: when two referents cannot be compared directly,
search memory for an intermediate that bridges them. The plan's
relational-memory protocol exposes the graph (gap-adjacent: chained
reasoning through linked memory, above) but no agency in the
first-ship catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
walks it for *comparison*. `agency.memory.prior-decision-resonator`
surfaces similar prior decisions; it does not chain across two
distant prior decisions to support a "more X than" claim.

### E — Dimensions discovered at runtime have no place to live

Idea 7 — *more similar*, *more interesting*, *more difficult* —
implies that the set of comparable dimensions grows over the life
of the society. `memory/concepts/` accepts new concepts, but there
is no companion `memory/dimensions/` or `memory/scales/` for the
*ordered* dimensions on which comparatives could operate. A new
adjective acquired today has no canonical place to record its
polarity, its unit, its natural opposite (or absence thereof),
or its associated frames.

---

## Summary table

| # | Idea from §23.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A polysemous symbol is a polyneme | Yes (substrate) | Polyneme schema fits; no comparative entries in the catalogue (gap A). |
| 2 | The symbol summons the comparator | No | No comparison protocol (gap B); ties to gap A of [§23.3 analysis](som-23.3-sor.md). |
| 3 | A dimension modifier is required | Partial | Frame supplies an implicit default; no explicit modifier field. |
| 4 | Polarity is learned | Partial | Preferences log exists; no polarity schema (gap C). |
| 5 | Pair-words encode polarity | No | No pre-computed polar pairs anywhere in the plan. |
| 6 | Transitive comparison via intermediates | No | Relational links exist; no agency searches them for bridging (gap D). |
| 7 | Concept-elaboration over a lifetime | Partial | `memory/concepts/` accepts new concepts; no dimensional registry (gap E). |

---

## Implication for the plan (no changes proposed here)

§23.4 is a worked example of the polyneme idea the plan already
absorbs at the substrate level. The shape of "what *more* needs"
maps cleanly: a phrase-polyneme entry, an implicit-modifier defaulted
from the frame, a polarity drawn from learned preferences, and a
walked path through relational memory for intermediates when needed.
The plan has every piece except the explicit comparator and a
dimensional registry.

The most natural single addition that §23.4 would invite — were a
change to be proposed, which it is not — would be a *comparison
protocol* alongside
[`02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
and
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
that names dimension, polarity, modifier, and (when needed)
bridging-intermediate as first-class fields, with a small set of
comparative phrase-polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
to summon it. The preference log in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
would then carry structured polarity rather than freeform sentences.

These observations are recorded here as analysis, not as a change
request. Any move to close them would fall under the "stop and ask"
rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
