# Threat model

Scope: a static, client-side SPA with no backend. The asset to protect is the **user's sample password** and the
**integrity of the educational claims**. CrackLab is explicitly not a cracker.

## Assets

- The sample typed by the user (must never leave the browser or be persisted).
- The honesty of the estimates (must not mislead into false security or false alarm).

## Trust boundaries

- The browser tab is the only execution context. There is no server, no telemetry, no account.
- `src/store.ts` is the only code allowed to touch persistent storage, and only for non-sensitive preferences.

## Threats and mitigations

| Threat                                              | Mitigation                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sample leaves the device over the network           | ESLint bans `fetch`/`XHR`/`WebSocket`/`sendBeacon`; CSP `connect-src 'self'`; Playwright network-privacy test  |
| Sample persisted (storage, URL, report, share card) | In-memory only; `partialize` allowlist; no URL writes; share cards (Fase 2) carry no password data             |
| Password manager saves the sample                   | Anti-autofill attributes on the input (`autocomplete=off`, `data-lpignore`, `data-1p-ignore`, `data-bwignore`) |
| XSS / HTML injection                                | React escaping only; ESLint bans `dangerouslySetInnerHTML` and raw HTML sinks; strict CSP, no inline scripts   |
| Supply-chain compromise                             | Pinned lockfile policy, `ignore-scripts`, dependency + signature audits, gitleaks/osv                          |
| Misleading numbers                                  | Orders of magnitude, declared scenarios, `measured/derived/assumption` labels, model tests                     |
| Mistaken for a cracker                              | Architectural no-cracker boundary; every scenario ends in a defense                                            |

## Out of scope

Denial of service, attacks on the hosting provider, and a compromised end-user device.

The opt-in range service learns a five-digit prefix and network metadata. Its dedicated worker has a separate CSP. See `docs/PRIVACY.md` for the consent boundary.
