/** @type {import('jest').Config} */

const config = {
  verbose: true,
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "jsdom",
};

export default config;
