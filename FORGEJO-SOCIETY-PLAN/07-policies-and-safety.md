# 07 — Policies and Safety

The runtime is *fail-closed*. Every safety mechanism in this document runs
before any agent receives the stimulus, before any tool is granted, and
before any candidate output crosses an effect boundary. The conscious agency
cannot be argued out of these.

Sources: `THE-REPO-IS-THE-MIND/possibility-2.md` (censors and suppressors as
first-class code; danger zones; soul-file protection),
`THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md` (runtime invariants),
`THE-SOCIETY-OF-REPO/05-censors/`, and
`THE-SOCIETY-OF-REPO/01-governance/approval-gate.md`.

---

## Layered safety model

| Layer | Where it lives | Who applies it | When it fires |
| --- | --- | --- | --- |
| Kill switch | `forgejo-society-ENABLED.md` + `policies/kill-switch.yml` | workflow `guard` step | before anything else |
| Guardrails | workflow `guardrail` step + `policies/*` | runtime, no model | after normalization, before perception |
| Authority | `governance/authority-registry.yml` | `policy.ts` per agency | before tool grant for that agency |
| Censors | `censors/*.md` | `censors.ts` + `policy.ts` | before tool grant; mechanically alters tool surface |
| Approval gate | `governance/approval-gate.yml` | `act.ts` | before any human-required action |
| Suppressors | `policies/danger-zones.yml` (suppressor blocks) + `censors/*.md` (kind: suppressor) | `act.ts` | on each candidate output |
| Imagination branches | `policies/write-policy.yml` | `act.ts` | for any write touching a danger zone |
| Reversion | `agency.code.revert-path-finder` | required slot in `code-change` frame | before settlement |

If any one of these blocks, the workflow does not silently do nothing — it
writes a *blocked* settlement and posts a brief comment so the user knows the
stimulus was received and intentionally not acted upon.

---

## Kill switch

The first guard step in the workflow:

```text
exit 0 if any of:
  - .forgejo-society/forgejo-society-ENABLED.md is missing
  - policies/kill-switch.yml: enabled is false
  - policies/kill-switch.yml: any reason in active_reasons
```

`kill-switch.yml` schema:

```yaml
enabled: true|false
active_reasons: [ <reason-id>, ... ]   # any non-empty list disables the runtime
last_changed_at: <iso8601>
last_changed_by: <login>
```

Restoring the sentinel or flipping `enabled` back to `true` is itself a
governance event and requires a settlement under the `self-modification` frame.

---

## Authority levels

Exactly six values, per the existing repository convention:

```
read  →  draft  →  propose  →  act  →  govern  →  human
```

Authority is interpreted as a ceiling. An agency may operate at or below its
declared level. A frame may *lower* the ceiling for that frame’s scope (e.g.
`security-sensitive` lowers `code.implementer` from `act` to `propose`). A
frame may *not* raise it.

`governance/authority-registry.yml` is the source of truth and is read by
`policy.ts` on every cycle.

---

## Danger zones

`policies/danger-zones.yml` enumerates regions of the repository whose changes
require extra steps. Each zone has a censor block and an optional suppressor
block. Schema:

```yaml
danger_zones:
  - name: <zone-id>
    paths:        [ <glob>, ... ]
    contents:     [ <regex>, ... ]   # optional content matchers
    censor:
      before_tools:
        remove:   [ <tool-id>, ... ]
      require:    [ <requirement-id>, ... ]   # human_confirmation, security_agency_pass, ...
    suppressor:
      if_diff_contains: [ <regex>, ... ]
      action: stop_and_comment | open_pr_only | request_human
```

First-ship danger zones (catalogue):

| Zone | Paths | Required |
| --- | --- | --- |
| `workflow_mutation` | `.forgejo/workflows/**`, `.github/workflows/**` | `human_confirmation`, `security_agency_pass`; remove `edit`/`write`/`bash` until granted |
| `soul_mutation` | `.forgejo-society/AGENTS.md`, `.forgejo-society/APPEND_SYSTEM.md` | `explicit_user_request`, `final_diff_summary`, `identity_agency_pass` |
| `governance_mutation` | `.forgejo-society/governance/**`, `.forgejo-society/policies/**` | `self-modification` frame, `human_confirmation` |
| `agency_mutation` | `.forgejo-society/agencies/**`, `.forgejo-society/critics/**`, `.forgejo-society/censors/**`, `.forgejo-society/frames/**`, `.forgejo-society/nemes/**` | `self-modification` frame, `human_confirmation` |
| `secret_handling` | `**/.env*`, `**/secrets/**`, `**/*.pem`, `**/*.key` | `secret-smeller` pass; `cloud-egress` censor active |
| `memory_mutation` | `.forgejo-society/memory/**` (in-place rewrites) | append-only enforced; rewrites require `human_confirmation` |

