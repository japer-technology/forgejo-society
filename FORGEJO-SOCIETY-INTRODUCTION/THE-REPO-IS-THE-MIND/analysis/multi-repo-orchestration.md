# Multi-Repo Orchestration

How the top repo — the one that talks to humans — copies its workflow (the
mind), runs in install mode to lay down a body of organ repos, and then, in
governed dialogue with a human, spawns the further repos that the overall
society needs to function.

This analysis is grounded in `THE-SOCIETY-OF-REPO/` and in particular:

- `00-foundations/10-bootstrap-minimum-viable-sor.md` (the MV-SOR seven repos)
- `00-foundations/06-mind-brain-body.md` (the layer split)
- `02-protocols/01-identity.md` (identity)
- `02-protocols/02-constitution.md` and `08-governance.md` (constitutions and
  approval gates)
- `02-protocols/15-forgejo-environment.md` (the Forgejo deployment contract)
- `01-governance/approval-gate.md` (the `agency_spawn` approval category)
- `10-evolution/README.md` (differentiation and bootstrap protection)

The intent of this document is to take the architectural commitments already in
the repository and read them as a single, executable orchestration story: how
one human starts with one repo and ends up — slowly, deliberately, and on the
record — with a small ecology of cooperating repos.

---

## 1. The mental model

Three nested ideas have to be held at once.

1. **The forge is the mind.** The repository host (Forgejo) is not a passive
   store; it is the substrate on which the cognitive loop runs. Issues are
   stimuli, labels are activation signals, commits are memory, pull requests are
   proposed actions, reviews are criticism, merges are accepted change.
2. **A repo is an agency (an organ).** Each repository is one bounded part of
   the mind — a worker, a critic, a censor, a memory, a workspace, a service.
   No single repo is "the AI". Intelligence emerges from their structured
   interaction.
3. **The mind has to be installed into a body.** A specification on disk is not
   yet a society. Something has to take the spec, copy it into a forge, wire up
   workflows, create the seven minimum organs, and then keep growing the body
   one approved organ at a time as real stimuli demand it.

The "top repo" in the user's question is the carrier of (1) and the operator of
(3). It is the only repo that the human first interacts with directly. Once the
society exists, the human increasingly interacts with the *settlements* the
society produces, not with the top repo as such.

---

## 2. What the "top repo" actually is

The top repo is best understood as **three logical roles co-located in one
git repository on day zero**, and then progressively factored out into separate
repos as soon as the society can support it.

| Logical role | What it carries | Where it eventually lives |
| --- | --- | --- |
| **Mind template** | The `THE-SOCIETY-OF-REPO/` specification: principles, protocols, ideals, plurality contract, approval gate, identity rules. This is the cognitive blueprint. | `sor-constitution` + `sor-protocols` |
| **Install workflow** | The `.forgejo/workflows/` and `.forgejo-intelligence/` runtime: the surface handlers, coordinators, the enable sentinel, the ability to call the Forgejo API, the ability to create new repositories. This is the body factory. | The orchestrator's runtime layer |
| **Conversational surface** | The single point where a human can type "begin", answer questions, approve a spawn, or pull the kill switch. This is the mouth and ears of the society on day zero. | `sor-orchestrator` (until a dedicated `owner-briefing` channel is differentiated out) |

So when the user says *"copy the workflow (mind), run the workflow in install
mode, it installs the rest (body)"*, the architecture supports exactly that
reading. The top repo is the **carrier of the mind that contains its own
installer**. Cloning it and pointing it at a Forgejo instance is the act of
giving the mind a body.

This is also the source of an important constraint that the rest of this
document keeps coming back to: the top repo is **not** the mind. It is the
*seed crystal* of the mind. The mind only really exists once the seven organs
are present and a settlement has been formed by them collectively. Until then,
there is only a repo that knows how to make a mind.

---

## 3. The boot set: seven organs are required, and only seven

