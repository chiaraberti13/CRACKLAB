# Confronto di otto strumenti e metodi

Ricognizione delle interfacce pubbliche e della documentazione, 27 novembre 2026. Le osservazioni descrivono ciò che ciascuna fonte presenta. La verifica di accessibilità e traffico di rete riguarda soltanto CrackLab.

| Strumento                                                                            | Cosa può osservare l’utente                                        | Conseguenza per CrackLab                                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [Bitwarden Password Strength Testing Tool](https://bitwarden.com/password-strength/) | Valutazione di un esempio e indicazioni per scegliere password.    | Affiancare al giudizio la configurazione di conservazione.                           |
| [Security.org](https://www.security.org/how-secure-is-my-password/)                  | Tempo di scoperta stimato in primo piano.                          | Dare accesso a fonte, data e ipotesi dalla stessa riga del risultato.                |
| [PasswordMonster](https://www.passwordmonster.com/)                                  | Contatori di classi di caratteri e tempo stimato.                  | Mostrare perché una sostituzione prevedibile può superare le regole di composizione. |
| [Pwned Passwords](https://haveibeenpwned.com/Passwords)                              | Presenza di un campione in un corpus di credenziali compromesse.   | Distinguere corrispondenza nel corpus e prevedibilità.                               |
| [Use A Passphrase](https://www.useapassphrase.com/)                                  | Generazione di frasi e tempo approssimativo.                       | Esporre numero di parole, dimensione della lista e modalità di estrazione.           |
| [NordPass](https://nordpass.com/secure-password/)                                    | Controllo della robustezza e indicazioni per l’utente.             | Offrire un passo successivo concreto dopo la prova.                                  |
| [Dropbox zxcvbn](https://github.com/dropbox/zxcvbn)                                  | Pattern, tentativi stimati e tempi per diversi scenari.            | L’analisi per scenari esiste già. Documentare le ipotesi e far variare le difese.    |
| [EFF Dice](https://www.eff.org/dice)                                                 | Procedura riproducibile di estrazione con dadi e liste pubblicate. | Distinguere lo spazio teorico delle estrazioni uniformi dalla stima su testo umano.  |

L’ipotesi iniziale va ridimensionata. Il confronto tra scenari ha precedenti. La scelta di prodotto è far formulare una previsione, cambiare una difesa e osservare l’esito, con provenienza dei dati e limiti sempre consultabili. Il valore per utenti non tecnici resta una domanda per le prove di usabilità.
