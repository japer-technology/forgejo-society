# 05 — Agencies, Critics, Censors

This document specifies the *first-ship* catalogue and the manifest schema.
The catalogue is intentionally small. Future additions go through the
`self-modification` frame.

---

## Manifest schema

Every agency, critic, and censor is one Markdown file with YAML frontmatter:

```yaml
---
id: <agency.family.name>           # dot-separated lowercase, hyphenated
agency: <family>                   # perception | memory | code | safety | identity | integration | assembly | meta-admin
kind: <kind>                       # worker | critic | censor | suppressor | narrator | assembler | meta
authority: <level>                 # read | draft | propose | act | govern | human
description: <one-line>
tools:                             # tool group ids from config/tools.yml
  - read
  - grep
writes: false                      # default; true requires write-policy.yml entry
activates_on:
  signals:                         # any of these signal names triggers this unit
    - <signal-name>
  frames:                          # optional; activates only inside listed frames
    - <frame-id>
  paths:                           # optional; via path polynemes
    - <glob>
inhibits:                          # optional; emits inhibitory signals at activation
  - <agent-id>
outputs:                           # which artifacts this unit may produce
  - signal
  - handoff
  - objection
  - candidate_action
  - validation_plan
  - validation_result
  - final_response                 # narrators only
fires_at: pre_tool_grant           # censors only
unconditional: true                # censors only
budget:
  max_tool_calls: 8
  max_wall_clock_s: 60
---

# <Display Name>

<Prose body that becomes the agent prompt.>
```

Validated by `schemas/manifest.schema.json`.

---

## First-ship agency catalogue

Aligned with `possibility-2.md`’s *agencies I would actually ship first* and
with the agency families in `THE-SOCIETY-OF-REPO/03-agencies/`.

### Perception family — `agencies/perception/`

| id | Job |
|---|---|
| `agency.perception.intake-bee` | Classify and route incoming stimuli (mirrors SOR `intake-bee`) |
| `agency.perception.issue-kind-detector` | Tag the issue: question, bug, feature, security, self-mod |
| `agency.perception.ambiguity-detector` | Flag missing slots in the chosen frame |
| `agency.perception.urgency-detector` | Estimate response budget and indicator level |

### Memory family — `agencies/memory/`

| id | Job |
|---|---|
| `agency.memory.prior-decision-resonator` | Surface prior decisions that resemble the stimulus |
| `agency.memory.kline-retriever` | Reactivate K-lines whose `restore_when` matches |
| `agency.memory.contradiction-finder` | Flag candidate actions that contradict semantic memory |
| `agency.memory.forgetting-critic` | Mark stale records for decay |

### Code family — `agencies/code/`

| id | Job |
|---|---|
| `agency.code.codebase-cartographer` | Map the relevant files for the stimulus |
| `agency.code.patch-imaginer` | Draft a candidate diff on an imagination branch |
| `agency.code.implementer` | Apply the chosen diff (subject to censors) |
| `agency.code.test-hunger` | Find and run the cheapest meaningful validation |
| `agency.code.diff-skeptic` | Attack the proposed patch on its own terms |
| `agency.code.revert-path-finder` | Ensure every applied change has a known revert |

### Safety family — `agencies/safety/`

These are *agencies* that emit signals. Some of them also have censor
counterparts in `censors/` that mechanically alter the tool surface.

| id | Job |
|---|---|
| `agency.safety.blast-radius-fear` | Estimate scope of a candidate action |
| `agency.safety.permission-minimizer` | Propose the smallest permission set that works |
| `agency.safety.self-replication-detector` | Detect attempts to clone the runtime or expand authority |
| `agency.safety.danger-zone-watcher` | Tag any path or diff that overlaps `policies/danger-zones.yml` |

### Identity family — `agencies/identity/`

| id | Job |
|---|---|
| `agency.identity.spock-self-model` | Keep the response consistent with `AGENTS.md` |
| `agency.identity.user-model-keeper` | Track user preferences and prior dialogue context |
| `agency.identity.tone-stabilizer` | Enforce tone described in `AGENTS.md` |
| `agency.identity.soul-file-guardian` | Veto any edit to `AGENTS.md` / `APPEND_SYSTEM.md` without `self-modification` frame |

### Integration family — `agencies/integration/`

