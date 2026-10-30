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
  scoreLabel: 'Prevedibilità',
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
    prudent: { name: 'Prudente', desc: '1 GPU consumer, solo dizionari comuni.' },
    central: { name: 'Centrale', desc: 'Piccolo cluster noleggiato, dizionari + regole di mutazione.' },
    aggressive: {
      name: 'Aggressivo',
      desc: 'Cluster di più GPU di fascia alta, attacco mirato con dizionari personalizzati.'
    }
  },
  examples: [
    { id: 'weak', label: 'Debole', value: 'password123' },
    { id: 'word-numbers', label: 'Parola + numeri', value: 'Giulia2015!' },
    { id: 'passphrase', label: 'Passphrase', value: 'tavolo-brezza-quaranta-ruggine' }
  ]
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
  scoreLabel: 'Predictability',
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
    prudent: { name: 'Prudent', desc: '1 consumer GPU, common dictionaries only.' },
    central: { name: 'Central', desc: 'Small rented cluster, dictionaries + mutation rules.' },
    aggressive: {
      name: 'Aggressive',
      desc: 'Multi high-end GPU cluster, targeted attack with custom dictionaries.'
    }
  },
  examples: [
    { id: 'weak', label: 'Weak', value: 'password123' },
    { id: 'word-numbers', label: 'Word + numbers', value: 'Giulia2015!' },
    { id: 'passphrase', label: 'Passphrase', value: 'table-breeze-forty-rust' }
  ]
};

export const catalogs: Record<Language, Catalog> = { it, en };

export function useCatalog(language: Language): Catalog {
  return catalogs[language];
}
