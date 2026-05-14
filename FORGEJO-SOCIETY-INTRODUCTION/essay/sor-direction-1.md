# Society of Repo — Is the Direction Correct? (Direction Check 1)

This essay is a direction check. The question is not *can we build this* — the
plans clearly say we can — but *is the thing we are aiming at the right thing,
and is it the kind of thing that can become world-class and world-beating?*

The check is performed against three bodies of work that already exist in the
repository:

- [`.forgejo-intelligence/`](../../REPO/forgejo-intelligence/) —
  the working, runnable Forgejo-native AI runtime and its conversion history
  ([WHAT.md](../../REPO/forgejo-intelligence/WHAT.md),
  [.ASPIRATION.md](../../REPO/forgejo-intelligence/.ASPIRATION.md),
  [CONVERSION/FORGEJO-CONVERSION-PLAN.md](../../REPO/forgejo-intelligence/CONVERSION/FORGEJO-CONVERSION-PLAN.md)).
- [`THE-SOCIETY-OF-REPO/`](../../THE-SOCIETY-OF-REPO/README.md) — the governed
  cognitive ecology specification.
- [`FORGEJO-SOCIETY-PLAN/`](../../FORGEJO-SOCIETY-PLAN/README.md) — the
  planning bridge that collapses both into one workflow file and one root
  folder ([00-overview.md](../../FORGEJO-SOCIETY-PLAN/00-overview.md),
  [12-agent-implementation-playbook.md](../../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md)).

The companion essay
[sor-emergent-possibilities.md](sor-emergent-possibilities.md) describes what
*can* emerge from this design. This essay asks whether the architecture
underneath that emergence is the right architecture to bet on.

The short answer is **yes — with three sharpenings**. The longer answer is
below.

---

## 1. Restating the direction in one paragraph

The direction is: **the forge is the mind; one repository is an agency; the
society of repos governs itself; and the entire running cognition of any
single repo collapses into one workflow file (`.forgejo/workflows/forgejo-society.yaml`)
and one root folder (`.forgejo-society/`).** Forgejo Actions is the heartbeat,
git is the durable substrate, the Forgejo API is the only motor surface, and a
small set of files (sentinel, governance, frames, K-lines, agencies, critics,
censors, memory, workspace) is everything Spock — the conscious presenter — has
to be.

Three convictions sit underneath that paragraph:

1. **Repo-native, not chatbot-on-top.** The agent participates through the same
   surfaces humans use ([.ASPIRATION.md](../../REPO/forgejo-intelligence/.ASPIRATION.md)).
2. **Presence is permission; absence is denial.** Capability is declared by the
   filesystem and audited by `git log`
   ([WHAT.md](../../REPO/forgejo-intelligence/WHAT.md)).
3. **Governed cognition, not free-fire multi-agent.** Every non-trivial action
   leaves a settlement, and every settlement leaves a credit-assignment trace
   ([THE-SOCIETY-OF-REPO/02-protocols/](../../THE-SOCIETY-OF-REPO/02-protocols/)).

Each conviction predates this repo. `forgejo-intelligence` proved (1) and (2)
in code. `THE-SOCIETY-OF-REPO/` earned (3) in theory. `FORGEJO-SOCIETY-PLAN/`
is the collapse that fuses the three.

---

## 2. What FORGEJO-SOCIETY-PAST actually proved

`.forgejo-intelligence/` is not a doodle. It is a runnable
Bun/TypeScript installer with `.forgejo` workflows, a Forgejo API adapter, a
guardrail, a fail-closed sentinel, ~20 surface folders, and committed session
state under `.forgejo-intelligence/state/` ([README.md](../../REPO/forgejo-intelligence/README.md),
[.forgejo-intelligence/](../../REPO/forgejo-intelligence/.forgejo-intelligence/)).
Concretely, it proved seven things that the new direction is now allowed to
take for granted:

1. **A repository can host its own AI.** A `.forgejo-intelligence/` folder plus
   a single workflow under `.forgejo/workflows/` is enough to make a repo
   responsive on issues, PRs, comments, releases, and pushes.
2. **Capability-as-folder works.** Twenty surface folders
   (`forgejo-intelligent-issue`, `forgejo-intelligent-pull-request`, …) gave
   maintainers a dashboard they could read with `ls`. Removing a folder
   actually removed the capability.
