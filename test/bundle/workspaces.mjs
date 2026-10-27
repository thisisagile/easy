import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runtimeSource } from '../package-runtime.mjs';
import { checkSideEffects } from './side-effects.mjs';

const packages = fileURLToPath(new URL('../../packages/', import.meta.url));
const exportChecker = fileURLToPath(new URL('../../scripts/check-exports.mjs', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'easy-workspace-consumers-'));

function command(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  assert.equal(result.status, 0, result.error?.message ?? (result.stderr || result.stdout));
}

function packWorkspaces() {
  const dependencies = {};
  for (const directory of readdirSync(packages, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const cwd = join(packages, directory.name);
    const { name } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    const tarball = join(temp, `${directory.name}.tgz`);
    command('yarn', ['pack', '--out', tarball], cwd);
    dependencies[name] = `file:${tarball}`;
  }
  return dependencies;
}

function checkPackages(names) {
  const failures = [];
  for (const name of names) {
    command(process.execPath, [exportChecker], join(temp, 'node_modules', name));
    for (const format of ['module', 'commonjs']) {
      const result = spawnSync(process.execPath, [`--input-type=${format}`, '--eval', runtimeSource(name, format)], { cwd: temp, encoding: 'utf8' });
      console.log(`${name} ${format}: ${result.status === 0 ? 'ok' : 'FAILED'}`);
      if (result.status !== 0) failures.push(`${name} ${format}: ${result.error?.message ?? result.stderr}`);
    }
  }
  assert.deepEqual(failures, []);
}

try {
  console.log('Packing every workspace for ESM and CJS runtime checks and side-effect bundles');
  const dependencies = packWorkspaces();
  writeFileSync(
    join(temp, 'package.json'),
    JSON.stringify({ private: true, dependencies: { ...dependencies, expect: '29.7.0', 'jest-mock': '29.7.0', esbuild: '0.18.20' } })
  );
  command('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], temp);
  checkPackages(Object.keys(dependencies));
  assert.deepEqual(await checkSideEffects(temp), []);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
