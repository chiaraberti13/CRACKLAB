import { benchmarks, pricing } from '../model/data';
import { estimateAll, magnitudeKey } from '../model/estimate';
import type { DataKind, Scenario } from '../model/types';
import { useCatalog } from '../i18n';
import type { Language } from '../store';

interface StrengthMeterProps {
  guesses: number;
  scenario: Scenario;
  language: Language;
}

function formatCost(usd: number, language: Language): string {
  return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(usd);
}

function kindClasses(kind: DataKind): string {
  if (kind === 'measured') return 'bg-defense-soft text-defense';
  if (kind === 'derived') return 'bg-accent-soft text-accent';
  return 'bg-assumption-soft text-assumption';
}

/**
 * The "Prova" comparison: the same estimated guess count run against four storage
 * algorithms, reported as an order of magnitude plus an illustrative cost. Every
 * figure carries a provenance badge (measured / derived / assumption).
 */
export function StrengthMeter({ guesses, scenario, language }: StrengthMeterProps) {
  const t = useCatalog(language);
  const estimates = estimateAll(guesses, scenario, benchmarks, pricing);

  return (
    <section aria-labelledby="comparison-heading" className="rounded-xl border border-stroke bg-surface p-4 sm:p-6">
      <h2 id="comparison-heading" className="text-lg font-semibold text-ink-primary">
        {t.comparisonTitle}
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">{t.comparisonIntro}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-ink-muted">
              <th scope="col" className="py-2 pr-3 font-medium">
                {/* algorithm column */}
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                {t.timeLabel}
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                {t.costLabel}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t.assumptionsTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((e) => {
              const magnitude = magnitudeKey(e.seconds);
              const fast = e.algorithm === 'md5' || e.algorithm === 'sha256';
              return (
                <tr key={e.algorithm} className="border-t border-stroke">
                  <th scope="row" className="py-3 pr-3 font-mono font-medium text-ink-primary">
                    {t.algorithm[e.algorithm]}
                  </th>
                  <td className="py-3 pr-3">
                    <span className={fast ? 'font-semibold text-attack' : 'font-semibold text-defense'}>
                      {t.magnitude[magnitude]}
                    </span>
                  </td>
                  <td className="py-3 pr-3 font-mono text-ink-secondary">{formatCost(e.usd, language)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${kindClasses(e.hashrateKind)}`}
                    >
                      {t.kind[e.hashrateKind]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-muted">{t.notAPrediction}</p>
    </section>
  );
}
