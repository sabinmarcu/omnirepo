import {
  breakpointGenerator,
  extendTheme,
} from '@sabinmarcu/theme-core';
import { createThemeFamily } from '@sabinmarcu/theme-family';
import {
  themeDefinition as concreteThemeDefinition,
  themeContractLayer,
  themeValuesLayer,
  themeVariantsLayer,
} from '@sabinmarcu/theme';

export const themeDefinition = extendTheme(concreteThemeDefinition, {
  breakpoint: breakpointGenerator([
    ['mobile', 700],
    ['tablet', 1000],
    ['screen', 1200],
    ['large', 1980],
    ['huge', 3000],
  ]),
});

export const theme = themeDefinition.contract;

export const themes = createThemeFamily(themeDefinition, {
  id: 'theme-runtime',
  debugId: 'themeValues',
  families: [
    'red',
    'green',
    'blue',
    'personal',
    'projects',
    'articles',
    'ramblings',
    'snippets',
    'neutral',
  ],
  layer: themeValuesLayer,
  mappingLayer: themeContractLayer,
  variantLayer: themeVariantsLayer,
});
