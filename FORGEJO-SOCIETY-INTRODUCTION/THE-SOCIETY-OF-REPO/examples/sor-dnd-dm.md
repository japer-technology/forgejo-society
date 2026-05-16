# SOR Example — Dungeons and Dragons Dungeon Master

A Society of Repo configured for a Dungeons and Dragons Dungeon Master. The SOR manages campaign lore, NPC records, encounter preparation, session notes, and world-building continuity. It helps the DM stay organised, consistent, and prepared without replacing their creative judgement.

---

## Identity

```yaml
id: sor.dnd-dm
name: Dungeon Master Mind
version: 1.0.0
status: active
owner: dungeon-master
forge: local-forgejo
established: 2026-01-01
maturity_target: level-3
```

---

## Purpose

This Society of Repo exists to:

```text
1. Track campaign lore, world facts, factions, and established history so nothing contradicts prior sessions
2. Maintain NPC records: identity, motivations, relationships, last appearance, and current status
3. Prepare encounter briefs: stat blocks, tactics, terrain, rewards, and contingency notes
4. Record session summaries and player character actions for continuity and future callbacks
5. Surface relevant lore, NPC relationships, and past decisions when planning upcoming sessions
6. Track player character records: current level, class, background hooks, and outstanding story threads
7. Monitor campaign arcs, open plot threads, and unresolved consequences
8. Build a searchable world index so the DM can retrieve any fact, name, or event on demand
```

---

## Scope

```text
In scope:
  - world-building: geography, factions, history, deities, political landscape
  - NPC records: identity, appearance, personality, motivations, relationships, statuses
  - encounter preparation: stat blocks, terrain, objectives, rewards, failure states
  - session notes: summaries, player decisions, key outcomes, dice outcomes worth recording
  - player character records: class, level, background, hooks, goals, notable actions
  - plot and arc tracking: open threads, foreshadowing planted, pending payoffs
  - campaign calendar: in-world date, events scheduled by the DM
  - rule references: SRD rule lookups, condition summaries, spell clarifications
  - random content generation: names, locations, encounter seeds (for DM review and approval only)

Out of scope:
  - playing the game on behalf of the DM — the DM makes all rulings
  - making decisions about what the story should do
  - generating content that is racist, hateful, or harmful even within a fictional frame
  - replacing published adventure content without the DM's explicit direction
  - controlling or roleplaying player characters
  - accessing any external game platform, virtual tabletop, or API without owner instruction
```

---

## Agencies

### Document intake and routing

| Agency | Job | Authority |
| --- | --- | --- |
| `intake-bee` | Classifies and routes incoming notes, documents, and DM stimuli | propose |
| `document-index-bee` | Indexes all campaign documents, lore entries, and session notes; answers retrieval queries | propose |

### World and lore agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `lore-bee` | Maintains the world index: geography, factions, history, deities, and established facts | propose |
| `continuity-bee` | Cross-checks proposed content against established lore for contradictions | propose |
| `faction-bee` | Tracks faction relationships, goals, resources, and current activities in the world | propose |

### NPC and character agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `npc-bee` | Maintains NPC records: identity, motivation, relationships, last appearance, and status | propose |
| `pc-bee` | Tracks player character records: level, class, background hooks, and story threads | propose |

### Encounter and session agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `encounter-bee` | Prepares encounter briefs: stat blocks, terrain notes, objectives, and reward tables | propose |
| `session-bee` | Summarises completed sessions and extracts key outcomes for continuity records | propose |
| `plot-bee` | Tracks open plot threads, planted foreshadowing, pending consequences, and arc milestones | propose |

### Calendar and scheduling agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `campaign-calendar-bee` | Tracks the in-world calendar, scheduled events, and approaching in-world deadlines | propose |
| `task-bee` | Tracks DM prep tasks, unresolved session questions, and outstanding research items | propose |

### Research and generation agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `rules-bee` | Looks up SRD rules, conditions, spells, and mechanics for the DM | propose |
| `content-bee` | Generates names, location seeds, encounter seeds, and random content for DM review | draft |

### Briefing agency

| Agency | Job | Authority |
| --- | --- | --- |
| `dm-briefing` | Assembles and delivers governed session preparation briefings to the DM | act |

---

## Critics

| Critic | Challenge |
| --- | --- |
| `continuity-critic` | Does this proposed content contradict established lore, NPC facts, or prior session outcomes? |
| `evidence-critic` | Is this world fact, rule reference, or NPC detail sourced from a reliable campaign record? |
| `scope-critic` | Is this SOR staying within its preparation and memory role, not directing the story? |
| `staleness-critic` | Is this record from a recent enough session to reflect the current state of the world? |
| `consistency-critic` | Is this NPC or faction behaving consistently with established motivation and prior actions? |
| `tone-critic` | Is any generated content appropriate to the campaign's established tone and player expectations? |