The repository already answers the question *"is there a boot set of repos?"*
unambiguously, in `00-foundations/10-bootstrap-minimum-viable-sor.md`. The
answer is **yes, exactly seven**, and it is justified by the architectural
commitments themselves.

| Repo | Organ role | Why it must exist on day one |
| --- | --- | --- |
| `sor-constitution` | Principles, ideals, plurality contract, self-models | Without it, no proposal can cite ground; settlements have nothing to stand on. |
| `sor-protocols` | The 19 protocol documents and the foundations | Without it, organs cannot interoperate; identity, events, settlement, memory all need a shared contract. |
| `sor-orchestrator` | Activation, settlement and routing logic; reads stimuli, opens settlement PRs | Without it, nothing actually runs. This is plumbing, not authority. |
| `sor-agency-coder` | The first real working agency, with constitution, frames, K-lines | A society needs at least one *worker* or it has nothing to settle about. |
| `sor-critic-evidence` | One critic that objects when proposals are unsupported | Without a critic, settlement is monologue. Plurality is a constitutional requirement. |
| `sor-censor-egress` | One fail-closed censor on the cloud-egress boundary | Without a censor, the society has no hard limits and cannot be trusted with action. |
| `sor-memory` | Frames, K-lines, failure-memory, settlement archive, all under git history | Without it, learning does not compound. |

Why seven and not fewer? Each one of the seven instantiates one architectural
commitment that SOR refuses to compromise on: **plurality** (multiple
agencies), **insulation** (separate repos), **non-compromise** (a real censor),
**differentiation** (worker vs critic vs censor are not collapsed), **memory
under git**, **settlement as a visible artifact**, and **a constitution to cite**.
Collapse any one of these into another and you have lost a property the system
is defined by.

Why seven and not more? Because anything you scaffold without a real stimulus
is speculative cognition. The bootstrap document is explicit about this:
*"Pre-building agencies in anticipation… clutter the activation surface. Add
the second worker agency only after the first has produced a non-trivial
credit-assignment record."*

The boot set, then, is **the smallest configuration in which the society's
commitments are all present at least once**. Everything beyond it is grown in
response to evidence.

---

## 4. Install mode: how the top repo lays down the body

"Install mode" is the operational verb that turns the top repo from a
documentation set into a living seven-organ society. It is a workflow run
with three concerns: identity, layout, and authorisation.

### 4.1 Inputs the installer needs

Before any organ is created, the install workflow must collect, from the
human, the small set of facts that make identity meaningful and governance
enforceable:

- **Society name** (`sor.<name>`), e.g. `sor.bee-useful.eric`. This becomes
  the namespace prefix for every organ ID, every event ID, every settlement
  ID, and every K-line ID. The identity protocol (`02-protocols/01-identity.md`)
  requires it.
- **Forgejo target** — the host, the owning user or organisation, and a token
  scoped to creating repositories and writing to them. Per
  `02-protocols/15-forgejo-environment.md`, this token is the bound write
  capability at the body layer; it is *not* legitimacy.
- **The kill switch sentinel path** — which is fixed by the spec at
  `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`, but the human must
  acknowledge that removing this file stops the society.
- **The first human approver** — at minimum one human identity is recorded
  with `human` authority, so that any later `agency_spawn`, `cloud_egress`,
  or `payment_above_limit` action has a person to ask.
- **Initial cloud policy** — the censor needs a precise definition of what
  "cloud egress" means in this society (`boundary-spec.md` in
  `sor-censor-egress`).

The installer refuses to proceed if any of these are missing. This is the
"fail-closed" runtime invariant from the Forgejo environment protocol applied
to install itself.

### 4.2 What the installer creates

The install workflow then performs, in order, a fixed and minimal set of
operations against the Forgejo API. Each is logged as an event under the
event protocol so the very first lines of memory are about the society's own
birth.

1. **Create the seven repositories** under the chosen namespace, with their
   visibility and default branch protection set per the constitution.
