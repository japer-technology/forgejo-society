# Forgejo Society: Glossary

This is the newcomer-facing glossary for Forgejo Society. It gives short,
working definitions for the terms most often used in the repository and points
to the deeper vocabulary where needed.

The fuller theoretical glossary lives in
[THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md). The
canonical Society of Repo specification lives in
[THE-SOCIETY-OF-REPO/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/).
The planning documents that collapse that specification onto a single workflow
file and a single root folder live in
[FORGEJO-SOCIETY-IMPLEMENTATION/](FORGEJO-SOCIETY-IMPLEMENTATION/). The
runnable Bun/TypeScript runtime that enacts an early form of that plan lives in
[FORGEJO-SOCIETY/forgejo-intelligence/](FORGEJO-SOCIETY/forgejo-intelligence/).

---

## Core Project Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Forgejo Society | The self-hosted, local-first cognitive forge described by this repository. | [README.md](README.md) |
| Society of Repo | A Git-native, multi-repository architecture in which each repository plays one cognitive role — agency, critic, censor, memory, workspace, or service — and the society is their governed interaction under a shared constitution. | [THE-SOCIETY-OF-REPO/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md) |
| Society of Mind | Marvin Minsky's theoretical frame for many small processes combining into mind-like behaviour. In this repository, it is a reference source, not an operating policy by itself. | [THE-SOCIETY-OF-MIND/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/) |
| Forge | The Git forge as operational substrate: repositories, issues, pull requests, runners, workflows, permissions, and audit history. | [THE-REPO-IS-THE-MIND/idea.md](FORGEJO-SOCIETY-INTRODUCTION/THE-REPO-IS-THE-MIND/idea.md) |
| Cognitive forge | A forge used not only for source control, but also for governed memory, review, agency, settlement, and auditable action. | [README.md](README.md) |

---

## Society of Repo Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Agency | A bounded working unit that drafts, routes, or performs useful work within assigned rights and authority. Authority attaches to agencies, not to vague intelligence. | [THE-SOCIETY-OF-REPO/03-agencies/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/03-agencies/README.md) |
| Critic | A review unit that challenges a formed proposal before action. Critics test evidence, scope, risk, cost, privacy, confidence, source quality, and staleness. | [THE-SOCIETY-OF-REPO/04-critics/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-critics/README.md) |
| Censor | A hard-limit unit that prevents prohibited work from starting or continuing. Censors enforce boundaries such as authority, cloud egress, credentials, payment, and delegation depth. | [THE-SOCIETY-OF-REPO/05-censors/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/05-censors/README.md) |
| Memory | The durable record of events, settlements, frames, K-lines, failures, and decisions kept as Git objects and repository files. | [THE-SOCIETY-OF-REPO/06-memory/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/README.md) |
| Workspace | The society's current attention surface: active work, current focus, drafts, proposals, and settlements in progress. | [THE-SOCIETY-OF-REPO/07-workspace/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/README.md) |
| Settlement | A recorded decision or completed resolution. A settlement explains what was decided, why, by whom, and under which authority. | [THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) |
| Signal | A structured message that moves attention or work between surfaces, agencies, critics, censors, memory, or services. | [THE-SOCIETY-OF-REPO/02-protocols/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/) |
| Handoff | A controlled transfer of work from one part of the society to another, with enough context for the receiving part to act or review. | [THE-SOCIETY-OF-REPO/02-protocols/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/) |
| Bridge | A governed connection between societies, services, channels, or external systems. Bridges make boundaries explicit rather than implicit. | [THE-SOCIETY-OF-REPO/09-channels/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/README.md) |
| Authority level | A named permission class. The only valid levels are `read`, `draft`, `propose`, `act`, `govern`, and `human`. | [THE-SOCIETY-OF-REPO/01-governance/authority-registry.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md) |
| Approval gate | The list of action categories that always require human approval, regardless of any agency's ordinary authority. | [THE-SOCIETY-OF-REPO/01-governance/approval-gate.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/approval-gate.md) |

---

