import { resolver as getAliasesNames } from './names.js';
import { resolver as getAliasesMap } from './map.js';

export { resolver as getAliasesNames } from './names.js';
export { resolver as getAliasesMap } from './map.js';

export const getAliases = {
  names: getAliasesNames,
  map: getAliasesMap,
};
