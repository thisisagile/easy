module.exports = {
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  reporters: ["default", "jest-junit"],
  testResultsProcessor: "jest-sonar-reporter",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura", "text-summary"],
};
