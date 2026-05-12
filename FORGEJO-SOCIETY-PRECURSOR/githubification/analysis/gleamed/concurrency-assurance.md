# Gleaned Lesson 2 — Concurrency Assurance

## What It Is

**Concurrency assurance** is the set of patterns that prevent race conditions, session corruption, and git-push conflicts when multiple GitHub Actions workflow runs touch the same state simultaneously. It is the most universally applied technical pattern in the corpus — present in every analysis that involves persistent session state.

The core problem: GitHub Actions is ephemeral and event-driven. Multiple events (issue open, first comment, second comment) can arrive before the previous run has finished and committed its state. Without explicit concurrency controls, two runs can:

- Read the same stale session file → both generate responses → second write overwrites first
- Both attempt `git push` simultaneously → one succeeds, one fails with a rejected non-fast-forward
- Both post replies to the issue → duplicate responses visible to the user

---

## The Two-Layer Pattern

Every analysis in the corpus uses a two-layer approach to concurrency assurance:

1. **Workflow-level serialization** — via GitHub Actions `concurrency:` groups
2. **Git-level conflict resolution** — via a retry loop with rebase

These two layers address different failure modes and must both be present.

---

## Layer 1 — Workflow-Level Serialization

### The Canonical Configuration

```yaml
concurrency:
  group: agent-${{ github.repository }}-issue-${{ github.event.issue.number }}
  cancel-in-progress: false
```

**Present in:** Every single analysis — pydantic-ai, NemoClaw, moltis, pi-mono, zeroclaw, agenticana, camel, agent0, openai-codex, nanoclaw, ironclaw, OpenHands-CLI, n8n, nullclaw, langchainjs, Cronicle, OpenHands, microclaw, AutoGPT, openai-agents-python, nemo, renovate, picoclaw.

### Why `cancel-in-progress: false`

This is the critical choice. Using `cancel-in-progress: true` would drop runs when a newer event arrives, losing user messages. Setting it to `false` queues runs instead — the second run waits for the first to complete before starting.

| Setting | Behaviour | When to Use |
|---|---|---|
| `cancel-in-progress: false` | Queue — waits for prior run | **Agent workflows (all cases in corpus)** |
| `cancel-in-progress: true` | Cancel — drops prior run | CI/lint (latest commit matters, not every run) |

### Why Per-Issue Scope

The concurrency group key includes `github.event.issue.number`. This means:

- Issue #7 and Issue #12 run their agents **simultaneously** — full parallelism across different issues
- Two comments on Issue #7 run **sequentially** — serialized to prevent session corruption on the same thread

This is the correct granularity: users on different issues should not wait for each other, but a user's follow-up comment must wait for the agent's reply to their first comment to be committed.

---

## Layer 2 — Git-Level Conflict Resolution

### The Problem

Even with workflow-level serialization per issue, multiple issues run in parallel, and their workflows all attempt to `git push` state to the same repository. A race between two `git push` commands on different issues can produce a rejected push.

Additionally, human developers may be pushing code changes to the same repository at any time, adding external push conflicts.

### The Canonical Retry Loop

```bash
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add .github-minimum-intelligence/state/
git diff --cached --quiet || git commit -m "state: update session for issue #$ISSUE_NUMBER"

for i in $(seq 1 10); do
  git push && break
  sleep $((i * 2))
  git pull --rebase -X theirs
done
```

**Present in:** agenticana, OpenHands-CLI, ironclaw, nanoclaw, nullclaw, microclaw, moltis, zeroclaw (described), openai-agents-python, pi-mono, renovate.

### Key Properties

| Property | Detail |
|---|---|
| **10 attempts** | Sufficient for typical contention windows; beyond 10 attempts suggests a structural problem |
| **Escalating backoff** | `sleep $((i * 2))` — 2s, 4s, 6s, 8s... up to 20s. Prevents thundering herd |
| **`git pull --rebase`** | Rebases local commit on top of remote changes — cleaner history than merge |
| **`-X theirs`** | On conflict, accepts the incoming (remote) change. State files are append-only session logs; accepting remote changes is safe |

