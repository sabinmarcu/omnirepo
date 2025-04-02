import {
  coverageConfigDefaults,
  defineConfig,
// eslint-disable-next-line import/extensions
} from 'vitest/config';
import { fileURLToPath } from 'node:url';

const includePattern = '**/!(*.type).spec.?(m|c)@(j|t)s';
export default defineConfig({
  test: {
    include: [includePattern],
    setupFiles: fileURLToPath(
      new URL('.config/jest/setupFiles/moize.mjs', import.meta.url),
    ),
    passWithNoTests: true,
    coverage: {
      enabled: false,
      include: { includePattern },
      reportsDirectory: fileURLToPath(
        new URL('coverage', import.meta.url),
      ),
      exclude: [
        '**/index.ts',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
