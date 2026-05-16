# AI Agent Architecture

The AI agent architecture implements the cognitive ecology described in
[The Forge is the Mind, The Repo is an Agency](../../FORGEJO-SOCIETY-INTRODUCTION/THE-REPO-IS-THE-MIND/analysis/the-forge-is-the-mind-the-repo-is-an-agency.md).
Forgejo is the governance substrate. Agents are bounded workers that read from
and write back to repositories through controlled interfaces.

---

## Architectural principle

```
Stimulus (issue / webhook / schedule)
  └─► Agent activation
        ├─► Memory read (repository issues, commits, files)
        ├─► Local model inference (LM Studio — RTX 4090)
        │     └─► Cloud model (if local cannot handle the task)
        ├─► Proposed action (branch / pull request / comment)
        ├─► Critic / review gate (human or automated review)
        └─► Settlement commit (merge → memory reinforcement)
```

Every agent action passes through Forgejo's audit trail (commit log, PR history,
issue comments). Nothing happens outside version control.

---

## Repository roles (cognitive organs)

| Repository class | Cognitive role | Example |
| --- | --- | --- |
| `core` | Body / skeleton — infrastructure the whole system depends on | Forgejo config, runner images |
| `agent` | Micro-agency — a single bounded cognitive task | `agent-code-reviewer`, `agent-issue-triage` |
| `memory` | K-lines and recalled activation patterns | `memory-patterns`, `memory-decisions` |
| `governance` | Rules, policies, approvals, and authority boundaries | `governance-policies` |
| `experimental` | Probation — new agents not yet trusted | Anything untested |
| `public-showcase` | Publication layer | Repositories mirrored outward |
| `archive` | Retired or frozen | Completed experiments |

---

## Local-first cognitive economy

| Task class | Default model | Escalation condition |
| --- | --- | --- |
| Issue triage, labelling | Local (Gemma 4B / 8B Q4) | Ambiguous after 2 passes |
| Code review | Local (Gemma 27B Q4) | Security-critical change |
| Documentation generation | Local (Gemma 27B Q4) | Final publication draft |
| Architecture synthesis | Cloud (GPT-4o / Claude) | Explicit request only |
| External-facing release notes | Cloud | Explicit request only |

The RTX 4090 host runs LM Studio (or Ollama) with at least one fast small model (≤ 8B) and one
capable reasoning model (≤ 27B). Model families in order of preference: Google Gemma 4,
Google Gemma 3, Mistral Small, Llama 3.x. Cloud model usage requires an explicit policy
decision, not a default.

---

## Agent identity and access control

Each agent runs as a dedicated Forgejo service account with the minimum required permissions.

```
agent-code-reviewer
  ├─ Can: read repositories, post review comments, approve/reject PRs
  └─ Cannot: push directly to main, merge without human co-approval

agent-issue-triage
  ├─ Can: read issues, add labels, post comments, close duplicates
  └─ Cannot: delete issues, modify milestones, change repository settings
```

### Create an agent service account in Forgejo

```bash
# Via the Forgejo web UI:
# Site Administration → Users → Create user
# Username: agent-code-reviewer
# Email: agent-code-reviewer@internal.yourdomain.com
# Password: (strong random password, stored in vault)
# Do NOT check "Is admin"

# Via the API:
curl -s -X POST "$FORGEJO_URL/api/v1/admin/users" \
  -H "Authorization: token $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "agent-code-reviewer",
    "email": "agent-code-reviewer@internal.yourdomain.com",
    "password": "CHANGE_ME_STRONG_PASSWORD",
    "must_change_password": false,
    "send_notify": false
  }'
```

### Generate an API token for the agent

```bash
# Log in as the agent user and create a token
curl -s -X POST "$FORGEJO_URL/api/v1/users/agent-code-reviewer/tokens" \
  -u "agent-code-reviewer:AGENT_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"name": "agent-code-reviewer-token"}'
```

Store the token in a Forgejo repository-level secret, scoped to the repositories
the agent is allowed to operate on.

