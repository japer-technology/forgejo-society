# Forgejo Environment Protocol

The Society of Repo is intended to live inside a Forgejo environment, not beside
one.

Forgejo supplies the operational body: repository surfaces, Actions runs,
runners, API tokens, comments, labels, pull requests, wiki pages, releases, and
git history. The Society supplies the governed mind: constitutions, critics,
censors, settlements, memory, rights, and approvals.

This protocol turns the Forgejo operational model extracted from
`REPO/forgejo-intelligence` into SOR requirements.

---

## Deployment contract

A Forgejo-hosted SOR uses these paths as separate control layers:

| Path | SOR role |
|---|---|
| `.forgejo/workflows/` | Event loop and runner entrypoints |
| `.forgejo-intelligence/` | Forgejo runtime, surface handlers, coordination modules, agent engines, tests, and runtime state |
| `.forgejo-intelligence/state/` | Operational session state, mappings, schema version, migrations, and runtime reports |
| `SOCIETY-OF-REPO/` | Cognitive specification, governance, memory, protocols, agencies, critics, censors, and workspaces |

The runtime may execute actions, but the SOR specification defines whether those
actions are authorised.

---

## Runtime invariants

Every Forgejo deployment of a SOR MUST preserve these invariants:

1. The runtime is fail-closed.
2. The enable sentinel is required before any agent work runs.
3. Presence is permission for runtime surfaces; absence is denial.
4. Folder presence is necessary but not sufficient for SOR authority.
5. Forgejo events are normalized before they enter the cognitive loop.
6. Guardrails run before any model or agent receives the event.
7. Write-capable operations go through a Forgejo API boundary, not ad hoc shell or network calls.
8. Session state and mappings are committed to git.
9. Secrets are stored only as Forgejo Actions secrets, never in issues, comments, wiki pages, prompts, or committed state.
10. Fork pull requests are skipped by default unless a separate read-only fork policy is approved.

The primary operational kill switch is:

```text
.forgejo-intelligence/forgejo-intelligence-ENABLED.md
```

Removing this file and committing the removal stops the runtime. Restoring it is
a runtime enablement change and requires governance approval.

---

## Runtime pipeline

The Forgejo Actions workflow follows this sequence:

```text
Forgejo event
  -> workflow trigger in .forgejo/workflows/
  -> enable sentinel guard
  -> progress indicator where supported
  -> dependency installation
  -> orchestrator
  -> event bridge normalization
  -> guardrail validation
  -> active surface handler
  -> agent execution
  -> state mapping and transcript update
  -> git commit and push
  -> Forgejo API response
  -> indicator cleanup
```

This maps to the SOR cognitive loop as:

| Forgejo operation | SOR loop role |
|---|---|
| Issue, PR, push, release, wiki, schedule, or dispatch event | Stimulus |
| Bridge normalization | Perception and representation |
| Surface routing | Frame and activation cue |
| Guardrail validation | Pre-cognitive safety filter |
| Surface handler prompt construction | Agency response setup |
| Agent run | Agency work |
| API comment, label, release, wiki, or PR write | Proposed or authorised action |
| State commit | Operational memory trace |
| Workflow log | Body-level observability |

The SOR must not treat a successful workflow run as a settlement. A workflow run
is execution evidence. The settlement remains the governed decision record.

---

## Forgejo context

The runtime reads Forgejo-native environment values:

```text
FORGEJO_EVENT_PATH
FORGEJO_EVENT_NAME
FORGEJO_REPOSITORY
FORGEJO_API_URL
FORGEJO_SERVER_URL
FORGEJO_ACTOR
FORGEJO_RUN_ID
FORGEJO_TOKEN
```

