# Dependencies

> No repo is an island.
> Every codebase depends on memory, intent, and shared understanding

## Direct Dependencies

### Runtime (system binary)

| Package | Version | Description |
|---------|---------|-------------|
| [moltis](https://github.com/moltis-org/moltis) | latest | Rust-native AI gateway — a single binary that provides the moltis gateway powering the Moltis Intelligence system. Processes prompts via WebSocket RPC, interacts with LLM providers, and manages conversation sessions. Zero `unsafe` code, sandboxed execution, built-in memory. |

## Infrastructure Dependencies

These are not package dependencies but are required for the system to function:

| Dependency | Description |
|------------|-------------|
| [GitHub Actions](https://github.com/features/actions) | The sole compute runtime. Every issue event triggers a workflow that runs the AI agent. No external servers or containers are needed. |
| [GitHub Issues](https://docs.github.com/en/issues) | Used as the conversation interface. Each issue maps to a persistent AI conversation thread. |
| [Git](https://git-scm.com/) | All session state, conversation history, and agent edits are committed to the repository. Git serves as the memory and storage layer. |
| [Bun](https://bun.sh) | JavaScript/TypeScript runtime used to execute the agent orchestrator lifecycle script. |
| [gh CLI](https://cli.github.com/) | GitHub's official CLI tool, used by the agent lifecycle scripts to interact with the GitHub API (fetching issues, posting comments, managing reactions). |

## GitHub Actions Workflow Dependencies

These are referenced in `.github/workflows/`:

| Action | Workflow | Description |
|--------|----------|-------------|
| [actions/checkout@v4](https://github.com/actions/checkout) | agent | Checks out the repository so the agent can read and write files. |
| [oven-sh/setup-bun@v2](https://github.com/oven-sh/setup-bun) | agent | Installs the Bun runtime in the GitHub Actions environment. |
| [actions/cache@v5](https://github.com/actions/cache) | agent | Caches the Moltis binary to speed up subsequent runs. |
| [actions/configure-pages@v5](https://github.com/actions/configure-pages) | agent | Configures GitHub Pages deployment. |
| [actions/upload-pages-artifact@v4](https://github.com/actions/upload-pages-artifact) | agent | Uploads the static site artifact from `.github-moltis-intelligence/public-fabric/`. |
| [actions/deploy-pages@v4](https://github.com/actions/deploy-pages) | agent | Deploys the uploaded artifact to GitHub Pages. |

## LLM Provider Dependencies (one required)

An API key from at least one supported LLM provider is needed:

| Provider | API Key Secret | Description |
|----------|---------------|-------------|
| [OpenAI](https://platform.openai.com/) | `OPENAI_API_KEY` | GPT models including GPT-5.4 (default provider). |
| [Anthropic](https://console.anthropic.com/) | `ANTHROPIC_API_KEY` | Claude models. |
| [Google Gemini](https://aistudio.google.com/) | `GEMINI_API_KEY` | Gemini 2.5 Pro and Flash models. |
| [xAI](https://console.x.ai/) | `XAI_API_KEY` | Grok 3 and Grok 3 Mini models. |
| [OpenRouter](https://openrouter.ai/) | `OPENROUTER_API_KEY` | Access to DeepSeek, and hundreds of other models via a unified API. |
| [Mistral](https://console.mistral.ai/) | `MISTRAL_API_KEY` | Mistral Large and other Mistral models. |
| [Groq](https://console.groq.com/) | `GROQ_API_KEY` | Fast inference for open-source models like DeepSeek R1 distills. |
