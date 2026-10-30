import { test } from 'node:test';
import assert from 'node:assert/strict';
import { staleWarnings, validateDatasets, validateEntry } from './model-data.mjs';

test('validateEntry flags a missing kind, source and date', () => {
  const errors = validateEntry({ kind: 'guess', source: '  ', date: '2026/01/01' }, 'x');
  assert.equal(errors.length, 3);
});

test('validateEntry accepts a well-formed entry', () => {
  const errors = validateEntry({ kind: 'assumption', source: 'hashcat wiki', date: '2026-10-30' }, 'x');
  assert.deepEqual(errors, []);
});

test('staleWarnings warns past twelve months only', () => {
  const now = Date.parse('2026-10-30');
  const fresh = staleWarnings([{ date: '2026-06-01' }], () => 'fresh', now);
  const old = staleWarnings([{ date: '2024-01-01' }], () => 'old', now);
  assert.equal(fresh.length, 0);
  assert.equal(old.length, 1);
});

test('validateDatasets rejects a non-positive hash rate and a negative price', () => {
  const { errors } = validateDatasets(
    {
      entries: [
        {
          algorithm: 'md5',
          scenario: 'central',
          kind: 'assumption',
          source: 's',
          date: '2026-10-30',
          hashesPerSecond: 0
        }
      ]
    },
    { entries: [{ scenario: 'central', kind: 'assumption', source: 's', date: '2026-10-30', usdPerHour: -1 }] }
  );
  assert.ok(errors.some((e) => e.includes('hashesPerSecond')));
  assert.ok(errors.some((e) => e.includes('usdPerHour')));
});
