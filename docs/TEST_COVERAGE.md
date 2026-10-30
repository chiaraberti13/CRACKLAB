# Test coverage

## Scope

The blocking coverage gate (`vitest.config.ts`) targets `src/model/**` and `src/sim/**` — the trust-critical,
contestable logic. Datasets and UI are reviewed separately and stay outside the denominator, so coverage measures
what actually must be correct.

## Thresholds

Global and per-file thresholds are **at least 80%** on lines/statements/branches (the roadmap Fase 0/1 gate), with
a higher functions floor. `perFile` prevents a well-tested large module from masking an untested small one.
Thresholds are explicit (`autoUpdate: false`); lowering one is a reviewed decision.

## Kinds of tests

- **Unit** (Vitest) — pure estimation formulas, data integrity, store behaviour, strength integration.
- **Property-based** (`fast-check`) — invariants: more guesses never means less time; the magnitude bucket never
  decreases as duration grows.
- **Node `--test`** — the verification scripts (`scripts/*.test.mjs`).
- **End-to-end** (Playwright) — privacy, app-shell, language switch, and axe accessibility on the production build.

```bash
npm run test:coverage   # unit + coverage gate
npm run test:e2e        # browser suite
npm run verify          # the full CI gate
```
