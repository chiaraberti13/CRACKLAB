import type { BenchmarkDataset, PricingDataset } from './types';
import benchmarksJson from './data/benchmarks.json';
import pricingJson from './data/pricing.json';

/**
 * Typed access to the versioned datasets. The JSON is the single source of truth;
 * `scripts/model-data.mjs` validates provenance fields and benchmark freshness in CI.
 */
export const benchmarks: BenchmarkDataset = benchmarksJson as BenchmarkDataset;
export const pricing: PricingDataset = pricingJson as PricingDataset;
