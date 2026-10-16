import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const script = fileURLToPath(new URL('../scripts/sync-exports.mjs', import.meta.url));

function fixture(t, { sources, built }) {
  const directory = mkdtempSync(join(tmpdir(), 'easy-sync-exports-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const file of [...sources.map(s => `src/${s}`), ...built.map(b => `dist/${b}`)]) {
    mkdirSync(dirname(join(directory, file)), { recursive: true });
    writeFileSync(join(directory, file), '');
  }
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ name: '@fixture/package', exports: { stale: true } }, null, 2) + '\n');
  const result = spawnSync(process.execPath, [script], { cwd: directory, encoding: 'utf8' });
  return { result, manifest: JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')) };
}

test('derives a default export per source file, the root and the legacy passthroughs', t => {
  const { result, manifest } = fixture(t, {
    sources: ['index.ts', 'domain/Entity.ts', 'layout/If.tsx'],
    built: ['index.js', 'index.d.ts', 'domain/Entity.js', 'domain/Entity.d.ts', 'layout/If.js', 'layout/If.d.ts'],
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(manifest.exports, {
    '.': { types: './dist/index.d.ts', default: './dist/index.js' },
    './domain/Entity': { types: './dist/domain/Entity.d.ts', default: './dist/domain/Entity.js' },
    './layout/If': { types: './dist/layout/If.d.ts', default: './dist/layout/If.js' },
    './src/*': './src/*',
    './dist/*': './dist/*',
    './package.json': './package.json',
  });
  assert.match(result.stdout, /3 exports written/);
});

test('refuses to write when a source has no built output', t => {
  const { result, manifest } = fixture(t, { sources: ['index.ts', 'domain/Entity.ts'], built: ['index.js', 'index.d.ts'] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Build first: missing \.\/dist\/domain\/Entity\.d\.ts/);
  assert.deepEqual(manifest.exports, { stale: true });
});
