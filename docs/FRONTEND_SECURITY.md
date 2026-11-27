# Front-end security

The guardrails that keep the privacy and no-cracker promises enforceable in code.

## Lint-enforced sinks (eslint.config.js)

- **Network** is deny-by-default: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`
  are lint errors. Adding one requires a reviewed exception.
- **HTML injection** is banned: `dangerouslySetInnerHTML`, `innerHTML`/`outerHTML`/`srcdoc` assignment,
  `insertAdjacentHTML`, `setHTMLUnsafe`, `document.write`, `javascript:` URLs.
- **Persistence** is banned outside `src/store.ts`: `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`.

## Content Security Policy (vercel.json)

`default-src 'self'`; `script-src 'self' 'wasm-unsafe-eval'` (the WASM allowance is for `hash-wasm`, documented here);
`connect-src 'self'`; `object-src 'none'`; `frame-ancestors 'none'`; `base-uri 'none'`; no third-party origins.
`scripts/deployment-security.mjs` checks these directives and the hardening headers in CI.

## WASM

`hash-wasm` compiles a WebAssembly module for the real single-hash cost demo. Modern browsers require
`'wasm-unsafe-eval'` in `script-src` for this; it does **not** enable `eval` of JavaScript. The KDF runs in a Web
Worker with a timeout, a memory cap, and an analytic fallback (Fase 1).

## No third parties

All assets and fonts are self-hosted; the first screen loads no external script or stylesheet.

## Optional HIBP lookup

The production CSP on the dedicated worker script `/hibp/range-worker.js` allows only the Pwned Passwords origin for network connections. Documents keep the same-origin connection policy. The worker validates the five-hex-digit prefix. Only static application resources are eligible for offline caching.
