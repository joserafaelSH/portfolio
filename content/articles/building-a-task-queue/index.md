---
title: Building a Task Queue
date: 2026-01-15
slug: building-a-task-queue
tags: [go, concurrency, distributed-systems]
---

# Building a Task Queue

Most task queues fail in the same handful of ways: duplicate delivery, poison messages, and workers that die mid-job and take the job with them. Here's how I approached each one.

![Queue diagram](./images/diagram.png)

## Delivery semantics

At-least-once delivery is the only honest default for a distributed queue — exactly-once doesn't really exist across a network boundary. Instead, handlers are written to be idempotent, keyed on a fingerprint of the job payload:

```go
func fingerprint(job Job) string {
	h := sha256.Sum256(job.Payload)
	return hex.EncodeToString(h[:])
}
```

## Retry strategy

Failures get exponential backoff with jitter, capped at a maximum number of attempts before landing in a dead-letter queue for manual inspection.

```bash
queue stats --topic emails
```

## What's next

Priority lanes, and a proper admin UI instead of `queue stats` at a terminal.
