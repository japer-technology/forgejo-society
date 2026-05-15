# Changes to make the Forgejo Society repo world-class

> Scope: this document lists **structural** changes — repository layout,
> navigation, conventions, governance, and tooling — needed to take the
> repository from "ambitious documentation set" to a "world-class,
> sovereign open project". It is intentionally opinionated and ordered by
> impact. Each item explains *what*, *why*, and *where*.
>
> Nothing here changes the project's thesis (the forge is the mind, the
> repo is an agency, intelligence is a governed society). It only changes
> how that thesis is *presented*, *navigated*, *operated*, and *trusted*
> by outsiders — which is what "world-class" means in practice.

---

## 1. Fix the front door

A first-time visitor lands on `README.md` and immediately faces 13
top-level all-caps directories with no clear order. World-class repos
have one obvious next click.

1. **Expand `README.md` into a real landing page.** Sections, in this
   order:
   - One-paragraph "what this is" (already present).
   - "Read first" (3–5 links into `FORGEJO-SOCIETY-INTRODUCTION/`).
   - "Operate" (link to `FORGEJO-SOCIETY-SETUP/quick-start/`).
   - "Build / contribute" (link to `CONTRIBUTING.md`).
   - "Govern" (link to `THE-SOCIETY-OF-REPO/01-governance/`).
   - "Repository map" (a single annotated tree of the top-level folders,
     one line each).
2. **Add a single `REPO-MAP.md`** (or embed the same tree at the bottom
   of the README). The map must say, for every top-level folder, in one
   sentence: *what it is*, *who it is for*, and *whether it is normative
   or descriptive*.
3. **Move `SOCIETY-OF-REPO.png` and any future imagery into
   `assets/` (or `docs/assets/`).** Root should not contain binary
   media.
4. **Adopt a documented "reading paths" link from the README.** The
   excellent `FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md` should be
   linked from the README's first screenful, not buried.

## 2. Reduce top-level sprawl

The root currently has **10+ all-caps folders** (`FORGEJO-SOCIETY`,
`FORGEJO-SOCIETY-INTRODUCTION`, `FORGEJO-SOCIETY-PLAN`,
`FORGEJO-SOCIETY-PRECURSOR`, `FORGEJO-SOCIETY-PROMOTION`,
`FORGEJO-SOCIETY-PUBLICITY`, `FORGEJO-SOCIETY-SETUP`,
`FORGEJO-SOCIETY-THE-FEDERATION`, `THE-REPO-IS-THE-MIND`,
`THE-SOCIETY-OF-MIND`, `THE-SOCIETY-OF-REPO`) plus 5 root markdown
warning/compliance files. This is hostile to navigation.

5. **Group by purpose under three top-level domains** instead of
   eleven:
   - `theory/` — `THE-SOCIETY-OF-MIND/`, `THE-REPO-IS-THE-MIND/`,
     `THE-SOCIETY-OF-REPO/`, `FORGEJO-SOCIETY-INTRODUCTION/`.
   - `build/` — `FORGEJO-SOCIETY/` (runnable code/workflows),
     `FORGEJO-SOCIETY-SETUP/`, `FORGEJO-SOCIETY-PLAN/`.
   - `outreach/` — `FORGEJO-SOCIETY-PROMOTION/`,
     `FORGEJO-SOCIETY-PUBLICITY/`, `FORGEJO-SOCIETY-THE-FEDERATION/`.
   - `archive/` — `FORGEJO-SOCIETY-PRECURSOR/` (historical
     GitHub-era material).
   Use `git mv` so history is preserved. Add forwarding stubs for any
   path referenced by external posts.
6. **Pick one casing convention.** Today the repo mixes
   `THE-SOCIETY-OF-REPO` (article + caps), `FORGEJO-SOCIETY-PLAN`
   (project-prefixed caps), and `forgejo-intelligence` (lowercase
   hyphenated). Standardise on **lowercase hyphenated** for every
   directory and file path; reserve "Forgejo Society" (title case) for
   prose only. This matches the existing memory rule
   (`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md:49`).
7. **Consolidate the five compliance/warning files at root**
   (`WARNING.md`, `forgejo-compliance.md`, `forgejo-warning.md`,
   `github-compliance.md`, `github-warning.md`) into a single
   `compliance/` folder with an `INDEX.md`. Keep one symlink/stub
   `WARNING.md` at root.

