import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize } from './summary.mjs';

test('counts emitted modules, including nested scoped dependencies, but excludes shaken inputs', () => {
  const metafile = {
    inputs: { 'node_modules/example/shaken.js': {} },
    outputs: {
      'a.js': {
        inputs: {
          'node_modules/example/index.js': { bytesInOutput: 12 },
          'node_modules/example/unused.js': { bytesInOutput: 0 },
          'node_modules/example/node_modules/@scope/dep/index.js': { bytesInOutput: 4 },
          'node_modules/luxon/index.js': { bytesInOutput: 8 },
          'consumer.mjs': { bytesInOutput: 6 },
        },
        imports: [
          { external: true, path: 'node:crypto' },
          { external: false, path: './chunk.js' },
        ],
      },
      'b.js': { inputs: { 'node_modules/example/index.js': { bytesInOutput: 3 } }, imports: [] },
    },
  };
  const result = summarize(metafile, 'example');
  assert.deepEqual(result.retainedThirdPartyPackages, ['@scope/dep', 'luxon']);
  assert.equal(result.retainedModules.length, 1);
  assert.equal(result.retainedDependencyModules.length, 2);
  assert.deepEqual(result.externalImports, ['node:crypto']);
  assert.equal(result.retainedModules.find(m => m.path === 'node_modules/example/index.js').bytes, 15);
  assert.ok(!JSON.stringify(result).includes('unused'));
  assert.ok(!JSON.stringify(result).includes('shaken'));
  assert.ok(!JSON.stringify(result).includes('consumer'));
});
