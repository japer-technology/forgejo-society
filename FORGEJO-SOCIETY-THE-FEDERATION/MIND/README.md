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
