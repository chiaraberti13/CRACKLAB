# Performance budgets

Initial and lazy-route JavaScript are protected by a versioned budget so the bundle cannot regress silently.

## Budgets

- `performance-budgets.json` — the source-of-truth budget (initial JS gzip, route chunk gzip), with a measured
  baseline (date + commit). `scripts/performance-budget.mjs` resolves the entry chunk from the Vite manifest
  (a stable source key, not a volatile hash), gzips it and fails CI past the budget.
- **Size Limit** (`size-limit` in `package.json`) covers the same entry independently.
- **Lighthouse CI** (`lighthouserc.json`, `lighthouse-budget.json`) checks the real route with blocking
  accessibility and performance thresholds.

## Why heavy dictionaries are not in the initial bundle

The zxcvbn Italian/English dictionaries are large, so they are imported on demand (`src/strength/strength.ts`) and
land in their own lazy chunks. The initial bundle stays well under budget; the dictionaries load only when a sample
is first evaluated.

## Updating the baseline

Re-measure after an intended change, update `performance-budgets.json` (date + commit), and explain the change in
the PR. A budget increase is a decision, not a default.
