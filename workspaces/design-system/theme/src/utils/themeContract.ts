import {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css';
import type {
  ExtractContractsFromThemeStructure,
  MapThemeToContract,
  MapThemeToUpdateInput,
  ThemeStructureType,
} from './themeContract.type.js';
import type { UpdaterFunction } from './types.js';
import { rootNode } from '../constants.js';
import { themeContractLayer } from '../styles/layers.js';
import {
  prefixCache,
  prefixValueCache,
} from './prefixCache.js';

export function mapThemeToContract<
  Theme extends ThemeStructureType,
>(theme: Theme): MapThemeToContract<Theme> {
  const result: MapThemeToContract<Theme> = {} as any;
  for (const [key, value] of Object.entries(theme)) {
    (result as any)[key] = Array.isArray(value)
      ? value[0]
      : mapThemeToContract(value as any);
  }
  return result;
}

export function extractContracts<
  Theme extends ThemeStructureType,
>(theme: Theme): ExtractContractsFromThemeStructure<Theme> {
  const result = [];
  for (const value of Object.values(theme)) {
    if (Array.isArray(value)) {
      result.push(value as any);
    } else {
      result.push(...extractContracts(value as any));
    }
  }
  return result as ExtractContractsFromThemeStructure<Theme>;
}

export function createThemeContract<
  Theme extends ThemeStructureType,
>(theme: Theme, variant?: string): [
  MapThemeToContract<Theme>,
  UpdaterFunction<MapThemeToUpdateInput<Theme>>,
  Theme,
] {
  const contracts = extractContracts(theme);
  const contractVariables = mapThemeToContract(theme);
  const contract = createGlobalThemeContract(
    // @ts-ignore
    contractVariables,
    (_, paths) => ['theme', ...paths].join('-'),
  ) as any;

  const contractCache = prefixCache(contract);
  const contractValuesCache = prefixValueCache(contractVariables as any);
  const updater: UpdaterFunction<MapThemeToUpdateInput<Theme>> = (
    input,
    selector = rootNode,
    updateFunction = createGlobalTheme,
  ) => {
    const prefixedContract = contractCache(variant);
    const prefixedValues = contractValuesCache(variant);

    updateFunction(selector, {
      '@layer': themeContractLayer,
      ...prefixedContract,
    }, {
      '@layer': themeContractLayer,
      ...prefixedValues,
    });
    // @ts-ignore
    for (const [,contractUpdater, contractName] of contracts) {
      const { [contractName]: values } = input as any;
      contractUpdater(values, selector, updateFunction, variant);
    }
  };

  return [contract, updater, theme] as const;
}