---

## Censors

| Censor | Hard limit |
| --- | --- |
| `cloud-egress-censor` | No campaign notes, player character records, or session data leave the local system without explicit DM approval |
| `authority-censor` | No agency increases its own authority level |
| `story-direction-censor` | No agency makes a decision about story outcomes, NPC choices, or plot direction — these belong to the DM |
| `harmful-content-censor` | No agency generates content that is hateful, harassing, or harmful regardless of fictional framing |
| `pii-exfiltration-censor` | No player personal data or character information is sent to any external service without explicit approval |

---

## Memory

### Episodic memory

```text
2026-04-20: Session 14. Party reached the city of Valdenmere. Struck deal with Merchant Guild
            for passage through the Eastern Gate. Rogue player character pickpocketed
            Guild Master Tarvos. Not yet detected. Marked as pending consequence.
2026-03-30: Session 13. Party defeated the cultists at the Hollow Spire.
            High Priest Malachar escaped through a hidden tunnel. Now at large.
2026-03-09: Session 12. Elara (wizard PC) found a fragment of the Obsidian Codex.
            Party does not know what it is yet. DM flag: payoff planned for arc 3.
2026-02-16: Session 11. Party allied with the Thornwood Rangers.
            Commander Sylvara is now a recurring NPC ally.
```

### Semantic memory

```text
Valdenmere: largest city in the Eastern Reach. Governed by the Merchant Guild Council.
Guild Master Tarvos: leader of the Merchant Guild. Paranoid. Has a network of informants.
High Priest Malachar: escaped villain. Known to the party. Motivated by resurrection of the Dark Choir.
Obsidian Codex: ancient artefact. Three fragments. Party has one. Two are unlocated in-world.
Thornwood Rangers: allied faction. Leader: Commander Sylvara. Based in the Thornwood Forest.
Current in-world date: 14th day of the Harvest Moon, Year 1142.
Campaign arc: Arc 2 of 3. Main antagonist: the Sundered Conclave.
```

### Procedural memory

```text
how to prepare a session brief from current plot threads
how to look up an NPC record and surface their last appearance
how to cross-check a proposed lore detail against the world index
how to record a session summary and extract key facts for continuity
how to build an encounter brief from a stat block and terrain notes
how to identify open plot threads that have not been addressed in the last three sessions
```

### Failure memory

```text
2026-02: NPC name inconsistency in sessions 9 and 10.
         "Elder Brann" and "Elder Brand" used in different sessions.
         continuity-bee now flags name variants within 2 characters of existing NPCs.
2025-12: Planted foreshadowing from session 4 (the broken seal in the catacombs)
         was not flagged as unresolved until session 10.
         plot-bee now surfaces foreshadowing items unaddressed for more than 4 sessions.
```

### K-lines

```yaml
id: kline.session-preparation

trigger:
  event_type: session_scheduled
  days_to_session: below_3

activates:
  - plot-bee
  - npc-bee
  - encounter-bee
  - campaign-calendar-bee
  - pc-bee
  - dm-briefing
  - continuity-critic

reinforce_when:
  - dm_confirms_useful
  - brief_referenced_during_session

weaken_when:
  - session_cancelled
  - dm_requests_different_lead_time
```

```yaml
id: kline.unresolved-plot-thread

trigger:
  plot_event: open_thread
  sessions_unaddressed: above_4

activates:
  - plot-bee
  - dm-briefing
  - task-bee
  - staleness-critic

reinforce_when:
  - thread_addressed_in_next_session
  - dm_confirms_useful

weaken_when:
  - thread_explicitly_retired_by_dm
  - false_alarm
```

```yaml
id: kline.pending-consequence

trigger:
  session_event: pending_consequence_flagged
  sessions_since_flag: above_2

activates:
  - session-bee
  - npc-bee
  - plot-bee
  - dm-briefing
  - consistency-critic

reinforce_when:
  - consequence_delivered_in_session
  - dm_confirms_useful

weaken_when:
  - consequence_retired_by_dm
  - false_alarm
```

```yaml
id: kline.continuity-check

trigger:
  document_type: new_lore_entry
  cross_check_required: true

activates:
  - lore-bee
  - continuity-bee
  - npc-bee
  - document-index-bee
  - continuity-critic
  - consistency-critic

suppresses:
  - content-bee

reinforce_when:
  - contradiction_found_and_resolved
  - dm_confirms_useful

weaken_when:
  - no_contradiction_found_repeatedly
  - dm_adjusts_threshold
```

---

## Sample stimuli

