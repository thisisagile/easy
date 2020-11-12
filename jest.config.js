module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  reporters: ["default", "jest-junit"],
  testResultsProcessor: "jest-sonar-reporter",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura", "text-summary"],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  globals: {
    "ts-jest": {
      "tsconfig": "tsconfig.json"
    }
  }
};
