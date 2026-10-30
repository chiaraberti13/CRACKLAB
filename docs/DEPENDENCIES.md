# Dependencies and audit policy

## Principles

- **Pinned and reproducible.** `npm ci` installs the exact `package-lock.json`; `engine-strict` refuses an
  unsupported Node.js; `ignore-scripts` disables dependency lifecycle scripts by default.
- **Trusted source only.** `scripts/verify-lockfile.mjs` + `lockfile-lint` require HTTPS, the public npm registry,
  integrity hashes, and lockfile v3+.
- **Audited.** `audit:runtime` (production, high+) and `audit:full` run in CI; signature audits are available via
  `audit:signatures:*`.
- **Few, justified runtime deps.** React, Zustand, Motion, lucide-react, `@zxcvbn-ts/*`, `hash-wasm`. Everything
  else is a dev dependency.

## Updates

Dependabot opens weekly grouped PRs (production vs development, plus GitHub Actions). Each update must keep the full
`npm run verify` suite and the Playwright suite green. Prefer one coherent lockfile update over many single bumps.

## Adding a dependency

Justify it in the PR: what it replaces, its size impact against the performance budget, and its supply-chain posture.
A new network-capable dependency must respect the privacy boundary and may require a `docs/SECURITY_SCANNING.md` exception.
