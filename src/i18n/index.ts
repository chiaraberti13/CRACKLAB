import type { MagnitudeKey } from '../model/estimate';
import type { Algorithm, DataKind, Scenario } from '../model/types';
import type { Language } from '../store';

/**
 * Typed bilingual UI catalog, with no runtime i18n dependency. Declaring both
 * `it` and `en` as `Catalog` makes TypeScript reject a key that is present in one
 * language and missing in the other, keeping the two in parity.
 */
export interface Catalog {
  appName: string;
  tagline: string;
  warning: string;
  sampleLabel: string;
  samplePlaceholder: string;
  examplesLabel: string;
  scenarioLabel: string;
  guessesLabel: string;
  scoreLabel: string;
  comparisonTitle: string;
  comparisonIntro: string;
  costLabel: string;
  timeLabel: string;
  assumptionsTitle: string;
  lessonTitle: string;
  lessonBody: string;
  adviceTitle: string;
  adviceBody: string;
  clearAll: string;
  langToggle: string;
  notAPrediction: string;
  magnitude: Record<MagnitudeKey, string>;
  kind: Record<DataKind, string>;
  algorithm: Record<Algorithm, string>;
  scenarios: Record<Scenario, { name: string; desc: string }>;
  examples: { id: string; label: string; value: string }[];
  kdfLab: {
    title: string;
    intro: string;
    run: string;
    running: string;
    failed: string;
    limits: string;
    factor: (n: string) => string;
  };
}

const it: Catalog = {
  appName: 'CrackLab',
  tagline: 'Non predice quando cadrà la tua password. Ti mostra cosa cambia davvero il costo di un attacco.',
  warning: 'Usa un esempio o una variazione inventata, non una password che usi davvero.',
  sampleLabel: 'Password di prova',
  samplePlaceholder: 'Scrivi un esempio inventato…',
  examplesLabel: 'Oppure prova un esempio precaricato',
  scenarioLabel: 'Scenario di attacco',
  guessesLabel: 'Tentativi stimati (zxcvbn)',
  scoreLabel: 'Robustezza stimata',
  comparisonTitle: 'Stessa password, quattro algoritmi',
  comparisonIntro:
    'Con un database sottratto, ecco come cambia l’ordine di grandezza del tempo e del costo dell’attacco a seconda di come il sito conserva la password.',
  costLabel: 'Costo illustrativo',
  timeLabel: 'Tempo',
  assumptionsTitle: 'Assunzioni',
  lessonTitle: 'La lezione',
  lessonBody:
    'L’algoritmo del sito moltiplica il costo di ogni tentativo, ma una password prevedibile resta prevedibile. Servono entrambe le cose: una password non indovinabile e una conservazione corretta lato server.',
  adviceTitle: 'Cosa fare',
  adviceBody:
    'Usa un password manager per generare password lunghe e casuali, o una passphrase di parole casuali, e attiva l’MFA (meglio app o chiave di sicurezza che SMS).',
  clearAll: 'Svuota tutto',
  langToggle: 'English',
  notAPrediction:
    'Ordine di grandezza illustrativo su assunzioni dichiarate: non è una previsione di quando la password verrà scoperta.',
  magnitude: {
    instant: 'istantaneo',
    seconds: 'secondi',
    minutes: 'minuti',
    hours: 'ore',
    days: 'giorni',
    months: 'mesi',
    years: 'anni',
    centuries: 'secoli'
  },
  kind: {
    measured: 'misurato',
    derived: 'derivato',
    assumption: 'ipotesi'
  },
  algorithm: {
    md5: 'MD5',
    sha256: 'SHA-256',
    bcrypt: 'bcrypt',
    argon2id: 'Argon2id'
  },
  scenarios: {
    prudent: {
      name: 'Prudente',
      desc: 'Una GPU consumer. Il numero di tentativi stimati resta uguale nei tre scenari.'
    },
    central: { name: 'Centrale', desc: 'Piccolo cluster noleggiato. Cambiano velocità e prezzo ipotizzati.' },
    aggressive: {
      name: 'Aggressivo',
      desc: 'Cluster con più GPU di fascia alta. Il confronto usa lo stesso esempio e lo stesso numero di tentativi.'
    }
  },
  examples: [
    { id: 'weak', label: 'Debole', value: 'password123' },
    { id: 'word-numbers', label: 'Parola + numeri', value: 'Giulia2015!' },
    { id: 'passphrase', label: 'Passphrase', value: 'tavolo-brezza-quaranta-ruggine' }
  ],
  kdfLab: {
    title: 'Laboratorio sviluppatori: costo reale su questo dispositivo',
    intro:
      'Esegue davvero MD5, SHA-256, bcrypt e Argon2id con i parametri selezionati in un Web Worker, su una stringa sintetica fissa: ogni misura usa lo stesso input.',
    run: 'Esegui il confronto reale',
    running: 'Calcolo in corso…',
    failed: 'Misurazione interrotta (tempo massimo o memoria insufficiente): resta valida la stima analitica.',
    limits:
      'Misura di una singola esecuzione su questo dispositivo, non la velocità di un attaccante con GPU dedicate: i valori dei tre scenari restano quelli del dataset.',
    factor: (n) => `Il KDF più lento costa circa ${n}× l’hash veloce, per ogni tentativo.`
  }
};

