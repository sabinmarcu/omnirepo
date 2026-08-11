import {
  rootNode,
  themeVariants,
  themeDataAttribute,
} from '@sabinmarcu/theme/constants';
import {
  splitToolbar,
} from '@sabinmarcu/storybook-addon-split-toolbars';
import {
  addons,
  types,
  useGlobals,
} from '@storybook/manager-api';
import type { Globals } from 'storybook/internal/types';
import type { Decorator } from '@storybook/react';
import type { PropsWithChildren } from 'react';
import React, {
  memo,
  useEffect,
} from 'react';
import type { Extension } from '../types.js';

const themeSelectionList = [
  {
    value: 'system',
    title: 'System Determined',
    icon: 'chromatic',
  },
  {
    value: 'light',
    title: 'Light Theme',
    icon: 'circlehollow',
  },
  {
    value: 'dark',
    title: 'Dark Theme',
    icon: 'circle',
  },
] as const satisfies {
  value: typeof themeVariants[number] | 'system',
  title: string,
  icon: string,
}[];

export const THEME_SELECTOR_GLOBAL_ID = 'themeVariant';
export const THEME_SELECTOR_ADDON_ID = `${THEME_SELECTOR_GLOBAL_ID}.addon`;
export const THEME_SELECTOR_TOOL_ID = `${THEME_SELECTOR_GLOBAL_ID}.tool`;

const dataAttribute = `data-${themeDataAttribute}`;

type ThemeSelectorProps = PropsWithChildren<{
  globals: Globals
}>;
const ThemeSelector = memo(({ globals, children }: ThemeSelectorProps) => {
  useEffect(
    () => {
      const selection = globals[THEME_SELECTOR_GLOBAL_ID];
      const target = document.querySelector(rootNode);
      if (!target) return;
      // The attribute value identifies the selected theme, so it is not boolean.
      /* eslint-disable unicorn/prefer-toggle-attribute */
      if (themeVariants.includes(selection)) {
        target.setAttribute(dataAttribute, selection);
      } else {
        target.removeAttribute(dataAttribute);
      }
      /* eslint-enable unicorn/prefer-toggle-attribute */
    },
  );
  return children;
});

const ThemeSelectorManager = memo(() => {
  const [globals] = useGlobals();
  return (
    <ThemeSelector globals={globals} />
  );
});

const ThemeSelectorDecorator: Decorator = (StoryFunction, { globals }) => (
  <ThemeSelector globals={globals}>
    <StoryFunction />
  </ThemeSelector>
);

const themeSelectorManager: Extension['manager'] = () => {
  addons.register(THEME_SELECTOR_ADDON_ID, () => {
    addons.add(THEME_SELECTOR_TOOL_ID, {
      type: types.TOOL,
      title: 'Theme Variant Selector',
      render: ThemeSelectorManager,
    });
  });
};

const themeSelectorToolbar: Extension['preview'] = {
  globalTypes: {
    [THEME_SELECTOR_GLOBAL_ID]: splitToolbar({
      id: THEME_SELECTOR_GLOBAL_ID,
      splitToolbar: {
        icon: 'chromatic',
        dynamicTitle: true,
        title: 'Theme Variant',
        items: themeSelectionList,
      },
    }),
  },
  initialGlobals: {
    [THEME_SELECTOR_GLOBAL_ID]: 'system',
  },
  decorators: [
    ThemeSelectorDecorator,
  ],
};

export const themeSelectorExtension = {
  manager: themeSelectorManager,
  preview: themeSelectorToolbar,
} satisfies Extension;
