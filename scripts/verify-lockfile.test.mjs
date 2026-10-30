import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { verifyLockfile } from './verify-lockfile.mjs';

const realLock = JSON.parse(readFileSync(fileURLToPath(new URL('../package-lock.json', import.meta.url)), 'utf8'));

test('the committed package-lock.json passes the policy', () => {
  assert.deepEqual(verifyLockfile(realLock), []);
});

test('rejects http, a foreign host and a missing integrity hash', () => {
  const problems = verifyLockfile({
    lockfileVersion: 3,
    packages: {
      '': {},
      'node_modules/evil': { resolved: 'http://evil.example/x.tgz' },
      'node_modules/foreign': { resolved: 'https://example.com/x.tgz', integrity: 'sha512-x' }
    }
  });
  assert.ok(problems.some((p) => p.includes('https')));
  assert.ok(problems.some((p) => p.includes('registry.npmjs.org')));
  assert.ok(problems.some((p) => p.includes('integrity')));
});

test('rejects an old lockfile version', () => {
  const problems = verifyLockfile({ lockfileVersion: 2, packages: { '': {} } });
  assert.ok(problems.some((p) => p.includes('lockfileVersion')));
});
