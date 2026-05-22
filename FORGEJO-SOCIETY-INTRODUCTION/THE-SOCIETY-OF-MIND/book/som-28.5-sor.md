# Section 28.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.5.md](som-28.5.md) — *The mind and the
world* (Minsky, §28.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.5 dissolves the mind–body problem with one sentence — *minds are
simply what brains do* — and then makes the operational consequence
explicit: a mind is the pattern of *transitions between states*, not
the substance of the states themselves. This is why a society of
agents can be understood without knowing what its agents are made of:
what matters is how each agent changes state in response to its
previous state and the states of the agents it connects to.

---

## The ideas Section 28.5 actually carries

Pulled from Minsky's text:

1. **We live in several realms simultaneously.** Physical objects,
   social entities, and psychological entities all obey apparently
   different laws.
2. **A mind is what a brain does.** Mind is process, not stuff.
3. **The mind/body separation is real but not metaphysical.** It is
   the felt distance between *states* and *relationships between
   states*.
4. **State substrate is irrelevant if state transitions are
   equivalent.** Two systems with the same state-transition structure
   compute the same mind, regardless of what their parts are.
5. **Substance-questions are the wrong questions.** What an agent *is*
   (colour, size, weight) matters less than *what it does and what it
   is connected to*.
6. **Connectivity carries the mind.** The structure of links among
   agents is the load-bearing part.

---

## What the implementation already absorbs

### Mind as what the body does (idea 2)

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
states the architecture in §28.5's grammar: *"The workflow is the
body. The folder is the mind."* The workflow does not contain
cognitive content; the folder is not executed. The mind is constituted
by what the workflow *does to* the folder over time. This is the
section's central claim, embodied as a deployment topology.

### Process, not stuff (idea 2, idea 4)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is a sequence of named transitions: *perceive → activate → deliberate
→ criticize → censor → settle → act → remember → report*. Each phase
is a *state transition*, written into `state/runs/<run_id>/...`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The visible history of the society in `git log .forgejo-society/` is
literally the history of its state transitions.

### Substrate-independence (idea 4)

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
declares that the choice of LLM provider, model, or vendor SDK is "out
of scope" and lives in a runtime config file. This is the §28.5
move at engineering scale: the *substance* of the agents (which model
provider, which runtime image) is intentionally decoupled from the
*transitions* (what each agency emits, how settlement composes
them). Two configurations with different substrates and equivalent
transitions are the same mind.

### Connectivity carries the load (idea 6)

The polynemes / K-lines / frames machinery in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the typed-link memory in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(per
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
make connectivity first-class. Records carry `supersedes`,
`derived_from`, `contradicts`, `cites`, `reinforces`, `analogous_to`,
`learned_from` links. The shape of the graph *is* the structure of
the mind in §28.5's sense.

### Several realms (idea 1)

The plan distinguishes its realms in a clean way: `state/` is the
runtime trace (physical-realm equivalent — what *happened* in this
runner), `workspace/` is current attention (social-realm equivalent —
who is responsible for what now), `memory/` is the consolidated
record (psychological-realm equivalent — meanings, frames, K-lines,
decisions). The three trees in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
are the §28.5 three-realm decomposition, operationalised.

---

## What the implementation does not yet take into account

### A — The "mind = transitions" claim is not stated explicitly

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)'s
"workflow is the body, folder is the mind" line is correct but
incomplete: §28.5 would add that the mind is *the change the body
makes to the folder*. A short clause to that effect — say, "and the
mind is what the workflow does to the folder" — would close the
metaphor.

### B — State equivalence has no operational test

§28.5 implies that two societies whose state-transition structures
match would be the same mind. The plan does not currently have a
notion of *trace equivalence* — no way to replay a stimulus through
two configurations and assert that their state transitions matched
(beyond the substrate). The forgejo-conformance-test material under
[`FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/`](../../../FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/)
might eventually fill this role; it does not today.

### C — The three realms are not labelled as such

The three trees (`state/`, `workspace/`, `memory/`) are documented
side by side in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
without any framing that connects them to §28.5's physical / social
/ psychological realms. The decomposition is real; the connection is
not drawn.

### D — Inter-realm causality is not the focus of any document

§28.5's hardest claim is that the laws *across* realms look
inexplicable — the brick falls because pushed; the person leaves
because insulted. The plan has clear within-realm rules (write rules
for each tree, pipeline phases) but no document that traces a
*single* stimulus across realms: how a normalised event becomes an
attention item becomes a settlement becomes a durable memory. The
trace exists in the file system after a run; it is not narrated in
the planning documents.

### E — Substrate-independence is not yet a guarantee

While the model provider is "out of scope" per
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
the runtime does not enforce that an agency's manifest *cannot*
depend on a specific model's behaviour (a particular tokeniser, a
particular prompt-formatting quirk). §28.5's "substance does not
matter if transitions are equivalent" is the regulative ideal; the
plan does not yet check it.

### F — Several realms, single voice — the seam is unmarked

`agency.integration.conscious-presenter` is the sole producer of
visible text
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
This is the seam where many internal realms collapse into one
external utterance. §28.5 would predict the seam exists; the plan
makes it exist; neither names it as the place where the
multi-realm structure becomes single-realm.

---

## Summary table

| # | Idea from §28.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | We live in several realms simultaneously | Yes (operationally) | Three trees (`state/`, `workspace/`, `memory/`); not labelled as realms (gap C). |
| 2 | A mind is what a brain does | Yes | "Workflow is the body, folder is the mind" — partial statement (gap A). |
| 3 | Mind/body distance = state vs transitions | Partial | Pipeline + git log embody it; not stated (gap A). |
| 4 | Substrate-independence | Partial | Model provider out of scope; not enforced (gap E). |
| 5 | Substance-questions are wrong questions | Yes | Agents are manifests + steps; no claim about inner makeup. |
| 6 | Connectivity carries the mind | Yes | Typed relational links; polynemes; K-lines; frames. |
| — | Trace equivalence as identity test | No | No replay/compare facility (gap B). |
| — | Inter-realm causality narrated | No | Crosses-realms trace exists in files; not described (gap D). |
| — | Multi-realm → single-voice seam named | No | Conscious presenter is the seam; not framed that way (gap F). |

---

## Implication for the plan (no changes proposed here)

§28.5 is the section where the plan's architecture and Minsky's
philosophy line up most precisely: the workflow / folder split is
the §28.5 distinction made deployable. The gaps are almost all
linguistic — the plan implements the section's ideas without quoting
its terms. The most useful unforced opportunity is gap A combined
with gap C: a short paragraph in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
extending "the workflow is the body; the folder is the mind" with
"and the mind is the change the workflow makes to the folder over
time," together with a one-line mapping of the three trees onto
§28.5's three realms.

This is recorded here as analysis, not as a change request. Any move
to close gap B (trace equivalence) would touch
[`FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/`](../../../FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/)
and the state-and-memory document, and so falls under the "stop and
ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