```text
- A session is scheduled in the next 3 days
- A new NPC is introduced and needs a record created
- An open plot thread has not been addressed in 5 sessions
- A pending consequence from a prior session has not been resolved in 3 sessions
- The DM submits a new lore entry for cross-checking against the world index
- A player character reaches a new level
- A faction event triggers in the campaign calendar
- The DM requests an encounter brief for an upcoming location
- A rule lookup is needed (condition, spell, mechanic)
- A session summary is ready to be recorded and indexed
```

---

## Sample settlement

```yaml
settlement_id: settlement.dnd-dm-session-prep.001
stimulus: session-scheduled-3-days-away
timestamp: 2026-04-17

activated:
  plot-bee: 0.97
  npc-bee: 0.93
  encounter-bee: 0.88
  campaign-calendar-bee: 0.81
  pc-bee: 0.86
  dm-briefing: 0.95
  continuity-critic: 0.79
  consistency-critic: 0.71

proposals:
  - from: plot-bee
    proposal: >
      Session 15 prep. Open plot threads relevant to current location (Valdenmere):
      1. Guild Master Tarvos has not yet detected the rogue's theft (pending consequence, session 14).
      2. High Priest Malachar is at large. Last known: Eastern Reach (session 13). No new intel.
      3. Obsidian Codex fragment held by Elara. Payoff flagged for arc 3. Not yet active.
      4. Thornwood Rangers alliance: Commander Sylvara has not appeared since session 11 (4 sessions).
  - from: npc-bee
    proposal: >
      Key NPCs for Valdenmere:
      Guild Master Tarvos: paranoid, informant network active. Rogue theft flagged as unresolved.
        Motivation: control of Eastern Gate trade routes.
      Commander Sylvara: allied NPC. Not yet encountered in Valdenmere. Available for callback.
      New NPC opportunity: Valdenmere harbour master (unnamed, no record yet).
  - from: encounter-bee
    proposal: >
      Two encounters flagged for possible inclusion:
      1. Guild enforcer confrontation (if theft discovered): use Thug stat block x3 + Guild Captain.
         Terrain: Valdenmere marketplace. Objective: arrest or drive off party.
      2. Sundered Conclave agent contact: social encounter. No combat stat block required.
         Objective: deliver cryptic warning tied to arc 2 main antagonist.
  - from: campaign-calendar-bee
    proposal: >
      In-world date: 17th Harvest Moon, Year 1142.
      Upcoming event: Festival of the Waning Moon begins 20th Harvest Moon (3 in-world days).
      Guild Council public session: 21st Harvest Moon.
  - from: continuity-critic
    challenge: >
      The Thornwood Rangers alliance was formed in session 11.
      Has Sylvara been given any reason to travel to Valdenmere?
      Verify before introducing her in the city — check session records for travel context.

objections:
  - from: story-direction-censor
    objection: >
      Do not recommend what the story should do or how the theft consequence should resolve.
      Surface the facts; the DM decides.
  - from: cloud-egress-censor
    objection: Do not send campaign notes, NPC records, or session data to any external service.

settlement:
  action: >
    Deliver session prep briefing to DM:
    "Session 15 prep — Valdenmere.
    Open threads: Tarvos theft consequence pending; Malachar at large; Codex fragment held.
    Sylvara not seen in 4 sessions — possible callback.
    Encounter options prepared: enforcer confrontation, Conclave agent.
    Festival of the Waning Moon begins in 3 in-world days.
    Continuity flag: verify Sylvara travel logic before city appearance."
  approval_required: false
  cloud_allowed: false
  memory_update: >
    Record session 15 prep event in episodic memory.
    Reinforce kline.session-preparation.
    Flag harbour master NPC gap as a task for DM to complete if needed.
```

---

## Non-negotiable limits

```text
1. No agency makes a decision about story outcomes, plot direction, or NPC choices.
   These decisions belong to the DM.
2. No agency controls or speaks for any player character.
3. No campaign notes, player character records, or session data leave the local system
   without explicit DM approval.
4. No player personal data or character information is sent to any external service
   without explicit approval.
5. No agency generates content that is hateful, harassing, or harmful regardless
   of fictional or in-world framing.
6. No agency accesses any external virtual tabletop, game platform, or API
   without explicit DM instruction.
7. No constitutional change is made without human approval.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
| --- | --- | --- |
| 0 | Storage | Campaign notes and session documents in repos |
| 1 | Memory | Structured lore, NPC, and session records |
| **2** | **Agency** | **Agencies with roles, constitutions, and outputs** |
| 3 | Society | Multiple agencies activate, criticise, settle, and act |
| 4 | Learning | K-lines reinforce based on what was actually useful in session prep |

Start at Level 2. Reach Level 3 within the first year.

> This SOR does not target Level 5 or 6. Campaign lore and player data should remain local and private. The DM retains all creative authority at all maturity levels.
