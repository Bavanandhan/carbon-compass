# Design Patterns

CarbonTwin AI is intentionally structured around a small set of well-known software-engineering patterns. This document captures *why* each pattern is used and *where* to find an instance of it in the codebase.

## 1. Pure Domain Layer (Functional Core, Imperative Shell)

All carbon math lives in `src/lib/carbon/` as pure, side-effect-free functions:

- `carbonCalculations.ts` — emission totals, Carbon DNA, Paris-target comparison.
- `roadmap.ts` — reduction roadmap engine.
- `budget.ts` — carbon budget evaluation.
- `decisionMatrix.ts` — impact-vs-cost prioritisation.
- `savings.ts` — savings tracker, streaks.

The React layer is the imperative shell: it calls these pure functions and renders the result. This makes the domain trivially unit-testable and framework-agnostic.

## 2. Service Layer

Each feature module (Roadmap, Budget, Decision Matrix, Savings) exposes a tightly-typed service interface — `generateRoadmap`, `buildBudgetReport`, `buildDecisionMatrix`, `buildSavingsReport`. Components do not duplicate calculations; they consume these services.

## 3. Single Source of Truth (Store Hook)

`src/hooks/useCarbonStore.ts` is the only place that owns the app's mutable state. It memoises derived values (`totalEmissions`, `emissionsByCategory`, `carbonDNA`, `potentialMonthlySavings`) and exposes a typed `CarbonStore` to consumers. Components never reach into `localStorage` directly.

## 4. Strategy Pattern (Carbon DNA Classification)

`determineCarbonDNA()` selects one of six DNA strategies based on the dominant emission category. Adding a new DNA strategy is a one-line change to the classifier; no caller needs to be touched.

## 5. Repository Pattern (Versioned Storage Envelope)

`src/lib/carbon/storage.ts` abstracts persistence behind `loadState()` / `saveState()` with a `{ version, timestamp, data }` envelope. Migrations can be added without breaking existing user data.

## 6. Adapter Pattern (Server Functions)

TanStack `createServerFn` calls are wrapped behind typed RPC functions in `src/lib/*.functions.ts`. Components import the typed function; the server boundary, validation (Zod), and auth middleware are concerns of the adapter.

## 7. Dependency Inversion

The UI depends on abstractions (`CarbonStore`, `SavingsReport`, `BudgetReport`, `Roadmap`), not concrete implementations. Swapping the backend (e.g. moving from `localStorage` to Supabase) is a one-file change.

## 8. SOLID applied

- **S**: each module has one reason to change (e.g. `budget.ts` only changes when budget rules change).
- **O**: pure functions are extended via composition, not modification.
- **L**: DNA strategies share a single return type (`CarbonDNAType`) and are substitutable.
- **I**: components receive narrow `store` slices and typed reports — no god-objects.
- **D**: high-level UI depends on domain types, not low-level storage.

## 9. DRY through named constants

No magic numbers. Emission factors (`EMISSION_FACTORS`), tree absorption (`KG_CO2_PER_TREE_MONTH`), fuel intensity (`KG_CO2_PER_LITRE_PETROL`), and savings conversion (`GBP_PER_KG_CO2_SAVED`) are all named, exported, and unit-tested.
