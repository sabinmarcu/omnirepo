import {
  generateFromPath,
} from '../../../.config/jest/jest.config.project.mjs';

export default generateFromPath(
  (await import('node:url')).fileURLToPath(
    new URL('.', import.meta.url),
  ),
);

export const coverageExcludes = [
  'src/config.ts',
  'src/environment.ts',
];
