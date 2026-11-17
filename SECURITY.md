# Security Policy

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

### Supported versions

Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

### Scope

The client-side React application, the estimation model and its datasets, state/privacy logic, the build pipeline,
the deployment configuration and the dependency supply chain.

### Reporting

Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security
Advisories when available. Include the affected commit/version, impact, a minimal reproducible proof, environment
assumptions and possible mitigations. Remove any unrelated sensitive data — and never include a real password.

### Responsible testing

Test only systems, data and networks you own or are explicitly authorized to assess. No denial of service,
destructive actions, persistence, social engineering or unauthorized interception.

### Security requirements

Keep secrets outside source control; validate untrusted input; preserve the privacy boundary (no network access
and no persistence of the sample); never weaken the CSP or the deployment headers. Do not introduce a cracker
capability: third-party hash input, wordlist cracking or active exploitation are out of scope by design.

### Disclosure

Allow reasonable remediation time and coordinate publication of exploit-enabling details.

## Italiano

### Versioni supportate

Le correzioni riguardano la revisione più recente del branch predefinito, salvo release esplicitamente supportate.

### Ambito

L'applicazione React lato client, il modello di stima e i suoi dataset, la logica di stato/privacy, la pipeline di
build, la configurazione di deploy e la supply chain delle dipendenze.

### Segnalazione

Non aprire issue pubbliche per vulnerabilità non corrette. Usa la segnalazione privata / Security Advisories quando
disponibile. Indica commit/versione, impatto, PoC minimo riproducibile, assunzioni ambientali e mitigazioni,
eliminando dati sensibili non necessari — e senza mai includere una password reale.

### Test responsabili

Esegui test solo su sistemi, dati e reti propri o esplicitamente autorizzati. Sono esclusi DoS, azioni distruttive,
persistenza, social engineering e intercettazioni non autorizzate.

### Requisiti di sicurezza

Mantieni i segreti fuori dal repository; valida gli input; conserva il confine di privacy (nessuna rete, nessuna
persistenza dell'input); non indebolire la CSP o gli header di deploy. Non introdurre capacità da cracker: input di
hash di terzi, wordlist-cracking o exploitation attiva sono fuori ambito per scelta.

### Divulgazione

Concedi tempo ragionevole per la correzione e coordina la pubblicazione di dettagli sfruttabili.

## Percorso operativo di segnalazione

1. Consulta [la sezione sicurezza del repository](https://github.com/chiaraberti13/CRACKLAB/security) e usa la funzione di segnalazione privata se disponibile. La presenza di questo documento non implica che tale funzione sia abilitata.
2. Se la funzione non è disponibile, usa un canale privato già verificato con la manutentrice. In assenza di un contatto, chiedi soltanto l'attivazione di un canale riservato in una issue, senza dettagli tecnici, nomi di soggetti coinvolti o allegati sensibili. Se le issue sono disabilitate, usa un contatto verificato già disponibile; attendi un canale riservato prima di condividere dettagli.
3. Nel canale riservato indica versione o commit, componente, impatto, prerequisiti, riproduzione minima con dati sintetici ed eventuale mitigazione.
4. Concorda la pubblicazione dei dettagli dopo la valutazione e la correzione. Restano valide le eventuali tempistiche specifiche già indicate sopra; questa integrazione non introduce nuove garanzie sui tempi.

I bug ordinari e le richieste di accessibilità possono usare i modelli delle issue. Non allegare credenziali, dati di produzione o dati personali, neppure ai report tecnici quando non necessari.
