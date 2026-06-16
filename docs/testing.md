# Testing

CarbonTwin AI ships with a multi-layer test suite using **Vitest** + **React Testing Library** running on **jsdom**.

## How to run

```bash
bun test                    # all tests
bun test --coverage         # with v8 coverage report
bun test tests/unit         # only unit tests
bun test tests/integration  # only integration tests
```

## Layout

```
tests/
  setup.ts                       jsdom + jest-dom + localStorage mock
  unit/
    carbonCalculations.test.ts   Pure math: factors, DNA classification, Paris target, trees, simulation
    formatters.test.ts           Display helpers, month labels, ID generation
    validation.test.ts           Zod schemas — happy path + every failure branch
    storage.test.ts              load/save, version mismatch, malformed JSON, quota errors
  integration/
    Dashboard.test.tsx           Renders headings, stat cards, charts, ranked sources
```

## Coverage thresholds (enforced)

| Metric | Threshold |
| --- | --- |
| Lines | 90% |
| Functions | 90% |
| Branches | 85% |
| Statements | 90% |

Failing any threshold fails CI.

## What each suite proves

### `carbonCalculations.test.ts`
- Total emissions sum across heterogeneous sources
- Category totals respect the discriminator
- DNA classification handles every archetype including ties
- Paris-target comparison handles below / at / above the target
- Tree-offset is rounded sensibly for sub-tree footprints
- `simulateScenario` is monotonic in reduction percent and zero-safe

### `formatters.test.ts`
- Emission formatting uses kg / t boundary correctly
- Locale-stable month label
- IDs are unique within a single tick

### `validation.test.ts`
- Each schema rejects empty, oversize, malformed-character, out-of-range, future-dated inputs
- Returns `{ valid: false, errors }` shaped error map per field

### `storage.test.ts`
- Round-trip save → load preserves the AppState
- Version mismatch returns `null` (forces fresh state)
- Malformed JSON returns `null` without throwing
- Storage unavailable / quota errors are swallowed safely

### `Dashboard.test.tsx`
- Renders the section heading, all stat cards, and the top-5 ranked sources
- Aria attributes on `role="progressbar"` are present and well-formed
- Trend & breakdown chart containers exist with accessible labels

## CI

`.github/workflows/test.yml` runs on every push and pull request:

1. `bun install --frozen-lockfile`
2. `bun run lint`
3. `bun x tsc --noEmit`
4. `bun test --coverage`
5. `bun run build`

Coverage is uploaded as an artifact for review.

## Adding a test

1. Put pure-function tests in `tests/unit/<module>.test.ts`.
2. Put component/flow tests in `tests/integration/<Component>.test.tsx`.
3. Use Testing Library queries that mirror user behaviour: `getByRole`, `getByLabelText`, never `getByTestId` unless unavoidable.
4. Assert on accessible names — that protects both functionality and a11y in one shot.
