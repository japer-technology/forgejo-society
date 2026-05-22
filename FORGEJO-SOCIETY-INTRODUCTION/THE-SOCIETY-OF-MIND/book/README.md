# The Society of Mind — Book Archive

A complete, locally-navigable Markdown archive of Marvin Minsky's
*The Society of Mind* (Simon & Schuster, 1986), preserved here as the
primary source text the rest of [THE-SOCIETY-OF-MIND](../README.md)
annotates.

![The Society of Mind — cover](images/som_book.jpeg)

The book lives here as 267 plain Markdown files — one per section, plus
the cover, contents, prologue, appendix, postscript, and glossary — with
every illustration kept beside them under [images/](images/). It renders
directly on Forgejo, on GitHub, and in any local Markdown viewer.

---

## What lives here

| Surface | Notes |
| --- | --- |
| [cover.md](cover.md) | Front cover and entry point. |
| [contents.md](contents.md) | Table of contents linking every section. |
| [som-prologue.md](som-prologue.md) | Minsky's prologue. |
| `som-{chapter}.{section}.md` | 263 chapter sections across 30 chapters. |
| [som-appendix.md](som-appendix.md) | Appendix. |
| [som-postscript.md](som-postscript.md) | Postscript. |
| [som-glossary.md](som-glossary.md) | Glossary and bibliography. |
| [images/](images/) | All illustrations, organised by chapter (`ch1/` … `ch30/`, plus `appendix/`). |

---

## How to read

For a linear read, start at the cover and follow the footer links:

[cover.md](cover.md) → [contents.md](contents.md) → [som-prologue.md](som-prologue.md) → [som-1.1.md](som-1.1.md) → … → [som-glossary.md](som-glossary.md)

For a topical read, open [contents.md](contents.md) and jump to the
chapter of interest. Every page ends with a navigation footer of the
form

```
[« Previous](…) | [Contents](contents.md) | [Next »](…)
```

so previous, contents, and next are always one click away.

For an annotated read, return to the parent directory:

- [../README.md](../README.md) — the analytical companion: overview,
  glossary, principles, architecture, learning, memory, frames,
  conflict, self, deep insights, objections, and a crosswalk to
  [THE-SOCIETY-OF-REPO](../../THE-SOCIETY-OF-REPO/README.md).

---

## Chapters

| # | Chapter | First section |
| --- | --- | --- |
| 1 | Building Blocks | [som-1.1.md](som-1.1.md) |
| 2 | Wholes and Parts | [som-2.1.md](som-2.1.md) |
| 3 | Conflict and Compromise | [som-3.1.md](som-3.1.md) |
| 4 | The Self | [som-4.1.md](som-4.1.md) |
| 5 | Individuality | [som-5.1.md](som-5.1.md) |
| 6 | Insight and Introspection | [som-6.1.md](som-6.1.md) |
| 7 | Problems and Goals | [som-7.1.md](som-7.1.md) |
| 8 | A Theory of Memory | [som-8.1.md](som-8.1.md) |
| 9 | Summaries | [som-9.1.md](som-9.1.md) |
| 10 | Papert's Principle | [som-10.1.md](som-10.1.md) |
| 11 | The Shape of Space | [som-11.1.md](som-11.1.md) |
| 12 | Learning Meaning | [som-12.1.md](som-12.1.md) |
| 13 | Seeing and Believing | [som-13.1.md](som-13.1.md) |
| 14 | Reformulation | [som-14.1.md](som-14.1.md) |
| 15 | Consciousness and Memory | [som-15.1.md](som-15.1.md) |
| 16 | Emotion | [som-16.1.md](som-16.1.md) |
| 17 | Development | [som-17.1.md](som-17.1.md) |
| 18 | Reasoning | [som-18.1.md](som-18.1.md) |
| 19 | Words and Ideas | [som-19.1.md](som-19.1.md) |
| 20 | Context and Ambiguity | [som-20.1.md](som-20.1.md) |
| 21 | Trans-Frames | [som-21.1.md](som-21.1.md) |
| 22 | Expression | [som-22.1.md](som-22.1.md) |
| 23 | Comparisons | [som-23.1.md](som-23.1.md) |
| 24 | Frames | [som-24.1.md](som-24.1.md) |
| 25 | Frame Arrays | [som-25.1.md](som-25.1.md) |
| 26 | Language-Frames | [som-26.1.md](som-26.1.md) |
| 27 | Censors and Jokes | [som-27.1.md](som-27.1.md) |
| 28 | The Mind and the World | [som-28.1.md](som-28.1.md) |
| 29 | The Realms of Thought | [som-29.1.md](som-29.1.md) |
| 30 | Mental Models | [som-30.1.md](som-30.1.md) |

Front and back matter: [prologue](som-prologue.md),
[appendix](som-appendix.md), [postscript](som-postscript.md),
[glossary](som-glossary.md).

---

## Conventions

A few small rules govern this archive so the links stay honest and the
formatting stays predictable.

- **One section per file.** Each section of the book is a single
  Markdown file named `som-{chapter}.{section}.md`. The numeric layout
  matches the printed edition.
- **Internal links.** Cross-references between sections point at the
  target `.md` file. Fragment identifiers (for example `#uniframe` in
  the glossary) are preserved.
- **Images.** All illustrations live under [images/](images/), grouped
  by chapter as `images/chN/…`. Markdown references use the relative
  path `images/chN/figure.png`.
- **Navigation footer.** Every page ends with a three-link footer:
  previous, contents, next. The endpoints of the reading order (cover
  and glossary) carry a disabled marker rather than an active link.
- **Encoding.** All files are UTF-8 without a byte-order mark. The
  guillemets (`«`, `»`) and em-dashes are real Unicode characters, not
  HTML entities.
- **Glossary headings.** In [som-glossary.md](som-glossary.md), each
  defined term is a level-3 Markdown heading (`### Term`) so the page
  renders as a navigable list of definitions rather than one long
  paragraph.

---

## Provenance

This archive reproduces the text of:

- Marvin Minsky, *The Society of Mind*, Simon & Schuster, New York,
  1986. ISBN 0-671-60740-5.

It is included here strictly as research and reference material for the
[Society of Mind](../README.md) commentary and the
[Society of Repo](../../THE-SOCIETY-OF-REPO/README.md) crosswalk. The
underlying work remains the property of its author and publisher. No
claim of authorship over Minsky's text is made by this repository.

If the rights holders or the Minsky estate object to the presence of
any portion of this archive, raise an issue against the repository and
the material will be removed.

---

## Related reading

- [../README.md](../README.md) — annotated companion to this archive.
- [../research/1986.md](../research/1986.md) — *Whole Earth Review*
  excerpts of *The Society of Mind*.
- [../research/1988.md](../research/1988.md) — Minsky's ONR Final
  Report (1988): connectionism, insulation, K-lines, frames, cache
  memory, zone refining.
- [../research/2025-10-01.md](../research/2025-10-01.md) — Mikkilineni
  and Michaels, *Society of Minds: The Architecture of Mindful
  Machines* (2025).
- [../../THE-SOCIETY-OF-REPO/README.md](../../THE-SOCIETY-OF-REPO/README.md)
  — the engineering specification this theory is the substrate for.