2. **Seed each repo** from the corresponding template in the top repo. The
   spec lists the first-day artifacts that must exist in each (principles,
   ideals, self-models, frames, objection templates, boundary-spec, runtime
   config, the empty K-line and failure-memory files with schema present).
3. **Write the kill switch sentinel** into the orchestrator. Until this file
   exists, no surface handler in the orchestrator runs. Writing it is
   recorded as the first `runtime_enablement_change` event.
4. **Install the orchestrator's CI workflow** — the single `.forgejo/workflows/`
   entry that, on a new file in `stimuli/inbox/`, opens a settlement PR.
5. **Cross-link the seven repos** — each constitution declares its identity,
   its body/brain/mind dependencies, and its links to `sor-protocols` and
   `sor-constitution`. This is what later lets an agency cite a principle.
6. **Open the first stimulus**, which is also fixed by the spec: *"Add a
   single sentence to `sor-constitution/principles.md` clarifying the wording
   of the Honesty principle."* This is deliberately the most boring possible
   stimulus, because its job is to prove the loop runs end to end.

After this, install mode exits. The top repo's installer role is done. From
this point on, the *society itself* is what the human talks to.

### 4.3 What install mode is not allowed to do

The bootstrap document explicitly forbids three things during install, and
these are worth restating because they are the failure modes most operators
will be tempted by:

- **No skipping the censor.** "We'll add safety later" is refused. The
  egress censor is one of the seven; install does not complete without it.
- **No pre-building agencies in anticipation.** The installer creates
  exactly one worker (`sor-agency-coder`). Additional workers are spawned
  later, only by settled governance PRs that cite real evidence.
- **No treating the orchestrator as the mind.** The orchestrator is plumbing.
  The installer must not put frames, K-lines, ideals, or critic logic into it.
  Any such logic is migrated to its proper repo before the next stimulus
  is accepted.

Install mode therefore intentionally produces a *small* society. That is the
point.

---

## 5. The mind/brain/body split, applied to install

The orchestration story only makes sense once you keep the three layers
distinct (`00-foundations/06-mind-brain-body.md`).

| Layer | What install does to it |
| --- | --- |
| **Body** | The installer creates Forgejo repositories, configures the runner, writes the workflows, scopes the token, plants the enable sentinel. This is what install mode is *literally* doing in physical terms. |
| **Brain** | The installer points each agency's constitution at its declared models (local-first, cloud-by-policy). It does *not* call any cloud model during install, because the egress censor exists from second one. |
| **Mind** | The installer copies the constitution, the protocols, and the ideals into `sor-constitution` and `sor-protocols`. It does not invent any cognition. The mind is *transferred*, not generated. |

The clean way to read "copy the workflow (mind), run the workflow in install
mode, it installs the rest (body)" is therefore:

> The mind, expressed as `THE-SOCIETY-OF-REPO/`, is *carried* in the top repo.
> The installer is a *body-layer* program. Running it puts the mind into a
> body. The brain — the models — is referenced by name but only invoked
> later, under the censor, when a real stimulus needs it.

This three-way separation is what lets a single git clone reproduce a society
on a new Forgejo host without leaking secrets, without smuggling cloud
dependence, and without making the orchestrator pretend to be cognition.

---

## 6. From boot set to ecology: how the root spawns further repos

After install, the society is alive but small. The user's question — *"with
interaction with a human the root spawns the various other repos required for
the overall mechanism to work"* — is answered by combining four protocols
that are already present in the spec:

1. **The governance protocol** (`02-protocols/08-governance.md`) lists
   `agency_spawn`, `agency_retirement`, `external_service_registration`,
   and `runtime_enablement_change` as actions that *always* require human
   approval, regardless of any agency's authority level.
2. **The approval-gate** (`01-governance/approval-gate.md`) is the recorded
   mechanism by which a human grants that approval, and it is itself a
   first-class organ.
