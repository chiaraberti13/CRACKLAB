import type {
  Algorithm,
  BenchmarkDataset,
  BenchmarkEntry,
  Estimate,
  PricingDataset,
  PricingEntry,
  Scenario
} from './types';
import { ALGORITHMS } from './types';

const SECONDS_PER_HOUR = 3600;

/**
 * Ordered time buckets. CrackLab deliberately reports an **order of magnitude**
 * ("seconds", "days", "centuries"), never a 12-decimal figure, because the inputs
 * are estimates and false precision would be dishonest.
 */
export type MagnitudeKey = 'instant' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years' | 'centuries';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;
const CENTURY = 100 * YEAR;

/** Guard: the model only accepts finite, non-negative inputs. */
function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite, non-negative number (received ${value}).`);
  }
}

/**
 * Seconds to reach the estimated number of guesses at a given guess rate.
 * `seconds = guesses / hashesPerSecond`.
 */
export function estimateSeconds(guesses: number, hashesPerSecond: number): number {
  assertFiniteNonNegative(guesses, 'guesses');
  assertFiniteNonNegative(hashesPerSecond, 'hashesPerSecond');
  if (hashesPerSecond === 0) {
    throw new RangeError('hashesPerSecond must be greater than zero.');
  }
  return guesses / hashesPerSecond;
}

/**
 * Illustrative monetary cost of an attack that runs for `seconds`.
 * `usd = (seconds / 3600) * usdPerHour`.
 */
export function estimateCostUsd(seconds: number, usdPerHour: number): number {
  assertFiniteNonNegative(seconds, 'seconds');
  assertFiniteNonNegative(usdPerHour, 'usdPerHour');
  return (seconds / SECONDS_PER_HOUR) * usdPerHour;
}

/** Map a duration in seconds to its order-of-magnitude bucket. */
export function magnitudeKey(seconds: number): MagnitudeKey {
  assertFiniteNonNegative(seconds, 'seconds');
  if (seconds < 1) return 'instant';
  if (seconds < MINUTE) return 'seconds';
  if (seconds < HOUR) return 'minutes';
  if (seconds < DAY) return 'hours';
  if (seconds < MONTH) return 'days';
  if (seconds < YEAR) return 'months';
  if (seconds < CENTURY) return 'years';
  return 'centuries';
}

/** Find the benchmark row for one algorithm in one scenario. */
export function lookupBenchmark(dataset: BenchmarkDataset, algorithm: Algorithm, scenario: Scenario): BenchmarkEntry {
  const entry = dataset.entries.find((e) => e.algorithm === algorithm && e.scenario === scenario);
  if (!entry) {
    throw new Error(`No benchmark for algorithm "${algorithm}" in scenario "${scenario}".`);
  }
  return entry;
}

/** Find the pricing row for one scenario. */
export function lookupPricing(dataset: PricingDataset, scenario: Scenario): PricingEntry {
  const entry = dataset.entries.find((e) => e.scenario === scenario);
  if (!entry) {
    throw new Error(`No pricing for scenario "${scenario}".`);
  }
  return entry;
}

/**
 * The full estimate for one (guesses × algorithm × scenario) combination.
 * `guesses` is the zxcvbn estimate of how many tries are needed — never 2^entropy
 * and never the whole keyspace.
 */
export function estimate(
  guesses: number,
  algorithm: Algorithm,
  scenario: Scenario,
  benchmarks: BenchmarkDataset,
  pricing: PricingDataset
): Estimate {
  const benchmark = lookupBenchmark(benchmarks, algorithm, scenario);
  const price = lookupPricing(pricing, scenario);
  const seconds = estimateSeconds(guesses, benchmark.hashesPerSecond);
  const usd = estimateCostUsd(seconds, price.usdPerHour);
  return {
    algorithm,
    scenario,
    guesses,
    hashesPerSecond: benchmark.hashesPerSecond,
    seconds,
    usd,
    hashrateKind: benchmark.kind,
    priceKind: price.kind
  };
}

/** Estimate the same guess count across every algorithm, for the comparison view. */
export function estimateAll(
  guesses: number,
  scenario: Scenario,
  benchmarks: BenchmarkDataset,
  pricing: PricingDataset
): Estimate[] {
  return ALGORITHMS.map((algorithm) => estimate(guesses, algorithm, scenario, benchmarks, pricing));
}