## Society of Mind Terms Used Here

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Agent | The smallest useful process in the Society of Mind vocabulary. In Forgejo Society, contributors should usually say agency, critic, censor, workflow, or handler when they mean a concrete repository mechanism. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| K-line | A remembered activation pattern. In Society of Repo terms, a K-line records the set of files, decisions, signals, agencies, critics, and censors that were active around a useful or important event. | [THE-SOCIETY-OF-REPO/06-memory/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/README.md) |
| Frame | A structured template with slots and defaults. Frames make a situation legible by naming expected roles, fields, and missing pieces. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Polyneme | A symbol or signal that activates different meanings in different agencies at the same time. In a repository, a typed event can be read differently by an agency, a critic, a censor, and a memory writer. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Isonome | A shared control signal, such as compare, remember, activate, inhibit, or settle. It tells different parts how to operate. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Suppressor | A process that interrupts work already in progress. It is related to a censor, but acts after a path has started rather than before it forms. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |

---

## Identifier Terms

All Society of Repo identifiers are dot-separated, lowercase, and use hyphens
for multi-word segments. The general shape is:

```text
{scope}.{kind}.{name}[.{version}]
```

Common examples:

| Identifier | Meaning |
| --- | --- |
| `sor.forgejo-society` | This Society of Repo. |
| `agency.contract-bee` | A worker agency. |
| `critic.evidence` | A critic that challenges evidence quality. |
| `censor.cloud-egress` | A censor that blocks unauthorised cloud egress. |
| `settlement.contract-renewal.2026-001` | A settlement record. |
| `event.document.ingested.evt-001` | A structured event. |

