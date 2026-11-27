import { useEffect, useState } from 'react';
import { StrengthMeter } from './StrengthMeter';
import { useCatalog } from '../i18n';
import { evaluateStrength, type StrengthResult } from '../strength/strength';
import type { Language } from '../store';
import type { Scenario } from '../model/types';

export function SampleResult({
  sample,
  language,
  scenario
}: {
  sample: string;
  language: Language;
  scenario: Scenario;
}) {
  const t = useCatalog(language);
  const [result, setResult] = useState<StrengthResult | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let current = true;
    const timer = setTimeout(() => {
      void evaluateStrength(sample).then(
        (value) => {
          if (current) setResult(value);
        },
        () => {
          if (current) setError(true);
        }
      );
    }, 180);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [sample]);
  return (
    <div className="mt-6 space-y-6">
      {error && (
        <p>
          {language === 'it'
            ? 'Stima non disponibile. Modifica l’esempio per riprovare.'
            : 'Estimate unavailable. Edit the sample to retry.'}
        </p>
      )}
      {result && (
        <>
          <div className="flex flex-wrap gap-6 rounded-xl border border-stroke bg-surface px-4 py-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-muted">{t.guessesLabel}</div>
              <div className="font-mono text-lg text-ink-primary">
                {new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
                  notation: 'scientific',
                  maximumFractionDigits: 1
                }).format(result.guesses)}
              </div>
            </div>
            {
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-muted">{t.scoreLabel}</div>
                <div className="font-mono text-lg text-ink-primary">{result.score}/4</div>
              </div>
            }
          </div>

          <StrengthMeter guesses={result.guesses} scenario={scenario} language={language} />
        </>
      )}
    </div>
  );
}
