// @ts-check

import {
  projects,
  coverageCollection,
  coverageExcludes,
} from './jest.options.mjs';

/** @type {import('jest').Config} */
const config = {
  projects,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: [
    ...coverageCollection,
    ...coverageExcludes,
  ],
  moduleDirectories: [
    'node_modules',
  ],
};

export default config;
