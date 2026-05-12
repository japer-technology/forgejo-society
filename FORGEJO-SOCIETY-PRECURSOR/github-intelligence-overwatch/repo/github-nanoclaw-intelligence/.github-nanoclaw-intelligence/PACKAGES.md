# Dependencies

> No repo is an island.
> Every codebase depends on memory, intent, and shared understanding

## Direct Dependencies

### Runtime (npm)

| Package | Version | Description |
|---------|---------|-------------|
| [@anthropic-ai/claude-agent-sdk](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk) | ^0.2.76 | SDK for building AI agents with Claude Code's capabilities. Used by the local CLI wrapper (`lifecycle/nanoclaw-cli.ts`) to run agent queries since the upstream nanoclaw package does not ship a CLI binary. |
| [nanoclaw](https://github.com/qwibitai/nanoclaw) | github:qwibitai/nanoclaw | Lightweight, secure, customizable Claude assistant. Provides container-isolated agent execution, SQLite-based session management, and multi-channel messaging capabilities. NanoClaw runs on the Claude Agent SDK, executing agents in their own Linux containers with filesystem isolation. |

### NanoClaw Feature Surface

Beyond the core library, NanoClaw Intelligence maps the following NanoClaw feature categories to GitHub infrastructure:

| NanoClaw Feature | Source | GitHub Mapping | Description |
|-----------------|--------|----------------|-------------|
| Container runner | `src/container-runner.ts` | GitHub Actions runner | Spawns streaming agent containers with filesystem isolation |
| Session management | `src/db.ts` | Git-tracked JSON files | Per-entity session state management |
| Task scheduling | `src/task-scheduler.ts` | `schedule:` cron trigger | Recurring agent execution (every 6 hours) |
| Group isolation | `src/group-folder.ts` | Per-issue/PR/discussion sessions | Channel-specific context isolation |
| Message routing | `src/router.ts` | Multi-event workflow triggers | Issues, PRs, discussions, labels, admin commands |
| IPC | `src/ipc.ts` | GitHub API (cross-entity comments) | Inter-process communication for task processing |
| Channel registry | `src/channels/registry.ts` | Workflow event types | Self-registering channels (issues, PRs, discussions) |
| Sender allowlist | `src/sender-allowlist.ts` | Collaborator permission check | Only write/maintain/admin users can trigger |
| Credential proxy | `src/credential-proxy.ts` | GitHub Secrets | Secure API key injection via environment variables |
| Group queue | `src/group-queue.ts` | Workflow concurrency groups | One agent run per entity at a time |
| Config | `src/config.ts` | `.pi/settings.json` + `config/containers.json` | Provider, model, thinking level, container settings |

## Infrastructure Dependencies

These are not package dependencies but are required for the system to function:

| Dependency | Description |
|------------|-------------|
| [GitHub Actions](https://github.com/features/actions) | The sole compute runtime. Every issue event triggers a workflow that runs the AI agent. No external servers or containers are needed. |
| [GitHub Issues](https://docs.github.com/en/issues) | Used as the conversation interface. Each issue maps to a persistent AI conversation thread. |
| [Git](https://git-scm.com/) | All session state, conversation history, and agent edits are committed to the repository. Git serves as the memory and storage layer. |
| [Bun](https://bun.sh) | JavaScript/TypeScript runtime used to execute the agent orchestrator and install dependencies. |
| [Node.js](https://nodejs.org/) | Required by NanoClaw's dependencies (>= 20). Installed alongside Bun in the workflow. |
| [gh CLI](https://cli.github.com/) | GitHub's official CLI tool, used by the agent lifecycle scripts to interact with the GitHub API (fetching issues, posting comments, managing reactions). |

## GitHub Actions Workflow Dependencies

These are referenced in `.github/workflows/`:

| Action | Workflow | Description |
|--------|----------|-------------|
| [actions/checkout@v4](https://github.com/actions/checkout) | agent | Checks out the repository so the agent can read and write files. |
| [oven-sh/setup-bun@v2](https://github.com/oven-sh/setup-bun) | agent | Installs the Bun runtime in the GitHub Actions environment. |
| [actions/setup-node@v4](https://github.com/actions/setup-node) | agent | Installs Node.js 22 required by NanoClaw's dependencies. |
| [actions/cache@v5](https://github.com/actions/cache) | agent | Caches `node_modules` keyed on the `bun.lock` hash to speed up dependency installation. |
| [actions/configure-pages@v5](https://github.com/actions/configure-pages) | agent | Configures GitHub Pages deployment. |
| [actions/upload-pages-artifact@v4](https://github.com/actions/upload-pages-artifact) | agent | Uploads the static site artifact from `.github-nanoclaw-intelligence/public-fabric/`. |
| [actions/deploy-pages@v4](https://github.com/actions/deploy-pages) | agent | Deploys the uploaded artifact to GitHub Pages. |

## LLM Provider Dependency (required)

An API key from the supported LLM provider is needed:

| Provider | API Key Secret | Description |
|----------|---------------|-------------|
| [Anthropic](https://console.anthropic.com/) | `ANTHROPIC_API_KEY` | Claude models (Claude Sonnet 4.6 default, Claude Opus 4.6, Claude Haiku 4.5). The NanoClaw runtime is built on the Claude Agent SDK and only supports Anthropic models. |

## Transitive Dependencies (notable)

These are pulled in transitively by `nanoclaw`:

| Package | Description |
|---------|-------------|
| `better-sqlite3` | Fast, synchronous SQLite3 bindings for Node.js. Used for message and session state management. |
| `cron-parser` | Parses cron expressions for scheduled task execution. |
| `pino` | Fast, low-overhead JSON logger. |
| `pino-pretty` | Pretty-printer for pino logs during development. |
| `yaml` | YAML parser and stringifier. |
| `zod` | TypeScript-first schema validation library. |
