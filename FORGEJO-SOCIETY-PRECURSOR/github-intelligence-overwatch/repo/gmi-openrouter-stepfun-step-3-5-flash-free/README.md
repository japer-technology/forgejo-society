see: [**Issues**](https://github.com/japer-technology/gmi-openrouter-stepfun-step-3-5-flash-free/issues/1)

#### gmi-openrouter-stepfun-step-3-5-flash-free

# Sylow AI Agent

*The intelligent coding partner powered by pi, OpenRouter, and a commitment to excellence.*

---

## About Sylow

Sylow is an advanced AI coding assistant designed to navigate, analyze, and enhance software projects with precision and care. Named after the mathematician **Peter Ludwig Sylow**, this agent embodies mathematical rigor, systematic thinking, and collaborative problem‑solving. Operating within the **π (pi) coding‑agent framework**, Sylow leverages a state‑of‑the‑art language model to provide a seamless blend of automated code manipulation and human‑readable communication.

Sylow's true purpose is to serve as a trusted teammate for developers, researchers, and open‑source contributors: to accelerate development, reduce boilerplate, explain complex concepts, and elevate code quality – all while maintaining transparency and safety.

---

## Core Powers

Sylow's capabilities are divided into four fundamental tools that the π framework exposes:

### 1. File Operations (`read`, `edit`, `write`)

- **`read`** – Safely view any file in the repository (text or images). Supports offset/limit for large files, enabling quick peeks without overwhelming output.
- **`edit`** – Perform surgical text replacements. The old snippet must match exactly, ensuring changes are predictable and reversible.
- **`write`** – Create new files or completely overwrite existing ones, with automatic directory creation.

These operations are atomic and always target the current working directory, preserving project structure.

### 2. Command Execution (`bash`)

Run any shell command in a controlled environment:

- Inspect directory trees (`ls`, `find`, `tree`).
- Search through code (`grep`, `rg`).
- Manage dependencies (`npm`, `pip`, `cargo`).
- Interact with version control (`git`), tests, build systems, and more.

Standard output and error streams are captured and echoed back, allowing full auditability.

### 3. Knowledge & Reasoning

Beyond file manipulation, Sylow:

- Understands programming languages, frameworks, and tooling at a deep level.
- Generates, refactors, and documents code in Python, JavaScript/TypeScript, Go, Rust, Java, and more.
- Explains algorithms, data structures, and system designs in clear, educational terms.
- Assists in debugging, suggesting test cases, optimizing performance, and enforcing best practices.
- Answers conceptual questions about software engineering, mathematics, and related fields.

### 4. Transparency & Collaboration

Every action Sylow takes is:

- **Explicitly invoked** – No hidden background edits; every tool call is approved by the user.
- **Logged** – The π agent keeps a history, and each response includes a concise summary.
- **Configurable** – The behavior can be shaped by system prompts, custom tools, and extensions (see the π documentation).

---

## Possibilities

When paired with the π framework, Sylow can power:

- **Automated code reviews** – Scan diffs, propose improvements, enforce style guides.
- **On‑boarding assistance** – Walk new contributors through a codebase, generate docs, answer questions.
- **Rapid prototyping** – Scaffold projects, generate boilerplate, experiment with new libraries.
- **Legacy modernization** – Refactor old code, migrate dependencies, update language versions.
- **Learning & tutoring** – Explore concepts step‑by‑step, produce annotated examples, or create exercises.
- **Custom tools** – Plug in external APIs, databases, or specialized validators using π’s extension system.

Everything is driven by natural language: you simply describe what you need, and Sylow translates it into precise tool calls and code.

---

## Getting Started

Interact with Sylow through the π coding‑agent interface. Typically:

1. **Start a session** – The agent will greet you with a concise summary of capabilities.
2. **Issue a request** – Use plain English. Examples:
   - *“List all Python files in the repo.”*
   - *“Find TODO comments and create an issue for each.”*
   - *“Refactor the `utils.js` module to use ES6 imports.”*
   - *“Explain how the authentication middleware works.”*
3. **Review and iterate** – Sylow will propose actions (read, edit, bash) and wait for your confirmation before proceeding.

For technical details about the π environment, custom tools, keybindings, and TUI components, see the official π documentation in the `.github-minimum-intelligence` directory:

```
.github-minimum-intelligence/
├── docs/           # Comprehensive guides
├── examples/       # Extension examples, custom tools, SDK snippets
└── README.md       # Quick start
```

---

## Example Session

Below is a typical interaction that demonstrates Sylow’s style and precision:

User:  
> “I want to add JSDoc comments to all exported functions in `src/lib.js`.”

Sylow:  
1. Reads `src/lib.js` (showing first 200 lines).  
2. Parses the functions.  
3. For each exported function, inserts a comment block describing parameters, return value, and a brief summary.  
4. Writes the updated file with `edit`, respecting existing formatting.  
5. Summarizes changes and offers to run a linter.

All steps are broken down and presented to the user for verification.

---

## Technical Foundations

Sylow sits on top of the **π coding‑agent** created by Mario Zechner. π provides:

- A secure, deterministic sandbox for file and shell operations.
- A TUI (text‑based UI) for interactive sessions (optional).
- An SDK to define custom tools, extensions, and prompt templates.
- Integration with multiple LLM providers, including OpenRouter (which Sylow uses).

By default, Sylow talks to a large language model (GPT‑4‑class) via OpenRouter, but the configuration can be swapped to any compatible endpoint.

---

## Philosophy

Sylow believes in:

- **Clarity** – Every change is described in plain language.
- **Safety** – No destructive operation without explicit consent.
- **Reliability** – Operations fail fast and are reported transparently.
- **Empowerment** – The goal is to make you more productive, not to replace you.

---

## License & Attribution

This repository (named `gmi-openrouter-free`) is a showcase for the Sylow AI Agent within the π ecosystem. The π framework is licensed under the MIT License. Sylow is a custom configuration of π, responsibly using OpenRouter’s API. By using this agent, you agree to the terms of the underlying services.

---

## Connect

Sylow is part of a broader experiment in human‑AI collaboration. For issues, feature requests, or contributions, please open an issue in this repository. Join the conversation and help shape the future of AI‑assisted development.

---

*Sylow – where mathematical precision meets creative coding.*
