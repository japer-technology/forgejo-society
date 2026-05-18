# 02 — Announcements

> What constitutes an announcement, the format, and the approval path.

This document defines what the project considers an **announcement**, how
announcements are written, and how they are approved. The canonical
announcement files live in [`announcements/`](announcements/README.md).

---

## What is an announcement

An **announcement** is a public-facing statement, in the project's own
voice, that records a milestone the project wants the world to know about.
Examples include:

- A new pillar of the repository becoming stable.
- A significant change to the specification or governance.
- A first running surface (for example, the first activated workflow).
- A federation event with a sibling society.
- A formal release of a runnable component.

Internal updates, routine pull requests, and work-in-progress notes are
**not** announcements. Those are tracked in their respective pillars.

## Format

Each announcement is a single Markdown file in
[`announcements/`](announcements/) named:

```
announcement-YYYY-MM-DD-short-handle.md
```

It contains, in order:

1. **Title.** A single H1 in the project's voice.
2. **Date and author of record.** ISO date and a human name.
3. **Summary.** Two or three sentences readable on its own.
4. **What changed.** Specifics: links into `THE-SOCIETY-OF-REPO/`,
   `FORGEJO-SOCIETY-IMPLEMENTATION/`, `FORGEJO-SOCIETY-INSTALLATION/`, or
   `REPO/forgejo-intelligence/` that back the announcement.
5. **What it means.** Plain-language interpretation for a reader who is
   not already inside the project.
6. **What it does not mean.** Explicit limits: capabilities the
   announcement does *not* claim.
7. **Pointers.** Where to read more, and how to contact the project.
8. **Follow-ups.** A section that begins empty and is appended to over
   time as corrections or related news arrive. Each follow-up is dated.

## Approval path

1. **Draft** — opened as a pull request adding the file to
   `announcements/`. Authority required: `propose`.
2. **Review** — at least one maintainer review verifying every claim
   against the cited specification, plan, setup, or runtime.
3. **Voice check** — verifies the draft against the
   [promotion style guide](../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md).
4. **Publication** — merging the pull request constitutes publication.
   Authority required: `act`.
5. **Distribution** — links to the merged file are then shared on the
   channels described in
   [`../FORGEJO-SOCIETY-PROMOTION/04-channels.md`](../FORGEJO-SOCIETY-PROMOTION/04-channels.md).

## Cadence

There is no required cadence. Announcements are issued when the project
has something true and substantive to say, and not otherwise.

## Status

Scaffold. The first concrete announcement file will be added when the
first publicly significant milestone is ready.
