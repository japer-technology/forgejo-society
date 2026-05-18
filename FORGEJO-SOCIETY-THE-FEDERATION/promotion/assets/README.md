# `assets/`

> Source-of-truth visual assets: logos, images, diagrams.

This folder holds the **canonical visual assets** for Forgejo Society
promotion. The rules that govern these assets — palette, typography,
diagram conventions, logo usage — live in
[`../06-visual-identity.md`](../06-visual-identity.md).

---

## What belongs here

- **Logos** — the primary mark and approved variants (light, dark,
  monochrome, square, wide).
- **Hero images** — header art used on the website, talks, and press
  materials.
- **Diagrams** — figures that explain the *forge as mind* thesis,
  agencies, critics, censors, memory, and the cognitive loop.
- **Screenshots** — annotated screenshots of forge surfaces (workflow
  runs, pull requests, labels) that illustrate cognitive primitives.
- **Source files** — text-based diagram sources (SVG, dot, mermaid)
  committed alongside any rendered raster.

## What does not belong here

- One-off images used in a single document (keep those next to the
  document that uses them).
- Third-party assets the project does not have rights to redistribute.
- Large binary blobs unrelated to promotion.

## Naming

Use lowercase, hyphenated names that describe content, not context:

- `logo-primary.png`
- `logo-mono-dark.svg`
- `diagram-cognitive-loop.svg`
- `screenshot-pull-request-as-proposal.png`

## Linking

External surfaces should link to assets using the raw URL on the
default branch, mirroring the pattern already used by the root
`README.md` for `FORGEJO-SOCIETY/FORGEJO-SOCIETY.png`.

## Status

Scaffold. The current canonical primary mark is
`FORGEJO-SOCIETY/FORGEJO-SOCIETY.png`; variants and additional assets
are added here as they are produced and approved.
