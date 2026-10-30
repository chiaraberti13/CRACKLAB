import { describe, expect, it } from 'vitest';
import { benchmarks, pricing } from './data';
import { ALGORITHMS, DATA_KINDS, SCENARIOS } from './types';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('benchmarks dataset', () => {
  it('covers every algorithm in every scenario exactly once', () => {
    for (const algorithm of ALGORITHMS) {
      for (const scenario of SCENARIOS) {
        const matches = benchmarks.entries.filter((e) => e.algorithm === algorithm && e.scenario === scenario);
        expect(matches, `${algorithm}/${scenario}`).toHaveLength(1);
      }
    }
  });

  it('declares provenance (kind, source, date) for every entry', () => {
    for (const entry of benchmarks.entries) {
      expect(DATA_KINDS).toContain(entry.kind);
      expect(entry.source.trim().length).toBeGreaterThan(0);
      expect(entry.date).toMatch(ISO_DATE);
      expect(entry.hashesPerSecond).toBeGreaterThan(0);
    }
  });
});

describe('pricing dataset', () => {
  it('prices every scenario exactly once', () => {
    for (const scenario of SCENARIOS) {
      const matches = pricing.entries.filter((e) => e.scenario === scenario);
      expect(matches, scenario).toHaveLength(1);
    }
  });

  it('declares provenance (kind, source, date) for every entry', () => {
    for (const entry of pricing.entries) {
      expect(DATA_KINDS).toContain(entry.kind);
      expect(entry.source.trim().length).toBeGreaterThan(0);
      expect(entry.date).toMatch(ISO_DATE);
      expect(entry.usdPerHour).toBeGreaterThanOrEqual(0);
    }
  });
});
