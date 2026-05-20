# Forgejo Society Labour: Webpages

> A Labour that serves static websites out of repositories on a self-hosted
> Forgejo, in the same shape as
> [Sqcows/pages-server](https://github.com/Sqcows/pages-server), but expressed
> as a Forgejo Society Labour unit rather than as a Traefik plugin.

This document is a **specification of intent**. It describes what the
`labour.repo.webpages.*` family of units does, what it consumes, what it
produces, and where the maintainer keeps control. No code in this folder is
runnable today; nothing in this directory installs anything.

The wider boundary, envelope, and surface model used below is defined in
[`External-Execution-Interfaces.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/analysis/External-Execution-Interfaces.md)
and must be read alongside this file. This document only adds the
Webpages-specific particulars.

---

## 1. Purpose

`labour.repo.webpages` exposes the static content of repositories in the
Society as web pages, served from a self-hosted edge that the maintainers
operate. It is the Society's equivalent of "Pages": one Labour family that
turns a `public/` folder and a `.pages` configuration file into a reachable
URL.

It exists for three concrete reasons:

1. To give every member Repo a default place to publish documentation,
   landing pages, dashboards, and prose without standing up a separate web
   stack per Repo.
2. To keep that publication path inside the same governance model as the
   rest of the Society: manifest entry, authority level, runner label, kill
   switch.
3. To make the operating contract explicit, so a Repo can choose to publish
   without delegating policy to a third-party plugin.

Out of scope: dynamic applications, server-side rendering, build pipelines
for arbitrary site generators (those are separate Labour units that may
produce a `public/` folder which this Labour then serves).

## 2. Inspiration and divergence from `pages-server`

[Sqcows/pages-server](https://github.com/Sqcows/pages-server) is a Traefik
middleware plugin that serves `public/` folders from Forgejo/Gitea
repositories with custom domains, HTTPS via Let's Encrypt, password
protection, redirects, and a Redis-backed router cache. Its semantics are a
good fit for the Society and most of its features map directly onto
Labour units.

Where the Society diverges:

| Concern | `pages-server` | Forgejo Society Labour |
| --- | --- | --- |
| Where capability is declared | Traefik static + dynamic configuration | A manifest entry under `.forgejo-labour/labour-manifest.md` |
| What turns a Repo into a site | Presence of `public/` and `.pages` | The same, plus an `act`-level call against `labour.repo.webpages.serve` |
| How calls are made | Implicit per HTTP request, mediated by Traefik | Explicit call envelope (issue, workflow, or federated event); HTTP serving is one downstream effect |
| Where state lives | Traefik + Redis | Git history of envelopes, plus the runner's own cache |
| Kill switch | Disable middleware in Traefik | Delete `.forgejo-labour/forgejo-labour-ENABLED.md`, remove manifest entry, or set `scope: private` |
| Custom domains | Redis-registered routers | Manifest field plus a settlement entry that records the domain in the Society's memory |

In short: `pages-server` answers "how do I make a `public/` folder reachable
through Traefik?" This Labour answers "how does the Society call, audit, and
revoke that capability?" The serving mechanics can be the same; the
authority and audit trail are different.

## 3. Repository requirements

For a Repo to be served by this Labour it must contain:

1. A `public/` folder of static files (HTML, CSS, JS, images, fonts, etc.).
2. A `.pages` file in the Repo root with the fields below.
3. An entry in `.forgejo-labour/labour-manifest.md` of scope `local` or
   `society` (see §6).

### 3.1 `.pages` file

The `.pages` file is YAML. Fields mirror `pages-server` and are extended
with Society-aware fields.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `enabled` | boolean | no | Master switch for the site. Default `true`. When `false`, every surface returns 404 and cached state for this Repo is cleared on the next call. |
| `custom_domain` | string | no | Public domain to serve from. Subject to DNS verification (see §3.2). |
| `enable_branches` | array of strings | no | Branch names that get sub-site URLs. Requires `custom_domain`. |
| `directory_index` | boolean | no | If `true`, serve `index.html` for directory URLs and optionally render Apache-style listings. |
| `password` | string | no | SHA-256 hash gating the main branch. |
| `branchesPassword` | string | no | SHA-256 hash gating non-main branches. |
| `error_pages` | string | no | `owner/repo` whose `public/` provides custom error documents. Falls back to the Society default. |
| `redirects` | string | no | Path within the Repo to a `.redirects` file. Defaults to `.redirects` in the Repo root. |
| `society_visibility` | enum | no | `private`, `local`, or `society`. Must be `<=` the manifest entry's `scope`. Allows a Repo to publish locally before federating. |

The shape is intentionally close to `pages-server` so existing `.pages`
files can be reused unchanged; the Society-specific fields are additive.

### 3.2 Custom domain verification

A `custom_domain` is only honoured after a DNS TXT record proves ownership.
The verification record is:

```
_forgejo-society-webpages.<custom_domain>  TXT  "labour.repo.webpages owner=<owner-id>"
```

Verification result is recorded as an event of type
`event.webpages.domain-verified.<n>` and persists in memory. Removing the
TXT record does not retroactively revoke the site, but the next refresh
call will require re-verification before accepting changes.

## 4. URL structure

Three URL patterns are supported, matching `pages-server`:

1. **Repository site** — `https://{user}.{pages_domain}/{repo}/`
   serves `{user}/{repo}/public/`.
2. **Profile site** — `https://{user}.{pages_domain}/`
   serves `{user}/.profile/public/`.
3. **Custom domain** — `https://{custom_domain}/`
   serves the Repo whose verified `custom_domain` matches.

`pages_domain` is a Society-level setting, configured once on the runner
that hosts the edge (see §8).

Directory index behaviour, redirect handling, and password gating follow
the rules described in `pages-server`'s README and are not restated here.

## 5. Labour units

The family decomposes into the following callable units. Each is one entry
in `.forgejo-labour/labour-manifest.md`.

### 5.1 `labour.repo.webpages.serve`

The long-lived unit that actually serves HTTP. Declared as a `kline` per
[`External-Execution-Interfaces.md` §5.4](../../../FORGEJO-SOCIETY-INTRODUCTION/analysis/External-Execution-Interfaces.md).

- **Inputs:** `{ repo: string, ref: string, public_path?: string }`.
- **Outputs:** `{ kline_id: string, base_url: string }`.
- **Runner:** label `webpages-edge`.
- **Authority required:** `act`.
- **Lifecycle:** `kline`. First call materialises the site on the edge;
  subsequent calls refresh content. Termination closes the kline and
  removes the site from the edge.

### 5.2 `labour.repo.webpages.publish`

A one-shot unit that takes a commit SHA and refreshes the served content
for one Repo.

- **Inputs:** `{ repo: string, sha: string }`.
- **Outputs:** `{ refreshed: boolean, bytes_published: integer, pages: integer }`.
- **Runner:** `webpages-edge`.
- **Authority required:** `act`.
- **Trigger:** typically called by a Repo's Intelligence after a merge to
  the configured branch.

### 5.3 `labour.repo.webpages.register-domain`

Registers a `custom_domain` and records the verification event.

- **Inputs:** `{ repo: string, custom_domain: string }`.
- **Outputs:** `{ verified: boolean, expires_at?: string }`.
- **Runner:** `webpages-edge`.
- **Authority required:** `govern`. Custom domains are a Society-visible
  commitment and a possible identity surface; they sit above `act`.

### 5.4 `labour.repo.webpages.revoke`

Removes a site from the edge, clears its caches, and drops Traefik routers
or equivalent edge state.

- **Inputs:** `{ repo: string, reason: string }`.
- **Outputs:** `{ revoked: boolean }`.
- **Runner:** `webpages-edge`.
- **Authority required:** `act`. A `govern`-level call is required if the
  Repo holds a verified `custom_domain`.

### 5.5 `labour.repo.webpages.audit`

Read-only. Reports what is currently served, from which commit, with which
configuration.

- **Inputs:** `{ repo?: string, custom_domain?: string }`.
- **Outputs:** `{ entries: array }` where each entry includes
  `repo`, `sha`, `custom_domain?`, `enabled`, `last_published_at`.
- **Authority required:** `read`.

## 6. Manifest entry shape

A minimal manifest stanza for a Repo that wants both serving and refresh
on this Labour:

```
id: labour.repo.webpages.serve
scope: society
entrypoint: .forgejo-labour/repo/webpages/serve.workflow
inputs:  { repo: string, ref: string, public_path?: string }
outputs: { kline_id: string, base_url: string }
runner: webpages-edge
authority required: act
review policy: intelligence-review
lifecycle: kline
```

`entrypoint` is a workflow path because the actual server process is
something the Forgejo Actions runner brings up; the manifest does not embed
the server itself. The workflow path above is illustrative; nothing under
`.forgejo-labour/repo/webpages/` is executable today.

## 7. Surfaces

All four surfaces from
[`External-Execution-Interfaces.md` §5](../../../FORGEJO-SOCIETY-INTRODUCTION/analysis/External-Execution-Interfaces.md)
apply unchanged. The Webpages Labour adds no new surface and inherits the
standard call/result envelope without extension.

In practice:

- **Surface A (In-Repo).** A Repo's Intelligence calls
  `labour.repo.webpages.publish` after a merge to refresh the site.
- **Surface B (Issue/PR).** A maintainer comments `/labour
  labour.repo.webpages.audit { repo: "owner/site" }` on an issue to inspect
  state.
- **Surface C (Federated).** Another Repo in the Society calls
  `labour.repo.webpages.publish` to ask the edge-owning Repo to refresh
  one of its sites. The call is rejected unless the target Repo's manifest
  has marked the unit `scope: society`.
- **Surface D (kline).** `labour.repo.webpages.serve` is the kline that
  represents an active site on the edge.

## 8. Edge and runner topology

The Labour is intended to run on a small number of runners labelled
`webpages-edge`. A reasonable topology, matching the installation pillar's
fleet model:

- One or more `webpages-edge` runners host the actual web server (Traefik
  or any drop-in equivalent), terminate TLS, and hold the file cache.
- One Forgejo server is the authoritative source for `public/` content and
  for `.pages` files.
- The Society's runner registry decides which Repos may target the
  `webpages-edge` label.

The choice of Traefik as the edge implementation is reasonable but not
mandated by this Labour. Any edge that can serve files from a working
directory, honour `.redirects`, and accept a verification challenge for
custom domains is compatible. The Labour contract is the manifest plus the
call envelope; the edge process is an implementation detail of the runner.

## 9. Authority and kill switch

The Webpages Labour inherits the safety model from §6 of
[`External-Execution-Interfaces.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/analysis/External-Execution-Interfaces.md).
The Repo-side, site-side, and Society-side switches are:

- **Per call:** the `.forgejo-labour/forgejo-labour-ENABLED.md` sentinel
  must exist on the Repo that owns the Labour entry.
- **Per site:** `enabled: false` in the Repo's `.pages` file. The next
  publish or serve call clears the edge state for that site.
- **Per unit:** demote the manifest `scope` to `private`. Federated calls
  fail-closed immediately; in-Repo calls keep working.
- **Per Repo:** remove the manifest entry, or remove `.forgejo-society/`
  to leave the Society entirely.

Custom-domain revocation requires `govern` authority because a stale
domain pointing at the wrong content is a public-facing risk.

## 10. Memory and audit

Each Webpages call produces the standard call and result envelopes, both
committed to git. In addition:

- **Domain verifications** are recorded as
  `event.webpages.domain-verified.<n>` events, with `event.metadata.sor_id`
  set to the owning society.
- **Site activations** are recorded as
  `event.webpages.site-activated.<n>` events.
- **Revocations** are recorded as
  `event.webpages.site-revoked.<n>` events.

Long-lived custom domain commitments are also recorded as settlements
under `THE-SOCIETY-OF-REPO/07-workspace/active-settlements/` while the
domain is being negotiated and moved to
`THE-SOCIETY-OF-REPO/06-memory/decisions/` once accepted. This keeps the
Society's public identity surfaces auditable in the same way as any other
governance decision.

## 11. Failure modes the Labour must handle

Drawn from the practical concerns visible in `pages-server`:

- Missing `.pages` file or `enabled: false`: serve 404, clear edge caches
  for that site.
- Missing `public/` folder: serve 404; do not surface a directory listing
  of the Repo root.
- Custom domain present but unverified: refuse to register the router;
  emit a typed rejection in the result envelope.
- Password hash present but request unauthenticated: serve the
  Society-configured `error_pages/401.html` (or a built-in equivalent).
- Edge cache stale relative to the latest commit: any `publish` call
  resets the cache for the target Repo before returning.
- Redirect file exceeding the configured maximum number of rules: load up
  to the limit, log the truncation, emit a warning event.

None of these failure modes weaken the kill switch: in every case, the
sentinel and manifest still gate whether the Labour runs at all.

## 12. Status

This is a specification, not an implementation. Concretely:

- This folder contains only this `README.md`.
- No workflow file at `.forgejo/workflows/forgejo-labour-webpages.yaml`
  exists yet.
- The manifest file at `.forgejo-labour/labour-manifest.md` does not yet
  exist; when it is introduced, Webpages units will be one of its first
  entries.
- The `webpages-edge` runner label is not yet provisioned in
  [`FORGEJO-SOCIETY-INSTALLATION/`](../../../FORGEJO-SOCIETY-INSTALLATION/README.md).

Marking the unbuilt parts plainly keeps this document honest in the sense
required by the
[style guide](../../../FORGEJO-SOCIETY-THE-FEDERATION/promotion/08-style-guide.md):
what exists today is the contract and the design; the runners, the edge,
and the manifest are planned.

## 13. References

- [Sqcows/pages-server](https://github.com/Sqcows/pages-server) — the
  upstream Traefik plugin whose feature set this Labour mirrors.
- [`../../README.md`](../../README.md) — the Forgejo Society Labour pillar
  overview.
- [`../pages/README.md`](../pages/README.md) — the earlier one-line stub
  that this document supersedes for the "websites from repositories" case.
- [`External-Execution-Interfaces.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/analysis/External-Execution-Interfaces.md)
  — the call/result envelope, manifest model, and surfaces this Labour
  inherits.
- [`FORGEJO-SOCIETY-INSTALLATION/transition-plan/09-runner-scale-strategy.md`](../../../FORGEJO-SOCIETY-INSTALLATION/transition-plan/09-runner-scale-strategy.md)
  — the runner fleet model that the `webpages-edge` label will join.
