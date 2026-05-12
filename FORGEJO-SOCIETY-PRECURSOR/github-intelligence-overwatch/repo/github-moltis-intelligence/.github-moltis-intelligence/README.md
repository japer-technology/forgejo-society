# Moltis Intelligence

> A standalone Rust-native AI agent that lives inside your GitHub repository.

Moltis Intelligence is activated by the `$` prefix on issues and comments. It leverages the [Moltis](https://github.com/moltis-org/moltis) AI gateway — a single Rust binary with zero `unsafe` code, sandboxed execution, built-in memory, and multi-provider LLM support — while keeping all session state, file changes, and conversation history in Git.

---

## How It Works

1. **Open an issue** (or add a comment) starting with `$`.
2. **GitHub Actions** detects the prefix and runs the Moltis workflow.
3. **The agent** reads your prompt, processes it through the Moltis runtime, and posts the response as a comment.
4. **Everything is committed** — session state, file changes, and conversation history all live in Git.

---

## The Prefix Protocol

| Prefix | Intelligence | Description |
|--------|-------------|-------------|
| `$` | Moltis Intelligence | Rust-native, secure, single-binary agent |
| _(other)_ | None | No agent responds |

---

## Project Structure

```
.github-moltis-intelligence/
├── .pi/
│   └── settings.json              # LLM provider, model, thinking level
├── AGENTS.md                      # Agent standing orders
├── IDENTITY.md                    # Moltis-native agent identity (name, emoji, creature, vibe)
├── SOUL.md                        # Moltis-native personality directives
├── TOOLS.md                       # Moltis-native tool usage guidance
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE.md
├── PACKAGES.md
├── README.md
├── SECURITY.md
├── VERSION
├── config/
│   └── moltis.toml                # Moltis runtime configuration (memory, tools, providers)
├── docs/
├── install/
│   ├── MOLTIS-AGENTS.md           # Default AGENTS.md for fresh installs
│   └── settings.json              # Default .pi/settings.json
├── lifecycle/
│   └── agent.ts                   # Core orchestrator
├── package.json
├── public-fabric/                 # GitHub Pages content
└── state/
    └── issues/
        └── <number>/              # Per-issue moltis data directory
            ├── AGENTS.md          # Agent standing orders (synced from root)
            ├── IDENTITY.md        # Agent identity (synced from root)
            ├── SOUL.md            # Personality directives (synced from root)
            ├── TOOLS.md           # Tool guidance (synced from root)
            ├── MEMORY.md          # Moltis-native long-term memory
            ├── memory/            # Moltis-native memory files
            └── sessions/          # Moltis native session files
```

---

## Configuration

Edit `.github-moltis-intelligence/.pi/settings.json` to change the LLM provider and model:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.4",
  "defaultThinkingLevel": "high"
}
```

The lifecycle orchestrator reads this file and passes the provider and model settings to the Moltis runtime via environment variables and configuration, ensuring the committed settings are always respected.

### Supported Providers

| Provider | Secret Name | Models |
|----------|------------|--------|
| OpenAI | `OPENAI_API_KEY` | GPT-5.4 (default), GPT-4o, GPT-4o-mini |
| Anthropic | `ANTHROPIC_API_KEY` | Claude Sonnet, Claude Haiku, Claude Opus |
| Google | `GEMINI_API_KEY` | Gemini 2.5 Pro, Gemini 2.0 Flash |
| xAI | `XAI_API_KEY` | Grok 3, Grok 3 Mini |
| OpenRouter | `OPENROUTER_API_KEY` | DeepSeek, and hundreds more |
| Mistral | `MISTRAL_API_KEY` | Mistral Large |
| Groq | `GROQ_API_KEY` | DeepSeek R1 distills |

---

## Why Moltis?

Moltis is a **Rust-native AI gateway** — one binary, sandboxed, secure, yours.

| Feature | Details |
|---------|---------|
| **Language** | Rust — zero `unsafe` code, memory-safe by default |
| **Runtime** | Single binary (44 MB) — no Node.js, no npm, no runtime dependencies |
| **Sandbox** | Docker + Apple Container — per-session isolation |
| **Memory** | SQLite + FTS + vector embeddings — hybrid search, session export |
| **Identity** | IDENTITY.md + SOUL.md — agent personality and standing orders |
| **Skills** | Self-extending skill system — agents create and manage their own skills |
| **MCP** | stdio + Streamable HTTP — connect to any MCP server |
| **Agent loop** | ~5K lines of auditable Rust code |
| **Full codebase** | ~196K lines across 46 modular crates, 3,100+ tests |

See the [full Moltis comparison](https://docs.moltis.org/comparison.html) for details.

---

## Tool Surface

| Capability | Available | Moltis Feature |
|-----------|-----------|----------------|
| File read/write/edit | ✅ | Built-in tools |
| Code search (grep, glob) | ✅ | Built-in tools |
| Bash execution | ✅ | Built-in exec tool |
| Browser automation (headless Chromium) | ✅ | moltis-browser crate |
| Web search / fetch | ✅ | Built-in web tools |
| Memory (SQLite + FTS + vector) | ✅ | moltis-memory crate (`memory_save`, `memory_search`, `memory_get`) |
| Session state (per-issue persistence) | ✅ | moltis-sessions crate |
| Skill self-extension | ✅ | moltis-skills crate (`create_skill`, `update_skill`, `delete_skill`) |
| MCP servers (stdio + HTTP/SSE) | ✅ | moltis-mcp crate |
| Agent presets / sub-agents | ✅ | moltis-agents crate (`spawn_agent`) |
| Multi-provider LLM support | ✅ | moltis-providers crate (7 providers) |

---

## License

[MIT](LICENSE.md) — © 2026 Eric Mourant
