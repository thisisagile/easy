import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const directory = process.cwd();
const manifest = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'));
const require = createRequire(resolve(directory, 'package.json'));
const imports = [];

function checkTarget(subpath, target) {
  assert.ok(target.startsWith('./'), `Non-local export: ${target}`);
  assert.ok(existsSync(resolve(directory, target)), `Missing export ${subpath}: ${target}`);
  assert.equal(require.resolve(resolve(directory, target)), resolve(directory, target));
}

function checkExport(subpath, conditions) {
  const specifier = manifest.name + subpath.slice(1);
  const targets = typeof conditions === 'string' ? { default: conditions } : conditions;
  Object.values(targets).forEach(target => checkTarget(subpath, target));
  const imported = targets.import ?? targets.default;
  const required = targets.require ?? targets.default;
  if (imported) imports.push([specifier, pathToFileURL(resolve(directory, imported)).href]);
  if (required) {
    assert.equal(require.resolve(specifier), resolve(directory, required));
    return;
  }
  assert.throws(() => require.resolve(specifier), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
}

function checkPattern(subpath, target) {
  assert.equal(subpath, target, 'Only legacy passthrough export patterns are supported');
  const prefix = target.slice(0, -1);
  const files = readdirSync(resolve(directory, prefix), { recursive: true, withFileTypes: true });
  for (const file of files.filter(entry => entry.isFile())) {
    const absolute = resolve(file.parentPath ?? file.path, file.name);
    const relative = './' + absolute.slice(directory.length + 1).replaceAll('\\', '/');
    checkExport(relative, relative);
  }
}

assert.ok(manifest.exports?.['.'], 'Missing root export');
for (const [subpath, target] of Object.entries(manifest.exports)) {
  if (subpath.includes('*')) checkPattern(subpath, target);
  else checkExport(subpath, target);
}

const result = spawnSync(
  process.execPath,
  [
    '--input-type=module',
    '--eval',
    `
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  for (const [specifier, expected] of JSON.parse(readFileSync(0, 'utf8'))) {
    assert.equal(import.meta.resolve(specifier), expected);
  }
`,
  ],
  { cwd: directory, encoding: 'utf8', input: JSON.stringify(imports) }
);
assert.equal(result.status, 0, result.error?.message ?? result.stderr);
console.log(`${manifest.name}: ${imports.length} export targets exist and resolve`);
