import type {
  Config,
} from './types';

import parserConfig from './configs/parser';
import jsConfig from './configs/js';
import tsConfig from './configs/ts';
import rootConfigsConfig from './configs/config.root';
import jestConfigsConfig from './configs/config.jest';
import moduleConfig from './configs/module';
import storybookConfig from './configs/storybook';
import unicornConfig from './configs/unicorn';
import typeTestingConfig from './configs/typeTesting';
import canonicalConfig from './configs/canonical';

const hasParser = parserConfig.length > 0;

if (!hasParser) {
  console.error('No parser installed, will not be loading config!');
}

const config: Config[] = hasParser
  ? [
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
  ] as const satisfies Config[]
  : [] satisfies Config[];

export default config;
