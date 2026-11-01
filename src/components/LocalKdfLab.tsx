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
  const [running, setRunning] = useState(false);
  const [timings, setTimings] = useState<Partial<Record<Algorithm, KdfTiming>>>({});
  const [failed, setFailed] = useState(false);
  const nf = new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { maximumSignificantDigits: 3 });

  async function run() {
    setRunning(true);
    setFailed(false);
    setTimings({});
    try {
      for (const algorithm of ALGORITHMS) {
        const timing = await runInWorker(algorithm, DEFAULT_PARAMS);
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
      <p className="mt-3 text-xs text-ink-muted">{t.kdfLab.limits}</p>
    </section>
  );
}
