# Section 24.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.6.md](som-24.6.md) — *Direction-nemes*
(Minsky, §24.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.6 proposes a specific kind of pronome — *direction-nemes* — that
let many agencies coordinate about *where* things are. The deeper
point is that some pronomes encode *spatial structure*, and that
this structure shows up in many domains beyond literal space.

---

## The ideas Section 24.6 actually carries

1. **Spatial agencies are old and many.** Vision, reach, grasp,
   touch — each has its own representation of "where".
2. **A shared addressing layer makes them cooperate.** Different
   agencies can converse about a location only if they share a
   common set of position handles.
3. **Direction-nemes are that shared layer.** A small fixed family
   of direction-pronomes (top, bottom, sides, ...) addresses
   regions of any scene.
4. **The shape generalises far beyond geometry.** Direction-nemes
   recur in surprisingly many domains of thought.
5. **Familiar parts make the unfamiliar thinkable.** Inside a
   circular tube, you still think *top, bottom, side* — without a
   familiar decomposition, the scene is unusable.

---

## What the implementation already absorbs

### Shared addressing across agencies (idea 2, partial)

The signal record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
gives every agency a common vocabulary for `evidence.kind` —
`path`, `label`, `phrase`, `symbol`, `diff`, `metric`. This is the
*kind* of structural agreement Minsky has in mind: agencies do not
need to share an internal representation, only a shared addressing
vocabulary at the channel boundary.

### Path-polynemes as a domain-specific "where" layer (ideas 3, 5)

`path-polynemes.yml` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives the society a coarse spatial decomposition of its own
"world": `workflow-file`, `soul-file`, `governance-file`,
`policy-file`, `agency-file`, `memory-file`, `state-file`,
`secret-file`. These are *directions in repo-space*. They are
deliberately few, deliberately fixed, and shared by all agencies —
the structural analogue of direction-nemes for the only spatial
domain the society inhabits.

### Familiar-parts decomposition (idea 5)

The folder spec in
[`04-folder-spec.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/04-folder-spec.md)
and the mapping in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
ensure that every part of the society lives at a *named*, *familiar*
location. New territory is mapped to known names before it is
worked on — Minsky's circular-tube discipline.

---

## What the implementation does not yet take into account

### A — Pronomes (and therefore direction-nemes) are not catalogued

The deeper gap inherited from §24.3 re-surfaces here. The plan has
*polynemes* but no *pronomes* and no *direction-nemes*. Path-polynemes
behave a little like direction-nemes — they decompose repo-space —
but they are typed as activation symbols, not as terminal-addressing
handles. The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
does not list any `nemes/direction-nemes.yml`.

### B — Repo-space is the only "spatial" domain the plan models

The plan covers paths and labels well; it does not model the other
spaces a society might inhabit (issue-graph topology,
dependency-graph topology, time, federation neighbourhood). Idea 4
— that direction-nemes recur across many domains — has no surface
in the plan. There is no general *topology* notion; each spatial-ish
axis is hardcoded into the field type that needs it.

### C — No agency family for "place / position"

The first-ship agency catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has perception, memory, code, safety, identity, integration,
assembly, meta-admin. There is no *spatial / cartographic* family
distinct from code (the `agency.code.codebase-cartographer` is the
nearest thing; it lives in the code family because the only space
is repo-space).

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Many agencies care about "where" | Partial | Path-polynemes + cartographer; not separated as a family (gap C). |
| 2 | Shared addressing layer | Yes | Common evidence kinds in signals; path-polynemes. |
| 3 | Direction-nemes as that layer | No | Pronome / direction-neme not present (gap A). |
| 4 | The shape generalises beyond geometry | No | Only repo-space modelled (gap B). |
| 5 | Familiar parts make the unfamiliar thinkable | Yes | Folder spec + mapping table. |

---

## Implication for the plan (no changes proposed here)

§24.6 quietly extends the §24.3 pronome gap into a *family* of
typed pronomes the plan would need before it could honour Minsky's
generalisation across domains. The first move that would matter is
recognising path-polynemes as discharging *some* of the direction-neme
role and lifting them — explicitly — into a `nemes/direction-nemes.yml`
or its analogue under a pronome layer. Closing any of A–C would
touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the agency taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
