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
   - "Operate" (link to `FORGEJO-SOCIETY-INSTALLATION/quick-start/`).
   - "Build / contribute" (link to `CONTRIBUTING.md`).
   - "Govern" (link to `THE-SOCIETY-OF-REPO/01-governance/`).
   - "Repository map" (a single annotated tree of the top-level folders,
     one line each).
2. **Add a single `REPO-MAP.md`** (or embed the same tree at the bottom
   of the README). The map must say, for every top-level folder, in one
   sentence: *what it is*, *who it is for*, and *whether it is normative
   or descriptive*.
3. **Move `logo.png` and any future imagery into
   `assets/` (or `docs/assets/`).** Root should not contain binary
   media.
4. **Adopt a documented "reading paths" link from the README.** The
   excellent `FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md` should be
   linked from the README's first screenful, not buried.

### A cooler design — "The Atrium"

The four items above describe *what* the front door must contain. The
following describes *how it should feel*. Treat the README as the
**atrium** of a building: a small, calm room with named doorways, a
permanent inscription on one wall, and a single noticeboard that is
quietly updated overnight.

```
                          forgejo-society
                          ───────────────
                          one paragraph
                          (what this is)

   ┌─── READ ───┐   ┌── OPERATE ──┐   ┌─── BUILD ───┐
   │ essays     │   │ quick-start │   │ contribute  │
   │ reading    │   │ install     │   │ code of     │
   │  paths     │   │ runners     │   │  practice   │
   └────────────┘   └─────────────┘   └─────────────┘

         ┌─── GOVERN ───┐         ┌─── WATCH ───┐
         │ authority    │         │ today panel │
         │ settlements  │         │ recent      │
         │ approval gate│         │  settlements│
         └──────────────┘         └─────────────┘

   ── the five quiet reversals ──────────────────────
   1. the forge is the mind
   2. intelligence is a governed society
   3. capability is granted by files, audited by git
   4. cognition persists as git objects
   5. sovereignty is structural
   ──────────────────────────────────────────────────
```

Concretely, the README becomes five horizontal bands. Each band is
short. Together they fit on a 1080p first screen.

| Band            | Purpose                                | Source of content                                                                 |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| **Hero**        | One paragraph: what this is.           | Hand-edited; matches the project tagline.                                          |
| **Doorways**    | Five labelled cards: READ · OPERATE · BUILD · GOVERN · WATCH. | Each card is three links and one sentence. No card is empty.            |
| **Reversals**   | The five quiet reversals as numbered axioms. | Mirrors `README.md` thesis; rendered as a visual strip, not a bulleted list. |
| **Today panel** | Auto-generated: latest tag, latest settlement, latest k-line, agency / critic / censor counts. | Generated nightly by a workflow under `.forgejo/workflows/atrium-today.yml` and committed as `assets/atrium/today.md`, included by transclusion. |
| **Repository map** | One annotated tree, one line per top-level entry. | The same tree exported from `REPO-MAP.md` so it cannot drift. |

Design rules that make the atrium feel inhabited rather than corporate:

- **Doorways are verbs, not nouns.** *READ*, *OPERATE*, *BUILD*,
  *GOVERN*, *WATCH* — each describes what a visitor *does next*, not a
  department they belong to.
- **One inscription, never two.** The five reversals are the only
  slogan-shaped text allowed on the front door. Everywhere else the
  voice stays in the descriptive register defined by
  `FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`.
- **The "today" panel is a living K-line.** It is regenerated by a
  workflow, never hand-edited, so the README itself becomes a small
  artefact of the society it describes. If the workflow fails for a
  week, the panel says so honestly — it does not lie about freshness.
- **No images above the fold.** ASCII diagrams render in every reader
  (terminal, blind-friendly screen reader, Forgejo, Codeberg, GitHub,
  mirror, archive). Branded imagery lives under `assets/branding/`
  (item 55) and appears *below* the doorways, not above them.
- **The atrium is the only place that links sideways.** Deeper pages
  link down into their pillar. Only the atrium links across all four
  layers. This keeps the navigation graph close to a tree and makes
  orphan-page detection (item 36) trivial.

## 2. Reduce top-level sprawl

The root currently has **10+ all-caps folders** (`FORGEJO-SOCIETY`,
`FORGEJO-SOCIETY-INTRODUCTION`, `FORGEJO-SOCIETY-IMPLEMENTATION`,
`FORGEJO-SOCIETY-PRECURSOR`, `FORGEJO-SOCIETY-PROMOTION`,
`FORGEJO-SOCIETY-PUBLICITY`, `FORGEJO-SOCIETY-INSTALLATION`,
`FORGEJO-SOCIETY-THE-FEDERATION`, `THE-REPO-IS-THE-MIND`,
`THE-SOCIETY-OF-MIND`, `THE-SOCIETY-OF-REPO`) plus 5 root markdown
warning/compliance files. This is hostile to navigation.

