import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { summarize } from './summary.mjs';
import { snapshotHead } from './snapshot.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const config = JSON.parse(readFileSync(join(here, 'fixtures.json'), 'utf8'));
const esbuildVersion = '0.18.20';

function command(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function install(temp, sourceRoot) {
  const tarball = join(temp, 'package.tgz');
  command('yarn', ['pack', '--out', tarball], join(sourceRoot, config.directory));
  writeFileSync(
    join(temp, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: { [config.package]: 'file:./package.tgz', esbuild: esbuildVersion },
    })
  );
  command('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], temp);
  return JSON.parse(readFileSync(join(temp, 'node_modules', config.package, 'package.json'), 'utf8'));
}

function smoke(temp, expression) {
  const code = `try { const value = await (${expression}); if (!value) throw Error('Empty exports'); }
    catch (error) { console.error(error.code + ': ' + error.message); process.exitCode = 1; }`;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', code], {
    cwd: temp,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status === 0) return { status: 'ok' };
  return { status: 'error', error: result.stderr.trim().replaceAll(temp, '<consumer>') };
}

function loadChecks(temp, manifest) {
  const esm = pathToFileURL(join(temp, 'node_modules', config.package, manifest.module)).href;
  return {
    dateTimeIdentity: smoke(
      temp,
      `Promise.all([
      import('@thisisagile/easy'), import('@thisisagile/easy/domain/DateTime'),
      import('@thisisagile/easy/types/Value')
    ]).then(([root, leaf, value]) => {
      if (root.DateTime !== leaf.DateTime || root.Value !== value.Value ||
          !(root.dt('2025-01-01') instanceof leaf.DateTime) ||
          !(new leaf.DateTime('2025-01-01') instanceof root.DateTime) ||
          !(root.dt('2025-01-01') instanceof value.Value)) throw Error('Root/leaf class identity differs');
      return true;
    })`
    ),
    esmEntry: smoke(temp, `import(${JSON.stringify(esm)})`),
    rootImport: smoke(temp, `import(${JSON.stringify(config.package)})`),
    require: smoke(
      temp,
      `import('node:module').then(({createRequire}) =>
      createRequire(process.cwd() + '/consumer.cjs')(${JSON.stringify(config.package)}))`
    ),
  };
}

function source(fixture, specifier) {
  const [, , symbol, expression] = fixture;
  if (symbol === 'Enum') {
    return `import { Enum } from '${specifier}'; ${expression}; export default Example.One;`;
  }
  return `import { ${symbol} } from '${specifier}'; export default ${expression};`;
}

function consumers(manifest) {
  const modes = {
    root: () => config.package,
    leaf: ([, leaf]) => `${config.package}/${config.leafPrefix}/${leaf}.${config.leafExtension}`,
    cjs: () => `${config.package}/${manifest.main}`,
  };
  return Object.entries(modes)
    .flatMap(([mode, specifier]) =>
      config.fixtures.map(fixture => ({
        name: `${mode}/${fixture[0]}`,
        source: source(fixture, specifier(fixture)),
      }))
    )
    .concat({ name: 'root/namespace', source: `import * as library from '${config.package}'; export default library;` });
}

async function bundle(esbuild, temp, consumer, platform) {
  try {
    const result = await esbuild.build({
      stdin: { contents: consumer.source, resolveDir: temp, sourcefile: 'consumer.mjs' },
      absWorkingDir: temp,
      bundle: true,
      write: false,
      metafile: true,
      minify: true,
      treeShaking: true,
      platform,
      format: 'esm',
      target: 'es2022',
      logLevel: 'silent',
      mainFields: consumer.name.startsWith('cjs/') ? ['main', 'module'] : ['module', 'main'],
    });
    const output = result.outputFiles[0].contents;
    return { status: 'ok', rawBytes: output.length, gzipBytes: gzipSync(output).length, ...summarize(result.metafile, config.package) };
  } catch (error) {
    if (!error.errors) throw error;
    return {
      status: 'error',
      errors: error.errors.map(e => ({
        text: e.text,
        file: e.location?.file ?? null,
      })),
    };
  }
}

async function measure(temp, manifest) {
  const require = createRequire(join(temp, 'package.json'));
  const esbuild = require('esbuild');
  const fixtures = {};
  for (const consumer of consumers(manifest)) {
    for (const platform of ['browser', 'node']) {
      fixtures[`${platform}/${consumer.name}`] = await bundle(esbuild, temp, consumer, platform);
    }
  }
  return {
    schemaVersion: 1,
    package: config.package,
    version: manifest.version,
    node: process.version,
    esbuild: esbuild.version,
    checks: { ...loadChecks(temp, manifest), isDefinedBytes: checkIsDefined(fixtures) },
    fixtures,
    dependencyLock: JSON.parse(readFileSync(join(temp, 'package-lock.json'), 'utf8')),
  };
}

function checkIsDefined(fixtures) {
  const measured = ['browser/root/isDefined', 'node/root/isDefined'].map(name => fixtures[name].rawBytes ?? null);
  return { status: measured.every(bytes => bytes !== null && bytes <= 100) ? 'ok' : 'error', ceiling: 100, measured };
}

function report(result) {
  writeFileSync(join(here, 'report.json'), JSON.stringify(result, null, 2) + '\n');
  if (process.argv.includes('--save')) {
    writeFileSync(join(here, 'baseline.json'), JSON.stringify(result, null, 2) + '\n');
  }
  for (const [name, value] of Object.entries({ ...result.checks, ...result.fixtures })) {
    const detail = value.status === 'ok' && value.rawBytes !== undefined ? `${value.rawBytes} raw / ${value.gzipBytes} gzip bytes` : value.status;
    console.log(`${name}: ${detail}`);
  }
  const failed = Object.values({ ...result.checks, ...result.fixtures }).filter(v => v.status !== 'ok');
  console.log(`${failed.length} failures; full diagnostics: test/bundle/report.json`);
  if (failed.length) process.exitCode = 1;
}

const temp = mkdtempSync(join(tmpdir(), 'packed-consumer-'));
try {
  const sourceRoot = process.argv.includes('--head') ? snapshotHead(root, temp) : root;
  const manifest = install(temp, sourceRoot);
  const result = await measure(temp, manifest);
  result.source = process.argv.includes('--head') ? { gitCommit: command('git', ['rev-parse', 'HEAD'], root).trim() } : { workingTree: true };
  report(result);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
