# Performance

## Bundle and runtime

- **Code splitting**: TanStack Router splits each route into its own chunk; large features (Simulator, AI Coach) are only fetched when navigated to.
- **Memoised selectors**: every derived value in `useCarbonStore` is wrapped in `useMemo` / `useCallback`. Components re-render only when their inputs change.
- **Chart rendering**: Recharts is rendered inside `ResponsiveContainer` and only when its tab is active; tabs that aren't visible don't pay any chart cost.
- **No global state library**: zero runtime overhead beyond React.
- **Tailwind v4 + native CSS tokens**: design tokens are compiled at build time — no runtime style computation.

## Network

- Public assets are served with long cache headers; HTML is uncached.
- Supabase auth session is persisted client-side; the profile query is deduplicated by React Query (one fetch per session).
- React Query `staleTime` is set on the profile query to avoid unnecessary refetches.

## Accessibility & rendering

- `prefers-reduced-motion` is respected via Tailwind's reduced-motion variants; animations degrade gracefully.
- `min-h-dvh` (not `h-screen`) ensures correct mobile viewport sizing without layout thrash on URL-bar collapse.

## Targets

| Metric          | Target |
|-----------------|--------|
| Lighthouse Perf | ≥ 95   |
| Lighthouse A11y | 100    |
| Best Practices  | 100    |
| SEO             | 100    |
| CLS             | < 0.05 |
| LCP             | < 1.8s |
| TBT             | < 100ms|

## Verification

- `bun run build` for prod bundle size.
- Lighthouse CI runs against the preview deployment.
- Vitest covers domain layer with 95%+ statement coverage.
