import { benchmarks, pricing } from '../model/data';
import { estimateAll, lookupBenchmark, lookupPricing, magnitudeKey } from '../model/estimate';
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
  const price = lookupPricing(pricing, scenario);

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
              const benchmark = lookupBenchmark(benchmarks, e.algorithm, scenario);
              const magnitude = magnitudeKey(e.seconds);
              const fast = e.algorithm === 'md5' || e.algorithm === 'sha256';
              return (
                <tr key={e.algorithm} className="border-t border-stroke">
                  <th scope="row" className="py-3 pr-3 font-mono font-medium text-ink-primary">
                    {t.algorithm[e.algorithm]}
                  </th>
                  <td className="py-3 pr-3">
                    <span className={fast ? 'font-semibold text-attack' : 'font-semibold text-defense'}>
                      <span
                        className="sand"
                        style={{
                          animationDuration: (0.45 + Math.min(7, Math.max(0, Math.log10(1 + e.seconds)))) * 0.26 + 's'
                        }}
                        aria-hidden="true"
                      />
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
                    <details className="mt-2 max-w-sm text-xs text-ink-secondary">
                      <summary className="cursor-pointer text-ink-primary">
                        {language === 'it' ? 'Parametri e fonti' : 'Parameters and sources'}
                      </summary>
                      <dl className="mt-2 space-y-2 break-words">
                        <dt>{language === 'it' ? 'Configurazione' : 'Configuration'}</dt>
                        <dd>{benchmark.params}</dd>
                        <dt>Hardware</dt>
                        <dd>{benchmark.hardware}</dd>
                        <dt>
                          {language === 'it'
                            ? 'Tentativi al secondo (dato del dataset)'
                            : 'Guesses per second (dataset input)'}
                        </dt>
                        <dd>
                          {new Intl.NumberFormat(language, { notation: 'scientific', maximumFractionDigits: 1 }).format(
                            benchmark.hashesPerSecond
                          )}
                        </dd>
                        <dt>{language === 'it' ? 'Fonte e data' : 'Source and date'}</dt>
                        <dd>
                          {benchmark.source} · {benchmark.date}
                        </dd>
                        {benchmark.notes && <dd>{benchmark.notes}</dd>}
                        <dt>{language === 'it' ? 'Prezzo orario illustrativo' : 'Illustrative hourly price'}</dt>
                        <dd>
                          {formatCost(price.usdPerHour, language)}/h · {t.kind[price.kind]}
                        </dd>
                        <dd>
                          {price.label} · {price.source} · {price.date}
                        </dd>
                        {price.notes && <dd>{price.notes}</dd>}
                      </dl>
                      <p className="mt-2">
                        {language === 'it'
                          ? 'Tempo = tentativi stimati / tentativi al secondo. Costo = tempo in ore × prezzo orario. Non è una misurazione locale.'
                          : 'Time = estimated guesses / guesses per second. Cost = time in hours × hourly price. This is not a local measurement.'}
                      </p>
                    </details>
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