5. **Group by purpose under three top-level domains** instead of
   eleven:
   - `theory/` — `THE-SOCIETY-OF-MIND/`, `THE-REPO-IS-THE-MIND/`,
     `THE-SOCIETY-OF-REPO/`, `FORGEJO-SOCIETY-INTRODUCTION/`.
   - `build/` — `FORGEJO-SOCIETY/` (runnable code/workflows),
     `FORGEJO-SOCIETY-INSTALLATION/`, `FORGEJO-SOCIETY-IMPLEMENTATION/`.
   - `outreach/` — `FORGEJO-SOCIETY-PROMOTION/`,
     `FORGEJO-SOCIETY-PUBLICITY/`, `FORGEJO-SOCIETY-THE-FEDERATION/`.
   - `archive/` — `FORGEJO-SOCIETY-PRECURSOR/` (historical
     GitHub-era material).
   Use `git mv` so history is preserved. Add forwarding stubs for any
   path referenced by external posts.
6. **Pick one casing convention.** Today the repo mixes
   `THE-SOCIETY-OF-REPO` (article + caps), `FORGEJO-SOCIETY-IMPLEMENTATION`
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

### A cooler design — "The Three Estates and the Archive"

Items 5–7 say *what* to regroup. The following gives that regrouping
a shape that a newcomer can hold in one breath. Treat the top level
not as eleven folders, but as **three estates and one archive** — a
small civic geometry that mirrors the project's own framing of
agencies, critics, and censors.

Each estate has a one-word charter. The charters are deliberately
verbs in the third person singular: they describe what the estate
*does*, not what it contains.

| Estate       | Charter      | Holds                                                                                                | Audience              | Status      |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `theory/`    | *contemplates* | `the-society-of-mind/`, `the-repo-is-the-mind/`, `the-society-of-repo/`, `forgejo-society-introduction/` | readers, researchers  | normative + descriptive |
| `build/`     | *operates*   | `forgejo-society/` (code + workflows), `forgejo-society-installation/`, `forgejo-society-implementation/`               | operators, contributors | normative + aspirational |
| `outreach/`  | *speaks*     | `forgejo-society-promotion/`, `forgejo-society-publicity/`, `forgejo-society-the-federation/`          | the public, mirrors    | descriptive |
| `archive/`   | *remembers*  | `forgejo-society-precursor/`, retired settlements, superseded plans                                    | historians, auditors   | historical  |
| `compliance/`| *binds*      | the five root warning/compliance files (item 7)                                                       | every contributor      | normative   |

`compliance/` is not an estate; it is a **lintel** — a small load-bearing
beam present in every doorway. The atrium (section 1) links to it from
all four estate doorways, and CI refuses any PR that contradicts it.

#### Before / after, in one picture

```
BEFORE                              AFTER
──────                              ─────
forgejo-society/                    forgejo-society/
├── FORGEJO-SOCIETY/                ├── README.md          (the atrium)
├── FORGEJO-SOCIETY-INTRODUCTION/   ├── REPO-MAP.md
├── FORGEJO-SOCIETY-IMPLEMENTATION/           ├── assets/
├── FORGEJO-SOCIETY-PRECURSOR/      │   ├── branding/
├── FORGEJO-SOCIETY-PROMOTION/      │   └── atrium/today.md
├── FORGEJO-SOCIETY-PUBLICITY/      ├── compliance/        (the lintel)
├── FORGEJO-SOCIETY-INSTALLATION/          │   ├── INDEX.md
├── FORGEJO-SOCIETY-THE-FEDERATION/ │   ├── forgejo/
├── THE-REPO-IS-THE-MIND/           │   └── github/
├── THE-SOCIETY-OF-MIND/            ├── theory/            (contemplates)
├── THE-SOCIETY-OF-REPO/            │   ├── society-of-mind/
├── WARNING.md                      │   ├── repo-is-the-mind/
├── forgejo-compliance.md           │   ├── society-of-repo/
├── forgejo-warning.md              │   └── introduction/
├── github-compliance.md            ├── build/             (operates)
├── github-warning.md               │   ├── forgejo-society/        (runnable)
└── (logo lives under FORGEJO-SOCIETY/) │   ├── setup/
                                    │   └── plan/
                                    ├── outreach/          (speaks)
                                    │   ├── promotion/
                                    │   ├── publicity/
                                    │   └── federation/
                                    └── archive/           (remembers)
                                        └── precursor/
```

