import type { PropsWithChildren } from 'react';
import {
  memo,
  useEffect,
} from 'react';
import { merge as deepMerge } from 'ts-deepmerge';
import { createStylesheet } from '@sabinmarcu/stylesheet';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { Decorator } from '@storybook/react';
import { config } from './config.js';
import { theme } from './contract.js';
import { defaultOptions } from './defaults.js';

const Stylesheet = createStylesheet({ debugId: 'theme-overrider' });
export const ThemeOverrider = memo(({ children }: PropsWithChildren<{}>) => {
  useEffect(
    () => {
      Stylesheet.legacyRender();
      const localConfig = config.config;
      const updateOptions = deepMerge(defaultOptions, localConfig) as any;
      const variables = assignInlineVars(theme as any, updateOptions as any);
      Stylesheet.update([
        {
          selector: ':root',
          rules: variables,
        },
      ]);
    },
    [],
  );
  return children;
});

export const ThemeOverriderManager = memo(() => (<ThemeOverrider />));

export const ThemeOverriderDecorator: Decorator = (StoryFunction) => (
  <ThemeOverrider><StoryFunction /></ThemeOverrider>
);
