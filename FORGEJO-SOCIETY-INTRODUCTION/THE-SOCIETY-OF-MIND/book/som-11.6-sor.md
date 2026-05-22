# Section 11.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.6.md](som-11.6.md) — *The centred self*
(Minsky, §11.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.6 is the chapter's developmental claim. The child does not
"simply look"; every motion drastically rewrites the image on the
retina, so dedicated machinery has to compensate before vision is
useful at all. And even with that machinery, the child first
imagines a world *centred on itself*, then slowly recapitulates
astronomy — learning, over years, that its own body is one object
among others.

---

## The ideas Section 11.6 actually carries

1. **"Simply looking" hides hard problems.** Motion of body, head,
   and eye rewrites the input so violently that compensation must
   precede interpretation.
2. **Inborn mechanisms reduce learning cost.** Evolution supplies
   the substrate that makes visual learning tractable; without it,
   the construction would be too expensive.
3. **Cross-modal correlation is the path inward.** First the skin
   map, then correlations with eye and limb motion, then "places"
   outside the skin, then a network of places.
4. **The first model is ego-centred.** The early world is centred
   on the self; treating the self as one object among many is a
   later, harder achievement.
5. **Perspective-taking matures slowly.** Even adolescents are
   still improving at seeing things from other viewpoints. There
   is no sudden moment of "now I am decentred".

---

## What the implementation already absorbs

### Compensation precedes interpretation (idea 1)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
puts `normalize` and `guardrail` *before* `perceive`. The runtime
never lets agencies see the raw event payload — it sees a stabilised
`stimulus.json`. That is the §11.6 move: the violent world is
smoothed before higher cognition meets it.

### Inborn substrate (idea 2)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the first-ship frame catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
together play the role of inborn mechanism — enough structure for
the society to begin learning at all. Without them the
construction would, as in §11.6, be too expensive.

### Cross-modal correlation (idea 3)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
lists three polyneme kinds — path, label, phrase — and a K-line's
`cue` is allowed to combine them. A K-line whose `restore_when`
fires on a path *and* a phrase *and* a label is performing exactly
the kind of cross-modal correlation §11.6 ascribes to the infant
relating eye motion to limb motion to skin contact.

---

## What the implementation does not yet take into account

### A — The self-model is not treated as developmental

`agency.identity.spock-self-model` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
exists; the soul-file is at `.forgejo-society/AGENTS.md`. But the
plan does not represent the self-model as something that *matures*.
There is no "infant", "stabilisation", or "mature" stage with
different rules, no developmental curve from ego-centred to
decentred. The self-model is authored, not grown.

### B — No perspective-taking primitive

§11.6 ties perspective-taking to "imagining things not in view".
The plan has *branches as imagination* / candidate-future branches
in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
but no agency or critic dedicated to "view this from the user's
seat" or "view this from a downstream society's seat". The
introspection protocol's `unknowns`/`blind_spots` slots come
closest but are stimulus-bound.

### C — Place-network has no analogue

Idea 3's culmination is "a network of relationships, trajectories,
and directions between places". The plan's `memory/concepts/` and
`memory/frames/` hold *categories* and *expectations*, but nothing
holds *places* — recurring contexts treated as locations the
society can return to. Polyneme symbols are the nearest neighbour,
but they are activators, not landmarks.

### D — Ego-centredness is structural and unmarked

The plan is structurally ego-centred — the conscious-presenter
speaks in Spock's voice, the self-model is a file, the authority
registry is a self-declaration. §11.6 reads this as a *stage*, not
a *terminus*. There is no plan-level recognition that decentring
would be an evolution; the federation material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
gestures toward it but does not name it as such.

---

## Summary table

| # | Idea from §11.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | "Simply looking" hides hard problems | Yes | `normalize` + `guardrail` precede `perceive`. |
| 2 | Inborn mechanisms reduce learning cost | Yes | First-ship catalogues; bootstrap checklist. |
| 3 | Cross-modal correlation is the path inward | Partial | Polyneme + K-line cues combine modalities; no place-network (gap C). |
| 4 | First model is ego-centred | Yes (by construction) | Self-model file; single voice. |
| 5 | Perspective-taking matures slowly | No | Self-model authored not grown (gap A); no perspective primitive (gap B); ego-centredness unmarked (gap D). |

---

## Implication for the plan (no changes proposed here)

§11.6 reads the plan as a child still in its first map of the
world: it has compensated for motion, it has its inborn substrate,
it correlates modalities — but it has not yet imagined itself from
outside. The plan's structural ego-centredness is defensible (a
single voice is a feature, not a bug) but §11.6 makes the gap
visible: the plan does not represent maturation, perspective-
taking, or places-as-landmarks.

The openings are slow and federation-shaped. A developmental
record on the self-model (gap A), a perspective-taking agency or
critic (gap B), a place-network in memory (gap C), and an explicit
acknowledgement that the current ego-centredness is a stage
(gap D) would together let the plan describe its own growth in the
§11.6 register.

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
self-models at
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
and federation-scope material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
