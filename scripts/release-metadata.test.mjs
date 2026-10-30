import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractNotes, parseArgs, validateTag } from './release-metadata.mjs';

test('parseArgs reads --tag and --notes', () => {
  assert.deepEqual(parseArgs(['--tag', 'v1.2.3', '--notes', 'out.md']), {
    tag: 'v1.2.3',
    notes: 'out.md'
  });
});

test('validateTag enforces SemVer and version match', () => {
  assert.deepEqual(validateTag('v1.2.3', '1.2.3'), []);
  assert.equal(validateTag('1.2.3', '1.2.3').length, 1);
  assert.equal(validateTag('v9.9.9', '1.2.3').length, 1);
});

test('extractNotes returns a version section or null', () => {
  const changelog = ['# Changelog', '', '## [1.2.3] - 2026-10-30', '- a change', '', '## [1.0.0]', '- old'].join('\n');
  assert.equal(extractNotes(changelog, '1.2.3'), '- a change');
  assert.equal(extractNotes(changelog, '2.0.0'), null);
});
