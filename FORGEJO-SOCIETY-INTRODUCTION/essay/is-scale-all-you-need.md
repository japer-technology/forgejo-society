# Is scale all you need?

The more precise position from many researchers is:

> **Scale is powerful and necessary, but probably not sufficient.**

### 1. Why people believed in scale

The pro-scale argument came from empirical “scaling laws”: as language models got more parameters, more data, and more training compute, their loss and many benchmark scores improved predictably. OpenAI’s 2020 scaling-laws paper found smooth power-law improvements across model size, dataset size, and compute; DeepMind’s Chinchilla work later refined this by showing that model size and training tokens need to be scaled together for compute-optimal training. ([OpenAI][1])

This fitted Rich Sutton’s “Bitter Lesson”: over AI history, general methods that exploit computation have tended to beat hand-engineered, domain-specific approaches. ([Incomplete Ideas][2])

So the scaling camp was not foolish. It was based on real, repeated wins.

### 2. What “scale is not enough” means

The critics are not usually saying “bigger models do not help.” They are saying bigger models alone do not solve the hard parts of intelligence:

| Missing ingredient    | Why scale alone may not solve it                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Robust reasoning**  | Models can solve hard benchmark tasks yet fail on logically simple variants.                                        |
| **World models**      | Text prediction does not necessarily produce grounded understanding of physics, causality, agents, or consequences. |
| **Sample efficiency** | Humans learn new concepts from very few examples; models often need enormous exposure.                              |
| **Planning**          | Long-horizon goal pursuit requires state, memory, search, feedback, and action models.                              |
| **Causality**         | Pattern correlation is not the same as knowing what causes what.                                                    |
| **Reliability**       | Larger models can still hallucinate, overfit benchmarks, or behave unpredictably.                                   |
| **Agency and values** | An intelligent system needs stable goals, uncertainty handling, and safe decision procedures.                       |

### 3. Who has argued this?

**Yann LeCun** argues that current systems need architectures capable of learning world models, reasoning, planning, and abstraction, not just next-token prediction. His “A Path Towards Autonomous Machine Intelligence” proposes systems with predictive world models and planning-like components. ([OpenReview][3])

**Gary Marcus** has long argued that deep learning needs to be supplemented by other techniques for AGI. In *Deep Learning: A Critical Appraisal*, he explicitly says deep learning has made major progress but must be combined with other methods to reach general intelligence. ([arXiv][4])

**François Chollet** argues that benchmark skill is not the same as intelligence, because skill can be “bought” with enough prior knowledge, data, and training. He defines intelligence more in terms of **skill-acquisition efficiency**: how well a system learns new things under limited experience. ([arXiv][5])

**Yoshua Bengio** has argued for going “beyond scaling” toward systems with stronger inductive biases, modular world models, inference mechanisms, uncertainty handling, and causality. He specifically says further scaling is unlikely by itself to fix reliability issues in current large systems. ([Yoshua Bengio][6])

**Ilya Sutskever**, historically one of the strongest believers in scaling, has recently framed the field as moving from an “age of scaling” back to an “age of research.” He says 100× more scale would make systems different, but he does not think it would by itself transform everything; he identifies weak generalization relative to humans as a fundamental issue. ([dwarkesh.com][7])

### 4. The deeper issue: prediction versus understanding

Current LLMs are trained mainly to predict or generate sequences. That is astonishingly powerful because language encodes a huge amount of human knowledge. But prediction is not identical to understanding.

A model can learn that “glass falls and breaks” from text. But that is different from having an internal causal model of objects, gravity, force, brittleness, intention, action, and counterfactuals. It may produce correct text about the situation without being able to reliably plan in the situation.

That is why researchers like LeCun and Bengio emphasize **world models**: internal representations of how the world changes under actions.

### 5. The benchmark trap

One major criticism is that frontier models can look brilliant on benchmarks while still being brittle in real work. Sutskever points to a disconnect between strong evaluation performance and messy real-world usefulness, including coding agents that fix one bug while reintroducing another. He suggests poor generalization and overfitting to evaluation-like training environments may explain part of the gap. ([dwarkesh.com][7])

This is close to Chollet’s argument: a system’s real intelligence is not just “how many tasks can it perform?” but “how efficiently can it adapt to genuinely novel tasks?” ([arXiv][5])

### 6. What comes after pure scaling?

The likely answer is not abandoning scale. It is **scale plus better structure**:

1. **Better objectives** — not just next-token prediction, but objectives that learn persistent concepts, causality, uncertainty, and action consequences.
2. **World models** — systems that can simulate possible futures.
3. **Tool use and memory** — external calculators, code execution, databases, retrieval, long-term memory, and verifiable workflows.
4. **Inference-time computation** — letting models think, search, check, branch, and revise before answering.
5. **Reinforcement learning environments** — training systems through interaction, not only static text.
6. **Hybrid neuro-symbolic methods** — neural perception plus symbolic or programmatic reasoning where precision matters.
7. **Embodiment or interaction** — learning from acting in the world, not only reading about it.

Sutskever also notes that the field has already shifted from scaling pre-training to scaling reinforcement-learning-style training, but he questions whether “scaling” remains the right word if the real issue is finding more productive ways to use compute. ([dwarkesh.com][7])

### Bottom line

The best compressed version is:

> **Scale gives capability. Architecture, objectives, memory, tools, interaction, causality, and verification give reliability and generality.**

The “scale is not all you need” camp is not anti-scale. It is saying that intelligence is not a scalar quantity you get merely by increasing parameters and tokens. At some point, the bottleneck shifts from **more compute** to **better learning machinery**.

[1]: https://openai.com/index/scaling-laws-for-neural-language-models/?utm_source=chatgpt.com "Scaling laws for neural language models - OpenAI"
[2]: https://www.incompleteideas.net/IncIdeas/BitterLesson.html?utm_source=chatgpt.com "The Bitter Lesson - incompleteideas.net"
[3]: https://openreview.net/pdf?id=BZ5a1r-kVsf&utm_source=chatgpt.com "A Path Towards Autonomous Machine Intelligence Version 0.9.2, 2022-06-27"
[4]: https://arxiv.org/abs/1801.00631 "[1801.00631] Deep Learning: A Critical Appraisal"
[5]: https://arxiv.org/abs/1911.01547 "[1911.01547] On the Measure of Intelligence"
[6]: https://yoshuabengio.org/en/blog/scaling-service-reasoning-model-based-ml "Scaling in the service of reasoning & model-based ML | Yoshua Bengio"
[7]: https://www.dwarkesh.com/p/ilya-sutskever-2 "Ilya Sutskever — We're moving from the age of scaling to the age of research"
