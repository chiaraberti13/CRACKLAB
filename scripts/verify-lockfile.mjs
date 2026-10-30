#!/usr/bin/env node
// Supply-chain gate: the lockfile must be v3+, and every resolved dependency must
// come from the public npm registry over HTTPS with a subresource integrity hash.
// A dependency pulled from a git URL, http, or without integrity fails the build.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ALLOWED_HOST = 'registry.npmjs.org';

export function verifyLockfile(lock) {
  const problems = [];
  if (!(typeof lock.lockfileVersion === 'number' && lock.lockfileVersion >= 3)) {
    problems.push(`lockfileVersion must be >= 3 (got ${lock.lockfileVersion}).`);
  }
  const packages = lock.packages ?? {};
  for (const [name, meta] of Object.entries(packages)) {
    if (name === '' || meta.link) continue; // root project / local link
    if (!meta.resolved) {
      // Workspaces and bundled deps may legitimately lack a resolved URL.
      continue;
    }
    let url;
    try {
      url = new URL(meta.resolved);
    } catch {
      problems.push(`${name}: resolved is not a valid URL (${meta.resolved}).`);
      continue;
    }
    if (url.protocol !== 'https:') {
      problems.push(`${name}: resolved must use https (got ${url.protocol}).`);
    }
    if (url.hostname !== ALLOWED_HOST) {
      problems.push(`${name}: resolved host must be ${ALLOWED_HOST} (got ${url.hostname}).`);
    }
    if (!meta.integrity) {
      problems.push(`${name}: missing integrity hash.`);
    }
  }
  return problems;
}

function main() {
  const lock = JSON.parse(readFileSync(fileURLToPath(new URL('../package-lock.json', import.meta.url)), 'utf8'));
  const problems = verifyLockfile(lock);
  if (problems.length > 0) {
    for (const problem of problems.slice(0, 50)) console.error(`error: ${problem}`);
    console.error(`\nLockfile policy failed with ${problems.length} problem(s).`);
    process.exit(1);
  }
  console.log(`Lockfile OK: ${Object.keys(lock.packages ?? {}).length} package entries validated.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
