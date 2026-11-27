# Dalla password corretta alla sessione

Un registro di autenticazione può contenere una verifica della password riuscita e un accesso finale negato. I due eventi appartengono a momenti diversi. Il servizio verifica il primo fattore, applica la policy dell’account e poi decide se rilasciare la sessione.

Nel percorso **Capisci → Conoscere la password basta per entrare?** il caso iniziale prevede una password conosciuta e un secondo fattore indisponibile a chi tenta l’accesso. Cambia soltanto il requisito del secondo fattore e osserva quali righe del risultato cambiano. Questa distinzione aiuta anche a leggere un incidente: un primo fattore esposto richiede attenzione anche quando la sessione è stata negata.

Gli errori di accesso possono riguardare un account oppure molti account diversi. Il laboratorio dei registri presenta entrambi i casi e permette di leggere separatamente il segnale di correlazione, il blocco e l’accesso completato. In produzione servono anche il contesto, il metodo di autenticazione e le modalità di recupero dell’account per interpretare gli eventi.

Fonte tecnica: [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html).
