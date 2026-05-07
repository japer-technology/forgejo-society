# SOR Advice — How to Write a Society of Repo File

This document is a guide for AI agents and human authors creating new SOR configuration files. Read it before writing a SOR file. Apply it as a checklist after writing one.

The goal is a SOR file that is complete, internally consistent, safe to operate, and useful to a real owner from day one.

---

## 1. What a SOR file is

A SOR file is the founding document of a Society of Repo. It defines:

- who the SOR is and what it is for
- what agencies it activates and what they do
- what critics challenge its proposals
- what censors enforce its hard limits
- how it remembers
- what patterns it develops over time (K-lines)
- how a real decision forms and is recorded (settlement)
- what it will never do without human approval

A SOR file is not aspirational prose. It is a **specification** that governs real behaviour.

---

## 2. Required sections (in order)

Every SOR file must contain all of the following sections in this order:

```text
1. Identity
2. Purpose
3. Scope
4. Agencies
5. Critics
6. Censors
7. Memory (all four types + K-lines)
8. Sample stimuli
9. Sample settlement
10. Non-negotiable limits
11. Maturity ladder target
```

Do not omit a section. If a section is sparse for the domain, note why.

---

## 3. Identity block

```yaml
id: sor.<domain>             # lowercase, dot-separated, e.g. sor.business
name: <Human Name>           # short, readable
version: 1.0.0
status: active               # active | draft | retired
owner: <owner-identifier>    # individual | family | business-owner | team
forge: local-forgejo
established: YYYY-MM-DD
maturity_target: level-N    # choose 2 or 3 as initial target; see maturity section
```

Rules:
- `id` must be globally unique within the forge. Use `sor.<domain>` format.
- `owner` should be the narrowest accurate descriptor (not "user" or "person").
- `maturity_target` is aspirational. Set it to level-3 as the initial target (you start at level-2 once agencies are defined).

---

## 4. Purpose

Write 5–8 numbered items. Each item must:
- Begin with an **active verb** (Track, Monitor, Surface, Prepare, Build, Preserve, Reduce)
- Describe **observable, bounded behaviour** — not vague intentions
- Avoid the words "help" and "assist" on their own; say what specifically the SOR does

Bad:
```text
1. Help users manage their health
```

Good:
```text
1. Track upcoming health appointments, referrals, and follow-up dates
2. Surface medication renewal dates and refill windows
3. Preserve a personal health timeline so nothing important is forgotten
```

---

## 5. Scope

The scope section disciplines the SOR. A SOR that tries to do everything does nothing well.

### In scope

List specific, actionable categories. Use a consistent noun form (e.g. "contracts: extraction, obligations, risks").

### Out of scope

This section is **critical for safety**. Every SOR must explicitly exclude:
- professional advice in the domain (legal, financial, medical, employment)
- licensed-professional decisions
- autonomous external commitments
- clinical or safety-critical judgements

Out-of-scope items are not limitations — they are **the reason the SOR remains trusted**.

---

## 6. Agencies

### Naming conventions

- Worker agencies end in `-bee` (e.g. `intake-bee`, `contract-bee`, `medication-bee`)
- Briefing/output agencies end in `-briefing` or `-briefing-bee` (e.g. `owner-briefing`, `health-briefing`)
- Watch agents end in `-watch` (e.g. `finance-watch`, `budget-watch`)
- Use lowercase, hyphen-separated names only

### Authority levels

| Level | Meaning | When to assign |
|---|---|---|
| `read` | Can read repos only | Rarely used explicitly — implied by default |
| `draft` | Can write draft outputs | Agencies that produce summaries for review |
| `propose` | Can open proposals (issues/PRs) | **Most agencies** — the default for worker bees |
| `act` | Can merge approved proposals | Output/briefing agencies only |
| `govern` | Can modify authority or constitution | Never assigned to a worker agency |
| `human` | Reserved for human owners | Never assigned to an AI agency |

