# Contributing to CrackLab

CrackLab is a bilingual, client-side React/TypeScript credential-attack simulator with deterministic logic
and a transparent, contestable estimation model. Four constraints are non-negotiable: **no-cracker**,
**verifiable privacy**, **honest estimates**, and **design system + accessibility AA**.

## Before you start

1. Read `README.md`, `SECURITY.md`, `docs/PRIVACY.md`, `docs/MODEL.md` and the `ROADMAP.md`.
2. Search existing issues and keep each pull request focused.
3. Never commit a real password, personal data, secrets or a full hash — use invented examples.
4. Report vulnerabilities privately (see `SECURITY.md`).

## Setup

Use a supported Node.js release from `package.json#engines`. Commands are identical in Windows PowerShell,
macOS Terminal and Linux shells:

```bash
npm ci
npm run dev
```

## Required checks

```bash
npm run verify     # lockfile, model data, deployment security, format, types, lint, tests+coverage, build, budget
npm run test:e2e   # privacy, app-shell and axe accessibility on the production build
```

## Engineering expectations

- **No-cracker:** never add third-party hash input, wordlist cracking or a "break this hash" feature.
- **Privacy:** no network access and no persistence of the sample; keep the Playwright privacy test green.
- **Honest estimates:** report orders of magnitude, keep assumptions visible, label every figure
  `measured` / `derived` / `assumption`, and never present an assumption as a measurement. Benchmark and
  pricing changes keep `source`, `date` and `kind` and pass `npm run verify:model`.
- **Accessibility:** keyboard access, visible focus, contrast and `prefers-reduced-motion`; axe stays green.
- Keep Italian and English content semantically equivalent and update the typed i18n catalogs together.

## Pull requests

Describe what changed, why, how it was tested, and the security boundaries affected. Participation follows
`CODE_OF_CONDUCT.md`. The PR template's Definition of Done lists what to confirm.

## Reporting and contribution checks

Use the [issue templates](https://github.com/chiaraberti13/CRACKLAB/issues/new/choose) and check for duplicates first. Useful context: Browser, scenario, simulation parameters and an invented example password.

Write community and technical documentation in English; maintain equivalent English and Italian READMEs. Preserve existing application translations. Fill in the pull request template with commands, results and checks not performed, including the reason. Use synthetic examples without secrets or personal data.

See [the code of conduct](CODE_OF_CONDUCT.md), [security policy](SECURITY.md) and [accessibility statement](docs/ACCESSIBILITY.md). Report vulnerabilities only through the security policy process.
