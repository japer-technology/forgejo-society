# 06 — Frames, Polynemes, K-lines

The three Minsky-derived structures that turn the runtime from a router into
a society. Source: `THE-REPO-IS-THE-MIND/possibility-2.md` and
`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`,
`THE-SOCIETY-OF-REPO/06-memory/frames/`, `THE-SOCIETY-OF-REPO/06-memory/klines/`,
and the deep-dive at `THE-SOCIETY-OF-REPO/deep-dive/klines.md`.

---

## Frames

A frame is a structured *expectation* about a kind of situation. The frame
selects defaults, names the slots that must be filled, and lists the
failure conditions that block settlement.

### Schema

```yaml
name: <frame-id>
description: <one line>
matches:
  any_signals: [ ... ]       # presence of these signals biases selection
  any_labels: [ ... ]
  any_paths: [ ... ]
  any_phrases: [ ... ]
slots:
  <slot-name>:
    required: true|false
    filled_by: [ <agent-id>, ... ]
default_actions: [ <phase-hint>, ... ]
default_critics: [ <critic-id>, ... ]
default_censors: [ <censor-id>, ... ]
failure_conditions: [ <named-objection>, ... ]
linked_klines: [ <kline-id>, ... ]
linked_procedures: [ <procedural-id>, ... ]
```

Validated by `schemas/frame.schema.json`.

### First-ship frame catalogue

| File | When it fits |
|---|---|
| `question.frame.yml` | The user is asking, not requesting change |
| `bug.frame.yml` | A defect is reported with reproducible behaviour |
| `feature.frame.yml` | A new capability is requested |
| `code-change.frame.yml` | Any code modification request that is neither bug nor feature |
| `security-sensitive.frame.yml` | The stimulus touches `.forgejo/workflows/**`, secrets, auth, permissions |
| `self-modification.frame.yml` | The stimulus would change `agencies/`, `policies/`, `governance/`, `AGENTS.md`, or `APPEND_SYSTEM.md` |
| `novel.frame.yml` | No frame matches strongly; analogy pass is mandatory |

The `code-change` frame's required slots match `possibility-2.md`:
`user_goal`, `relevant_files`, `proposed_patch`, `tests`, `risks`,
`final_user_response`. The `security-sensitive` frame additionally requires
`permission_diff`, `revert_path`, and `human_confirmation_state`.

---

## Polynemes

A polyneme is a symbol-like activator that wakes many partial meanings across
agencies. In `.forgejo-society/nemes/` they are repo files.

### Schema (per entry in any `*-polynemes.yml`)

```yaml
- symbol: <symbol-id>
  match:
    paths: [ <glob>, ... ]      # path-polynemes only
    labels: [ <label>, ... ]    # label-polynemes only
    phrases: [ <phrase>, ... ]  # phrase-polynemes only
  excite:
    <agent-id>: <weight 0..1>
  inhibit:
    <agent-id>: <weight 0..1>
  default_frame: <frame-id>     # optional override
```

### First-ship polynemes

`path-polynemes.yml`:

| symbol | matches | default frame |
|---|---|---|
| `workflow-file` | `.forgejo/workflows/**`, `.github/workflows/**` | `security-sensitive` |
| `soul-file` | `.forgejo-society/AGENTS.md`, `.forgejo-society/APPEND_SYSTEM.md` | `self-modification` |
| `governance-file` | `.forgejo-society/governance/**` | `self-modification` |
| `policy-file` | `.forgejo-society/policies/**` | `self-modification` |
| `agency-file` | `.forgejo-society/agencies/**`, `.forgejo-society/critics/**`, `.forgejo-society/censors/**` | `self-modification` |
| `memory-file` | `.forgejo-society/memory/**` | depends on stimulus |
| `state-file` | `.forgejo-society/state/**` | depends on stimulus |
| `secret-file` | `**/.env*`, `**/secrets/**`, `**/*.pem`, `**/*.key` | `security-sensitive` |

`label-polynemes.yml`:

