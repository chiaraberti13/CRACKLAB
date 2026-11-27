export const lessonIds = ['same-password', 'salt', 'lockout', 'mfa'] as const;
export type LessonId = (typeof lessonIds)[number];
interface Lesson {
  title: string;
  prediction: [string, string];
  correct: 0 | 1;
  evidence: string;
  explanation: string;
  limit: string;
  defense: string;
  quiz: string;
  choices: [string, string];
  answer: 0 | 1;
}

export const lessons: Record<'it' | 'en', Record<LessonId, Lesson>> = {
  it: {
    'same-password': {
      title: 'Due account con la stessa password hanno lo stesso hash?',
      prediction: ['Sempre', 'Dipende dal salt'],
      correct: 1,
      evidence: 'Due record con lo stesso algoritmo e gli stessi parametri',
      explanation:
        'Con lo stesso input e lo stesso salt il risultato si ripete. Due salt distinti fanno calcolare separatamente i verificatori.',
      limit: 'Un salt può essere pubblico. La sua utilità dipende anche dall’unicità per record.',
      defense: 'Genera un salt casuale per ogni record e conservalo insieme al verificatore.',
      quiz: 'Quale valore deve cambiare tra due record?',
      choices: ['Il nome dell’algoritmo', 'Il salt'],
      answer: 1
    },
    salt: {
      title: 'Il salt basta per una password prevedibile?',
      prediction: ['Sì', 'No'],
      correct: 1,
      evidence: 'Un account e un esempio già noto',
      explanation:
        'Il salt impedisce di condividere il lavoro tra record. Sul singolo record il costo di verifica dipende anche dal KDF.',
      limit: 'Il risultato illustra una verifica. La posizione effettiva di una password nei tentativi è incerta.',
      defense: 'Abbina Argon2id e salt unici a password generate da un gestore.',
      quiz: 'Con un salt pubblico si può verificare una singola ipotesi?',
      choices: ['Sì', 'No'],
      answer: 0
    },
    lockout: {
      title: 'Il blocco del singolo account rileva tutti gli errori?',
      prediction: ['Sì', 'No'],
      correct: 1,
      evidence: 'Registro sintetico di accessi falliti',
      explanation:
        'Il contatore del singolo account e il totale su account distinti descrivono fenomeni diversi. Un segnale trasversale rende visibile la distribuzione degli errori.',
      limit: 'Un avviso richiede analisi. Anche un disservizio può causare errori diffusi.',
      defense: 'Correla gli errori tra account e servizi e verifica il contesto prima di intervenire.',
      quiz: 'Quale dato aiuta a riconoscere uno spraying?',
      choices: ['Il totale dei soli successi', 'Gli errori distribuiti su account distinti'],
      answer: 1
    },
    mfa: {
      title: 'Conoscere la password basta per entrare?',
      prediction: ['Sì', 'Dipende dai fattori richiesti'],
      correct: 1,
      evidence: 'Accesso sintetico con password corretta',
      explanation:
        'Dopo la verifica del primo fattore il servizio può richiedere una seconda prova. La sessione viene concessa solo se la policy è soddisfatta.',
      limit: 'Il risultato presume che il secondo fattore e il recupero account siano protetti.',
      defense: 'Preferisci un autenticatore resistente al phishing e proteggi il recupero account.',
      quiz: 'Quando viene concessa la sessione in questa policy?',
      choices: ['Dopo tutti i fattori richiesti', 'Subito dopo la password'],
      answer: 0
    }
  },
  en: {
    'same-password': {
      title: 'Do two accounts with the same password have the same hash?',
      prediction: ['Always', 'It depends on the salt'],
      correct: 1,
      evidence: 'Two records with the same algorithm and parameters',
      explanation: 'The same input and salt repeat the result. Distinct salts require separate verifier computations.',
      limit: 'A salt may be public. Its value depends on being unique per record.',
      defense: 'Generate a random salt for each record and store it alongside the verifier.',
      quiz: 'Which value should differ between records?',
      choices: ['Algorithm name', 'Salt'],
      answer: 1
    },
    salt: {
      title: 'Is salt enough for a predictable password?',
      prediction: ['Yes', 'No'],
      correct: 1,
      evidence: 'One account and one known example',
      explanation:
        'Salt prevents sharing work across records. For one record the verification cost also depends on the KDF.',
      limit: 'This shows a single verification. The actual guess rank is uncertain.',
      defense: 'Combine Argon2id and unique salts with manager-generated passwords.',
      quiz: 'Can a single guess still be verified with a public salt?',
      choices: ['Yes', 'No'],
      answer: 0
    },
    lockout: {
      title: 'Does per-account lockout detect every failed sign-in?',
      prediction: ['Yes', 'No'],
      correct: 1,
      evidence: 'Synthetic log of failed sign-ins',
      explanation:
        'A per-account counter and failures across distinct accounts describe different events. Cross-account monitoring reveals the distribution.',
      limit: 'An alert needs investigation. Service outages can also cause widespread failures.',
      defense: 'Correlate errors across accounts and services and investigate their context.',
      quiz: 'Which signal helps identify password spraying?',
      choices: ['Successful logins alone', 'Failures across distinct accounts'],
      answer: 1
    },
    mfa: {
      title: 'Is knowing the password enough to sign in?',
      prediction: ['Yes', 'It depends on the required factors'],
      correct: 1,
      evidence: 'Synthetic sign-in with a correct password',
      explanation:
        'After checking the first factor, a service can require another proof. A session is granted only when the policy is satisfied.',
      limit: 'This assumes the second factor and account recovery are protected.',
      defense: 'Prefer a phishing-resistant authenticator and protect account recovery.',
      quiz: 'When does this policy grant a session?',
      choices: ['After all required factors', 'Immediately after the password'],
      answer: 0
    }
  }
};
