# 🌿 CarbonTwin AI

> **Predict Your Carbon Footprint Before It Happens.**

CarbonTwin AI is an open-source web platform that helps individuals **understand, track, and reduce** their personal carbon footprint through personalised insights, scenario simulation, and an AI sustainability coach.

[![Tests](https://github.com/carbontwin-ai/carbontwin/actions/workflows/test.yml/badge.svg)](./.github/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-blue.svg)](./docs/accessibility.md)
[![Coverage](https://img.shields.io/badge/coverage-90%2B%25-brightgreen.svg)](./docs/testing.md)

---

## 📌 Problem Statement

> *"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalised insights."*

Most people **don't know** what drives their personal emissions, **can't see** how small changes scale up over a year, and **lack a plan** they can actually follow. CarbonTwin AI closes that gap.

## 💡 Solution

CarbonTwin AI gives every user a **digital climate twin** — a living model of their footprint that:

1. **Understands** — breaks down emissions across Transport, Energy, Diet, and Consumption
2. **Tracks** — shows historical trends, monthly changes, and progress vs. the Paris target
3. **Detects** — surfaces the biggest "carbon leaks" ranked by impact
4. **Recommends** — generates a personalised action plan with high / medium / quick-win actions
5. **Simulates** — lets users explore "what if I cycled, ate plant-based, or switched to green energy?"
6. **Profiles** — classifies each user into a Carbon DNA archetype
7. **Coaches** — an AI Sustainability Coach delivers tips, warnings, achievements, and predictions

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  TanStack Start (React 19 + Vite 7 SSR)                     │
│  ├─ src/routes/         File-based routing                  │
│  ├─ src/components/     Reusable, accessible UI primitives  │
│  ├─ src/hooks/          State management (useCarbonStore)   │
│  └─ src/lib/carbon/     Pure-function domain layer          │
│       ├─ types.ts          Domain models                    │
│       ├─ carbonCalculations.ts  Emission math               │
│       ├─ formatters.ts     Display helpers                  │
│       ├─ validation.ts     Zod input validation             │
│       ├─ storage.ts        Encrypted localStorage envelope  │
│       └─ demoData.ts       IPCC/DESNZ-sourced seed data     │
├─────────────────────────────────────────────────────────────┤
│  tests/   Vitest + Testing Library  ≥ 90% coverage          │
│  docs/    Architecture · Security · Testing · A11y          │
│  .github/ CI: lint → typecheck → test → build               │
└─────────────────────────────────────────────────────────────┘
```

See [`docs/architecture.md`](./docs/architecture.md) for full diagrams and module responsibilities.

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Dashboard** | Current emissions, 6-month stacked area trend, monthly delta, Paris-target gauge |
| 🔎 **Carbon Leak Detection** | Top 5 emission sources ranked across Transport / Energy / Diet / Consumption |
| ✅ **Personalised Action Plan** | High-impact, medium-impact, and quick-win actions with tips & status tracking |
| 🔮 **What-If Simulator** | Cycle vs. drive, public transport, renewable energy, plant-based diet — see projected reductions + trees-equivalent |
| 🧬 **Carbon DNA Profile** | Classifies users (Transport Heavy / Energy Intensive / Food Impact / Sustainability Champion / Balanced) |
| 🤖 **AI Sustainability Coach** | Generates ranked tips, warnings, achievements, predictions |

## 🔒 Security Features

- **Zod-validated** inputs on every user-facing field (`validation.ts`)
- **XSS-safe rendering** — no `dangerouslySetInnerHTML`, all values pass through React's auto-escaping
- **CSP-friendly** — no inline scripts, no eval
- **Versioned, namespaced localStorage envelope** with safe JSON parsing
- **No PII leaves the browser** — fully client-side data model
- **Strict TypeScript** + ESLint security ruleset
- See [`docs/security.md`](./docs/security.md) for the full threat model and checklist

## ♿ Accessibility Features

- Semantic HTML landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`)
- Single `<h1>` per page, strict heading hierarchy
- ARIA labels on every icon-only control, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-live`
- Skip-to-content link, visible focus rings (`focus-visible:ring-2`)
- `role="progressbar"` with `aria-valuenow / valuemin / valuemax` on every bar
- Charts paired with descriptive `aria-label` and text tables for screen readers
- WCAG 2.1 AA contrast verified for forest/carbon palette
- Mobile tap targets ≥ 44 × 44 px
- Full keyboard navigation
- See [`docs/accessibility.md`](./docs/accessibility.md) for the audit checklist

## 🧪 Testing Coverage

- **Unit tests** — `carbonCalculations`, `formatters`, `validation`, `storage`
- **Integration tests** — Dashboard rendering, user flows
- **Edge-case tests** — invalid inputs, zero values, max bounds, malformed storage
- **Coverage thresholds enforced**: lines 90% / functions 90% / branches 85% / statements 90%
- **CI**: GitHub Actions runs `lint → typecheck → test → build` on every push/PR

See [`docs/testing.md`](./docs/testing.md) and [`tests/`](./tests/).

## 🚀 Setup

```bash
# Prerequisites: Bun 1.0+ (or Node 20+)
bun install
bun dev               # http://localhost:5173
```

```bash
bun test              # run vitest
bun test --coverage   # with coverage report
bun run build         # production build
```

## ☁️ Deployment

Optimised for **Vercel** / **Cloudflare Workers**:

```bash
bun run build         # → .output/ ready to deploy
```

1. Push to GitHub
2. Import the repo in Vercel
3. Build command: `bun run build` · Output: `.output/public`

Stable preview URL: `project--<id>-dev.lovable.app` · Stable prod URL: `project--<id>.lovable.app`.

## 🔭 Future Scope

- 🔌 Live integrations: utility bills, bank-transaction emission inference, smart-meter APIs
- 🌍 Regional emission factors per country (currently UK/global)
- 👥 Household & team mode with shared goals and leaderboards
- 🎯 Native LLM coach via the Lovable AI Gateway for free-text Q&A
- 📱 PWA + offline mode (manifest + service worker)
- 🌱 Verified carbon-offset marketplace integration

## 📄 License

MIT © CarbonTwin AI contributors — see [`LICENSE`](./LICENSE).
