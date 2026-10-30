#!/usr/bin/env node
// Idempotently create or update the repository's managed labels from
// .github/labels.json. Used by the `labels` workflow; needs a GITHUB_TOKEN with
// `issues: write`. Node-native (global fetch), no dependencies.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HEX_COLOR = /^[0-9A-Fa-f]{6}$/;

export function validateLabels(labels) {
  const problems = [];
  if (!Array.isArray(labels)) return ['labels.json must be an array.'];
  labels.forEach((label, i) => {
    if (typeof label.name !== 'string' || label.name.trim() === '') problems.push(`labels[${i}]: name required.`);
    if (typeof label.color !== 'string' || !HEX_COLOR.test(label.color)) {
      problems.push(`labels[${i}] (${label.name}): color must be a 6-digit hex.`);
    }
    if (typeof label.description !== 'string') problems.push(`labels[${i}] (${label.name}): description required.`);
  });
  return problems;
}

export function parseArgs(argv) {
  const args = { path: '.github/labels.json' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--repository') args.repository = argv[++i];
    else if (argv[i] === '--token') args.token = argv[++i];
    else if (!argv[i].startsWith('--')) args.path = argv[i];
  }
  return args;
}

async function upsertLabel(repository, token, label) {
  const base = `https://api.github.com/repos/${repository}/labels`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };
  const body = JSON.stringify({ name: label.name, color: label.color, description: label.description });
  const existing = await fetch(`${base}/${encodeURIComponent(label.name)}`, { headers });
  if (existing.status === 200) {
    const res = await fetch(`${base}/${encodeURIComponent(label.name)}`, { method: 'PATCH', headers, body });
    if (!res.ok) throw new Error(`update ${label.name}: HTTP ${res.status}`);
    return 'updated';
  }
  const res = await fetch(base, { method: 'POST', headers, body });
  if (!res.ok) throw new Error(`create ${label.name}: HTTP ${res.status}`);
  return 'created';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const labels = JSON.parse(readFileSync(args.path, 'utf8'));
  const problems = validateLabels(labels);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`error: ${problem}`);
    process.exit(1);
  }
  if (!args.repository || !args.token) {
    console.log(`labels.json valid (${labels.length} labels). No --repository/--token given, skipping sync.`);
    return;
  }
  for (const label of labels) {
    const action = await upsertLabel(args.repository, args.token, label);
    console.log(`${action}: ${label.name}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
