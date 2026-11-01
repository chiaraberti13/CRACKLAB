import { useEffect, useId, useState } from 'react';
import { LocalKdfLab } from './components/LocalKdfLab';
import { StrengthMeter } from './components/StrengthMeter';
import { useCatalog } from './i18n';
import { SCENARIOS } from './model/types';
import type { Scenario } from './model/types';
import { evaluateStrength } from './strength/strength';
import { useStore } from './store';

export default function App() {
  const language = useStore((s) => s.language);
  const scenario = useStore((s) => s.scenario);
  const sample = useStore((s) => s.sample);
  const setLanguage = useStore((s) => s.setLanguage);
  const setScenario = useStore((s) => s.setScenario);
  const setSample = useStore((s) => s.setSample);
  const clearAll = useStore((s) => s.clearAll);

  const t = useCatalog(language);
  const inputId = useId();
  const [guesses, setGuesses] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  // Evaluate predictability locally whenever the sample changes. Debounced and
  // cancellable so stale async results never overwrite a newer input.
  useEffect(() => {
    let active = true;
    const handle = setTimeout(
      () => {
        if (!active) return;
        if (sample.length === 0) {
          setGuesses(null);
          setScore(null);
          return;
        }
        void evaluateStrength(sample).then((result) => {
          if (!active) return;
          setGuesses(result.guesses);
          setScore(result.score);
        });
      },
      sample.length === 0 ? 0 : 180
    );
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [sample]);

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:text-ink-primary"
      >
        {language === 'it' ? 'Vai al contenuto' : 'Skip to content'}
      </a>

      <header className="border-b border-stroke">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="font-mono text-lg font-semibold text-ink-primary">{t.appName}</span>
          <button
            type="button"
            onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
            className="rounded border border-stroke px-3 py-1.5 text-sm text-ink-secondary hover:border-stroke-strong"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <h1 className="text-balance text-2xl font-bold text-ink-primary sm:text-3xl">{t.appName}</h1>
        <p className="mt-2 max-w-2xl text-pretty text-ink-secondary">{t.tagline}</p>

        <div
          role="note"
          className="mt-6 rounded-lg border border-defense/40 bg-defense-soft px-4 py-3 text-sm text-defense"
        >
          {t.warning}
        </div>

        <div className="mt-6">
          <label htmlFor={inputId} className="block text-sm font-medium text-ink-secondary">
            {t.sampleLabel}
          </label>
          <input
            id={inputId}
            type="password"
            name="cracklab-sample"
            value={sample}
            onChange={(event) => setSample(event.target.value)}
            placeholder={t.samplePlaceholder}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore=""
            data-bwignore=""
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className="mt-1 w-full rounded-lg border border-stroke bg-code-bg px-3 py-2 font-mono text-code-ink placeholder:text-ink-muted"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-muted">{t.examplesLabel}:</span>
            {t.examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => setSample(example.value)}
                className="rounded-full border border-stroke px-3 py-1 text-sm text-ink-secondary hover:border-stroke-strong"
              >
                {example.label}
              </button>
            ))}
            {sample.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto rounded-full border border-stroke px-3 py-1 text-sm text-attack hover:border-attack"
              >
                {t.clearAll}
              </button>
            )}
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-ink-secondary">{t.scenarioLabel}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SCENARIOS.map((id: Scenario) => {
              const active = id === scenario;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setScenario(id)}
                  title={t.scenarios[id].desc}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    active
                      ? 'border-accent bg-accent-soft text-ink-primary'
                      : 'border-stroke text-ink-secondary hover:border-stroke-strong'
                  }`}
                >
                  {t.scenarios[id].name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-ink-muted">{t.scenarios[scenario].desc}</p>
        </fieldset>

        <div aria-live="polite" className="mt-6 space-y-6">
          {guesses !== null && (
            <>
              <div className="flex flex-wrap gap-6 rounded-xl border border-stroke bg-surface px-4 py-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-muted">{t.guessesLabel}</div>
                  <div className="font-mono text-lg text-ink-primary">
                    {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
                      notation: 'scientific',
                      maximumFractionDigits: 1
                    }).format(guesses)}
                  </div>
                </div>
                {score !== null && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-ink-muted">{t.scoreLabel}</div>
                    <div className="font-mono text-lg text-ink-primary">{score}/4</div>
                  </div>
                )}
              </div>

              <StrengthMeter guesses={guesses} scenario={scenario} language={language} />
            </>
          )}
        </div>

        <LocalKdfLab language={language} />

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stroke bg-surface p-4">
            <h2 className="font-semibold text-ink-primary">{t.lessonTitle}</h2>
            <p className="mt-2 text-sm text-ink-secondary">{t.lessonBody}</p>
          </div>
          <div className="rounded-xl border border-defense/40 bg-defense-soft p-4">
            <h2 className="font-semibold text-defense">{t.adviceTitle}</h2>
            <p className="mt-2 text-sm text-ink-secondary">{t.adviceBody}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
