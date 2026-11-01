// @vitest-environment jsdom
import { createElement } from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StrengthMeter } from './StrengthMeter';
import { benchmarks, pricing } from '../model/data';

afterEach(cleanup);

describe('estimate provenance', () => {
  it.each(['it', 'en'] as const)('exposes the selected scenario data in %s', (language) => {
    for (const scenario of ['central', 'aggressive'] as const) {
      const view = render(createElement(StrengthMeter, { guesses: 1000, scenario, language }));
      for (const entry of benchmarks.entries.filter((row) => row.scenario === scenario)) {
        const row = screen
          .getByRole('rowheader', { name: new RegExp(entry.algorithm === 'sha256' ? 'SHA-256' : entry.algorithm, 'i') })
          .closest('tr')!;
        expect(within(row).getByText(entry.params).textContent).toBe(entry.params);
        expect(within(row).getByText(entry.hardware).textContent).toBe(entry.hardware);
        expect(row.textContent).toContain(entry.source);
        expect(row.textContent).toContain(entry.date);
        expect(row.querySelector('details summary')).not.toBeNull();
        const price = pricing.entries.find((item) => item.scenario === scenario)!;
        expect(row.textContent).toContain(price.source);
      }
      view.unmount();
    }
  });
});
