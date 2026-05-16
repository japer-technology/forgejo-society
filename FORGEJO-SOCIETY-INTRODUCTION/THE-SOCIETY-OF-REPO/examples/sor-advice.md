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
| --- | --- | --- |
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
| --- | --- |
| `evidence-critic` | Is the proposal based on reliable data? |
| `scope-critic` | Is this within what the SOR is authorised to do? |
| `staleness-critic` | Is the data current enough to act on? |
| `overconfidence-critic` | Is the confidence level appropriate? |

### Add domain-specific critics

| Domain | Additional critics |
| --- | --- |
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
| --- | --- |
| `cloud-egress-censor` | No document or personal data leaves the local system without explicit owner approval |
| `authority-censor` | No agency increases its own authority level |
| `pii-exfiltration-censor` | No personal identification or sensitive personal data is sent externally without explicit approval |

### Common additions

| Censor | When to add |
| --- | --- |
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
| --- | --- |
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
| --- | --- | --- |
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

## 18. Versioning and evolution

A SOR file is a living specification. As the domain changes and the society learns, the file must change with it.

### Version numbering

Follow semantic versioning: `MAJOR.MINOR.PATCH`.

| Change | Bump |
| --- | --- |
| New agency, censor, or critic added | MINOR |
| K-line added or changed | MINOR |
| Non-negotiable limit changed | MAJOR |
| Identity or maturity level changed | MAJOR |
| Typo fix, clarification, wording | PATCH |

### What to record when you update

Every MINOR or MAJOR version bump must add a new entry to **episodic memory** that records:
- what changed
- why it changed
- what failure or event prompted the change (if any)

```text
2026-06: v1.1.0. Added supplier-watch agency. Prompted by missed 90-day contract review window.
```

### Version migration rule

When the version changes, do not delete old K-lines or agencies immediately. Mark them `status: retired` and leave them in place for one operating cycle. Remove them in the next version. Sudden removal breaks continuity.

---

## 19. The policy ledger

The censor section says "put exceptions in the policy ledger." This section explains what the policy ledger is and how to write it.

### What it is

The policy ledger is a section of the SOR file (or a separate companion file) that records standing **conditional rules** — things that are true in the domain but are not unconditional limits. It sits between a censor (unconditional) and a K-line (activation pattern).

### Policy ledger format

```yaml
policy_id: policy.<domain>-<rule-name>
rule: >
  <A single declarative statement of the conditional rule.>
condition: >
  <When this rule applies.>
exception: >
  <How the exception is approved or documented.>
review_cycle: <annual | quarterly | on-change>
```

### Example

```yaml
policy_id: policy.business-pre-authorised-spend
rule: >
  Recurring monthly subscriptions below $200 may be renewed without per-transaction approval.
condition: >
  Applies only to subscriptions already listed in the approved-subscriptions register.
exception: >
  New subscriptions require explicit owner approval before the first charge.
review_cycle: annual
```

### Rules for the policy ledger

- A policy is **not** a censor. It has a condition. The censor is what enforces the absolute floor.
- Every policy must have a `review_cycle`. Policies that are never reviewed become hidden assumptions.
- When a censor says "move the exception to the policy ledger," it means: write a policy entry, not a relaxed censor.

---

## 20. Conflict resolution between agencies

When two agencies produce incompatible proposals in the same settlement, the SOR needs a rule for how to decide. Without this rule, the briefing agency is left to guess.

### Define a resolution rule in every SOR

Every SOR file must state one of the following conflict resolution modes in its identity block or a dedicated section:

| Mode | Meaning |
| --- | --- |
| `critic-decides` | The critic with the most specific objection breaks the tie |
| `owner-decides` | Conflicting proposals are surfaced to the owner without a recommendation |
| `weight-decides` | The proposal from the higher-weight agency in the activated list wins |
| `conservative-wins` | The more cautious proposal is adopted when confidence is below threshold |

Most personal and household SORs should use `owner-decides`. Most business SORs with time pressure should use `conservative-wins`.

### Detect a conflict during authoring

A conflict is likely when:
- Two agencies both have `act` authority (this is the most common authoring error — only one agency should have `act`)
- Two K-lines both activate in response to the same trigger
- A critic challenge and a worker proposal are both `approval_required: false`

### Recording a conflict in settlement

If a conflict is detected, record it explicitly:

```yaml
conflict:
  agencies: [contract-bee, budget-watch]
  resolution_mode: conservative-wins
  resolved_in_favour_of: budget-watch
  reason: >
    Budget-watch activation weight was 0.91; contract-bee was 0.74.
    Conservative rule applied.
```

---

## 21. Stimulus taxonomy

