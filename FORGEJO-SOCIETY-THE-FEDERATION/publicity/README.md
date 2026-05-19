# Forgejo Society: Publicity

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> The forge is the mind. The repo is an agency. The society thinks.

This directory holds **world-class publicity materials** for the Society of
Repo and the wider Forgejo Society project. It is the home for the project's
**earned attention**: announcements, milestones, media relationships, public
appearances, recognition, and the public-facing record of how the project is
seen and discussed beyond its own repository.

If you are looking for the project itself, start with the
[repository overview](../README.md) and the
[introduction](../../FORGEJO-SOCIETY-INTRODUCTION/README.md). For the outbound
*voice* of the project â€” positioning, narratives, taglines, visual identity,
and reusable copy â€” see
[`FORGEJO-SOCIETY-PROMOTION/`](../promotion/README.md).

---

## Publicity vs. promotion

`FORGEJO-SOCIETY-PROMOTION/` and `FORGEJO-SOCIETY-PUBLICITY/` are deliberately
separate pillars with complementary jobs:

| Pillar | Question it answers | Primary artefacts |
| --- | --- | --- |
| `FORGEJO-SOCIETY-PROMOTION/` | *How do we describe ourselves?* | Positioning, narratives, taglines, visual identity, style guide, reusable copy. |
| `FORGEJO-SOCIETY-PUBLICITY/` | *How does the world come to know us, and how do we keep that record honest?* | Announcements, milestones, media relationships, event appearances, coverage log, public statements, recognition. |

Promotion is the project's **outbound voice**. Publicity is the project's
**earned attention** and the **public record** of how it is received. Each
pillar links to the other; neither duplicates the other.

---

## What this folder is

`FORGEJO-SOCIETY-PUBLICITY/` is the **publicity pillar** of the project. It
is where we plan, conduct, and document the project's interactions with the
outside world *as a public actor*: writing announcements, building
relationships with journalists and community publications, planning event
appearances, responding to public questions, and recording recognition the
project receives.

It contains:

- **Strategy** â€” what publicity means for this project, what we will and
  will not do, and how we measure honesty over reach.
- **Announcements** â€” the canonical record of public-facing milestones, in
  the project's own voice, dated and reviewable.
- **Media relations** â€” the media list, outreach protocols, embargo policy,
  and inquiry handling.
- **Events** â€” talks, demos, panels, podcasts, and other appearances, with
  their abstracts, recordings, and follow-up notes.
- **Coverage** â€” an honest, append-only log of how the project is described
  by others, with corrections where needed.
- **Public statements** â€” the project's official responses to questions,
  controversies, or significant external events.
- **Recognition** â€” awards, mentions, citations, and inclusions that the
  project has received.

## What this folder is not

- It is **not** marketing. Publicity here is in service of the project's
  substance and governance, not the other way around.
- It is **not** the place for taglines, narratives, or visual identity.
  Those live in
  [`FORGEJO-SOCIETY-PROMOTION/`](../promotion/README.md).
- It is **not** runtime code or agent manifests. Nothing in this folder is
  executed by `.forgejo/workflows/forgejo-society.yaml` or read by agencies.
- It is **not** the introduction. The introduction is the on-ramp for new
  readers inside the repo. Publicity is concerned with how the project is
  encountered *outside* the repo.
- It is **not** governance. Decisions about what the project *is* live in
  `THE-SOCIETY-OF-REPO/01-governance/` and the plan; publicity records and
  communicates those decisions, it does not make them.

---

## How this folder is organised

The folder follows the same convention as
[`FORGEJO-SOCIETY-PROMOTION/`](../promotion/README.md) and
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/README.md): a numbered
sequence of strategy documents at the top level, plus a small set of topic
subfolders for the working materials those strategies produce.

### Strategy documents (read in order)

| Document | Purpose |
| --- | --- |
| [00-overview.md](00-overview.md) | What publicity means for this project, and the principles that govern it. |
| [01-principles.md](01-principles.md) | Operating principles for honest, sustainable publicity. |
| [02-announcements.md](02-announcements.md) | What constitutes an announcement, the format, and the approval path. |
| [03-media-relations.md](03-media-relations.md) | How we build and maintain relationships with journalists and publications. |
| [04-events.md](04-events.md) | Talks, demos, podcasts, panels: how we choose them, prepare for them, and follow up. |
| [05-coverage.md](05-coverage.md) | How we log external coverage, request corrections, and learn from how we are described. |
| [06-statements.md](06-statements.md) | How the project issues official public statements and responds to questions. |
| [07-crisis.md](07-crisis.md) | Crisis communication: incident response, transparency, and recovery. |
| [08-recognition.md](08-recognition.md) | How we record awards, mentions, citations, and inclusions. |
| [09-metrics.md](09-metrics.md) | What we measure, how we learn, and how publicity feeds the cognitive loop. |

### Working subfolders

| Folder | Contents |
| --- | --- |
| [`announcements/`](announcements/README.md) | Dated public-facing announcements in the project's own voice. |
| [`coverage/`](coverage/README.md) | Append-only log of external coverage, with links and notes. |
| [`events/`](events/README.md) | Talk and event records: abstracts, recordings, follow-ups. |
| [`media-list/`](media-list/README.md) | Outlets, journalists, and community publications we work with. |
| [`statements/`](statements/README.md) | Official public statements and responses to external events. |
| [`recognition/`](recognition/README.md) | Awards, mentions, citations, and inclusions. |

---

## Conventions

- **Markdown only at the spec layer.** Strategy, announcements, statements,
  and logs live as plain Markdown so they are reviewable through the same
  pull-request workflow as the rest of the project.
- **Single source of truth.** Each announcement, statement, or recorded
  piece of coverage has exactly one canonical location in this folder.
  Other surfaces link or quote from here, not the other way around.
- **No unverified claims.** Every publicity claim must be traceable to a
  document under `THE-SOCIETY-OF-REPO/`, `FORGEJO-SOCIETY-IMPLEMENTATION/`,
  `FORGEJO-SOCIETY-INSTALLATION/`, or `REPO/forgejo-intelligence/`. Promotional
  voice is governed by
  [`../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../promotion/08-style-guide.md);
  publicity inherits that voice.
- **Append-only history.** Once an announcement, statement, or coverage
  entry is published, it is amended through clearly dated follow-ups
  rather than silent edits. Corrections are first-class.
- **Honesty over reach.** We would rather be accurately described to a
  small audience than memorably mis-described to a large one.
- **Authority.** Publicity is `propose`-level for drafts, `act`-level for
  publication of announcements and statements, and `govern`-level for
  crisis communications. See
  `THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`.

---

## Status

This folder is **scaffold-only** at first commit. Each document and subfolder
README states its purpose and the shape of the content it will hold; the
content itself is filled in incrementally through normal pull requests as the
project earns attention and builds public relationships.