Provider keys such as `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, and similar values
may be passed only through Forgejo Actions secrets and only to the agent run
step.

`GITHUB_*` variables, the `gh` CLI, GitHub REST endpoints, GitHub Actions
permissions, GitHub Discussions, GitHub Sponsors, and GitHub Codespaces are not
part of the active SOR runtime. They may appear only in migration notes or
archived compatibility material.

---

## Surface activation

Forgejo Intelligence distinguishes three runtime folder classes:

| Prefix | Meaning |
|---|---|
| `forgejo-intelligent-*` | Repository surface handlers |
| `forgejo-intelligence-*` | Cross-surface coordination modules |
| `forgejo-ai-*` | Agent engines and execution styles |

A surface is active only when all of the following are true:

1. The Forgejo workflow can receive the event.
2. The enable sentinel exists.
3. The event bridge maps the event to a known surface.
4. The matching `forgejo-intelligent-*` folder exists.
5. The guardrail accepts the event.
6. The responsible SOR agency, critic, censor, or service has a constitution and rights entry.
7. The requested action is inside the settlement and approval boundary.

Removing a `forgejo-intelligent-*` folder disables that surface at runtime.
Adding or restoring a surface folder is a surface activation change and requires
human approval through governance.

---

## Surface map

Forgejo surfaces provide the normal user interface for SOR cognition:

| Forgejo surface | SOR interpretation |
|---|---|
| Issues | Stimuli, owner requests, approval records, task threads |
| Issue comments | Dialogue, approval or denial evidence, progress notes |
| Labels | Activation signals, classifications, approval labels |
| Pull requests | Proposed changes, reviewable actions, governance amendments |
| PR comments and changed files | Review evidence and critic input |
| Commits | Durable state change and memory trace |
| Branches | Insulated futures, experiments, and reversible work |
| Forks | External contribution boundary requiring restricted trust |
| Actions runs | Body telemetry, execution evidence, build and agent activity |
| Releases and tags | Publication and version milestones |
| Wiki pages | Optional procedural, decision, or knowledge surface when validated |
| Projects and milestones | Attention, planning, and progress structure |
| Packages and static pages | Service or publication outputs where instance support is validated |
| Teams and collaborators | Authority and access-control context |
| Reactions | Low-bandwidth signals only, never approval unless a policy explicitly says so |

Instance-specific surfaces may be used only after fixtures, handler behavior,
and API support are validated for the target Forgejo instance.

---

## Event normalization

Forgejo events entering the SOR must be normalized before agencies consume them.

The normalized record must include:

```yaml
platform: forgejo
surface: issue | pull-request | commit | action | wiki | release | unknown
surface_folder: forgejo-intelligent-issue
platform_event: issues
action: opened
actor: forgejo-login
repository: owner/repo
title: human-readable target title
body: primary text body
number: issue-or-pr-number-or-null
node_id: forgejo-target-id-or-null
html_url: forgejo-web-url
default_branch: branch-name
metadata: {}
raw_payload_ref: workspace-or-test-fixture-reference
received_at: ISO-8601
```

Raw payloads are diagnostic evidence. If retained in SOR memory, they must be
redacted for token, secret, password, authorization, and credential-like fields.

Unknown surfaces fail closed and may produce a `forgejo.surface.rejected` event.

---

## API boundary

All Forgejo writes must go through a platform adapter equivalent to
`.forgejo-intelligence/platform/forgejo-api.ts`.

Allowed adapter operations include:

```text
getCurrentUser
getRepository
getActorPermission
createIssueComment
editIssue
addIssueReaction
deleteIssueReaction
listPullRequestFiles
createPullRequest
createRelease
upsertLabel
listMilestones
getWikiPage
updateWikiPage
```

Surface handlers must not add one-off `fetch` calls, shell out to `gh`, or call
Forgejo endpoints directly. Missing platform behavior is added to the adapter
first, tested, then used by surfaces.

Forgejo Actions compatibility `permissions:` declarations are not an authority
model. Token scope is controlled by Forgejo repository and token administration,
then constrained by SOR rights, censors, and settlements.

---

## State and memory boundary

Forgejo Intelligence runtime state is operational memory:

```text
.forgejo-intelligence/state/
  schema-version.json
  issues/
  pull-requests/
  sessions/
  migrations/
```

Issue and pull request mappings preserve session continuity. JSONL session logs
are evidence for replay and review, but they are not automatically semantic or
decision memory.

Promotion rules:

| Runtime state | SOR memory target |
|---|---|
| Event payload or workflow log excerpt | `06-memory/events/` or failure memory, after redaction |
| Completed conversation summary | episodic memory |
| Accepted rule or operating procedure | procedural memory |
| Settled decision | decision memory |
| Repeated activation pattern | K-line memory |
| Runtime failure pattern | failure memory |

The SOR must never promote secrets from runtime state into memory.

---

## Public and fork safety

Public repositories require stricter controls:

1. Issue automation should use label, actor, or permission filters before broad public enablement.
2. Fork pull requests are skipped by default.
3. A read-only fork workflow must not receive write tokens or model provider secrets.
4. Contributors must be warned not to paste secrets into issues, comments, PR bodies, wiki pages, or attachments.
5. State commits must be reviewed for accidental sensitive data.

---

## Disable and recovery order

Use this order when stopping or narrowing the runtime:

1. Remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
2. Remove the relevant `forgejo-intelligent-*` surface folder.
3. Tighten workflow triggers or job-level conditions.
4. Reduce token scope or rotate the token.
5. Disable the workflow in the Forgejo UI.

Re-enablement requires a settlement or governance PR that records what changed,
why it is safe, and which tests or preflights were run.

---

## Operational verification

A Forgejo-hosted SOR should maintain these checks:

| Check | Purpose |
|---|---|
| Surface inventory | Confirms active `forgejo-intelligent-*` folders match approved surfaces |
| Sentinel check | Confirms runtime enablement state is intentional |
| Workflow preflight | Confirms the runner, image, Bun, git, jq, node, tee, and tac are available |
| Bridge fixture tests | Confirms supported Forgejo payloads normalize correctly |
| API adapter tests | Confirms auth, pagination, errors, and write operations are structured |
| Guardrail tests | Confirms unknown events, inactive surfaces, bot actors, and oversized bodies fail closed |
| State schema check | Confirms mappings and sessions are valid and migratable |
| Disposable smoke test | Confirms issue, comment, branch, PR, tag, and release operations on a test repo |

Production smoke tests must target disposable repositories unless the settlement
explicitly authorises writes to the real repository.

---

## Unsupported parity claims

The SOR must not imply Forgejo-native support for GitHub-only features.

| GitHub-only capability | Forgejo-native SOR outcome |
|---|---|
| Discussions | Use issues, projects, or wiki RFC pages |
| Sponsors | Retired unless an external funding integration is explicitly added |
| Codespaces | Use committed development environment files |
| Standalone code review events | Fold into pull request intelligence unless Forgejo fixtures prove support |
| Deployments | Retire until the target instance has a validated integration |
| Dependabot/code-scanning parity | Treat as external scanner ingestion, not native parity |

False capability claims are a specification defect.

