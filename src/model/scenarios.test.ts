import { describe, expect, it } from 'vitest';
import { OFFLINE_ASSUMPTIONS, SCENARIO_DEFINITIONS } from './scenarios';
import { SCENARIOS } from './types';

describe('scenario definitions', () => {
  it('defines every scenario with a stable order', () => {
    for (const scenario of SCENARIOS) {
      expect(SCENARIO_DEFINITIONS[scenario].id).toBe(scenario);
    }
    const orders = SCENARIOS.map((s) => SCENARIO_DEFINITIONS[s].order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('lists the shared offline assumptions', () => {
    expect(OFFLINE_ASSUMPTIONS).toContain('stolenDatabase');
    expect(OFFLINE_ASSUMPTIONS.length).toBeGreaterThan(0);
  });
});
