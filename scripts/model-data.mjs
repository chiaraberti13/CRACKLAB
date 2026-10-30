#!/usr/bin/env node
// Validates the versioned estimation datasets: every entry must declare a
// provenance kind, a non-empty source and an ISO date; benchmarks older than
// twelve months raise a (non-blocking) warning. Missing or malformed fields fail.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KINDS = new Set(['measured', 'derived', 'assumption']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

export function validateEntry(entry, label) {
  const errors = [];
  if (!KINDS.has(entry.kind)) {
    errors.push(`${label}: kind must be one of measured|derived|assumption (got ${JSON.stringify(entry.kind)}).`);
  }
  if (typeof entry.source !== 'string' || entry.source.trim().length === 0) {
    errors.push(`${label}: a non-empty source is required.`);
  }
  if (typeof entry.date !== 'string' || !ISO_DATE.test(entry.date)) {
    errors.push(`${label}: date must be an ISO YYYY-MM-DD string (got ${JSON.stringify(entry.date)}).`);
  }
  return errors;
}

export function staleWarnings(entries, labelOf, now = Date.now()) {
  const warnings = [];
  for (const entry of entries) {
    if (typeof entry.date === 'string' && ISO_DATE.test(entry.date)) {
      const age = now - Date.parse(entry.date);
      if (age > TWELVE_MONTHS_MS) {
        warnings.push(`${labelOf(entry)}: benchmark is older than 12 months (${entry.date}); refresh it via PR.`);
      }
    }
  }
  return warnings;
}

export function validateDatasets(benchmarks, pricing, now = Date.now()) {
  const errors = [];
  const warnings = [];

  benchmarks.entries.forEach((entry, i) => {
    const label = `benchmarks[${i}] ${entry.algorithm}/${entry.scenario}`;
    errors.push(...validateEntry(entry, label));
    if (!(typeof entry.hashesPerSecond === 'number' && entry.hashesPerSecond > 0)) {
      errors.push(`${label}: hashesPerSecond must be a positive number.`);
    }
  });
  pricing.entries.forEach((entry, i) => {
    const label = `pricing[${i}] ${entry.scenario}`;
    errors.push(...validateEntry(entry, label));
    if (!(typeof entry.usdPerHour === 'number' && entry.usdPerHour >= 0)) {
      errors.push(`${label}: usdPerHour must be a non-negative number.`);
    }
  });

  warnings.push(...staleWarnings(benchmarks.entries, (e) => `benchmarks ${e.algorithm}/${e.scenario}`, now));
  return { errors, warnings };
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8'));
}

function main() {
  const benchmarks = readJson('../src/model/data/benchmarks.json');
  const pricing = readJson('../src/model/data/pricing.json');
  const { errors, warnings } = validateDatasets(benchmarks, pricing);

  for (const warning of warnings) console.warn(`warning: ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`);
    console.error(`\nModel data validation failed with ${errors.length} error(s).`);
    process.exit(1);
  }
  console.log(
    `Model data OK: ${benchmarks.entries.length} benchmark + ${pricing.entries.length} pricing entries, ` +
      `${warnings.length} freshness warning(s).`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
