# Self-Models Registry

A Society of Repo does not have *one* self. It has many self-models, each of which represents some aspect of what the society is, what it can do, what it has done, and what it has not yet understood about itself.

> **Minsky:** "What people call 'self' is not a single thing but a great network of mental models, each of which represents some aspect of what we are or what we ought to be."

This file is the registry of self-models. It is *separate from* the [self-ideals](self-ideals.md) registry: ideals describe what the society aims to *be*; self-models describe what the society currently *thinks it is*.

This separation is load-bearing. Self-ideals are slow-changing by design (Self-Ideal Stability Principle, P9). Self-models change much more often as the society learns what it is actually doing.

---

## What a self-model is

A self-model is a structured, versioned, deliberately-incomplete description of one aspect of the society. Examples:

- *Capability self-model* — what skills the society currently performs reliably.
- *Coverage self-model* — what stimulus classes the society currently routes well.
- *Cost self-model* — what the society currently consumes and produces in resource and attention.
- *Failure self-model* — what failure modes the society currently exhibits.
- *Reputation self-model* — what other societies (and the owner) currently expect of this one.
- *History self-narrative* — the story the society tells about how it got to be this way.

Each is *one* self-model. Together, they are the society's distributed self-knowledge.

---

## Mandatory honesty fields

Every self-model entry MUST declare:

```yaml
id: self-model.{name}
version: N
status: active | superseded | retired
last_reviewed: ISO 8601 date

scope: text                       # what aspect of the society this models
declared_by: agency-or-role-id    # which B-brain agency authored it

confidence: float                 # how strongly the society endorses this model
known_blind_spots:                # what this model deliberately does not cover
  - text
known_contradictions:             # entries in other self-models that disagree
  - self-model-id
opacity_dependencies:             # opaque components whose behaviour this model relies on
  - text

is_narrative: true | false        # if true, this entry is a hypothesis, not evidence
load_bearing_for_governance: false  # narratives MUST be false here
```

Two of these fields enforce the **Opacity Principle (P8)** and the **Stories-as-Hypotheses Insight (I17)**:

- `known_blind_spots` is mandatory and may not be empty. A self-model that claims no blind spots is *less* trustworthy than one that names some, not more.
- `is_narrative: true` marks a self-model as a story the society tells about itself. Narratives may be useful summaries; they may *not* be cited as evidence in settlement, and `load_bearing_for_governance` must be `false` for any narrative.

---

## Plurality and conflict

Multiple self-models on overlapping topics are expected, not forbidden. When two self-models contradict, the contradiction is logged through `known_contradictions` and is itself a B-brain observation signal.

Resolution is by settlement, not by averaging. Implicit blending of self-models into a single "self" view is a Non-Compromise violation (P3) — it produces a flattering composite that the society then mistakes for ground truth.

---

## Update rules

| Change | Required process |
|---|---|
| Update `confidence`, `last_reviewed`, blind-spot list | Authoring B-brain agency may update; logged as ordinary observation |
| Add or supersede a self-model entry | Governance PR with stated rationale |
| Promote a narrative to non-narrative status | Forbidden — narratives stay narratives; supersede with a non-narrative entry instead |
| Retire a self-model | Governance PR; lineage preserved through `supersedes` link |

A self-model is *never* deleted; it is retired with history intact. Lost self-models hide drift.

---

## Drift review

The `evaluation-steward` and `ecology-monitor` open a self-model drift review when:

- a self-model's `confidence` and the credit-assignment record disagree across multiple cycles;
- multiple high-impact settlements cite a self-model whose `last_reviewed` is older than two quarterly cycles;
- a self-narrative is observed being treated as evidence in proposals (a protocol violation that should be visible).

---

## Relation to self-ideals

| | Self-models | Self-ideals |
|---|---|---|
| Question answered | "What do I think I am?" | "What do I think I should be?" |
| Speed of change | Updated frequently | Updated very rarely (multi-cycle review) |
| Allowed in evidence? | Yes for non-narratives, no for narratives | Yes — ideals are cited in major proposals |
| Failure mode | Drift from reality | Drift from values |
| Stewardship | Evaluation-steward, ecology-monitor | Owner + governance |

A society that conflates the two is a society that updates its values to match its behaviour. This is exactly what the Self-Ideal Stability Principle is meant to prevent.

---

## Source notes

- **Minsky 1986** grounds the plural-self claim and the opacity of introspection.
- **Minsky 1988** sharpens the warning about confusing what one is with what one ought to be.
- The narrative-as-hypothesis discipline maps directly to Insight I17 in [SOM 10-deep-insights.md](../../SOCIETY-OF-MIND/10-deep-insights.md).