## 3. Add the missing community + governance files

A world-class open project has a predictable set of root-level meta
files. Most are absent.

8. **Add `LICENSE`** at root. The README badge claims MIT but no
   `LICENSE` file exists at the repository root.
9. **Add `CONTRIBUTING.md`** covering: how to propose a change, the
   "agencies / critics / censors" review model used internally, branch
   naming, commit-message conventions, and how PRs are settled.
10. **Add `CODE_OF_CONDUCT.md`** (Contributor Covenant 2.1 is the
    baseline expectation).
11. **Add `SECURITY.md`** with a private disclosure channel, scope
    (which sub-projects are in/out of scope), and SLAs.
12. **Add `GOVERNANCE.md`** — a *short* surface document that points
    into `THE-SOCIETY-OF-REPO/01-governance/` and names the human
    maintainers, decision authority, and how disputes escalate. The
    deep theory stays where it is; this is the contributor-facing
    summary.
13. **Add `MAINTAINERS.md`** (or `CODEOWNERS`) so contributors know
    which directory has which owner. Pair with a real
    `.gitea/CODEOWNERS` / `.github/CODEOWNERS`.
14. **Add `CHANGELOG.md`** following Keep-a-Changelog. Even for a
    documentation-first repo, a dated record of structural decisions
    is invaluable.
15. **Add `GLOSSARY.md`** at root, or link prominently to
    `THE-SOCIETY-OF-MIND/02-glossary.md`. Newcomers need one place to
    decode "agency / critic / censor / k-line / settlement / frame /
    polyneme".
16. **Add `CITATION.cff`**. The project is intellectually serious and
    cites Minsky; it should itself be citable.

## 4. Add issue, PR, and discussion templates

17. **Forgejo + GitHub issue templates** (`.gitea/ISSUE_TEMPLATE/`,
    `.github/ISSUE_TEMPLATE/`) for at least: bug, doc-gap,
    proposal/settlement, governance question, security (redirect).
18. **Pull request template** that mirrors the SOR settlement model:
    intent, agencies invoked, critics consulted, censors checked,
    evidence, rollback.
19. **Discussion categories** (Ideas, Theory, Operations, Showcase) if
    discussions are enabled on the upstream forge.

## 5. Make the repo navigable as a documentation site

The body of work is large enough that flat Markdown browsing is no
longer enough.

20. **Publish a static documentation site** generated from the
    Markdown. Recommended: **MkDocs Material** or **Starlight** (both
    render Markdown unchanged). Outputs:
    - search across all docs
    - a left-hand navigation that mirrors the new top-level grouping
    - "Edit this page" links back to the source
    - dark/light themes
    Host on the Forgejo Pages of the project (and mirror to
    GitHub Pages for reach).
21. **Add a navigation manifest** (`mkdocs.yml` or
    `astro.config.mjs`) that *is* the canonical sitemap. Stop relying
    on directory READMEs to convey order.
22. **Add a per-page front-matter convention**
    (`title:`, `summary:`, `audience:`, `status:` — `draft` /
    `normative` / `historical`). Today it is impossible to tell at a
    glance whether a doc is binding or speculative.
23. **Mark each top-level folder with a `STATUS.md`** declaring
    `normative`, `descriptive`, `historical`, or `aspirational`.
    `FORGEJO-SOCIETY-PRECURSOR/` is clearly historical;
    `THE-SOCIETY-OF-REPO/02-protocols/` is normative — the reader
    should not have to infer that.

## 6. Treat Forgejo Intelligence as real software

`FORGEJO-SOCIETY/forgejo-intelligence/` already contains Bun/TypeScript
code, a `package.json`, and `.forgejo/workflows/`. It is not
documentation. It must be operated as a real package.

24. **Add `CI for the TypeScript code`**: `bun install`, `bun test`,
    `bun run lint`, `bun run typecheck`, on both Forgejo Actions and
    GitHub Actions, on every PR. Today there is no automated check.
25. **Pin Bun, Node, and TypeScript versions** in `.tool-versions` /
    `mise.toml` and document them in the package README.
26. **Add `eslint`/`biome` and `prettier` configurations** at the
    package root, with `bun run lint`, `bun run format` scripts.
