# 05 — Coverage

> How we log external coverage, request corrections, and learn from how we are described.

This document defines how the project records external coverage of itself
and how it responds when that coverage is inaccurate. The canonical
coverage log lives in [`coverage/`](coverage/README.md).

---

## What we log

Any public, attributable mention of Forgejo Society in an external
publication, including:

- Articles, blog posts, and newsletters that name the project.
- Podcast and video segments that discuss the project.
- Academic papers, technical reports, and theses that cite the project.
- Talks given by people who are not project maintainers in which the
  project is described.

We do **not** log:

- Social-media reactions or short, ephemeral mentions without
  substantive content.
- Private communications.
- Aggregator entries that simply re-link our own canonical materials.

## Format

Each coverage entry is a Markdown file in [`coverage/`](coverage/) named:

```
coverage-YYYY-MM-DD-publication-short-handle.md
```

It contains:

1. **Citation.** Title, author, publication, date, and a stable URL.
2. **Summary.** A short, neutral description of what was said about
   the project.
3. **Accuracy notes.** Anything we believe to be inaccurate, with a
   link to the canonical document that demonstrates the accurate
   position.
4. **Action taken.** Whether a correction was requested, and the
   response.
5. **Lesson.** What, if anything, this coverage suggests we should
   improve in our own materials.

## Corrections

When coverage is materially inaccurate:

1. **Decide whether to act.** Minor framing differences are not worth
   the friction of a correction request. Material misstatements about
   what the project is, does, or claims are.
2. **Write the request.** Cite the canonical document, request a
   specific correction, and offer a brief, accurate alternative.
3. **Be patient and proportionate.** We do not escalate, threaten, or
   pressure. If the publication declines, we record that and move on.
4. **Update our own materials.** If the misstatement was a reasonable
   reading of our own copy, we improve the copy in
   `FORGEJO-SOCIETY-PROMOTION/` rather than only blaming the writer.

## Append-only

Coverage entries are not retroactively edited to flatter the project.
Updates are added as dated follow-up sections within the same file.

## Status

Scaffold. The first coverage entry is logged the first time the project
is described in public by someone outside the maintainer group.
