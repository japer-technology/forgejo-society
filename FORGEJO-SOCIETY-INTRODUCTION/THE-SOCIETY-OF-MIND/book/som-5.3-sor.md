# Section 5.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.3.md](som-5.3.md) — *The remote-control self*
(Minsky, §5.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.3 attacks the folk picture of mind directly. The chapter shows the
familiar diagram — senses feeding an inner movie screen watched by a
small Self that decides and acts — and demonstrates that the picture
explains nothing. A homunculus needs its own homunculus inside, and
so on; a single, partless Self has no parts that can serve as pieces
of an explanation. The persistence of the picture is itself the
phenomenon to be explained: so much of what minds do is hidden from
the part of mind that is involved with consciousness.

---

## The ideas Section 5.3 actually carries

1. **Folk theory is homuncular.** Senses → inner screen → lurking
   Self → action, with the Self doing the deciding.
2. **The homunculus is paradoxical.** It requires another homunculus
   inside it to watch its screen, and so on without end.
3. **A partless Self explains nothing.** Anything offered as the
   single ultimate cause must have no internal structure, and so
   cannot provide pieces of explanation.
4. **The illusion persists because mind is hidden from itself.** So
   much of cognition is invisible to consciousness that crediting an
   inner agent feels natural.
5. **Centralising agency is a category error.** The mistake is not
   that the Self is in the wrong place; it is that the Self is the
   wrong *kind* of thing.

---

## What the implementation already absorbs

### The presenter is not a decider (ideas 1, 2, 5)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and [`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
are explicit:
`agency.integration.conscious-presenter` is the *sole producer of
visible text*, but it composes from a settled blackboard. It does
not choose. Settlement happens before it speaks. The plan refuses
the homuncular shape at its most tempting point.

### Multiple parts, no inner Self (idea 3)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agency a narrow job and a manifest. The system has many
named parts, none privileged as "the one that decides." The unit of
identity is the manifest file, not a hidden core.

### The layered blackboard refuses the inner screen (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keeps `workspace.md`, `blackboard.md`, `signals.jsonl`,
`activation.jsonl`, and `objections.jsonl` as parallel artefacts.
There is no single screen on which "everything that is perceived"
appears for a watcher; the same data are represented many ways at
different layers.

### Hidden cognition is recorded (idea 4)

`state/.../signals.jsonl` and `activation.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
preserve far more than the presenter ever surfaces. The plan
acknowledges, structurally, that what the user sees is a small
projection of what the society does. Spock is honest about being
narrow.

### Sole-visible-voice is an effect, not a cause

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
makes the conscious bottleneck a *publication rule*, not a
decision rule. This is the operational difference between "Spock
is the one who decides" (homuncular) and "Spock is the one through
whom decisions become visible" (non-homuncular).

---

## What the implementation does not yet take into account

### A — No anti-homunculus rule for the presenter

The presenter's role is structurally narrow, but nothing in the
plan forbids drift. Future agency manifests, prompts, or AGENTS.md
edits could quietly let the presenter make choices that should
belong to settlement (selecting among proposals, prioritising
objections, smoothing the wording in ways that change meaning).
There is no critic specifically charged with "the presenter is
exceeding its remit."

### B — First-person voice is unconstrained

[`AGENTS.md`](../../../AGENTS.md) bans "AI brain", "AGI", and
anthropomorphic flourishes, but does not constrain first-person
voice in Spock's responses. "I think", "I decided", "I will" are
the linguistic shape of a homunculus. The voice rules forbid the
worst phrasings; they do not forbid the homuncular grammar.

### C — `spock-self-model.md` can accumulate decider-claims

`agency.identity.spock-self-model.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is a Markdown file that the runtime reads each cycle. Nothing in
the plan audits its contents for homuncular self-description. Over
time, well-meaning edits could turn the self-model from "what Spock
keeps consistent with AGENTS.md" into "what Spock has decided
about itself."

### D — Introspection without an anti-homunculus posture

`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md` is mapped in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
to the `unknowns:` and `blind_spots:` slots on settlement. These
acknowledge limits, but the introspective output itself is
necessarily phrased by the presenter — that is, by exactly the part
whose grammar is most prone to reinstall the homunculus. No
narrative rule keeps the introspective summary in the third-or-no-
person voice the analysis would require.

### E — Critic agencies have no "homunculus pattern" detector

The critic catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
attacks evidence, scope, cost, privacy, risk, overconfidence,
source quality, and staleness. None of these flags the presenter
narrating cognition as if a single Self performed it. Drift toward
the inner-screen picture would not be visible at the critic layer.

### F — User-facing reports do not name the absence of a Self

Reports written by `report`
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
and `state/runs/<run_id>/report.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
describe what happened. They do not foreground that no single
agency *chose* the outcome. A reader of a report can re-import the
homuncular picture by reading Spock's voice as Spock's intention.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Folk theory is homuncular | Refused | Presenter composes, does not choose ([`03`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)). |
| 2 | Homunculi recurse | Refused | No "inner Spock"; many named agencies ([`05`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)). |
| 3 | A partless Self explains nothing | Refused | Every part has a manifest; identity is the file. |
| 4 | The illusion persists because mind is hidden | Acknowledged | `state/` and `blackboard.md` preserve the hidden parts ([`08`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)). |
| 5 | Centralising agency is a category error | Refused at runtime | No anti-drift rule keeps it refused at the *voice* layer. |

---

## Implication for the plan (no changes proposed here)

The plan refuses the homunculus *structurally*: there is no inner
Self in the runtime. The risk it does not yet manage is **narrative
drift**: the same homunculus picture can be re-imported at the voice
layer, through Spock's first-person grammar, through accretion on
the self-model file, and through reports that describe events as if
they had a single author. §5.3's warning is that the picture is
seductive precisely *because* so much of mind is hidden — and that
asymmetry is exactly the situation Spock faces every cycle.

This file records the gap; it does not propose changes. Per
[`AGENTS.md`](../../../AGENTS.md) §12, adding new tone constraints,
critics, governance primitives, or amendments to the voice
discipline requires the maintainer's explicit direction. This
analysis is offered as a reading, not a request.
