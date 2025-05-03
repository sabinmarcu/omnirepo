import type { Decorator } from '@storybook/react';
import type { PropsWithChildren } from 'react';
import React, {
  memo,
  useEffect,
} from 'react';
import type { Globals } from '@storybook/types';
import {
  rootNode,
  themeFamilyDataAttribute,
} from '@sabinmarcu/theme/constants';
import {
  addons,
  types,
  useGlobals,
} from '@storybook/manager-api';
import { splitToolbar } from '@sabinmarcu/storybook-addon-split-toolbars';
import { themes } from '../config/themes.js';
import type { Extension } from '../types.js';
import { THEME_SELECTOR_GLOBAL_ID } from './themeVariant.js';

const themeSelectionList = themes.families.map((family) => ({
  value: family,
  title: `${family[0].toUpperCase()}${family.slice(1)} Theme`,
})) as {
  value: typeof themes['families'][number],
  title: string,
}[];

export const THEME_FAMILY_GLOBAL_ID = 'themeFamily';
export const THEME_FAMILY_ADDON_ID = `${THEME_FAMILY_GLOBAL_ID}.addon`;
export const THEME_FAMILY_TOOL_ID = `${THEME_FAMILY_GLOBAL_ID}.tool`;

const dataAttribute = `data-${themeFamilyDataAttribute}`;

type ThemeFamilySelectorProps = PropsWithChildren<{
  globals: Globals
}>;
const ThemeFamilySelector = memo(({ globals, children }: ThemeFamilySelectorProps) => {
  useEffect(
    () => {
      const { [THEME_FAMILY_GLOBAL_ID]: selection } = globals;
      const target = document.querySelector(rootNode);
      if (!target) return;
      if (themes.families.includes(selection)) {
        target.setAttribute(dataAttribute, selection);
      } else {
        target.removeAttribute(dataAttribute);
      }
    },
  );
  return children;
});

const ThemeFamilySelectorManager = memo(() => {
  const [globals] = useGlobals();
  return (
    <ThemeFamilySelector globals={globals} />
  );
});

const ThemeFamilySelectorDecorator: Decorator = (StoryFunction, { globals }) => (
  <ThemeFamilySelector globals={globals}>
    <StoryFunction />
  </ThemeFamilySelector>
);

const themeFamilySelectorManager: Extension['manager'] = () => {
  addons.register(THEME_FAMILY_ADDON_ID, () => {
    addons.add(THEME_FAMILY_TOOL_ID, {
      type: types.TOOL,
      title: 'Theme Variant Selector',
      render: ThemeFamilySelectorManager,
    });
  });
};

const themeFamilySelectorToolbar: Extension['preview'] = {
  globalTypes: {
    [THEME_FAMILY_GLOBAL_ID]: splitToolbar({
      id: THEME_SELECTOR_GLOBAL_ID,
      splitToolbar: {
        icon: 'chromatic',
        dynamicTitle: true,
        title: 'Theme Family',
        items: themeSelectionList,
      },
    }),
  },
  initialGlobals: {
    [THEME_FAMILY_GLOBAL_ID]: 'base',
  },
  decorators: [ThemeFamilySelectorDecorator],
};

export const themeFamilySelectorExtension = {
  manager: themeFamilySelectorManager,
  preview: themeFamilySelectorToolbar,
};
