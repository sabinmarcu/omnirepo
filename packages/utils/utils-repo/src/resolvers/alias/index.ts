import { resolver as getAliasesNames } from './names';
import { resolver as getAliasesMap } from './map';

export { resolver as getAliasesNames } from './names';
export { resolver as getAliasesMap } from './map';

export const getAliases = {
  names: getAliasesNames,
  map: getAliasesMap,
};
