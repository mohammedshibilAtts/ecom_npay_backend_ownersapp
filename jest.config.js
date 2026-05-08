export default {
  testEnvironment: "node",
  transform: {},

  setupFilesAfterEnv: ["./tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/**",
    "!src/index.js",
    "!src/server.js",
  ],
  coverageDirectory: "coverage",
};
