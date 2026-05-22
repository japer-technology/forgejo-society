# Section 12.12 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.12.md](som-12.12.md) — *Meaning and definition*
(Minsky, §12.12).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.12 takes *game* as its test case. A structural definition (two
teams, a ball, a score) fails on word games or single-player
games. A psychological definition (engaging, diverting, detached
from real life) generalises but feels weightless. The resolution
is that even the structural definition was always partly
psychological (*competing*, *winning*), and that meanings of useful
words usually combine the two kinds.

---

## The ideas Section 12.12 actually carries

1. **A definition does not always give a way to use a word.**
2. **No single structural definition covers all of a useful
   word's instances.** *Game* over-fits and under-fits.
3. **A psychological / process-oriented definition can succeed
   where structural fails.** "Engaging activity, deliberately
   detached from real life."
4. **Most definitions are already partly psychological.** "Score"
   and "competing" carry mental load.
5. **Most ideas lie between purely physical and purely
   psychological.** *Chair* sits there explicitly.
6. **The structural / psychological mix depends on the word.**
   *Brick* leans physical; *game* leans psychological; *chair*
   in between.

---

## What the implementation already absorbs

### Two-sided manifests (idea 4)

Every agency manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
carries structural fields (`id`, `kind`, `tools`, `outputs`,
`budget`) *and* a prose body that becomes the prompt — that is,
a process-oriented description of what the agency *does*. The
mix is the manifest's design, not a coincidence.

### Process-oriented definitions for cognitive units (idea 3)

Frames
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are defined by what they *do* in the loop — which agencies they
activate, which slots they require, which critics and censors
they prefer — not by static structural patterns. A frame is
closer to "engaging activity detached from real life" than to
"thing with legs, back, seat".

### Mix varies by family (idea 6)

Censors
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
lean *structural* (they fire on path globs, regex matches,
keyword sets). Agencies in the integration family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
lean *psychological* (`agency.integration.conscious-presenter`
is defined entirely by what it produces and the tone it
maintains). The catalogue spans the spectrum.

### Functional definition at the surface (idea 1)

`AGENTS.md` and `agencies/identity/spock-self-model.md`
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md))
define Spock's identity in functional terms — voice, refusal
rules, what to ask before acting — not in structural ones.

---

## What the implementation does not yet take into account

### A — No declared "definition kind" on cognitive units

The plan happens to mix structural and psychological definitions
across its catalogue, but no manifest, frame, or memory record
declares which kind it is. A reviewer cannot ask "which agencies
have purely structural definitions?" and find an answer.

### B — Words / concepts lack the two-sided schema

`memory/concepts/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds concept candidates. The schema does not require both a
structural definition and a psychological / functional one. §12.12
makes the joint requirement load-bearing for words like *game*.
The plan does not enforce it.

### C — Definitions are not tested against their instances

§12.12's whole method is to *check* a definition against the
range of instances it should cover. The plan does not run an
analogous check: a frame can be added without a sample set of
matching stimuli, and a concept can be promoted without
demonstrating its coverage breadth.

### D — Psychological vocabulary is restricted by repo voice

The repository's voice rules ([AGENTS.md](../../../AGENTS.md)
§4) forbid anthropomorphic flourishes. This is correct for the
*public voice*, but means that psychological definitions inside
the runtime have to be phrased carefully. §12.12's vocabulary
(*engaging*, *diverting*, *detached from real life*) is not
naturally available. The plan has no equivalent neutral lexicon
for psychological-side definitions.

### E — No "mostly-overlap, partial-exception" definition shape

A useful definition per §12.12 covers most cases and leans on
exceptions for the rest (cf. [som-12.9](som-12.9.md)). The plan
allows partial coverage but has no schema slot for "typical
coverage" vs "known exceptions" *inside* a single definition.
Exceptions live in `memory/failure/`, separate from the
definition they violate (gap A in
[som-12.9-sor.md](som-12.9-sor.md)).

---

## Summary table

| # | Idea from §12.12 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A definition does not always give a way to use a word | Yes | Functional surfaces (Spock, frames) define use, not form. |
| 2 | No single structural definition covers a useful word | Partial | Catalogue is mixed; coverage not tested (gap C). |
| 3 | Psychological / process-oriented definitions can succeed | Yes | Frames and integration agencies are process-oriented. |
| 4 | Most definitions are partly psychological | Yes | Manifests fuse structural fields with prose-body process. |
| 5 | Most ideas lie between physical and psychological | Yes | Censors lean structural; integration leans psychological; agencies span. |
| 6 | The mix depends on the word | Partial | True in practice; not declared (gap A). |
| — | Concepts carry both definition kinds | No | Concept schema does not require both (gap B). |
| — | Definitions tested against instance range | No | No coverage test (gap C). |

---

## Implication for the plan (no changes proposed here)

§12.12 is the section that defends *psychological* description as
necessary, not optional. The plan honours this by giving every
manifest a prose body and by defining frames functionally. What
the plan lacks is the *meta-discipline* §12.12 recommends:
declaring which kind of definition each unit relies on, requiring
the two together for concepts, and testing each definition against
the instances it must cover.

Closing these gaps would touch the concept schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a required two-sided shape), the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(an explicit `definition_kind:` field), and the meta-admin
family (a coverage-tester). It also intersects with the voice
rules in [AGENTS.md](../../../AGENTS.md), since enriching the
internal psychological lexicon must not leak anthropomorphism to
the public surface. These are governance-shape changes, not
edits to runnable code, and fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.