#### Migration matrix and stub policy

Restructuring a documentation set this widely cited will break inbound
links unless every move leaves a forwarding stub behind. The policy is
small and mechanical.

| Old path                              | New path                            | Stub at old path                     |
| ------------------------------------- | ----------------------------------- | ------------------------------------ |
| `THE-SOCIETY-OF-MIND/`                | `theory/society-of-mind/`           | `README.md` redirect (see below)     |
| `THE-REPO-IS-THE-MIND/`               | `theory/repo-is-the-mind/`          | `README.md` redirect                 |
| `THE-SOCIETY-OF-REPO/`                | `theory/society-of-repo/`           | `README.md` redirect                 |
| `FORGEJO-SOCIETY-INTRODUCTION/`       | `theory/introduction/`              | `README.md` redirect                 |
| `FORGEJO-SOCIETY/`                    | `build/forgejo-society/`            | `README.md` redirect                 |
| `FORGEJO-SOCIETY-INSTALLATION/`              | `build/setup/`                      | `README.md` redirect                 |
| `FORGEJO-SOCIETY-IMPLEMENTATION/`               | `build/plan/` (later `build/rfcs/`) | `README.md` redirect                 |
| `FORGEJO-SOCIETY-PROMOTION/`          | `outreach/promotion/`               | `README.md` redirect                 |
| `FORGEJO-SOCIETY-PUBLICITY/`          | `outreach/publicity/`               | `README.md` redirect                 |
| `FORGEJO-SOCIETY-THE-FEDERATION/`     | `outreach/federation/`              | `README.md` redirect                 |
| `FORGEJO-SOCIETY-PRECURSOR/`          | `archive/precursor/`                | `README.md` redirect                 |
| `WARNING.md` + four siblings          | `compliance/`                       | one `WARNING.md` at root, by symlink |

The forwarding stub is uniform; it is the *only* permitted content of
an old path after the move:

```markdown
# Moved

This directory moved to [`<new-path>/`](../<new-path>/) during the
top-level regrouping documented in
`FORGEJO-SOCIETY-RESEARCH/changes-for-world-class.md` (items 5–7).

External links to the old path will keep working through this stub
until at least the next two annual tags.
```

#### Casing convention as one regex

Item 6 mandates lowercase-hyphenated paths. Make that mandate
mechanical, so it cannot drift. A single regex covers every directory
and every Markdown file under the new top level:

```
^(theory|build|outreach|archive|compliance|assets)/[a-z0-9]+(-[a-z0-9]+)*(/[a-z0-9]+(-[a-z0-9]+)*)*(\.md)?$
```

The CI job named in item 37 runs this regex against `git ls-files` and
fails on any deviation. Title-case ("Forgejo Society", "Society of
Repo") is preserved *inside* prose by the style guide
(`outreach/promotion/08-style-guide.md`) and is not the file-system's
concern.

#### Why this shape, and not more layers

Three estates plus an archive is the smallest geometry that still
honours the project's own four conceptual layers (theory · bridge ·
specification · implementation) without collapsing them. `theory/`
absorbs all three reading layers because, to a newcomer, they are one
estate of *texts to read*; their internal ordering is preserved by the
existing numbered subfolders (`01-…`, `02-…`) and by the
four-layer diagram proposed in item 42. The atrium (section 1) is the
only surface that needs to see all four layers side by side.

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
    `FORGEJO-SOCIETY-INSTALLATION/install/`.
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
    `FORGEJO-SOCIETY-INSTALLATION/transition-plan/03-codeberg-mirror.md`.

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
44. **Promote `FORGEJO-SOCIETY-IMPLEMENTATION/` to a numbered RFC stream**
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
    (`FORGEJO-SOCIETY-INSTALLATION/quick-start/forgejo-society.md`) still
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
    text on every image — including `FORGEJO-SOCIETY/FORGEJO-SOCIETY.png`,
    sufficient contrast, no colour-only signalling, headings in order).

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
  (`FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md`).
- The honesty of the analysis docs
  (`THE-SOCIETY-OF-REPO/analysis/suggestions.md`,
  `gaps-found-by-anthropic.md`, `gaps-found-by-openai.md`,
  `gaps-unified.md`) — these are rare and valuable; keep them.

The structural changes above are about giving this work the *frame* it
deserves so that more people can find it, trust it, contribute to it,
and operate it.
