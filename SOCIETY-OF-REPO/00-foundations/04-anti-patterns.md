# Anti-Patterns

A list of patterns that damage or destroy a Society of Repo.

Recognise these early. They are easier to prevent than to undo.

---

## The monarch agent

**Description:** One agent controls everything. All decisions flow through a single central repo or model.

**Why it happens:** It feels simpler. One orchestrator, one place to look.

**Why it destroys the society:** The monarch becomes a single point of failure, a single point of bias, and a single point of accountability avoidance. When it fails, everything fails. When it is wrong, there is no critic to catch it. When it acts, there is no record of how the decision formed.

**Correction:** Decompose the monarch. Assign each capability to a separate constitutional agency. Add critics that are structurally independent of the workers.

---

## The prompt swamp

**Description:** Hundreds of prompts, instructions, and "system messages" scattered across repos, with no constitutions, no metrics, no governance, and no trace of what each one does.

**Why it happens:** Quick start. "Just add a prompt to the workflow." No design pressure early on.

**Why it destroys the society:** No one knows what each prompt does. No one can evaluate whether it works. No one can retire prompts that are wrong. The swamp grows. Prompts conflict. The system becomes unpredictable.

**Correction:** Replace every important prompt with a constitutional agency. If an agent needs a prompt, the prompt lives inside its constitution, versioned and reviewed.

---

## Memory hoarding

**Description:** Every event, every inference, every draft, every partial output is stored with equal activation weight. Nothing decays. Nothing is archived. Everything is equally "remembered."

**Why it happens:** "More memory is better." Cheap storage. No policy.

**Why it destroys the society:** Noise overtakes signal. K-line matching becomes unreliable because irrelevant old patterns compete with useful current ones. The system slows down. Owner briefings become cluttered with stale context.

**Correction:** Implement memory temperature. Hot, warm, cold, archived. Only hot and warm memory is actively matched against stimuli. Cold memory is preserved but not actively activated. Archived memory requires deliberate retrieval.

---

## Cloud leakage

**Description:** Sensitive context is sent to external model APIs because it is convenient or because there is no policy preventing it.

**Why it happens:** The cloud model gives better results. No one wrote a censor. The developer assumed it was fine.

**Why it destroys the society:** Private business data, patient records, financial information, and internal communications leave the local system without governance or audit. This creates legal, ethical, and commercial exposure. When it is discovered, trust in the entire system collapses.

**Correction:** Add a cloud-egress censor as one of the first three repos in any SOR. Make cloud calls require explicit policy permission, not default permission. Log every cloud call with its payload classification and authorising policy.

---

## No settlement

**Description:** Agencies act directly, without a recorded decision structure. Proposals go straight to action.

**Why it happens:** Fast iteration. "Just do the thing."

**Why it destroys the society:** There is no record of why actions happened. There is no way to audit what went wrong. There is no way to improve because there is no trace of the decision. Critics and censors are bypassed. The system becomes opaque.

**Correction:** Nothing non-trivial happens without a settlement record. The settlement does not have to be elaborate — a minimal settlement record is better than none.

---

## No pricing discipline

**Description:** Calls to external SOR services, cloud APIs, and specialist models are made without budgets, rate limits, or cost tracking.

**Why it happens:** "Let the model decide." No cost awareness.

**Why it destroys the society:** Cloud costs accumulate unnoticed. External SOR service bills arrive unexpectedly. Model usage is not matched to value. There is no feedback loop between cost and benefit.

**Correction:** Every external call has a maximum cost. Every service contract has a spending limit. Cost-critic is activated on every external-service proposal.

---

## No retirement

**Description:** Every agency ever created continues to run indefinitely, even when it is stale, noisy, duplicative, or wrong.

**Why it happens:** Inertia. "What if we need it?" No governance pressure to retire.

**Why it destroys the society:** The ecology fills with zombie agencies that consume runner slots, generate noise, and distort K-line matching. The signal-to-noise ratio degrades. Owners stop trusting briefings.

**Correction:** Quarterly evaluation of all agencies against their performance metrics. Agencies below threshold enter probation. Agencies that fail probation are retired. Retired agencies are archived with lineage preserved.

---

## Fake autonomy

**Description:** The system claims it can make legal, clinical, financial, employment, or safety decisions without human authority.

**Why it happens:** "The AI is smart enough." Desire to reduce human workload. Misunderstanding of what the system can actually guarantee.

**Why it destroys the society:** These are categories where being wrong causes real harm. No AI system at any maturity level should act in these categories without human approval. When it does and it is wrong, the harm is real and the system is discredited.

**Correction:** Enumerate the categories that always require human approval in the constitution and in the approval-gate. Censors enforce these unconditionally. The society proposes, presents evidence, and prepares recommendations — but the human decides.

---

## The over-delegated chain

**Description:** Agency A calls Agency B, which calls Agency C, which calls Agency D, with no limit on delegation depth and no record of who originally authorised the chain.

**Why it happens:** Convenience. "Let the agents sort it out."

**Why it destroys the society:** Authority diffuses. Accountability disappears. An action that required human approval at the start of the chain is taken automatically by the fourth hop. The delegation-depth censor exists precisely to prevent this.

**Correction:** Maximum delegation depth of 3. Every hop records the originating authority. The delegation-depth censor enforces the limit unconditionally.

---

## Over-confidence without evidence

**Description:** An agency produces a high-confidence recommendation without showing the evidence that grounds the confidence.

**Why it happens:** LLM outputs often sound confident even when they are guessing. No evidence requirement in the agency constitution.

**Why it destroys the society:** Owners act on confident-sounding recommendations that are wrong. The overconfidence-critic exists to catch this, but only if it is activated.

**Correction:** Every recommendation over a defined confidence threshold must include an evidence trace. The overconfidence-critic challenges any recommendation without sufficient evidence.

---

## Summary

| Anti-pattern | Core failure | Primary correction |
|---|---|---|
| Monarch agent | Single point of failure and opacity | Decompose into constitutional agencies |
| Prompt swamp | No governance, no trace, no metrics | Constitutional agencies with versioned prompts |
| Memory hoarding | Signal buried in noise | Memory temperature and decay policy |
| Cloud leakage | Sensitive data leaves without governance | Cloud-egress censor as early priority |
| No settlement | No audit trail for decisions | Mandatory settlement records |
| No pricing discipline | Uncontrolled external costs | Cost limits on every external call |
| No retirement | Zombie agencies degrade signal | Quarterly evaluation and retirement policy |
| Fake autonomy | Real harm from unilateral AI decisions | Human approval requirement in constitution |
| Over-delegated chain | Authority diffuses, accountability disappears | Delegation-depth censor |
| Over-confidence without evidence | Wrong actions taken with false confidence | Evidence requirement and overconfidence-critic |
