# How the THE-SOCIETY-OF-REPO Functions at the Coal Face

> **The forge is the mind. The repo is an agency. The society thinks.**

The phrase *at the coal face* matters here. It is easy to describe a Society of Repo (SOR) in elegant theoretical language — frames, K-lines, critics, censors, settlements, ecology monitoring. It is harder, and more honest, to describe what actually happens minute-by-minute inside Forgejo when a real stimulus arrives, when a real worker has to respond, when a real critic objects, when a real censor blocks, and when a real human owner has to be told that something was, or was not, done in their name.

This essay walks the loop at that level: what files move, what events fire, what repos wake up, what the runner does, and where the friction lives.

---

## 1. The shift from "AI assistant" to "governed ecology"

At the coal face, the most important thing the SOR does is reframe the question. A conventional AI coding assistant asks: *what should I generate next?* A Society of Repo asks: *which small, bounded, inspectable part of me should respond to this stimulus, under which frame, with which precedents, against which critics, within which censorship limits, and with what evidence written back into my durable memory?*

That reframing is not rhetorical. It is operational. Every one of those nouns — part, frame, precedent, critic, censor, memory — is a directory, a file, an event, a label, a branch, a pull request, or a merge in a real Forgejo instance. The cognitive loop is not a diagram on a wall. It is a sequence of `git` operations, workflow runs, and state transitions inside `.forgejo-intelligence/state/`.

The SOR is a way of making intelligence **physical** in the forge.

---

## 2. The substrate: what the forge actually provides

At the coal face, the forge gives the SOR seven cheap, durable, inspectable primitives:

| Forgejo primitive | Cognitive role |
|---|---|
| issues | stimuli |
| labels | activation signals |
| commits | memory (append-only) |
| branches | insulated futures and experiments |
| pull requests | proposed actions |
| reviews | criticism and inhibition |
| merges | accepted changes to the organism |

That is the entire vocabulary. The SOR does not need a vector database, a bespoke orchestration framework, or a proprietary agent runtime to begin functioning. It needs a forge that can run workflows, store text, version it, branch it, review it, and merge it. Forgejo already does all of that.

The runtime sits in two well-defined places. `.forgejo/workflows/` is the event loop and runner entrypoint — this is where the heart beats. `.forgejo-intelligence/` is the runtime surface: coordinators, agent engines, transcripts, session mappings, and the git-tracked kill switch (`forgejo-intelligence-ENABLED.md`). Governance, protocols, agencies, critics, censors, memory, and workspace specifications live in `THE-SOCIETY-OF-REPO/`. The split matters at the coal face because it is what allows an operator to *stop the mind* — by editing one tracked file — without dismantling its memory.

---

## 3. A stimulus arrives

Pick the most ordinary case. A user opens an issue in an agency repo: *"the nightly build is failing on ARM."*

Nothing magical happens yet. A workflow in `.forgejo/workflows/` triggers on the `issues.opened` event and hands the payload to the surface layer in `.forgejo-intelligence/`. The surface handler does three small, boring things:

1. It writes an event record under `06-memory/events/` with a dot-separated identifier of the form `event.{domain}.{type}.{sequence}`, and stamps `event.metadata.sor_id` with the owning society's identifier.
2. It applies activation labels (`activation:perception-needed`, `activation:budget-default`) so other repos can see what is in flight.
3. It pushes a focus pointer into `07-workspace/current-focus/` so anyone — agency or human — looking at the workspace knows what the society is currently attending to.

That is the perception step at the coal face: not magic, just structured inscription.

---

## 4. Frame selection and K-line activation

Before any worker generates a single token of response, the society asks: *what kind of situation is this?*

A perception agent reads the event, classifies features (`build-failure`, `architecture-specific`, `ci-only`, `non-customer-facing`), and queries `06-memory/frames/` for matching frames. A `build-failure-on-architecture` frame supplies defaults: which procedures usually apply, which failure modes have happened before, which critics tend to be relevant, and which K-lines (remembered activation patterns from past similar situations) should fire.

The K-line lookup is the pragmatic engine of the society. The forge has been recording, for every prior settled stimulus, *which combination of agencies, critics, and procedures actually produced a useful outcome*. When a similar stimulus reappears, those K-lines re-activate the same combination, scaled by past credit-assignment scores. If no frame matches strongly, the analogy pass widens the search to structurally similar situations in different domains.

At the coal face, this is what prevents the society from re-deriving every response from first principles. Most of the work the SOR does on day 90 is not new thinking — it is *re-firing patterns that worked* and inhibiting patterns that did not.

---

## 5. Agency response: many small workers, none in charge

Now the relevant agencies wake up. For our stimulus, that might be: a `agency.build-diagnostics` repo, a `agency.arm-toolchain` repo, and a `agency.ci-cache` repo. Each is a separate repo with its own constitution, its own bounded scope, and its own authority level (`read`, `draft`, `propose`, `act`, `govern`, or `human` — and never anything else).