K-lines only fire reliably when stimulus names are consistent. If the same event is named differently on intake vs. in K-line triggers, the K-line never fires.

### Define a stimulus vocabulary in every SOR

Create a `stimulus_taxonomy` block that lists every named stimulus type the SOR recognises. Use this as the controlled vocabulary for both K-line triggers and sample stimuli.

```yaml
stimulus_taxonomy:
  document_types:
    - supplier_invoice
    - lease_agreement
    - compliance_certificate
    - bank_statement
  event_types:
    - deadline_approach
    - weekly_review
    - new_document_received
    - renewal_window_open
  signal_types:
    - price_change_above_threshold
    - overdue_obligation
    - expiry_within_window
```

### Rules

- Every K-line `trigger` must use terms from this taxonomy.
- `intake-bee` must be capable of classifying incoming stimuli into these types.
- When a new type is needed, add it to the taxonomy first, then add the K-line.

A taxonomy mismatch is the second most common cause of K-lines that silently fail (after agency-not-defined errors).

---

## 22. Retiring an agency

Agencies become obsolete. A process that no longer exists should not have an agency watching for it. Leaving dead agencies in place creates noise and misleads future authors.

### How to retire an agency

1. Mark the agency `status: retired` in the agencies table.
2. Scan every K-line for references to the agency. For each reference, either:
   - Replace it with the agency that now performs that role, or
   - Remove it from the `activates` list if no replacement exists
3. Add an episodic memory entry recording the retirement and the reason.
4. Bump the version (MINOR if no non-negotiable limits changed, MAJOR if they did).

### What you must not do

- Do not delete an agency and leave its name in K-lines. This creates silent activation failures.
- Do not retire the only agency that activates a particular critic. Retiring a worker agency must not remove all critic coverage from a domain.

### Retirement entry format (episodic memory)

```text
2026-09: procurement-bee retired. All supplier invoice handling moved to contract-bee.
         K-line kline.business-invoice-anomaly updated to activate contract-bee.
```

---

## 23. Briefing design

The briefing agency is the most visible part of the SOR to the owner. A poorly designed briefing trains the owner to ignore it.

### Briefing format rules

1. **Maximum item count.** Every briefing has a hard ceiling — typically 5 items for a daily personal briefing, 10 for a weekly business review. More than this is noise. State the ceiling in the non-negotiable limits section.

2. **Ordering.** Briefing items must be ordered by urgency, not by the order agencies activated:
   - First: items requiring owner approval
   - Second: items with a deadline within 7 days
   - Third: items that are informational

3. **Actionability.** Every briefing item must specify what the owner should do or decide. "Contract expires soon" is not actionable. "Contract expires 14 June — approve renewal or initiate cancellation" is.

4. **Source attribution.** Every briefing item must state which agency produced it and what confidence level was assigned.

### Briefing item format

```yaml
- priority: 1
  from: contract-bee
  confidence: 0.92
  item: >
    Lease agreement for 12 High St expires 30 June 2026 (54 days).
    Break-clause deadline passes 15 May 2026 (29 days).
  action_required: >
    Confirm renewal or instruct solicitor to serve break notice before 15 May.
  approval_required: true
```

### What ruins a briefing

- Items that say "monitor" or "watch" with no required action
- Duplicate items from two agencies about the same event
- Items without a deadline or quantified threshold
- Items carried over from a previous briefing that the owner already resolved

A SOR that produces the same unresolved item every cycle has a settlement failure, not a briefing failure. The settlement must record that the item was not actioned and escalate it.

---

## 24. Privacy zones within a SOR

Not all data held by a SOR is equally sensitive. A health SOR may contain both appointment dates (low sensitivity) and diagnosis records (high sensitivity). Treating both identically either over-restricts useful data or under-protects sensitive data.

### Define sensitivity tiers

Add a `privacy_zones` block to the SOR:

```yaml
privacy_zones:
  zone_a:
    label: public-operational
    examples: [appointment_dates, renewal_deadlines, invoice_numbers]
    cloud_allowed: false
    agencies_with_read_access: all
  zone_b:
    label: private-personal
    examples: [names, contact_details, financial_balances]
    cloud_allowed: false
    agencies_with_read_access: [intake-bee, owner-briefing]
  zone_c:
    label: sensitive-protected
    examples: [diagnosis_records, medication_details, legal_positions]
    cloud_allowed: false
    agencies_with_read_access: [owner-briefing]
    human_approval_required_to_access: true
```

### Rules

- Zone C data must **never** appear in a settlement `proposals` block in clear text. Reference it by document ID only.
- No agency except the briefing agency may read Zone C without explicit human approval recorded in the policy ledger.
- The `pii-exfiltration-censor` must explicitly reference Zone B and Zone C as covered categories.
- A health SOR must define at least three zones. A business SOR must define at least two.

