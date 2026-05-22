# Section 11.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.2.md](som-11.2.md) — *The shape of space*
(Minsky, §11.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.2 makes a deeper move than §11.1. The brain is sealed in the
skull and contacts the world only through bundles of nerves; what
we call "being in the world" is a model assembled from signals.
Crucially: a single sensation says nothing; the smallest *thing
worth saying* is a comparison between two. By analogy with the
mathematical point — shapeless and sizeless on its own — sensations
acquire identity only through their relations.

---

## The ideas Section 11.2 actually carries

1. **The brain is sealed; the world is a model.** All contact is
   mediated by nerve bundles. The "outside" is reconstructed
   internally.
2. **A single sensation is mute.** "What did that feel like?" admits
   no answer; "which of these two feels more like the third?" admits
   many.
3. **Identity is relational.** A point has no shape or size by
   itself; nor does a single sensory event. Properties emerge from
   the structure of pairs and neighbourhoods.
4. **Geometry from nearness.** Given enough information about which
   pairs of things are near each other, the global shape of a space
   can be reconstructed.
5. **Similarity is co-occurrence.** Two skin spots are "near" largely
   because they are touched together more often than chance.

---

## What the implementation already absorbs

### The world reaches the runtime only through one bridge (idea 1)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
defines exactly one entry point: Forgejo events flow into the
`normalize` step, which writes a `stimulus.json` that every
downstream phase reads. Raw event payloads never leak past
`normalize`. This is the operational form of "the brain contacts
the world only through nerves" — every percept is mediated, typed,
and recorded.

### Comparisons over isolated readings (ideas 2, 3)

The K-line cue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is *not* a record of one stimulus — it is a record of similarity
across stimuli. Reactivation in `activate` computes a similarity
score between the current cue and the stored `restore_when`, then
selects up to `memory.max_k_lines_loaded`. The unit of memory is
the *match*, not the *instance*.

### Relational links on every durable record (idea 3)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
requires `linked:` on every durable record, with types `supersedes`,
`derived_from`, `contradicts`, `cites`, `reinforces`, `analogous_to`,
`learned_from`. A record's meaning is its position in this graph.
The protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
makes this binding.

### Co-occurrence as evidence (idea 5)

The polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
encodes co-occurrence implicitly: paths, labels, and phrases that
appear together excite the same agencies. A stimulus that lights up
`workflow-file` and `secret-file` together is treated differently
from one that lights up either alone.

---

## What the implementation does not yet take into account

### A — No similarity metric is named

§11.2's whole apparatus rests on a notion of "near". The plan
mentions a similarity score in the K-line activation pass but does
not specify what counts as near, what weights its dimensions, or
where the metric is declared. The runtime treats similarity as a
black box. A Minskian reading would want the metric written down,
versioned, and auditable like any other policy.

### B — No "geometry from nearness" reconstruction

Idea 4 — that global shape can be inferred from local pair-wise
nearnesses — has no analogue in the plan. The relational graph
exists; nothing walks it to compute, say, "which K-lines form a
cluster" or "which agencies sit on the boundary between two
frames". The graph is queried for retrieval, never analysed for
structure.

### C — No representation of the bridge as a perceptual organ

[`02-protocols/18-bridges.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)
names bridges as the contact surface with the outside, but the plan
treats `normalize` as plumbing rather than as the eye-equivalent it
actually is. A change in what the bridge can perceive is, by §11.2's
logic, a change in the shape of the society's world.

### D — Single-percept handoffs are accepted

A handoff in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
may carry one claim with one piece of evidence. §11.2 would say
that one observation is not yet a thing worth acting on — only the
relation between two is. The plan permits a settlement to form on a
single agency's single proposal, with no required peer comparison.

---

## Summary table

| # | Idea from §11.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The brain is sealed; the world is a model | Yes | `normalize` is the single bridge; downstream reads only `stimulus.json`. |
| 2 | A single sensation is mute | Partial | Comparisons exist (K-line cues, polynemes) but single-percept handoffs are still permitted (gap D). |
| 3 | Identity is relational | Yes | `linked:` on every durable record; relational-memory protocol. |
| 4 | Geometry from nearness | No | Graph stored, not analysed for structure (gap B). |
| 5 | Similarity is co-occurrence | Partial | Polynemes encode it implicitly; no declared metric (gap A). |
| — | Bridge as perceptual organ | Partial | Bridges named; their *perceptual* status not made explicit (gap C). |

---

## Implication for the plan (no changes proposed here)

§11.2 reads the plan kindly on the *single-bridge* discipline and on
relational memory, and severely on the *unspecified similarity
metric* and the absence of any structural analysis of the relational
graph. The plan stores the geometry §11.2 cares about; it does not
yet read it.

The openings are: declare the K-line similarity metric (gap A),
permit a meta-admin pass that analyses the relational graph for
clusters and boundaries (gap B), elevate the bridge from plumbing to
named perceptual surface (gap C), and consider a `critic.peerless`
that objects when a settlement rests on one agency's lone proposal
(gap D).

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