---

## Agent workflow pattern

All agents follow this four-step pattern:

### Step 1 — Read state

```bash
# Read open issues
curl -s "$FORGEJO_URL/api/v1/repos/$OWNER/$REPO/issues?state=open&limit=50" \
  -H "Authorization: token $AGENT_TOKEN" \
  | jq '.'

# Read a specific pull request diff
curl -s "$FORGEJO_URL/api/v1/repos/$OWNER/$REPO/pulls/$PR_NUMBER/files" \
  -H "Authorization: token $AGENT_TOKEN" \
  | jq '.'
```

### Step 2 — Run inference

```bash
# Call the local LM Studio endpoint
curl -s http://LLM_SERVER_IP:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3-27b",
    "messages": [
      {"role": "system", "content": "You are a code reviewer. Be concise and precise."},
      {"role": "user", "content": "Review this diff: '"$DIFF_CONTENT"'"}
    ],
    "temperature": 0.3,
    "max_tokens": 1024
  }' | jq '.choices[0].message.content'
```

### Step 3 — Propose action

```bash
# Post a review comment on a pull request
curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$OWNER/$REPO/issues/$PR_NUMBER/comments" \
  -H "Authorization: token $AGENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"body\": \"**[agent-code-reviewer]** $REVIEW_CONTENT\n\n_Local model: gemma-3-27b. Confidence: high._\"
  }"
```

### Step 4 — Record provenance

Every agent action commits a provenance record to a dedicated `memory` repository:

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "agent": "agent-code-reviewer",
  "model": "gemma-3-27b",
  "source_repo": "YOURORG/YOURREPO",
  "source_ref": "pull/42",
  "action": "review_comment",
  "artifact_sha": "abc123"
}
```

---

## Promotion pathway

Agent-created branches, workflows, and outputs are untrusted until promoted.

| Stage | Description | Promotion gate |
| --- | --- | --- |
| `experimental` | Untested agent work | Human review |
| `probation` | Tested but not yet trusted at scale | 30-day monitoring |
| `trusted` | Approved for autonomous operation within its scope | Governance approval |

A new agent starts in the `experimental` repository class. Promotion requires:

1. At least one human review of every type of action the agent can take.
2. Thirty days of operation without producing incorrect or harmful output.
3. An explicit governance decision recorded in the `governance-policies` repository.

---

## Rollback procedure

If an agent produces an incorrect output:

```bash
# 1. Revert the pull request merge
git revert -m 1 MERGE_COMMIT_SHA
git push forgejo main

# 2. Post an incident record as an issue
curl -s -X POST "$FORGEJO_URL/api/v1/repos/$OWNER/$REPO/issues" \
  -H "Authorization: token $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"[incident] agent-code-reviewer produced incorrect output on PR #$PR_NUMBER\",
    \"body\": \"Describe what went wrong, what was reverted, and what guard is being added.\",
    \"labels\": [\"incident\", \"agent\"]
  }"

# 3. Demote the agent to probation pending investigation
# Update the agent's repository class in governance-policies
```

---

## Open decisions resolved

- **Always-local task classes:** Issue triage, duplicate detection, label application,
  K-line routing, provenance recording, and code formatting checks. These are
  bounded, high-frequency tasks with binary or enumerated outputs that a small
  local model handles reliably after validation.
- **Conditionally cloud:** Code review of security-critical changes (authentication,
  cryptography, data handling), architecture synthesis when a new system-wide
  pattern is being introduced, and publication-quality writing. Cloud escalation
  requires an explicit label on the PR or a governance policy entry.
- **Always human-reviewed (no automation exception):** Merging to `main` in a core
  repository, promoting an agent from `experimental` to `trusted`, publishing a
  new repository publicly, rotating a production secret, and any change to the
  `governance-policies` repository.
- **Repo classes that agents may write without a PR gate:** Only `memory` repositories
  for provenance recording and K-line updates. All other classes require a PR gate.
