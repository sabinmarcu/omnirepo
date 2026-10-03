// eslint-disable-next-line import/extensions
import { mergeConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import configShared from '../../../vitest.config.mjs';

export default mergeConfig(configShared);
