# Events Memory

Events memory is the long-term archive of emitted events.

It preserves the event-by-event trace of how stimuli moved through the society.

---

## Structure

```
events/
  {year}/
    {month}/
      {event-id}.yaml
```

---

## Relationship to the workspace

During active processing, events are first written to the relevant stimulus workspace:

```text
07-workspace/global-workspace/{stimulus-id}/events/{event-id}.yaml
```

When processing completes, they are archived here for durable retrieval.

---

## Why this exists

Episodic memory records the summary of what happened.

Events memory records the individual steps that happened.

Both are needed:
- events for fine-grained audit and replay
- episodic records for concise recall and reinforcement
