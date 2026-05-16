# Society, Minds, Intelligence, and Skills — language check

> Research question: does the working phrase "a society is minds plus intelligence plus skills" fit the base design theory, and does it make linguistic sense to a human reader?

## Short answer

The phrase is close, but it should not be used as an equation.

A Society of Repo is not the arithmetic sum of Minds, Intelligence, and Skills. The base theory says that intelligence appears in the governed interaction between many bounded parts. In the Forgejo Society design, those parts require a forge, shared identity, authority, memory, critics, censors, settlement, and a cognitive loop before they become a Society.

A stronger human-facing formulation is:

> A Society emerges when a governed forge coordinates Minds, Intelligences, and Skills through shared memory, authority, and settlement.

For shorter public copy:

> Minds bring purpose. Intelligences connect repos. Skills give governed capabilities. The forge makes them a Society.

## Check against the base theory

### 1. Minsky: the whole is not a sum

The Society of Mind grounding says that a mind is not one thing. It is the result of many limited agents interacting through a structured ecology. The project restates this directly in `THE-SOCIETY-OF-REPO/00-foundations/01-society-of-mind.md`: intelligence emerges from structured interaction, insulation, representation, and revision.

That matters for the proposed phrase. "Society = minds + intelligence + skills" sounds like simple addition. The theory says something stricter: the structure between the parts is where the intelligence lives. Without the structure, there are only components.

So the phrase is directionally right, but incomplete.

### 2. Society of Repo: the Society is governed interaction

`THE-SOCIETY-OF-REPO/README.md` defines a Society of Repo as a Git-native architecture where repositories become durable cognitive organs and intelligence emerges from the structured interaction of many small, specialised, limited parts.

The same file gives the stronger principle:

> The intelligence is located in the structured interaction between them, and in the society's ability to represent, remember, compare, inhibit, revise, and observe itself.

That means a human explanation should not imply that Minds, Intelligences, and Skills are sufficient by themselves. They become a Society only when the forge binds them into a governed loop.

### 3. Composition model: the nouns are not the same kind of thing

`FORGEJO-SOCIETY-INTRODUCTION/analysis/composition-model.md` separates the vocabulary:

- **Society** is the outer container: named, governed, scoped, and remembered.
- **Mind** is the unit of cleverness inside the Society.
- **Intelligence** is the installable component that brings a repo into the Society.
- **Repo** is the unit of work owned by a Mind.

This helps, but it also creates a linguistic problem. The phrase "minds plus intelligence plus skills" puts unlike nouns beside each other:

- **Minds** are actors.
- **Intelligences** are installed connectors or runtime participants.
- **Skills** are governed capabilities.
- **Society** is the governed ecology that contains and coordinates them.

A human reader may hear "minds" and "intelligence" as near-synonyms. In this project they are not synonyms, so public language should name what each one does.

### 4. Skills: capability is not enough

`THE-SOCIETY-OF-REPO/00-foundations/05-skills.md` says that Skills are constitutional capabilities, not prompts. It also places every Skill inside the same cognitive loop: stimulus, perception, frame selection, activation, agency response, criticism, inhibition, settlement, action, memory, credit assignment, and ecology review.

So Skills are necessary, but not sufficient. A Skill becomes part of the Society only when it is activated, criticised, constrained, settled, remembered, and revised.

### 5. Mind–Brain–Body: do not collapse the layers

`THE-SOCIETY-OF-REPO/00-foundations/06-mind-brain-body.md` separates:

- **Body** — forge, runners, storage, tools, network, interfaces.
- **Brain** — models, classifiers, retrieval indexes, pattern matchers.
- **Mind** — governed cognition: settlements, critics, censors, constitutions, self-ideals, reasoning traces.

This argues against saying simply that "society equals minds plus intelligence plus skills." The phrase omits the body layer, and the body layer matters because the forge is the substrate that makes memory, authority, and audit possible.

## Linguistic diagnosis

The phrase has three problems.

1. **It sounds mathematical.** "Equals" suggests a definition by addition, but the design is an emergence claim.
2. **It repeats related words.** To a general reader, "minds" and "intelligence" overlap unless the sentence explains the difference.
3. **It omits the binding mechanism.** The project thesis is not only that Minds, Intelligences, and Skills exist. It is that the forge governs them through durable records, authority, memory, and settlement.

The fix is to move from an equation to a sentence with verbs.

## Recommended wording

### Best general sentence

> A Society emerges when a governed forge coordinates Minds, Intelligences, and Skills through shared memory, authority, and settlement.

Why it works:

- "emerges" matches the base theory better than "equals";
- "governed forge" keeps the substrate visible;
- "coordinates" gives the sentence a human verb;
- "shared memory, authority, and settlement" names the binding mechanisms.

### Plain-language version

> A Society is a governed forge where Minds pursue purposes, Intelligences connect repos, and Skills provide accountable capabilities.

Why it works:

- It explains each noun by function;
- it avoids mystical language;
- it is easy to say aloud.

### Short public line

> Minds bring purpose. Intelligences connect repos. Skills give governed capabilities. The forge makes them a Society.

Why it works:

- It is memorable without becoming vague;
- it preserves the project thesis that the forge is load-bearing;
- it keeps "Society" as the result of governance, not just a pile of parts.

### If an equation is needed

Use this only as a shorthand after the terms have been explained:

```text
Society ≈ governed forge + Minds + Intelligences + Skills + shared memory + settlement
```

Even then, "≈" is better than "=" because the claim is architectural, not arithmetic.

## Terms to use consistently

| Term | Human meaning | Design meaning |
| --- | --- | --- |
| Society | The governed whole | The outer container with one constitution, authority registry, memory spine, and identity scope |
| Mind | A purposeful actor | The unit of cleverness inside a Society |
| Intelligence | A repo connector | The installable component that lets a repo participate in the cognitive loop |
| Skill | A capability | A constitutional capability, exercised through the cognitive loop |
| Forge | The place it happens | The owned Forgejo substrate that provides events, workflow execution, permissions, history, review, and audit |

## Final recommendation

Do not say:

> Society equals minds plus intelligence plus skills.

Say:

> A Society emerges when a governed forge coordinates Minds, Intelligences, and Skills through shared memory, authority, and settlement.

Or, when speaking more plainly:

> The Mind decides what matters. The Intelligence connects a repo to the loop. The Skills define what can be done. The forge records, governs, and settles the work, which is what makes the whole thing a Society.