**Almost every agency should be `propose`.** Only briefing/output agencies that deliver finalised outputs should be `act`. No AI agency should ever have `govern` or `human`.

### Grouping

Group agencies by functional cluster with a `### Subheading` above each table. Typical clusters:

- Document intake and routing
- Domain-specific work (contracts, health records, finance, etc.)
- Scheduling and calendar
- Research and monitoring
- Briefing and output

### The intake-bee rule

Every SOR must have an `intake-bee`. It is the perception layer. It classifies and routes incoming stimuli to the correct downstream agencies.

### The briefing agency rule

Every SOR must have exactly one agency at `act` authority that assembles and delivers the governed output to the owner. Name it `<domain>-briefing` (e.g. `family-briefing`, `health-briefing`, `owner-briefing`, `daily-briefing`).

### Consistency check

Before finalising: **every agency referenced in K-lines must be defined in the agencies section**. Cross-check both lists. This is the most common SOR authoring error.

---

## 7. Critics

Critics are challenge repos. They do not block — they raise questions that must be answered before settlement.

### Always include

| Critic | Purpose |
|---|---|
| `evidence-critic` | Is the proposal based on reliable data? |
| `scope-critic` | Is this within what the SOR is authorised to do? |
| `staleness-critic` | Is the data current enough to act on? |
| `overconfidence-critic` | Is the confidence level appropriate? |

### Add domain-specific critics

| Domain | Additional critics |
|---|---|
| Business / Finance | `cost-critic`, `risk-critic`, `privacy-critic`, `source-quality-critic` |
| Personal health | `source-quality-critic` |
| Research contexts | `source-quality-critic` |
| Task / productivity | `priority-critic` |

Four critics is a minimum. Six to eight is appropriate for a business or high-stakes domain.

### What a critic is not

A critic does not block a proposal. It challenges it. The settlement process weighs the challenge. If you want to block, use a censor.

---

## 8. Censors

Censors are hard-limit repos. They enforce unconditional constraints. No settlement can override a censor.

### Always required (all SORs)

| Censor | Limit |
|---|---|
| `cloud-egress-censor` | No document or personal data leaves the local system without explicit owner approval |
| `authority-censor` | No agency increases its own authority level |
| `pii-exfiltration-censor` | No personal identification or sensitive personal data is sent externally without explicit approval |

### Common additions

| Censor | When to add |
|---|---|
| `payment-censor` | Any SOR that touches financial transactions |
| `delegation-depth-censor` | Any SOR with multi-hop delegation |
| `credential-censor` | Any SOR that uses API keys, passwords, or tokens |
| `commitment-censor` | Any SOR that could act in external systems |
| `clinical-decision-censor` | Health SORs — prevents clinical recommendations |
| `emergency-scope-censor` | Health SORs — directs to emergency services only |

### Writing a censor

A censor limit is a single unconditional sentence. It should not contain "unless" or "except" as conditions — if exceptions exist, they belong in the policy ledger, not the censor definition.

Bad:
```text
No payment above $500 is made without approval unless it was pre-authorised.
```

Good:
```text
No payment above the defined spending limit is made without explicit human approval.
```

---

## 9. Memory

Every SOR must have all four memory types populated with at least one example each.

### Episodic memory

Records of specific events that occurred. Use `YYYY-MM` prefix format.

```text
2026-04: Contract renewed. 3-year term. Break clause at 18 months.
```

Episodic memories answer: *What happened?*

### Semantic memory

Standing facts about the domain that do not change with each event.

```text
Lease renews annually each October.
BAS lodged quarterly: October, January, April, July.
```

Semantic memories answer: *What is generally true here?*

### Procedural memory

Named procedures the SOR knows how to execute.

```text
how to prepare a BAS accountant pack
how to handle a supplier price increase
```

Procedural memories answer: *How do we do this?*

### Failure memory

Records of things that went wrong, what was learned, and what was changed.

