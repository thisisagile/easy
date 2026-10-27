import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const matchers = fileURLToPath(new URL('../../packages/easy-test/src/matchers/', import.meta.url));
const registeringMatchers = readdirSync(matchers).filter(file => readFileSync(join(matchers, file), 'utf8').includes('expect.extend(')).length;

// The test libraries run inside Jest, so only their own modules are measured; jest, expect and testing-library stay external.
const onlyBundle = name => ({
  name: 'only-bundle',
  setup: build =>
    build.onResolve({ filter: /^[^./]/ }, args => (args.path === name || args.path.startsWith(`${name}/`) ? undefined : { path: args.path, external: true })),
});

const retained = metafile =>
  Object.values(metafile.outputs).flatMap(output =>
    Object.entries(output.inputs)
      .filter(([, input]) => input.bytesInOutput > 0)
      .map(([path]) => path)
  );

const retainsNone = forbidden => (code, metafile) => {
  const found = retained(metafile).filter(path => forbidden.some(part => path.includes(part)));
  return found.length ? `retains ${found.join(', ')}` : undefined;
};

const contains = (expected, marker) => code => {
  const found = code.split(marker).length - 1;
  return found === expected ? undefined : `expected ${expected} × ${marker}, found ${found}`;
};

const lean = retainsNone(['/dayjs/', '/reflect-metadata/', '/domain/DateTime.js', '/types/Meta.js']);

const consumers = [
  { name: 'easy root isDefined', source: `import { isDefined } from '@thisisagile/easy'; export default isDefined;`, check: lean },
  { name: 'easy leaf isDefined', source: `import { isDefined } from '@thisisagile/easy/types/Is'; export default isDefined;`, check: lean },
  {
    name: 'easy-test bare import',
    source: `import '@thisisagile/easy-test';`,
    plugins: [onlyBundle('@thisisagile/easy-test')],
    check: contains(registeringMatchers, 'expect.extend('),
  },
  {
    name: 'easy-test-react bare import',
    source: `import '@thisisagile/easy-test-react';`,
    plugins: [onlyBundle('@thisisagile/easy-test-react')],
    check: contains(1, 'jest.spyOn(Intl.DateTimeFormat.prototype'),
  },
];

async function verify(esbuild, temp, consumer) {
  const result = await esbuild.build({
    stdin: { contents: consumer.source, resolveDir: temp, sourcefile: 'consumer.mjs' },
    absWorkingDir: temp,
    bundle: true,
    write: false,
    metafile: true,
    minify: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    logLevel: 'silent',
    plugins: consumer.plugins ?? [],
  });
  return consumer.check(new TextDecoder().decode(result.outputFiles[0].contents), result.metafile);
}

export async function checkSideEffects(temp) {
  const esbuild = createRequire(join(temp, 'package.json'))('esbuild');
  const failures = [];
  for (const consumer of consumers) {
    const problem = await verify(esbuild, temp, consumer);
    console.log(`side effects, ${consumer.name}: ${problem ?? 'ok'}`);
    if (problem) failures.push(`${consumer.name}: ${problem}`);
  }
  return failures;
}
