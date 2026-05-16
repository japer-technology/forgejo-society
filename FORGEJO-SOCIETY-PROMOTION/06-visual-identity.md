# 06 — Visual identity

> Logo, palette, typography, diagram conventions, asset rules.

This document is the **canonical specification of the project's visual
language**. The source-of-truth asset files live in [`assets/`](assets/README.md);
this document records the rules that govern them.

---

## Logo

- **Primary mark.** The current primary mark is `logo.png` at the
  repository root, used in the header of the root `README.md` and most
  pillar READMEs.
- **Usage.** Use the primary mark unmodified; do not recolour, distort,
  or composite over busy backgrounds without an approved variant.
- **Variants.** Approved variants (light, dark, monochrome, square,
  wide) are catalogued in `assets/README.md` as they are produced.
- **Clear space and minimum size.** To be specified.

## Palette

A small, deliberately constrained palette will be defined here. Each
colour records:

- Name, role (primary, accent, surface, text, etc.).
- Hex value and accessible-contrast pairings.
- Where it is used (web, slides, diagrams).

## Typography

Approved typefaces for headings, body text, and code, with fallbacks
for environments where the primary face is unavailable.

## Diagram conventions

The project uses diagrams to make the *forge as mind* legible. Rules to
be specified here include:

- Permitted shapes for agencies, critics, censors, memory, workspace.
- Edge styles for handoffs, signals, settlements, K-lines.
- Colour use, mapped to the palette above.
- Source-format requirements (e.g. text-based diagram sources committed
  alongside rendered images).

## Asset rules

- All canonical assets live under `assets/`.
- Binary assets are committed only when there is no practical
  text-source equivalent; where possible, commit the source (SVG, dot,
  mermaid) alongside any rendered raster.
- External surfaces link to `assets/` (or its raw URL on the default
  branch) rather than re-uploading copies.

## Status

Scaffold. The primary mark is stable; palette, typography, and diagram
conventions are filled in as the visual identity is decided and
approved.