3. **The differentiation protocol** (`10-evolution/README.md`) defines *when*
   a new repo is justified: when an existing agency shows "double-purpose
   pressure" — when one organ keeps being asked to do two distinguishable
   jobs and its credit-assignment records show that one job is degrading the
   other.
4. **The bootstrap-protection rule** in the same file says new agencies
   are not judged by mature productivity thresholds for a defined window;
   they are judged first on constitutional compliance, safety, and trace
   quality. This is what makes spawning *safe* rather than just *fast*.

Putting these together, every spawn after install follows the same shape.

### 6.1 The spawn loop

```text
real stimulus arrives
  → existing agencies activate
  → settlement attempts
  → critic objects: "this is outside my scope" or "this is two jobs"
  → memory-steward or evaluation-steward proposes differentiation
  → governance PR is opened: "spawn agency.<new-name>"
  → human approver accepts via the approval-gate
  → orchestrator creates the new repo from the agency template
  → new repo gets a bootstrap-protection window
  → first K-lines and failure-memory entries accumulate
  → after the window, normal evaluation applies
```

Every step is a settled, citeable artifact. There is no place in the loop
where the orchestrator may create a repo on its own initiative; the API
permission to do so is technical capability, not legitimacy.

### 6.2 What gets spawned, and roughly in what order

The spec's deferred-introduction table tells you what triggers each later
organ. In practice the natural sequence after the seven looks like this,
though the actual order is always evidence-driven:

| Wave | Repos typically added | Triggering evidence |
| --- | --- | --- |
| Wave 1: more workers | A second `agency.*-bee` for a domain the coder agency keeps being mis-routed to (e.g. `agency.contract-bee`, `agency.intake-bee`) | Repeated misrouting visible in activation traces |
| Wave 2: more critics | `critic.scope`, `critic.cost`, `critic.privacy`, `critic.overconfidence` | Repeated settlements where the evidence critic alone was insufficient |
| Wave 3: more censors | `censor.authority`, `censor.payment`, `censor.delegation-depth` | Boundary classes that the egress censor's firing log shows it cannot represent |
| Wave 4: memory differentiation | `memory.episodic`, `memory.semantic`, `memory.procedural`, `memory.failure`, `memory.frames`, `memory.klines`, `memory.decisions` | The single `sor-memory` repo's settlement archive growing to a size where representation-class confusion appears |
| Wave 5: workspace and briefing | `workspace.global`, `workspace.current-focus`, `agency.owner-briefing` | The human reports difficulty reading raw settlements |
| Wave 6: stewards as repos | `activation-steward`, `memory-steward`, `representation-steward`, `evaluation-steward`, `ecology-monitor` | The single `meta-steward` issue tracker producing more than one weekly digest worth reviewing |
| Wave 7: services and channels | `service.*` repos, `channel.*` agreements | A second society exists and a real exchange is desired |

The repository's maturity ladder maps onto these waves. The seven-repo MV-SOR
sits at Level 3 (Society). Waves 4–6 push it toward Level 4 (Reflective
learning society). Wave 7 takes it to Level 5 (Networked) and eventually
Level 6 (Economic).

### 6.3 Where the human sits in this loop

The human is not "above" the society and not "inside" it. The human is one
of the named identities in the authority registry, with `human` authority,
and they are addressed by name in approval requests. Specifically the human
must approve, by signing the approval-gate PR:

- every `agency_spawn`
- every `agency_retirement`
- every `runtime_enablement_change`
- every `cloud_egress_sensitive`
- every `payment_above_limit`
- every `external_service_registration`
- every constitutional change

The spec calls this out plainly: *"Humans are not a failure mode. Humans are
constitutional anchors."* The orchestration model takes this literally —
the mechanism by which the society grows is the mechanism by which the
society asks the human for permission to grow.

### 6.4 What spawning a repo actually does, mechanically

When a spawn settlement is approved, the orchestrator performs a sequence
that mirrors install in miniature. It is the same `body-layer` program,
applied to one repo instead of seven:

