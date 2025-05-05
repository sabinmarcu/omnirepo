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
import type { Extension } from '../types.js';
import { THEME_SELECTOR_GLOBAL_ID } from './themeVariant.js';
import { themeMapping } from './themeFamily.data.js';

export const THEME_FAMILY_GLOBAL_ID = 'themeFamily';
export const THEME_FAMILY_ADDON_ID = `${THEME_FAMILY_GLOBAL_ID}.addon`;
export const THEME_FAMILY_TOOL_ID = `${THEME_FAMILY_GLOBAL_ID}.tool`;

const dataAttribute = `data-${themeFamilyDataAttribute}`;

const mappingGroups = Object.keys(themeMapping);
const isValidMapping = (input: string): input is keyof typeof themeMapping => (
  mappingGroups.includes(input)
);

type ThemeFamilySelectorProps = PropsWithChildren<{
  globals: Globals
}>;
const ThemeFamilySelector = memo(({ globals, children }: ThemeFamilySelectorProps) => {
  useEffect(
    () => {
      const { [THEME_FAMILY_GLOBAL_ID]: selection } = globals;
      if (!selection) return;
      const [group, theme] = selection.split(':');
      const target = document.querySelector(rootNode);
      if (!target) return;
      if (
        isValidMapping(group)
        && themeMapping[group].list.some(({ value }: any) => value === theme)
      ) {
        target.setAttribute(dataAttribute, theme);
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
        items: themeMapping,
      },
    }),
  },
  initialGlobals: {
    [THEME_FAMILY_GLOBAL_ID]: 'playground:base',
  },
  decorators: [ThemeFamilySelectorDecorator],
};

export const themeFamilySelectorExtension = {
  manager: themeFamilySelectorManager,
  preview: themeFamilySelectorToolbar,
};
