<p align="center"><sub>Progetto · documento di impostazione e roadmap · v2.2 · 2026-10-30</sub></p>

# 🛡️ CrackLab — Credential Attack Simulator

> **Non predice quando cadrà la tua password. Ti mostra cosa cambia davvero il costo di un attacco.**
> _It doesn't predict when your password will fall. It shows what really changes the cost of an attack._

**Nome:** `CrackLab` — nome proprio e indipendente, non legato all'ecosistema Olympus. È il "laboratorio del cracking": chiaro e ottimo per la SEO. Disponibilità: nessun tool noto con questo nome (da non confondere con _CrackLib_, una **libreria difensiva** di controllo password — cosa diversa). Resta modificabile.

> 🧭 **In una riga:** un simulatore _visuale_ che mostra, a esperti e non, come si attaccano le password e quanto le difese moderne ne aumentano il costo — senza essere un cracker, senza far uscire nulla dal browser e senza promettere precisione che il modello non ha.

---

## 🔄 Novità della v2.2 rispetto alla v2.1

| Area              | v2.1                                                                              | v2.2                                                                                                          | Perché                                                                             |
| ----------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Promesse**      | "Argon2 inattaccabile", "il salt annulla le rainbow table", "MFA ferma l'attacco" | Formulazioni corrette e prudenti (vedi [Principi scientifici](#-principi-scientifici-cosa-diciamo-e-cosa-no)) | Credibilità: una password debole con Argon2 **non** diventa forte                  |
| **Stima forza**   | `zxcvbn` (Dropbox), "entropia reale"                                              | `@zxcvbn-ts/core` + dizionari IT/EN, "numero di tentativi stimato"                                            | Libreria mantenuta, TS-native; zxcvbn stima la prevedibilità, non l'entropia reale |
| **Modello**       | Tempo come numero unico                                                           | Ordine di grandezza su 3 scenari + **costo economico illustrativo** + benchmark versionati                    | Evita falsa precisione, rende il rischio tangibile                                 |
| **Esperienza**    | Meter + simulatore + laboratorio mescolati                                        | Tre percorsi: **Prova · Capisci · Progetta**                                                                  | Il primo contatto deve essere semplice                                             |
| **MVP**           | Molte funzioni; KDF reali in posizioni incoerenti tra funzionalità e roadmap      | MVP ridotto, **una sola animazione eccellente**; KDF reali allineati in Fase 1                                | Meglio un esperimento che convince in 30 s che sei strumenti abbozzati             |
| **Simulazioni**   | Scenari descrittivi                                                               | Struttura fissa: **domanda → previsione → simulazione → spiegazione → limite → difesa**                       | Lezioni verificabili                                                               |
| **Privacy**       | "100% client-side"                                                                | Requisiti verificabili: test di rete automatici, anti-autofill, niente script terzi, HIBP con padding         | Il claim va dimostrato, non solo dichiarato                                        |
| **Share card**    | "La mia passphrase resiste X anni"                                                | Solo esperimenti didattici predefiniti, **nessun metadato della password**                                    | Evita falsa sicurezza e leak di lunghezza/entropia                                 |
| **Mobile**        | Argon2 via WASM senza limiti                                                      | Guardrail di memoria, timeout, fallback analitico                                                             | Evita crash per memoria esaurita su smartphone                                     |
| **Rainbow table** | Motore reale                                                                      | Demo concettuale stilizzata (Fase 3)                                                                          | Tecnica storicamente superata dal salt: effort meglio speso su KDF e spraying      |
| **KPI**           | Solo traffico e stelle                                                            | + **metriche di comprensione** e test di usabilità                                                            | Misurare se il prodotto insegna                                                    |
| **Team**          | 25 ruoli                                                                          | **Lean core team** (2–3 profili) + matrice di competenze                                                      | Realismo per un progetto open-source                                               |

---

## ⏱️ Stima di sviluppo (sintesi)

| Traguardo                                          | Durata (team piccolo dedicato) | Effort             |
| -------------------------------------------------- | ------------------------------ | ------------------ |
| MVP pubblicabile ("Prova" + 1 animazione)          | ~3–4 settimane                 | ~18–22 gg/uomo     |
| **v1.0 "da colloquio"** (+ "Capisci" + "Progetta") | **~8–10 settimane**            | **~50–65 gg/uomo** |
| Fase crescita                                      | continua                       | —                  |

_Ipotesi: lean core team di 2–3 persone (vedi [team](#-il-team)). Persona sola part-time → ×2–3. La parte più impegnativa resta il modello di stima validato e l'animazione accessibile._

---

## 📑 Indice

1. [TL;DR](#-tldr)
2. [Principi scientifici: cosa diciamo e cosa no](#-principi-scientifici-cosa-diciamo-e-cosa-no)
3. [Ricerca di settore e ipotesi di posizionamento](#-ricerca-di-settore-e-ipotesi-di-posizionamento)
4. [Pubblico, personas e casi d'uso](#-pubblico-personas-e-casi-duso)
5. [Proposta di valore](#-proposta-di-valore)
6. [I tre percorsi: Prova · Capisci · Progetta](#-i-tre-percorsi-prova--capisci--progetta)
7. [Funzionalità in dettaglio](#-funzionalità-in-dettaglio)
8. [Il modello di stima](#-il-modello-di-stima)
9. [Architettura tecnica e stack](#-architettura-tecnica-e-stack)
10. [Design, UI/UX e identità visiva](#-design-uiux-e-identità-visiva)
11. [Usabilità per utenti non esperti](#-usabilità-per-utenti-non-esperti)
12. [Accessibilità](#-accessibilità)
13. [Sicurezza, privacy, etica e aspetti legali](#-sicurezza-privacy-etica-e-aspetti-legali)
14. [Modello di sviluppo, governance e pubblicazione](#-modello-di-sviluppo-governance-e-pubblicazione)
15. [Hosting e deploy (Vercel)](#-hosting-e-deploy-vercel)
16. [Comunicazione, crescita e SEO](#-comunicazione-crescita-e-seo)
17. [KPI e metriche di successo](#-kpi-e-metriche-di-successo)
18. [Il team](#-il-team)
19. [Roadmap dettagliata a fasi + tempi](#-roadmap-dettagliata-a-fasi--tempi)
20. [Rischi e mitigazioni](#-rischi-e-mitigazioni)

---

## 🎯 TL;DR

CrackLab è un **simulatore educativo e visuale** che mostra _come_ funzionano gli attacchi alle credenziali e _quanto_ le difese moderne ne aumentano il costo. Non è un cracker: è un **"what-if" didattico, 100% client-side**, con assunzioni sempre visibili.

Mette a confronto:

- **Attacco offline** (database sottratto): la stessa password di esempio con **MD5 vs SHA-256 vs bcrypt vs Argon2id** → come cambia l'**ordine di grandezza** del tempo e del costo dell'attacco, e _perché_ (costo del KDF, salt unico per account).
- **Attacco online** (login esposto): dictionary / credential stuffing / **password spraying** contro **rate limiting, lockout, MFA, rilevamento spray** → in quale fase l'attacco si ferma e quale difesa l'ha fermato.

La lezione centrale: **l'algoritmo del sito moltiplica il costo di ogni tentativo, ma una password prevedibile resta prevedibile.** Servono entrambe le cose: password non indovinabile (meglio se generata da un password manager) **e** conservazione corretta lato server.

- **Formato:** SPA statica, 100% client-side, verificato da test automatici di rete.
- **Perché porta traffico:** il gancio "quanto è sicura la mia password?" è un virale perenne, qui reso **serio, visuale e onesto**.

---

## 🔬 Principi scientifici: cosa diciamo e cosa no

Questa sezione è vincolante per testi, UI, share card e materiali di lancio.

| ❌ Non diciamo                            | ✅ Diciamo                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Argon2 è inattaccabile"                  | "Argon2id aumenta il costo di ogni tentativo; una password prevedibile può comunque essere indovinata in fretta."                                                         |
| "Entropia reale con zxcvbn"               | "Stima della prevedibilità e del numero di tentativi necessari (zxcvbn)." L'entropia reale di una password scelta da una persona non è misurabile da un singolo campione. |
| "Il salt annulla le rainbow table"        | "Un salt unico impedisce di riusare le precomputazioni tra account diversi; non impedisce di provare password su un singolo hash."                                        |
| "L'MFA ferma l'attacco"                   | "L'MFA può impedire l'accesso anche dopo che la password è stata scoperta; l'efficacia dipende dal metodo (es. app/chiave FIDO2 vs SMS) e dallo scenario."                |
| "La tua password resiste 400 anni"        | "In questo scenario illustrativo, l'ordine di grandezza è di secoli. Non è una previsione di quando verrà scoperta."                                                      |
| "8 GPU = 8× più veloce"                   | "Il guadagno multi-GPU dipende dall'algoritmo e dall'implementazione; usiamo benchmark misurati, non moltiplicazioni automatiche."                                        |
| "Nessuno mostra attacco e difesa insieme" | "Ipotesi di posizionamento, da verificare con un'analisi degli strumenti esistenti."                                                                                      |

**Regola d'oro:** ogni numero mostrato ha, a un tap di distanza, le sue assunzioni (scenario, hardware, parametri del KDF, fonte e data del benchmark).

---

## 🔍 Ricerca di settore e ipotesi di posizionamento

- **"Forza delle password" = virale perenne:** i vari "how secure is my password" raccolgono grandi volumi di ricerca. CrackLab usa quel gancio ma lo porta sul _perché_.
- **I meter ingenui (regole su maiuscole/simboli) sono screditati:** NIST SP 800-63B sconsiglia le regole di composizione e raccomanda lunghezza, blocklist e controllo contro password compromesse. Un meter basato sulla prevedibilità (zxcvbn) + scenario d'attacco esplicito è un posizionamento differenziante.
- **Ipotesi da verificare (Fase 0):** gli strumenti esistenti restituiscono un giudizio "debole/forte", raramente mostrano **attaccante e difensore affiancati** con assunzioni esplicite. Prima del lancio: analisi di 8–10 strumenti simili, documentata in `docs/research/competitors.md`.
- **Allineamento con Security+ SY0-701:** hashing, KDF, salting, MFA, lockout, spraying sono temi centrali dell'esame: CrackLab è la vetrina "giocabile" di competenze certificate.

---

## 👥 Pubblico, personas e casi d'uso

**Persona A — "Chi arriva da Google".** Ha cercato "quanto è sicura la mia password": vuole una risposta visiva e immediata. → percorso **Prova**.

**Persona B — "IT/Awareness".** Deve _convincere_ i colleghi a usare password manager e MFA: CrackLab lo **mostra**, non lo predica. → percorso **Capisci** (scenari guidati da proiettare in una formazione).

**Persona C — "Sviluppatore".** Deve scegliere _come_ conservare le password (quale KDF, quali parametri): usa il laboratorio. → percorso **Progetta**.

**Casi d'uso tipici**

1. "Provo un esempio precaricato: vedo che la stessa password ha costi d'attacco molto diversi con MD5 e con Argon2id → capisco che **conta anche come il sito conserva la password**."
2. "Provo una password prevedibile con Argon2id → scopro che viene comunque indovinata presto, perché è tra i primi tentativi di ogni dizionario."
3. "Simulo un **password spraying** contro un login con lockout per account → l'attacco passa comunque, perché distribuisce pochi tentativi su molti account; serve il rilevamento trasversale."
4. "Lo sviluppatore regola la memoria di Argon2id e vede il trade-off: più sicurezza offline, meno login simultanei per core sul server."

---

## 💎 Proposta di valore

1. **Attaccante vs Difensore, affiancati e animati** → concetti crittografici comprensibili in pochi secondi.
2. **Onestà del modello come elemento distintivo:** stime per ordini di grandezza, tre scenari dichiarati, benchmark con fonte e data, distinzione tra dati misurati, derivati e ipotesi.
3. **Costo economico dell'attacco** (illustrativo, con prezzi datati) accanto al tempo: rende il rischio tangibile per manager e sviluppatori.
4. **Privacy verificabile:** la password non lascia il dispositivo, e lo dimostrano test automatici pubblici in CI.
5. **Educativo e difensivo:** ogni scenario termina in una difesa concreta.
6. **Bilingue IT/EN, accessibile, curato visivamente.**

---

## 🧭 I tre percorsi: Prova · Capisci · Progetta

Tre esperienze distinte, con ingresso di default su **Prova**. Nessun pannello pieno di controlli al primo contatto.

### 1️⃣ Prova — per tutti

Esempio pronto (o password di prova) → confronto immediato tra algoritmi → **una** spiegazione → **un** consiglio.

### 2️⃣ Capisci — simulazioni guidate

Piccoli esperimenti con una domanda precisa, sempre nella stessa struttura:

> **Domanda → previsione dell'utente → simulazione → spiegazione → limite → difesa**

Scenari previsti:

- _"Cosa succede se due utenti usano la stessa password?"_ (hash identici senza salt → un solo calcolo li scopre entrambi)
- _"Il salt basta?"_ (no: impedisce il riuso tra account, non rende forte una password debole)
- _"Il blocco dopo 5 errori ferma tutti gli attacchi?"_ (lo spraying distribuisce i tentativi su molti account → servono controlli trasversali)
- _"Ho scoperto la password: sono dentro?"_ (con MFA, il primo fattore superato non è l'accesso completato)

Esempio completo:

> **Domanda:** "Il blocco dopo cinque errori ferma tutti gli attacchi?"
> **Previsione:** l'utente sceglie "sì" o "no".
> **Simulazione:** 3 password comuni provate su 1.000 account, una ogni ora.
> **Spiegazione:** nessun account supera la soglia di 5 errori, quindi il lockout non scatta mai.
> **Limite:** il lockout per account protegge dal brute force sul singolo utente, non dallo spraying.
> **Difesa:** rilevamento di tentativi falliti trasversali agli account, blocklist di password comuni, MFA.

Per l'attacco online, l'interfaccia distingue sempre **quattro esiti**:

1. Password indovinata
2. Primo fattore superato
3. Accesso completato
4. Tentativo bloccato o rilevato

Così si evitano due lezioni sbagliate: "password trovata = account compromesso" e "MFA = invulnerabilità".

### 3️⃣ Progetta — per sviluppatori

Scelta del KDF e dei parametri, benchmark locale ("quanto costa verificare _qui_?"), compromessi operativi:

- **Slider "sicurezza offline vs costo server":** aumentando la memoria di Argon2id cresce il costo per l'attaccante, ma calano i login gestibili in parallelo per core. Mostra il calcolo, con le ipotesi.
- Raccomandazioni di partenza da [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (es. Argon2id con 19 MiB di memoria, 2 iterazioni, parallelismo 1 come configurazione minima), presentate come punto di partenza da adattare, non come verità assoluta.

---

## 🧰 Funzionalità in dettaglio

### MVP — v0.1 (≈3–4 settimane) — "Un esperimento che convince in 30 secondi"

1. **Tre esempi precaricati** con prevedibilità diversa (es. `password123`, una parola + numeri, una passphrase di 4 parole casuali).
2. **Valutazione locale** con `@zxcvbn-ts/core`: numero di tentativi stimato, debolezze, suggerimenti.
3. **Confronto MD5 / SHA-256 / bcrypt / Argon2id** con ordine di grandezza su tre scenari e **assunzioni visibili**.
4. **Una sola animazione eccellente** (la "clessidra del cracking": stessa password, quattro algoritmi).
5. **Una lezione conclusiva + un'azione concreta** (password manager, passphrase generata, MFA).
6. **Fin dal primo giorno:** IT/EN, tastiera completa, `prefers-reduced-motion`, avviso "usa un esempio, non una password reale".
7. **KDF reali nel browser, in versione minima:** un singolo hash bcrypt/Argon2id calcolato in Web Worker per far _sentire_ il costo (es. "questo singolo calcolo ha richiesto ~250 ms sul tuo dispositivo"). Allineato con la Fase 1 della roadmap.

**Rimandato:** rainbow table, policy builder, HIBP, laboratorio completo, simulatore online.

### v1.0 (≈8–10 settimane totali)

- **Percorso "Capisci":** 4 scenari guidati (vedi sopra), offline e online, con i quattro esiti dell'attacco online.
- **Scena "Attaccante vs Difensore"** animata, con versione statica equivalente.
- **Percorso "Progetta":** scelta KDF e parametri, benchmark locale, slider sicurezza/costo server.
- **Metrica di costo economico** illustrativa (vedi [modello](#-il-modello-di-stima)).
- **Share card didattiche** (vedi [design](#-design-uiux-e-identità-visiva)) + mini-report esportabile **senza alcun dato della password**.
- Spiegazioni "Attacco vs Difesa" con riferimenti (OWASP, NIST SP 800-63B).

### Avanzate (Fase crescita, continua)

- **Rainbow table: demo concettuale stilizzata** ("chiave → hash → lookup → fallisce col salt"), nessun motore reale.
- **Generatore di passphrase** (diceware) con stima del numero di tentativi.
- **Policy builder** ("questa regola aiuta o infastidisce soltanto?").
- **HIBP k-anonymity opzionale** (vedi [privacy](#-sicurezza-privacy-etica-e-aspetti-legali)).
- **PWA offline**.

---

## 📐 Il modello di stima

Il modello è **il vero elemento distintivo**: deve essere trasparente, versionato e contestabile via PR.

### Cosa calcola

Per ogni combinazione _password di esempio × algoritmo × scenario_:

```
tentativi_stimati   = guesses restituiti da zxcvbn-ts   (NON 2^entropia, NON l'intero spazio delle chiavi)
hashrate            = benchmark misurato per algoritmo, parametri e hardware   (da benchmarks.json)
tempo_stimato       = tentativi_stimati / hashrate
costo_stimato       = (tempo_stimato in ore) × prezzo_orario_istanza   (prezzo datato, da pricing.json)
```

Esempio pratico: se zxcvbn stima 10⁶ tentativi e l'hashrate su MD5 è dell'ordine di 10¹¹ hash/s, il tempo è una frazione di secondo; con bcrypt cost 12 l'hashrate scende di molti ordini di grandezza e il tempo sale di conseguenza. Mostriamo l'**ordine di grandezza**, non la cifra esatta.

### Tre scenari dichiarati (non intervalli statistici)

| Scenario       | Ipotesi                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| **Prudente**   | 1 GPU consumer, attaccante che usa solo dizionari comuni                       |
| **Centrale**   | piccolo cluster noleggiato, dizionari + regole di mutazione                    |
| **Aggressivo** | cluster di più GPU di fascia alta, attacco mirato con dizionari personalizzati |

Sono **scenari illustrativi**, non intervalli di confidenza: lo dichiariamo in chiaro.

### Ipotesi sempre esplicitate

- **Scenario:** database sottratto, algoritmo e parametri noti all'attaccante, salt unico per account.
- **Criterio temporale:** tempo per arrivare al tentativo stimato da zxcvbn (non "esaurimento dello spazio", non "tempo medio" senza dirlo).
- **Parametri completi del KDF:** bcrypt `cost`; Argon2id memoria, iterazioni, parallelismo.
- **Scalabilità multi-GPU:** valori misurati per configurazione, mai moltiplicazioni automatiche.

### Dati versionati e classificati

```
src/model/data/
├─ benchmarks.json   # hashrate per algoritmo/parametri/hardware, con fonte, data, versione del tool
├─ pricing.json      # prezzi orari istanze cloud/GPU, con fonte e data di rilevazione
└─ README.md         # come proporre aggiornamenti via PR
```

Ogni voce ha un campo `kind`:

- `measured` — benchmark misurato (fonte primaria: output pubblici di `hashcat -b`, con versione e driver)
- `derived` — valore calcolato da dati misurati (es. scalatura da un parametro all'altro, con formula)
- `assumption` — ipotesi illustrativa dichiarata

La UI usa un'etichetta diversa per ciascun tipo. Documentazione: [hashcat wiki](https://hashcat.net/wiki/).

### Costo economico: avvertenze

Il costo è **illustrativo**: prezzi cloud variabili nel tempo e per area, istanze spot non sempre disponibili, energia e setup esclusi o inclusi a seconda dello scenario (dichiararlo). Mostrare sempre la data dei prezzi.

### Benchmark nel browser

Il KDF eseguito localmente risponde a **"quanto costa verificare _qui_, sul tuo dispositivo?"**. Non viene mai trasformato automaticamente in una previsione delle prestazioni dell'attaccante (che usa GPU dedicate e implementazioni ottimizzate).

### Test del modello (bloccanti in CI)

- Monotonie attese (a parità di password: MD5 < SHA-256 ≪ bcrypt/Argon2id in tempo stimato).
- Ogni voce di `benchmarks.json` e `pricing.json` ha fonte, data e `kind`.
- Avviso automatico se un benchmark ha più di 12 mesi.
- Property-based testing: più tentativi stimati → mai meno tempo.

---

## 🏗️ Architettura tecnica e stack

Tutto **client-side**. Separazione netta tra **calcolo reale** (solo per far sentire il costo di un singolo hash) e **simulazione analitica** (tutte le stime di cracking). Nessun brute force reale nel browser, salvo spazi giocattolo per le demo (es. PIN a 3 cifre).

| Area                 | Scelta                                                                                  | Documentazione                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Linguaggio/UI/Build  | **TypeScript + React 19 + Vite**                                                        | [react.dev](https://react.dev), [vite.dev](https://vite.dev)                                                                        |
| Stile                | **Tailwind CSS**                                                                        | [tailwindcss.com/docs](https://tailwindcss.com/docs)                                                                                |
| Stato                | **Zustand**                                                                             | [zustand.docs.pmnd.rs](https://zustand.docs.pmnd.rs/)                                                                               |
| Stima prevedibilità  | **`@zxcvbn-ts/core`** + `@zxcvbn-ts/language-common`, `-en`, `-it` (caricati on-demand) | [zxcvbn-ts.github.io/zxcvbn](https://zxcvbn-ts.github.io/zxcvbn/)                                                                   |
| KDF/hash nel browser | **`hash-wasm`** (bcrypt, Argon2id, MD5, SHA) + **WebCrypto**                            | [hash-wasm](https://github.com/Daninet/hash-wasm), [MDN WebCrypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) |
| Calcolo pesante      | **Web Workers**                                                                         | [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)                                                 |
| Animazione           | **Motion**                                                                              | [motion.dev](https://motion.dev)                                                                                                    |
| (Opz.) breach check  | **HIBP Pwned Passwords Range** (k-anonymity + padding)                                  | [haveibeenpwned.com/API/v3](https://haveibeenpwned.com/API/v3#PwnedPasswords)                                                       |
| Test                 | **Vitest + Playwright** (+ fast-check per property-based)                               | [vitest.dev](https://vitest.dev), [playwright.dev](https://playwright.dev), [fast-check](https://fast-check.dev)                    |
| Hosting              | **Vercel**                                                                              | [vercel.com/docs](https://vercel.com/docs)                                                                                          |

### Guardrail per i KDF su mobile

Argon2id con 19–64 MiB di memoria può esaurire la memoria di una tab su smartphone di fascia media. Nel worker:

- **Timeout stringente** (es. 3 s) con `worker.terminate()` se scade.
- **Parametri limitati** per la demo locale (memoria massima dichiarata).
- **Cattura dell'errore di allocazione WASM** → **fallback alla stima analitica**, con messaggio: "Il tuo dispositivo non ha eseguito il calcolo; mostriamo la stima basata sui benchmark."
- Indicatore di avanzamento e pulsante "annulla".

### Struttura

```
src/
├─ model/      # formule di stima pure + data/ (benchmarks.json, pricing.json) + test
├─ sim/        # motori di simulazione offline/online, funzioni pure deterministiche + worker
├─ scenarios/  # scenari "Capisci" (domanda, previsione, passi, spiegazione, limite, difesa) come dati
├─ content/    # testi bilingui, glossario, riferimenti
├─ components/ # StrengthMeter, CrackHourglass, AttackerVsDefender, KdfLab, ShareCard
├─ privacy/    # gestione input sensibile, reset, guardie anti-persistenza
├─ store.ts    # stato (input, scenario, parametri, lingua, tema) — input sensibile mai persistito
└─ i18n/
```

---

## 🎨 Design, UI/UX e identità visiva

> Il talento visivo fa la differenza tra "l'ennesimo meter" e "wow" — ma il "wow" non deve mai sacrificare l'onestà dei numeri.

- **MVP: una sola animazione, curata al massimo** → la **"clessidra del cracking"**: stessa password, quattro algoritmi, il tempo passa da rosso-lampo (MD5) a verde-glaciale (Argon2id). Accanto: ordine di grandezza, scenario, link alle assunzioni.
- **v1.0: scena "Attaccante vs Difensore"**: contatore dei tentativi da un lato, scudi/blocchi che scattano dall'altro, con i **quattro esiti** dell'attacco online ben distinti visivamente.
- **Palette "laboratorio":** base scura, accento bronzo/oro per la difesa, rosso per l'attacco, grigio neutro per "ipotesi". Design system con token condivisi.
- **Rappresentazione onesta dei numeri:** scala logaritmica spiegata, ordini di grandezza ("secondi / giorni / secoli") invece di cifre a 12 decimali, etichette `misurato / derivato / ipotesi`.

### Share card: solo esperimenti, mai dati della password

**Vietato** nella card: password, frammenti, lunghezza, punteggio, hash, entropia, tempo legato alla password dell'utente, qualsiasi indizio personale. (Una card con "14 caratteri, resiste 400 anni" regala informazioni a un attaccante e genera falsa sicurezza.)

**Consentito:** card generate **solo da scenari didattici predefiniti**, ad es.:

> **"Stessa password di esempio. Quattro algoritmi. Costi d'attacco molto diversi."**
> **"Ho completato l'esperimento 'Il lockout ferma lo spraying?' su CrackLab."**

Le assunzioni essenziali (scenario, hardware) restano leggibili nella card. Generazione SVG → PNG lato client.

---

## 🧑‍🎓 Usabilità per utenti non esperti

Requisito esplicito: utilizzabile **anche da chi non è esperto** (è un pubblico primario).

- **Risposta immediata e visiva:** esempio o password di prova → clessidra + frase semplice ("con un database sottratto e un algoritmo veloce, un attaccante la troverebbe in pochi secondi; con un algoritmo lento ci vorrebbe molto di più — ma resta tra le prime prove dei dizionari").
- **Linguaggio quotidiano di default:** "il modo in cui il sito conserva la tua password" invece di "KDF"; "Mostra dettagli tecnici" espande termini, formule e assunzioni; glossario inline.
- **Esempi precaricati** in evidenza, per non dover digitare nulla di proprio.
- **Consiglio azionabile sempre presente:** password manager, passphrase generata, MFA (preferendo app o chiavi di sicurezza agli SMS quando possibile).
- **Onboarding breve** + tour opzionale dell'animazione.

**Ipotesi da verificare (non promessa):** una persona non tecnica capisce in circa 10 secondi quanto conta l'algoritmo, perché, e cosa fare. Da validare con test di usabilità (vedi [KPI](#-kpi-e-metriche-di-successo)).

---

## ♿ Accessibilità

**WCAG 2.1 AA** fin dall'MVP:

- Significato mai affidato al solo colore (icone + etichette testuali).
- **`prefers-reduced-motion`** → versione statica **equivalente** delle animazioni (stesse informazioni, nessuna perdita didattica).
- Tastiera completa, incluso il completamento di uno scenario "Capisci".
- Contrasto verificato, responsive 390/768 px.
- I risultati delle simulazioni annunciati agli screen reader (`aria-live="polite"`).
- axe in CI + verifica manuale con screen reader.

---

## 🔐 Sicurezza, privacy, etica e aspetti legali

### Privacy: requisiti verificabili (non solo dichiarati)

- **Avviso iniziale permanente** nel campo di input:
  > _"Usa un esempio o una variazione inventata, non una password che usi davvero."_
- **Nessuna password** in URL, `localStorage`/`sessionStorage`/IndexedDB, report, share card, log, analytics.
- **Nessun session replay** né tracciamento del campo; analytics (se presenti) privacy-friendly, aggregati, solo eventi non sensibili.
- **Asset e dipendenze serviti localmente** (self-hosted, niente CDN): nessuno script di terze parti nella schermata sensibile.
- **CSP stringente:** `default-src 'self'`; `connect-src 'self'` (con `https://api.pwnedpasswords.com` aggiunto **solo** se l'utente attiva HIBP); niente `unsafe-eval` (per WASM si valuta `'wasm-unsafe-eval'`, documentandolo).
- **Test automatici di rete in CI (Playwright):** durante digitazione e calcolo, nessuna richiesta di rete in uscita; con HIBP attivo, solo la richiesta al range API con prefisso di 5 caratteri esadecimali.
- **Pulsante "svuota tutto"**: azzera input, risultati e stato Zustand. Non promettiamo la cancellazione sicura della memoria: in JavaScript le stringhe sono immutabili e la loro rimozione dipende dal garbage collector. Lo diciamo in chiaro.

### Anti-interferenza di password manager e autofill

Il campo di prova non deve essere salvato né compilato dai password manager dell'utente:

```html
<input
  type="password"
  name="cracklab-sample"
  autocomplete="off"
  data-lpignore="true"
  data-1p-ignore
  data-bwignore
  spellcheck="false"
  autocorrect="off"
  autocapitalize="off"
/>
```

Nota: alcuni browser ignorano `autocomplete="off"` sui campi password; gli attributi specifici dei manager riducono il problema ma non lo eliminano. Da verificare con test manuali su Chrome, Firefox, Safari e sui principali password manager.

### HIBP (opzionale, Fase 3)

- k-anonymity: si invia **solo** il prefisso di 5 caratteri dell'hash SHA-1, mai la password né l'hash completo.
- Header **`Add-Padding: true`** per rendere uniforme la dimensione delle risposte.
- Trasparenza: il servizio riceve comunque **prefisso e metadati di rete** (IP, user agent). k-anonymity riduce l'informazione condivisa, non la azzera. Spiegato passo-passo, disattivato di default.

### Etica (scelte di prodotto, non solo parole)

- **Non è un cracker:** nessun input di hash di terzi, nessun wordlist-cracking, nessuna funzione "bucare l'hash X". Scelta **architetturale**.
- **Ogni scenario d'attacco termina in una difesa.**
- Stime sempre accompagnate dalle assunzioni → niente allarmismo né falsa sicurezza.

### Sicurezza dell'app

CSP come sopra, dipendenze pinnate, SBOM e audit in CI, Web Worker per isolare il calcolo, Subresource Integrity non necessaria perché tutto è self-hosted.

### Legale

Disclaimer educativo; licenza **GPL-3.0**; riferimenti a standard pubblici ([NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html), [OWASP](https://cheatsheetseries.owasp.org/)); prezzi cloud citati come illustrativi e datati.

---

## 🛠️ Modello di sviluppo, governance e pubblicazione

> Requisito: **il team ha totale libertà di sviluppo coerente col progetto**, e **ogni modifica va pubblicata sul `main` del repo**.

**Libertà del team entro quattro vincoli non negoziabili:**

1. **Confine etico "no-cracker"**.
2. **Privacy verificabile** (test di rete verdi, nessuna persistenza dell'input).
3. **Onestà delle stime** (formulazioni della sezione [Principi scientifici](#-principi-scientifici-cosa-diciamo-e-cosa-no), assunzioni sempre visibili).
4. **Design system e accessibilità AA**.

**Workflow Git — ogni modifica su `main` (GitHub Flow):**

1. `main` sempre **deployabile** e **protetto** (PR obbligatoria, CI verde + review).
2. Feature branch → **Pull Request** → CI + **preview deploy Vercel**.
3. Review con checklist (inclusa la verifica dei testi contro i Principi scientifici) → **merge su `main`** → **deploy in produzione automatico**.
4. **Conventional Commits** ([spec](https://www.conventionalcommits.org/)) + **SemVer** + changelog.

**Gate bloccanti in CI:** ESLint, TS strict, Vitest (copertura ≥ 80% su `model/` e `sim/`), test del modello (fonti/date/`kind`), **test di rete per la privacy**, build, axe, `npm audit`, Lighthouse CI.

**Aggiornamento benchmark e prezzi:** via PR su `benchmarks.json` / `pricing.json`, con fonte obbligatoria; template di PR dedicato.

---

## ▲ Hosting e deploy (Vercel)

**Scelta consigliata: [Vercel](https://vercel.com/docs)**:

- **Production su `main`:** ogni merge pubblica in produzione (rollback immediato).
- **Preview deploy per ogni PR:** validazione di animazioni, stime, accessibilità (incl. `reduced-motion`) e privacy _prima_ del merge.
- **Header di sicurezza** (CSP, `Referrer-Policy: no-referrer`, `Permissions-Policy`) configurati in `vercel.json`.
- **Zero-config** per Vite, HTTPS, CDN, dominio custom (`cracklab.dev` o sottodominio del tuo sito).
- **Costo:** piano Hobby gratuito (verificare i termini d'uso per il tipo di progetto).

**Alternative:** Cloudflare Pages, GitHub Pages (senza preview per PR native).

---

## 📣 Comunicazione, crescita e SEO

**Loop virale:** gancio universale (SEO) → la clessidra sorprende → scenario "Capisci" completato → **share card dell'esperimento** (mai dati della password) → sfida tra colleghi → ogni pagina rimanda a **te**.

- **SEO:** "quanto è sicura la mia password", "tempo per craccare una password", "bcrypt vs argon2", "cos'è il password spraying", "il salt basta?".
- **Pagine-intento** = scenari "Capisci" indicizzabili, ciascuno con la sua domanda come titolo.
- **Lancio duale:** tecnico (r/crypto, r/cybersecurity, Hacker News) **e** generalista (LinkedIn, divulgazione).
- **Clip brevi** della clessidra e della scena Attaccante vs Difensore per i social.
- **Messaggio di lancio:** _"Non predice quando cadrà la tua password. Ti mostra cosa cambia davvero il costo di un attacco."_

---

## 📊 KPI e metriche di successo

### Crescita

| Metrica                      | 3 mesi  | 12 mesi  | Fonte                      |
| ---------------------------- | ------- | -------- | -------------------------- |
| Visitatori unici / mese      | 4.000   | 40.000+  | analytics privacy-friendly |
| Scenari "Capisci" completati | trend ↑ | trend ↑↑ | evento client aggregato    |
| Share card generate          | trend ↑ | trend ↑↑ | evento client aggregato    |
| Stelle GitHub                | 200     | 1.500+   | GitHub                     |
| Query SEO in top-10          | 6       | 50+      | Search Console             |
| Lighthouse (Perf/A11y)       | ≥ 90    | ≥ 95     | Lighthouse CI              |

### Comprensione (il prodotto insegna davvero?)

Misurate con **mini-quiz opzionali a fine scenario** (risposte aggregate e anonime) e **test di usabilità** con 5–8 persone a ogni fase:

| Domanda di verifica                                      | Obiettivo                                     |
| -------------------------------------------------------- | --------------------------------------------- |
| Distingue attacco online e offline?                      | ≥ 70% risposte corrette                       |
| Capisce che il salt non rende forte una password debole? | ≥ 70%                                         |
| Sa spiegare perché un KDF lento aiuta?                   | ≥ 60%                                         |
| Trova le assunzioni di una stima entro 15 s?             | ≥ 80% nei test di usabilità                   |
| Completa uno scenario solo da tastiera?                  | 100% nei test a11y                            |
| Ipotesi "capisce in ~10 s quanto conta l'algoritmo"      | verificata o rivista dopo i test della Fase 1 |

---

## 🧑‍🤝‍🧑 Il team

### Lean core team (realistico: 2–3 persone, o una persona con assistenza AI)

| Profilo                          | Copre                                                                                             | Competenze chiave                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **A — Engineering & Security**   | architettura, modello di stima, Web Worker, WASM/KDF, simulazioni, privacy tecnica, CI/CD, deploy | TypeScript, crittografia applicata, AppSec, test, GitHub Actions, Vercel |
| **B — Product, Design & Motion** | percorsi Prova/Capisci/Progetta, UI, animazioni, accessibilità, testi, share card, SEO            | React, Tailwind, Motion, SVG, WCAG, UX writing                           |
| **C — (opz.) Content & Growth**  | scenari didattici, i18n IT/EN, articoli, lancio, community                                        | divulgazione tecnica, SEO, social                                        |

Revisioni esterne consigliate (anche volontarie, a richiesta): **un esperto crittografia/IAM** per il modello e **un tester con screen reader** prima della v1.0.

### Matrice di competenze (non teste fisiche)

L'elenco esteso serve a non dimenticare nessuna dimensione; ogni competenza è assegnata a un profilo del core team.

| Area                | Competenze                                         | Profilo                 |
| ------------------- | -------------------------------------------------- | ----------------------- |
| Prodotto            | visione, confine etico, priorità, metriche         | A + B                   |
| Architettura        | modello di stima, Web Worker, performance          | A                       |
| Simulazione         | motori offline/online puri e deterministici        | A                       |
| Crittografia        | KDF/hash via WASM, parametri, correttezza          | A (+ revisione esterna) |
| Build/Platform      | bundle, WASM, PWA                                  | A                       |
| UX/UI               | flussi, gerarchia, usabilità per non esperti       | B                       |
| Motion              | clessidra, Attaccante vs Difensore, reduced-motion | B                       |
| Design system/Brand | token, share card, logo/banner SVG                 | B                       |
| Accessibilità       | WCAG 2.1 AA, ARIA, axe                             | B (+ tester esterno)    |
| Data viz            | scale logaritmiche, ordini di grandezza            | B                       |
| AppSec/Privacy      | CSP, test di rete, k-anonymity, privacy by design  | A                       |
| Legale/Licenze      | GPL-3.0, disclaimer                                | A                       |
| QA                  | Vitest, Playwright, property-based                 | A                       |
| DevOps              | CI/CD, branch protection, SemVer                   | A                       |
| Contenuti/i18n      | UX writing, scenari, IT/EN                         | B / C                   |
| Crescita            | SEO, lancio, social, community                     | C (o B)                 |
| Dati                | KPI aggregati, quiz di comprensione                | C (o A)                 |

---

## 🗺️ Roadmap dettagliata a fasi + tempi

> Legenda stato `[ ]`/`[~]`/`[x]` · priorità **P0**→**P3**. Settimane (W1…) indicative.

### 🟥 Fase 0 — Fondamenta e modello (W1 · P0)

**Obiettivo:** repo + CI/CD + deploy, **modello di stima citato e testato**, stima di prevedibilità end-to-end.

**Ingegneria/DevOps**

- [x] Repo, licenza GPL-3.0, README/CONTRIBUTING, template issue/PR (incluso template "aggiorna benchmark").
- [x] Scaffolding React 19 / TS strict / Vite / Tailwind / Zustand / Motion.
- [~] CI (lint, type, test, build, axe, audit) + **branch protection su `main`** + Conventional Commits.
- [~] **Vercel**: production su `main` + preview per PR + header di sicurezza.
- [x] **Test di rete per la privacy** (Playwright) attivi da subito.

**Modello**

- [x] `src/model/data/benchmarks.json` con fonte, data, `kind` (measured/derived/assumption).
- [x] `src/model/data/pricing.json` con prezzi datati.
- [x] Formule: tentativi stimati → tempo → costo; tre scenari dichiarati.
- [x] Test: monotonie, presenza di fonti/date/`kind`, avviso benchmark vecchi, property-based.

**Ricerca**

- [x] Analisi di 8–10 strumenti simili → conferma o revisione dell'ipotesi di posizionamento.

**Core**

- [x] Integrazione `@zxcvbn-ts/core` + dizionari IT/EN on-demand → `StrengthMeter`.

**Exit gate:** una PR apre un preview; i test del modello e di rete passano; merge su `main` → produzione.

### 🟧 Fase 1 — MVP "Prova" (W2–W4 · P0)

**Obiettivo:** un esperimento che convince in 30 secondi, accessibile e onesto.

- [x] Tre esempi precaricati + avviso "usa un esempio".
- [x] Confronto MD5 / SHA-256 / bcrypt / Argon2id su tre scenari, assunzioni a un tap.
- [x] **Clessidra del cracking** (unica animazione) + versione statica per reduced-motion.
- [x] Singolo hash reale in Web Worker con **guardrail** (timeout, limite memoria, fallback analitico). _Fatto: `src/sim/kdfBench.ts` + `kdf.worker.ts`, input sintetico, parametri limitati, timeout 8 s._
- [x] Lezione conclusiva + consiglio azionabile.
- [x] Input protetto (anti-autofill, nessuna persistenza, pulsante "svuota tutto").
- [x] i18n IT/EN, tema chiaro/scuro, tastiera.
- [x] Coverage `model`/`sim` ≥ 80%; e2e (esempio → confronto atteso); axe.
- [ ] **Test di usabilità** con 5–8 persone non tecniche.

**Exit gate:** a11y AA; test di rete verdi; ipotesi "capisce in ~10 s" verificata o testi rivisti in base ai risultati.

### 🟨 Fase 2 — "Capisci" + "Progetta" → v1.0 (W5–W9 · P1)

**Obiettivo:** scenari guidati, scena Attaccante vs Difensore, laboratorio sviluppatori. **Fase più impegnativa.**

**Simulazione**

- [x] Motore **offline**: dictionary, mask, brute force su spazio ridotto; effetto di salt e KDF lento.
- [x] Motore **online**: dictionary/stuffing/**spraying** contro rate limit, lockout, MFA, rilevamento spray, delay progressivo — con i **quattro esiti** distinti.

**Scenari "Capisci"** (struttura domanda → previsione → simulazione → spiegazione → limite → difesa)

- [x] Stessa password su due account.
- [x] Il salt basta?
- [x] Il lockout ferma lo spraying?
- [x] Password scoperta + MFA.
- [x] Mini-quiz opzionale di comprensione a fine scenario.

**Motion/Design**

- [x] Scena **Attaccante vs Difensore** + versione statica equivalente.
- [x] **Share card didattiche** (solo scenari predefiniti, nessun dato della password).

**"Progetta"**

- [x] Scelta KDF e parametri, benchmark locale, slider sicurezza offline / costo server.
- [x] Raccomandazioni OWASP come punto di partenza, con trade-off spiegati.
- [x] Mini-report esportabile senza dati della password.

**Crescita**

- [x] README con GIF; 2–3 articoli; pagine-intento SEO (una per scenario); clip social.

**Exit gate:** Lighthouse Perf/A11y ≥ 90; animazioni accessibili; simulazioni testate; revisione esterna del modello; nessun blocker privacy/etica; v1.0 taggata (SemVer) + changelog.

### 🟩 Fase 3 — Crescita (continua · P2/P3)

- [x] Demo concettuale stilizzata delle **rainbow table**.
- [x] Generatore di passphrase (diceware) con stima dei tentativi.
- [x] **Policy builder**.
- [x] **HIBP k-anonymity opzionale** con padding, disattivato di default.
- [x] **PWA offline**.
- [~] Aggiornamento periodico di benchmark e prezzi (almeno annuale).
- [~] Iterazioni guidate dalle metriche di comprensione.

**Exit gate (continuo):** crescita misurabile; metriche di comprensione stabili o in miglioramento; adozione da terzi come strumento di awareness.

**Totale a v1.0: ~8–10 settimane calendario, ~50–65 gg/uomo.**

---

## ⚠️ Rischi e mitigazioni

| Rischio                                           | Prob. | Impatto | Mitigazione                                                                                                          |
| ------------------------------------------------- | ----- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Stime percepite come "verità assolute"            | Media | Alto    | ordini di grandezza, tre scenari dichiarati, etichette misurato/derivato/ipotesi, linguaggio da Principi scientifici |
| Falsa sicurezza ("con Argon2 sono al sicuro")     | Media | Alto    | lezione esplicita "password prevedibile resta prevedibile", esempio guidato dedicato                                 |
| Leak di informazioni via share card               | Media | Alto    | card solo da scenari predefiniti, nessun metadato della password                                                     |
| Utente inserisce la password reale                | Alta  | Medio   | avviso permanente, esempi in evidenza, nessuna persistenza, test di rete                                             |
| Password manager salva l'input di prova           | Media | Medio   | attributi anti-autofill, test manuali cross-browser                                                                  |
| Argon2id manda in crash la tab su mobile          | Media | Medio   | Web Worker, timeout, limite memoria, fallback analitico                                                              |
| Benchmark e prezzi obsoleti                       | Alta  | Medio   | file versionati con data, avviso in CI oltre 12 mesi, aggiornamento via PR                                           |
| Scambiato per un "cracker"                        | Media | Alto    | scelta architetturale no-cracker, nessun input di hash di terzi, ogni scenario finisce in una difesa                 |
| Sovrapposizione percepita con OSI-Explorer        | Media | Medio   | prodotto autonomo, focus su credenziali, scenari interattivi                                                         |
| Scope creep (troppe funzioni prima della qualità) | Alta  | Medio   | MVP ridotto, una sola animazione, funzioni avanzate in Fase 3                                                        |
| Invio accidentale di dati con HIBP                | Bassa | Alto    | solo prefisso a 5 caratteri + padding, opzionale, CSP che abilita l'endpoint solo se attivo                          |

---

<p align="center"><sub>Documento di impostazione — base di sviluppo. Nomi, priorità e tempi sono adattabili.</sub></p>

## Incremento verificabile — 2026-11-01

- [x] Dettagli IT/EN delle stime: parametri, hardware, fonte, data, velocità, provenienza del prezzo e formule; selezione coerente con lo scenario.
- [x] Compatibilità TypeScript con typescript-eslint ripristinata (6.0.3, lockfile aggiornato senza bypass dei peer).
- [x] Documentazione del modello corretta: rango invariato fra scenari; benchmark KDF locale ancora pianificato.
- [x] Invalidazione dei risultati durante il ricalcolo, gestione errori e limite input.
- [x] Gestione esplicita degli estremi numerici non rappresentabili.
- [x] Laboratorio KDF reale con worker e limiti di risorse, con misura locale su input sintetico.

Lo stato delle spunte include le verifiche successive del 27 novembre.

## Verifica per criteri di chiusura · 27 novembre 2026

| Criterio                | Evidenza                                                                                                                                                | Stato                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Prova e modello         | Confronto fra quattro algoritmi, tre profili, ipotesi espandibili, clessidre, cancellazione, dizionari IT/EN. Test numerici, proprietà e prova browser. | Verificato                                                                   |
| Capisci                 | Quattro URL con domanda, previsione, confronto con/senza difesa, limite, indicazione pratica, quiz ed export predefinito.                               | Verificato su Chromium                                                       |
| Progetta                | Scelta dell’algoritmo e dei parametri, worker con limiti, modello di concorrenza a memoria riservata, report su stringa sintetica.                      | Verificato su Chromium                                                       |
| Privacy e offline       | Prova offline su percorso mai visitato e stima locale. Per HIBP il test intercetta il worker e controlla prefisso, padding e consenso.                  | Verificato in ambiente di test                                               |
| Provenienza             | Dati versionati e classificati. I tassi e i prezzi attuali sono ipotesi illustrative. Il benchmark del dispositivo misura un altro fenomeno.            | Validazione dello schema superata; revisione scientifica indipendente aperta |
| Ricerca di prodotto     | [Confronto di otto strumenti](docs/research/competitors.md).                                                                                            | Completato                                                                   |
| Validazione con persone | 5–8 partecipanti non tecnici, tempi per trovare le assunzioni, comprensione, prova assistiva.                                                           | Mancano osservazioni dirette                                                 |
| Pubblicazione           | Il ramo principale risultava privo di protezione. Produzione e preview richiedono riscontro sul deploy.                                                 | Verifica infrastrutturale distinta dai test locali                           |
| Crescita                | Adozione, metriche longitudinali, manutenzione dei dataset.                                                                                             | Attività continuative                                                        |

I simulatori lavorano su spazi finiti e registri sintetici con esiti osservabili. Le formule e i casi di riferimento sono in `src/sim/teachingCases.ts`, con test per ogni difesa. Il README collega la GIF, due clip e due articoli. Nella misura Lighthouse desktop della home locale, prestazioni e accessibilità hanno ottenuto 100/100. Il protocollo per raccogliere osservazioni reali è in [docs/research/usability.md](docs/research/usability.md).

Il workflow CI conserva l’inventario CycloneDX e applica le soglie Lighthouse. Il controllo mensile segnala dataset con più di dodici mesi. L’aggiornamento dei valori richiede nuove fonti datate. I quiz esportano conteggi anonimi delle prime risposte per le sessioni formative; le metriche di comprensione richiedono partecipanti reali.

Il 27 novembre il progetto e il precedente deployment non risultavano accessibili via Vercel nel team indicato dallo storico GitHub (HTTP 404). Il deploy di produzione e la preview restano aperti fino alla verifica sul progetto corretto. La v1.0 richiede inoltre la revisione indipendente del modello.