1. Allocate the identity (`agency.<name>`, `critic.<name>`, etc.) per
   `02-protocols/01-identity.md`.
2. Create the repository under the society's namespace.
3. Seed it from the appropriate template (worker, critic, censor, memory,
   workspace, service).
4. Write the constitution: purpose, non-goals, authority level (almost always
   `propose` or `draft` initially, never `act`), inputs, outputs, models,
   evaluation metrics, rights.
5. Cross-link to `sor-constitution`, `sor-protocols`, and the relevant memory
   repos.
6. Register it in the orchestrator's routing table, with the bootstrap-
   protection flag set and the start of its protected window recorded.
7. Emit the spawn event into `sor-memory` so that the *act of spawning* is
   itself part of the society's episodic memory.

Crucially, the new repo does not get to act on day one. It gets to *propose*.
Authority is widened only by a later, separate, human-approved
`authority_level_increase` settlement, after enough credit-assignment records
exist to justify it.

---

## 7. End-to-end walk-through

To make the orchestration concrete, here is the full arc from empty Forgejo
host to the first spawned organ.

### Step 0: empty disk

A human has a Forgejo host and a clone of the top repo. Nothing else exists.

### Step 1: install

The human runs install mode, supplying the society name, target host, token,
their own human identity, and the cloud-egress definition. The installer
creates the seven repos, seeds them, writes the kill switch sentinel, and
opens the fixed first stimulus about the Honesty principle.

### Step 2: first settlement

`sor-orchestrator` reads the stimulus from `stimuli/inbox/`. `sor-agency-
coder` proposes a wording change. `sor-critic-evidence` is consulted; with
empty K-lines it can only check that the proposal cites the principle it
modifies. `sor-censor-egress` is consulted; nothing leaves the host, so it
does not fire. A settlement PR is opened against `sor-constitution`. The
human merges. The settlement is archived to `sor-memory`. The first K-line
candidate ("constitutional-wording-change") is written by hand. The first
failure-memory slot remains empty.

The society is now Level 3.

### Step 3: real stimulus

A real document — say a supplier invoice — is dropped into `stimuli/inbox/`.
The orchestrator activates `sor-agency-coder`, which is the only worker.
The coder agency tries to summarise the invoice but its constitution declares
its scope as code, not invoices. The evidence critic objects: *"proposal not
supported by frames in scope."*

This objection is exactly the signal the spec is waiting for. It becomes a
failure-memory entry, and the meta-steward issue tracker raises it.

### Step 4: spawn proposal

A governance PR is opened citing the failure-memory entry: *"spawn
`agency.intake-bee` to classify and route incoming documents."* The PR
includes the new agency's draft constitution: scope, non-goals, authority
(`propose`), inputs (the inbox), outputs (a routing decision and a typed
event), evaluation metrics, and the bootstrap-protection window length.

### Step 5: human approval

The human reads the PR. Because `agency_spawn` is in the always-requires-
approval list, the approval-gate PR is the binding artifact. The human
signs the approval (or asks for changes — the spec preserves the right
of refusal). The merge of the approval PR is the legitimisation event.

### Step 6: mechanical spawn

The orchestrator, on observing the merged approval, runs the spawn sequence
described in §6.4. The new `agency.intake-bee` repo exists. It is in its
protected bootstrap window. It is registered in routing.

### Step 7: the loop continues

