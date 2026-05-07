# Contract Extraction Service

Extracts obligations, dates, risks, and owner questions from business contracts.

This is the contract-bee's capability, published as a governed service for other societies.

---

## What it delivers

Given a business contract, this service returns:

- obligation summary (key commitments and their dates)
- deadline list (renewal dates, notice periods, payment dates)
- risk flags (unusual terms, missing clauses, liability concerns)
- owner question list (things requiring owner judgment)
- evidence trace (citations from the document)

---

## What it does not deliver

- Legal advice
- Contract approval or sign-off
- Negotiation recommendations
- Raw contract text in the output

---

## Service contract

See [service-contract.yaml](service-contract.yaml).

---

## Pricing

AUD 8.00 per document.

---

## Reputation metrics

| Metric | Description |
|---|---|
| `completion_rate` | % of requests completed successfully |
| `dispute_rate` | % of transactions disputed |
| `average_buyer_rating` | Mean buyer satisfaction score (1–5) |
| `missed_obligation_rate` | % of obligations later found to be missed |
