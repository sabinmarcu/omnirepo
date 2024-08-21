import unicornPlugin from 'eslint-plugin-unicorn';
import type { Config } from '../types.js';
import unicornRulesConfig from '../rules/unicorn.js';

const unicornConfig = [
  {
    name: 'Unicorn Plugin',
    plugins: {
      unicorn: unicornPlugin,
    },
  },
  ...unicornRulesConfig,
] as const satisfies Config[];

export default unicornConfig;
