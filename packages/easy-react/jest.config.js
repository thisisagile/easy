const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(s?css|styl|less|sass|png|jpe?g|ttf|woff|woff2)$': 'jest-transform-stub',
  },
};
