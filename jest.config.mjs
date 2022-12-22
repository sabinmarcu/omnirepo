// @ts-check

import { config as defaultConfig } from './jest.config.base.mjs';
import pkg from './package.json' assert { type: "json" };

const projects = pkg.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/jest.config.{js,cjs,mjs}`,
);

const coverageCollection = pkg.workspaces.map(
  (workspace) => `<rootDir>/${workspace}/src/**/!(index).{ts,tsx}`,
);

const config = {
  ...defaultConfig,
  projects,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: coverageCollection,
  moduleDirectories: [
    'node_modules',
  ],
};

export default config;
