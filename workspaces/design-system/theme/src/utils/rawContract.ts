import {
  createGlobalTheme,
  createGlobalThemeContract,
} from '@vanilla-extract/css';
import type {
  ThemeGenerator,
  TypeOfThemeGenerator,
} from '../generators/types.js';
import { themeValuesLayer } from '../styles/layers.js';
import type { UpdaterFunction } from './types.js';
import { rootNode } from '../constants.js';
import { prefixCache } from './prefixCache.js';

export function rawContract<
  const Generator extends ThemeGenerator<any>,
  const Prefix extends string = '',
>(
  generator: Generator,
  prefix: Prefix,
  defaultValue: TypeOfThemeGenerator<Generator> = '#ffff' as any,
) {
  const raw = generator(defaultValue);
  const contract = createGlobalThemeContract<ReturnType<typeof generator>>(
    raw as any,
    (_, path) => [prefix, ...path].join('-'),
  );

  const contractCache = prefixCache(contract);
  const update: UpdaterFunction<TypeOfThemeGenerator<Generator>> = (
    input,
    selector = rootNode,
    updateFunction = createGlobalTheme,
    family?: string,
  ) => {
    const values = generator(input);
    const prefixedContract = contractCache(family);
    updateFunction(selector, {
      '@layer': themeValuesLayer,
      ...prefixedContract,
    }, {
      '@layer': themeValuesLayer,
      ...values,
    } as any);
  };
  return [contract, update, prefix] as const;
}

