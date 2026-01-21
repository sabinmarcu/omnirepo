import {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css';
import { merge as deepMerge } from 'ts-deepmerge';
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
  prefixValueCache,
} from './prefixCache.js';

export function mapThemeToContract<
  Theme extends ThemeStructureType,
>(theme: Theme): MapThemeToContract<Theme> {
  const result: MapThemeToContract<Theme> = {} as any;
  for (const [key, value] of Object.entries(theme)) {
    if (Array.isArray(value)) {
      // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
      const [contract,,,meta] = value;
      if (!meta?.raw) {
        (result as any)[key] = contract;
      }
    } else {
      (result as any)[key] = mapThemeToContract(value as any);
    }
  }
  return result;
}

export function mapThemeToRaw<
  Theme extends ThemeStructureType,
>(theme: Theme): MapThemeToContract<Theme> {
  const result: MapThemeToContract<Theme> = {} as any;
  for (const [key, value] of Object.entries(theme)) {
    if (Array.isArray(value)) {
      // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
      const [contract,,,meta] = value;
      if (meta?.raw) {
        (result as any)[key] = contract;
      }
    } else {
      const next = mapThemeToRaw(value as any);
      if (Object.keys(next).length > 0) {
        (result as any)[key] = next;
      }
    }
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
>(theme: Theme, family?: string): [
  MapThemeToContract<Theme>,
  UpdaterFunction<MapThemeToUpdateInput<Theme>>,
  Theme,
  MapThemeToContract<Theme>,
] {
  const contracts = extractContracts(theme);
  const contractVariables = mapThemeToContract(theme);
  const contractRaws = mapThemeToRaw(theme);
  const contract = createGlobalThemeContract(
    // @ts-ignore
    contractVariables,
    (_, paths) => ['theme', family, ...paths].filter(Boolean).join('-'),
  ) as any;

  const finalContract = deepMerge(contract, contractRaws);

  const contractValuesCache = prefixValueCache(contractVariables as any);
  const updater: UpdaterFunction<MapThemeToUpdateInput<Theme>> = (
    input,
    selector = rootNode,
    updateFunction = createGlobalTheme,
  ) => {
    const prefixedValues = contractValuesCache(family);

    const localContract = {
      ...contract,
    };
    const localValues = {
      '@layer': themeContractLayer,
      ...prefixedValues,
    };
    updateFunction(selector, localContract, localValues);

    // @ts-ignore
    for (const [,contractUpdater, contractName] of contracts) {
      const { [contractName]: values } = input as any;
      contractUpdater(values, selector, updateFunction, family);
    }
  };

  return [contract, updater, theme, finalContract as typeof contract] as const;
}
