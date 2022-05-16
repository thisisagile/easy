const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Temporary workaround see https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149 and https://github.com/uuidjs/uuid/pull/616
    "^uuid$": require.resolve("uuid")
  },
};
