# Analysis: pi-mono Upgrade from v0.57.1 to v0.65.1

This document examines every change in pi-mono between v0.57.1 (2026-03-07) and v0.65.1 (2026-04-05), identifies what matters for forgejo-intelligence, and specifies exactly what the upgrade requires.

---

## 1. Current State

| Item | Value |
|---|---|
| Package | `@mariozechner/pi-coding-agent` |
| Declared in `package.json` | `^0.52.5` |
| Resolved in `bun.lock` | `0.52.5` |
| Target version | `0.65.1` |
| Versions spanned | 16 releases (v0.57.1 → v0.65.1) |
| Period | 2026-03-07 → 2026-04-05 (29 days) |

The repository uses pi-mono as a **CLI binary** invoked via `bun` from GitHub Actions workflows. It does not use the SDK embedding API. This shapes which breaking changes actually matter.

---

## 2. Release-by-Release Summary

### v0.57.1 — 2026-03-07
- Tree branch folding and segment-jump navigation in `/tree`.
- `session_directory` extension event for customizing session directory paths.
- Digit keybindings (`0-9`) in the TUI keybinding system.
- Fixed z.ai context overflow recovery so `model_context_window_exceeded` errors trigger auto-compaction instead of surfacing as unhandled stop reason failures.

**Impact on forgejo-intelligence:** The z.ai context overflow fix improves reliability when running large prompts. No code changes required.

### v0.58.0 — 2026-03-14
- **Claude Opus 4.6, Sonnet 4.6, and related Bedrock models now use a 1M token context window** (up from 200K).
- Extension tool calls now execute in parallel by default.
- `GOOGLE_CLOUD_API_KEY` environment variable support for `google-vertex`.
- Extensions can supply deterministic session IDs via `newSession()`.
- Fixed the default coding-agent system prompt to include only the current date (not time), so prompt prefixes stay cacheable.
- Fixed tool result images not being sent in `function_call_output` for OpenAI Responses API.

**Impact on forgejo-intelligence:** 1M context window for Claude is a significant upgrade — longer conversations, richer context. The cacheable system prompt reduces API costs on resumed sessions. The `GOOGLE_CLOUD_API_KEY` support is relevant to `QUICKSTART.md` documentation (Google Vertex provider).

### v0.58.1 — 2026-03-14
- Added `pi uninstall` alias for `pi install --uninstall`.
- Fixed OpenAI Codex websocket protocol.

**Impact on forgejo-intelligence:** No direct impact.

### v0.58.2 — 2026-03-15
- Fixed fuzzy `edit` matching to normalize Unicode compatibility variants, reducing false "oldText not found" failures for CJK and full-width characters.

**Impact on forgejo-intelligence:** Improves agent reliability when editing files with non-ASCII content.

### v0.58.3 — 2026-03-15
(Empty release notes.)

### v0.58.4 — 2026-03-16
- Fixed steering messages to wait until the current assistant message's tool-call batch fully finishes.

**Impact on forgejo-intelligence:** Prevents partial tool-call execution. Improves reliability.

### v0.59.0 — 2026-03-17
- **Faster startup by lazy-loading provider SDKs** on first use instead of import time.
- Better provider retry behavior when providers return error messages as responses.
- **Breaking:** Custom tool `promptSnippet` is now required for tools to appear in the system prompt's "Available tools" section.

**Impact on forgejo-intelligence:** Faster startup directly reduces Actions minutes. Better retry behaviour reduces transient failures. The breaking change does not affect forgejo-intelligence because the repo does not define custom tools via the extension API.

### v0.60.0 — 2026-03-18
- Fork existing sessions with `--fork <path|id>`.
- `createLocalBashOperations()` export for extensions.
- **Breaking:** Startup no longer auto-updates unpinned packages. Use `pi update` explicitly.

**Impact on forgejo-intelligence:** Session forking is potentially useful for branching conversations. The no-auto-update change is irrelevant — forgejo-intelligence installs via `bun install --frozen-lockfile` and does not rely on auto-update.

### v0.61.0 — 2026-03-20
- JSONL session export and import via `/export` and `/import`.
- **Breaking:** Namespaced keybinding ids.
- Fixed concurrent `edit` and `write` mutations targeting the same file to run serially.
- Fixed RPC mode to redirect unexpected stdout writes to stderr so JSONL responses remain parseable.
- Added `gpt-5.4-mini` to the `openai-codex` model catalog.

**Impact on forgejo-intelligence:** The concurrent edit/write serialization fix is important — the agent can now safely edit multiple parts of the same file in one turn. The JSONL stdout fix ensures clean output in `--mode json`, which is how forgejo-intelligence invokes pi. The `gpt-5.4-mini` model addition expands available models for cost-sensitive deployments.

### v0.61.1 — 2026-03-20
- Typed `tool_call` handler return values.
- Updated default models for zai, cerebras, minimax.

