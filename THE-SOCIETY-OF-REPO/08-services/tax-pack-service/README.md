# Tax Pack Service

Prepares structured BAS and tax pack data for accountant review.

This is the tax-bee's quarterly preparation capability, published as a governed service for other societies.

---

## What it delivers

Given a financial export for a defined period, this service returns:

- structured BAS summary (GST collected, GST paid, PAYG withheld)
- anomaly flag list (transactions requiring accountant attention)
- categorised transaction summary
- evidence trace (document references)

---

## What it does not deliver

- Tax advice
- Lodgement services
- Raw financial records in the output

---

## Service contract

See [service-contract.yaml](service-contract.yaml).

---

## Pricing

AUD 25.00 per quarter.

---

## Reputation metrics

| Metric | Description |
|---|---|
| `completion_rate` | % of requests completed successfully |
| `dispute_rate` | % of transactions disputed |
| `average_buyer_rating` | Mean buyer satisfaction score (1–5) |
| `accountant_correction_rate` | % of summaries requiring accountant correction |
