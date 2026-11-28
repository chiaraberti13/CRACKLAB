# Privacy — verifiable, not just declared

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

The password never leaves the device. CrackLab treats this as a requirement to **prove**, not only to state.

- **Local evaluation.** `e2e/network-privacy.spec.ts` asserts that no request goes off-origin
  and that no request carries the typed value, during input and evaluation.
- **No persistence of the sample.** `src/store.ts` holds the sample in memory only; the persistence `partialize`
  allowlist keeps _only_ non-sensitive preferences (language, theme, scenario). The input is never written to
  `localStorage`, `sessionStorage`, IndexedDB, a URL, a report or a share card.
- **Enforced in lint.** `eslint.config.js` makes `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, DOM-HTML
  sinks and browser storage a build error everywhere except the preferences storage boundary (`src/store.ts`). The dedicated breach-check worker is copied as a static asset from `public/hibp/range-worker.js` and reviewed separately.
- **Strict CSP and headers.** `vercel.json` sets `default-src 'self'`, `connect-src 'self'`, no third-party scripts
  or fonts, framing denied, `Referrer-Policy: no-referrer`. `scripts/deployment-security.mjs` checks it in CI.
- **No secure-erasure claim.** In JavaScript, strings are immutable and their removal depends on the garbage
  collector; "clear all" resets state but we do not promise secure memory erasure, and we say so.

The optional check at `/hibp/` requires a new example, consent and an explicit submission. Only its dedicated worker can contact Pwned Passwords. It sends a five-digit SHA-1 hex prefix with padding requested and no credentials. The service sees the prefix and network metadata. Responses and typed values are never cached. The offline service worker caches only build-time application assets.

## Italiano

La password non lascia il dispositivo. CrackLab lo tratta come un requisito da **dimostrare**, non solo da dichiarare.

- **Valutazione locale.** `e2e/network-privacy.spec.ts` verifica che nessuna richiesta esca
  dall'origine e che nessuna richiesta contenga il valore digitato, durante input e valutazione.
- **Nessuna persistenza dell'input.** `src/store.ts` tiene l'input solo in memoria; l'allowlist `partialize`
  persiste _solo_ preferenze non sensibili (lingua, tema, scenario). L'input non finisce mai in `localStorage`,
  `sessionStorage`, IndexedDB, URL, report o share card.
- **Imposto nel lint.** `eslint.config.js` rende `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, i sink
  DOM-HTML e lo storage del browser un errore di build ovunque tranne il confine per le preferenze (`src/store.ts`). Il worker dedicato al controllo facoltativo viene copiato come asset statico da `public/hibp/range-worker.js` e verificato separatamente.
- **CSP e header stringenti.** `vercel.json` imposta `default-src 'self'`, `connect-src 'self'`, niente script o
  font di terze parti, framing negato, `Referrer-Policy: no-referrer`. `scripts/deployment-security.mjs` lo verifica in CI.
- **Nessuna promessa di cancellazione sicura.** In JavaScript le stringhe sono immutabili e la loro rimozione
  dipende dal garbage collector; "svuota tutto" azzera lo stato ma non promettiamo la cancellazione sicura della memoria.

La pagina facoltativa `/hibp/` richiede un nuovo esempio, il consenso e un invio esplicito. Il worker dedicato invia al servizio soltanto il prefisso SHA-1 di cinque cifre esadecimali, con padding e senza credenziali. Il servizio vede il prefisso e i metadati di rete. La cache offline contiene esclusivamente file statici della build. I test della richiesta usano risposte simulate.
