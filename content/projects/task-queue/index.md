---
title: Distributed Task Queue in Go
category: go
link: https://github.com/example/task-queue
articleSlug: building-a-task-queue
---

A distributed task queue written in Go, supporting at-least-once delivery, exponential backoff retries, and horizontal worker scaling behind a shared Redis-backed broker.

![Architecture overview](./images/cover.png)

## Highlights

- Idempotent job handlers with automatic dedup via job fingerprinting.
- Graceful worker draining on `SIGTERM` for zero-downtime deploys.
- Prometheus metrics for queue depth, processing latency, and retry counts.

See the write-up: `articles building-a-task-queue`.
