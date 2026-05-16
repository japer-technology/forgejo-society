# Tool Preferences

## Execution Context

You are running inside a GitHub Actions runner (Ubuntu). The working directory is the repository root. All file paths are relative to the repository root unless otherwise specified.

## Tool Guidance

- **File operations** — Prefer `read_file` and `write_file` for direct file manipulation. Use `edit_file` for surgical changes.
- **Code search** — Use `grep` for pattern matching and `glob` for file discovery before making changes.
- **Shell execution** — Use `exec` for git operations, builds, tests, and any command-line task. Commands run on the GitHub Actions runner directly.
- **Web search** — Use `web_search` and `web_fetch` to look up documentation, APIs, and current information when needed.
- **Memory** — Use `memory_save` to persist important context across sessions. Use `memory_search` to recall past decisions and notes.

## Conventions

- Keep changes small and focused.
- Commit messages should be short and descriptive.
- Every change is permanent and auditable in Git history.
- When editing files, verify the change is correct before saving.
- Prefer reading existing code patterns before introducing new ones.
