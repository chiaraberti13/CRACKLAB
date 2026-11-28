import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entryGzipBytes, evaluateBudget, routeChunks } from './performance-budget.mjs';

test('evaluateBudget passes at or under the limit and fails above it', () => {
  assert.equal(evaluateBudget(100, 100).ok, true);
  assert.equal(evaluateBudget(101, 100).ok, false);
  assert.equal(evaluateBudget(50, 100).ok, true);
});

test('entryGzipBytes requires an entry chunk in the manifest', () => {
  assert.throws(() => entryGzipBytes('/tmp', { 'x.js': { file: 'x.js', isEntry: false } }), /entry chunk/);
});

test('routeChunks requires the learning, design and breach routes to stay lazy', () => {
  const routes = Object.fromEntries(
    ['BreachCheck', 'Design', 'Learn'].map((name) => [
      `src/components/${name}.tsx`,
      { isDynamicEntry: true, file: `assets/${name}.js` }
    ])
  );
  assert.deepEqual(routeChunks(routes), ['assets/BreachCheck.js', 'assets/Design.js', 'assets/Learn.js']);
  delete routes['src/components/Design.tsx'];
  assert.throws(() => routeChunks(routes), /Expected a lazy route chunk for src\/components\/Design.tsx/);
});
