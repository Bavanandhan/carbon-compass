# ADR 001 — Pure-Functional Carbon Engine

## Context
The carbon engine performs many derived calculations (totals by category, Paris-target comparison, Carbon DNA classification, tree-offset equivalence). These need to be auditable against IPCC/DESNZ factors and trivially testable.

## Decision
Implement the entire carbon engine as **pure functions** in `src/lib/carbon/carbonCalculations.ts`. No I/O, no React, no globals. All emission factors are exported, named constants.

## Alternatives considered
1. **Class-based engine** — rejected; introduces hidden state and makes mocking harder.
2. **Server-side calculations** — rejected; the math is cheap and adds latency, plus offline-first is a product requirement.
3. **Third-party library** — none with sufficiently transparent factors at the time of writing.

## Consequences
- ✅ 100% unit-testable; no jsdom needed for math tests.
- ✅ Tree-shakeable; unused calculators drop from the bundle.
- ✅ Easy to swap regional factor sets (e.g. US EPA) in the future.
- ⚠️ Factor updates require a code release; mitigated by clear constant naming and centralised location.
