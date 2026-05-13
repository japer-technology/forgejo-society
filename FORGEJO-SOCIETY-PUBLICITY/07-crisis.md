# 07 — Crisis Communication

> Incident response, transparency, and recovery for the public-facing project.

A **crisis** for the publicity pillar is any event that materially
threatens the project's public trust or safety. This document defines
how the project communicates during such events. It is intentionally
short and conservative.

---

## What counts as a crisis

Examples include:

- A security incident affecting users or contributors of the project.
- An incident in which an agency, critic, or censor in
  `REPO/forgejo-intelligence/` behaves outside the bounds set by the
  specification, in a way that is publicly visible.
- A governance failure that becomes public before the project has
  resolved it internally.
- Public conduct by a maintainer or contributor, in the project's
  name, that conflicts with the project's stated values.

What does **not** count as a crisis:

- Negative coverage or critical opinions. Those are handled through
  [`05-coverage.md`](05-coverage.md) and, where appropriate,
  [`06-statements.md`](06-statements.md).
- Disagreements internal to the project that have not become public.
  Those are handled through governance.

## Principles for crisis communication

1. **Acknowledge quickly, even with little.** A short, honest
   acknowledgement that we are aware and investigating is better than
   silence.
2. **Tell the truth as we know it, and label uncertainty.** We do not
   speculate; we do not minimise.
3. **Centralise the record.** A single canonical statement file in
   [`statements/`](statements/) is the source of truth. Other surfaces
   link to it.
4. **Update on a stated cadence.** When we acknowledge, we say when
   the next update will arrive, and we keep that promise.
5. **Resolve in writing.** A crisis is closed by a final statement
   that describes what happened, what was done, and what the project
   will change as a result.

## Roles

- **Crisis lead.** A maintainer with `govern` authority who owns the
  external communication for the duration of the incident.
- **Author of record.** The crisis lead is the author of record for
  every statement issued under this protocol.
- **Reviewer.** At least one other maintainer reviews each statement
  before publication, except where speed is essential to user safety,
  in which case review happens immediately after.

## Authority

Crisis statements require `govern` authority to publish. This is the
only place in the publicity pillar where the normal `propose`/`act`
flow is short-circuited, and only for the duration of the incident.

## After-action

Within two weeks of a crisis being closed, the crisis lead opens a
pull request with:

- A timeline of what happened and when.
- A summary of what was communicated and when.
- Lessons learned, including changes to the specification, plan,
  setup, runtime, or this folder.
- Updates to relevant documents in this folder so the next crisis is
  handled better.

## Status

Scaffold. We hope to never use this protocol; we maintain it so that
if we must, we are not designing it under pressure.
