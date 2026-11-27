import { useState } from 'react';
import type { Language } from '../store';
import { generateExample, SPACE } from '../lessons/passphrase';

export function Tools({ language }: { language: Language }) {
  const it = language === 'it';
  const [phrase, setPhrase] = useState(''),
    [salt, setSalt] = useState(false),
    [minimum, setMinimum] = useState(15),
    [blocklist, setBlocklist] = useState(true),
    [composition, setComposition] = useState(false);
  return (
    <>
      <section className="panel">
        <h2>{it ? 'Una tabella precalcolata' : 'A precomputed table'}</h2>
        <p>
          {it
            ? 'Schema concettuale di una rainbow table. I simboli rappresentano le estremità di catene già calcolate.'
            : 'Conceptual rainbow table. Symbols stand for the endpoints of precomputed chains.'}
        </p>
        <label>
          <input type="checkbox" checked={salt} onChange={(e) => setSalt(e.target.checked)} />{' '}
          {it ? 'Usa un salt diverso' : 'Use a different salt'}
        </label>
        <p aria-live="polite">
          {salt
            ? it
              ? 'Tabella α → ω · Record con salt B → β · La catena preparata per A non si riusa.'
              : 'Table α → ω · Record with salt B → β · The chain prepared for A cannot be reused.'
            : it
              ? 'Tabella α → ω · Record con salt A → ω · La corrispondenza permette una verifica.'
              : 'Table α → ω · Record with salt A → ω · The match allows verification.'}
        </p>
      </section>
      <section className="panel">
        <h2>{it ? 'Generatore di passphrase didattiche' : 'Teaching passphrase generator'}</h2>
        <p>
          {it
            ? 'Ogni parola è estratta con la stessa probabilità fra 36, come con due dadi. Con 12 estrazioni indipendenti si ottengono'
            : 'Each word is drawn uniformly from 36, like rolling two dice. Twelve independent draws give'}{' '}
          {SPACE.toLocaleString(language)}{' '}
          {it
            ? 'sequenze. In media una ricerca esaustiva ne prova circa metà. Usa gli esempi solo nel laboratorio.'
            : 'sequences. Exhaustive search tries about half on average. Use examples only in the lab.'}
        </p>
        <button onClick={() => setPhrase(generateExample(language))}>
          {it ? 'Genera esempio' : 'Generate example'}
        </button>
        {phrase && (
          <>
            <button onClick={() => setPhrase('')}>{it ? 'Cancella' : 'Clear'}</button>
            <output className="block break-all">{phrase}</output>
          </>
        )}
      </section>
      <section className="panel">
        <h2>{it ? 'Progetta una policy' : 'Design a password policy'}</h2>
        <p>
          {it ? 'Scenario: una password usata come unico fattore.' : 'Scenario: a password used as the only factor.'}
        </p>
        <label className="block">
          {it ? 'Lunghezza minima' : 'Minimum length'}{' '}
          <select value={minimum} onChange={(e) => setMinimum(Number(e.target.value))}>
            {[8, 12, 15, 20].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <input type="checkbox" checked={blocklist} onChange={(e) => setBlocklist(e.target.checked)} />{' '}
          {it ? 'Blocca password comuni o compromesse' : 'Block common or compromised passwords'}
        </label>
        <label className="block">
          <input type="checkbox" checked={composition} onChange={(e) => setComposition(e.target.checked)} />{' '}
          {it ? 'Simbolo obbligatorio' : 'Require a symbol'}
        </label>
        <ul aria-live="polite" className="list-disc pl-5">
          <li>
            {minimum >= 15
              ? it
                ? 'La soglia raggiunge i 15 caratteri indicati da NIST.'
                : 'Meets the NIST 15-character single-factor minimum.'
              : it
                ? 'Alza il minimo a 15 per questo scenario.'
                : 'Raise the minimum to 15 for this scenario.'}
          </li>
          <li>
            {blocklist
              ? it
                ? 'La blocklist intercetta scelte note.'
                : 'A blocklist catches known choices.'
              : it
                ? 'Aggiungi un controllo contro scelte note.'
                : 'Add a check against known choices.'}
          </li>
          <li>
            {composition
              ? it
                ? 'Un simbolo imposto favorisce sostituzioni prevedibili.'
                : 'A required symbol encourages predictable substitutions.'
              : it
                ? 'Sono ammesse frasi lunghe senza simboli.'
                : 'Long phrases without symbols are allowed.'}
          </li>
        </ul>
        <a href="https://pages.nist.gov/800-63-4/sp800-63b.html">NIST SP 800-63B-4</a>
      </section>
      <section className="panel">
        <h2>Pwned Passwords</h2>
        <a href="/hibp/">{it ? 'Apri la verifica facoltativa di un esempio' : 'Open optional example check'}</a>
      </section>
    </>
  );
}
