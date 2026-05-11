# 02 — Annotated Glossary

The Society of Mind introduces a large vocabulary, often in passing. This
glossary collects the named constructs in one place, with a paraphrase, the
role they play, and where applicable a Society-of-Repo mapping.

Entries are grouped by what kind of thing they are.

---

## A. Process units

### Agent

> **Minsky:** "Each agent by itself can only do some simple thing that needs
> no mind or thought at all."

The atomic process. An agent is small, narrow, and individually mindless. It
does one thing. The interesting question about an agent is never "is this
intelligent?" but "what does it connect to and inhibit?".

- **Insight:** an agent is *not* a person, not an LLM call, and not a
  service. It is the smallest useful process inside the society.
- **SOR mapping:** a single handler function, a single critic check, a
  single censor rule, a single memory writer.

### Agency

A bundle of agents that, taken together, accomplishes something larger than
any of them. Agencies have boundaries: information passes through their
edges in compressed form.

- **Insight:** the *agency* is the right unit of governance. Authority,
  rights, and reputation attach to agencies, not to individual agents.
- **SOR mapping:** an agency repo with a constitution under
  [SOCIETY-OF-REPO/03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md).

### Society

The whole organised collection of agencies. The mind is a society. A society
of societies is still a society. Recursion is allowed and expected.

- **SOR mapping:** the entire SOR for one organisation; multiple SORs joined
  by service channels form a meta-society.

---

## B. Communication units

### Neme (nome / N-line)

A unit of representation that stands for a recognised concept or state. The
word is Minsky's general term; he then specialises it.

> **Minsky:** "We have agents that recognise a certain kind of state of mind
> or — if we dare to use the phrase — a certain combination of ideas."

### Polyneme

A neme that activates *different* meanings in different agencies at the same
time. The word "apple" is a polyneme: in the colour agency it activates
"red", in the shape agency "round", in the taste agency "sweet", in the
hand agency "graspable".

- **Insight:** a polyneme is how one symbol can mean different things in
  different parts of the mind without contradiction. Each agency reads its
  own slice.
- **Critique:** polynemes presuppose well-developed receiving agencies;
  Minsky never specifies how they are coordinated.
- **SOR mapping:** a typed event whose handlers each interpret only the
  fields that concern them.

### Microneme

A very low-level neme — a feature so small it has meaning only to a tiny
local agency. Most micronemes are invisible to higher levels; they are the
"hidden units" of perception.

### Isonome

A neme whose meaning is *the same* across many agencies — a control signal
rather than a content signal. "Now," "this," "compare," and "remember" act as
isonomes: they tell other agencies *how* to operate, not *what* about.

- **Insight:** isonomes are why a mind can have shared verbs even when its
  agencies have private nouns.
- **SOR mapping:** orchestrator-issued lifecycle signals (`activate`,
  `settle`, `inhibit`, `commit`).

### Pronome

A short-term, role-binding neme — like a placeholder that says "the actor in
this current scene". Pronomes are how the mind keeps track of "who is doing
what to whom" without rewiring permanently.

- **SOR mapping:** the per-event session keys that bind a stimulus to its
  current actors and targets.

---

## C. Memory units

### K-line (knowledge line)

> **Minsky:** "Whenever you 'get a good idea' or solve a problem or have a
> memorable experience, you activate a K-line to 'represent' it. A K-line is
> a wirelike agent that attaches itself to whatever mental agents are active
> when you solve a problem or have a good idea."

A K-line is a recorded *activation pattern*. To remember a useful state, you
do not store the state — you store a pointer to the agents that produced it.
Reactivating the K-line reconstructs (an approximation of) the state.

- **Insight:** memory is not storage of contents; it is storage of *who was
  active*. Recall is reconstruction, not retrieval.
- **Insight:** the same agent may belong to many K-lines. The bicycle/red,
  cooking/green, music/blue colour metaphor in the 1986 source captures this.
- **SOR mapping:** the K-line memory class under
  [SOCIETY-OF-REPO/06-memory/](../SOCIETY-OF-REPO/06-memory/README.md).

### Level-band

A horizontal slice of the agency hierarchy. Most communication happens
within or between adjacent level-bands. Skipping level-bands is rare and
usually unsafe.

> **Minsky (ONR 1988):** "Hence relatively few direct connections are needed
> except between adjacent 'level bands'."

- **Insight:** depth without level-bands is chaos; bands are what make a
  hierarchy navigable.
- **SOR mapping:** the surface / coordination / agent-engine layers in
  [02-protocols/16-forgejo-runtime-layers.md](../SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md).

---

## D. Representation units

### Frame

A structured template with named slots and default values. A frame for
"restaurant" has slots for *waiter*, *menu*, *bill*. When you walk into a
restaurant you do not perceive raw light; you fill in a frame.

> **Minsky:** "Defaults don't make strong images, and when they turn out
> wrong, we aren't too surprised."

- **Insight:** most of what feels like "understanding" is frame-fitting.
  Defaults make the world tractable.
- **SOR mapping:** frame memory under
  [SOCIETY-OF-REPO/06-memory/](../SOCIETY-OF-REPO/06-memory/README.md).

### Transframe

A frame for *change*: actor, action, object, before-state, after-state,
purpose, instrument. Transframes generalise the "conceptual dependency"
representations Roger Schank's group developed at Yale.

- **Insight:** stories, plans, and causal explanations all share transframe
  shape. This is why narrative is so cognitively cheap.
- **SOR mapping:** the structure of a settlement record in
  [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md).

