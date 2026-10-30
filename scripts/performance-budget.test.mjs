import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryGzipBytes, evaluateBudget } from './performance-budget.mjs';

test('evaluateBudget passes at or under the limit and fails above it', () => {
  assert.equal(evaluateBudget(100, 100).ok, true);
  assert.equal(evaluateBudget(101, 100).ok, false);
  assert.equal(evaluateBudget(50, 100).ok, true);
});

test('entryGzipBytes requires an entry chunk in the manifest', () => {
  assert.throws(() => entryGzipBytes('/tmp', { 'x.js': { file: 'x.js', isEntry: false } }), /entry chunk/);
});
