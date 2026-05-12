# NanoClaw Intelligence

> A lightweight, secure AI agent that lives inside your GitHub repository — powered by NanoClaw's container-isolated Claude Agent SDK, using **GitHub as Infrastructure**.

NanoClaw Intelligence maps every core NanoClaw capability to a GitHub primitive, turning your repository into a fully-featured AI assistant platform. It is activated by the `` ` `` prefix across issues, pull requests, and discussions — while also supporting scheduled tasks, label-based routing, and admin commands.

---

## How It Works

1. **Open an issue, PR, or discussion** (or add a comment) starting with `` ` ``.
2. **GitHub Actions** detects the prefix and runs the NanoClaw workflow.
3. **The agent** reads your prompt, processes it through the NanoClaw runtime in an isolated container context, and posts the response as a comment.
4. **Everything is committed** — session state, file changes, and conversation history all live in Git.

---

## NanoClaw Feature Mapping (GitHub as Infrastructure)

Every NanoClaw capability has a corresponding GitHub primitive:

| NanoClaw Feature | GitHub Infrastructure | Description |
|-----------------|----------------------|-------------|
| Multi-channel messaging | Issues, PRs, Discussions | Three conversation channels, each triggered by `` ` `` |
| Task scheduler (cron/interval) | `schedule:` trigger | Recurring agent execution every 6 hours |
| Group routing | Labels (`issues: [labeled]`) | Label-based routing and classification |
| Main channel (admin) | `workflow_dispatch` with inputs | Admin commands via manual trigger |
| Session state | Git-tracked JSON files | Per-entity session continuity |
| Container isolation | GitHub Actions runner sandbox | Sandboxed execution environment |
| Credential proxy | GitHub Secrets | Secure API key management |
| Mount security | Runner filesystem isolation | Ephemeral, isolated runner environments |

---

## Channels

| Channel | Trigger | Prefix | Use Case |
|---------|---------|--------|----------|
| Issues | `issues.opened` | `` ` `` in title | General questions, tasks, conversations |
| Issue Comments | `issue_comment.created` | `` ` `` in body | Follow-up on existing issues |
| Pull Requests | `pull_request.opened` | `` ` `` in title | Code review, PR assistance |
| PR Review Comments | `pull_request_review_comment.created` | `` ` `` in body | Inline code review responses |
| Discussions | `discussion.created` | `` ` `` in title | Knowledge base, Q&A |
| Discussion Comments | `discussion_comment.created` | `` ` `` in body | Follow-up on discussions |
| Scheduled Tasks | `schedule` (cron) | — | Periodic maintenance, recurring jobs |
| Labels | `issues.labeled` | — | Label-based routing and actions |
| Admin Commands | `workflow_dispatch` | — | Manual admin control via `command` input |

---

## The Prefix Protocol

| Prefix | Intelligence | Description |
|--------|-------------|-------------|
| `` ` `` | NanoClaw Intelligence | Container-isolated, secure agent execution |
| _(other)_ | None | No agent responds |

---

## Project Structure

```
.github-nanoclaw-intelligence/
├── .pi/
│   └── settings.json              # LLM provider, model, thinking level
├── AGENTS.md                      # Agent identity and standing orders
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE.md
├── PACKAGES.md
├── README.md
├── SECURITY.md
├── VERSION
├── config/
│   └── containers.json            # Container isolation configuration
├── docs/
├── install/
│   ├── NANOCLAW-AGENTS.md         # Default AGENTS.md for fresh installs
│   └── settings.json              # Default .pi/settings.json
├── lifecycle/
│   └── agent.ts                   # Core orchestrator
├── package.json
├── public-fabric/                 # GitHub Pages content
└── skills/                        # Runtime-linked skills
```

---

## Agent Identity

The `AGENTS.md` file defines the agent's personality and standing orders. At runtime, its content is passed as system context to the NanoClaw agent so that the underlying Claude model receives it as the agent's identity and behavioural guidelines.

To customise the agent, edit `AGENTS.md` with your instructions. If `AGENTS.md` contains only the default placeholder text, the agent runs with NanoClaw defaults.

---

## Configuration

Edit `.github-nanoclaw-intelligence/.pi/settings.json` to change the LLM model and thinking level:

```json
{
  "defaultProvider": "anthropic",
  "defaultModel": "claude-sonnet-4-6",
  "defaultThinkingLevel": "high"
}
```

The `--model`, `--provider`, and `--thinking` flags are passed explicitly to the NanoClaw runtime from this file, ensuring the committed settings are always respected regardless of host-level configuration on the runner image.

### Supported Provider

The NanoClaw runtime is built on the Claude Agent SDK and supports Anthropic models:

| Provider | Secret Name | Models |
|----------|------------|--------|
| Anthropic | `ANTHROPIC_API_KEY` | Claude Sonnet 4.6 (default), Claude Opus 4.6, Claude Haiku 4.5 |

---

## Container Isolation

NanoClaw's defining feature is container-level security. In the GitHub Actions context, the agent runs within an isolated environment where:

- **Filesystem isolation** — The agent can only access explicitly mounted directories.
- **Process isolation** — Agent processes are sandboxed from the host runner.
- **Configurable timeouts** — Execution is time-bounded to prevent runaway processes.

Container behaviour is configured in `config/containers.json`:

```json
{
  "containers": {
    "enabled": true,
    "runtime": "docker",
    "isolation": "filesystem",
    "timeout_seconds": 300,
    "mount_repo": true
  }
}
```

---

## Tool Surface

| Capability | Available |
|-----------|-----------|
| File read/write/edit | ✅ |
| Code search (grep, glob) | ✅ |
| Bash execution (sandboxed) | ✅ |
| Web search / fetch | ✅ |
| Container isolation | ✅ |
| Session continuity | ✅ |
| Multi-model failover | ✅ |
| Scheduled tasks (cron) | ✅ |
| Multi-channel (Issues, PRs, Discussions) | ✅ |
| Label-based routing | ✅ |
| Admin commands (workflow_dispatch) | ✅ |
| PR code review | ✅ |
| Discussion Q&A | ✅ |

---

## Why NanoClaw?

NanoClaw was built with a philosophy of being **small enough to understand**. Unlike larger agent frameworks with hundreds of thousands of lines of code, NanoClaw is a handful of source files that you can audit completely. This makes it ideal for a GitHub-native intelligence layer where:

- **Transparency** matters — every line of agent code is readable.
- **Security** is paramount — container isolation over application-level permission checks.
- **Simplicity** wins — one process, a few source files, no microservices.

---

## License

[MIT](LICENSE.md) — © 2026 Eric Mourant
