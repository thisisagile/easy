const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const packages = readdirSync(join(__dirname, 'packages'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => ({
    directory: entry.name,
    manifest: JSON.parse(readFileSync(join(__dirname, 'packages', entry.name, 'package.json'), 'utf8')),
  }));

const catalogueEntries = packages.flatMap(({ directory, manifest }) =>
  Object.entries(manifest.catalogueEntries ?? {}).map(([entry, source]) => ({ directory, entry, manifest, source }))
);
const catalogueMappings = Object.fromEntries(
  catalogueEntries.map(({ directory, entry, manifest, source }) => [`^${manifest.name}/${entry}$`, `<rootDir>/../${directory}/${source.slice(2)}`])
);
const cataloguePaths = Object.fromEntries(
  catalogueEntries.map(({ directory, entry, manifest, source }) => [`${manifest.name}/${entry}`, [`packages/${directory}/${source.slice(2)}`]])
);
const jestTsconfig = require('./tsconfig.jest.json');
const tsconfig = {
  ...jestTsconfig.compilerOptions,
  baseUrl: __dirname,
  paths: { ...jestTsconfig.compilerOptions.paths, ...cataloguePaths },
};

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig }],
  },
  // The packages publish ESM only, which Jest's CommonJS runtime cannot execute, so sibling packages run from source.
  moduleNameMapper: {
    ...catalogueMappings,
    '^@thisisagile/(easy[\\w-]*)/(.+)$': '<rootDir>/../$1/src/$2',
    '^@thisisagile/(easy[\\w-]*)$': '<rootDir>/../$1/src',
  },
  reporters: ['default', 'jest-junit'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura', 'text-summary'],
  setupFilesAfterEnv: ['../../test/init.ts'],
};