Each agency does the smallest useful thing it can. None of them tries to "solve the problem." `agency.build-diagnostics` opens a draft pull request with a parsed log and a hypothesis. `agency.arm-toolchain` opens a draft PR with a candidate toolchain version bump. `agency.ci-cache` opens a draft PR proposing a cache invalidation.

Three proposals now exist as branches. Nothing has been merged. Nothing has touched `main`. The branches are the **insulated futures** of the society — independent, parallel, cheap to discard.

This is the most counterintuitive thing about the SOR at the coal face. *There is no orchestrator deciding who responds.* Activation is broadcast through labels and events; agencies subscribe to what concerns them; multiple competing proposals are normal and desired. The intelligence is in the **structured competition**, not in a dispatcher.

---

## 6. Criticism: the value of being told no

Once draft PRs exist, the critics fire. Critics are themselves repos in `04-critics/` — `evidence`, `scope`, `cost`, `privacy`, `risk`, `overconfidence`, `source-quality`, `staleness`. Each critic subscribes to PR-opened events that match its concern and writes a review comment.

At the coal face this looks like ordinary code review, but the critics are mechanical. The `evidence` critic checks whether the PR cites a memory record, an event, or a prior decision. The `overconfidence` critic checks whether the proposal admits its unknowns and writes them into `06-memory/introspection/`. The `staleness` critic checks whether the cited K-lines are still considered reliable. The `cost` critic estimates token, runner-minute, and human-attention cost against the stimulus's starting budget.

A critic does not decide. A critic *objects*, with a structured score. Objections are inputs to the settlement step, not vetoes.

This is where many naive multi-agent systems fail and the SOR succeeds: **criticism is a first-class, persistent, versioned artifact**. Every objection becomes a comment on a PR, which becomes part of the merge commit, which becomes part of git history. Future credit assignment can ask, six months later: *did the critic that objected turn out to be right?*

---

## 7. Graduated inhibition and censorship: the difference between "no" and "never"

Inhibition and censorship are not the same thing, and the distinction is enforced at the coal face by which repo speaks.

A critic *inhibits*: it raises the cost of a proposal. Several mild inhibitions can still permit a settlement; a single strong one usually cannot. Inhibition is graduated, contextual, and overridable by sufficient counter-evidence.

A censor *blocks*. Censors live in `05-censors/` and cover a small, bright-line set: `cloud-egress`, `authority`, `payment`, `delegation`, `credential`, `pii-exfiltration`. A censor's veto is absolute within its domain. A PR that the `cloud-egress` censor blocks does not get to argue about cost-benefit. It does not merge. The runner refuses.

In Forgejo terms, censors are typically realised as required status checks owned by a censor repo. The check fails closed. There is no path through. The only way past a censor is a `human` authority approval, recorded explicitly, with a written justification that becomes part of the policy ledger in `01-governance/`.

At the coal face, this is what makes the society safe to run unattended. The owner is not relying on a model to be careful. They are relying on a small number of small, auditable repos that say *no* in well-defined situations and cannot be talked out of it by an eloquent worker.

---

## 8. Settlement: choosing under uncertainty

After critics have spoken and censors have either blocked or stayed silent, settlement happens. A settlement is a written, identified record (`settlement.*`) in `07-workspace/settlements/` that captures:

- which proposals were considered,
- which frame and K-lines were active,
- which critics objected and how strongly,
- which censors were satisfied,
- which proposal (if any) was selected,
- which authority level was required,
- which unknowns were carried forward.

Settlement is the moment the society *commits to a story about what it just did*. That story is durable. It survives crashes. It survives operator turnover. It is queryable by future stimuli.

For our build-failure example, the settlement might select the `agency.arm-toolchain` proposal, note that `agency.ci-cache` raised a useful structural objection, and record that the `agency.build-diagnostics` hypothesis was confirmed and should reinforce the relevant K-line.

---

## 9. Action: the merge, and the moment the world changes

Action is just the merge. The selected PR is merged into the target branch (usually a workspace or staging branch first, occasionally `main` directly when authority permits). The merge commit references the settlement ID and the originating event ID.

This is the only point in the entire loop where the society's state outside its own memory changes. Everything before this — proposals, critics, censors, settlement — has been internal deliberation captured as branches and comments. Action is the line between deliberation and consequence.

The runner is restricted by authority. An agency with `propose` authority can open PRs but cannot merge. An agency with `act` authority can merge into bounded targets. Only `govern` authority can change governance files. Only `human` authority can override censors. These are not honour-system rules; they are enforced by the workflow runner refusing to perform merges that the agency's authority registry entry does not permit.

---

## 10. Outcome, memory, and credit assignment: closing the loop honestly

After action, the outcome must be observed. For our example, that means watching the next nightly build and writing the result back as a new event linked to the original settlement. The link is typed (in `06-memory/relational/`), so the society can later ask: *for the last 30 build-failure stimuli, what was the outcome distribution per frame, per K-line, per agency?*