3. **A single sentinel can hold a fail-closed boundary.** The runtime refuses
   work when `forgejo-intelligence-ENABLED.md` is missing
   ([WHAT.md §The Enable Sentinel](../../REPO/forgejo-intelligence/WHAT.md)).
4. **State-in-git is operationally fine.** Sessions, mappings, and migration
   archives live in the repo and are reviewable in PRs.
5. **A typed Forgejo API adapter beats scattered `fetch` calls.** Pagination,
   retries, and a mock implementation drop straight into surface handlers
   ([WHAT.md §Forgejo API Adapter](../../REPO/forgejo-intelligence/WHAT.md)).
6. **GitHub-only surfaces can be retired honestly.** False parity is worse than
   a clear boundary
   ([.ASPIRATION.md §Boundaries](../../REPO/forgejo-intelligence/.ASPIRATION.md)).
7. **Migration-as-installer works.** A single `--migrate --yes` command can
   move a live system off GitHub-Actions runtime without losing portable state
   ([CONVERSION/FORGEJO-CONVERSION-PLAN.md](../../REPO/forgejo-intelligence/CONVERSION/FORGEJO-CONVERSION-PLAN.md)).

What FORGEJO-SOCIETY-PAST did **not** have, and admitted it did not have, is *cognition*.
It had surfaces, sessions, an agent runtime, and a guardrail. It did not have
frames, K-lines, critics, censors, settlements, credit assignment, or
governance. It was a polite, fail-closed listener with a memory of past
exchanges. It was not yet a society, and it was not yet a mind.

That is the gap `THE-SOCIETY-OF-REPO/` and `FORGEJO-SOCIETY-PLAN/` are
designed to close.

---

## 3. What FORGEJO-SOCIETY-PLAN actually adds

`FORGEJO-SOCIETY-PLAN/` is the collapse rule
([00-overview.md](../../FORGEJO-SOCIETY-PLAN/00-overview.md)):

> Every cognitive structure in `THE-SOCIETY-OF-REPO/` must collapse to either
> a file under `.forgejo-society/` or a step in
> `.forgejo/workflows/forgejo-society.yaml`. Nothing else.

It is also a refusal: there will not be a third runtime location, a hidden
service, a sidecar daemon, or a "control panel app." The mind is a folder; the
body is a workflow; if it is not in those two places, it does not exist for
the running society.

Read against FORGEJO-SOCIETY-PAST, four upgrades are visible:

- **One workflow, not many.** FORGEJO-SOCIETY-PAST had one workflow because it was small.
  `FORGEJO-SOCIETY-PLAN/02-workflow-design.md` makes one workflow a
  *constitutional* rule — multiple workflows would race settlement,
  censorship, and credit assignment across event boundaries Forgejo cannot
  coordinate ([00-overview.md §Why one workflow](../../FORGEJO-SOCIETY-PLAN/00-overview.md)).
- **One root folder, not several.** `.forgejo-society/` is the *whole* mind.
  Removing it disables the society. A single PR can change cognition. The
  kill-switch invariant is the same one FORGEJO-SOCIETY-PAST proved, raised to constitute
  the entire substrate ([00-overview.md §Why one folder](../../FORGEJO-SOCIETY-PLAN/00-overview.md)).
- **Cognitive primitives become first-class files.** Frames as YAML, K-lines as
  YAML, critics and censors as Markdown manifests with a schema
  ([01-target-layout.md](../../FORGEJO-SOCIETY-PLAN/01-target-layout.md),
  [05-agencies-critics-censors.md](../../FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md)).
  This is the move from "agents call tools" to "a society perceives,
  activates, settles, and remembers."
- **A pipeline that maps cognition to commits.** Every cognitive step has a
  workflow phase, a runtime module, and a concrete read/write target under
  `.forgejo-society/state/`, `memory/`, or `workspace/`
  ([03-runtime-pipeline.md](../../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)).
  Cognition is therefore *recoverable*, not just *observed*.

The two-target collapse is the most important architectural decision in the
project. It is also the one most likely to be eroded under pressure. Any time
someone proposes "a small sidecar," "a tiny dashboard service," "a separate
workflow for the cron job," or "a parallel folder for the new thing," the
collapse rule is being asked to bend. It must not.

---

## 4. Is this the right direction?

There are five places where the design could plausibly be wrong. Each is worth
testing against directly.

### 4.1 Could "the forge is the mind" be the wrong substrate?

