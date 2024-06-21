import logicalPropertiesPlugin from 'eslint-plugin-logical-properties';
import type { Config } from '../types.js';

const logicalPropertiesConfig = [
  logicalPropertiesPlugin.configs.recommended,
] as const satisfies Config[];

export default logicalPropertiesConfig;
