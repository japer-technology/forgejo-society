# The Cognitive Loop

Every Society of Repo follows a recurring arc from stimulus to reinforcement.

```text
stimulus
  → perception
  → activation
  → agency response
  → criticism
  → censorship
  → settlement
  → action
  → outcome
  → memory
  → reinforcement
```

---

## Stimulus

Something happens.

A stimulus is any event that enters the system and may require a response.

```text
an issue is opened
a file is uploaded to a repo
a document arrives in the intake directory
a supplier invoice changes significantly
a staff certificate approaches expiry
a scheduled timer fires
a webhook arrives from an external system
a test suite fails
a customer complaint is submitted
another SOR calls a service
```

Stimuli arrive as issues, webhooks, scheduled triggers, or direct repository events.

Every stimulus carries a payload: the content of the event plus contextual metadata.

---

## Perception

Micro-agents extract features from the stimulus.

Perception converts raw content into a structured feature set that the activation layer can use.

```text
document_type: supplier_invoice
price_change: +18%
supplier: known_vendor
recurring: true
private_data: false
urgency: medium
```

Perception agents are Class A agents — structural, no LLM inference required for most classifications. They run fast and in parallel.

When perception is ambiguous, a local inference model classifies the edge cases.

---

## Activation

The feature set is matched against active K-lines.

K-lines are remembered activation patterns: "when this kind of stimulus arrives, wake these agencies."

```yaml
# K-line match: supplier_invoice + price_change > 10%
activates:
  - agency.supplier-bee
  - agency.finance-watch
  - agency.contract-bee
  - critic.cost
  - agency.owner-briefing

suppresses:
  - agency.staff-bee
  - agency.tax-bee
```

Agencies that are not relevant to this stimulus class remain dormant.

Activation is the routing layer. Its quality determines how much work the society does. A mature ecology with well-developed K-lines routes most stimuli in milliseconds, without inference.

See [../02-protocols/04-activation.md](../02-protocols/04-activation.md) for the activation protocol.

---

## Agency response

Each activated agency contributes a signal.

An agency response is one or more of:

```text
summary          — what the agency found
warning          — something concerning
obligation       — a commitment or deadline
question         — something the owner should decide
draft            — a proposed action or document
comparison       — how this relates to prior events
recommendation   — what the agency thinks should happen
objection        — a concern about a proposed path
```

Agency responses are proposed actions, not executed actions.

Nothing is done yet.

All proposals are submitted to the global workspace for criticism.

---

## Criticism

Critics examine every non-trivial proposal.

A critic asks:

```text
Where is the evidence for this claim?
Is this inside the scope of the requesting agency?
Is the cost justified?
Is the confidence level appropriate?
Is the wording safe for external use?
Is this proposal consistent with prior decisions?
Does this create a risk that has not been flagged?
```

Critics do not act. They object.

An objection is a signal that a proposal is weak, premature, risky, or outside scope.

Proposals without objections advance to the censorship layer.

Proposals with objections are either modified, escalated, or rejected.

See [../04-critics/README.md](../04-critics/README.md) for the full set of critics.

---

## Censorship

Censors enforce hard limits that cannot be overridden by any agency or critic.

A censor says: **this path is forbidden regardless of the argument for it.**

```text
Do not send this data to any cloud service.
Do not act without human approval.
Do not expose patient data outside this system.
Do not make a payment above the authorised limit.
Do not increase an agency's authority level without a constitution change.
Do not allow a delegated action chain deeper than 3 levels.
```

Censors are not critics. Critics challenge on merit. Censors enforce unconditionally.

A proposal that violates a censor is blocked. The block is recorded. The settlement notes the block.

See [../05-censors/README.md](../05-censors/README.md) for the full set of censors.

---

## Settlement

After criticism and censorship, the society settles on an authorised next step.

A settlement is not just a decision.

It is a **visible record of how the decision formed.**

A settlement records:

```yaml
settlement_id: settlement.supplier-invoice.2026-001
stimulus: supplier-invoice-uploaded
timestamp: 2026-05-07T09:15:00Z

activated:
  agency.supplier-bee: 0.91
  agency.finance-watch: 0.84
  critic.cost: 0.78

proposals:
  - from: agency.supplier-bee
    proposal: Flag 18% price increase for owner review.
  - from: agency.finance-watch
    proposal: Compare against 12-month pricing history.

objections:
  - from: critic.cost
    objection: No comparison to prior invoices yet made. Proposal is premature.

settlement:
  action: Run price comparison, then prepare owner briefing.
  approval_required: false
  cloud_allowed: false
  authorised_executor: agency.finance-watch
```

No important action happens without a settlement.

A settlement is the difference between "AI did something" and "the society formed a traceable judgment."

See [../02-protocols/05-settlement.md](../02-protocols/05-settlement.md) for the settlement protocol.

---

## Action

The authorised executor acts.

Authorised actions include:

```text
write a summary to a workspace file
open a new issue with specific labels
draft a reply or report
create a branch with proposed changes
prepare an accountant pack
request human approval via an issue comment
call a service on another Society of Repo
apply labels to the originating issue
close an issue with a recorded outcome
```

Actions are always traceable. Every action is a commit, a PR, a comment, or a labelled issue event.

Nothing happens outside version control.

---

## Outcome

The result of the action is observed and recorded.

```text
owner confirmed the briefing was useful
owner corrected a misclassification
the invoice comparison found a discrepancy
the action was not useful
the action was blocked by a downstream censor
```

Outcomes are the input to the memory and reinforcement stages.

---

## Memory

The outcome is written to the appropriate memory repos.

```text
episodic memory  — what happened in this specific event
semantic memory  — any new general fact that emerged
procedural memory — any refinement to a standard procedure
failure memory   — what went wrong and why
K-lines         — reinforcement metadata plus any proposed structural changes
decisions        — the settlement record for future reference
```

Memory is not a hidden log.

Memory is versioned, inspectable, correctable, and reviewable — because it is all Git commits in structured repos.

See [../06-memory/README.md](../06-memory/README.md) for the full memory system.

---

## Reinforcement

Useful patterns are strengthened. Useless or harmful patterns are weakened.

```text
if the owner confirms the briefing was useful:
  → update reinforcement metadata for the K-line that activated this sequence
  → reinforce the agencies that contributed useful signals
  → note the effective procedure

if the briefing was not useful or was wrong:
  → update weakening metadata for the activating K-line
  → record the failure in failure memory
  → flag the responsible agency for evaluation

if a critic correctly identified a problem:
  → reinforce the critic's activation weight for this class
  → reinforce the objection pattern

if an agency was not activated but should have been:
  → propose a structural K-line expansion for governance review
  → flag for governance review
```

Reinforcement metadata updates may be automated within an authorised evolution workflow. Structural K-line changes remain governed changes recorded through PRs and owner approval.

Over time, reinforcement concentrates cognition on the fastest, most accurate paths.

This is the property that makes a Society of Repo get better with use, rather than degrading.

---

## Loop summary

```text
stimulus → perception → activation → response → criticism → censorship
        → settlement → action → outcome → memory → reinforcement
        → (back to stimulus)
```

The loop runs continuously.

Each cycle produces a traceable record.

Each record feeds the next cycle.

The society becomes wiser with each loop it completes.
