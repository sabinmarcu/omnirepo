// @ts-check

import packageJson from './package.json' assert { type: "json" };

const projects = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/jest.config.{js,cjs,mjs}`,
);

const coverageCollection = packageJson.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/src/**/!(index).{ts,tsx}`,
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
