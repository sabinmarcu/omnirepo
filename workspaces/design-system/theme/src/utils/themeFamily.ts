import type {
  ArrayTail,
  PartialDeep,
} from '@sabinmarcu/types';
import { merge as deepMerge } from 'ts-deepmerge';
import { createGlobalTheme } from '@vanilla-extract/css';
import type {
  ThemeConfig,
  ThemeMetadataConfig,
} from '../contracts/theme.js';
import {
  createThemeVariant,
  ThemeMetadataSymbol,
} from '../contracts/theme.js';
import { themeContractLayer } from '../styles/layers.constants.js';
import {
  rootNode,
  themeFamilyDataAttribute,
} from '../constants.js';

export const baseKey = 'base';

export type BaseValuesKey = typeof baseKey;
export type ThemeFamilyUpdater<
  Families extends string,
  Input = (
    & { [Key in Families]?: PartialDeep<Parameters<ThemeConfig>[0]> }
    & { [Key in BaseValuesKey]: Parameters<ThemeConfig>[0] }
  ),
> = (
  (input: Input, ...rest: ArrayTail<Parameters<ThemeConfig>>) => ReturnType<ThemeConfig>
);

export type ThemeFamilyPicker<Families extends string> = (
  key: Families | BaseValuesKey,
  ...rest: ArrayTail<Parameters<ThemeConfig>>
) => void;

export type FamilyConfig<Families extends string> = (
  & { pick: ThemeFamilyPicker<Families> }
  & ThemeFamilyUpdater<Families>
  & ThemeMetadataConfig
  & {
    [Key in Families | BaseValuesKey]: ThemeConfig
  }
  & {
    families: (Families | BaseValuesKey)[],
  }
);

export function selectorOfFamily<Families extends string>(family: Families) {
  return `[data-${themeFamilyDataAttribute}="${family}"]`;
}

export const createThemeFamily = <
  const Families extends string,
>(
    ...families: Families[]
  ) => {
  const rootUpdater = createThemeVariant(undefined as any);
  const baseUpdater = createThemeVariant(baseKey);
  const familyUpdaters: Record<Families, ReturnType<typeof createThemeVariant>> = {} as any;
  for (const family of families) {
    familyUpdaters[family] = createThemeVariant(family);
  }

  const picker: ThemeFamilyPicker<Families> = (
    family,
    selector = rootNode,
    updateFunction = createGlobalTheme,
  ) => {
    const values = families.includes(family as any)
      ? familyUpdaters[family as Families][ThemeMetadataSymbol].contract
      : baseUpdater[ThemeMetadataSymbol].contract;
    const { contract } = rootUpdater[ThemeMetadataSymbol];

    updateFunction(selector, {
      '@layer': themeContractLayer,
      ...contract,
    } as any, {
      '@layer': themeContractLayer,
      ...values,
    });
  };

  const updaterRaw: ThemeFamilyUpdater<Families> = (input, selector, updateFunction) => {
    const { base: baseInput, ...familiesInput } = input;
    baseUpdater(baseInput, selector, updateFunction);
    picker('base', selectorOfFamily('base'), updateFunction);
    for (const family of families) {
      const { [family]: partialInput } = familiesInput;
      const mergedInput = deepMerge(baseInput, partialInput ?? {});
      picker(family, selectorOfFamily(family), updateFunction);
      familyUpdaters[family](mergedInput as any, selector, updateFunction);
    }
  };

  const updater: FamilyConfig<Families> = updaterRaw as any;

  updater.pick = picker;
  updater.base = baseUpdater;
  for (const family of families) {
    (updater as any)[family] = familyUpdaters[family];
  }

  updater[ThemeMetadataSymbol] = rootUpdater[ThemeMetadataSymbol];
  updater.families = [baseKey, ...families];

  return updater;
};
