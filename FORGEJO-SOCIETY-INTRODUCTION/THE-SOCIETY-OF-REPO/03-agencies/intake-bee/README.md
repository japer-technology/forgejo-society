# Intake Bee

The intake-bee is the first agency that touches every incoming stimulus. It classifies documents and events, extracts initial features, and routes work to the appropriate specialist agencies.

---

## Role

The intake-bee is the perception layer of the Society of Repo.

It does not produce recommendations or proposals about the content of a document.

It produces a **structured feature set** that the activation layer can use to wake the right agencies.

---

## What it does

1. Receives incoming documents, uploads, issues, and webhook events
2. Classifies the content type (invoice, contract, certificate, report, code, complaint, etc.)
3. Extracts key features (date, supplier, price, urgency, privacy flags, domain)
4. Emits a classified stimulus event
5. Labels the originating issue with the classification

---

## What it does not do

- Does not provide recommendations
- Does not read or write to business memory directly
- Does not call external services
- Does not act on the content of a document

---

## Outputs

```text
classified_stimulus event
document_type label on the originating issue
intake_report (feature summary written to workspace)
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Evaluation

| Metric | Description |
| --- | --- |
| `classification_accuracy` | % of documents correctly classified |
| `misclassification_rate` | % of documents incorrectly classified |
| `novel_stimulus_rate` | % of stimuli with no K-line match after two passes |
| `routing_latency` | Time from intake to activated-agencies event |
