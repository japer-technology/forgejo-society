# 09 — Metrics

> What we measure, how we learn, and how publicity feeds the cognitive loop.

This document defines what publicity measures and, just as importantly,
what it deliberately does not. Metrics here exist to inform the
project's learning, not to drive its publicity.

---

## What we measure

We track a small number of things, all of them honest signals about
relationships rather than vanity counters:

1. **Inquiry quality.** Of inquiries received, how many resulted in
   substantive coverage, talks, or collaborations? Recorded in
   [`media-list/`](media-list/README.md) and
   [`coverage/`](coverage/README.md).
2. **Coverage accuracy.** Of logged coverage in
   [`coverage/`](coverage/README.md), how many entries required a
   correction request? How many were resolved?
3. **Audience fit.** Of new contributors, issue authors, and operators
   who arrived via a publicity surface, how many engaged beyond a
   single interaction?
4. **Announcement durability.** For each announcement in
   [`announcements/`](announcements/README.md), how long did it remain
   accurate without a follow-up correction?
5. **Crisis discipline.** When the protocol in
   [`07-crisis.md`](07-crisis.md) is invoked, did the project meet its
   stated cadence, and did the after-action arrive on time?

## What we deliberately do not measure

- Raw social-media reach, impressions, or follower counts.
- Aggregator rank.
- Sentiment scores derived from automated tools.

These can be useful as background context, but they are not project
goals and are not reported in this folder.

## How we learn

Once per quarter, the maintainer responsible for publicity opens a
pull request adding a short retrospective to this document's
[`retrospectives/`](#retrospectives) appendix (created when the first
retrospective is filed). Each retrospective:

- Reviews the metrics above for the quarter.
- Names one thing the project will do differently next quarter.
- Links to the supporting entries in
  [`announcements/`](announcements/README.md),
  [`coverage/`](coverage/README.md),
  [`events/`](events/README.md), and
  [`statements/`](statements/README.md).

## Feeding the cognitive loop

Forgejo Society treats publicity as one of its sensors. What the
outside world says about the project is information about how the
project's own materials are landing. Patterns in coverage corrections
should produce changes in
[`../FORGEJO-SOCIETY-PROMOTION/`](../FORGEJO-SOCIETY-PROMOTION/README.md)
and, where appropriate, in the project's own specification. The metric
of last resort is whether the project, over time, becomes easier and
more honest to describe.

## Status

Scaffold. The first retrospective is filed at the end of the first
full quarter in which any of the surfaces above produce data.