### The `-X theirs` Caveat

The pi-mono analysis raises an important nuance: `-X theirs` is correct for state-only commits (session JSONL files are append-only and isolated per issue), but should **not** be used for source-code commits. If the agent modifies source code and pushes it, using `-X theirs` on a rebase conflict could silently overwrite legitimate code changes from another workflow or developer.

**Recommended practice:**
- State-only commits: use `-X theirs` (safe — state files are partitioned per issue)
- Source-code commits: use standard rebase without `-X theirs`, fail and alert if conflict occurs

---

## Layer 3 (Optional) — SQLite Write-Ahead Logging

For agents that use SQLite as their memory backend (ZeroClaw, Moltis, IronClaw), a third concurrency concern arises: the SQLite database file itself.

**Pattern:** Use SQLite WAL (Write-Ahead Logging) mode for crash safety during ephemeral runner shutdown, combined with per-issue workflow serialization to prevent parallel database writes.

```sql
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
```

**Present in:** zeroclaw, moltis, ironclaw.

Additionally, these analyses recommend a **dual-format persistence** approach:
- SQLite for the agent's runtime use (fast, relational, ZeroClaw's native format)
- Human-readable JSONL exports alongside (for auditability and git-diffability)

```
state/
  zeroclaw.db          # SQLite — binary, opaque diffs
  sessions/            # JSONL exports — human-readable, diffable
    2026-03-18T....jsonl
  issues/              # JSON mappings — human-readable
    7.json
```

This ensures the session history is auditable in git even though the primary database produces binary diffs.

---

## The Concurrency Matrix

| Scenario | Handling | Layer |
|---|---|---|
| Two comments on same issue | Workflow concurrency group queues second run | Layer 1 |
| Two issues active simultaneously | Separate concurrency groups — run in parallel | Layer 1 |
| Parallel `git push` from different issues | Retry loop with rebase | Layer 2 |
| Developer push during agent run | Retry loop with rebase | Layer 2 |
| SQLite crash during runner shutdown | WAL mode | Layer 3 |
| SQLite parallel write from two issues | Per-issue concurrency (Layer 1 prevents this) | Layer 1 |

---

## The State Architecture It Protects

Every analysis uses the same canonical state directory structure:

```
.githubification-state/
  issues/
    {N}.json          # Maps issue #N → session identifier
  sessions/
    {timestamp}.jsonl # Full conversation transcript for one session
```

This structure partitions state naturally by issue number. Each issue has exactly one active session at a time. The session file grows via append (new turns are appended to the JSONL). Because state is partitioned, the concurrency controls only need to prevent two runs on the **same issue** from colliding — two runs on different issues access different files and cannot conflict at the application level.

---

## Key Insight: Concurrency by Design, Not by Convention

The pi-mono analysis articulates the architectural principle:

> "Per-issue concurrency groups ensure multiple issues can trigger the agent simultaneously without dropping events. Git push conflicts are handled by a 10-attempt retry loop with escalating backoff."

The state architecture (partitioned by issue number) and the concurrency controls (partitioned by issue number) are designed together. The partitioning strategy is what makes both layers work without coordination. This is not a bolted-on fix — it is an architectural invariant of Githubification.

---

## Source Analyses

- `githubification-pi-mono.md` — canonical pattern, `-X theirs` caveat
- `githubification-agenticana.md` — multi-agent concurrency (swarm case)
- `githubification-OpenHands-CLI.md` — 10-attempt retry with escalating backoff
- `githubification-ironclaw.md` — SQLite WAL mode, dual-format persistence
- `githubification-zeroclaw.md` — SQLite + JSONL dual persistence
- `githubification-moltis.md` — SQLite WAL + companion JSONL exports
- `githubification-microclaw.md` — canonical two-layer pattern
- All 23 analyses — `concurrency: cancel-in-progress: false`
