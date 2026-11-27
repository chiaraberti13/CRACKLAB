import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { benchmarks, pricing } from './data';
import { estimate, estimateAll, estimateCostUsd, estimateSeconds, lookupBenchmark, magnitudeKey } from './estimate';
import { ALGORITHMS, SCENARIOS } from './types';

describe('estimateSeconds', () => {
  it('computes guesses / hashesPerSecond', () => {
    expect(estimateSeconds(1_000_000, 1_000)).toBe(1_000);
  });

  it('rejects a zero hash rate instead of returning Infinity', () => {
    expect(() => estimateSeconds(10, 0)).toThrow(RangeError);
  });

  it('rejects non-finite or negative inputs', () => {
    expect(() => estimateSeconds(-1, 10)).toThrow(RangeError);
    expect(() => estimateSeconds(Number.NaN, 10)).toThrow(RangeError);
    expect(() => estimateSeconds(10, Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe('estimateCostUsd', () => {
  it('converts seconds of runtime to an illustrative price', () => {
    expect(estimateCostUsd(3600, 2.5)).toBeCloseTo(2.5, 10);
    expect(estimateCostUsd(0, 30)).toBe(0);
  });
});

describe('magnitudeKey', () => {
  it('maps durations to ordered buckets', () => {
    expect(magnitudeKey(0.2)).toBe('instant');
    expect(magnitudeKey(30)).toBe('seconds');
    expect(magnitudeKey(120)).toBe('minutes');
    expect(magnitudeKey(3 * 3600)).toBe('hours');
    expect(magnitudeKey(5 * 86400)).toBe('days');
    expect(magnitudeKey(60 * 86400)).toBe('months');
    expect(magnitudeKey(3 * 365 * 86400)).toBe('years');
    expect(magnitudeKey(500 * 365 * 86400)).toBe('centuries');
  });

  it('never decreases as the duration grows (property)', () => {
    const order = ['instant', 'seconds', 'minutes', 'hours', 'days', 'months', 'years', 'centuries'];
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1e12, noNaN: true }),
        fc.double({ min: 0, max: 1e12, noNaN: true }),
        (a, b) => {
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          expect(order.indexOf(magnitudeKey(lo))).toBeLessThanOrEqual(order.indexOf(magnitudeKey(hi)));
        }
      )
    );
  });
});

describe('estimate across algorithms (expected monotonicity)', () => {
  it('a slow KDF never costs less time than a fast hash, for the same guesses', () => {
    const guesses = 1e8;
    for (const scenario of SCENARIOS) {
      const byAlgo = Object.fromEntries(
        estimateAll(guesses, scenario, benchmarks, pricing).map((e) => [e.algorithm, e.seconds])
      );
      // MD5 < SHA-256 << bcrypt and << Argon2id
      expect(byAlgo.md5).toBeLessThan(byAlgo.sha256);
      expect(byAlgo.sha256).toBeLessThan(byAlgo.bcrypt);
      expect(byAlgo.sha256).toBeLessThan(byAlgo.argon2id);
    }
  });

  it('more guesses never means less time (property)', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1e18, noNaN: true }),
        fc.double({ min: 1, max: 1e18, noNaN: true }),
        fc.constantFrom(...ALGORITHMS),
        fc.constantFrom(...SCENARIOS),
        (g1, g2, algorithm, scenario) => {
          const lo = Math.min(g1, g2);
          const hi = Math.max(g1, g2);
          const tLo = estimate(lo, algorithm, scenario, benchmarks, pricing).seconds;
          const tHi = estimate(hi, algorithm, scenario, benchmarks, pricing).seconds;
          expect(tHi).toBeGreaterThanOrEqual(tLo);
        }
      )
    );
  });

  it('carries the provenance kind of the figures it used', () => {
    const e = estimate(1e6, 'argon2id', 'central', benchmarks, pricing);
    const benchmark = lookupBenchmark(benchmarks, 'argon2id', 'central');
    expect(e.hashrateKind).toBe(benchmark.kind);
    expect(['measured', 'derived', 'assumption']).toContain(e.priceKind);
  });
});

it('reports overflow and underflow without displaying zero or infinity', () => {
  expect(() => estimateSeconds(Number.MAX_VALUE, 0.01)).toThrow(RangeError);
  expect(() => estimateSeconds(Number.MIN_VALUE, 10)).toThrow(RangeError);
  expect(() => estimateCostUsd(Number.MAX_VALUE, Number.MAX_VALUE)).toThrow(RangeError);
  expect(() => estimateCostUsd(Number.MIN_VALUE, 1)).toThrow(RangeError);
  expect(estimateCostUsd(Number.MIN_VALUE, 3600)).toBe(Number.MIN_VALUE);
});
