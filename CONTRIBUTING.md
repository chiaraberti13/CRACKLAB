# Contributing to CrackLab

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

CrackLab is a bilingual, client-side React/TypeScript credential-attack simulator with deterministic logic
and a transparent, contestable estimation model. Four constraints are non-negotiable: **no-cracker**,
**verifiable privacy**, **honest estimates**, and **design system + accessibility AA**.

### Before you start

1. Read `README.md`, `SECURITY.md`, `docs/PRIVACY.md`, `docs/MODEL.md` and the `ROADMAP.md`.
2. Search existing issues and keep each pull request focused.
3. Never commit a real password, personal data, secrets or a full hash — use invented examples.
4. Report vulnerabilities privately (see `SECURITY.md`).

### Setup

Use a supported Node.js release from `package.json#engines`. Commands are identical in Windows PowerShell,
macOS Terminal and Linux shells:

```bash
npm ci
npm run dev
```

### Required checks

```bash
npm run verify     # lockfile, model data, deployment security, format, types, lint, tests+coverage, build, budget
npm run test:e2e   # privacy, app-shell and axe accessibility on the production build
```

### Engineering expectations

- **No-cracker:** never add third-party hash input, wordlist cracking or a "break this hash" feature.
- **Privacy:** no network access and no persistence of the sample; keep the Playwright privacy test green.
- **Honest estimates:** report orders of magnitude, keep assumptions visible, label every figure
  `measured` / `derived` / `assumption`, and never present an assumption as a measurement. Benchmark and
  pricing changes keep `source`, `date` and `kind` and pass `npm run verify:model`.
- **Accessibility:** keyboard access, visible focus, contrast and `prefers-reduced-motion`; axe stays green.
- Keep Italian and English content semantically equivalent and update the typed i18n catalogs together.

### Pull requests

Describe what changed, why, how it was tested, and the security boundaries affected. Participation follows
`CODE_OF_CONDUCT.md`. The PR template's Definition of Done lists what to confirm.

## Italiano

CrackLab è un simulatore bilingue di attacchi alle credenziali, lato client, in React/TypeScript, con logica
deterministica e un modello di stima trasparente e contestabile. Quattro vincoli non negoziabili: **no-cracker**,
**privacy verificabile**, **onestà delle stime**, **design system + accessibilità AA**.

### Prima di iniziare

1. Leggi `README.md`, `SECURITY.md`, `docs/PRIVACY.md`, `docs/MODEL.md` e la `ROADMAP.md`.
2. Controlla le issue esistenti e mantieni ogni pull request focalizzata.
3. Non committare mai una password reale, dati personali, segreti o un hash completo — usa esempi inventati.
4. Segnala privatamente le vulnerabilità (vedi `SECURITY.md`).

### Setup

Usa una versione Node.js supportata da `package.json#engines`. I comandi sono identici in Windows PowerShell,
Terminale macOS e shell Linux:

```bash
npm ci
npm run dev
```

### Controlli richiesti

```bash
npm run verify     # lockfile, dati del modello, sicurezza del deploy, format, tipi, lint, test+coverage, build, budget
npm run test:e2e   # privacy, app-shell e accessibilità axe sulla build di produzione
```

### Aspettative tecniche

- **No-cracker:** mai aggiungere input di hash di terzi, wordlist-cracking o una funzione "buca questo hash".
- **Privacy:** nessuna richiesta di rete e nessuna persistenza dell'input; mantieni verde il test di privacy Playwright.
- **Onestà delle stime:** ordini di grandezza, assunzioni sempre visibili, ogni numero etichettato
  `misurato` / `derivato` / `ipotesi`, mai un'ipotesi presentata come misura. Modifiche a benchmark e prezzi
  mantengono `source`, `date` e `kind` e passano `npm run verify:model`.
- **Accessibilità:** tastiera, focus visibile, contrasto e `prefers-reduced-motion`; axe resta verde.
- Mantieni equivalenti i contenuti italiani e inglesi e aggiorna insieme i cataloghi i18n tipizzati.

### Pull request

Descrivi cosa cambia, perché, come è stato testato e i confini di sicurezza interessati. Si applica
`CODE_OF_CONDUCT.md`. La Definition of Done del template PR elenca cosa verificare.
