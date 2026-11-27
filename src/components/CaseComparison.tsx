import { useState } from 'react';
import { offlineWork, reviewLog, type Strategy, type Defense, type LogCase } from '../sim/teachingCases';
import type { Language } from '../store';

export function CaseComparison({ language, online }: { language: Language; online: boolean }) {
  const it = language === 'it';
  const [strategy, setStrategy] = useState<Strategy>('dictionary'),
    [unique, setUnique] = useState(true),
    [slow, setSlow] = useState(true);
  const [log, setLog] = useState<LogCase>('dictionary'),
    [control, setControl] = useState<Defense>('observe');
  const off = offlineWork(strategy, unique, slow),
    on = reviewLog(log, control);
  const rows = online
    ? [
        [it ? 'Eventi nella finestra' : 'Events in window', on.total],
        [it ? 'Password già note' : 'Passwords already known', on.known],
        [it ? 'Primi fattori superati' : 'First factors passed', on.firstFactor],
        [it ? 'Accessi completati' : 'Sessions granted', on.access],
        [it ? 'Eventi bloccati' : 'Events blocked', on.blocked],
        [it ? 'Segnale trasversale' : 'Cross-account signal', on.detected ? (it ? 'sì' : 'yes') : 'no'],
        [it ? 'Unità di attesa aggiunte' : 'Added waiting units', on.waitUnits]
      ]
    : [
        [it ? 'Possibilità per record' : 'Possibilities per record', off.possibilities],
        [it ? 'Verifiche complessive' : 'Total verifications', off.checks],
        [it ? 'Unità di lavoro' : 'Work units', off.units]
      ];
  return (
    <details className="panel">
      <summary>
        {online
          ? it
            ? 'Confronta i controlli su tre registri sintetici'
            : 'Compare controls on three synthetic logs'
          : it
            ? 'Confronta il lavoro su due record'
            : 'Compare work across two records'}
      </summary>
      {online ? (
        <>
          <p>
            {it
              ? 'Una finestra di osservazione. Dizionario: sei errori su un account. Riuso: un accesso con credenziali note seguito da quattro errori su account distinti. Spraying: un errore su ciascuno di sei account.'
              : 'One observation window. Dictionary: six failures on one account. Reuse: one known credential followed by four failures on distinct accounts. Spraying: one failure on each of six accounts.'}
          </p>
          <label className="block">
            {it ? 'Registro' : 'Log'}{' '}
            <select value={log} onChange={(e) => setLog(e.target.value as LogCase)}>
              <option value="dictionary">{it ? 'Dizionario' : 'Dictionary'}</option>
              <option value="stuffing">Credential stuffing</option>
              <option value="spraying">Password spraying</option>
            </select>
          </label>
          <label className="block">
            {it ? 'Controllo applicato' : 'Applied control'}{' '}
            <select value={control} onChange={(e) => setControl(e.target.value as Defense)}>
              {[
                ['observe', it ? 'Sola osservazione' : 'Observe only'],
                ['lockout', it ? 'Blocco dopo 5 errori' : 'Lock after 5 failures'],
                ['rate', it ? 'Limite globale di 3 eventi' : 'Global cap of 3 events'],
                ['delay', it ? 'Attesa progressiva per account' : 'Progressive per-account delay'],
                ['correlate', it ? 'Avviso da 4 account distinti' : 'Alert at 4 distinct accounts'],
                ['mfa', it ? 'Secondo fattore richiesto' : 'Second factor required']
              ].map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <p>
            {it
              ? 'Ogni controllo è valutato da solo. Il ritardo aggiunge un’unità per ogni errore precedente sullo stesso account. Le soglie illustrano il modello.'
              : 'Controls are evaluated individually. Delay adds a unit for each preceding failure on the account. The thresholds illustrate the model.'}
          </p>
        </>
      ) : (
        <>
          <p>
            {it
              ? 'Confronta il costo di esaminare un intero spazio su due record con gli stessi parametri. Il costo per verifica vale 1 oppure 10 unità arbitrarie.'
              : 'Compare checking a whole space for two records with the same parameters. Each check costs either 1 or 10 illustrative units.'}
          </p>
          <label className="block">
            {it ? 'Spazio illustrativo' : 'Illustrative space'}{' '}
            <select value={strategy} onChange={(e) => setStrategy(e.target.value as Strategy)}>
              <option value="dictionary">{it ? 'Dizionario di 8 voci' : 'Dictionary of 8 entries'}</option>
              <option value="mask">{it ? 'Maschera 4 × 4' : 'Mask 4 × 4'}</option>
              <option value="exhaustive">{it ? 'Esaustivo 4³' : 'Exhaustive 4³'}</option>
            </select>
          </label>
          <label className="block">
            <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} />{' '}
            {it ? 'Salt distinti per record' : 'Distinct salts per record'}
          </label>
          <label className="block">
            <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} />{' '}
            {it ? 'KDF con costo 10' : 'KDF with cost 10'}
          </label>
        </>
      )}
      <dl aria-live="polite">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-stroke py-1">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
