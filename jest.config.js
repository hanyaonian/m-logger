/** @type {import('jest').Config} */

const config = {
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "jsdom",
};

export default config;
