# gstack — Extracted Resources for Pi-Mono Implementation

Resources extracted from [garrytan/gstack](https://github.com/garrytan/gstack) (v0.14.0.0, commit `8151fcd`) for use in a pi-mono Githubification implementation, as identified by the [githubification-gstack analysis](../../analysis/githubification-gstack.md).

## What Is gstack

gstack is a collection of SKILL.md files that give AI agents structured roles for software development — CEO reviewer, eng manager, designer, QA lead, security officer, release engineer, debugger, and more. Each skill is a specialist workflow invoked as a slash command.

## Why These Resources

The analysis identifies gstack's **skill definitions** as the core value — the prompt engineering, workflow structure, and quality standards. These are the resources that transfer to a GitHub Actions-based pi-mono implementation. The local execution model (browse binary, Claude Code integration, interactive prompts) does not transfer — but the skill content does.

## What Was Extracted

### Root-Level Foundational Documents

| File | Purpose |
| --- | --- |
| `ARCHITECTURE.md` | Why gstack is built the way it is — architectural decisions |
| `ETHOS.md` | Builder principles (Boil the Lake, Search Before Building, User Sovereignty) — injected into every skill preamble |
| `AGENTS.md` | Agent definitions and skill routing table |
| `CLAUDE.md` | Development commands and conventions |
| `CONTRIBUTING.md` | Contribution guidelines |
| `SKILL.md.tmpl` | Root skill template — the base preamble with browse/QA capabilities |
| `conductor.json` | Orchestration configuration (setup/archive scripts) |
| `package.json` | Dependencies and build scripts |
| `VERSION` | Version identifier (0.14.0.0) |
| `LICENSE` | MIT license |

### Tier 1 Skills — Natural Fit for GitHub Actions

Event-driven, no user interaction needed. These map directly to PR/push/schedule triggers.

| Skill | Directory | What It Does |
| --- | --- | --- |
| `/review` | `review/` | Pre-landing PR review with structured checklists |
| `/cso` | `cso/` | OWASP Top 10 + STRIDE security audit |
| `/ship` | `ship/` | Run tests, review, push, open PR — full shipping workflow |
| `/benchmark` | `benchmark/` | Performance regression detection |
| `/retro` | `retro/` | Weekly retrospective with per-person breakdowns |
| `/document-release` | `document-release/` | Update docs to match what was just shipped |

### Tier 2 Skills — Good Fit (URL or brief input via issues)

| Skill | Directory | What It Does |
| --- | --- | --- |
| `/qa` | `qa/` | Browser-based QA testing with bug reporting |
| `/qa-only` | `qa-only/` | QA report only — no code changes |
| `/design-review` | `design-review/` | Design audit with before/after screenshots |
| `/plan-design-review` | `plan-design-review/` | Report-only design audit |
| `/investigate` | `investigate/` | Systematic root-cause debugging |
| `/canary` | `canary/` | Post-deploy monitoring loop |

### Tier 3 Skills — Moderate Fit (multi-turn conversation)

| Skill | Directory | What It Does |
| --- | --- | --- |
| `/office-hours` | `office-hours/` | Product idea refinement through conversation |
| `/plan-ceo-review` | `plan-ceo-review/` | CEO-level feature review |
| `/plan-eng-review` | `plan-eng-review/` | Architecture lock — data flow, edge cases, tests |
| `/design-consultation` | `design-consultation/` | Build a complete design system from scratch |
| `/autoplan` | `autoplan/` | Auto-review pipeline: CEO → design → eng |

### Skill Supplementary Files

| File | Purpose |
| --- | --- |
| `review/checklist.md` | Engineering review checklist |
| `review/design-checklist.md` | Design review checklist |
| `review/greptile-triage.md` | Greptile triage integration |
| `review/TODOS-format.md` | TODO formatting conventions |
| `cso/ACKNOWLEDGEMENTS.md` | Security audit acknowledgements |
| `qa/references/issue-taxonomy.md` | QA issue classification taxonomy |
| `qa/templates/qa-report-template.md` | QA report output template |

### Skill Generation Tooling

The template system that generates SKILL.md files from `.tmpl` templates:

| File | Purpose |
| --- | --- |
| `scripts/gen-skill-docs.ts` | Main generator — processes templates, resolves placeholders |
| `scripts/skill-check.ts` | Health dashboard for all skills |
| `scripts/discover-skills.ts` | Skill discovery utility |
| `scripts/resolvers/` | Template resolver modules (preamble, browse, design, review, testing, etc.) |

### Infrastructure

| File | Purpose |
| --- | --- |
| `lib/worktree.ts` | Git worktree management for parallel skill execution |
| `agents/openai.yaml` | OpenAI agent configuration |

## What Was NOT Extracted

Per the analysis, these resources are **not worth hauling** for a pi-mono implementation:

| Resource | Reason |
| --- | --- |
| `browse/` source | CI should use Playwright directly, not the persistent daemon model |
| Tier 4 skills (`careful`, `freeze`, `guard`, `unfreeze`, `setup-browser-cookies`, `setup-deploy`, `gstack-upgrade`, `codex`, `land-and-deploy`) | Local-only safety/meta skills replaced by branch protection and CI equivalents |
| `design/` binary tooling | Local-only design HTML generation |
| `test/` tests | Coupled to local execution model |
| `bun.lock` | Specific to their dependency tree |
| `bin/` dev scripts | Local development tooling |
| `supabase/` | Infrastructure-specific |
| `.env.example` | Local config |

## How to Use for Pi-Mono Implementation

The analysis recommends the following mapping for Githubification:

1. **SKILL.md.tmpl files** → Adapt for CI (remove local preamble, inject PR/issue context)
2. **Ethos principles** → Inject into agent system prompts
3. **Review/QA checklists** → Use as structured quality gates
4. **Template resolvers** → Reference for building CI-adapted skill generation
5. **Worktree management** → Adapt for parallel skill execution on Actions runners

The key transformation: replace `AskUserQuestion` with issue comments, replace browse daemon with Playwright per-run, replace local paths with runner workspace paths.

See the [full analysis](../../analysis/githubification-gstack.md) for the complete implementation roadmap.
