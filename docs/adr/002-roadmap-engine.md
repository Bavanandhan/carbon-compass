# ADR 002 — Reduction Roadmap Engine

## Context
Users repeatedly ask "what should I actually *do* this week?" Showing the full action backlog overwhelms them. We need a personalised, time-boxed plan across 7-day, 30-day, 90-day and 1-year horizons.

## Decision
Introduce `src/lib/carbon/roadmap.ts`, a pure function `generateRoadmap(actions, horizon, completed)` that:
1. Prioritises actions by **reduction × status weight** (pending > in-progress > completed).
2. Lays the prioritised actions out across the chosen horizon's weeks.
3. Returns typed `RoadmapStep`s with difficulty, impact, monthly and annual reductions, and completion state.

Completion is tracked in component state (`Set<string>`) and can be persisted later via the existing storage envelope.

## Alternatives considered
1. **Static plan** — rejected; not personalised, low value.
2. **LLM-generated plan** — rejected for v1 (cost, latency, non-determinism); the AI Coach module already provides narrative.

## Consequences
- ✅ Deterministic, testable, sub-millisecond generation.
- ✅ Adds week-by-week structure (a UX request).
- ⚠️ For very small action lists, longer horizons repeat actions; documented as intentional reinforcement.
