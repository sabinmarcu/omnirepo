import debug from 'debug';
import type { Config } from '../types.js';
import { getLogger } from './debug.js';

export const logConfigs = (
  configs: Config[],
  name = getLogger('root').log.namespace,
) => {
  const configsLoaded = configs.map((config) => config.name);
  debug(name)(`Loaded configs: ${configsLoaded.join(', ')}`);
};
