# Due account, una password, due verificatori

Immagina due iscrizioni indipendenti che usano la stessa parola. Un servizio che applica la stessa funzione deterministica con gli stessi parametri ottiene lo stesso verificatore. Chi confronta i record vede subito una relazione fra i due account.

Un salt casuale distinto cambia l’input della funzione per ogni iscrizione. La stessa parola produce così verificatori differenti e il calcolo eseguito per il primo record va ripetuto per il secondo. Nel percorso **Capisci → Due account con la stessa password** puoi attivare e disattivare i salt su due record sintetici. Le lettere greche rappresentano risultati simbolici.

Sul singolo account rimane la domanda più importante: quanto lavoro richiede verificare una scelta prevedibile? Una funzione di derivazione per password, come Argon2id, richiede tempo e memoria per ciascuna verifica. In **Progetta** puoi misurare questo costo sul tuo dispositivo. Il carico simultaneo di un servizio reale dipende anche dalla CPU, dalla memoria disponibile e dalla latenza accettabile.

Fonte tecnica: [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