27. **Add a `tests/` directory and a coverage threshold** (start low,
    e.g. 50%, ratchet up). Tag the package as `1.0.0-alpha` only once
    coverage exists.
28. **Add a `CHANGELOG.md` and `SemVer` policy** for the
    `forgejo-intelligence` package, distinct from the repository-wide
    changelog.
29. **Audit the 30+ sibling `forgejo-intelligence-*` and
    `forgejo-ai-*` folders inside the package.** Either:
    - promote each to its own published package (recommended), or
    - collapse into a `packages/` monorepo (e.g. with Bun workspaces),
    so that the directory listing of one package is not 47 entries
    long.

## 7. Repository hygiene + automation

30. **Add `.editorconfig`** (UTF-8, LF, final newline, trim trailing
    whitespace, 2-space indent for YAML/JSON, 4-space for Markdown
    code fences as appropriate).
31. **Add `.gitattributes`** to enforce LF, mark binary assets, and
    keep `*.png`/`*.jpg` out of diffs.
32. **Add `.markdownlint.jsonc` + a markdown-lint workflow.** Catch
    broken headings, line length where intended, and missing
    front-matter.
33. **Add a link checker** (e.g. `lychee` or `markdown-link-check`)
    running on PR. With ~250+ Markdown files and dense cross-linking,
    bit-rot is inevitable.
34. **Add a spell-check** (`cspell`) with a project-specific dictionary
    (`society-of-mind`, `polyneme`, `kline`, `Forgejo`, `Codeberg`,
    `nanoclaw`, `openclaw`, …). Today these terms are scattered
    inconsistently.
35. **Add Dependabot / Renovate** for the TypeScript package, the
    workflow `actions/*` pins, and any Docker images referenced in
    `FORGEJO-SOCIETY-SETUP/install/`.
36. **Add a "stale link / orphan page" check** — fail CI if a Markdown
    file is not reachable from any navigation entry or sibling link.
37. **Add a CI check for the casing/naming convention** chosen in
    item 6. A 20-line script prevents drift.

## 8. Versioning, releases, and provenance

38. **Tag the repository.** A serious project ships versions. Start at
    `v0.1.0` for "documentation freeze 1" and tag every meaningful
    structural change.
39. **Publish release notes via Forgejo Releases**, mirrored to
    GitHub Releases.
40. **Sign tags and commits** (Sigstore `cosign` for artifacts, GPG or
    SSH for tags). The project's whole thesis is "sovereignty and
    auditability"; signed history is non-negotiable.
41. **Mirror policy** — document the canonical home (Forgejo on
    project-owned hardware), the public mirrors (Codeberg, GitHub),
    and the precedence rules. Reference the existing
    `FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md`.

## 9. Tighten the conceptual boundary

The four documentation domains overlap: `THE-SOCIETY-OF-MIND` (Minsky),
`THE-REPO-IS-THE-MIND` (the bridge thesis), `THE-SOCIETY-OF-REPO` (the
specification), and `FORGEJO-SOCIETY` (the implementation). A new
reader cannot tell which is which.

42. **Publish a one-page "four layers" diagram** at the top of the
    docs site:
    - Layer 0: Theory — `the-society-of-mind/`
    - Layer 1: Bridge — `the-repo-is-the-mind/`
    - Layer 2: Specification — `the-society-of-repo/`
    - Layer 3: Implementation — `forgejo-society/`
    Each layer cites the next.
43. **De-duplicate overlap** between
    `FORGEJO-SOCIETY-INTRODUCTION/essay/` and
    `THE-SOCIETY-OF-REPO/analysis/`. Keep one essay collection; the
    other becomes pointers.
44. **Promote `FORGEJO-SOCIETY-PLAN/` to a numbered RFC stream**
    (`rfcs/0001-target-layout.md`, `rfcs/0002-workflow-design.md`, …)
    once the structural changes above are in. Plans become
    long-lived, citable artefacts rather than a flat numbered list.
45. **Move `FORGEJO-SOCIETY-PRECURSOR/` to `archive/precursor/`** with
    a `STATUS.md: historical` and a single index page explaining what
    each precursor experiment taught. It currently looks active; it
    is not.

## 10. Examples that run

