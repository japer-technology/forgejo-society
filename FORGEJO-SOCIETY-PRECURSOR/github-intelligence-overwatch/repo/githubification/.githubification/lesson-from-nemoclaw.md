# Lesson from NemoClaw

### What `japer-technology/githubification-NemoClaw` teaches us about Type 1 — AI Agent Repo Githubification

---

## The Subject

[NemoClaw](https://github.com/NVIDIA/NemoClaw) is NVIDIA's open source stack for running [OpenClaw](https://openclaw.ai) agents safely inside [NVIDIA OpenShell](https://github.com/NVIDIA/OpenShell) sandboxes. It installs the OpenShell runtime, creates an isolated container with Landlock, seccomp, and network namespace enforcement, routes all inference through NVIDIA cloud (Nemotron 3 Super 120B via [build.nvidia.com](https://build.nvidia.com)), and governs every network request, file access, and model call through declarative YAML policy. The `nemoclaw` CLI orchestrates the full lifecycle: gateway setup, sandbox creation, inference provider configuration, and network policy application.

NemoClaw is a dual-language system. The user-facing layer is a **TypeScript CLI plugin** (`nemoclaw/`) that registers commands under both the `nemoclaw` host CLI and the `openclaw nemoclaw` plugin interface. The orchestration layer is a **versioned Python blueprint** (`nemoclaw-blueprint/`) that contains the actual logic for creating sandboxes, applying policies, and configuring inference — executed as a subprocess by the thin TypeScript plugin. This separation keeps the plugin stable and small while the blueprint evolves on its own release cadence.

`japer-technology/githubification-NemoClaw` is the repository as it exists today — **not yet Githubified**. There is no `.GITNEMOCLAW/` folder, no issue-triggered workflow, no GitHub Actions-based agent execution. The repository uses GitHub for standard open source project management — issues, pull requests, documentation — but the agent itself runs on a host machine or server, not on GitHub. NemoClaw is designed for always-on operation: a sandboxed assistant running persistently inside OpenShell, accessed via the OpenClaw TUI or CLI.

This makes NemoClaw a **pre-Githubification Type 1 subject**: a sophisticated agent sandboxing system studied at the moment before a Githubification layer would be applied. The question is not "what does the Githubification look like?" but "what does NemoClaw's architecture — especially its security model, its blueprint lifecycle, and its dual-language plugin design — teach us about how Githubification should work for enterprise-grade, security-first agent systems?"

---

## The Core Lesson

> **When an agent system's primary value proposition is security and isolation, Githubification must preserve those guarantees — or it destroys the reason the system exists.**

NemoClaw is not an AI agent itself. It is the **infrastructure that makes an AI agent safe to run unattended**. OpenClaw is the agent; NemoClaw is the sandbox, the policy engine, the inference router, and the lifecycle manager. Every design decision in NemoClaw serves one goal: ensuring that the agent cannot do anything that hasn't been explicitly allowed.

This creates a unique Githubification challenge. In every other case study in this directory, Githubification maps GitHub primitives to the agent's interfaces:

| GitHub Primitive | Typical Mapping |
|---|---|
| **GitHub Actions** | Compute — the runner that executes the agent |
| **Git** | Storage and memory — state committed to the repository |
| **GitHub Issues** | User interface — conversation threads |
| **GitHub Secrets** | Credential store — API keys |

For NemoClaw, this mapping is necessary but insufficient. NemoClaw's value is not in *running* the agent — OpenClaw already does that — but in *constraining* it. The mapping must also account for:

| NemoClaw Capability | Githubification Challenge |
|---|---|
| **Landlock + seccomp sandbox** | GitHub Actions runners already provide container isolation, but not the same granularity. How do you replicate per-path filesystem policies on an ephemeral runner? |
| **Network namespace isolation** | GitHub Actions has no native network namespace. Outbound traffic is unrestricted unless you add firewall rules inside the workflow. |
| **Declarative YAML network policy** | The policy file (`openclaw-sandbox.yaml`) lists every allowed endpoint. On a GitHub runner, enforcement requires a userspace proxy or iptables rules applied at workflow start. |
| **Inference routing through OpenShell gateway** | On a persistent host, OpenShell intercepts model calls transparently. On an ephemeral runner, the gateway must be started, configured, and torn down within the workflow's lifetime. |
| **Blueprint digest verification** | The blueprint artifact is immutable and digest-verified before execution. This supply chain safety mechanism must survive the transition to a GitHub Actions environment. |

The lesson: **Githubification of a security system requires reproducing the security guarantees in the new environment, not just the functionality.** If you Githubify NemoClaw by running OpenClaw on a GitHub Actions runner without the sandbox, the policy engine, and the inference gateway, you have not Githubified NemoClaw — you have bypassed it.

---

## Anatomy of the Repository

NemoClaw is organized as a multi-component project with a clear separation between the user-facing CLI plugin, the orchestration blueprint, and the supporting infrastructure:

```
githubification-NemoClaw/
├── nemoclaw/                          # TypeScript CLI plugin (OpenClaw plugin)
│   ├── src/
│   │   ├── index.ts                   # Plugin entry point — registers commands, provider, slash handler
│   │   ├── cli.ts                     # CLI registrar — wires commander.js subcommands
│   │   ├── commands/
│   │   │   ├── status.ts              # `openclaw nemoclaw status` — sandbox health
│   │   │   ├── migrate.ts             # `openclaw nemoclaw migrate` — host-to-sandbox migration
│   │   │   ├── migration-state.ts     # State machine for migration lifecycle
│   │   │   ├── launch.ts              # `openclaw nemoclaw launch` — fresh bootstrap
│   │   │   ├── connect.ts             # `openclaw nemoclaw connect` — interactive shell
│   │   │   ├── logs.ts                # `openclaw nemoclaw logs` — stream sandbox logs
│   │   │   ├── eject.ts               # `openclaw nemoclaw eject` — rollback to host
│   │   │   ├── onboard.ts             # `openclaw nemoclaw onboard` — guided setup wizard
│   │   │   └── slash.ts               # /nemoclaw slash command handler (chat interface)
│   │   ├── onboard/
│   │   │   ├── config.ts              # Onboard config persistence
│   │   │   ├── prompt.ts              # Interactive prompt helpers
│   │   │   └── validate.ts            # Input validation for onboard flow
│   │   └── blueprint/
│   │       ├── resolve.ts             # Blueprint version resolution
│   │       ├── fetch.ts               # Blueprint artifact download
│   │       ├── verify.ts              # Digest verification
│   │       ├── exec.ts                # Blueprint subprocess execution
│   │       └── state.ts               # Blueprint run state management
│   ├── openclaw.plugin.json           # Plugin manifest with config schema
│   ├── tsconfig.json                  # TypeScript configuration
│   └── package.json                   # Plugin dependencies and build scripts
│
├── nemoclaw-blueprint/                # Python blueprint (orchestration artifact)
│   ├── blueprint.yaml                 # Versioned blueprint definition — profiles, components, policy
│   ├── orchestrator/
│   │   └── runner.py                  # Blueprint runner — plan, apply, status, rollback actions
│   ├── policies/
│   │   ├── openclaw-sandbox.yaml      # Strict baseline network + filesystem policy
│   │   └── presets/                   # Policy presets for different deployment scenarios
│   ├── migrations/                    # Database and state migration scripts
│   └── pyproject.toml                 # Python project config (ruff linting, PyYAML dependency)
│
├── bin/
│   ├── nemoclaw.js                    # Host CLI entry point
│   └── lib/                           # CLI support libraries
│
├── scripts/
│   ├── install.sh                     # Node.js component installer
│   ├── setup.sh                       # Environment setup
│   ├── brev-setup.sh                  # Remote GPU deployment via Brev
│   ├── setup-spark.sh                 # Spark deployment setup
│   ├── nemoclaw-start.sh              # Container startup script
│   ├── start-services.sh              # Auxiliary services (Telegram bridge, tunnel)
│   ├── telegram-bridge.js             # Telegram messaging bridge
│   ├── fix-coredns.sh                 # DNS troubleshooting
│   ├── walkthrough.sh                 # Guided demo script
│   ├── write-auth-profile.py          # Credential profile writer
│   ├── test-inference.sh              # Cloud inference test
│   └── test-inference-local.sh        # Local inference test
│
├── test/
│   ├── cli.test.js                    # CLI command structure tests
│   ├── preflight.test.js              # Prerequisite validation tests
│   ├── install-preflight.test.js      # Install-time preflight tests
│   ├── policies.test.js               # Policy file validation tests
│   ├── nim.test.js                    # NVIDIA NIM provider tests
│   ├── registry.test.js               # Blueprint registry resolution tests
│   ├── e2e-test.sh                    # End-to-end sandbox test
│   └── Dockerfile.sandbox             # Test sandbox image
│
├── docs/                              # Sphinx documentation
│   ├── about/                         # Overview, how-it-works, release notes
│   ├── get-started/                   # Quickstart guides
│   ├── deployment/                    # Remote GPU deployment docs
│   ├── inference/                     # Inference provider configuration
│   ├── monitoring/                    # Sandbox activity monitoring
│   ├── network-policy/                # Egress control documentation
│   ├── reference/                     # Architecture, CLI commands, profiles
│   └── conf.py                        # Sphinx configuration
│
├── install.sh                         # Root installer — Node.js, Ollama, NemoClaw, onboard
├── Dockerfile                         # Sandbox container image
├── Makefile                           # Check, lint, format, docs targets
├── package.json                       # Root package — test runner, OpenClaw dependency
├── pyproject.toml                     # Docs build dependencies (Sphinx, myst-parser)
└── spark-install.md                   # GPU instance deployment guide
```

The separation between the TypeScript plugin and the Python blueprint is the defining structural decision. The plugin handles user interaction and CLI registration; the blueprint handles infrastructure orchestration. They communicate through a subprocess protocol: the plugin invokes `runner.py` with an action (`plan`, `apply`, `status`, `rollback`), and the runner emits structured progress lines (`PROGRESS:<pct>:<label>`) and a run identifier (`RUN_ID:<id>`) on stdout.

---

## Key Patterns

### 1. Thin Plugin, Versioned Blueprint

NemoClaw's most distinctive architectural pattern is the split between a **thin, stable CLI plugin** and a **versioned, evolving blueprint**. The plugin is TypeScript — the same language as OpenClaw itself — and registers into the OpenClaw plugin system via `openclaw.plugin.json`:

```json
{
  "id": "nemoclaw",
  "name": "NemoClaw",
  "version": "0.1.0",
  "description": "Migrate and run OpenClaw inside OpenShell with optional NIM-backed inference"
}
```

The plugin's `register()` function hooks into the OpenClaw plugin API to register three capabilities: a `/nemoclaw` slash command for the chat interface, CLI subcommands under `openclaw nemoclaw`, and an `nvidia-nim` model provider. All orchestration — sandbox creation, policy application, inference routing — is delegated to the Python blueprint runner via subprocess.

This pattern has a direct Githubification implication: **the plugin and the blueprint can be versioned and updated independently.** A Githubification layer that wraps NemoClaw can pin the blueprint version in the workflow definition and update it separately from the plugin code, enabling safe rollouts of infrastructure changes without touching the agent interaction layer.

### 2. Blueprint Lifecycle: Resolve → Verify → Plan → Apply

The blueprint follows a four-stage lifecycle that provides supply chain safety and reproducibility:

| Stage | What Happens |
|---|---|
| **Resolve** | `blueprint/resolve.ts` — determines which blueprint version to use, resolving `latest` to a specific version from the registry |
| **Verify** | `blueprint/verify.ts` — checks the artifact's digest against the expected value from `blueprint.yaml` |
| **Plan** | `runner.py plan` — validates inputs, checks prerequisites (OpenShell CLI on PATH), resolves the inference profile, and emits a JSON plan |
| **Apply** | `runner.py apply` — creates the sandbox, configures the inference provider, sets the inference route, and saves run state |

Each run is identified by a unique run ID (`nc-YYYYMMDD-HHMMSS-<8hex>`) and its state is persisted to `~/.nemoclaw/state/runs/<run_id>/plan.json`. This enables rollback (`runner.py rollback --run-id <id>`), status queries, and audit trails.

For Githubification, this lifecycle maps cleanly to workflow steps. Each stage becomes a step in a GitHub Actions job, with the plan output passed as an artifact between steps. The run ID can be derived from the GitHub Actions run number, providing traceability between the workflow run and the NemoClaw deployment.

### 3. Declarative Security Policy

NemoClaw's security model is defined in `openclaw-sandbox.yaml` — a single YAML file that specifies every allowed endpoint, filesystem path, and process constraint:

```yaml
filesystem_policy:
  read_write:
    - /sandbox
    - /tmp
  read_only:
    - /usr
    - /lib
    - /proc

network_policies:
  nvidia:
    endpoints:
      - host: integrate.api.nvidia.com
        port: 443
        protocol: rest
        enforcement: enforce
        tls: terminate
    binaries:
      - { path: /usr/local/bin/openclaw }
```

Key features of the policy model:

- **Deny by default** — nothing is allowed unless explicitly listed. If the agent tries to reach an unlisted host, OpenShell blocks the request and surfaces it for operator approval.
- **Binary-restricted rules** — network policies can be scoped to specific binaries. The `nvidia` policy only allows `openclaw` and `claude` to reach NVIDIA endpoints; other binaries in the sandbox cannot.
- **Tiered enforcement** — the policy notes future support for `strict` (current baseline) and `relaxed` (broader web access) tiers.
- **Hot-reloadable for some layers** — network policies and inference routing can be updated at runtime; filesystem and process policies are locked at sandbox creation.

This is a fundamentally different security model from anything seen in the other Githubification case studies. GitClaw's security is a sentinel file (`github-claw-ENABLED.md`) and a permissions check. OpenClaw's Githubification layer has trust tiers and fail-closed guards. NemoClaw has **kernel-level isolation** (Landlock, seccomp, network namespaces) plus **application-level policy** (endpoint allowlisting, binary-scoped rules, TLS termination enforcement).

### 4. Multi-Profile Inference

The `blueprint.yaml` defines four inference profiles, each mapping to a different deployment scenario:

| Profile | Provider | Endpoint | Use Case |
|---|---|---|---|
| `default` | NVIDIA cloud | `integrate.api.nvidia.com` | Production — requires NVIDIA API key from [build.nvidia.com](https://build.nvidia.com) |
| `ncp` | NVIDIA cloud (NCP partner) | Dynamic | NVIDIA Cloud Partner deployments with dynamic endpoints |
| `nim-local` | OpenAI-compatible | `nim-service.local:8000` | Local NVIDIA NIM deployment |
| `vllm` | OpenAI-compatible | `localhost:8000` | Local vLLM server with a smaller model (Nemotron 3 Nano 30B) |

The model catalog in the plugin registration includes four Nemotron models ranging from 30B to 253B parameters. The onboard wizard (`nemoclaw onboard`) walks the user through endpoint selection, API key configuration, and model choice.

For Githubification, the profile system means a single workflow can support multiple deployment modes. The profile could be selected via an issue label (`/profile:default` vs `/profile:vllm`) or a repository variable, and the workflow would pass it through to the blueprint runner. The `default` profile is the natural fit for GitHub-hosted execution — NVIDIA cloud inference with an API key stored as a GitHub Secret.

### 5. Containerized Sandbox Image

The `Dockerfile` builds a complete sandbox environment:

```dockerfile
FROM node:22-slim

# Install OS dependencies
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv curl git ca-certificates iproute2

# Create sandbox user (matches OpenShell convention)
RUN groupadd -r sandbox && useradd -r -g sandbox -d /sandbox -s /bin/bash sandbox

# Install OpenClaw CLI
RUN npm install -g openclaw@2026.3.11

# Copy plugin and blueprint
COPY nemoclaw/dist/ /opt/nemoclaw/dist/
COPY nemoclaw-blueprint/ /opt/nemoclaw-blueprint/

# Configure inference routing through OpenShell gateway
RUN python3 -c "..." # Writes openclaw.json with nvidia provider configuration

# Install NemoClaw plugin into OpenClaw
RUN openclaw plugins install /opt/nemoclaw
```

The image creates a `sandbox` user, installs OpenClaw at a pinned version (`2026.3.11`), copies the plugin and blueprint, pre-configures NVIDIA inference routing through the OpenShell gateway (`https://inference.local/v1`), and installs the NemoClaw plugin. The `ENTRYPOINT` is `/bin/bash` — the sandbox is designed to be entered interactively or to run OpenClaw commands.

This containerization is significant for Githubification because it means **the entire sandbox can be run as a Docker container action in GitHub Actions**. The `Dockerfile` already builds a self-contained image. A Githubification workflow would build or pull this image, start it as a service container, and proxy issue comments into the sandbox via `docker exec`.

### 6. Guided Onboarding Wizard

NemoClaw includes a multi-step onboarding flow (`nemoclaw onboard`) that configures:

1. **Endpoint type** — NVIDIA cloud (build.nvidia.com), NCP partner, local NIM, local vLLM, local Ollama, or custom
2. **Credentials** — API key for cloud endpoints, skipped for local deployments
3. **Model selection** — from the catalog of registered Nemotron models
4. **NCP-specific configuration** — partner name and dynamic endpoint URL

The onboard config is persisted and loaded at plugin registration time, adapting the provider label and credential environment variable based on the user's choices. This is more than a setup script — it is an **adaptive configuration system** that adjusts the plugin's behavior based on deployment context.

For Githubification, the onboard flow would be replaced by repository variables and secrets. The endpoint type maps to a repository variable (`NEMOCLAW_PROFILE`), the API key maps to a repository secret (`NVIDIA_API_KEY`), and the model maps to another variable (`NEMOCLAW_MODEL`). The workflow would construct the equivalent onboard config from these inputs without requiring interactive prompts.

### 7. Host CLI + Plugin CLI Dual Interface

NemoClaw provides two CLI surfaces:

| Interface | Entry Point | Scope |
|---|---|---|
| `nemoclaw` (host CLI) | `bin/nemoclaw.js` | Host-side management — onboard, deploy, connect, start/stop services |
| `openclaw nemoclaw` (plugin CLI) | Registered via `api.registerCli()` | Agent-side management — status, migrate, launch, connect, logs, eject |

The host CLI is the primary interface for initial setup and ongoing management. The plugin CLI provides the same capabilities from within the OpenClaw ecosystem. Both delegate to the same underlying blueprint runner.

This dual interface pattern is relevant to Githubification because it shows that agent management can be exposed through multiple surfaces without duplicating logic. A Githubification layer would add a third surface — **GitHub Issues as CLI** — where issue comments like `/nemoclaw status` or `/nemoclaw logs` would invoke the same blueprint runner through a workflow step.

### 8. Subprocess Protocol for Cross-Language Orchestration

The TypeScript plugin communicates with the Python blueprint runner through a structured stdout protocol:

```
PROGRESS:10:Validating blueprint
PROGRESS:20:Checking prerequisites
PROGRESS:50:Configuring inference provider
PROGRESS:85:Saving run state
PROGRESS:100:Apply complete
RUN_ID:nc-20260317-214148-a1b2c3d4
```

The plugin parses these lines to update progress indicators and capture the run identifier. This is a lightweight alternative to gRPC, REST, or IPC — it works across languages, requires no shared libraries, and produces human-readable output that can be logged directly.

For Githubification, this protocol maps naturally to GitHub Actions step outputs and annotations. Each `PROGRESS` line becomes a workflow annotation, and the `RUN_ID` becomes a step output that downstream steps can reference. The protocol also means the blueprint runner can be invoked directly from a shell step without the TypeScript plugin, simplifying the workflow.

### 9. Comprehensive Test Suite

NemoClaw's test directory covers multiple layers:

| Test File | What It Validates |
|---|---|
| `cli.test.js` | CLI command structure — subcommands exist and have correct options |
| `preflight.test.js` | Prerequisite checks — Node.js version, OpenShell availability |
| `install-preflight.test.js` | Install-time validation — runtime requirements met |
| `policies.test.js` | Policy file correctness — YAML schema, required endpoints present |
| `nim.test.js` | NVIDIA NIM provider configuration — model catalog, auth methods |
| `registry.test.js` | Blueprint registry resolution — version pinning, latest resolution |
| `e2e-test.sh` | End-to-end sandbox creation and agent interaction |
| `Dockerfile.sandbox` | Test sandbox image for integration testing |

The tests are run with Node.js's built-in test runner (`node --test test/*.test.js`). This is notable because the tests validate **structural correctness** — that policies are well-formed, that CLI commands exist, that the blueprint resolves correctly — rather than testing AI behavior. This is the same pattern identified in the GitClaw case study: **test the structure, not the AI.**

### 10. Enterprise-Grade Documentation

NemoClaw ships with Sphinx-based documentation built from Markdown via myst-parser. The documentation is organized into clear sections:

- **About** — overview, how-it-works, release notes
- **Get Started** — quickstart guides
- **Deployment** — remote GPU deployment
- **Inference** — provider configuration and switching
- **Monitoring** — sandbox activity observation
- **Network Policy** — egress control and approval workflows
- **Reference** — architecture, CLI commands, inference profiles

The documentation uses NVIDIA's Sphinx theme and includes Mermaid diagrams for architecture visualization. This level of documentation is exceptional among the case studies and reflects NemoClaw's enterprise orientation — it is designed to be evaluated, adopted, and operated by teams, not just individuals.

---

## What NemoClaw Teaches That Other Case Studies Don't

### 1. Security Is Not a Feature — It Is the Product

In every other case study, security is a concern addressed by the Githubification layer: sentinel files, permission checks, fail-closed guards. These are important but they operate at the **application level** — they prevent unauthorized users from triggering the agent.

NemoClaw operates at the **infrastructure level**. It doesn't just check who can talk to the agent — it controls what the agent can do once it's running:

| Security Layer | Mechanism | Granularity |
|---|---|---|
| **Filesystem** | Landlock — kernel-level path restrictions | Per-directory read/write/none |
| **Process** | seccomp — syscall filtering | Per-syscall allow/deny |
| **Network** | Network namespace + policy engine | Per-host, per-port, per-binary, per-HTTP-method |
| **Inference** | OpenShell gateway interception | All model calls routed through controlled backend |

A Githubification layer for NemoClaw must reproduce these layers or explicitly document what is lost. Running the agent on a standard GitHub Actions runner without OpenShell provides none of these protections. The runner's container isolation is coarser-grained, and there is no policy engine controlling outbound traffic.

### 2. The Blueprint Pattern Enables Reproducible Infrastructure

NemoClaw's blueprint is more than a configuration file — it is an **executable infrastructure specification**:

1. It defines which sandbox image to use, which ports to forward, and which inference profile to apply.
2. It is versioned (`"version": "0.1.0"`) with minimum compatibility requirements (`"min_openshell_version": "0.1.0"`).
3. It is digest-verified before execution — tampered artifacts are rejected.
4. It produces a plan before applying changes, enabling dry-run validation.
5. It tracks run state, enabling rollback to a known-good configuration.

This is infrastructure-as-code applied to agent sandboxing. For Githubification, the blueprint pattern suggests that **workflow definitions should be generated from blueprints, not written by hand.** A `nemoclaw github-actions` command could generate a workflow YAML that encodes the same sandbox configuration, inference routing, and policy enforcement defined in `blueprint.yaml`.

### 3. Dual-Language Architecture Separates Concerns Cleanly

NemoClaw uses TypeScript for the user-facing plugin and Python for infrastructure orchestration. This is not an accident — it reflects the natural languages of each domain:

- **TypeScript** for the plugin because OpenClaw's plugin SDK is JavaScript/TypeScript, and the CLI is built with commander.js.
- **Python** for the blueprint because infrastructure tooling (YAML parsing, subprocess management, state management) is idiomatic in Python, and the documentation is built with Sphinx.

The subprocess protocol between them is deliberately minimal — stdout lines parsed by convention. This avoids the complexity of shared types, FFI, or serialization frameworks.

For Githubification, this dual-language architecture means the workflow can invoke the blueprint runner directly from a shell step (`python3 runner.py apply --profile default`), bypassing the TypeScript plugin entirely. The blueprint is self-contained and doesn't depend on the plugin to function. This is a powerful pattern: **the orchestration layer should be independently invocable**, not locked behind a specific CLI.

### 4. Onboarding Replaces Configuration Files

Where other systems require users to edit JSON or YAML files, NemoClaw provides a guided wizard that adapts to the user's environment. The wizard detects GPU availability, suggests models based on VRAM, validates API keys, and writes the resulting configuration automatically.

This is relevant because Githubification often introduces a "cold start" problem: the user must correctly set repository secrets, variables, and workflow inputs before anything works. NemoClaw's onboard pattern suggests that **Githubified agents should include a setup issue template** — a GitHub Issue that walks the user through configuration step by step, with the agent itself validating each input and committing the configuration to the repository.

### 5. The Sandbox Image Is Already a GitHub Actions Container

NemoClaw's `Dockerfile` builds a self-contained sandbox image that includes OpenClaw, the NemoClaw plugin, the blueprint, and all runtime dependencies. This image is designed for OpenShell but it is also **a valid Docker container action image for GitHub Actions**:

- It starts from `node:22-slim` — a standard, lightweight base
- It installs all dependencies at build time — no network access needed at runtime
- It creates a non-root `sandbox` user — compatible with GitHub Actions container security
- It pre-configures the agent with NVIDIA inference routing

A Githubification workflow could use this image directly with `container:` in the workflow YAML, running the entire sandboxed agent inside the GitHub Actions runner with the same filesystem layout, the same user, and the same inference configuration. The only missing piece is the network policy enforcement, which OpenShell provides but GitHub Actions does not.

---

## Lessons for Any Type 1 Githubification

1. **If the agent's value is security, Githubification must preserve the security model.** Running a sandboxed agent on an unsandboxed GitHub Actions runner defeats the purpose. Either replicate the security layers (container isolation, network policy, filesystem restrictions) in the workflow, or document the security delta clearly.

2. **Split orchestration from interaction.** NemoClaw's thin plugin / versioned blueprint split is a pattern worth replicating. The Githubification layer (interaction) should be stable and rarely change. The infrastructure orchestration (blueprint) should be versioned and independently deployable.

3. **Use a subprocess protocol for cross-language orchestration.** If your agent system spans multiple languages, communicate through structured stdout rather than shared libraries or RPC. It's simple, debuggable, and works in any CI environment.

4. **Make infrastructure reproducible from a specification.** The blueprint pattern — versioned, digest-verified, plan-before-apply, rollback-capable — ensures that every deployment is traceable and reversible. Apply this to Githubification: workflows should be generated from specifications, not hand-edited YAML.

5. **Pre-build the container image.** If the agent requires a complex runtime environment (Node.js, Python, system libraries, plugins), build it into a Docker image and publish it. The Githubification workflow should pull and run the image, not install dependencies on every run.

6. **Replace interactive wizards with declarative configuration.** GitHub Actions cannot run interactive prompts. Convert onboarding flows into repository variables, secrets, and setup issue templates that validate inputs and commit configuration automatically.

7. **Support multiple inference profiles.** Different users have different model providers. A profile system (`default`, `ncp`, `nim-local`, `vllm`) lets the Githubification layer select the right configuration without code changes — just a repository variable or issue label.

8. **Test the infrastructure, not the AI.** NemoClaw's test suite validates that policies are well-formed, CLI commands exist, prerequisites are met, and the registry resolves correctly. These are the same things that can break in a Githubification workflow. Test them.

9. **Invest in documentation.** NemoClaw's Sphinx documentation — with architecture diagrams, CLI references, and deployment guides — sets the standard for what enterprise-grade Githubification documentation should look like. Users evaluating whether to adopt a Githubified agent system need to understand its security model, its failure modes, and its operational requirements.

10. **The container is the deployment boundary.** NemoClaw's `Dockerfile` defines a clear boundary: everything inside the image is the agent's world; everything outside is the host's responsibility. This same boundary applies to Githubification. The container image is the artifact that the workflow deploys. Changes to the agent happen inside the image; changes to the workflow happen outside it.

---

## Summary

`japer-technology/githubification-NemoClaw` demonstrates that Githubification becomes a fundamentally different challenge when the subject is not just an AI agent but a **security-first agent sandboxing system**. NemoClaw wraps OpenClaw in kernel-level isolation (Landlock, seccomp, network namespaces), routes all inference through a controlled gateway, and governs every network request through declarative YAML policy. Its architecture — a thin TypeScript plugin delegating to a versioned Python blueprint via subprocess — is a model for how multi-language agent systems should be structured for both local and cloud deployment.

Where GitClaw teaches that native GitHub agents are simpler, and OpenClaw teaches that complex agents can be wrapped with lifecycle scripts, NemoClaw teaches that **security guarantees must survive the transition to a new runtime environment**. You cannot Githubify a sandboxed agent by removing the sandbox. The Githubification layer must either replicate the security model (container isolation, network policy, filesystem restrictions) or clearly document what protections are lost.

NemoClaw also introduces patterns absent from simpler Githubification subjects: blueprint lifecycle management (resolve → verify → plan → apply → rollback), multi-profile inference routing, cross-language subprocess protocols, containerized sandbox images that double as GitHub Actions containers, and enterprise-grade Sphinx documentation. These patterns become essential as Githubification moves from individual-developer tools to production systems where reproducibility, auditability, and security are non-negotiable.

This is what Type 1 Githubification looks like when applied to enterprise infrastructure: **the challenge is not making the agent run on GitHub — it is making the agent run on GitHub without losing the properties that make it worth running at all.**
