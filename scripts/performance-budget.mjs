#!/usr/bin/env node
// Resolve the entry and lazy-route chunks by stable Vite manifest keys.
// Size Limit covers the same entry independently; this keeps the budget in git.
import { gzipSync } from 'node:zlib';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export function evaluateBudget(measuredBytes, budgetBytes) {
  return { ok: measuredBytes <= budgetBytes, measuredBytes, budgetBytes };
}

export function staticChunks(manifest, source, files = new Set()) {
  const chunk = manifest[source];
  if (!chunk) throw new Error(`Missing chunk in the Vite manifest: ${source}.`);
  if (files.has(chunk.file)) return files;
  files.add(chunk.file);
  for (const dependency of chunk.imports ?? []) staticChunks(manifest, dependency, files);
  return files;
}

function entryChunks(manifest) {
  const entry = Object.keys(manifest).find((source) => manifest[source].isEntry);
  if (!entry) throw new Error('No entry chunk found in the Vite manifest.');
  return staticChunks(manifest, entry);
}

function gzipBytes(distDir, files) {
  return [...files].reduce((bytes, file) => bytes + gzipSync(readFileSync(join(distDir, file))).length, 0);
}

export function entryGzipBytes(distDir, manifest) {
  return gzipBytes(distDir, entryChunks(manifest));
}

const routeSources = ['BreachCheck', 'Design', 'Learn'].map((name) => `src/components/${name}.tsx`);

export function routeChunks(manifest) {
  return routeSources.map((source) => {
    const chunk = manifest[source];
    if (!chunk?.isDynamicEntry) throw new Error(`Expected a lazy route chunk for ${source}.`);
    return chunk.file;
  });
}

function main() {
  const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
  const budgets = JSON.parse(readFileSync(join(root, 'performance-budgets.json'), 'utf8'));
  const manifestPath = join(root, 'dist', '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('Vite manifest missing. Run `npm run build` before checking performance budgets.');
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const distDir = join(root, 'dist');
  const checks = [
    ['Initial JS', entryGzipBytes(distDir, manifest), budgets.budgets.initialJsGzipBytes],
    ...routeChunks(manifest).map((file) => [
      file,
      gzipSync(readFileSync(join(distDir, file))).length,
      budgets.budgets.routeChunkGzipBytes
    ])
  ];
  for (const [label, size, budget] of checks) {
    const { ok } = evaluateBudget(size, budget);
    console.log(`${label} gzip: ${size} bytes (budget ${budget}).`);
    if (!ok) {
      console.error(`error: ${label} exceeds the budget by ${size - budget} bytes.`);
      process.exitCode = 1;
    }
  }
  if (process.exitCode) return;
  console.log('Performance budget OK.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