The competing substrates are: an in-process orchestrator (LangGraph-style), a
durable workflow engine (Temporal, Argo), a vector-store + agent loop, or a
bespoke event bus. Against each of those, the forge has properties they do not:

- **Native pull-request review** as the inhibition mechanism. Critics and
  censors are not bolt-ons; they are the same primitives humans already use to
  challenge each other.
- **Native branches** as insulated futures. Imagined actions and experiments
  get a real, cheap, garbage-collectable home that does not contaminate the
  main line.
- **Native commit history** as the credit-assignment substrate. There is
  literally no other architecture in which "what did agency X actually
  contribute to settled outcome Y over the last 90 days" is `git log`.
- **Native fail-closed via filesystem.** Removing a folder is a more
  trustworthy off-switch than a feature flag in a config server.

These are not minor advantages. They are the four hard problems of governed
multi-agent systems — review, insulation, credit, and shutdown — and Forgejo
gives all four for free, *with audit*. The substrate choice is correct.

### 4.2 Could "one workflow, one folder" be too austere?

This is the most aggressive constraint in the design, and it deserves the
hardest scrutiny. The pressure to break it will be constant: every new
capability looks like it deserves its own workflow file or its own top-level
folder, just for clarity.

The constraint is correct because of three asymmetries:

1. **Concurrency boundaries cannot be retrofitted.** Once a cognitive loop is
   split across workflow files, the per-stimulus group key becomes a polite
   suggestion ([02-workflow-design.md §Concurrency](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)).
2. **Kill switches degrade catastrophically when they are partial.** Two
   workflows, one sentinel — and one of the two will eventually forget to
   check it. Then the off-switch is a lie.
3. **Audit trails fragment when state has more than one home.** A reviewer
   who must read three folders to reconstruct a settlement will, in practice,
   read one and trust the other two. Trust is the point of state-in-git.

Austerity here is not asceticism; it is the only way the audit promise stays
true. The constraint is correct.

### 4.3 Could the cognitive vocabulary (frames, K-lines, critics, censors,
self-ideals) be over-engineered?

The fair worry is that Minskian vocabulary is decorative — that it dresses up
"agent + tool + memory" in older language without changing behaviour. The
counter-evidence is in `03-runtime-pipeline.md`: each Minskian primitive
corresponds to a *distinct file or folder being read or written at a distinct
phase of the workflow*. Frames are read at activation; K-lines are read and
later written at settlement; critics produce objections that change the
activation field; censors mutate the tool surface before any write; self-ideals
become enforced norms via the policy ledger.

If a primitive ever becomes purely decorative — a frame nobody reads, a K-line
nobody activates, a critic nobody routes objections through — the rule is to
*delete it*, not to keep it for theoretical completeness. The vocabulary is
correct as long as every word maps to a file that something actually opens.

### 4.4 Could "Spock as the only public voice" be a single point of failure?

No. It is a single point of *responsibility*, which is different. The society
internally is plural — many agencies, critics, censors, narrators in
parallel — but every externally visible utterance passes through one
presenter. This is the *conscious bottleneck* in the cognitive sense, and it
is exactly what gives users a coherent counterparty to talk to. A society
that speaks with twenty mouths is, from the outside, no one.

The risk is not that Spock fails; it is that Spock becomes a bottleneck on
*throughput*. The mitigation is that Spock does not deliberate; Spock
*presents already-settled cognition*. The deliberation is parallel inside the
society. Only the presentation is serial. The design is correct.

### 4.5 Could the project be aiming at the wrong scale?

FORGEJO-SOCIETY-PAST operated at one-repo scale. `THE-SOCIETY-OF-REPO/` operates at
one-society scale. The hardware reference in
[README.md §Hardware reference](../../README.md) — one i9 forge, sixteen i7
runners, one i9+RTX 4090 LLM box — is sized for *many* simultaneous
settlements ([FORGEJO-SOCIETY-INTRODUCTION/analysis/forgejo-society-expected-performance.md](../analysis/forgejo-society-expected-performance.md)).
The cross-society protocols ([THE-SOCIETY-OF-REPO/09-channels/](../../THE-SOCIETY-OF-REPO/09-channels/))
and the meta-admin role anticipate *many* societies.

This is the right scale. A repo that is occasionally helpful is a chatbot. A
society that runs continuously, settles cognition under governance, evolves
its own agencies, and federates with peer societies via channel agreements is
the thing that has not been built before. It is also the thing the substrate
is uniquely suited for.

