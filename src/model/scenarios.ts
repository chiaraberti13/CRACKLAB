import type { Scenario } from './types';

/**
 * The three declared scenarios. They are *illustrative* framings of an attacker's
 * capability, not statistical confidence intervals — stated plainly in the UI.
 * Each one fixes the hardware (and therefore the benchmark and price rows used).
 */
export interface ScenarioDefinition {
  id: Scenario;
  /** Short i18n key suffix used by the UI catalogs. */
  key: Scenario;
  order: number;
}

export const SCENARIO_DEFINITIONS: Record<Scenario, ScenarioDefinition> = {
  prudent: { id: 'prudent', key: 'prudent', order: 0 },
  central: { id: 'central', key: 'central', order: 1 },
  aggressive: { id: 'aggressive', key: 'aggressive', order: 2 }
};

/** The shared assumptions that hold across all offline estimates, surfaced in the UI. */
export const OFFLINE_ASSUMPTIONS = [
  'stolenDatabase',
  'algorithmKnown',
  'uniqueSaltPerAccount',
  'timeToEstimatedGuess'
] as const;

export type OfflineAssumption = (typeof OFFLINE_ASSUMPTIONS)[number];