The next invoice activates both the coder agency and the new intake-bee.
The intake-bee classifies, the coder agency steps back out of scope, the
evidence critic now has something to evaluate against, and the egress censor
remains silent. A clean settlement is produced. The first real K-line
("supplier-invoice-arrives → activate intake-bee, finance-watch-when-it-
exists, cost-critic-when-it-exists") is written.

The society is now demonstrably growing in response to evidence rather than
in anticipation of it. This is the property the spec is preserving above
all else.

---

## 8. Properties this orchestration model preserves

The shape above is not arbitrary; it is the only shape that simultaneously
satisfies the constraints SOR has already committed to.

- **Plurality.** No single repo speaks for the whole, even on day one.
- **Insulation.** Each organ is a separate repo with its own history, so a
  failure in one cannot silently corrupt another.
- **Non-compromise.** The censor exists from second one. Safety is not a
  later phase.
- **Differentiation, not pre-building.** Every repo after the seven is born
  from evidence in failure-memory or activation traces.
- **Credit assignment.** Because spawning is a settled act, the society can
  later look back and ask whether *spawning that repo* was the right call,
  and revise its differentiation heuristics.
- **Bootstrap protection.** Newborn repos are evaluated for compliance and
  trace quality before throughput, so they are not killed for being slow.
- **Human as constitutional anchor.** The human is the only path to
  spawning, retiring, or widening authority. Capability is never legitimacy.
- **Reproducibility.** Anyone with the top repo can install another society
  on another Forgejo host and arrive at the same seven-organ floor. The
  diversity between societies appears later, in what each has spawned.
- **Reversibility.** Removing the kill switch sentinel halts the runtime.
  Every spawn is recorded, so retirement is mechanically possible. Lineage
  is preserved (`specialized-from`, `superseded-by`) so nothing is lost
  by pruning.

---

## 9. Anti-patterns this model is designed to refuse

It is worth naming the failure modes the orchestration story rules out, so
that operators can see what they should *not* implement under pressure.

- **The mega-installer.** An install mode that creates twenty repos because
  "we know we'll need them" violates the differentiation rule and produces
  a society of empty agencies.
- **The monarch orchestrator.** An orchestrator that contains frames,
  K-lines, ideals, or critic logic is a single point of cognition pretending
  to be many. The spec forbids this explicitly.
- **The capability-equals-legitimacy slip.** A token that can create repos
  is permission from Forgejo, not from the society. Spawning without an
  approval-gate merge is forbidden even if it is technically possible.
- **The censorless bootstrap.** Skipping `sor-censor-egress` in the seven
  to "ship faster" guarantees the first irreversible failure.
- **The cloud-by-default brain.** Reaching for cloud models during install
  or first stimulus violates local-first and triggers the censor in a phase
  where the society has nothing useful to say back.
- **The silent spawn.** Creating a repo without emitting a spawn event into
  `sor-memory` makes the society unable to credit-assign its own growth.

---

## 10. Summary

The user asked how the top repo, which talks to humans, spawns new repos so
that the society as a whole can function. The answer the repository already
gives — when the bootstrap doc, the governance protocol, the identity
protocol, the mind/brain/body split, the evolution rules, and the Forgejo
environment contract are read together — is this:

- The top repo is the **carrier of the mind plus an installer**. It is not
  itself the mind.
- **Install mode** is a body-layer program that creates exactly **seven
  organ repos**: a constitution, a protocol library, an orchestrator, one
  worker, one critic, one censor, and one memory. This is the boot set.
  These seven are the smallest configuration in which the society's
  architectural commitments are all literally present.
- The first stimulus the seven handle is **fixed and trivial**, so its job
  is only to prove that the cognitive loop runs end to end.
- After that, **further repos are spawned one at a time**, in response to
  real evidence in failure-memory or activation traces, through governance
  PRs that the human must approve via the approval-gate.
- Each spawned repo enters with a **bootstrap-protection window**, with
  authority limited to `propose`, with cross-links to constitution and
  memory, and with its birth recorded in episodic memory.
- The maturity ladder is climbed by *waves* of spawning: more workers,
  then more critics, then more censors, then memory differentiation, then
  workspaces, then stewards, then services and channels.

The top repo, then, is a seed. Install mode is germination. The seven
organs are the seedling. Every later repo is a leaf grown only after the
plant has shown the root system can support it. The human is the gardener
who decides when each new leaf is allowed to open. The forge is the soil.
The society — once enough of it has grown — is the mind.