---

## 5. What "world-class and world-beating" actually means here

This is worth being precise about, because the phrase can mean very different
things and the answer changes the priorities.

It does **not** mean:

- *Highest benchmark score on a coding-agent eval.* Benchmarks measure single
  agents on isolated tasks. SOR is not in that category and competing on those
  numbers would distort the design.
- *Most capabilities checked off.* FORGEJO-SOCIETY-PAST already had twenty surface
  folders. Capability count is not the moat.
- *Most users.* The substrate is self-hosted Forgejo on local hardware
  ([README.md](../../README.md)). User count is not the metric.

It **does** mean — and this is where the real ambition lives:

1. **The first cognitive architecture whose entire reasoning is reviewable in
   a pull request.** No competitor has this. Closed agent products cannot show
   you the K-line that fired. Open agent frameworks can show you a trace but
   not a *governed, audited, reinforceable* trace. SOR can.
2. **The first multi-agent system where "remove the folder" is a real
   off-switch.** Compliance, safety, and trust teams have been asking for this
   for two years. Nobody else gives it.
3. **The first AI runtime where credit assignment, retirement, and
   differentiation are first-class versioned operations.** Agencies that earn
   their keep get reinforced; agencies that don't get retired in a recorded
   PR. This is how an ecology stays clean over years, not weeks.
4. **The first system where "the agent thought about this" produces a
   diffable, mergeable artifact.** Settlements are files. K-lines are files.
   Self-ideals are files. The thinking is the repository.
5. **A self-hosted, local-first runtime that does not require sending the
   organisation's cognition to a vendor's servers.** Sovereignty over thought
   is the long-term differentiator.

If those five things are true at the same time in one running system, the
project is world-beating. None of them is true in any system shipping today.

The direction is therefore correct in a strong sense: the things that make it
world-class are the things only this architecture can deliver, not things it
must out-compete others on.

---

## 6. The three sharpenings

Saying "the direction is correct" is not the same as saying "ship as
specified." Three sharpenings would materially raise the chance of landing the
"world-beating" outcome. None of them changes the architecture. All of them
tighten its edges.

### 6.1 Treat the collapse rule as a load-bearing wall, not a guideline

`FORGEJO-SOCIETY-PLAN/00-overview.md` already states the collapse rule. It
should also be enforced *mechanically*. Concretely:

- A scheduled job in the workflow that fails the run if any
  cognition-relevant file appears outside `.forgejo-society/` or
  `.forgejo/workflows/forgejo-society.yaml`.
- A check that there is exactly one workflow file under `.forgejo/workflows/`
  whose name matches `forgejo-society*.yaml`.
- A check that every file under `.forgejo-society/agencies/`,
  `critics/`, and `censors/` validates against
  `schemas/manifest.schema.json`.

The rule is the architecture. If the rule is only social, it will be eroded.
If it is enforced by the very workflow it constrains, the architecture is
self-defending.

### 6.2 Make the cognitive trace the headline product, not the agent reply

The conventional answer to "what does this AI do?" is "it answers." The
better answer for SOR is "it *settles*, and the settlement is reviewable."
That reorientation should show up in three places:

- **The README.** Lead with the trace, not the chat. "Open any issue and watch
  the society perceive, activate, deliberate, criticise, censor, settle, and
  act — every step is a file you can read."
- **Spock's voice.** Spock's reply should always link back to the settlement
  ID and the relevant K-line. Users learn, by reading replies, that the system
  is *thinking out loud in git*.
- **Demos.** The demonstration that wins is not "look how clever the answer
  is" — answer cleverness is a model property, not an architecture property.
  It is "look how completely we can reconstruct *why* the answer was that
  answer, three months later, after the model has changed twice."

The architecture's superpower is *legibility of cognition*. Lead with the
superpower.

### 6.3 Lock in the migration story from FORGEJO-SOCIETY-PAST before adding new agencies

.forgejo-intelligence is real, runnable, and battle-tested in narrow
ways. The new society has a vastly larger surface area and almost no
operational hours. The temptation will be to build the new society in
parallel, then "switch over."

A safer path, and one that compounds, is:

1. Treat `forgejo-intelligence` as the **integration layer** — it already
   knows how to receive Forgejo events, normalise them, talk to the API,
   guard against bots and forks, and commit state.
