# ZeroClaw Intelligence

> A standalone AI agent that lives inside your GitHub repository, powered by [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) — the fastest, smallest AI assistant. 100% Rust, runs on $10 hardware with <5MB RAM.

---

## How It Works

1. **Open an issue** with a title starting with `#` (or add a comment starting with `#`) on your repository.
2. **GitHub Actions** detects the event and runs the ZeroClaw workflow.
3. **The agent** reads your prompt, processes it through the ZeroClaw runtime, and posts the response as a comment.
4. **Everything is committed** — session state, file changes, and conversation history all live in Git.

---

## Project Structure

```
.github-zeroclaw-intelligence/
├── .pi/
│   ├── settings.json              # LLM provider, model, thinking level
│   ├── BOOTSTRAP.md               # First-run identity prompt
│   └── APPEND_SYSTEM.md           # System prompt loaded every session
├── AGENTS.md                      # Agent identity and standing orders
├── README.md
├── VERSION
├── config/
│   ├── extensions.json            # Extension and skill activation
│   └── skills.json                # Bundled skill allowlist and extra dirs
├── docs/
├── install/
│   ├── ZEROCLAW-AGENTS.md         # Default AGENTS.md for fresh installs
│   └── settings.json              # Default .pi/settings.json
├── lifecycle/
│   └── agent.ts                   # Core orchestrator
├── package.json
├── public-fabric/                 # GitHub Pages content
└── state/
    ├── issues/                    # Issue-to-session mappings
    ├── sessions/                  # Conversation transcripts
    └── memory.log                 # Append-only long-term memory
```

---

## Agent Identity

The `AGENTS.md` file defines the agent's personality and standing orders. To customise the agent, edit `AGENTS.md` with your instructions.

---

## Configuration

Edit `.github-zeroclaw-intelligence/.pi/settings.json` to change the LLM provider and model:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.4",
  "defaultThinkingLevel": "high"
}
```

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

## Extensions

ZeroClaw's capabilities are configured in `config/extensions.json`:

```json
{
  "extensions": {
    "sub-agents": true,
    "semantic-memory": true,
    "media-understanding": true,
    "diff-analysis": true,
    "multi-model-failover": true,
    "browser-cdp": true,
    "multi-search": true
  },
  "skills": "config/skills.json"
}
```

---

## Skills

Skills are configured in `config/skills.json`:

```json
{
  "skills": {
    "allowBundled": [
      "gh-issues",
      "github",
      "weather",
      "summarize",
      "coding-agent",
      "healthcheck",
      "oracle",
      "session-logs",
      "nano-pdf",
      "xurl"
    ],
    "load": {
      "extraDirs": []
    }
  }
}
```

### Available Skills

| Skill | Description |
|-------|-------------|
| `gh-issues` | Fetch GitHub issues, spawn sub-agents to implement fixes and open PRs |
| `github` | GitHub operations via `gh` CLI: issues, PRs, CI runs, code review |
| `weather` | Get current weather and forecasts via wttr.in |
| `summarize` | Summarize text, files, or URLs |
| `coding-agent` | Dedicated code review and editing agent |
| `healthcheck` | System health and diagnostics |
| `oracle` | Knowledge base queries |
| `session-logs` | View and manage session transcripts |
| `nano-pdf` | PDF extraction and analysis |
| `xurl` | URL fetching and web content extraction |

---

## Tool Surface

| Capability | Available |
|-----------|-----------|
| File read/write/edit | ✅ |
| Code search (grep, glob) | ✅ |
| Bash execution | ✅ |
| Browser automation (headless Chromium with CDP) | ✅ |
| Web search / fetch (multiple backends) | ✅ |
| Sub-agent orchestration | ✅ |
| Semantic memory search (BM25 + vector embeddings) | ✅ |
| Media understanding (image analysis, OCR, PDF extraction) | ✅ |
| Diff analysis (dedicated extension) | ✅ |
| Multi-model failover (automatic provider fallback) | ✅ |

---

## Why ZeroClaw?

ZeroClaw is the fastest, smallest AI assistant — 100% Rust with zero overhead:

| Metric | ZeroClaw | Others |
|--------|----------|--------|
| **Runtime Memory** | <5 MB | >1 GB |
| **Cold Start** | <100ms | Seconds |
| **Binary Size** | ~8.8 MB | 100+ MB |
| **Language** | 100% Rust | Node.js / Python |
| **Hardware** | Runs on $10 hardware | Requires beefy servers |

---

## License

[MIT](LICENSE.md) — © 2026