```text
2025-11: Missed certificate expiry. Calendar-bee not watching that category.
         K-line updated to extend warning window.
```

Failure memories are not embarrassments — they are **the most important memory type**. A SOR without failure memory is a SOR that has not learned. Every failure should result in a K-line update or procedural change.

---

## 10. K-lines

K-lines are activation patterns the SOR develops over time. They represent learned associations between situations and responses.

### K-line anatomy

```yaml
id: kline.<domain>-<situation>     # descriptive, lowercase, hyphen-separated

trigger:
  <field>: <value>                  # one or more trigger conditions

activates:
  - <agency-id>                     # list of agencies that should respond
  - <critic-id>                     # critics relevant to this pattern

suppresses:
  - <agency-id>                     # agencies that should stay quiet (optional)

reinforce_when:
  - <condition>                     # what makes this K-line stronger

weaken_when:
  - <condition>                     # what makes this K-line less active
```

### Rules

1. **Every K-line must have both `reinforce_when` and `weaken_when`.**  
   A K-line without `weaken_when` can never be corrected. It will trigger forever, even when wrong.

2. **`activates` must reference only agencies defined in the agencies section.**  
   Cross-check every K-line against the agencies table.

3. **Trigger conditions must be specific.**  
   Use threshold values (e.g. `days_to_deadline: below_7`) not vague descriptions.

4. **Include at least one critic in every K-line's `activates` list.**  
   A K-line that activates only worker agencies with no critical challenge is unchecked.

5. **`suppresses` is optional but powerful.**  
   Use it to quiet irrelevant agencies during a focused activation. This is how a society stays focused.

### Good K-line triggers

```yaml
trigger:
  document_type: supplier_invoice
  price_change: above_10_percent
```

```yaml
trigger:
  obligation_type: bas
  days_to_deadline: below_21
```

```yaml
trigger:
  event_type: weekly_review
  day_of_week: friday
```

### Bad K-line triggers (too vague)

```yaml
trigger:
  anything_important: true    # not a real trigger
  user_wants: information     # meaningless
```

### How many K-lines

Three to five K-lines is appropriate for a first SOR file. K-lines are meant to grow over time — start with the most critical activation patterns and let the rest emerge from actual use.

---

## 11. Sample stimuli

List 6–10 concrete examples of what wakes the society. These should match the agencies and K-lines defined above.

Rules:
- Each stimulus should be a single specific event, not a category
- At least one stimulus should match each K-line trigger
- Use the same vocabulary as the agencies (document types, event types)

---

## 12. Sample settlement

A settlement is a record of one complete decision cycle. It shows the SOR reasoning visibly.

### Settlement anatomy

```yaml
settlement_id: settlement.<domain>-<event>.<NNN>
stimulus: <what-triggered-this>
timestamp: YYYY-MM-DD

activated:
  <agency-id>: <activation-weight>   # 0.0–1.0; higher = more confident/relevant

proposals:
  - from: <agency-id>
    proposal: >
      <Specific, factual proposal from this agency.
      Include numbers, dates, and concrete details.>

  - from: <critic-id>
    challenge: >
      <A specific question or challenge the critic raises.>

objections:
  - from: <censor-id>
    objection: >
      <The censor's hard-limit statement.>

settlement:
  action: >
    <What the SOR will do. Specific, actionable.>
  approval_required: true | false
  cloud_allowed: true | false
  memory_update: >
    <What will be written to memory as a result of this settlement.>
```

### When `approval_required: true`

Set `true` when the action:
- involves spending or financial commitment
- involves a legal commitment
- involves sending data externally
- involves a clinical or safety-relevant decision
- changes a record the owner needs to verify

Set `false` when the action:
- is a briefing or reminder delivered to the owner
- is a task creation within the local system
- is a retrieval query with no external output

### Activation weights

