# Performance budgets

Initial and lazy-route JavaScript are protected by a versioned budget so the bundle cannot regress silently.

## Budgets

- `performance-budgets.json` — the source-of-truth budget (initial JS gzip, route chunk gzip), with a measured
  baseline (date + commit). `scripts/performance-budget.mjs` resolves the entry and the Learn, Design and Breach Check chunks from stable Vite manifest keys, gzips them and checks their individual budgets.
- **Size Limit** (`size-limit` in `package.json`) covers the same entry independently.
- **Lighthouse CI** (`lighthouserc.json`, `lighthouse-budget.json`) checks the real route with blocking
  accessibility and performance thresholds.

## Route and dictionary loading

The browser loads Learn, Design and Breach Check as separate JavaScript chunks. The offline cache still includes all three.

The zxcvbn Italian/English dictionaries are large, so they are imported on demand (`src/strength/strength.ts`) and
land in their own lazy chunks. The initial bundle stays well under budget; the dictionaries load only when a sample
is first evaluated.

## Updating the baseline

Re-measure after an intended change, update `performance-budgets.json` (date + commit), and explain the change in the delivery commit. A budget increase is a decision, not a default.