**Impact on forgejo-intelligence:** No direct impact.

### v0.62.0 — 2026-03-23
- Built-in tools (read/write/edit/bash/grep/find/ls) are now extensible `ToolDefinition` objects.
- Unified source provenance via `sourceInfo`.
- **Breaking:** `ToolDefinition.renderCall`/`renderResult` semantics changed.
- **Breaking:** Removed `source`, `extensionPath`, `location`, `path` fields from various types. Use `sourceInfo` instead.
- Fixed print and JSON mode to take over stdout during non-interactive startup.

**Impact on forgejo-intelligence:** The stdout fix for JSON mode is directly relevant. Breaking changes are SDK-only and do not affect CLI usage.

### v0.63.0 — 2026-03-27
- **Breaking:** `ModelRegistry.getApiKey(model)` → `getApiKeyAndHeaders(model)`.
- **Edit tool multi-edit support:** One call can update multiple separate, disjoint regions in the same file.
- `sessionDir` setting in `settings.json` (no more `--session-dir` on every invocation).
- RPC `get_session_stats` now exposes `contextUsage`.
- Fixed file mutation queue ordering for concurrent edit/write.

**Impact on forgejo-intelligence:** The multi-edit tool makes the agent more efficient — fewer tool calls per complex file change. The `sessionDir` setting could simplify the session directory configuration. The `getApiKey` breaking change is SDK-only.

### v0.63.1 — 2026-03-27
- Added `gemini-3.1-pro-preview-customtools` for `google-vertex`.
- Fixed repeated tool call patterns.

**Impact on forgejo-intelligence:** Expands model options.

### v0.63.2 — 2026-03-29
- Extension handlers can now use `ctx.signal` for cancellation.
- Built-in `edit` tool input uses `edits[]` as the only replacement shape, reducing invalid tool calls from mixed schemas.
- Large bash output truncation improvements.

**Impact on forgejo-intelligence:** The unified `edits[]` schema reduces agent errors when editing files. Bash output improvements prevent data loss.

### v0.64.0 — 2026-03-29
- `prepareArguments` hook for tool definitions (argument migration).
- Built-in `edit` tool uses `prepareArguments` to silently fold legacy `oldText`/`newText` into `edits[]` when resuming old sessions.
- **Breaking:** `ModelRegistry` no longer has a public constructor.

**Impact on forgejo-intelligence:** The edit tool backward compatibility shim means existing sessions created with older pi versions can be safely resumed after the upgrade. The `ModelRegistry` breaking change is SDK-only.

### v0.65.0 — 2026-04-03
- **Session runtime API:** `createAgentSessionRuntime()` and `AgentSessionRuntime`.
- **`defineTool()` helper** for custom tools.
- **Unified diagnostics** model for structured errors.
- **Breaking:** Removed `session_switch` and `session_fork` extension events. Use `session_start` with `event.reason`.
- **Breaking:** Removed session-replacement methods from `AgentSession`.
- **Breaking:** Removed `session_directory` from extension/settings APIs.
- **Breaking:** Unknown single-dash CLI flags now produce errors instead of being silently ignored.

**Impact on forgejo-intelligence:** The session runtime API is a major architectural change, but it is SDK-facing. The CLI invocation model used by forgejo-intelligence is unaffected. The unknown-flag error is important — any stale CLI flags will now fail instead of being silently ignored. The orchestrator must ensure all CLI flags are valid.

### v0.65.1 — 2026-04-05
- Fixed bash output truncation by line count to always persist full output to a temp file.
- RpcClient forwards subprocess stderr to parent process in real-time.
- Fixed stored session cwd handling for missing directories.
- Fixed piped stdin runs with `--mode json` to preserve JSONL output instead of falling back to plain text.

**Impact on forgejo-intelligence:** The `--mode json` piped stdin fix is directly relevant — forgejo-intelligence pipes prompts to pi via stdin in JSON mode. The bash truncation fix prevents data loss in long outputs. The session cwd fix handles edge cases where the working directory changes between runs.

---

## 3. Breaking Changes That Matter

Of the 12 breaking changes across this version range, only one has potential CLI impact:

| Version | Breaking Change | Affects forgejo-intelligence? |
|---|---|---|
| v0.59.0 | `promptSnippet` required for custom tools | **No** — no custom tools |
| v0.60.0 | No auto-update on startup | **No** — uses `bun install --frozen-lockfile` |
| v0.61.0 | Namespaced keybinding ids | **No** — TUI-only |
| v0.62.0 | `renderCall`/`renderResult` semantics | **No** — SDK-only |
| v0.62.0 | Removed `source`/`extensionPath`/`location` fields | **No** — SDK-only |
| v0.63.0 | `getApiKey()` → `getApiKeyAndHeaders()` | **No** — SDK-only |
| v0.63.0 | Removed deprecated MiniMax model IDs | **No** — not used |
| v0.64.0 | `ModelRegistry` no longer has public constructor | **No** — SDK-only |
| v0.65.0 | Removed `session_switch`/`session_fork` events | **No** — SDK-only |
| v0.65.0 | Removed session-replacement from `AgentSession` | **No** — SDK-only |
| v0.65.0 | Removed `session_directory` from APIs | **No** — uses `--session-dir` CLI flag |
| v0.65.0 | Unknown single-dash CLI flags error | **Possible** — must audit CLI invocations |

