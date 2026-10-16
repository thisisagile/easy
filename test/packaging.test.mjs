import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { runtimeSource } from './package-runtime.mjs';

const packages = new URL('../packages/', import.meta.url);
for (const directory of readdirSync(packages, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
  const { name } = JSON.parse(readFileSync(new URL(`${directory.name}/package.json`, packages), 'utf8'));
  for (const format of ['module', 'commonjs']) {
    test(`${name} executes its ${format} entry`, () => run(runtimeSource(name, format), format));
  }
}

function run(source, format) {
  const result = spawnSync(process.execPath, [`--input-type=${format}`, '--eval', source], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.error?.message ?? result.stderr);
}

test('require and import hand out the same module instance, so singletons such as ctx are never split', () => {
  run(
    `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import { ctx, DateTime } from '@thisisagile/easy';
    const require = createRequire(import.meta.url);
    const required = require('@thisisagile/easy');
    assert.equal(required.ctx, ctx);
    assert.equal(required.DateTime, DateTime);
    assert.equal(require('@thisisagile/easy/domain/DateTime').DateTime, DateTime);
    assert.equal(require('@thisisagile/easy-puppeteer').PuppeteerTester, require('@thisisagile/easy-puppeteer/PuppeteerTester').PuppeteerTester);
  `,
    'module'
  );
});

test('ESM root and leaf use the same DateTime and Value constructors', () => {
  run(
    `
    import assert from 'node:assert/strict';
    import { DateTime, Value, dt } from '@thisisagile/easy';
    import { DateTime as Leaf } from '@thisisagile/easy/domain/DateTime';
    import { Value as LeafValue } from '@thisisagile/easy/types/Value';
    import { createRequire } from 'node:module';
    const require = createRequire(import.meta.url);
    assert.equal(DateTime, Leaf);
    assert.equal(Value, LeafValue);
    assert.ok(dt('2025-01-01') instanceof Leaf);
    assert.ok(new Leaf('2025-01-01') instanceof DateTime);
    assert.ok(dt('2025-01-01') instanceof LeafValue);
    assert.equal(require.cache[require.resolve('@thisisagile/easy')], undefined);
  `,
    'module'
  );
});

test('a CommonJS consumer reaches the root, the legacy dist path and the leaf through one ESM build', () => {
  run(
    `
    const assert = require('node:assert/strict');
    const root = require('@thisisagile/easy');
    const legacy = require('@thisisagile/easy/dist/index.js');
    const leaf = require('@thisisagile/easy/domain/DateTime');
    assert.equal(root.DateTime, legacy.DateTime);
    assert.equal(root.DateTime, leaf.DateTime);
    assert.ok(root.dt('2025-01-01') instanceof leaf.DateTime);
  `,
    'commonjs'
  );
});
