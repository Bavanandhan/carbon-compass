# Architecture

CarbonTwin AI is a fully client-rendered React SPA served by **TanStack Start** (Vite + React 19 + SSR shell). Domain logic lives in a pure-function layer that is trivially testable and framework-agnostic.

## Layers

```text
┌────────────────────────────────────────────────────────┐
│  Presentation  (src/components/carbon/*)               │
│   Dashboard · WhatIfSimulator · ActionPlan ·           │
│   CarbonDNAProfile · AICoach · Header · Card           │
└──────────────▲─────────────────────────────────────────┘
               │ React props · zero side-effects
┌──────────────┴─────────────────────────────────────────┐
│  State       (src/hooks/useCarbonStore.ts)             │
│   - useState + useMemo + useCallback                   │
│   - persists to versioned localStorage envelope        │
└──────────────▲─────────────────────────────────────────┘
               │ pure imports
┌──────────────┴─────────────────────────────────────────┐
│  Domain      (src/lib/carbon/*)                        │
│   types · carbonCalculations · formatters ·            │
│   validation · storage · demoData                      │
└────────────────────────────────────────────────────────┘
```

## Folder structure

```
src/
  routes/                File-based routing (TanStack Router)
    __root.tsx           Shell, error boundary, 404
    index.tsx            Home (renders the app)
  components/carbon/     UI primitives and feature components
  hooks/useCarbonStore.ts  React state, memoised selectors
  lib/carbon/            Pure domain layer (100% unit-tested)
  styles.css             Tailwind v4 design tokens
tests/
  unit/                  Domain-layer tests
  integration/           Component & flow tests
  setup.ts               jsdom + jest-dom + localStorage mock
docs/                    Architecture, security, testing, a11y
.github/workflows/       CI: lint → typecheck → test → build
```

## Design decisions

- **Pure domain layer** — every calculation in `carbonCalculations.ts` is a pure function that takes data and returns data. No I/O, no React, no globals. This makes the math directly testable and trivially auditable against IPCC/DESNZ factors.
- **Single store hook** — `useCarbonStore` is the only state surface. Components receive a typed `CarbonStore` and never reach into `localStorage` or services directly.
- **Versioned storage envelope** — `{ version, timestamp, data }` lets us migrate state shapes without losing user data.
- **Strong typing** — `strict: true`, no `any` in domain code, Zod schemas mirror TypeScript types.
- **No global mutable state** — facilitates SSR safety and predictable testing.

## Data flow

1. `useCarbonStore` hydrates from `loadState()` (or demo data on first run).
2. Memoised selectors derive `totalEmissions`, `emissionsByCategory`, `carbonDNA`, `potentialMonthlySavings`.
3. Components render via props; user interactions call typed `updateActionStatus`, `addEntry`, `quickLog`.
4. Every state mutation is persisted to the versioned envelope.

## Performance

- `useMemo` / `useCallback` on every derived value
- Charts lazily render via Recharts `ResponsiveContainer`
- Route-level code-splitting via TanStack Router
- No global state library — zero runtime overhead beyond React
- Strict CSS-token design system (Tailwind v4) — no runtime style computation
