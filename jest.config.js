/** @type {import('jest').Config} */

const config = {
  verbose: true,
  moduleNameMapper: {
    "^m-web-logger$": "<rootDir>/src/index.ts",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "jsdom",
};

export default config;
