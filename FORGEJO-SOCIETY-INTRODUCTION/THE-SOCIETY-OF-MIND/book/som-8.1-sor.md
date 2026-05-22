# Section 8.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.1.md](som-8.1.md) — *K-lines: a theory of
memory* (Minsky, §8.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.1 is the section that introduces the K-line itself: the unit of
memory in Minsky's theory. Every later section in chapter 8 is a
refinement of this idea, so this analysis is the baseline against
which the rest of chapter 8 will be measured.

---

## The ideas Section 8.1 actually carries

1. **Knowledge is kept close to the agents that learn it.** Memory is
   not a separate store; it is a wire attached to the agents that
   were active when the lesson was learned.
2. **The K-line is an agent of a particular kind.** It is not data;
   it is a *wirelike structure*, itself something that can be
   activated and that activates others.
3. **Recording = listing the active agents.** "Making a K-line is
   like making a list of the people who came to a successful party."
   No interpretation, no summary — just a record of who was on.
4. **Reactivation = restoring the mental state.** Turning the K-line
   on rearouses its attached agents, putting the mind into a state
   *like* the one that solved the original problem.
5. **One agent, many K-lines.** Each agent can be tagged by several
   K-lines (several paint colours on one tool). Memory is not
   exclusive ownership.
6. **Selectivity is required.** Painting *every* tool red is
   useless; the wrench that did not fit must not be marked. K-lines
   need a discipline about *what to attach to*, not just *how*.
7. **Knowledge represented, stored, retrieved, used — all at once.**
   The point of the theory is that these four questions stop being
   separable when memory is co-located with the agents that use it.

---

## What the implementation already absorbs

### K-line as first-class structure (ideas 1, 2, 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes K-lines a first-class file type with their own schema, their
own directory tree under `memory/klines/<class>/`, and a defined
reactivation step in `klines.ts`. The reactivation procedure is
explicit: compute similarity against `restore_when`, boost the
activation of every agency in `activation_snapshot`, preload
`useful_context.files_read`. This is exactly Minsky's "rearouse the
agents attached to the K-line."

### Recording the active configuration (idea 3)

The `activation_snapshot.active_agencies` field in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is the list of party-goers. It records which agencies were active at
the moment of the settled solution, with weights. The plan does not
attempt to summarise or compress that list at write time; the
archivist captures it as-is. This is the discipline Minsky asks for.

### Co-location of knowledge and use (idea 7)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keeps K-lines in the same `memory/` tree as the procedures, frames,
analogies, and decisions they relate to, with typed `linked:` fields
joining them (per
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)).
There is no separate "knowledge base"; the agencies that read K-lines
on activation are the same agencies that write into the workspace.

### Multi-attachment (idea 5)

K-line records reference agencies by id, not by exclusive ownership.
Any number of K-lines may name the same agency in their
`activation_snapshot`, and the runtime imposes no cardinality
constraint. The same agency may be a "red tool" and a "blue tool"
simultaneously.

### Selectivity at write time (idea 6, partial)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
restricts K-line writing: only the `archivist` writes, only at the
`remember` phase, and only when the settlement outcome was `success`
or `partial`, *and* at least one slot was filled by a non-trivial
agency, *and* the useful context is non-empty. This is the plan's
answer to "do not paint the wrench red."

---

## What the implementation does not yet take into account

### A — Reactivation produces a *state like* the original, not a duplicate

Minsky's claim (idea 4) is that the new state is *much like* the one
that solved the original problem. The plan's reactivation step boosts
activation weights and preloads files; it does not check that the
resulting state actually resembles the prior winning configuration.
There is no similarity post-condition on the activated society after
the K-line has fired. A K-line that nominally matches `restore_when`
but cannot actually re-aroused its attached agencies (because some
have since been retired or renamed) will silently produce a degraded
state.

### B — Failure-as-information is partially absorbed

The wrench-that-did-not-fit case (idea 6) is recorded — failed
settlements are written to `memory/failure/` and closed-without-merge
branches to `memory/failure/rejected-candidates/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
However, *partial* successes do generate K-lines, and there is no
field on the K-line itself recording which tools-or-agencies were
tried and *rejected* during that partial success. The K-line carries
only the agents that contributed; it does not carry the negative
list. A future reactivation cannot inherit "do not call X again for
this kind of stimulus."

### C — K-lines as agents that can themselves be on or off

Minsky is explicit: a K-line *is* an agent. In the plan, K-lines are
YAML records, not manifest-bearing units; they have no
`activates_on:` or `outputs:` field, no authority level, no place in
the agency family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
They are *data consulted by* `klines.ts`, not entities that the
society addresses. This is a deliberate engineering simplification;
it is also a departure from Minsky's framing.

### D — "Memory close to the agents that learn it" is structural, not local

The plan keeps K-lines in `memory/klines/<class>/`, organised by
*stimulus class*, not by the agency that learnt them. There is no
per-agency `lessons/` directory; an agency does not own its memory.
Idea 1's "close to the agents that learn it" is honoured at the
*society* level (everything lives in the same `.forgejo-society/`
tree) but not at the *agency* level (an agency cannot read "my own
prior lessons" without scanning the class index).

### E — The four questions are answered jointly, but not measured jointly

Idea 7 says representation, storage, retrieval, and use *cannot be
separated*. The plan keeps them in one tree, but the
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
table measures each separately. There is no test that asks "does
this K-line still serve all four roles?" — only file-by-file checks.
A K-line could be representationally valid, storage-valid, and
retrieval-valid yet useless at point of use, and the plan would not
catch it.

---

## Summary table

| # | Idea from §8.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Knowledge close to the agents that learn it | Partial | One tree at society level; not per-agency (gap D). |
| 2 | K-line is itself an agent | No | K-lines are YAML records, not manifests (gap C). |
| 3 | Recording = listing active agents | Yes | `activation_snapshot.active_agencies` captures the list. |
| 4 | Reactivation restores a *similar* state | Partial | Boosts weights and preloads context; no similarity post-check (gap A). |
| 5 | One agent attached to many K-lines | Yes | No cardinality limit on agency references. |
| 6 | Selectivity at write time | Partial | Successful/partial gate exists; rejected-tool list absent (gap B). |
| 7 | Represent / store / retrieve / use, jointly | Partial | Co-located but measured separately (gap E). |

---

## Implication for the plan (no changes proposed here)

§8.1 is the K-line theory in its rawest form. The plan absorbs the
mechanism cleanly — schema, writer, reactivator, retention — and the
multi-attachment and selectivity disciplines. The gaps are
characteristic: the plan treats K-lines as *data the runtime uses*,
whereas Minsky treats them as *agents that fire*. Closing that gap
would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the K-line schema and reactivation step in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the identity scopes in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
