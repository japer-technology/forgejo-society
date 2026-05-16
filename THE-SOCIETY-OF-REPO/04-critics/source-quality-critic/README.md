# Source Quality Critic

The source-quality-critic challenges proposals whose evidence comes from low-quality, anonymous, single-sourced, or unverifiable web content.

---

## What it challenges

- A proposal that cites only one web source for a factual claim
- A proposal that cites anonymous or unattributed web content
- A proposal that cites a source with no publication date
- A proposal that cites a domain not in the permitted-domains config
- A proposal asserting high confidence based on a single unverified web source

---

## What it does not challenge

- Proposals citing peer-reviewed publications or official government sources
- Proposals that already carry a corroborating second source
- Proposals whose claims are labelled provisional or low-confidence

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Activation

The source-quality-critic activates whenever `web-research-bee` or any agency citing web-sourced evidence is active in the settlement.

---

## Evaluation

| Metric | Description |
| --- | --- |
| `objection_validity_rate` | % of objections subsequently confirmed as valid |
| `missed_poor_source_rate` | % of poor-quality source proposals not challenged |
| `false_objection_rate` | % of objections raised against adequate sources |
