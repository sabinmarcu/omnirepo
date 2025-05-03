/* eslint-disable unicorn/prevent-abbreviations */
import { createStylesheet } from '@sabinmarcu/stylesheet';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { rootNode } from '../constants.js';
import {
  setupTheme,
} from './theme.js';
import type {
  FamilyConfig,
  ThemeFamilyUpdater,
} from '../utils/themeFamily.js';

export const ThemeStylesheet = createStylesheet({
  debugId: 'themeValues',
  rules: [
    {
      selector: rootNode,
    },
  ],
});

type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
type Contract = {
  [key: string]: CSSVarFunction | null | Contract;
};
type Primitive = string | boolean | number | null | undefined;
type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, any>
      ? MapLeafNodes<Obj[Prop], LeafType>
      : never;
};

const updateThemeRuntimeFunction = (<ThemeContract extends Contract>(
  selector: string,
  contract: ThemeContract,
  values: MapLeafNodes<ThemeContract, string>,
) => {
  const { '@layer': layer, ...rules } = values;
  const { '@layer': ignore, ...contractWithoutLayer } = contract;
  const vars = assignInlineVars(contractWithoutLayer as any, rules as any);
  ThemeStylesheet.update([
    {
      selector,
      layer: layer as string,
      rules: vars,
    },
  ]);
});

export const updateThemeRuntime = (
  input: Parameters<typeof setupTheme>[0],
  selector?: Parameters<typeof setupTheme>[1],
  themeUpdater = setupTheme,
) => {
  themeUpdater(input, selector, updateThemeRuntimeFunction as any);
};

export const setupThemeRuntime = (
  input: Parameters<typeof setupTheme>[0],
  selector?: Parameters<typeof setupTheme>[1],
  themeUpdater = setupTheme,
) => {
  ThemeStylesheet.legacyRender(document);
  updateThemeRuntime(input, selector, themeUpdater);
};

export const updateThemeFamilyRuntime = <
  Families extends string,
>(
    themeFamily: FamilyConfig<Families>,
    input: Parameters<ThemeFamilyUpdater<Families>>[0],
    selector?: Parameters<ThemeFamilyUpdater<Families>>[1],
  ) => {
  themeFamily(input, selector, updateThemeRuntimeFunction as any);
};

export const setupThemeFamilyRuntime = <
  Families extends string,
>(
    themeFamily: FamilyConfig<Families>,
    input: Parameters<ThemeFamilyUpdater<Families>>[0],
    selector?: Parameters<ThemeFamilyUpdater<Families>>[1],
  ) => {
  ThemeStylesheet.legacyRender(document);
  updateThemeFamilyRuntime(themeFamily, input, selector);
};

export const pickThemeFamilyRuntime = <
  Families extends string,
>(
    themeFamily: FamilyConfig<Families>,
    family: Families,
    selector?: Parameters<ThemeFamilyUpdater<Families>>[1],
  ) => {
  themeFamily.pick(family, selector, updateThemeRuntimeFunction as any);
};
