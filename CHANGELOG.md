# Changelog

All notable changes to CrackLab are documented in this file. The project follows
[Semantic Versioning](https://semver.org/) and keeps this structure compatible with
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Guided learning paths, optional quizzes and fixed-content teaching cards in Italian and English.
- Configurable KDF measurements, synthetic-only reports, policy and passphrase experiments, an offline bundle and a separately consented padded breach lookup.
- Immediate invalidation of previous estimates, bounded sample length and explicit handling of numeric range errors.

- Bilingual expandable estimate provenance: algorithm parameters, hardware, dataset rate, sources/dates, hourly pricing and formulas, with scenario-aware regression tests.

- Developer lab: MD5, SHA-256, bcrypt (cost 12) and Argon2id (m=19MiB, t=2, p=1) really run in a Web Worker on a fixed synthetic string (never the typed sample), with parameter clamping and an 8 s timeout; results are labelled measured (single run on this device) and derived (slowdown factor).

### Fixed

- Restore reproducible installation by constraining TypeScript to the supported 6.0 series.
- Clarify that scenarios keep the same guess rank and that local KDF benchmarking is still planned.

### Italiano

- Laboratorio sviluppatori: esecuzione reale di MD5, SHA-256, bcrypt e Argon2id in un Web Worker su stringa sintetica, con limiti di parametri e timeout; risultati etichettati misurato/derivato.
- Dettagli IT/EN delle stime con parametri, hardware, fonti, date, prezzi e formule.
- Installazione riproducibile con TypeScript compatibile; documentazione allineata alle funzionalità disponibili.

## [0.1.0] - 2026-10-30

### Added

- Repository foundations aligned with the house template: GPL-3.0 licence, bilingual IT/EN README,
  `CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`, `ROADMAP` at root, and a `.github` set (CODEOWNERS,
  issue/PR templates, managed labels, dependabot).
- Toolchain and quality gates: TypeScript strict, Vite 8, Tailwind 4, ESLint with privacy/no-cracker
  guardrails, Prettier, Vitest + fast-check, Playwright + axe, Size Limit, Lighthouse CI config,
  gitleaks/osv policies, and a `verify` pipeline wired into CI.
- Fase 0 estimation model: versioned `benchmarks.json` and `pricing.json` with `source`/`date`/`kind`,
  pure time and cost formulas across three declared scenarios, and tests (expected monotonicity,
  provenance presence, a 12-month freshness warning, property-based checks).
- `StrengthMeter` and the MVP "Prova" screen: local predictability estimate with zxcvbn-ts (IT/EN
  dictionaries lazy-loaded), the same password compared across MD5/SHA-256/bcrypt/Argon2id by order of
  magnitude and illustrative cost, a lesson and an actionable defense, bilingual UI and full keyboard access.
- Verifiable privacy: strict CSP and security headers in `vercel.json`, no third-party scripts or fonts,
  an anti-autofill sample input that is never persisted, and a Playwright network-privacy test that asserts
  nothing leaves the browser while typing and computing.

### Security

- The application is static and client-side: it introduces no backend, telemetry, credential collection,
  real cracking, or offensive traffic. The sample password is held in memory only and never persisted.
