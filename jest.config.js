const baseConfig = require('./jest.config.base');
const fs = require('fs');

const roots = fs
  .readdirSync('packages/', { withFileTypes: true })
  .filter(c => c.isDirectory())
  .map(c => `<rootDir>/packages/${c.name}`);

module.exports = {
  ...baseConfig,
  roots,
  setupFilesAfterEnv: ['./test/init.ts'],
};
