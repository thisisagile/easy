module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/../../tsconfig.jest.json' }],
  },
  // The packages publish ESM only, which Jest's CommonJS runtime cannot execute, so sibling packages run from source.
  moduleNameMapper: {
    '^@thisisagile/(easy(?:-domain)?)/([^/]+)$': '<rootDir>/../$1/src/entries/$2',
    '^@thisisagile/(easy[\\w-]*)/(.+)$': '<rootDir>/../$1/src/$2',
    '^@thisisagile/(easy[\\w-]*)$': '<rootDir>/../$1/src',
  },
  reporters: ['default', 'jest-junit'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura', 'text-summary'],
  setupFilesAfterEnv: ['../../test/init.ts'],
};
