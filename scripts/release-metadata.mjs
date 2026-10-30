#!/usr/bin/env node
// Release gate: a tag must be SemVer `vX.Y.Z`, match package.json#version, and have
// a matching changelog section. On success it writes the extracted notes to --notes.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SEMVER_TAG = /^v(\d+)\.(\d+)\.(\d+)$/;

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--tag') args.tag = argv[++i];
    else if (argv[i] === '--notes') args.notes = argv[++i];
  }
  return args;
}

export function validateTag(tag, packageVersion) {
  const problems = [];
  const match = SEMVER_TAG.exec(tag ?? '');
  if (!match) {
    problems.push(`Tag must look like vX.Y.Z (got ${JSON.stringify(tag)}).`);
    return problems;
  }
  const version = `${match[1]}.${match[2]}.${match[3]}`;
  if (version !== packageVersion) {
    problems.push(`Tag ${tag} does not match package.json version ${packageVersion}.`);
  }
  return problems;
}

export function extractNotes(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return rest
    .slice(0, end === -1 ? rest.length : end)
    .join('\n')
    .trim();
}

function readRepoFile(relativePath) {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pkg = JSON.parse(readRepoFile('../package.json'));
  const problems = validateTag(args.tag, pkg.version);
  if (problems.length > 0) {
    for (const problem of problems) console.error(`error: ${problem}`);
    process.exit(1);
  }
  const notes = extractNotes(readRepoFile('../CHANGELOG.md'), pkg.version);
  if (notes === null) {
    console.error(`error: CHANGELOG.md has no section for version ${pkg.version}.`);
    process.exit(1);
  }
  if (args.notes) {
    writeFileSync(args.notes, `${notes}\n`);
    console.log(`Release notes for ${args.tag} written to ${args.notes}.`);
  } else {
    console.log(`Release metadata OK for ${args.tag}.`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
