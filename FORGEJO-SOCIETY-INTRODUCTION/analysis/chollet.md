# François Chollet

Minsky gives you the society.

Chollet gives you the economy of learning inside that society.

Your theory should become:

A mind is a society of small agents, but intelligence is not the mere presence of many agents. Intelligence is the society’s ability to assemble existing agents into a new skill under novelty, verify that skill, and then compress the successful coalition back into reusable memory.

That is the bridge.

Chollet’s central definition is that intelligence is skill-acquisition efficiency: how efficiently a system acquires new skills, given its priors, experience, and generalization difficulty. ([arXiv][1]) In the transcript, he restates this more practically: intelligence is handling novelty by building useful models on the fly, not merely repeating memorised behaviour. 

So your Minsky theory should shift from:

“Many agents cooperate to produce thought.”

to:

“Many agents form temporary coalitions that synthesise new executable models from reusable abstractions.”

## The Chollet-Minsky Fusion

| Minsky term  | Chollet refinement        | Your implementation meaning                                                     |
| ------------ | ------------------------- | ------------------------------------------------------------------------------- |
| Agent        | Reusable abstraction      | A small cognitive primitive: detect, transform, compare, verify, remember, plan |
| Agency       | Coalition of abstractions | A temporary working group assembled for one problem                             |
| K-line       | Stored synthesis trace    | A memory that reactivates a successful coalition                                |
| Frame        | Prior structure           | A reusable model template for interpreting a situation                          |
| Society      | Abstraction library       | The living store of reusable cognitive parts                                    |
| Learning     | Abstraction generation    | Compress successful solutions into new reusable agents                          |
| Reasoning    | Program synthesis         | Compose agents into a candidate procedure                                       |
| Common sense | Core priors               | Built-in object, space, causality, goal, identity, containment, sequence ideas  |
| Reflection   | Verification              | Test whether the coalition’s answer is actually correct                         |

The big design insight:

Minsky’s agents should not be “personalities.”

They should be cognitive primitives.

For example:

* Object detector
* Difference finder
* Symmetry detector
* Goal recogniser
* Tool selector
* Constraint checker
* Causal simulator
* Memory retriever
* Plan proposer
* Verifier
* Refactorer
* Abstraction miner

That makes your Society of Mind much closer to Chollet’s “abstraction acquisition and recombination” model. Chollet’s later writing states this directly: intelligence consists of abstraction acquisition and abstraction recombination. ([Deep Learning with Python][2])

## The Key Addition: Synthesis Engine

Add a central process called something like:

The Coalition Synthesizer

Its job:

Given a novel problem, search the society for relevant agents, compose them into a temporary working program, execute/test it, and revise.

This maps exactly to Chollet’s idea that intelligence has a “synthesis” side: combining existing abstract building blocks into a model for the current task. The transcript also describes the reverse process, “abstraction generation,” where experience and produced models are distilled into reusable abstractions for next time. 

So your architecture becomes:

Input
→ novelty detector
→ retrieve possible agents
→ synthesize coalition
→ run candidate model
→ verify result
→ if successful, compress coalition into memory
→ if reusable, promote it into a new agent or K-line

## The Critical Correction to Minsky

Minsky can sound like:

“Thought emerges from many agents.”

Chollet forces you to ask:

“But can the society handle something genuinely new?”

That is the missing test.

A Minsky system that merely routes known tasks to known agents is not intelligent in Chollet’s sense. It is skilled, not intelligent.

A Chollet-compatible Minsky system must be judged by:

How few examples does it need to form a new useful skill?

How far outside its training distribution can it go?

Can it build a new model rather than retrieve an old answer?

Can it verify the model?

Can it store the lesson as a reusable abstraction?

## LLMs in Your Design

Do not make the LLM the mind.

Make the LLM an intuition agent.

Chollet’s warning is that LLMs are useful suggestion engines, but their outputs are often directionally right rather than exactly right; they need external verification. In the transcript, he explicitly says an LM should generate candidates, while an external verifier checks them. 

So in your system:

LLM = intuition / hypothesis generator
Symbolic tools = verification / execution
Memory = K-lines / abstraction library
Planner = synthesis engine
Critic = correctness filter
Refactorer = abstraction generator

That is very strong.

## Design Doctrine You Can Use

Here is the refined theory statement:

The Chollet-Minsky architecture treats mind as a society of reusable cognitive abstractions. Each agent is not a chatbot persona but a small skill, detector, transformation, verifier, or model fragment. Intelligence emerges when the system can rapidly synthesize temporary coalitions of these agents to handle novel situations, test the resulting model against reality, and compress successful coalitions into new reusable abstractions. Memory is not passive storage; it is the reactivation of useful agent coalitions. Learning is not parameter accumulation; it is the creation of better abstractions for future synthesis.

That is the whole bridge.

## Your Most Important Architectural Rule

Do not build:

agent → response

Build:

agents → candidate model → verification → reusable abstraction

That one change brings Chollet directly into Minsky.

## A Good Name for the Combined Theory

The Society of Abstractions

or more technically:

A Chollet-Minsky Society of Mind:
An abstraction economy for novelty-driven skill synthesis.

The slogan:

Minsky tells us the mind is many.
Chollet tells us what the many must do: acquire new skills efficiently under novelty.

[1]: https://arxiv.org/abs/1911.01547?utm_source=chatgpt.com "[1911.01547] On the Measure of Intelligence"
[2]: https://deeplearningwithpython.io/chapters/chapter19_future_of_ai?utm_source=chatgpt.com "Chapter 19 - Deep Learning With Python"
