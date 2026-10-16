import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const config = require('../jest.config.base');

test('runs sibling packages from source, since the ESM dist cannot execute on the CommonJS runtime', () => {
  const [pattern, target] = Object.entries(config.moduleNameMapper)[0];
  const regex = new RegExp(pattern);
  for (const name of ['@thisisagile/easy', '@thisisagile/easy-test-react']) {
    assert.ok(regex.test(name), `${name} should be mapped`);
    assert.equal(name.replace(regex, target), `<rootDir>/../${name.slice('@thisisagile/'.length)}/src`);
  }
  assert.ok(!regex.test('@thisisagile/easy/domain/DateTime'), 'leaf paths are left to the resolver');
  assert.ok(!regex.test('@ibood/easy'), 'other scopes are left to the resolver');
});

test('compiles tests to CommonJS with the shared jest tsconfig', () => {
  const [, options] = config.transform['^.+\\.tsx?$'];
  assert.equal(options.tsconfig, '<rootDir>/../../tsconfig.jest.json');
  const tsconfig = require('../tsconfig.jest.json');
  assert.equal(tsconfig.compilerOptions.module, 'commonjs');
  assert.equal(tsconfig.compilerOptions.moduleResolution, 'node');
});