| symbol | matches |
|---|---|
| `activation:intake` | `activate:intake` (compatible with the seed workflow) |
| `kind:question` | `question` |
| `kind:bug` | `bug` |
| `kind:feature` | `enhancement`, `feature` |
| `kind:security` | `security`, `vulnerability` |
| `kind:self-mod` | `self-modification` |

`phrase-polynemes.yml`:

| symbol | matches |
|---|---|
| `memory-request` | `remember`, `what did we decide`, `you said before`, `last time` |
| `safety-concern` | `secret`, `credential`, `api key`, `token`, `password` |
| `ownership-question` | `who owns`, `who decided`, `who can` |
| `directive.spock` | `society spock:` |
| `directive.safety` | `society safety:` |
| `directive.memory` | `society memory:` |
| `directive.critic` | `society critic:` |

The `directive.*` polynemes parse the `society <target>:` syntax described in
`possibility-2.md`’s *direct internal addressing* section, **without** breaking
the `RESERVED_PREFIXES` compatibility rule for other agents.

---

## K-lines

A K-line is a remembered *mental configuration* that solved a similar
problem before. It is not session replay; it is reusable activation.

### Schema

```yaml
id: <kline-id>                           # kline.<class>.<date>.<stimulus_id>
class: <code-change|security|question|self-modification|...>
issue: <stimulus_id>
outcome: success|partial|failed

cue:
  title_terms: [ ... ]
  labels: [ ... ]
  paths_touched: [ ... ]
  symbols: [ ... ]                       # polyneme symbols active at success

activation_snapshot:
  frame: <frame-id>
  active_agencies:
    <agent-id>: <weight 0..1>

useful_context:
  files_read: [ ... ]
  commands_run: [ ... ]
  prior_settlements: [ <settlement-id>, ... ]
  prior_klines: [ <kline-id>, ... ]

decision:
  summary: <one-line>
  caveat: <one-line or null>

restore_when:
  any_terms: [ ... ]
  any_labels: [ ... ]
  any_paths: [ ... ]
  any_symbols: [ ... ]

reinforcement:
  tests_passed: bool
  user_reacted_positive: bool|null
  later_reverted: bool
  reuse_count: <int>
  last_reused_at: <iso8601>
  decay_score: <float>                   # updated by scheduled decay pass
```

Validated by `schemas/kline.schema.json`.

### Where K-lines live

```
memory/klines/<class>/<date>-<stimulus_id>.yml
```

Class folders are created on demand. The cron scheduled run prunes K-lines
whose `decay_score` falls below the threshold in `policies/memory-policy.yml`.

### When a K-line is written

Only by the `archivist` in the `remember` phase, and only when:

- the settlement outcome was `success` or `partial`
- at least one slot in the frame was filled by a non-trivial agency
- the resulting useful context (files read, commands run, prior decisions
  cited) is non-empty

K-lines are never written by individual agencies directly.

### When a K-line reactivates

In the `activate` phase, `klines.ts`:

1. computes a similarity score between the current stimulus cue and each
   K-line’s `restore_when`
2. selects up to `memory.max_k_lines_loaded` (from `config/society.yml`)
3. boosts the activation of every agency in each chosen K-line’s
   `activation_snapshot`
4. preloads its `useful_context.files_read` so the cartographer sees them
5. records the reactivation in `state/.../activation.jsonl` with the K-line
   id, so credit assignment can later reinforce or weaken it

This implements `possibility-2.md`’s *K-lines: the missing genius layer*.

---

## Analogy fallback

When no K-line matches strongly and no frame matches strongly, the
`activate` phase runs an analogy pass over `memory/analogies/`. Analogies are
typed structural mappings between domains. The first-ship catalogue is
empty; analogies are written by the `meta-admin` family during ecology
review.

---

## Relationship summary

```text
Polynemes  → wake agencies and bias frame selection (cheap, immediate)
Frames     → shape expectations and required slots (situational)
K-lines    → reactivate prior winning configurations (experiential)
Analogies  → structural fallback when nothing else matches (creative)
```

All four feed `state/.../activation.jsonl` and together produce the active
society for the current stimulus.
