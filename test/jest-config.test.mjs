import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const config = require('../jest.config.base');

test('runs sibling packages from source, since the ESM dist cannot execute on the CommonJS runtime', () => {
  const entries = Object.entries(config.moduleNameMapper);
  const [rootPattern, rootTarget] = entries.at(-1);
  const rootRegex = new RegExp(rootPattern);
  for (const name of ['@thisisagile/easy', '@thisisagile/easy-test-react']) {
    assert.ok(rootRegex.test(name), `${name} should be mapped`);
    assert.equal(name.replace(rootRegex, rootTarget), `<rootDir>/../${name.slice('@thisisagile/'.length)}/src`);
  }
  const [cataloguePattern, catalogueTarget] = entries.find(([pattern]) => pattern.includes('easy(?:-domain)?'));
  const catalogueRegex = new RegExp(cataloguePattern);
  assert.equal('@thisisagile/easy/App'.replace(catalogueRegex, catalogueTarget), '<rootDir>/../easy/src/entries/App');
  assert.equal('@thisisagile/easy-domain/Country'.replace(catalogueRegex, catalogueTarget), '<rootDir>/../easy-domain/src/entries/Country');
  assert.ok(!rootRegex.test('@thisisagile/easy/App'), 'subpaths use their own source mapping');
  assert.ok(!rootRegex.test('@ibood/easy'), 'other scopes are left to the resolver');
});

test('compiles tests to CommonJS with the shared jest tsconfig', () => {
  const [, options] = config.transform['^.+\\.tsx?$'];
  assert.equal(options.tsconfig, '<rootDir>/../../tsconfig.jest.json');
  const tsconfig = require('../tsconfig.jest.json');
  assert.equal(tsconfig.compilerOptions.baseUrl, '.');
  assert.equal(tsconfig.compilerOptions.module, 'commonjs');
  assert.equal(tsconfig.compilerOptions.moduleResolution, 'node');
  assert.deepEqual(tsconfig.compilerOptions.paths, {
    '@thisisagile/easy': ['packages/easy/src/index.ts'],
    '@thisisagile/easy/*': ['packages/easy/src/entries/*', 'packages/easy/src/*'],
  });
});