Danger zones override agency and frame defaults. They cannot be unlocked by
a single agency.

---

## Approval gate

`governance/approval-gate.yml` lists actions that always require a human:

```yaml
requires_human_approval:
  - action: write_workflow
    reason: workflow files alter the body itself
  - action: write_governance
    reason: governance changes alter the law
  - action: write_soul_file
    reason: AGENTS.md and APPEND_SYSTEM.md define identity
  - action: payment_any
  - action: cloud_egress_outside_allowlist
  - action: delegate_to_other_society
  - action: enable_runtime
    reason: restoring the kill switch is itself an approval
```

The `act` phase consults this list. A required action without confirmation
becomes an *owner briefing* in `workspace/owner-briefings/` and a comment on
the originating issue/PR; the workflow then exits cleanly with a *pending
human* settlement.

---

## Tool surface, mechanically

`possibility-2.md` is explicit: a safety agent should not merely advise the
LLM; it should *mechanically alter the tool surface*. The implementation:

```text
defaults := tools.yml[default_readonly]
allowed  := apply(authority_registry, agent.id, defaults)
allowed  := apply(write_policy, agent.id, frame.id, allowed)
allowed  := apply(rights_registry, agent.id, allowed)
for zone in danger_zones if zone matches stimulus or candidate:
    allowed := allowed minus zone.censor.before_tools.remove
for censor in censors where censor.kind == "censor":
    if censor blocks: allowed := []  # full block, no model call
return allowed
```

`pi.ts` is then invoked with exactly `allowed`. There is no path by which an
agent obtains a tool not in `allowed`.

---

## Suppressors

Suppressors fire on candidate outputs (diffs, comments, branch contents)
before they cross an effect boundary. Examples already enumerated in
`05-agencies-critics-censors.md`:

- `suppressor.workflow-diff-keywords`
- `suppressor.soul-file-diff`
- `suppressor.high-entropy-string`

A suppressor’s outcome is one of:

- `stop_and_comment` — discard the output, post the suppressor’s reason
- `open_pr_only` — divert from direct commit to PR
- `request_human` — escalate via owner briefing

---

## Imagination branches

For every write that touches a danger zone, the `act` phase MUST work on
`society/<stimulus_id>/candidate-<n>` rather than `main`. The branch is
either fast-forwarded, opened as a PR, or left untouched per the danger
zone’s censor. This is the operational form of `possibility-2.md`’s
*branches as imagination*.

The branch lifecycle:

1. created from `main` at the start of `act`
2. modified, validated, summarised
3. linked from the settlement
4. retained (not auto-deleted) until the user accepts or rejects the
   settlement, so revert is trivial

---

## Reversion guarantee

The `code-change` and `security-sensitive` frames both list
`agency.code.revert-path-finder` as a required slot filler. A settlement
without an explicit revert path is a failure condition that blocks action.
This implements `possibility-2.md`’s *Revert-Path-Finder*.

---

## Audit and observability

Every safety decision is recorded:

- guardrail blocks → `state/runs/<run>/guardrail.json`
- authority denials → `state/.../signals.jsonl` with `agent.blocked_by_policy`
- censor blocks → `state/.../signals.jsonl` with `censor.<id>.blocked`
- suppressor activations → `state/.../objections.jsonl`
- approval-gate redirections → `workspace/owner-briefings/<settlement_id>.md`

A blocked outcome is as fully documented as a successful one. *Censor
invisibility* (Insight I5 from `THE-SOCIETY-OF-REPO/05-censors/README.md`) is
addressed by always writing an explicit signal even when nothing visible
happened, so suppressor-triggered escapes can be detected later by
reviewing the trace.

---

## Public-repo posture

Per `THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`, fork PRs are
skipped by default. The guardrail step:

- detects forks
- exits cleanly with a *fork-skipped* settlement
- writes one short comment if and only if `policies/kill-switch.yml`
  permits read-only fork interaction
