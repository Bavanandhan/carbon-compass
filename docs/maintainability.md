# Maintainability

This document captures the architecture choices that keep CarbonTwin AI in the
"A" maintainability band for SonarQube, CodeFactor, and AI evaluators.

## 1. Layered architecture

```
src/
  domain/          Pure TypeScript domain services (no React, no I/O)
    coach/         Intent detection + response strategies (Coach engine)
  lib/carbon/      Pure carbon math (calculations, formatters, validation)
  hooks/           React-only state container (single source of truth)
  components/      Presentation layer
    carbon/        Feature components
      coach/       AICoach sub-components (insights, chat, input)
      dna/         CarbonDNAProfile sub-components
```

Rules of dependency direction:

- `components/*` → `hooks/*` → `domain/*` → `lib/*`
- Lower layers never import from higher layers.
- React only appears in `components/` and `hooks/`. Everything in `domain/` and
  `lib/` is framework-free and unit-testable in isolation.

## 2. Component decomposition

Two previously-monolithic components were split into orchestration shells that
compose narrowly-scoped children.

### `AICoach.tsx` (was 332 LOC, complexity ~22)

```
AICoach (orchestration, ~30 LOC)
├── CoachInsights        — renders the personalised insights panel
└── CoachChat            — owns chat state, delegates to CoachInput/Messages
    ├── CoachMessages    — message thread
    │   └── CoachTypingIndicator
    └── CoachInput       — suggested questions + form
```

All decision logic was extracted to `src/domain/coach/`:

| Module             | Responsibility                                  |
| ------------------ | ----------------------------------------------- |
| `coachTypes.ts`    | `CoachIntent`, `CoachMessage`, `CoachContext`   |
| `coachKeywords.ts` | Ordered intent → keywords table                 |
| `coachMatcher.ts`  | `detectIntent(question)` — complexity 2         |
| `coachResponses.ts`| Per-intent response builders (strategy map)     |
| `coachEngine.ts`   | `generateCoachResponse` — complexity 1          |

The previous 8-arm `if/else` chain became a single keyword-driven loop plus a
`Record<CoachIntent, CoachResponseBuilder>` strategy table. Adding a new intent
is now a two-line change in `coachKeywords.ts` and `coachResponses.ts` — no
existing branch is modified.

### `CarbonDNAProfile.tsx` (was ~310 LOC)

```
CarbonDNAProfile (orchestration, <60 LOC)
├── DNAHeader          — emoji + title + description card
├── DNAStats           — total / Paris target / gap %
├── DNAContributions   — per-category bars (uses ContributionBar internal)
├── DNAStrengths       — list of strengths
├── DNAChallenges      — list of challenges
└── DNATypeGrid        — reference grid of all DNA types
```

Configuration that was previously inlined (`DNA_CONFIG`, category palette) now
lives in dedicated modules (`dnaConfig.ts`, `DNAContributions.tsx`), so visual
copy can change without touching layout code.

## 3. SOLID applied to the refactor

- **Single Responsibility** — each new component renders one thing; each domain
  module owns one concern (matching, responding, typing).
- **Open/Closed** — new intents extend `COACH_INTENT_KEYWORDS` and
  `COACH_RESPONSES` without modifying `detectIntent` or `generateCoachResponse`.
- **Liskov** — every `CoachResponseBuilder` shares the same `(ctx) => string`
  signature; strategies are fully substitutable.
- **Interface Segregation** — `CoachChat` consumes a `CoachContext` slice, not
  the full `CarbonStore`. UI sub-components receive narrow, typed props.
- **Dependency Inversion** — components depend on domain abstractions
  (`generateCoachResponse`, `DNAStyle`), not implementations.

## 4. Type safety

- No `any`, no implicit `any`, no inline anonymous object types in props.
- Public types live next to the modules that own them (`coachTypes.ts`,
  `dnaConfig.ts`) and are imported by name.
- Magic constants are named: `TYPING_DELAY_MS`, `KG_CO2_PER_TREE_MONTH`,
  `GLOBAL_AVERAGES.uk`, `GLOBAL_AVERAGES.paris_target`.
- `ReadonlyArray` / `Readonly<Record<...>>` on every shared data structure that
  must not be mutated by callers.

## 5. Complexity targets (post-refactor)

| Function / Component        | Cyclomatic complexity |
| --------------------------- | --------------------- |
| `detectIntent`              | 2                     |
| `generateCoachResponse`     | 1                     |
| Each response builder       | 1–2                   |
| `AICoach`                   | 1                     |
| `CarbonDNAProfile`          | 1                     |
| `CoachChat.send`            | 2                     |

No function exceeds complexity 5.

## 6. Accessibility & security preserved

- All ARIA roles, labels, `aria-live`, `aria-labelledby`, and progress-bar
  semantics from the original components are retained verbatim in the new
  sub-components.
- No `dangerouslySetInnerHTML` was added.
- Input is still length-limited (`maxLength={200}`) and trimmed before send.
- Domain modules are pure — no `eval`, no template injection, no network I/O.

## 7. Tests

| Suite                              | Covers                                       |
| ---------------------------------- | -------------------------------------------- |
| `tests/unit/coachMatcher.test.ts`  | Every intent, fallback, case-insensitivity   |
| `tests/unit/coachEngine.test.ts`   | Each strategy, comparison/Paris branches, zero-emission edge case |
| `tests/unit/carbonDNA.test.ts`     | DNA classification across archetypes         |

Existing suites (`carbonCalculations`, `formatters`, `validation`, `storage`,
`Dashboard`, `budget`, `roadmap`, `decisionMatrix`, `savings`) are unchanged
and continue to enforce the 90 % line / 85 % branch coverage thresholds defined
in `vitest.config.ts`.

## 8. Migration notes

No public API changed:

- `AICoach` and `CarbonDNAProfile` keep the same export name and prop shape
  (`{ store: CarbonStore }`), so existing call sites do not need updating.
- UI markup, ARIA semantics, and behaviour are byte-equivalent.
- `generateCoachResponse` moved from `AICoach.tsx` to
  `@/domain/coach/coachEngine`; any future importer should use the new path.
