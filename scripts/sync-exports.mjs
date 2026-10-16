import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

// Every source file is a public leaf. Deriving the exports map from src keeps package.json in step with the build
// instead of hand-maintaining a list per file.
const directory = process.cwd();
const manifestPath = resolve(directory, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const sources = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [path] : [];
  });

const leafOf = source =>
  relative(resolve(directory, 'src'), source)
    .replace(/\\/g, '/')
    .replace(/\.tsx?$/, '');

const targetOf = leaf => {
  const target = { types: `./dist/${leaf}.d.ts`, default: `./dist/${leaf}.js` };
  Object.values(target).forEach(file => assert.ok(existsSync(resolve(directory, file)), `Build first: missing ${file}`));
  return target;
};

const leaves = sources(resolve(directory, 'src'))
  .map(leafOf)
  .filter(leaf => leaf !== 'index')
  .sort();

manifest.exports = {
  '.': targetOf('index'),
  ...Object.fromEntries(leaves.map(leaf => [`./${leaf}`, targetOf(leaf)])),
  './src/*': './src/*',
  './dist/*': './dist/*',
  './package.json': './package.json',
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${manifest.name}: ${leaves.length + 1} exports written`);