**Audit result:** The orchestrator (`forgejo-intelligence-ORCHESTRATOR.ts`) and agent (`forgejo-intelligence-AGENT.ts`) use these CLI flags: `--mode json`, `--provider`, `--model`, `--session-dir`, `-p` (prompt), `--session`. All are valid pi-mono flags. No unknown flags. **No breakage.**

---

## 4. Key Improvements for forgejo-intelligence

### 4.1 Performance
- **Faster startup** (v0.59.0): Lazy-loading provider SDKs reduces Actions minutes.
- **Cacheable system prompts** (v0.58.0): Repeated sessions with the same provider benefit from prompt caching.

### 4.2 Reliability
- **Context overflow auto-compaction** (v0.57.1): Long conversations no longer crash.
- **Better provider retry** (v0.59.0): Transient API failures are retried automatically.
- **Concurrent edit/write serialization** (v0.61.0, v0.63.0): No more interleaved file writes.
- **Bash output truncation fix** (v0.63.2, v0.65.1): Long command outputs are preserved.
- **JSONL stdout integrity** (v0.61.0, v0.62.0, v0.65.1): Clean `--mode json` output.

### 4.3 Agent Capability
- **1M context window for Claude** (v0.58.0): 5× longer conversations.
- **Multi-edit tool** (v0.63.0): One tool call can patch multiple file regions.
- **Unified edit schema** (v0.63.2): Fewer agent errors from schema confusion.
- **Legacy session compatibility** (v0.64.0): Old sessions resume cleanly after upgrade.
- **New model support**: `gpt-5.4-mini`, `gemini-3.1-pro-preview-customtools`, updated MiniMax/cerebras/zai defaults.

### 4.4 Session Management
- **Session forking** (v0.60.0): `--fork` flag for branching conversations.
- **JSONL export/import** (v0.61.0): Portable session archives.
- **`sessionDir` in settings.json** (v0.63.0): Declarative session directory configuration.

---

## 5. Upgrade Procedure

### 5.1 Package Update

Change `package.json`:
```json
{
  "dependencies": {
    "@mariozechner/pi-coding-agent": "0.65.1"
  }
}
```

Pin to exact version (drop the `^` caret) to ensure deterministic CI builds.

### 5.2 Lockfile Regeneration

```bash
cd .forgejo-intelligence && bun install
```

### 5.3 Existing Session Compatibility

Sessions created with v0.52.5 use the old single-edit `oldText`/`newText` schema. The v0.64.0 `prepareArguments` shim silently migrates these to `edits[]` on resume. **No manual session migration is required.**

### 5.4 CLI Invocation Audit

All CLI flags used by the orchestrator and agent are valid in v0.65.1:

| Flag | Used In | Status |
|---|---|---|
| `--mode json` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |
| `--provider <name>` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |
| `--model <name>` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |
| `--session-dir <path>` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |
| `-p <prompt>` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |
| `--session <path>` | ORCHESTRATOR.ts, AGENT.ts | ✅ Valid |

### 5.5 QUICKSTART Documentation

The QUICKSTART already lists multiple providers. The new `GOOGLE_CLOUD_API_KEY` support (v0.58.0) and new models (`gpt-5.4-mini`, `gemini-3.1-pro-preview-customtools`) could be documented but are not required for the upgrade itself.

---

## 6. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Unknown CLI flag rejection (v0.65.0) | Low | Audited — all flags are valid |
| Session schema migration | Low | Built-in `prepareArguments` shim handles it |
| Provider API changes | None | SDK-only; CLI usage is stable |
| Lock file drift | Low | Pin exact version, use `--frozen-lockfile` |
| Context window changes | None | Only increases (200K → 1M for Claude) |

---

## 7. Summary

The upgrade from v0.57.1 to v0.65.1 is **safe and beneficial** for forgejo-intelligence. None of the 12 breaking changes affect the CLI invocation model. The upgrade brings faster startup, better reliability, a 5× larger context window for Claude, multi-edit support, and improved JSONL output integrity — all directly relevant to a GitHub Actions-based agent.

The only required changes are:
1. Bump `@mariozechner/pi-coding-agent` to `0.65.1` in `package.json`.
2. Regenerate `bun.lock`.
