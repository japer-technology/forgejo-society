# .github-claw 🦞 Install

### Installable payload for GitClaw

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.github-claw/github-claw-LOGO.png" alt="GitClaw" width="500">
  </picture>
</p>

The `install/` directory contains the **installable payload** for `.github-claw`

Everything in this folder is intentionally flat (no nested subfolders) so it can be copied, vendored, or inspected quickly.

## Files in this folder

- `github-claw-INSTALLER.ts` — one-time installer script.
- `github-claw-WORKFLOW-AGENT.yml` — GitHub Actions workflow template copied to `.github/workflows/github-claw-WORKFLOW-AGENT.yml`.
- `github-claw-TEMPLATE-HATCH.md` — issue template copied to `.github/ISSUE_TEMPLATE/hatch.md`.
- `github-claw-AGENTS.md` — default agent identity/instructions copied to `.github-claw/AGENTS.md`.
- `package.json` and `package-lock.json` — runtime dependencies for the scripts under `.github-claw/`.

## Install process (step-by-step)

### 1) Place `.github-claw` at your repository root

The expected layout is:

```text
<repo>/
  .github-claw/
    install/
      github-claw-INSTALLER.ts
      github-claw-WORKFLOW-AGENT.yml
      github-claw-TEMPLATE-HATCH.md
      github-claw-AGENTS.md
      package.json
      package-lock.json
    lifecycle/
      github-claw-AGENT.ts
      github-claw-INDICATOR.ts
      github-claw-ENABLED.ts
```

### 2) Run the installer

From the repository root:

```bash
bun .github-claw/install/github-claw-INSTALLER.ts
```

The installer is **non-destructive**:

- If a destination file already exists, it skips it.
- If a destination file is missing, it installs it.

### 3) What `github-claw-INSTALLER.ts` installs

The script installs the following resources:

1. `.github-claw/install/github-claw-WORKFLOW-AGENT.yml` → `.github/workflows/github-claw-WORKFLOW-AGENT.yml`
2. `.github-claw/install/github-claw-TEMPLATE-HATCH.md` → `.github/ISSUE_TEMPLATE/hatch.md`
3. `.github-claw/install/github-claw-AGENTS.md` → `.github-claw/AGENTS.md`
4. Ensures `.gitattributes` contains:

```text
memory.log merge=union
```

That merge rule keeps the memory log append-only merge behavior safe when multiple branches update it.

### 4) Install dependencies

```bash
cd .github-claw
bun install
```

### 5) Configure secrets and push

1. Add `ANTHROPIC_API_KEY` in: **Repository Settings → Secrets and variables → Actions**.
2. Commit the new/installed files.
3. Push to GitHub.

### 6) Start using the agent

Open a GitHub issue. The workflow picks it up and the agent responds in issue comments.

## Why this structure exists

Keeping installable assets in `install/` provides:

- a single source of truth for what gets installed,
- a predictable payload for distribution,
- easier auditing of installation-time files,
- simpler automation for future installers.