See [THE-SOCIETY-OF-REPO/02-protocols/01-identity.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
for the full identity protocol.

---

## Implementation Terms

These terms come from the planning documents in
[FORGEJO-SOCIETY-IMPLEMENTATION/](FORGEJO-SOCIETY-IMPLEMENTATION/), which
collapse the Society of Repo specification onto two operational targets: one
Forgejo Actions workflow file and one root cognitive folder.

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Body | The single Forgejo Actions workflow file `.forgejo/workflows/forgejo-society.yaml` that drives the cognitive loop on each event. | [02-workflow-design.md](FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md) |
| Mind | The single root folder `.forgejo-society/` that holds the runtime cognitive content (governance, frames, agencies, critics, censors, memory, workspace, state). | [01-target-layout.md](FORGEJO-SOCIETY-IMPLEMENTATION/01-target-layout.md) |
| Two-target collapse rule | Every cognitive structure in `THE-SOCIETY-OF-REPO/` must become either a file under `.forgejo-society/` or a step in the single workflow; nothing else. | [00-overview.md](FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md) |
| Enable sentinel | The file `.forgejo-society/forgejo-society-ENABLED.md`. Presence is permission; the workflow's first guard step exits cleanly if it is missing. | [00-overview.md](FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md) |
| Stimulus | A normalised Forgejo event (issue, comment, label, push, pull request, schedule, manual dispatch) used as the entry point to one cycle of the cognitive loop. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Cognitive loop | The ordered phases stimulus → perception → frame selection → K-line and analogy activation → agency response → criticism → graduated inhibition → censorship → settlement → action → outcome → memory → credit assignment → reinforcement. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Perception | The phase that turns a raw stimulus into structured observations (percepts) by consulting polynemes and frame hints. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Activation | The phase that selects a frame, reactivates relevant K-lines and analogies, and wakes the agencies whose `activates_on` conditions match. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Graduated inhibition | The damping of activated paths by critic and suppressor objections before censors run; weaker than a censor block, stronger than a comment. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Blackboard | A layered, human-readable file (`state/mind/issues/<n>/blackboard.md`) where the runtime stages the current situation across cognitive layers during a run. | [08-state-and-memory.md](FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md) |
| Conscious presenter | The integration agency (`agency.integration.conscious-presenter`) that is the sole producer of the society's visible response — the bottleneck through which Spock speaks. | [05-agencies-critics-censors.md](FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) |
| Spock | The society's single public voice and self-model. Defined by `.forgejo-society/AGENTS.md` and emitted only through the conscious presenter. | [00-overview.md](FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md) |
| Archivist | The integration agency that promotes settled material from `state/` and `workspace/` into `memory/`. The only writer to durable memory. | [05-agencies-critics-censors.md](FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) |
| State tree | `.forgejo-society/state/` — per-run, append-only scratch trace of one stimulus (percepts, activation, signals, objections, final response, candidate K-line). | [08-state-and-memory.md](FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md) |
| Workspace tree | `.forgejo-society/workspace/` — short-term cognitive attention; the only tree the runtime may mutate in place. Swept after settlement. | [08-state-and-memory.md](FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md) |
| Memory tree | `.forgejo-society/memory/` — durable, governed, append-only store of settled cognition (episodic, semantic, procedural, frames, analogies, concepts, K-lines, decisions). Promotion is one-way and archivist-only. | [08-state-and-memory.md](FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md) |
| Imagination branch | A throwaway Git branch on which a candidate diff is drafted and tested before any merge is considered. | [05-agencies-critics-censors.md](FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) |
| Candidate future | A branch that represents a hypothesis the society entertains but has not yet adopted. Only `main` is accepted reality. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Reality revision | A merge into `main`. The only point at which the society's accepted reality changes; always accompanied by a settlement record. | [03-runtime-pipeline.md](FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) |
| Polyneme file | A YAML map under `.forgejo-society/nemes/` that fires the same symbol (path, label, phrase) into several agencies with different meanings. | [06-frames-polynemes-klines.md](FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md) |
| Frame file | A YAML file under `.forgejo-society/frames/` declaring slots, defaults, default critics and censors, failure conditions, and linked K-lines for a recognisable kind of situation. | [06-frames-polynemes-klines.md](FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md) |
| Manifest | The Markdown-with-YAML-frontmatter file that defines one agency, critic, or censor: its id, authority, tool grants, activation conditions, outputs, and budget. | [05-agencies-critics-censors.md](FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) |
| Signal record | The internal communication unit. JSONL record with `name`, `energy`, `source`, `evidence`, and suggested excite/inhibit effects. *No evidence, no trust* is a runtime law. | [09-handoff-and-signal-schemas.md](FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md) |
| Handoff record | The structured return value of one agency run (status, confidence, evidence, outputs). Replaces freeform prose between agents. | [09-handoff-and-signal-schemas.md](FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md) |
| Settlement record | A YAML file under `workspace/active-settlements/` that records what was decided, why, by whom, and under which authority before any action runs. | [09-handoff-and-signal-schemas.md](FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md) |
| K-line file | A YAML file under `.forgejo-society/memory/klines/` that records the agencies, critics, censors, frames, files, and decisions active around a useful event, with `restore_when` conditions for reactivation. | [06-frames-polynemes-klines.md](FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md) |
| Danger zone | A path or operation listed in `.forgejo-society/policies/danger-zones.yml` that triggers extra censors, suppressors, or approval gates. | [07-policies-and-safety.md](FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md) |
| Self-modification frame | The frame required for any change to `agencies/`, `policies/`, `governance/`, `AGENTS.md`, or `APPEND_SYSTEM.md`. Adding capabilities goes through it. | [06-frames-polynemes-klines.md](FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md) |
| Phase A | The first-ship scope defined by the bootstrap checklist: minimum-viable files and acceptance checks needed for one end-to-end cycle. | [10-bootstrap-checklist.md](FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md) |

---

## Forgejo Intelligence Runtime Terms

These terms come from the runnable runtime under
[FORGEJO-SOCIETY/forgejo-intelligence/](FORGEJO-SOCIETY/forgejo-intelligence/),
the Bun/TypeScript implementation that turns a Forgejo repository into a
self-hosted, auditable AI workspace.

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Forgejo Intelligence | The repository-native runtime: one Forgejo Actions workflow plus the `.forgejo-intelligence/` folder of code, config, state, and surface modules. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Runtime folder | `.forgejo-intelligence/` — the entire runtime tree (lifecycle, platform adapter, bridge, guardrail, surface handlers, agent engines, state, tests, help). | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Workflow agent | `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` — the single Forgejo Actions workflow that boots the runtime on each event. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Sentinel | `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`. Presence is permission; deleting and committing the file is the kill switch. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Orchestrator | `lifecycle/forgejo-intelligence-ORCHESTRATOR.ts` — reads the Forgejo event, normalises it through the bridge, runs guardrails, loads the surface handler, runs the agent, commits state, and posts through the Forgejo API adapter. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Indicator | `lifecycle/forgejo-intelligence-INDICATOR.ts` — adds a reaction or progress comment when the Forgejo instance supports it, so the user can see the run is alive. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Bridge | `forgejo-intelligence-bridge/` — the event translation layer. Normalises Forgejo Actions and webhook payloads into the platform-neutral event schema. | [forgejo-intelligence-bridge/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/forgejo-intelligence-bridge/README.md) |
| Guardrail | `forgejo-intelligence-guardrail/` — pre-agent safety and activation checks. Enforces folder-based activation and fails closed on unknown or retired surfaces. | [forgejo-intelligence-guardrail/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/forgejo-intelligence-guardrail/README.md) |
| Platform adapter | `platform/` — the Forgejo API adapter, shared types, and structured API errors. The single seam between the runtime and the forge. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Surface | A class of repository activity the runtime listens to (issues, pull requests, commits, releases, wiki, …). One surface, one folder. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Surface handler | A folder under `.forgejo-intelligence/forgejo-intelligent-*/` that handles one surface. Presence enables the surface; removal disables it. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| `forgejo-intelligent-*` prefix | Naming family for surface-handler folders (for example `forgejo-intelligent-issue`, `forgejo-intelligent-pull-request`). | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| `forgejo-intelligence-*` prefix | Naming family for coordination and cross-surface modules (bridge, guardrail, swarm, dashboard, cron, plugin, knowledge, …). | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| `forgejo-ai-*` prefix | Naming family for agent engines and execution styles (for example `forgejo-ai-pi`, `forgejo-ai-openclaw`). | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Agent engine | A pluggable agent implementation under a `forgejo-ai-*/` folder. The default engine is Pi (`@mariozechner/pi-coding-agent`). | [forgejo-ai-pi/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/forgejo-ai-pi/README.md) |
| Session | A continuing conversation tied to a single issue or pull request. Mapping files under `state/issues/` and `state/pull-requests/` point to JSONL session logs in `state/sessions/`. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |
| Committed state | Runtime state (mappings, transcripts, schema version) deliberately written to `.forgejo-intelligence/state/` and pushed to Git, so the mind has a memory you can `git log`. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Installer | `.forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts` — the Bun CLI that writes Forgejo-native paths, the workflow, and `config/install.json`. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Hatching template | The optional issue template `.forgejo/ISSUE_TEMPLATE/hatch.md` (or `.gitea/ISSUE_TEMPLATE/hatch.md`) used to bring up a new conversation surface. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Bot-loop suppression | The orchestrator's rule that events from known bot actors are ignored so the runtime cannot trigger itself in a loop. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Fork-safe by default | The rule that pull requests from forks are skipped unless explicitly opened, so write-capable automation never runs against untrusted fork code. | [FORGEJO-SOCIETY/forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/README.md) |
| Smoke harness | `bun run smoke:local-forgejo` — the integration check that opens an issue, comments, pushes a branch, opens a PR, tags, and prereleases against a disposable Forgejo repository. | [.forgejo-intelligence/README.md](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/README.md) |

---

## Runtime and Compliance Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Self-hosted Forgejo | The maintainers' own Forgejo instance on owned Ubuntu hardware. This is the intended runtime home. | [forgejo-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md) |
| Shared Forgejo | A public or third-party Forgejo instance, such as Codeberg. In this project, shared Forgejo instances are mirrors and collaboration surfaces, not agent runtimes. | [forgejo-warning.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-warning.md) |
| GitHub mirror | A development or source mirror. GitHub is not the production runtime for agent workloads in this project. | [github-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md) |
| Runner | The machine that executes Forgejo Actions workflows. For agent workloads, runners must be attached to the maintainers' self-hosted Forgejo and owned infrastructure. | [forgejo-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md) |
| Enable sentinel | The explicit file or condition required before write-capable Forgejo runtime behaviour can operate. | [THE-SOCIETY-OF-REPO/01-governance/constitution.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/constitution.md) |

---

## Usage Notes

- Use **Forgejo Society** for the project name.
- Use **Society of Repo** for the repository-native architecture.
- Use **Society of Mind** only when referring to Minsky's theoretical frame.
- Prefer concrete mechanism names: workflow, runner, agency, critic, censor,
  memory, workspace, K-line, settlement, signal, handoff, bridge.
- Do not introduce new authority levels or identifier scopes without amending
  the relevant Society of Repo protocol.

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80" title="Forgejo Society">
  </picture>
</p>
