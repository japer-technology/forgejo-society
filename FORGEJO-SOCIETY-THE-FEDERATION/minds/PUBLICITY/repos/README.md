# MIND / Publicity / repos

One file per member repo of the Publicity sub-society. Each file declares:

- the repo's stable id (`sor.publicity.<member>`),
- the Forgejo repository path (`japer-technology/<repo-name>`),
- the publicity strategy document the repo implements,
- the lead agency family inside the repo (per
  [`FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md`](../../../../FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md)),
- a `decomposition:` field — `leaf`, `presenter`, or `federated` — recording
  whether the repo spawns its own sub-society (per the recursion rule in
  [`../../README.md`](../../README.md#recursion-when-a-member-spawns-its-own-sub-society)),
- the inbound services the repo exposes to the rest of the sub-society
  (mirrors the runtime `services/` folder), and
- the outbound channels the repo expects to call (mirrors the runtime
  `channels/` folder).

The actual wiring — which call goes through which bridge under which censor
budget — lives one level up in
[`../wiring/channels.yml`](../wiring/channels.yml). These per-repo files
declare what each repo *publishes and consumes*; the wiring file declares
which subscriptions the sub-society actually permits.

## Index

| Member | File | Decomposition | Implements |
| --- | --- | --- | --- |
| Presenter | [`presenter.yml`](presenter.yml) | `presenter` | [`00-overview.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/00-overview.md), [`01-principles.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/01-principles.md) |
| Announcements | [`announcements.yml`](announcements.yml) | `leaf` | [`02-announcements.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/02-announcements.md) |
| Media relations | [`media-relations.yml`](media-relations.yml) | `leaf` (candidate to spawn) | [`03-media-relations.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/03-media-relations.md) |
| Events | [`events.yml`](events.yml) | `leaf` (candidate to spawn) | [`04-events.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/04-events.md) |
| Coverage | [`coverage.yml`](coverage.yml) | `leaf` | [`05-coverage.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/05-coverage.md) |
| Statements | [`statements.yml`](statements.yml) | `leaf` | [`06-statements.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/06-statements.md) |
| Crisis | [`crisis.yml`](crisis.yml) | `leaf` (strong candidate to spawn) | [`07-crisis.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/07-crisis.md) |
| Recognition | [`recognition.yml`](recognition.yml) | `leaf` | [`08-recognition.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/08-recognition.md) |
| Metrics | [`metrics.yml`](metrics.yml) | `leaf` | [`09-metrics.md`](../../../../FORGEJO-SOCIETY-PUBLICITY/09-metrics.md) |
