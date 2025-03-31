import { createGlobalThemeContract } from '@vanilla-extract/css';
import { defaultOptions } from './defaults.js';

const variablesPrefix = ['storybook', 'overrider'].join('-');
export const theme = createGlobalThemeContract(
  defaultOptions,
  (_, paths) => [variablesPrefix, ...paths].join('-'),
);
