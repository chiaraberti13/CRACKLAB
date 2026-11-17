# Accessibility

CrackLab targets **WCAG 2.1 AA** from the MVP.

- **Colour is never the only signal.** Attack/defense/assumption states carry text and/or icons as well as colour.
- **Contrast.** All text/background pairings meet AA (4.5:1); verified by the axe end-to-end test.
- **Keyboard.** Full keyboard operation, a skip link to the main content, visible focus (`:focus-visible`), and
  `aria-pressed` on toggle controls (scenario selector).
- **Motion.** `prefers-reduced-motion` is honoured globally; animations collapse to an equivalent static view with
  no loss of information (the "clessidra" animation ships with a static equivalent in Fase 1).
- **Live regions.** Simulation results are announced with `aria-live="polite"`.
- **Responsive.** No horizontal page scroll; a 16px side gutter; verified at 390 px and 768 px.

## Enforcement

`@axe-core/playwright` runs in CI against the production build (`e2e/accessibility.spec.ts`) with WCAG 2.0/2.1 A and
AA tags, and Lighthouse CI enforces a minimum accessibility score. A new interactive view must pass axe before merge.

## Ambito e stato delle verifiche

Scenari, controlli, stime e animazioni; verificare che le informazioni siano leggibili senza colore o movimento.

Le caratteristiche e i controlli già descritti in questo documento si riferiscono al loro ambito. I controlli automatici non sostituiscono una verifica manuale con tecnologie assistive.

Questa pagina documenta obiettivi, limiti e modalità di segnalazione; non certifica la conformità WCAG. L'assenza di problemi segnalati non dimostra l'assenza di barriere.

## Ambienti e limiti

Per requisiti e ambienti di esecuzione consulta [il README](../README.md). La compatibilità di un ambiente di esecuzione non equivale alla compatibilità con ogni tecnologia assistiva. Browser, sistemi operativi, lettori di schermo, terminali e versioni devono essere registrati quando si effettua una verifica. Componenti esterni e documenti esportati richiedono valutazioni separate.

## Segnalare una barriera

Apri una [segnalazione di accessibilità](https://github.com/chiaraberti13/CRACKLAB/issues/new?template=accessibility.yml) indicando attività che non riesci a completare, passi, risultato atteso, ambiente e tecnologia assistiva se utilizzata. Non è necessario comunicare diagnosi o informazioni sanitarie. Allega solo esempi privi di dati personali. Per problemi riservati segui [la policy di sicurezza](../SECURITY.md).

## Aspettative per i contributi

- Verificare tastiera, ordine e visibilità del focus nelle interfacce interessate.
- Usare etichette chiare, messaggi comprensibili e alternative testuali a immagini e grafici informativi.
- Non comunicare informazioni essenziali solo tramite colore, suono o movimento.
- Verificare ingrandimento e leggibilità; rispettare le preferenze di movimento ridotto dove applicabili.
- Registrare versione, ambiente, passi, esito e limiti di ogni prova, distinguendo controlli automatici e manuali.

La manutentrice coordina la valutazione delle segnalazioni e aggiorna questa pagina quando cambiano funzioni o evidenze. Le priorità considerano anzitutto le barriere che impediscono attività essenziali.
