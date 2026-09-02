import { fileURLToPath } from 'node:url';
import {
  mergeConfig,
// eslint-disable-next-line import/extensions
} from 'vitest/config';

// eslint-disable-next-line import/no-relative-packages
import configShared from '../../vitest.config.mjs';

export default mergeConfig(
  configShared,
  {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },
);
