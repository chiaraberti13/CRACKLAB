#!/usr/bin/env node
// Asserts the production security headers in vercel.json actually encode the
// privacy and hardening promises: a strict CSP, no framing, no referrer leakage,
// and MIME-sniffing off. A header that drifts weaker fails CI.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const REQUIRED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "connect-src 'self'"
];

const REQUIRED_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

export function checkDeploymentSecurity(config) {
  const problems = [];
  const globalRule = (config.headers ?? []).find((rule) => rule.source === '/(.*)' && !rule.has);
  if (!globalRule) {
    problems.push('No global header rule for "/(.*)" found in vercel.json.');
    return problems;
  }
  const headers = new Map(globalRule.headers.map((h) => [h.key, h.value]));

  const csp = headers.get('Content-Security-Policy') ?? '';
  for (const directive of REQUIRED_CSP_DIRECTIVES) {
    if (!csp.includes(directive)) {
      problems.push(`CSP is missing required directive: ${directive}`);
    }
  }
  if (csp.includes("'unsafe-eval'")) {
    problems.push("CSP must not allow 'unsafe-eval'.");
  }
  if (/script-src[^;]*\*/.test(csp)) {
    problems.push('CSP script-src must not use a wildcard.');
  }

  for (const [key, expected] of Object.entries(REQUIRED_HEADERS)) {
    const actual = headers.get(key);
    if (actual !== expected) {
      problems.push(`Header ${key} must be "${expected}" (got ${JSON.stringify(actual)}).`);
    }
  }
  return problems;
}

function main() {
  const config = JSON.parse(readFileSync(fileURLToPath(new URL('../vercel.json', import.meta.url)), 'utf8'));
  const problems = checkDeploymentSecurity(config);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`error: ${problem}`);
    console.error(`\nDeployment security check failed with ${problems.length} problem(s).`);
    process.exit(1);
  }
  console.log('Deployment security headers OK.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
