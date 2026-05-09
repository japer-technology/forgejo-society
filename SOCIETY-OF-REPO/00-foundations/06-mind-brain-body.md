# Mind–Brain–Body Decomposition

Society of Repo distinguishes three interacting layers.

| Layer | Meaning in SOR | Examples |
|---|---|---|
| **Body** | Infrastructure and interfaces | forge, runners, storage, tools, network, external services |
| **Brain** | Learned and statistical systems | classifiers, local models, retrieval indexes, pattern matchers |
| **Mind** | Governed cognition | settlements, critics, censors, constitutions, self-ideals, reasoning traces |

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

---

## Source notes

This decomposition is informed primarily by the **2025 Society of Minds** framing, then adapted to SOR's Git-native governance model.
