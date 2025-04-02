import {
  mergeConfig,
// eslint-disable-next-line import/extensions
} from 'vitest/config';

// eslint-disable-next-line import/no-relative-packages
import configShared from '../../../vitest.config.mjs';

const mergedConfig = mergeConfig(
  configShared,
);

export default mergedConfig;
