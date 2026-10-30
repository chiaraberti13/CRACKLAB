/**
 * Shared contracts for the estimation model.
 *
 * The model is the trust-critical, contestable core of CrackLab. Every number it
 * produces must be traceable to a dataset entry whose provenance is explicit:
 * `measured` (a primary benchmark), `derived` (computed from a measured value with
 * a stated formula) or `assumption` (a declared illustrative figure). The UI shows
 * a different label for each, so a reader always sees whether a figure is evidence
 * or an illustration.
 */

/** The three declared attacker scenarios. They are illustrative, not confidence intervals. */
export type Scenario = 'prudent' | 'central' | 'aggressive';

export const SCENARIOS: readonly Scenario[] = ['prudent', 'central', 'aggressive'] as const;

/** The password-storage algorithms compared in the offline scenario. */
export type Algorithm = 'md5' | 'sha256' | 'bcrypt' | 'argon2id';

export const ALGORITHMS: readonly Algorithm[] = ['md5', 'sha256', 'bcrypt', 'argon2id'] as const;

/**
 * Provenance class of a datapoint. The UI never presents an `assumption` with the
 * same authority as a `measured` benchmark.
 */
export type DataKind = 'measured' | 'derived' | 'assumption';

export const DATA_KINDS: readonly DataKind[] = ['measured', 'derived', 'assumption'] as const;

/** A single benchmark: the guess rate for one algorithm in one scenario. */
export interface BenchmarkEntry {
  algorithm: Algorithm;
  scenario: Scenario;
  /** Full KDF parameters, so the number is reproducible (e.g. "bcrypt cost 12"). */
  params: string;
  /** The hardware assumed for this scenario. */
  hardware: string;
  /** Guesses per second. Order-of-magnitude is what the UI shows, not this exact value. */
  hashesPerSecond: number;
  kind: DataKind;
  /** Where the figure comes from; mandatory and checked in CI. */
  source: string;
  /** Optional authoritative URL for the source. */
  url?: string;
  /** ISO date (YYYY-MM-DD) the figure was recorded; CI warns past 12 months. */
  date: string;
  /** Tool and version used for a measured benchmark (e.g. "hashcat 6.2.6"). */
  tool?: string;
  notes?: string;
}

/** Illustrative hourly price of the compute assumed for one scenario. */
export interface PricingEntry {
  scenario: Scenario;
  label: string;
  /** Illustrative USD per hour. Cloud prices vary by time and region. */
  usdPerHour: number;
  kind: DataKind;
  source: string;
  url?: string;
  date: string;
  notes?: string;
}

export interface BenchmarkDataset {
  schemaVersion: number;
  entries: BenchmarkEntry[];
}

export interface PricingDataset {
  schemaVersion: number;
  entries: PricingEntry[];
}

/** The computed estimate for one (guesses × algorithm × scenario) combination. */
export interface Estimate {
  algorithm: Algorithm;
  scenario: Scenario;
  /** Guesses needed, as estimated by zxcvbn (not 2^entropy, not the whole keyspace). */
  guesses: number;
  hashesPerSecond: number;
  /** Time to reach the estimated guess count, in seconds. */
  seconds: number;
  /** Illustrative monetary cost of that time. */
  usd: number;
  /** Provenance of the hash rate used. */
  hashrateKind: DataKind;
  /** Provenance of the price used. */
  priceKind: DataKind;
}
