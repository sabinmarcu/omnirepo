import type { Config } from './types.js';

import jsConfig from './configs/jsConfig.js';
import tsConfig from './configs/tsConfig.js';
import jsxConfig from './configs/jsxConfig.js';
import moduleConfig from './configs/module.js';
import rootConfigsConfig from './configs/root.js';
import jestConfig from './configs/jest.js';
import unicornConfig from './configs/unicorn.js';

import { logConfigs } from './utils/logConfigs.js';
import storybookConfig from './configs/storybook.js';
import typeTestingConfig from './configs/typeTesting.js';
import logicalPropertiesConfig from './configs/logicalProperties.js';

export { compileConfigFilesConfig } from './configs/root.js';
export { logConfigs } from './utils/logConfigs.js';

const finalConfig = [
  ...jsConfig,
  ...tsConfig,
  ...jsxConfig,
  ...moduleConfig,
  ...rootConfigsConfig,
  ...jestConfig,
  ...unicornConfig,
  ...storybookConfig,
  ...typeTestingConfig,
  ...logicalPropertiesConfig,
] as const satisfies Config[];

logConfigs(finalConfig);
export default finalConfig;
export type * from './types.js';
