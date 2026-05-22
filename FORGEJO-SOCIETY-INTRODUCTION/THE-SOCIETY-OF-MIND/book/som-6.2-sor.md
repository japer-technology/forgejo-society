# Section 6.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.2.md](som-6.2.md) — *Signals and signs*
(Minsky, §6.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§6.2 extends §6.1's signal into a theory of *meaning by connection*.
Things mean what they are *linked to*; the mind has no doors, only
connections among signs.

---

## The ideas Section 6.2 actually carries

1. **Understanding is analogy.** A new thing is grasped by being
   represented as something already known.
2. **Signs make the strange commonplace.** Symbols, words, names,
   and icons are not decoration; they are the bridge between an
   unfamiliar mechanism and a usable one.
3. **No doors inside the mind, only connections among signs.**
   Consciousness is closer to a menu list flashing on a display
   than to direct contact with mechanism.
4. **Things are seen as how they can be *used*.** Hammers are
   things-to-hit-with; balls are things-to-throw. Affordance, not
   essence, dominates perception.
5. **Knowledge is instrumental.** Minds evolved to solve practical
   problems, not to mirror reality.

---

## What the implementation already absorbs

### Understanding is analogy (idea 1)

The plan has an explicit *analogy fallback* in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md):
when no K-line and no frame match strongly, the `activate` phase
consults `memory/analogies/` for typed structural mappings between
domains. The Settlement schema records `analogies_used: [ ... ]` so
the move is auditable
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).

### Signs make the strange commonplace (idea 2)

Polynemes are the operational form of "icon, token, word, or sign that
can remind us of its use." A path-polyneme `workflow-file` does not
*describe* the workflow file; it triggers the right frame and the
right safety surface. The sign is the doorway. The first-ship
catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is small and reuses existing forge vocabulary, which is also faithful
to §6.2's "exploit signs that already have acquired some significance."

### Menu lists on a display (idea 3)

The Settlement record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
is exactly such a "menu list": `activated`, `proposals`, `critics`,
`censors`, `ideals_cited`, `unknowns`, `blind_spots`,
`action_authorised`. The conscious-presenter composes from this menu
rather than from the agency internals. The blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
is the *display surface*; the agency loop is the hidden machinery.

### Things are seen as how they can be used (idea 4)

The Manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
makes every artefact's *use* its primary description: `outputs`,
`tools`, `activates_on`, `inhibits`. There is no abstract "essence"
slot. A path is described by which polyneme it triggers, not by what
it contains.

### Knowledge is instrumental (idea 5)

The presence/permission rule in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("presence is permission; absence is denial") and the `budget` field
on every manifest enforce instrumental epistemology at the level of
the runner: nothing is kept that does not pay for itself in some
declared way (K-line `decay_score`, agency `reuse_count`,
memory-policy retention).

---

## What the implementation does not yet take into account

### A — Analogies are a fallback, not a first-class capability

§6.2 reads as if analogy is the *primary* mode of understanding.
The plan treats it as the *last* mode: only when no K-line and no
frame match. The first-ship analogy catalogue is explicitly empty
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and analogies are written only by meta-admin during ecology review.
The runtime has no path that says "use this analogy *as the
explanation* of a successful K-line." Analogy is present but
peripheral.

### B — Affordance vocabulary is not enumerated

Idea 4 implies that the society's primary description of any artefact
is a verb (what it can be used for). The Manifest schema has
`outputs` and `tools`, but the plan does not enumerate the
*affordance space* — the list of things one *does* in this society
(propose patch, attach evidence, object to scope, summarise tier-1,
suppress diff, …). The vocabulary exists scattered across manifests
and schemas; it is not collected anywhere.

### C — No equivalent of the "alien door"

§6.2's central image is the alien door: a mechanism that becomes
usable only when clothed in a familiar sign. The plan has polynemes
for paths, labels, and phrases, but no general protocol for taking a
*new* internal artefact (e.g. a freshly drafted concept under
`memory/concepts/`) and *attaching a sign to it* so the rest of the
society can use it. Concept promotion is governed; sign attachment is
not described.

### D — No instrumental check on retained knowledge below the policy floor

Idea 5 says knowledge is kept *only* when it can be exploited. The
plan has decay scores on K-lines and retention rules on state, but
semantic memory (`memory/semantic/decisions.log`,
`project-laws.log`) is append-only with no equivalent decay or
reuse-count signal driving retention review
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Durable semantic facts could accumulate indefinitely without ever
being checked for whether they are still *used*.

---

## Summary table

| # | Idea from §6.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Understanding is analogy | Partial | Analogy fallback exists; catalogue empty; treated as last resort (gap A). |
| 2 | Signs make the strange commonplace | Yes | Polyneme catalogue. |
| 3 | No doors, only connections among signs | Yes | Settlement record + blackboard. |
| 4 | Things seen by use | Partial | Manifest fields capture use; affordance space not enumerated (gap B). |
| 5 | Knowledge is instrumental | Partial | K-lines decay; semantic memory does not (gap D). |
| — | "Alien door" sign-attachment protocol | No | Gap C. |

---

## Implication for the plan (no changes proposed here)

§6.2 is largely absorbed: polynemes are the operational sign-layer,
the Settlement record is the operational menu list, and the manifest
schema describes artefacts by their use. The four recorded gaps are
*depth* gaps — analogy as a peripheral rather than primary capacity
(A), an un-collected affordance vocabulary (B), no sign-attachment
move for new internal artefacts (C), and the absence of an
instrumental retention signal on semantic memory (D).

Any move to close them would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(analogy and sign-attachment),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(affordance catalogue), and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(semantic-memory decay), and so falls under the "stop and ask" rules
in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
