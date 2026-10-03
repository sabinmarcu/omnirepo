import themeOverride from '@sabinmarcu/storybook-addon-theme-overrider';
import mirrorPreview from '@sabinmarcu/storybook-addon-mirror-preview';
import {
  theme,
  themeResetCSS,
} from '@sabinmarcu/theme';
import type { StorybookConfig } from '@storybook/react-vite';
import type { Extension } from '../types.js';

themeOverride.config = {
  pageBackground: theme.colors.background.page,
  baseBackground: theme.colors.background.surface,
  secondaryBackground: theme.colors.background.depressed,
  border: theme.colors.background.elevated,
  color: theme.colors.background.text,
};

mirrorPreview.config = [
  {
    selector: '[data-stylesheet="themeValues"]',
    id: 'data-stylesheet',
  },
];

const resetStyle = `<style data-stylesheet="themeReset">${themeResetCSS}</style>`;

const previewHead: StorybookConfig['previewHead'] = (
  (head: string | undefined) => themeOverride.preview(`${resetStyle}${head ?? ''}`)
);
const managerHead: StorybookConfig['managerHead'] = (
  (head) => (
    mirrorPreview.manager(themeOverride.manager(`${resetStyle}${head ?? ''}`))
  )
);
export const themeConfigExtension = {
  managerObject: {
    previewHead,
    managerHead,
  },
} satisfies Extension;