const en: Catalog = {
  appName: 'CrackLab',
  tagline: "It doesn't predict when your password will fall. It shows what really changes the cost of an attack.",
  warning: 'Use an example or an invented variation, not a password you actually use.',
  sampleLabel: 'Sample password',
  samplePlaceholder: 'Type an invented example…',
  examplesLabel: 'Or try a preloaded example',
  scenarioLabel: 'Attack scenario',
  guessesLabel: 'Estimated guesses (zxcvbn)',
  scoreLabel: 'Estimated strength',
  comparisonTitle: 'Same password, four algorithms',
  comparisonIntro:
    'With a stolen database, here is how the order of magnitude of the attack time and cost changes depending on how the site stores the password.',
  costLabel: 'Illustrative cost',
  timeLabel: 'Time',
  assumptionsTitle: 'Assumptions',
  lessonTitle: 'The lesson',
  lessonBody:
    'The site’s algorithm multiplies the cost of every attempt, but a predictable password stays predictable. You need both: a password that cannot be guessed and correct storage on the server.',
  adviceTitle: 'What to do',
  adviceBody:
    'Use a password manager to generate long random passwords, or a random-word passphrase, and turn on MFA (an app or security key beats SMS).',
  clearAll: 'Clear all',
  langToggle: 'Italiano',
  notAPrediction:
    'Illustrative order of magnitude on declared assumptions: not a prediction of when the password will be discovered.',
  magnitude: {
    instant: 'instant',
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    months: 'months',
    years: 'years',
    centuries: 'centuries'
  },
  kind: {
    measured: 'measured',
    derived: 'derived',
    assumption: 'assumption'
  },
  algorithm: {
    md5: 'MD5',
    sha256: 'SHA-256',
    bcrypt: 'bcrypt',
    argon2id: 'Argon2id'
  },
  scenarios: {
    prudent: { name: 'Prudent', desc: 'One consumer GPU. Estimated guesses stay the same across scenarios.' },
    central: { name: 'Central', desc: 'Small rented cluster. Assumed speed and price change.' },
    aggressive: {
      name: 'Aggressive',
      desc: 'Multiple high-end GPUs. The comparison keeps the same sample and guess count.'
    }
  },
  examples: [
    { id: 'weak', label: 'Weak', value: 'password123' },
    { id: 'word-numbers', label: 'Word + numbers', value: 'Giulia2015!' },
    { id: 'passphrase', label: 'Passphrase', value: 'table-breeze-forty-rust' }
  ],
  kdfLab: {
    title: 'Developer lab: real cost on this device',
    intro:
      'Really runs MD5, SHA-256, bcrypt and Argon2id with the selected parameters in a Web Worker on a fixed synthetic string: every measurement uses the same input.',
    run: 'Run the real comparison',
    running: 'Computing…',
    failed: 'Measurement stopped (timeout or not enough memory): the analytical estimate still applies.',
    limits:
      'A single-run measurement on this device, not the speed of an attacker with dedicated GPUs: the three scenarios still use the dataset values.',
    factor: (n) => `The slowest KDF costs about ${n}× the fast hash, for every guess.`
  }
};

export const catalogs: Record<Language, Catalog> = { it, en };

export function useCatalog(language: Language): Catalog {
  return catalogs[language];
}