| id | Job |
|---|---|
| `agency.integration.conscious-presenter` | Sole producer of Spock’s visible response |
| `agency.integration.commit-steward` | Decide commit vs PR vs branch-only outcome |
| `agency.integration.archivist` | Promote settled material from `state/` to `memory/` |

### Assembly family — `agencies/assembly/`

| id | Job |
|---|---|
| `agency.assembly.summary-tier-1` | Compress raw signals into per-family summaries |
| `agency.assembly.summary-tier-2` | Compress family summaries into a settlement-ready brief |

### Meta-admin family — `agencies/meta-admin/`

| id | Job |
|---|---|
| `agency.meta-admin.ecology-monitor` | Run scheduled ecology review (cron path) |
| `agency.meta-admin.differentiation-broker` | Propose splitting an over-broad agency |
| `agency.meta-admin.retirement-broker` | Propose retiring an unused agency |

---

## First-ship critic catalogue (`critics/`)

Mirrors `THE-SOCIETY-OF-REPO/04-critics/`:

- `critic.evidence` — proposals without sufficient evidence
- `critic.scope` — proposals exceeding declared scope
- `critic.cost` — unjustified or unbudgeted cost
- `critic.privacy` — possible exposure of sensitive data
- `critic.risk` — undisclosed or underweighted risk
- `critic.overconfidence` — confidence higher than evidence supports
- `critic.source-quality` — evidence from low-quality sources
- `critic.staleness` — evidence older than its freshness threshold

Each critic runs in the `criticize` phase. They emit objections only;
they never act. They do not consume write tools.

---

## First-ship censor catalogue (`censors/`)

Mirrors `THE-SOCIETY-OF-REPO/05-censors/` and `possibility-2.md`’s safety set:

| id | `fires_at` | What it stops |
|---|---|---|
| `censor.workflow-danger` | `pre_tool_grant` | Edits to `.forgejo/workflows/**` without human approval |
| `censor.secret-smeller` | `pre_tool_grant` | Touching `.env`, credentials, or high-entropy strings |
| `censor.cloud-egress` | `pre_tool_grant` | Outbound network calls to non-allowlisted hosts |
| `censor.authority` | `pre_tool_grant` | Acting beyond agency’s `authority-registry.yml` level |
| `censor.payment` | `pre_tool_grant` | Any action that triggers payment |
| `censor.delegation` | `pre_tool_grant` | Delegating to another society without channel agreement |
| `censor.credential` | `pre_tool_grant` | Reading or transmitting credentials |
| `censor.pii-exfiltration` | `pre_tool_grant` | PII leaving its declared scope |

Suppressors (output-stage) include:

| id | `fires_at` | What it stops |
|---|---|---|
| `suppressor.workflow-diff-keywords` | `post_candidate_output` | Diff containing `permissions:`, `secrets.`, `pull_request_target`, `workflow_run` without explicit confirmation |
| `suppressor.soul-file-diff` | `post_candidate_output` | Diff touching `AGENTS.md` or `APPEND_SYSTEM.md` outside the `self-modification` frame |
| `suppressor.high-entropy-string` | `post_candidate_output` | Likely-secret strings in any committed file |

---

## Authority defaults

| Family | Default authority |
|---|---|
| perception | `read` |
| memory | `propose` |
| code (read-only members) | `propose` |
| code (`implementer`) | `act` (only inside `code-change` frame and outside danger zones) |
| safety | `read` |
| identity | `propose` (except `soul-file-guardian` = `govern`) |
| integration (`conscious-presenter`) | `act` (text only; no file writes) |
| integration (`commit-steward`, `archivist`) | `act` |
| assembly | `propose` |
| meta-admin | `govern` (proposals require human confirmation) |
| critics | `read` (objections only) |
| censors | `govern` (mechanical, unconditional) |

These are seed defaults. Effective authority is the intersection with
`governance/authority-registry.yml`, which is the source of truth.

---

## Adding new agencies

A new agency is added by:

1. opening an issue with the `self-modification` label
2. drafting the manifest in a branch under `society/<stimulus_id>/candidate-1`
3. running through the loop with the `self-modification` frame
4. settlement requires human approval
5. on merge, the `archivist` records a procedural memory entry

Removing an agency follows the same path via the `retirement-broker`.
