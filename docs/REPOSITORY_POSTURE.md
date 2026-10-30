# Repository posture

How CrackLab is governed and what the automated gates guarantee.

## Branching and review

- `main` is always deployable and protected: PR required, CI green, review.
- Feature branch → Pull Request → CI + Vercel preview deploy → review (including the Definition of Done) → merge → production.
- Conventional Commits + Semantic Versioning + changelog.

## The four non-negotiable constraints

1. **No-cracker** — no third-party hash input, no wordlist cracking, no "break this hash".
2. **Verifiable privacy** — no network access and no persistence of the sample; the privacy e2e test stays green.
3. **Honest estimates** — orders of magnitude, declared scenarios, `measured/derived/assumption` labels.
4. **Design system + accessibility AA**.

## Blocking gates (CI)

`npm run verify` (lockfile policy, model-data provenance, deployment-security headers, Prettier, TypeScript strict,
ESLint guardrails, Vitest with coverage thresholds, build, performance budget) plus the Playwright suite
(privacy, app-shell, axe) and the dependency audit.

## Ownership

`.github/CODEOWNERS` assigns the trust-critical paths (model, privacy boundary, CI, deployment, i18n, design system)
to the maintainer. Managed labels are synced from `.github/labels.json` by the `labels` workflow.
