# Security scanning and exceptions

CrackLab runs secret, dependency and vulnerability scanning, and keeps every suppression auditable.

## Scanners

- **gitleaks** (`.gitleaks.toml`) — secret scanning, default ruleset, no broad exclusions.
- **osv-scanner** (`osv-scanner.toml`) — known-vulnerability scanning; the ignore list is empty.
- **npm audit** — `audit:runtime` (production, high+) and `audit:full` run in CI.
- **lockfile policy** (`scripts/verify-lockfile.mjs` + `lockfile-lint`) — HTTPS registry, integrity hashes, v3+.

## Exceptions

Any suppression requires a matching, reviewable entry in `.github/security-exceptions.yml` with owner, reason and
expiry, plus the scanner-specific record (an `[[IgnoredVulns]]` block for OSV, a narrow allowlist for gitleaks).
No broad path or regex exclusions. An exception without a matching entry is treated as a policy violation.

## Reporting

Vulnerabilities are reported privately — see `SECURITY.md`.
