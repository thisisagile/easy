const baseConfig = require('./jest.config.base');
const fs = require('fs');

const projects = fs
  .readdirSync('packages/', { withFileTypes: true })
  .filter(c => c.isDirectory() && c.name !== 'easy-vitest')
  .map(c => ({...require(`./packages/${c.name}/jest.config.js`), rootDir: `./packages/${c.name}`}));

module.exports = {
  ...baseConfig,
  projects,
  setupFilesAfterEnv: ['./test/init.ts'],
};