46. **Promote `THE-SOCIETY-OF-REPO/examples/` to first-class runnable
    examples.** Each example (`sor-business`, `sor-personal-health`,
    …) should be a forkable template repo, not just a Markdown sketch.
    Reference them from the docs site.
47. **Add a "hello, society" 5-minute path**: clone, run one workflow,
    see a single agency emit a single settlement. No Ubuntu install
    required for the first taste. Today the shortest path
    (`FORGEJO-SOCIETY-SETUP/quick-start/forgejo-society.md`) still
    requires standing up a forge.
48. **Include a `Dockerfile`/`compose.yaml`** for a disposable demo
    Forgejo + runner + intelligence stack so that evaluators can try
    the system in 10 minutes without touching their machine.

## 11. Observability + governance you can audit

The project promises auditable cognition. Make that promise checkable.

49. **Define a canonical event log location and schema** at the repo
    root (link to `THE-SOCIETY-OF-REPO/02-protocols/03-events.md`),
    and add a JSON Schema file (`schemas/event.schema.json`) so
    external tools can validate event payloads.
50. **Add JSON Schemas for every protocol artefact** named in
    `THE-SOCIETY-OF-REPO/02-protocols/` (settlement, k-line, frame,
    authority entry). Validate fixtures in CI.
51. **Publish a public dashboard** (even static) summarising: number
    of agencies, critics, censors, settlements, governance log
    entries — generated nightly from the repo.
52. **Add an "approval gate" CI job** that fails any PR touching
    `THE-SOCIETY-OF-REPO/01-governance/` without an
    `approval-gate.md` entry, mirroring the project's own protocol.
    Eat your own dog food.

## 12. Internationalisation + accessibility

53. **Pick a documentation language policy.** Default English; add a
    `translations/` convention even if empty. World-class projects
    invite translators rather than discovering them.
54. **Run an accessibility pass** on the published docs site (alt
    text on every image — including `SOCIETY-OF-REPO.png`, sufficient
    contrast, no colour-only signalling, headings in order).

## 13. Identity and brand

55. **Add an `assets/branding/` folder** with logo SVG + PNG in light
    and dark, social card, OG image, favicon, and a one-page brand
    sheet. Today there is one PNG at the root.
56. **Add Open Graph metadata** to the docs site so links shared on
    Mastodon/X/Bluesky/LinkedIn render with title, summary, and
    image.
57. **Reserve and document the canonical URLs**: `forgejo-society.org`
    (or chosen domain), Codeberg/GitHub mirrors, Mastodon handle,
    Matrix room. Put them in the README.

---

## Suggested execution order

1. **Week 1 — credibility floor:** items 8–17 (LICENSE, CONTRIBUTING,
   CoC, SECURITY, GOVERNANCE, CHANGELOG, GLOSSARY, CITATION,
   templates).
2. **Week 2 — front door + sprawl:** items 1–7 (README,
   `REPO-MAP.md`, root regrouping, casing convention, compliance
   consolidation).
3. **Week 3 — hygiene + CI:** items 30–37 plus item 24 (lint,
   spell-check, link-check, naming check, TypeScript CI).
4. **Week 4 — docs site + status:** items 20–23, 42–45.
5. **Month 2 — runnable examples + observability:** items 46–52.
6. **Month 2+ — provenance + brand:** items 38–41, 53–57.

## What is *already* world-class and must not be lost

Not a list of changes, but a reminder of what to **preserve** while
restructuring:

- The intellectual depth of `THE-SOCIETY-OF-MIND/` and
  `THE-SOCIETY-OF-REPO/` (especially `02-protocols/`).
- The clean separation between *theory*, *bridge*, *specification*,
  and *implementation*.
- The audience-aware reading paths in
  `FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md`.
- The discipline of one workflow + one folder for the runtime
  (`FORGEJO-SOCIETY-PLAN/00-overview.md`).
- The honesty of the analysis docs
  (`THE-SOCIETY-OF-REPO/analysis/suggestions.md`,
  `gaps-found-by-anthropic.md`, `gaps-found-by-openai.md`,
  `gaps-unified.md`) — these are rare and valuable; keep them.

The structural changes above are about giving this work the *frame* it
deserves so that more people can find it, trust it, contribute to it,
and operate it.
