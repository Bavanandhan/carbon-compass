# ADR 003 — Carbon Budget System

## Context
Users find emissions abstract. Treating CO₂ like personal-finance budgeting (limit, used, remaining, projected overspend) makes the abstract concrete.

## Decision
Add `src/lib/carbon/budget.ts` with:
- `buildBudgetReport(used, budget, date)` — produces a typed `BudgetReport` including pace-vs-linear and projected monthly total.
- `classifyBudgetStatus(percent)` — four-tier classification (`under` / `approaching` / `over` / `critical`).
- `budgetAlert(report)` — human-readable status text.
- Default budget aligned to the Paris Agreement (208 kg CO₂e/month).

## Alternatives considered
1. **Yearly budget only** — rejected; monthly feedback is more actionable.
2. **Region-aware default** — deferred; will be derived from `profile.location` once geocoding is in place.

## Consequences
- ✅ Maps cleanly to existing dashboard primitives.
- ✅ Pace-vs-linear computation surfaces over-spending early.
- ⚠️ Default budget is opinionated; users can override via the budget editor.
