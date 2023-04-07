import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ["./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default", "junit", "vitest-sonar-reporter"],
    outputFile: {
      junit: 'junit.xml',
      'vitest-sonar-reporter': 'test-report.xml',
    },
    coverage: {
      enabled: true,
      provider: "c8",
      reporter: ["text", "lcov"],
    },
  },
});
