# Accessibility

CarbonTwin AI targets **WCAG 2.1 Level AA** compliance. This document captures the standards we hold ourselves to and an audit checklist for every PR.

## Principles

1. **Semantic first** — landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`) before ARIA.
2. **One H1 per page** — strict heading hierarchy.
3. **Every interactive element is keyboard reachable** with a visible focus indicator.
4. **Every icon-only control has an accessible name** (`aria-label` or visually-hidden text).
5. **No information conveyed by colour alone** — pair every colour cue with text/iconography.

## Checklist (run on every PR)

### Structure
- [x] Exactly one `<h1>` per route
- [x] Heading levels never skip (h1 → h2 → h3 …)
- [x] Single `<main id="main-content">` with `tabIndex={-1}` for the skip link
- [x] `<header>`, `<nav aria-label>`, `<main>`, `<footer>` landmarks present
- [x] Lists use `<ul>` / `<ol>` with `role="list"` where Safari strips list semantics

### Keyboard & focus
- [x] "Skip to main content" link as the first focusable element
- [x] Visible `focus-visible:ring-2` on every button / link / tab
- [x] No `tabIndex > 0`
- [x] No keyboard traps; modals/menus close on `Esc`
- [x] Tap targets ≥ 44 × 44 px on touch

### ARIA & state
- [x] Icon-only buttons carry `aria-label`
- [x] Toggle buttons use `aria-pressed`
- [x] Tabs use `role="tablist" / "tab" / "tabpanel"` with `aria-selected`
- [x] Disclosures use `aria-expanded` + `aria-controls`
- [x] Active nav item uses `aria-current="page"`
- [x] Progress bars use `role="progressbar"` + `aria-valuenow / valuemin / valuemax`
- [x] Charts have `aria-label` describing the data; tabular alternative provided

### Images & media
- [x] Meaningful images have descriptive `alt`
- [x] Decorative images use `alt=""` or `aria-hidden="true"`
- [x] Emoji used as icons are wrapped with `aria-hidden="true"`

### Colour & contrast
- [x] All text meets ≥ 4.5:1 contrast (large text ≥ 3:1)
- [x] Status indicators pair colour with text/icon (e.g. "✓ Completed", not just green)
- [x] Focus ring is visible on every background (forest-500 ring on white/dark)

### Forms (when added)
- [x] Every input has an associated `<label>` (visible or `aria-label`)
- [x] Validation errors are programmatically associated via `aria-describedby`
- [x] Required fields use `aria-required="true"`

### Motion
- [x] Animations are short (≤ 500 ms), no flashing > 3 Hz
- [x] Respect `prefers-reduced-motion` (Tailwind v4 `motion-safe:` / `motion-reduce:`)

## Tools we run

- `axe-core` via Testing Library `@axe-core/react` — recommended in `tests/integration`
- Lighthouse a11y audit in CI (Vercel preview)
- Manual NVDA / VoiceOver pass before each release

## Known limitations

- High-contrast mode of the brand palette is not yet a separate theme. Dark-mode tokens exist and meet contrast but a dedicated HCM theme is on the roadmap.
- Recharts SVGs rely on the `aria-label` wrapper — a fully tabular fallback is on the roadmap for the trend chart.