2. Treat the new `.forgejo-society/` as the **cognition layer** that sits on
   top of that integration.
3. Define the seam explicitly: `forgejo-intelligence` produces a normalised
   stimulus and writes it to `state/runs/<run>/stimulus.json`; the society's
   `mind.ts` reads from there and never touches the Forgejo API directly.

That seam is hinted at in
[03-runtime-pipeline.md §Pipeline mapping table](../../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
where `lib/forgejo.ts` and `lib/git.ts` are listed as runtime modules. It is
worth promoting from "module" to "contract" — a stable JSON schema between
the integration layer and the cognition layer, versioned in
`schemas/stimulus.schema.json`. With that contract in place:

- The integration layer can be replaced (e.g., when Forgejo's webhook payloads
  change) without touching cognition.
- The cognition layer can be tested end-to-end against fixture stimuli without
  ever needing a live Forgejo instance.
- The migration from FORGEJO-SOCIETY-PAST becomes additive, not disruptive: existing
  surfaces keep working; new cognition starts firing as soon as the seam is
  populated.

This is the change that turns FORGEJO-SOCIETY-PAST from "earlier work" into "lower half
of the stack."

---

## 7. The risks that could derail "world-beating"

A correct direction can still fail to land. The realistic failure modes are:

- **Plan-shaped paralysis.** `FORGEJO-SOCIETY-PLAN/` is twelve careful
  documents and the temptation is to keep planning. The Phase A bootstrap
  ([10-bootstrap-checklist.md](../../FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md))
  must ship as one PR even if many agencies and frames are still empty. A
  living, minimal society teaches faster than a complete plan.
- **Cognition without observability.** If state files exist but no one ever
  reads them — no dashboard, no weekly review, no `ecology-review.md` actually
  written — the society goes blind to itself, and pathological emergence
  ([sor-emergent-possibilities.md §3.7](sor-emergent-possibilities.md)) wins
  by default.
- **Drift from local-first.** Each individual decision to call a hosted model
  endpoint is reasonable. Cumulatively, they would move the project's centre
  of gravity off the owned hardware and lose the sovereignty differentiator.
  The provider boundary in `config/providers.yml` must be defended like the
  sentinel.
- **Letting Spock leak.** If any part of the society other than Spock ever
  posts to a public surface, the conscious-bottleneck invariant is gone and
  the audit story collapses. Forge-write authority must be physically held by
  Spock's presenter agency alone, enforced by the rights registry, not by
  convention.
- **Forgetting the human.** The maintainer who opens an issue does not care
  about K-lines. They care about whether the response was right, fast, and
  honest about what it could not do. Spock must remain humble, useful, and
  legible to a person who has never read this essay.

None of these is fatal. Each is foreseeable. Each has a corresponding control
already named in the existing plans
([07-policies-and-safety.md](../../FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md),
[10-evolution/](../../THE-SOCIETY-OF-REPO/10-evolution/),
[01-governance/](../../THE-SOCIETY-OF-REPO/01-governance/)). The work is to
*use* the controls, not to add new ones.

---

## 8. Conclusion

The direction is correct.

It is correct because the substrate (the forge), the constraint (one workflow,
one folder), the vocabulary (frames, K-lines, critics, censors,
settlements), and the commitments (presence is permission, state lives in
git, Spock is the only public voice) are mutually reinforcing. Removing any
one of them weakens the others. Keeping all of them produces something no
existing AI architecture produces: a *governed, auditable, reinforceable
cognitive ecology that runs from a folder and a workflow file*.

It is world-beating in the only sense that matters: it wins on properties no
competitor can copy without rebuilding their substrate from scratch.
Reviewability of cognition, fail-closed via filesystem, credit assignment as
git history, and sovereignty over thought are not features that can be added
to an agent product. They are the consequences of choosing this substrate
from the beginning.

FORGEJO-SOCIETY-PAST proved the substrate works. `THE-SOCIETY-OF-REPO/` earned the
theory. `FORGEJO-SOCIETY-PLAN/` is the collapse. The remaining work is to
ship the Phase A skeleton, defend the collapse rule, lead with the cognitive
trace, lock the seam to the integration layer, and resist every pressure to
add a third location.

If those things hold, the system that exists in twelve months will be the
first of its kind. That is the definition of world-beating that the direction
deserves to be measured against.
