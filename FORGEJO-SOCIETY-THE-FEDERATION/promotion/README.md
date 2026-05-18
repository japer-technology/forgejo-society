# Forgejo Society: Promotion

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> The forge is the mind. The repo is an agency. The society thinks.

This directory holds **world-class promotional materials** for the Society of
Repo and the wider Forgejo Society project. It is the home for the public
voice of the project: the words, images, narratives, and campaigns that carry
the idea outward to maintainers, researchers, operators, and the curious
public.

If you are looking for the project itself, start with the
[repository overview](../README.md) and the
[introduction](../FORGEJO-SOCIETY-INTRODUCTION/README.md). For the
specification of the mind being promoted, see
[`THE-SOCIETY-OF-REPO/`](../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md).

---

## What this folder is

`FORGEJO-SOCIETY-PROMOTION/` is the **promotion pillar** of the project. It is
where we decide, in writing, *how* Forgejo Society is described to the world
and *through which channels* that description travels. It is intentionally
separated from the introduction (which teaches), the plan (which designs),
the setup (which installs), and the runtime code (which runs).

It contains:

- **Strategy** — positioning, audiences, narratives, channels, campaigns.
- **Reusable copy** — taglines, blurbs, abstracts, social posts, press
  boilerplate.
- **Visual identity** — logo usage, palette, typography, diagram conventions,
  and the source-of-truth assets that other surfaces reuse.
- **Press and outreach** — press kit, FAQ, talk abstracts, slide outlines.
- **Style** — voice, tone, terminology, and the rules that keep the project's
  public language coherent across surfaces.

## What this folder is not

- It is **not** a marketing department in disguise. Promotion here serves the
  project's substance, not the other way around. If a claim cannot be backed
  by `THE-SOCIETY-OF-REPO/`, the plan, or the runtime, it does not belong in
  promotional copy.
- It is **not** runtime code or agent manifests. Nothing in this folder is
  executed by `.forgejo/workflows/forgejo-society.yaml` or read by agencies.
- It is **not** the introduction. The introduction is the on-ramp for new
  readers inside the repo. Promotion is the outward voice that brings new
  readers *to* the repo.
- It is **not** governance. Decisions about what the project *is* live in
  `THE-SOCIETY-OF-REPO/01-governance/` and the plan; promotion describes
  those decisions, it does not make them.

---

## How this folder is organised

The folder follows the same convention as
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../FORGEJO-SOCIETY-IMPLEMENTATION/README.md) and
[`FORGEJO-SOCIETY-INSTALLATION/`](../FORGEJO-SOCIETY-INSTALLATION/README.md): a numbered
sequence of strategy documents at the top level, plus a small set of topic
subfolders for the working materials those strategies produce.

### Strategy documents (read in order)

| Document | Purpose |
| --- | --- |
| [00-overview.md](00-overview.md) | What promotion means for this project, and the principles that govern it. |
| [01-positioning.md](01-positioning.md) | Positioning statement, taglines, one-liners, and elevator pitches. |
| [02-audiences.md](02-audiences.md) | Audience segments and tailored value propositions. |
| [03-narratives.md](03-narratives.md) | Core narratives and key messages, with proof points. |
| [04-channels.md](04-channels.md) | Distribution channels: web, social, talks, papers, federation. |
| [05-campaigns.md](05-campaigns.md) | Campaign plans, launch sequences, and editorial calendar. |
| [06-visual-identity.md](06-visual-identity.md) | Logo, palette, typography, diagram conventions, asset rules. |
| [07-press-kit.md](07-press-kit.md) | Press kit contents, project boilerplate, contact protocol, FAQ. |
| [08-style-guide.md](08-style-guide.md) | Voice, tone, terminology, capitalisation, and review rules. |
| [09-metrics.md](09-metrics.md) | What we measure, how we learn, and how promotion feeds the cognitive loop. |

### Working subfolders

| Folder | Contents |
| --- | --- |
| [`assets/`](assets/README.md) | Source-of-truth visual assets: logos, images, diagrams. |
| [`messaging/`](messaging/README.md) | Reusable copy blocks: taglines, blurbs, abstracts. |
| [`talks/`](talks/README.md) | Talk abstracts, slide outlines, demo scripts. |
| [`press/`](press/README.md) | Press releases, media inquiries, boilerplate. |
| [`social/`](social/README.md) | Social posts, threads, banner copy. |
| [`web/`](web/README.md) | Landing-page copy, README badges, link cards. |

---

## Conventions

- **Markdown only at the spec layer.** Strategy, messaging, and copy live as
  plain Markdown so they are reviewable through the same pull-request
  workflow as the rest of the project.
- **Single source of truth.** Each tagline, claim, or asset has exactly one
  canonical location in this folder. Other surfaces (the root `README.md`,
  the introduction, external sites) link or quote from here, not the other
  way around.
- **No unverified claims.** Every promotional claim must be traceable to a
  document under `THE-SOCIETY-OF-REPO/`, `FORGEJO-SOCIETY-IMPLEMENTATION/`,
  `FORGEJO-SOCIETY-INSTALLATION/`, or `REPO/forgejo-intelligence/`.
- **Voice.** The project speaks in a calm, precise, slightly literary
  register. Specifics over slogans. Mechanisms over mystique. See
  [`08-style-guide.md`](08-style-guide.md).
- **Authority.** Promotion is `propose`-level work: anyone may draft, but
  changes are reviewed against the governance and authority rules in
  `THE-SOCIETY-OF-REPO/01-governance/`.

---

## Status

This folder is **scaffold-only** at first commit. Each document and subfolder
README states its purpose and the shape of the content it will hold; the
content itself is filled in incrementally through normal pull requests as the
project's public voice matures.
