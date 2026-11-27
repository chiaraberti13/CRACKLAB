import { useState } from 'react';
import { useCatalog } from '../i18n';
import { ALGORITHMS } from '../model/types';
import type { Algorithm } from '../model/types';
import { DEFAULT_PARAMS, slowdownFactor } from '../sim/kdfBench';
import type { KdfTiming } from '../sim/kdfBench';
import { runInWorker } from '../workers/kdfClient';
import type { Language } from '../store';

/**
 * Developer lab: executes the four algorithms for real, in a Web Worker, on a fixed
 * synthetic string. The password typed above is never passed to it.
 */
export function LocalKdfLab({ language }: { language: Language }) {
  const t = useCatalog(language);
  const it = language === 'it';
  const [selection, select] = useState<Algorithm | 'all'>('all');
  const [memory, setMemory] = useState(19);
  const [cost, setCost] = useState(12);
  const [iterations, setIterations] = useState(2);
  const [running, setRunning] = useState(false);
  const [timings, setTimings] = useState<Partial<Record<Algorithm, KdfTiming>>>({});
  const [failed, setFailed] = useState(false);
  const nf = new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { maximumSignificantDigits: 3 });

  function invalidate() {
    setTimings({});
    setFailed(false);
  }
  async function run() {
    setRunning(true);
    setFailed(false);
    setTimings({});
    try {
      for (const algorithm of selection === 'all' ? ALGORITHMS : [selection]) {
        const timing = await runInWorker(algorithm, {
          ...DEFAULT_PARAMS,
          argonMemoryKiB: memory * 1024,
          bcryptCost: cost,
          argonIterations: iterations
        });
        setTimings((prev) => ({ ...prev, [algorithm]: timing }));
      }
    } catch {
      setFailed(true);
    } finally {
      setRunning(false);
    }
  }

  const done = Object.values(timings);
  const factor = done.length === ALGORITHMS.length ? slowdownFactor(done) : null;

  return (
    <section aria-labelledby="kdf-lab-heading" className="mt-8 rounded-xl border border-stroke bg-surface p-4 sm:p-6">
      <h2 id="kdf-lab-heading" className="text-lg font-semibold text-ink-primary">
        {t.kdfLab.title}
      </h2>
      <p className="mt-2 text-sm text-ink-secondary">{t.kdfLab.intro}</p>
      <fieldset disabled={running} className="panel">
        <legend>{it ? 'Parametri della misura locale' : 'Local measurement parameters'}</legend>
        <label className="block">
          {it ? 'Algoritmo' : 'Algorithm'}{' '}
          <select
            value={selection}
            onChange={(e) => {
              select(e.target.value as typeof selection);
              invalidate();
            }}
          >
            <option value="all">{it ? 'Confronta tutti' : 'Compare all'}</option>
            {ALGORITHMS.map((k) => (
              <option key={k} value={k}>
                {t.algorithm[k]}
              </option>
            ))}
          </select>
        </label>
        {(selection === 'all' || selection === 'argon2id') && (
          <>
            <label className="block">
              Argon2id · {it ? 'memoria' : 'memory'} ({memory} MiB){' '}
              <input
                type="range"
                min="19"
                max="64"
                value={memory}
                onChange={(e) => {
                  setMemory(Number(e.target.value));
                  invalidate();
                }}
              />
            </label>
            <label className="block">
              Argon2id · {it ? 'iterazioni' : 'iterations'}{' '}
              <select
                value={iterations}
                onChange={(e) => {
                  setIterations(Number(e.target.value));
                  invalidate();
                }}
              >
                {[2, 3, 4, 5, 6].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <p>
              {it ? 'Con 256 MiB riservati, il limite teorico è' : 'With 256 MiB reserved, the theoretical limit is'}{' '}
              ⌊256 / {memory}⌋ = {Math.floor(256 / memory)}{' '}
              {it
                ? 'verifiche simultanee. CPU, overhead e latenza possono ridurlo.'
                : 'concurrent checks. CPU, overhead and latency can reduce it.'}
            </p>
          </>
        )}
        {(selection === 'all' || selection === 'bcrypt') && (
          <label>
            bcrypt · {it ? 'costo' : 'cost'}{' '}
            <select
              value={cost}
              onChange={(e) => {
                setCost(Number(e.target.value));
                invalidate();
              }}
            >
              {[10, 11, 12, 13, 14].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        )}
        <p>
          {it
            ? 'OWASP indica Argon2id con almeno 19 MiB, 2 iterazioni e parallelismo 1. Misura latenza e memoria sul server prima di scegliere i parametri.'
            : 'OWASP gives 19 MiB, 2 iterations and parallelism 1 as an Argon2id starting point. Measure server latency and memory before choosing parameters.'}{' '}
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html">OWASP</a>
        </p>
      </fieldset>
      <button
        type="button"
        onClick={() => void run()}
        disabled={running}
        className="mt-3 rounded-lg border border-accent bg-accent-soft px-3 py-1.5 text-sm text-ink-primary disabled:opacity-60"
      >
        {running ? t.kdfLab.running : t.kdfLab.run}
      </button>
      <div aria-live="polite" className="mt-3">
        {failed && <p className="text-sm text-attack">{t.kdfLab.failed}</p>}
        {done.length > 0 && (
          <ul className="space-y-1 font-mono text-sm text-ink-primary">
            {ALGORITHMS.map((algorithm) => {
              const timing = timings[algorithm];
              return timing ? (
                <li key={algorithm}>
                  {t.algorithm[algorithm]}: {nf.format(timing.ms)} ms · {nf.format(timing.perSecond)}/s{' '}
                  <span className="rounded bg-defense-soft px-1.5 text-xs text-defense">{t.kind.measured}</span>
                </li>
              ) : null;
            })}
          </ul>
        )}
        {factor !== null && (
          <p className="mt-2 text-sm text-ink-secondary">
            {t.kdfLab.factor(nf.format(factor))}{' '}
            <span className="rounded bg-accent-soft px-1.5 text-xs text-accent">{t.kind.derived}</span>
          </p>
        )}
      </div>
      {!running && !failed && done.length > 0 && (
        <a
          className="path-link"
          download="cracklab-kdf.json"
          href={
            'data:application/json;charset=utf-8,' +
            encodeURIComponent(
              JSON.stringify(
                {
                  experiment: 'synthetic local verification',
                  parameters: { bcryptCost: cost, argonMemoryMiB: memory, iterations, parallelism: 1 },
                  timings: done
                },
                null,
                2
              )
            )
          }
        >
          {it ? 'Esporta il report locale' : 'Export local report'}
        </a>
      )}
      <p className="mt-3 text-xs text-ink-muted">{t.kdfLab.limits}</p>
    </section>
  );
}
