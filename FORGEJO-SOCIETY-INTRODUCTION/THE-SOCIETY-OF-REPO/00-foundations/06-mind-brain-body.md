# Mind–Brain–Body Decomposition

Society of Repo distinguishes three interacting layers.

| Layer | Meaning in SOR | Examples |
| --- | --- | --- |
| **Body** | Infrastructure and interfaces | forge, runners, storage, tools, network, external services |
| **Brain** | Learned and statistical systems | classifiers, local models, retrieval indexes, pattern matchers |
| **Mind** | Governed cognition | settlements, critics, censors, constitutions, self-ideals, reasoning traces |

---

## Forgejo deployment binding

In the Forgejo-hosted form of this society, the body layer is concrete:

| Body component | Operational responsibility |
| --- | --- |
| `.forgejo/workflows/` | Receives Forgejo events and starts the runner lifecycle |
| Forgejo Actions runner | Executes the runtime in the selected image or environment |
| `.forgejo-intelligence/` | Holds runtime surfaces, coordinators, agent engines, tests, and state |
| `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` | Fail-closed enable sentinel |
| Forgejo API adapter | Performs issue, PR, label, milestone, release, wiki, reaction, and repository writes |
| Forgejo repository permissions and `FORGEJO_TOKEN` | Bound write capability at the infrastructure layer |
| Forgejo Actions secrets | Hold model provider keys and API tokens outside git |

The brain layer includes the selected agent engine, local or cloud models,
retrieval indexes, event classifiers, and prompt construction.

The mind layer remains the SOR specification: constitutions, rights, approval
gates, critics, censors, settlements, memory promotion, and self-ideals.

Forgejo permissions can make an action technically possible. They do not make it
legitimate. Legitimacy is granted only by the mind layer.

---

## Why the split matters

A model can be capable without being authorised.
A runner can execute without understanding.
A settlement can govern without being a model.

Confusing these layers makes failures hard to diagnose and encourages false autonomy claims.

---

## Design rules

1. Every agency constitution declares its body, brain, and mind dependencies.
2. Failure reviews identify whether a fault originated in body, brain, mind, or coupling between them.
3. Improvements to one layer do not waive controls in the others.
4. The mind layer remains the place where authority, ideals, and approvals live.
5. Forgejo runtime changes that widen execution, token scope, surface activation, or workflow triggers require governance approval.

---

## Source notes

This decomposition is informed primarily by the **2025 Society of Minds** framing, then adapted to SOR's Git-native governance model.
