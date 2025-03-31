/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { merge as deepMerge } from 'ts-deepmerge';
import { createStylesheet } from '@sabinmarcu/stylesheet';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { config } from './config.js';
import { theme } from './contract.js';
import { defaultOptions } from './defaults.js';

export namespace global {

  export const __storybook_theme_overrider_updater__: () => void = () => {};
}

export const updaterRender = () => {
  const localConfig = config.config;
  const updateOptions = deepMerge(defaultOptions, localConfig) as any;
  const variables = assignInlineVars(theme as any, updateOptions as any);
  const Stylesheet = createStylesheet({
    debugId: 'theme-overrider',
    rules: [
      {
        selector: ':root',
        rules: variables,
      },
    ],
  });
  return Stylesheet.raw;
};
