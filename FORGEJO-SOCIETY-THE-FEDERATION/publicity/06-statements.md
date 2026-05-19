# 06 â€” Statements

> How the project issues official public statements and responds to questions.

A **statement** is a public communication issued in the project's name in
response to an external event, question, or controversy. Statements are
distinct from announcements: an announcement says *what we did*; a
statement says *what we think* or *how we are responding*. Statements
live in [`statements/`](statements/README.md).

---

## When to issue a statement

A statement is appropriate when:

- The project is asked, in public, a question that deserves an
  on-the-record answer.
- The project is named in coverage that requires a response beyond a
  coverage-log entry and a correction request.
- An external event materially affects how the project operates (for
  example, an upstream Forgejo policy change).
- A peer project, sibling society, or contributor has done something
  that the project wants to publicly support or distance itself from.

A statement is **not** appropriate for:

- Routine announcements (use [`02-announcements.md`](02-announcements.md)).
- Technical bug reports (use the issue tracker).
- Emotional reactions to social-media discussion.

## Format

Each statement is a Markdown file in [`statements/`](statements/) named:

```
statement-YYYY-MM-DD-short-handle.md
```

It contains:

1. **Title.** A neutral, descriptive H1.
2. **Date and author of record.**
3. **Context.** What the project is responding to, with links to the
   originating event or coverage.
4. **Position.** The project's position, in the calm register of the
   style guide. Specifics over slogans.
5. **What this changes.** Any concrete consequences for the
   specification, plan, setup, runtime, or governance â€” with links.
6. **What this does not change.** Explicit limits.
7. **Pointers.** Where to read more, and how to contact the project.
8. **Follow-ups.** Append-only section for related developments.

## Approval path

1. **Draft** â€” opened as a pull request adding the file to
   `statements/`. Authority required: `propose`.
2. **Review** â€” at least one maintainer review, with extra scrutiny of
   any claim about a third party.
3. **Voice check** â€” verified against
   [`../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../promotion/08-style-guide.md).
4. **Publication** â€” merging the pull request constitutes publication.
   Authority required: `act`.
5. **Crisis exception** â€” statements issued under the crisis protocol
   in [`07-crisis.md`](07-crisis.md) require `govern` authority and
   may be published before exhaustive review, with a follow-up review
   immediately after.

## Tone

Statements are short. They name the situation, take a position, and
stop. They do not editorialise about the broader industry, peer
projects, or the press.

## Status

Scaffold. The first statement is issued only when one is genuinely
needed; we do not manufacture statements to populate this folder.