### Frame-array

A bundle of related frames that share most slots but differ on one
dimension. Used to handle viewpoint shifts (rotating an object, walking
around a room) without rebuilding the world.

### Default assumption

A slot value that holds until contradicted. Most of what the mind "knows" is
default assumptions, not certainties.

> **Minsky:** "Perhaps the larger part of what we know is represented by
> default assumptions, since there is so little we know with perfect
> certainty."

---

## E. Inhibition units

### Censor

A process that *prevents* a thought from forming. Censors learn from past
mistakes: "do not even start down this path." They are silent when they
work, which is why they are easy to overlook.

- **Insight:** the most reliable cognition is the cognition that never
  happened.
- **SOR mapping:** censor repos under
  [SOCIETY-OF-REPO/05-censors/](../SOCIETY-OF-REPO/05-censors/README.md).

### Suppressor

A process that *interrupts* a thought already in progress. Suppressors are
slower and more expensive than censors; they fire when censorship has
failed.

- **Insight:** the censor / suppressor split is exactly the difference
  between "cannot start" and "must stop".

### Critic

A process that challenges a proposal *after* it has formed but *before* it
becomes action. Critics are the loudest of the inhibitory family because
they leave traces (objections, evidence, counter-examples).

- **SOR mapping:** critic repos under
  [SOCIETY-OF-REPO/04-critics/](../SOCIETY-OF-REPO/04-critics/README.md).

---

## F. Self units

### Self-model

An internal representation of one's own capabilities, history, and
limitations. Self-models are necessarily simpler than the self they model.
They are wrong by construction; the question is only *how usefully* wrong.

### Self-ideal

A relatively stable picture of who one *should* be. Self-ideals form early,
in infancy, and are deliberately hard to change. This rigidity is a feature:
without it, casual experimentation could destabilise personality.

> **Minsky:** "Few of us would survive if, left to random chance, our most
> adventurous impulses could freely tamper with the basis of our
> personalities."

- **SOR mapping:** the self-ideals registry under
  [SOCIETY-OF-REPO/01-governance/](../SOCIETY-OF-REPO/01-governance/README.md).

### B-brain

A second brain whose *world* is the first (A-) brain. The B-brain watches
patterns in the A-brain — "you are stuck", "you are repeating yourself",
"you are confused" — and steers without needing to understand the content
of the A-brain's thoughts.

> **Minsky:** "Connect the A-brain's inputs and outputs to the real world,
> so it can sense what happens there. But don't connect the B-brain to the
> outer world at all; instead, connect it so that the A-brain is the
> B-brain's world!"

- **Insight:** introspection is not the same agency thinking about itself;
  it is *another* agency thinking about the first.
- **SOR mapping:** the meta-admin role layer of SOR — agencies that watch
  the workspace, the settlements, and the ecology rather than the world.

---

## G. Conflict and decision units

### Compromise

A merged decision averaged from competing agencies. Minsky regards it as
usually a *failure*, because it corrupts both representations and prevents
either from learning.

### Settlement (Minsky's sense)

The visible record of how a decision formed: which agencies activated,
which were inhibited, which were escalated. This is *not* the modern
"settlement" used informally for "a deal" — it is closer to a court record.

- **SOR mapping:** the settlement protocol in
  [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md).

---

## H. Learning and growth units

### Differentiation

A previously single agency splits into two specialised ones, each handling
a context the original confused. Most cognitive growth is differentiation,
not addition.

### Cache transfer

The slow process by which a recent experience is consolidated from a
fast-write short-term store into long-term, structured memory. Minsky's
ONR-era conjecture is that this slowness is *useful*: the consolidation
window is when credit is assigned and structure is found.

> **Minsky (ONR 1988):** "It takes a long time — typically of the order of
> an hour — for the records of that experience to become firmly lodged in
> what psychologists call long-term memory."

### Zone refining

A layered learning strategy: stabilise the layers nearest the input and
output first; only then let interior layers organise; iterate. Borrowed
metaphor from materials science.

---

## I. Things often *mistaken* for first-class concepts

These appear in the book but are not what they look like.

| Surface concept | What it actually is |
|---|---|
| "The unconscious" | Just: the agencies the conscious self-model has no access to. Not a separate place, not a separate self. |
| "The self" | The currently dominant self-model, plus the self-ideal, plus the agencies that defend both. There is no central self. |
| "Free will" | The visible part of a settlement among censors, critics, and proposing agencies. Felt as choice; mechanically a process. |
| "Memory" | Reconstruction by K-line activation, not retrieval of stored contents. |
| "Understanding" | Successful frame-fitting, not propositional truth. |
| "Common sense" | An immense society of small practical agencies acquired in infancy. Not simple, only old. |

Each of these mistakes is the move that the book is trying to undo.

---

## J. Vocabulary not from Minsky but used in this workspace

| Term | Source | Use |
|---|---|---|
| **Settlement** (workspace sense) | Society of Repo | A governed visible decision record drawing on Minsky's record-of-formation idea. |
| **Stimulus / activation / settlement / action / memory loop** | Society of Repo, generalising Minsky's chapter ordering | The recurring SOR cognitive loop. |
| **Insulation** (engineering sense) | ONR 1988, extended | Protected independence between subsystems with controlled shared state. |
| **Representation discipline** | Society of Repo, extending Minsky's representation pluralism | The rule that an artifact must be classified by representation kind before it is stored. |
| **Ecology monitoring** | Society of Repo, extending B-brain | Society-level self-regulation across agencies. |
