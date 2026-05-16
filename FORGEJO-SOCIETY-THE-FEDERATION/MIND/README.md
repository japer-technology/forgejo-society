# The Federation Mind

> The forge is the mind. The repo is an agency. The society thinks.

This folder declares the **society of minds** that the root Forgejo Society
delegates pillar-shaped responsibilities to, once
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../README.md) is successfully launched as
the root society.

The model, in one paragraph:

> The Federation is the root society. Each top-level pillar of the project
> (publicity, promotion, setup, …) is, in turn, run by its own *society of
> minds* — a small federation of Forgejo repositories wired together through
> the same channel/bridge/censor protocol the Federation uses for any other
> inter-society call (see
> [`FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md)).
> The files in this folder are the **wiring diagram** for those sub-societies:
> which repos belong, what role each plays, and how they connect to one
> another and back to the Federation root.

## What this folder is

`FORGEJO-SOCIETY-THE-FEDERATION/MIND/` is the Federation's view of *who runs
what*. Each subfolder names a pillar and contains:

- a `README.md` describing the pillar-society and its purpose,
- a `society.yml` declaring the sub-society's identity, role, owner, and the
  set of member repos that compose it,
- a `repos/` folder with one declarative file per member repo, and
- a `wiring/` folder declaring the channels that wire the member repos to
  each other and back to the Federation root.

## What this folder is not

- It is **not** the runtime mind. Cognitive content and runtime state for the
  Federation itself live in the two operational targets defined by the plan
  (`.forgejo-society/` and `.forgejo/workflows/forgejo-society.yaml`).
- It is **not** a duplicate of the pillar specifications. The publicity
  *strategy* lives in
  [`FORGEJO-SOCIETY-PUBLICITY/`](../../FORGEJO-SOCIETY-PUBLICITY/README.md);
  this folder names the *society of repos* that will, once launched, carry out
  that strategy on the Federation's behalf.
- It is **not** a finished deployment. Each `society.yml` is a planning
  declaration. Real activation requires a `channels/<peer>/` directory under
  the runtime `.forgejo-society/` of every participating society, per the
  plan's two-target collapse rule.

## Pillars currently declared

| Pillar | Status | Folder |
|---|---|---|
| Publicity | scaffold | [`PUBLICITY/`](PUBLICITY/README.md) |

Additional pillars (Promotion, Setup, Introduction, Precursor, …) follow the
same shape and are added incrementally as the Federation delegates them.

## Conventions

- **One folder per pillar.** The folder name matches the corresponding
  top-level `FORGEJO-SOCIETY-<PILLAR>/` folder, in upper-case.
- **Markdown plus YAML.** Narrative lives in Markdown; declarative wiring
  lives in YAML so it is parseable by the same `lifecycle/lib/forgejo.ts`
  adapter that consults the runtime `channels/` registry.
- **Every repo is a society.** A "member repo" listed here is itself a
  Forgejo Society with its own `.forgejo-society/` and workflow. The wiring
  files describe how those societies talk to each other, not how any one of
  them thinks internally.
- **Presence-is-permission.** A pillar listed here is *declared*; it is
  *active* only once the matching `channels/<peer>/` directories exist on
  both sides under their respective runtime `.forgejo-society/`.

## Recursion: when a member spawns its own sub-society

The shape declared in this folder is **fractal**. Any member repo of any
society (this folder's pillars, or any sub-society they themselves declare)
MAY in turn declare its own `MIND/<id>/` folder using the *same* shape:
`society.yml` + `repos/` + `wiring/`. There is no separate "sub-sub" schema;
recursion just reuses this one at the next level down.

The Federation only ever talks to a sub-society's presenter. What lives
behind that presenter is the sub-society's own concern — including whether
it is itself a federation of further repos. From any parent's point of view,
a child sub-society is always a single endpoint.

### When to spawn (the heterogeneity test)

Spawn a sub-society from a member repo only when its remit decomposes into
two or more *independently governed* responsibilities — i.e. they need
different **authority levels** (per
[`THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)),
different **censors**, or different **lead agencies**, and a single repo
would have to pretend they are the same.

Stay a single repo when the work is one remit, one authority profile, one
censor profile — even if it has many files. **Federate for governance
heterogeneity, not for size.**

### Two failure modes to avoid

- **Premature federation.** Spawning a sub-society for a member whose work
  is genuinely one remit. Symptom: every lateral message becomes a
  settlement, latency and audit overhead grow, no governance benefit is
  unlocked.
- **Hidden federation.** A member that *should* be a sub-society but is
  crammed into one repo. Symptom: one repo registers multiple authority
  levels and multiple censor profiles for the *same* `services_in`. That is
  the signal to promote it.

### The `decomposition` field

Every file in a `repos/` folder MUST declare a `decomposition:` field with
exactly one of these values:

| Value | Meaning |
|---|---|
| `leaf` | This repo will not spawn a sub-society. Its `services_in` share one authority profile and one censor profile. |
| `presenter` | This repo is the parent's single conscious voice. It MUST be `leaf` by rule — recursion stops here so the presenter cannot be presented by something else. The only legal value when `role: presenter`. |
| `federated` | This repo is itself a sub-federation. It MUST contain a `MIND/<id>/society.yml` of the same shape as this folder, and that sub-society MUST itself name a presenter. |

Lint rule (planned, by the same adapter that reads `channels/`):

- `role: presenter` ⇒ `decomposition: presenter`.
- `decomposition: federated` ⇒ a `MIND/<id>/society.yml` exists in the
  member repo and lists at least one member with `role: presenter`.
- `decomposition: leaf` ⇒ no `MIND/` folder is present in the member repo.

### Naming under recursion

Dotted IDs simply append a segment per level — no new convention is needed:

- `sor.publicity` — pillar sub-society
- `sor.publicity.crisis` — member of the pillar
- `sor.publicity.crisis.legal-gate` — member of `crisis`'s own sub-society
- `sor.publicity.crisis.presenter` — the one voice `crisis` exposes upward
  to Publicity's presenter

The **uplink rule** that keeps this readable at any depth: *a sub-society's
presenter only ever talks to its parent's presenter.* A grandparent never
reaches inside a grandchild; every parent sees its children as flat.
