# Representation Protocol

Representation discipline decides what kind of durable cognitive artifact a new record should become.

Without representation discipline, memory becomes a pile of files rather than a differentiated mind.

---

## Representation classes

| Class | Use when | Do not use when |
|---|---|---|
| `episodic` | Recording one event or one settlement outcome | Claiming a general rule |
| `semantic` | Recording a durable fact | Describing a step-by-step method |
| `procedural` | Recording a reusable method | Recording one-off history |
| `failure` | Recording what failed and why | Recording ordinary negative outcomes without diagnosis |
| `frame` | Describing a recurring situation with defaults and roles | Only storing activation weights |
| `analogy` | Recording a structural mapping across domains | Claiming the source and target are identical |
| `concept-candidate` | Proposing a new abstraction | Recording an already ratified category |
| `kline` | Recording a remembered activation/inhibition pattern | Storing general facts about a domain |
| `decision` | Recording a settled judgment | Recording raw evidence without conclusion |
| `self-ideal` | Recording a durable normative commitment | Recording a task-specific policy tweak |

---

## Conflict and duplication rules

1. **Conflict:** if two active artifacts contradict one another, add `contradicts` links and open steward review.
2. **Duplication:** if two artifacts represent the same durable claim, merge or supersede them.
3. **Supersession:** new understanding should point to old understanding with `supersedes`.
4. **Retirement:** obsolete or harmful artifacts move to `retired` or `archived`, never silent deletion.

---

## Required declaration

Every new long-lived artifact must declare:
- `representation_class`
- `status`
- `owner_or_steward`
- `links`
- `why_this_class`

---

## Representation primitives

Beyond the durable storage classes above, SOR pins down Minsky's named representation primitives so that they have concrete, operational meaning in a Git-native society. None of them are storage classes; they are *uses* of representation that the protocols rely on.

| Primitive | Operational meaning in SOR | Where it lives |
|---|---|---|
| **Microneme** | A sub-symbolic, agency-internal feature that has meaning *only* to its owning agency. Micronemes are not exported, not linked, and not citable from outside the agency. | Inside an agency; never a top-level artifact |
| **Polyneme** | A typed event whose payload fields are interpreted *differently* by each receiving agency. Each agency reads only the slice that concerns it. The same polyneme can wake several agencies into different work. | Event taxonomy in `02-protocols/03-events.md` |
| **Isonome** | A lifecycle signal whose meaning is *the same* across every receiving agency: `activate`, `inhibit`, `settle`, `commit`, `retract`, `escalate`. Isonomes are control signals, not content. | Orchestrator messages in `02-protocols/04-activation.md` and `05-settlement.md` |
| **Pronome** | A short-lived, settlement-scoped attachment ID that lets agencies refer to the *current* actor, target, or focus without permanent rewiring. Bound when a settlement opens; dissolved when it closes. | `02-protocols/05-settlement.md` (settlement window) |
| **Transframe** | A frame whose schema describes a *change*: actor, action, object, before-state, after-state, instrument, cause. Settlements ARE transframes — that is their structural shape. | `02-protocols/05-settlement.md`; subkind of `frame` in `06-memory/frames/` |
| **Frame-array** | A small group of frames that share most slots but differ on one viewpoint dimension (temporal step, modality, observer). Used to switch viewpoints cheaply. | `06-memory/frames/` (a frame may declare `array_member_of: frame-array-id`) |

Each primitive is irreducible: removing one forces its work onto the others, and they do that work badly (Diversity Principle, P7). Together they are why representation in SOR is *plural*, not unified.

---

## Cost of premature combination

> **Minsky 1988:** "Most large connectionist networks suffer from a phenomenon I call 'additive opacity'. … When we add up many things, we may obscure what is happening within them."

A representation that combines many sources into a single value loses the ability to attribute the result to its sources. The architectural consequence is that SOR keeps proposals, critic verdicts, and censor decisions *separable* until the named combination event — settlement.

Combining earlier (in retrieval, in prompt-stuffing, in hidden weighting) is permitted only when the combination step is itself recorded as a settlement-grade decision with provenance.

---

## Stewardship

The representation steward reviews repeated misclassifications, uncontrolled duplication, and cross-class drift.

Misclassification is a learning problem, not just a filing problem.

---

## Source notes

This protocol is a direct response to Minsky's insistence that minds use many different kinds of structure, not one undifferentiated store.