Credit assignment, the step that almost every multi-agent system skips, is what makes the SOR a *learning* society rather than a merely *acting* one. A credit-assignment pass attributes the outcome — good, bad, mixed — to:

- the frame that was selected,
- the K-lines that fired,
- the agencies whose proposals were considered,
- the critics whose objections were heeded or overruled,
- the settlement procedure used.

These attributions are written into `10-evolution/`. Over time they reinforce the K-lines that help, retire the ones that don't, differentiate agencies that grow too broad, and flag for review any critic whose objections were always overruled (probably miscalibrated) or always accepted (probably redundant).

This is the pulse of the society's slow self-improvement. It is not a separate training run. It is just commits.

---

## 11. Introspection: writing down what the society does not know

Every non-trivial settlement writes to `06-memory/introspection/`. This is the society's record of its own opacity: which features were classified with low confidence, which unknowns were carried forward, which model calls were treated as opaque, which K-lines were applied without strong evidence.

At the coal face this is the single most useful surface for the human owner. It is the answer to the question every operator eventually asks: *what does my society not know that it doesn't know?* The introspection log makes that question tractable. It does not eliminate ignorance, but it inventories it.

---

## 12. Insulation, hierarchy, and the discipline of staying small

Two structural disciplines keep the coal face from collapsing into chaos.

**Insulation**: subsystems are independent by construction. An agency repo does not import another agency repo's internals. They communicate through events, labels, PRs, and service repos in `08-services/`. If one agency goes wrong — bad model, bad commit, runaway loop — its blast radius is its own repo. The `forgejo-intelligence-ENABLED.md` kill switch can stop the mind without losing memory.

**Hierarchy**: assembly repos compress lower-level outputs into higher-level summaries (and propagate higher-level directives downward). The owner does not read every event. The owner reads the briefings in `07-workspace/` that the assembly layer produced. Compression is what makes the society legible at human scale.

Both disciplines exist to fight the same failure mode: a society that becomes one big tangled thing nobody can read. The SOR is *deliberately* many small useful intelligences rather than one large opaque one.

---

## 13. Where the friction actually lives

It would be dishonest to describe the coal face as smooth. Real friction includes:

- **Latency**: the loop is slower than a single-shot LLM call. A stimulus may take minutes to settle, not seconds. This is a feature for governance and a cost for interactivity.
- **Cost discipline**: every stimulus carries a budget. Critics that re-prompt expensive models exhaust budgets fast. Cheap, cached, K-line-driven responses must dominate.
- **Frame drift**: frames silently age. The `staleness` critic is essential and itself needs maintenance.
- **Critic cartels**: critics that always agree become noise. Periodic ecology review must prune them.
- **Agency sprawl**: it is easy to spawn agencies and hard to retire them. `10-evolution/` includes explicit retirement protocols for a reason.
- **Censor brittleness**: a censor that fails open is worse than no censor. Censors must be tested with adversarial fixtures, per `02-protocols/17-forgejo-operational-verification.md`.
- **Human attention**: the society generates a lot of artifacts. Without good assembly summaries, the owner stops reading, which defeats the point.

None of these is fatal. All of them are work. The SOR is a discipline, not a free lunch.

---

## 14. What this looks like on a Tuesday morning

Concretely, on a Tuesday morning, a human operator running an SOR sees:

- a small number of new briefings in `07-workspace/` summarising what happened overnight,
- a current-focus pointer to whatever the society is attending to right now,
- a short list of settlements that needed `human` authority and are awaiting them,
- an introspection digest listing the unknowns that accumulated,
- a credit-assignment report flagging any K-lines or critics that look miscalibrated.

The operator is not reviewing every PR. They are reviewing the society's *summary of itself*. That is the experience the architecture is designed to deliver. It is the difference between supervising a junior developer and supervising a small organisation.

---

## 15. Why the coal face matters

The Society of Repo design is sometimes presented as poetry — the forge as mind, the repo as agency, the society as thought. The poetry is true. But the poetry is not what runs in production. What runs in production is workflows, events, labels, branches, PRs, reviews, merges, dot-separated identifiers, authority registries, settlement records, and credit-assignment logs.

The reason the architecture works at the coal face is that every cognitive concept maps to a concrete, durable, inspectable, version-controlled artifact. Frames are files. K-lines are files. Critics are repos. Censors are required checks. Settlements are commits. Memory is git history. Authority is enforced by the runner. The kill switch is a tracked file.

Intelligence emerges from the structured interaction of many small governed parts. None of those parts has to be brilliant. Each only has to be small, bounded, inspectable, and willing to be told no.

That is how a Society of Repo functions at the coal face: not as one big mind, but as a forge full of small honest ones, arguing in branches, settling in commits, and learning by being graded by their own future selves.
