# ADR 004 — Impact-vs-Cost Decision Matrix

## Context
Given a long list of possible actions, users need a defensible answer to "what should I do first?" — one that accounts for both *impact* and *cost*.

## Decision
Implement `src/lib/carbon/decisionMatrix.ts`:
- Normalise impact to 0–100 using `reduction / max(reduction)`.
- Map cost levels (`free` / `low` / `medium` / `high`) to a 0–100 cost score.
- Classify each action into one of four quadrants: **quick-win**, **strategic**, **fill-in**, **avoid**.
- Composite priority: `impactScore * 0.7 + (100 - costScore) * 0.3` (impact weighted higher than cost).
- `topRecommendation()` prefers the highest-priority quick win, falling back to the highest-priority overall.

## Alternatives considered
1. **Pure impact ranking** — rejected; ignores feasibility.
2. **Multi-criteria decision analysis (AHP)** — overkill for v1.
3. **ML-driven personalisation** — deferred; needs longitudinal data.

## Consequences
- ✅ Transparent, deterministic, explainable rankings.
- ✅ Easy to extend with new cost categories or weights.
- ⚠️ Cost classification is currently heuristic; future revisions can read locale-specific cost data.
