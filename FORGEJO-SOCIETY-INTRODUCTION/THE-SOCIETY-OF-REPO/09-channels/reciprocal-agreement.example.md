# Reciprocal Agreement — Example

This is an example reciprocal (barter) agreement between two SORs.

```yaml
reciprocal_agreement:
  id: recip.sor.forgejo-society.sor.example-partner.2026-001
  parties:
    - sor.forgejo-society
    - sor.example-partner
  status: example  # change to: proposed | active | expired | terminated

  grant:
    sor.forgejo-society_receives:
      service: service.example-partner-capability.v1
      credits: 100
      credit_period_months: 12

    sor.example-partner_receives:
      service: service.contract-obligation-extraction.v1
      credits: 100
      credit_period_months: 12

  rules:
    transferable: false
    expires: 2026-12-31
    revocable_for_policy_breach: true
    audit_required: true
    dispute_window_days: 30

  privacy:
    both_parties_agree:
      - no raw sensitive data shared in either direction
      - all payloads classified before transmission
      - cloud-egress-censor active on both sides
      - deletion attestation required after each transaction

  established_date: 2026-05-07
  last_reviewed: 2026-05-07
```
