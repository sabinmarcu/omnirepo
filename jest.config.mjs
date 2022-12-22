// @ts-check

import pkg from './package.json' assert { type: "json" };

const projects = pkg.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/jest.config.{js,cjs,mjs}`,
);

const coverageCollection = pkg.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/src/**/*.{ts,tsx}`,
);

const config = {
  projects,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: coverageCollection,
  moduleDirectories: [
    'node_modules',
  ],
};

export default config;