Weights represent how relevant each agency is to this particular settlement.
- `0.9+` — agency's primary domain; directly triggered
- `0.7–0.89` — supporting role; relevant but not primary
- `0.5–0.69` — monitoring; included for completeness
- Below `0.5` — agency may activate but not contribute a proposal

### Settlement quality checklist

- [ ] At least one critic appears in `activated` and contributes a `challenge`
- [ ] At least one censor appears in `objections`
- [ ] `settlement.action` is specific and actionable — not "monitor the situation"
- [ ] `memory_update` records what was learned, not just what happened
- [ ] `approval_required` is set correctly for the action type
- [ ] The settlement_id follows the `settlement.<domain>-<event>.<NNN>` convention

---

## 13. Non-negotiable limits

This section defines what the SOR will **never do** without human approval. It is not a list of current settings — it is a constitutional commitment.

### Always include

1. No document, record, or personal data leaves the local system without explicit owner approval.
2. No financial commitment or payment is made without human approval.
3. No legal or binding commitment is made without human approval.
4. No constitutional change is made without human approval.

### Add domain-specific limits

| Domain | Additional limit |
|---|---|
| Business | No employment decision without human approval. No BAS or tax filing submitted without review. |
| Health | This SOR does not give medical advice, diagnose, or recommend treatment. In any emergency, direct to emergency services. |
| Any SOR with API access | No credential, API key, or authentication token is shared between agencies or sent externally. |
| Personal assistant | No commitment is made on behalf of the individual in any external system without explicit approval. |

### Writing limits

- Use short, declarative sentences.
- Lead with "No" or "This SOR does not".
- Do not use "except", "unless", or "if" in a non-negotiable limit. Exceptions belong in the policy ledger.

---

## 14. Maturity ladder target

Every SOR must include a maturity ladder table that shows where it sits now and what it is targeting.

| Level | Name | What exists |
|---|---|---|
| 0 | Storage | Files in repos |
| 1 | Memory | Structured records, events, summaries |
| 2 | Agency | Repos with roles, constitutions, outputs |
| 3 | Society | Multiple repos activate, criticise, settle, act |
| 4 | Learning society | K-lines reinforce, agencies evaluated, weak parts retired |
| 5 | Networked society | SOR calls other SORs through governed channels |
| 6 | Economic society | SOR sells services, meters usage, builds reputation |

### Rules

- Bold the current level and the next immediate target in the table.
- Start at Level 2 for any new SOR that has at least one agency defined.
- Target Level 3 within the first year of operation.
- Do not target Level 5 or 6 without a clear reason — most personal and household SORs should cap at Level 4.

---

## 15. Common mistakes

These are the most frequent errors found in SOR files.

### Agency referenced in K-line but not defined as an agency

**Example of the error:**
```yaml
activates:
  - task-bee      # ← not in the agencies section
```

**Fix:** Add `task-bee` to the agencies section with its job and authority, or remove it from the K-line.

### K-line without `weaken_when`

A K-line without `weaken_when` will reinforce indefinitely and cannot be corrected through normal operation.

**Always add `weaken_when`**, even if the conditions are simple:
```yaml
weaken_when:
  - false_alarm
  - owner_already_handled
```

### Censor with conditional logic

Censors are unconditional. If you write "unless pre-approved", you have written a policy, not a censor. Move the exception to the policy ledger.

### Settlement that does not include a critic challenge

A settlement with no critic challenge is not a governed settlement — it is an unchecked proposal. Every settlement must include at least one `challenge` from a critic.

### Briefing agency not in settlement activated list

If `family-briefing` or `owner-briefing` has `act` authority and is the delivery mechanism, it must appear in the `activated` list of every settlement that produces a briefing output.

### Out of scope that is too vague

Bad:
```text
- anything dangerous
```

Good:
```text
- medical diagnosis of any kind
- clinical treatment recommendations
- medication dose changes or interpretations
```

### Purpose items that are vague or passive

Bad:
```text
1. Helps the owner stay informed about their business.
```

