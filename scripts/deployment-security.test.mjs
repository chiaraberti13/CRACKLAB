import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { checkDeploymentSecurity } from './deployment-security.mjs';

const realConfig = JSON.parse(readFileSync(fileURLToPath(new URL('../vercel.json', import.meta.url)), 'utf8'));

test('the committed vercel.json passes the security check', () => {
  assert.deepEqual(checkDeploymentSecurity(realConfig), []);
});

test('a weakened CSP is rejected', () => {
  const weak = {
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src *; script-src 'unsafe-eval'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
        ]
      }
    ]
  };
  const problems = checkDeploymentSecurity(weak);
  assert.ok(problems.some((p) => p.includes('unsafe-eval')));
  assert.ok(problems.some((p) => p.includes('object-src')));
});
