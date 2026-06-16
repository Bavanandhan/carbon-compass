# Security

CarbonTwin AI handles personal lifestyle data and must remain trustworthy. This document captures the threat model, controls, and developer checklist.

## Threat model

| Asset | Threat | Mitigation |
| --- | --- | --- |
| User profile, entries, actions | Tampering via XSS | Strict React escaping, no `dangerouslySetInnerHTML`, CSP-friendly build |
| localStorage data | Malformed/poisoned payload from a previous version or extension | Versioned envelope + `safeParse` + schema validation on read |
| Form inputs (label, notes, value, date) | Injection, oversized payloads | Zod schemas enforce length, charset, range, and date bounds |
| External links | Tabnabbing | `rel="noopener noreferrer"` on every external `<a target="_blank">` |
| Secrets | Leakage into client bundle | None checked in; `env.example` shows shape only |

## Implemented controls

### Input validation (`src/lib/carbon/validation.ts`)

- `emissionEntrySchema` — category enum, label regex + max length, value range [0, 100 000], finite check, notes regex, date in [2020-01-01, today]
- `userProfileSchema` — name & location regex + max length
- `simulationParamsSchema` — reduction in [0, 100]
- All validators return a `{ valid, errors }` shape so the UI can render field-level errors.

### Storage hardening (`src/lib/carbon/storage.ts`)

- Namespaced key (`carbontwin_v1`) avoids collisions
- `safeParse` catches malformed JSON without throwing
- Version check rejects future or corrupted envelopes
- Defensive `try/catch` around `localStorage` access (private mode, quota errors)

### Frontend hygiene

- No `eval`, no `Function()` constructor, no inline scripts → CSP-compatible
- All user content rendered via JSX (auto-escaped)
- External links always use `rel="noopener noreferrer"`
- Strict TypeScript catches unsafe `any` flows
- `clsx` for class composition — never string interpolation of user data into `className`

### Content Security Policy (recommended deployment header)

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### Rate limiting

Client-side throttle on `addEntry` / `updateActionStatus` is implicit (one click per render). For any future server-backed API, rate-limit at the edge (Cloudflare / Vercel middleware) — recommended budget: 60 req/min/IP for write endpoints.

### Dependency security

- Pinned versions in `package.json`
- CI step `bun audit` (recommended) flags known CVEs
- Minimal surface area: only `react`, `recharts`, `zod`, `clsx`, TanStack ecosystem

## Security checklist

- [x] All user inputs validated with Zod
- [x] No `dangerouslySetInnerHTML`
- [x] No `eval` / `Function()` / inline event handlers in HTML strings
- [x] External `<a target="_blank">` carry `rel="noopener noreferrer"`
- [x] Versioned, namespaced localStorage with safe parsing
- [x] Strict TypeScript with no `any` in domain code
- [x] No secrets in source; `.env.example` only
- [x] Error boundaries on every route
- [x] CSP-friendly bundle (no inline scripts)
- [x] HTTPS-only deployment target
