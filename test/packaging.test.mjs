import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function run(source, format) {
  const result = spawnSync(process.execPath, [`--input-type=${format}`, '--eval', source], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.error?.message ?? result.stderr);
}

test('Puppeteer preserves CJS root and leaf constructor identity', () => {
  run(
    `
    const assert = require('node:assert/strict');
    const root = require('@thisisagile/easy-puppeteer');
    const leaf = require('@thisisagile/easy-puppeteer/PuppeteerTester');
    assert.equal(root.PuppeteerTester, leaf.PuppeteerTester);
  `,
    'commonjs'
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

test('CJS stays on the CJS root and cannot accidentally resolve an ESM-only leaf', () => {
  run(
    `
    const assert = require('node:assert/strict');
    const root = require('@thisisagile/easy');
    const legacy = require('@thisisagile/easy/dist/index.js');
    assert.equal(root.DateTime, legacy.DateTime);
    assert.ok(root.dt('2025-01-01') instanceof legacy.DateTime);
    assert.throws(() => require('@thisisagile/easy/domain/DateTime'), {
      code: 'ERR_PACKAGE_PATH_NOT_EXPORTED'
    });
    const directory = require.resolve('@thisisagile/easy').replace(/index\\.js$/, '');
    assert.ok(!Object.keys(require.cache).some(path => path.startsWith(directory) && path.endsWith('.mjs')));
  `,
    'commonjs'
  );
});
