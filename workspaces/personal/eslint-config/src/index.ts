import type {
  Config,
} from './types.js';

import parserConfig from './configs/parser.js';
import jsConfig from './configs/js.js';
import tsConfig from './configs/ts.js';
import rootConfigsConfig from './configs/config.root.js';
import jestConfigsConfig from './configs/config.jest.js';
import moduleConfig from './configs/module.js';
import storybookConfig from './configs/storybook.js';
import unicornConfig from './configs/unicorn.js';
import typeTestingConfig from './configs/typeTesting.js';
import canonicalConfig from './configs/canonical.js';
import importConfig from './configs/import.js';

const config: Config[] = [
  ...parserConfig,
  ...jsConfig,
  ...tsConfig,
  ...rootConfigsConfig,
  ...jestConfigsConfig,
  ...moduleConfig,
  ...storybookConfig,
  ...unicornConfig,
  ...typeTestingConfig,
  ...canonicalConfig,
  ...importConfig,
] as const satisfies Config[];

export default config;
