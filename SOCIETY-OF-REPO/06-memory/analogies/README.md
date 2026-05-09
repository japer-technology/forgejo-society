# Analogies

Analogy records store structural similarity claims across domains.

They are used when direct frame or K-line matches are weak and the society needs a governed fallback for novelty.

---

## Analogy schema

```yaml
id: analogy.{name}
source_frame: frame-id
target_frame: frame-id
shared_structure:
  - text
transfer_cautions:
  - text
confidence: float
linked_episodes:
  - episodic-id
```

Analogy-driven activations must record why the mapping was chosen and what might not transfer safely.
