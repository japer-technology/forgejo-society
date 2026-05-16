# AGENTS.md

> Higher-level instructions and customisation for AI coding assistants
> working on **Forgejo Society** (OpenAI Codex, ChatGPT, Cursor, and any
> other tool that reads the [`AGENTS.md`](https://agents.md/) convention).
>
> Anthropic's Claude Code reads [`CLAUDE.md`](CLAUDE.md). That file is the
> companion to this one and must stay synchronised; treat the two as a
> single source of truth.

This file is read first, before any task is started. If a request appears
to conflict with the rules below, stop and ask the maintainer.

---

## 1. What this repository is

**Forgejo Society** is a self-hosted, local-first *cognitive forge* built
on [Forgejo](https://forgejo.org/). It treats the forge — repositories,
runners, issues, pull requests, CI/CD — as the operational substrate for
a *society of agents*: governed AI agencies, critics, censors, and
memory that together form a transparent, auditable cognitive ecology.

It is **mostly documentation** (Markdown specification, plans,
introduction essays, promotion material). One area is runnable code:

- `FORGEJO-SOCIETY/forgejo-intelligence/` — Bun/TypeScript installer
  and Forgejo Actions workflows under `.forgejo/workflows/` and
  `.forgejo-intelligence/`. This is the only place with a build/test
  toolchain. Everywhere else, there is no build, test, or lint.

The canonical project name is **Forgejo Society** (title case, two
words, no hyphen). Reserve `forgejo-society` (hyphenated lowercase) for
slugs, IDs, file paths, and URLs only.

## 2. Repository map

Top-level directories you will encounter, with what belongs in each:

| Path | What it holds |
|---|---|
| `README.md`, `WARNING.md` | Entry points. `WARNING.md` is mandatory reading before suggesting anything runtime-related. |
| `forgejo-compliance.md`, `forgejo-warning.md`, `github-compliance.md`, `github-warning.md` | The four-document compliance set referenced from `WARNING.md`. Do not contradict these. |
| `THE-SOCIETY-OF-REPO/` | The canonical specification. Source of truth for vocabulary, identity, governance, protocols, agencies, critics, censors, memory, workspace, services, channels, evolution. |
| `THE-SOCIETY-OF-MIND/` | Minsky-derived theoretical grounding. Reference, not policy. |
| `THE-REPO-IS-THE-MIND/` | The "the repo is the mind" framing used throughout. |
| `FORGEJO-SOCIETY/` | The Forgejo-flavoured instance: `forgejo-intelligence/` (runnable), `forgejo-society/`, `forgejo-labour/`, `forgejo-workflows/`. |
| `FORGEJO-SOCIETY-INTRODUCTION/` | Introduction essays and reading paths. New essays must be linked from the introduction `README.md` and the relevant `reading-paths.md`. |
| `FORGEJO-SOCIETY-PLAN/` | Forward-looking design and migration planning. |
| `FORGEJO-SOCIETY-PRECURSOR/` | Historical / pre-cursor material. |
| `FORGEJO-SOCIETY-PROMOTION/` | Public voice. **`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md` is the authoritative style guide.** |
| `FORGEJO-SOCIETY-PUBLICITY/` | Outward-facing publicity collateral. |
| `FORGEJO-SOCIETY-RESEARCH/` | Research notes, analyses, "changes for world-class" style critique. |
| `FORGEJO-SOCIETY-SETUP/` | Operational setup, hardware, transition plans (Codeberg / GitLab / Bitbucket mirrors). |
| `FORGEJO-SOCIETY-THE-FEDERATION/` | Federation-scope material. |

When in doubt about *where* something belongs, prefer the most specific
existing pillar; do not invent new top-level directories without
explicit human direction.

## 3. The five quiet reversals (project thesis)

These are the load-bearing ideas of the project (see `README.md`). Any
suggestion that contradicts them is wrong by definition:

1. **The forge is the mind.**
2. **Intelligence is a governed society.**
3. **Capability is granted by files and audited by git.**
4. **Cognition persists as Git objects.**
5. **Sovereignty is structural** — owned hardware, owned forge, owned files.

## 4. Voice and style (binding)

Authoritative source: `FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`.
Summary of the rules you must follow when writing or editing prose:

- **Specifics over slogans.** Describe what a workflow does, not what
  "AI agents" do.
- **Mechanisms over mystique.** Name the parts (workflow, runner,
  agency, critic, censor, K-line, settlement) rather than gesturing at
  intelligence.
- **Restraint over hype.** No urgency, no superlatives, no manufactured
  drama, no emoji-as-decoration in repository surfaces.
- **Honest scope.** Describe what exists; mark what is planned as
  planned.
- Calm, precise, slightly literary register.
- Repository surfaces are formal and link-rich; talks are warmer;
  federated social is short and declarative; press is neutral and
  quotable.

### Capitalisation

- *Forgejo Society* — title case, two words, no hyphen.
- *Society of Repo* — title case, no hyphen.
- *Society of Mind* — title case, no hyphen; used only when explicitly
  referencing Minsky.
- *Forgejo*, *Ubuntu*, *MIT* — as the upstream projects spell them.

### Banned phrasings

Do not introduce: "AGI", "AI brain", "autonomous developer",
"revolutionary", "game-changing", "next-generation". Avoid
anthropomorphic flourishes that imply consciousness or feelings.
Comparative claims about other named projects must be explicitly
documented and reviewed — do not invent them.

## 5. Canonical vocabulary

Use these terms with their canonical meanings. Definitions live in
`THE-SOCIETY-OF-REPO/` and must not be redefined casually in prose:

- *Forge*, *forgejo*, *runner*, *workflow* — in their Forgejo sense.
- *Agency*, *critic*, *censor*, *memory*, *workspace*, *K-line*,
  *settlement*, *signal*, *handoff*, *bridge* — in their Society of
  Repo sense.
- *Authority levels* — strictly `read`, `draft`, `propose`, `act`,
  `govern`, `human`. **No other values.** See
  `THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`.

## 6. Identifier format (binding)

Defined in `THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`. All IDs
are dot-separated, **lowercase**, with hyphens for multi-word segments,
and a scope prefix:

```
{scope}.{kind}.{name}[.{version}]
```

Permitted scopes include: `sor`, `agency`, `critic`, `censor`,
`memory`, `workspace`, `service`, `channel`, `runtime`, `surface`,
`kline`, `settlement`, `event`, `policy` (`pol`), `transaction` (`tx`).

Notable shapes you must respect when writing examples or new specs:

- Agencies: `agency.{name}` — e.g. `agency.contract-bee`.
- Critics: `critic.{name}` — e.g. `critic.evidence`.
- Censors: `censor.{name}` — e.g. `censor.cloud-egress`.
- Events: `event.{domain}.{type}.{sequence}` — e.g.
  `event.document.ingested.evt-001`. The owning society is recorded in
  `event.metadata.sor_id`, **not** as an `sor.*` prefix on the event ID.
- Settlements: `settlement.{name}.{year}-{seq}`.

Never invent new top-level scopes without amending the identity
protocol document.

## 7. Workspace conventions

- In-progress settlements live in
  `THE-SOCIETY-OF-REPO/07-workspace/active-settlements/`.
- Archived settlements / decisions live under
  `THE-SOCIETY-OF-REPO/06-memory/decisions/`.
- Do not move settlements between these locations as part of an
  unrelated change.

## 8. Documentation workflow

- **New introduction essays** must be added under
  `FORGEJO-SOCIETY-INTRODUCTION/essay/` *and* linked from
  `FORGEJO-SOCIETY-INTRODUCTION/README.md` *and* the relevant
  `FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md` entries. An essay
  that is not reachable from those two surfaces is incomplete.
- Each major pillar has its own `README.md`; keep it as the entry
  point and link new files from it.
- Match the heading style, image block, and tone of neighbouring files
  in the same directory rather than importing a foreign template.

## 9. Compliance posture (do not break)

`WARNING.md` and its four referenced documents are load-bearing:

- This project's runtime target is **self-hosted Forgejo on owned
  Ubuntu hardware**. Shared Forgejo instances (e.g. Codeberg) are
  source mirrors only — **never runtimes**.
- GitHub is a **development mirror only**. Do not propose enabling
  GitHub Actions for agent workloads, attaching runners, configuring
  agent secrets on github.com, or any change that would cause the
  agent system to *execute* against github.com infrastructure.
- Do not weaken, soften, or contradict the compliance/warning
  documents. If a task seems to require it, stop and ask.

## 10. Build, test, lint

- Repository root and all documentation pillars: **no build, test, or
  lint tooling.** Do not add any. Documentation changes do not need to
  be built or tested.
- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` uses
  **Bun / TypeScript**. If you change code there, run that area's own
  commands (see its `package.json` and `README.md`); do not introduce a
  different toolchain.
- That subtree also has its own nested
  [`AGENTS.md`](FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/AGENTS.md)
  with area-specific guidance — read it before editing files there.

## 11. Change-making rules

- Make the **smallest possible** change that fully addresses the
  request. Do not refactor unrelated files.
- Prefer editing existing files over creating new ones. Only create a
  new file when the request or the repository's structure clearly
  requires it.
- Do not rename, move, or delete existing files unless explicitly
  asked.
- Do not rewrite history. Do not force-push.
- Branch naming for assistant-driven work follows the existing
  `copilot/<short-slug>` pattern visible in `git log`.
- Commits should be short, declarative, present tense (e.g. "Add essay
  on …", "Update header in WARNING.md to uppercase"), matching the
  observed history.
- PR titles should describe the change in the same calm register as
  the repository prose. Do not use emoji or marketing language in
  titles.

## 12. Things to refuse or escalate

Stop and ask the human maintainer before doing any of the following:

- Adding new top-level directories or new top-level Markdown files at
  the repo root.
- Introducing a build system, package manager, linter, or test runner
  anywhere outside `FORGEJO-SOCIETY/forgejo-intelligence/`.
- Adding dependencies (any ecosystem) without a clear, documented need
  and a security check against the advisory database.
- Changing anything in `WARNING.md`, `forgejo-compliance.md`,
  `forgejo-warning.md`, `github-compliance.md`, or
  `github-warning.md` beyond typo/wording fixes that preserve meaning.
- Adding new authority levels, new identifier scopes, or new
  governance primitives.
- Renaming "Forgejo Society", "Society of Repo", or "Society of Mind"
  in prose.
- Anything that would cause agent code to execute on shared Forgejo or
  on GitHub infrastructure.

## 13. Companion file

Keep [`CLAUDE.md`](CLAUDE.md) in sync with this file. If you update
rules here, mirror them there in the same session.
