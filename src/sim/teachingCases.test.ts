import { describe, expect, it } from 'vitest';
import { offlineWork, reviewLog, spaces, type Strategy } from './teachingCases';
describe('fixed classroom cases', () => {
  it('separates space, verifier reuse and cost per check', () => {
    for (const strategy of Object.keys(spaces) as Strategy[]) {
      const base = offlineWork(strategy, false, false);
      expect(base.checks).toBe(spaces[strategy]);
      expect(offlineWork(strategy, true, false).checks).toBe(base.checks * 2);
      expect(offlineWork(strategy, true, true).units).toBe(base.units * 20);
    }
  });
  it('interprets each independent defense on the same logs', () => {
    expect(reviewLog('dictionary', 'lockout').blocked).toBe(1);
    expect(reviewLog('spraying', 'lockout').blocked).toBe(0);
    expect(reviewLog('spraying', 'correlate').detected).toBe(true);
    expect(reviewLog('dictionary', 'correlate').detected).toBe(false);
    expect(reviewLog('spraying', 'rate').blocked).toBe(3);
    expect(reviewLog('dictionary', 'delay').waitUnits).toBe(15);
    expect(reviewLog('stuffing', 'observe')).toMatchObject({
      total: 5,
      known: 1,
      firstFactor: 1,
      access: 1,
      blocked: 0
    });
    expect(reviewLog('stuffing', 'mfa')).toMatchObject({ known: 1, firstFactor: 1, access: 0, blocked: 1 });
  });
});