Good:
```text
1. Surface supplier invoice anomalies within 24 hours of document intake.
```

---

## 16. The SOR authoring checklist

Use this before committing a new SOR file.

**Structure**
- [ ] All 11 required sections are present in the correct order
- [ ] Identity block has all required fields
- [ ] `id` follows `sor.<domain>` format

**Agencies**
- [ ] `intake-bee` is defined
- [ ] Exactly one agency has `act` authority (the briefing agency)
- [ ] No agency has `govern` or `human` authority
- [ ] Every agency referenced in K-lines exists in the agencies section

**Critics**
- [ ] At minimum: `evidence-critic`, `scope-critic`, `staleness-critic`, `overconfidence-critic`
- [ ] Domain-specific critics are included where relevant

**Censors**
- [ ] At minimum: `cloud-egress-censor`, `authority-censor`, `pii-exfiltration-censor`
- [ ] Domain-specific censors added (payment, credential, clinical, etc.)
- [ ] No censor has conditional logic ("unless…")

**Memory**
- [ ] All four memory types present: episodic, semantic, procedural, failure
- [ ] At least one entry per memory type

**K-lines**
- [ ] Every K-line has `trigger`, `activates`, `reinforce_when`, and `weaken_when`
- [ ] Every K-line's `activates` list contains at least one critic
- [ ] Every agency in every K-line `activates` list is defined in the agencies section

**Settlement**
- [ ] Settlement ID follows `settlement.<domain>-<event>.<NNN>` format
- [ ] At least one critic appears in `activated` with a `challenge`
- [ ] At least one censor appears with an `objection`
- [ ] `approval_required` is correctly set for the action type
- [ ] `memory_update` is present and specific
- [ ] The briefing agency appears in `activated` if the output is a briefing

**Non-negotiable limits**
- [ ] Limits are declarative, unconditional sentences
- [ ] No "unless" or "except" conditions in the limits section
- [ ] Domain-specific limits are included

**Maturity ladder**
- [ ] Current level is bolded
- [ ] Next target level is bolded
- [ ] Starting level is 2 or above

---

## 17. Domain-specific advice

### Business SOR

- Include `payment-censor`, `credential-censor`, and `delegation-depth-censor`
- Include `risk-critic`, `privacy-critic`, and `source-quality-critic`
- Non-negotiable limits must cover: employment decisions, tax filings, legal commitments
- K-lines for deadline types (tax, contract renewal, staff expiry) are the most valuable to define first

### Family / household SOR

- Include `pii-censor` for children's records
- `overconfidence-critic` prevents the SOR from turning household observations into judgements
- The maturity target should be Level 3 (not higher) for most households
- Keep agencies lean — a household SOR that grows too large becomes noise

### Personal health SOR

- `clinical-decision-censor` and `emergency-scope-censor` are mandatory
- Never use `interpret`, `diagnose`, or `recommend treatment` in any agency description
- Non-negotiable limits must explicitly state that the SOR surfaces information only
- `task-bee` is often needed even if not immediately obvious — health follow-up creates tasks
- Health data sovereignty: do not target Level 5 or 6. This SOR should stay local and private.

### Personal assistant SOR

- The daily briefing limit (e.g. maximum 5 items) should appear in both the sample settlement and the non-negotiable limits section
- `commitment-censor` is mandatory — a personal assistant SOR is the most likely to be asked to act in external systems
- `follow-up-bee` and `deadline-bee` are core agencies, not optional
- K-lines for `weekly-review` and `deadline-approach` are the highest value first definitions

---

## See also

- [SOR Examples](README.md) — worked examples for business, household, health, and personal assistant
- [SOCIETY-OF-REPO/](../SOCIETY-OF-REPO/README.md) — full specification
- [SOCIETY-OF-REPO/02-protocols/](../SOCIETY-OF-REPO/02-protocols/) — protocol definitions for identity, events, activation, settlement, and memory
- [SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md](../SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md) — what not to build
