import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const checker = fileURLToPath(new URL('../scripts/check-exports.mjs', import.meta.url));

function fixture(t, exports) {
  const directory = mkdtempSync(join(tmpdir(), 'easy-exports-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, 'dist'));
  for (const file of ['index.mjs', 'index.js', 'index.d.ts', 'leaf.mjs']) {
    writeFileSync(join(directory, 'dist', file), '');
  }
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ name: '@fixture/package', exports }));
  return spawnSync(process.execPath, [checker], { cwd: directory, encoding: 'utf8' });
}

const root = { types: './dist/index.d.ts', default: './dist/index.js' };

test('checks default roots, leaves, and every existing legacy target', t => {
  const result = fixture(t, { '.': root, './leaf': { default: './dist/leaf.mjs' }, './dist/*': './dist/*' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /6 export targets exist and resolve/);
});

test('still accepts split import and require conditions', t => {
  const result = fixture(t, { '.': { types: './dist/index.d.ts', import: './dist/index.mjs', require: './dist/index.js' } });
  assert.equal(result.status, 0, result.stderr);
});

test('rejects a missing default target', t => {
  const result = fixture(t, { '.': { ...root, default: './dist/missing.js' } });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing export/);
});

test('rejects a missing declaration target', t => {
  const result = fixture(t, { '.': { ...root, types: './dist/missing.d.ts' } });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing export/);
});

test('rejects manifests without a root export', t => {
  const result = fixture(t, {});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing root export/);
});

test('rejects targets outside the package', t => {
  const result = fixture(t, { '.': { ...root, default: '../outside.mjs' } });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Non-local export/);
});