---

## 25. Onboarding a new owner

A SOR outlives the person who set it up. A new owner — a successor, a partner, or a team member taking over — must be able to understand and trust the SOR before relying on it.

### Minimum onboarding deliverables

Every SOR must contain a section named `handover_guide` with the following:

```markdown
## Handover guide

### What this SOR does
<Two sentences. What it tracks, what decisions it surfaces, what it will never do.>

### What you must verify before trusting it
1. Check that episodic memory reflects the last 6 months of real events.
2. Confirm that non-negotiable limits match your current operating constraints.
3. Review the policy ledger for any exceptions that may no longer apply.
4. Run a dry-run settlement against a recent real stimulus and verify the output.

### What to change first
<State which agencies, K-lines, or limits are most likely to need updating for a new owner.>

### Who approved the last version
<Name or identifier of the human who approved the current version.>
```

### Dry-run requirement

Before a new owner relies on a SOR in production, they must run at least one **dry-run settlement**:
- Select a real past stimulus from the episodic memory
- Run the settlement manually (or ask the briefing agency to simulate it)
- Verify that the action and approval_required fields match what actually happened

If the dry-run settlement diverges significantly from reality, update the SOR before relying on it.

---

## 26. Testing a SOR before live operation

A SOR file written from scratch contains assumptions. Before the society activates against real stimuli, those assumptions must be tested.

### Pre-activation checklist

**Structural test**
- [ ] Run the SOR authoring checklist from §16 against the file
- [ ] Confirm every K-line agency is in the agencies section (manual cross-check)
- [ ] Confirm every stimulus in the sample stimuli section maps to at least one K-line trigger

**Settlement dry-run test**
- [ ] Write one sample settlement using the template in §12
- [ ] Verify that `approval_required` matches your intended policy
- [ ] Verify that at least one critic appears in `activated`
- [ ] Verify that at least one censor appears in `objections`

**Censor test**
For each censor defined, write one stimulus that *should* be blocked by that censor. Trace the settlement manually and confirm the censor fires.

**K-line coverage test**
For each agency defined, confirm there is at least one K-line that activates it. An agency with no K-line that triggers it is either redundant or the K-line taxonomy is incomplete.

### Common test failures

| Failure | Root cause |
| --- | --- |
| Censor never fires in any sample settlement | Censor limit is too narrow; stimulus vocabulary doesn't match |
| Critic never appears in activated | Critic not included in any K-line `activates` list |
| Sample settlement has `approval_required: false` for a financial action | Settlement author applied wrong threshold |
| K-line triggers but activates an undefined agency | Agency renamed without updating K-line |

---

## 27. Delegation between SORs

At Level 5 maturity, one SOR can call another through a governed channel. Even at Levels 3 and 4, a SOR may need to reference another SOR's output. This section establishes the rules for safe delegation.

### When to delegate vs. when to expand

**Expand the current SOR** when:
- The new capability is in the same domain
- The new agencies will need access to the same memory
- The owner is the same person

**Delegate to another SOR** when:
- The new capability belongs to a clearly separate domain (e.g. health → business)
- The new SOR has a different owner or authority structure
- The delegation can be fully governed by a censor and an approval step

### Delegation record format

Every cross-SOR delegation must be recorded as a settlement entry:

```yaml
settlement_id: settlement.business-health-delegation.001
stimulus: health-sor requested business-sor to create a task for a medical appointment
delegating_sor: sor.health
receiving_sor: sor.business
scope_of_delegation: >
  Create a calendar task only. No health record data passed.
  No data about the medical nature of the appointment is transmitted.
censor_checks:
  - pii-exfiltration-censor: pass
  - cloud-egress-censor: pass
approval_required: false
```

### The `delegation-depth-censor` rule

A SOR that delegates must define a `delegation-depth-censor` that prevents chains longer than one hop without human approval:

```text
No SOR may instruct a receiving SOR to issue a further delegation without explicit human approval at each hop.
```

Without this limit, a delegation chain can bypass censors by routing through intermediate SORs that have weaker limits.

### What is never delegated

- Memory write access
- Authority level changes
- Non-negotiable limit overrides
- Zone C privacy data (from §24)

These cannot travel across a delegation boundary regardless of maturity level.

---

## See also

- [SOR Examples](README.md) — worked examples for business, household, health, and personal assistant
- [THE-SOCIETY-OF-REPO/](../README.md) — full specification
- [THE-SOCIETY-OF-REPO/02-protocols/](../02-protocols/) — protocol definitions for identity, events, activation, settlement, and memory
- [THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md](../00-foundations/04-anti-patterns.md) — what not to build
