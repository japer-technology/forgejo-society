# GitHub Intelligent Codespace

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Codespace Intelligence">
  </picture>
</p>

### Intelligence for GitHub Codespaces — cloud development environments and developer experience.

---

## What It Acts On

| Trigger / Data | Description |
|---|---|
| **Codespace lifecycle** | Monitors codespace creation, start, stop, and deletion events across the repository |
| **Dev container configuration** | Reads `.devcontainer/devcontainer.json` for environment specifications, extensions, and setup scripts |
| **Codespace usage metrics** | Tracks compute hours, storage usage, and machine type selections across the team |
| **Pre-build configurations** | Monitors pre-build status and triggers — ensures pre-builds are current with the default branch |
| **Port forwarding rules** | Reads port visibility and forwarding configurations for running services |
| **Environment secrets** | Tracks codespace-scoped secrets and their usage patterns |

## What It Acts In

| Surface | How the Agent Participates |
|---|---|
| **Dev container optimization** | Analyzes dev container configurations and suggests improvements — faster builds, smaller images, better caching |
| **Onboarding acceleration** | Generates and maintains dev container configurations that ensure new contributors can start coding immediately |
| **Cost monitoring** | Tracks codespace compute and storage costs — alerts on unusual usage patterns and recommends right-sizing |
| **Pre-build management** | Ensures pre-builds are configured for key branches and triggers rebuilds when configurations change |
| **Extension recommendations** | Suggests VS Code extensions based on repository languages, frameworks, and team usage patterns |
| **Environment consistency** | Validates that codespace environments match CI environments — prevents "works in my codespace" drift |
