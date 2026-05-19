# Forgejo Society: The Federation

> The root Forgejo Society for and by the creator in the spirit of Star Trek.

## What the Federation is

The Federation is the first Forgejo Society Eric Mourant brings up on his own
hardware. In practice it is the running forge produced by following
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../FORGEJO-SOCIETY-IMPLEMENTATION/README.md):
a self-hosted Forgejo on owned Ubuntu hardware (see
[`local-computer-hardware.md`](local-computer-hardware.md)), wired into a
society through the `.forgejo-society/` runtime target and the
`.forgejo/workflows/forgejo-society.yaml` workflow target defined by the plan.

The Federation is therefore not a metaphor or a separate project. It is the
concrete instance of Forgejo Society that the implementation plan produces
when it is carried out for the first time, with Eric as the human operator.

## What the Federation does

The Federation carries two distinct responsibilities at the same time:

1. **It speaks for this repository.** The publicity and promotion work that
   the wider `japer-technology/forgejo-society` repository describes —
   announcements, media relations, events, coverage, statements, crisis,
   recognition, metrics on the publicity side, and positioning, narratives,
   campaigns, press kit, style guide on the promotion side — is carried out
   by the Federation. The pillar folders living inside this directory
   ([`publicity/`](publicity/README.md), [`promotion/`](promotion/README.md),
   [`research/`](research/)) hold the strategy and source material the
   Federation uses to do that work.

2. **It is the design bureau for Minds.** When a human asks the forge for a
   new Mind, the Federation is where the shape of that Mind is designed
   before it is rolled out. See [`minds/`](minds/README.md) for the wiring
   diagrams.

The path to participating in the Federation, or in any Forgejo Society, is
unchanged from the rest of the project: install the Forgejo Intelligence
workflow into the repo you want to work in, configure it, then use it to
either join a society or create your own. Society minds and labour declared
inside the Federation become available to intelligences that connect to it.

## What a Mind is, and what an Intelligence is

The Federation is the first concrete worked example of two terms used
throughout the project, so it is worth stating them here precisely.

- **A Mind** is not a single repository. It is a coordinated **set of
  repositories** in the forge, each taking a different role inside the
  greater structure of one forged mind, wired together through the
  channel/bridge/censor protocol described in
  [`FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md`](../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md).
  Creating a Mind is therefore creating several repositories at once, in
  declared roles, with a single presenter as their voice.

- **An Intelligence** is the human's interface to forged Minds. A human takes
  an existing repository, drops a Forgejo Intelligence into it, and through
  that intelligence connects to one or more societies — joining them,
  participating in them, and using the labour those societies offer. The
  human stays in control; the intelligence is the channel.

In this model, Minds are made of repositories, Societies are governed
collections of Minds, and Intelligences are how humans reach them.

## The Federation as design bureau

Because the Federation is the first running instance, it is also where the
**standard shape of a Mind** is worked out. The wiring declared under
[`minds/`](minds/README.md) — `society.yml`, `repos/`, `wiring/`, the
single-presenter rule, the recursion rule, the `leaf` / `presenter` /
`federated` decomposition vocabulary — is the template that later Minds will
be rolled out from when humans request them through their intelligences.

A new Mind rolled into the forge on request follows that template:

- several repositories are provisioned in declared roles,
- one is named as the presenter and speaks for the Mind,
- the rest are wired to the presenter and to each other through declared
  channels,
- the whole set is owned by a human and reached by intelligences.

The Federation's `minds/` folder is the working bench where those templates
are designed, refined, and recorded before they leave this repository as
standard repo-sets the forge knows how to roll out.

## Status

The Federation is **declared and being built**. The pillar folders under
this directory describe the work the Federation is responsible for; the
`minds/` folder describes the shape of the Minds that work runs on top of.
Activation of any individual pillar Mind requires the steps listed in its
own `society.yml` and in
[`FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md`](../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md).

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>
