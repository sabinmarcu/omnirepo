// @ts-check

import {
  generateFromPath,
} from '../../.config/jest/jest.config.project.mjs';

export default generateFromPath(
  (await import('node:url')).fileURLToPath(
    new URL('.', import.meta.url),
  ),
  ({ relativePath }) => ({
    coveragePathIgnorePatterns: [
      'node_modules',
      `<rootDir>/${relativePath}/src/constants`,
    ],
  }),
);
