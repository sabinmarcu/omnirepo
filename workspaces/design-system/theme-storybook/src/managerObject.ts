import { deepmerge as deepMerge } from 'deepmerge-ts';
import type { StorybookConfig } from '@storybook/react-vite';
import { extensions } from './extensions/index.js';
import type { Extension } from './types.js';

const managerObjects: Extension['managerObject'][] = [];
for (const extension of extensions) {
  if ('managerObject' in extension) {
    managerObjects.push(extension.managerObject);
  }
}

export const withManager = (input: StorybookConfig) => (
  deepMerge(input, ...managerObjects)
);
