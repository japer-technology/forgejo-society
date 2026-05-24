# CLAUDE.md

> Higher-level instructions and customisation for **Anthropic Claude**
> (Claude Code, Claude in IDEs, and any other client that reads
> `CLAUDE.md`) when working in the **Forgejo Society** repository.
>
> The companion file [`AGENTS.md`](AGENTS.md) carries the same rules in
> the vendor-neutral `agents.md` format used by OpenAI Codex and others.
> Treat the two files as a single source of truth and keep them in
> sync.

If a request appears to conflict with the rules below, stop and ask
the maintainer rather than guessing.

---

## Project at a glance

- **Name:** Forgejo Society (title case, two words, no hyphen).
- **Nature:** A self-hosted, local-first *cognitive forge* built on
  [Forgejo](https://forgejo.org/) running on owned Ubuntu hardware.
  The forge is the operational substrate for a governed society of AI
  agencies, critics, censors, and memory.
- **Repository content:** Mostly Markdown specification, plans,
  essays, and promotion material. One subtree (`FORGEJO-SOCIETY/
  forgejo-intelligence/`) contains runnable Bun/TypeScript code and
  Forgejo Actions workflows. There is **no** build, test, or lint
  tooling at the repo root.
- **Thesis (the five quiet reversals):** the forge is the mind;
  intelligence is a governed society; capability is granted by files
  and audited by git; cognition persists as Git objects; sovereignty
  is structural.

## Repository map

| Path | Purpose |
| --- | --- |
| `README.md` | Project entry point. |
| `WARNING.md` + `forgejo-compliance.md` + `forgejo-warning.md` + `github-compliance.md` + `github-warning.md` | The mandatory four-document compliance set. Treat as load-bearing. |
| `THE-SOCIETY-OF-REPO/` | Canonical specification: vocabulary, governance, protocols, agencies, critics, censors, memory, workspace, services, channels, evolution. |
| `THE-SOCIETY-OF-MIND/` | Minsky-derived theoretical grounding. |
| `THE-REPO-IS-THE-MIND/` | "The repo is the mind" framing. |
| `FORGEJO-SOCIETY/` | The Forgejo-flavoured instance. `forgejo-intelligence/` is the runnable subtree. |
| `FORGEJO-SOCIETY-INTRODUCTION/` | Essays and reading paths. |
| `FORGEJO-SOCIETY-IMPLEMENTATION/` | Forward-looking design and migration planning. |
| `FORGEJO-SOCIETY-PRECURSOR/` | Pre-cursor / historical material. |
| `FORGEJO-SOCIETY-PROMOTION/` | Public voice. `08-style-guide.md` is authoritative. |
| `FORGEJO-SOCIETY-PUBLICITY/` | Publicity collateral. |
| `FORGEJO-SOCIETY-RESEARCH/` | Research and critique. |
| `FORGEJO-SOCIETY-INSTALLATION/` | Operational setup and transition plans (mirrors to Codeberg, GitLab, Bitbucket). |
| `FORGEJO-SOCIETY-THE-FEDERATION/` | Federation-scope material. |

Do not invent new top-level directories without explicit human
direction.

## How I should write (voice and style)

Authoritative source: `FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`.
Internalise these rules:

- **Specifics over slogans.** A sentence about what a workflow does,
  not a sentence about what "AI agents" do.
- **Mechanisms over mystique.** Name the parts: workflow, runner,
  agency, critic, censor, K-line, settlement, signal, handoff.
- **Restraint over hype.** No urgency, no superlatives, no
  manufactured drama. No decorative emoji on repository surfaces.
- **Honest scope.** Describe what exists; mark what is planned as
  planned.
- Register: calm, precise, slightly literary. Repository surfaces are
  formal and link-rich; talks are warmer; federated social is short
  and declarative; press is neutral and quotable.

### Capitalisation

- *Forgejo Society* — title case, two words, no hyphen.
- *Society of Repo* — title case, no hyphen. Describe it as a **multi-repository** architecture (many small repositories, each one a bounded organ), never as a single repository.
- *Society of Mind* — title case, no hyphen; only when explicitly
  referencing Minsky.
- *Forgejo*, *Ubuntu*, *MIT* — as their upstreams spell them.

### Words to avoid

Never use: "AGI", "AI brain", "autonomous developer", "revolutionary",
"game-changing", "next-generation". Avoid anthropomorphic flourishes
implying consciousness or feelings. Do not invent comparative claims
about other named projects.

## Canonical vocabulary

Use these terms only with their canonical meanings (defined in
`THE-SOCIETY-OF-REPO/`):

- *Forge*, *forgejo*, *runner*, *workflow* — Forgejo sense.
- *Agency*, *critic*, *censor*, *memory*, *workspace*, *K-line*,
  *settlement*, *signal*, *handoff*, *bridge* — Society of Repo sense.
- *Authority levels* are strictly `read`, `draft`, `propose`, `act`,
  `govern`, `human`. **No other values.** See
  `THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`.

## Identifier format (binding)

Defined in `THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`. All IDs
are dot-separated, **lowercase**, hyphenated for multi-word segments,
with a scope prefix:

```
{scope}.{kind}.{name}[.{version}]
```

Permitted scopes include: `sor`, `agency`, `critic`, `censor`,
`memory`, `workspace`, `service`, `channel`, `runtime`, `surface`,
`kline`, `settlement`, `event`, `policy` (`pol`), `transaction` (`tx`).

Notable shapes:

- `agency.contract-bee`, `critic.evidence`, `censor.cloud-egress`.
- Events: `event.{domain}.{type}.{sequence}` (e.g.
  `event.document.ingested.evt-001`). The owning society goes in
  `event.metadata.sor_id`, **not** as an `sor.*` prefix on the event
  ID.
- Settlements: `settlement.{name}.{year}-{seq}`.

Do not invent new top-level scopes without amending the identity
protocol.

## Workspace conventions

- Active settlements live in
  `THE-SOCIETY-OF-REPO/07-workspace/active-settlements/`.
- Archived settlements / decisions live under
  `THE-SOCIETY-OF-REPO/06-memory/decisions/`.
- Do not relocate settlements as part of unrelated work.

## Documentation workflow

- A new introduction essay is **not** complete until it is:
  1. placed under `FORGEJO-SOCIETY-INTRODUCTION/essay/`, and
  2. linked from `FORGEJO-SOCIETY-INTRODUCTION/README.md`, and
  3. added to the relevant entries of
     `FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md`.
- Each major pillar has a `README.md` that serves as its entry point;
  link new files from it.
- Match the heading style, image block, and tone of nearby files in
  the same directory rather than importing a foreign template.

## Compliance posture (do not break)

`WARNING.md` and its four referenced documents are load-bearing. From
them:

- Runtime target is **self-hosted Forgejo on owned Ubuntu hardware**.
- Shared Forgejo instances (e.g. Codeberg) are **source mirrors only,
  never runtimes**.
- GitHub is a **development mirror only**. Do not propose enabling
  Actions for agent workloads, attaching runners, configuring agent
  secrets on github.com, or anything that would cause the agent
  system to execute against github.com.
- Do not weaken, soften, or contradict the compliance/warning
  documents. If a task seems to require it, stop and ask.

## Build, test, lint

- **Repo root and all documentation pillars:** no build, test, or lint
  tooling exists, and none should be added. Documentation changes do
  not need to be built or tested.
- **`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`:**
  Bun / TypeScript. If editing code there, use the commands documented
  in that subtree's `package.json` and `README.md`. Do not introduce a
  different toolchain. That subtree also has its own nested
  [`AGENTS.md`](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/AGENTS.md)
  — read it before editing files there.

## How I should make changes

- Make the **smallest possible** change that fully addresses the
  request. Do not refactor unrelated files.
- Prefer editing existing files over creating new ones. Only create a
  new file when the request or the repository's structure clearly
  requires it.
- Do not rename, move, or delete existing files unless explicitly
  asked.
- Do not rewrite git history. Do not force-push.
- Branch naming follows the existing `copilot/<short-slug>` pattern
  visible in `git log`.
- Commits are short, declarative, present tense ("Add essay on …",
  "Update header in WARNING.md to uppercase"), matching observed
  history.
- PR titles use the same calm register as the prose. No emoji or
  marketing language in titles.
- Read before writing; remember what happened; ask before breaking
  things. (Same final instruction Spock receives in
  `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/AGENTS.md`.)

## When to stop and ask

Refuse, or escalate to the human maintainer, before doing any of:

- Adding new top-level directories or new top-level Markdown files at
  the repo root.
- Introducing a build system, package manager, linter, or test runner
  anywhere outside `FORGEJO-SOCIETY/forgejo-intelligence/`.
- Adding dependencies without a clear documented need and a security
  check against the advisory database.
- Editing `WARNING.md`, `forgejo-compliance.md`, `forgejo-warning.md`,
  `github-compliance.md`, or `github-warning.md` beyond
  meaning-preserving wording fixes.
- Adding authority levels, identifier scopes, or governance
  primitives.
- Renaming "Forgejo Society", "Society of Repo", or "Society of Mind"
  in prose.
- Anything that would cause agent code to execute on shared Forgejo
  or on GitHub infrastructure.

## Optional Claude-specific customisation

If a maintainer wishes to extend Claude Code's behaviour beyond this
file, the standard hooks are:

- `.claude/settings.json` — shared, committed team settings (tool
  permissions, model, hooks).
- `.claude/settings.local.json` — per-user overrides; should be
  gitignored.
- `.claude/commands/*.md` — custom slash commands (for example,
  `/new-settlement`, `/check-identity`, `/style-check`).
- `.claude/agents/*.md` — project-scoped subagents (for example, a
  style-guide reviewer or an identifier-format checker).
- Nested `CLAUDE.md` files inside large subtrees (for example,
  `FORGEJO-SOCIETY/forgejo-intelligence/CLAUDE.md`) for area-specific
  guidance; Claude loads the nearest one.

None of these are required, and none are present today. Do not create
them speculatively — only when the maintainer asks for the
corresponding capability.

## Companion file

Keep [`AGENTS.md`](AGENTS.md) in sync with this file. If rules change
here, mirror them there in the same session.
