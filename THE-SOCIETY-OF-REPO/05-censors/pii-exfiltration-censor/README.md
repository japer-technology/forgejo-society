# PII Exfiltration Censor

The pii-exfiltration-censor blocks any action that would transmit, share, or expose personal identifying information (PII) beyond the local-access boundary without explicit policy authorisation. It is unconditional.

---

## Why this censor exists

Personal data sent to an external system cannot be retrieved.

PII exposure creates:
- Privacy violations and breach notification obligations
- Loss of owner trust in the society
- Legal consequences under applicable privacy law
- Harm to the persons whose data is exposed

The cloud-egress-censor governs what leaves the system. The pii-exfiltration-censor specifically governs **who and what** leaves — it applies even to nominally authorised cloud calls, if those calls contain PII that was not explicitly approved for inclusion.

---

## What it blocks

- Outbound HTTP calls that include PII in query parameters, headers, or body without policy authorisation
- Writes to shared repos or workspaces that include raw PII beyond the local-access boundary
- Research queries that include personal data (name, email, address, national ID, health data)
- Proposals to share calendar, task, or personal note content with external parties
- Cloud model calls that include unredacted PII in the prompt

---

## What it does not block

- Local processing of PII within the local-access boundary
- Writes to local memory repos accessible only to the owner
- Explicitly authorised external sharing with a recorded policy reference and the owner's governance approval

---

## Behaviour when triggered

1. The action is blocked immediately and unconditionally
2. A `block.applied` event is emitted
3. The block is recorded in the pii-exfiltration violation log (without the PII value)
4. The owner-briefing is notified

---

## Constitution

See [constitution.yaml](constitution.yaml).
