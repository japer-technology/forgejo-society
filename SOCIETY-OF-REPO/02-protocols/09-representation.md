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

## Stewardship

The representation steward reviews repeated misclassifications, uncontrolled duplication, and cross-class drift.

Misclassification is a learning problem, not just a filing problem.

---

## Source notes

This protocol is a direct response to Minsky's insistence that minds use many different kinds of structure, not one undifferentiated store.
