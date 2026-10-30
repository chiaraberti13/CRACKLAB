#!/usr/bin/env node
// Performance gate: resolve the entry chunk from the Vite manifest (stable source
// key, not a volatile hash), gzip it, and compare against the versioned budget.
// Size Limit covers the same entry independently; this keeps the budget in git.
import { gzipSync } from 'node:zlib';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export function evaluateBudget(measuredBytes, budgetBytes) {
  return { ok: measuredBytes <= budgetBytes, measuredBytes, budgetBytes };
}

export function entryGzipBytes(distDir, manifest) {
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
  if (!entry) throw new Error('No entry chunk found in the Vite manifest.');
  const buffer = readFileSync(join(distDir, entry.file));
  return gzipSync(buffer).length;
}

function main() {
  const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
  const budgets = JSON.parse(readFileSync(join(root, 'performance-budgets.json'), 'utf8'));
  const manifestPath = join(root, 'dist', '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('performance-budget: no dist manifest yet (run `npm run build` first); budget file is well-formed.');
    return;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const measured = entryGzipBytes(join(root, 'dist'), manifest);
  const budget = budgets.budgets.initialJsGzipBytes;
  const { ok } = evaluateBudget(measured, budget);
  console.log(`Initial JS gzip: ${measured} bytes (budget ${budget}).`);
  if (!ok) {
    console.error(`error: initial JavaScript exceeds the budget by ${measured - budget} bytes.`);
    process.exit(1);
  }
  console.log('Performance budget OK.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
