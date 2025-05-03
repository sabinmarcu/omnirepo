import type { PartialDeep } from '@sabinmarcu/types';
import type { Preview } from '@storybook/react';
import type { StorybookConfig } from '@storybook/react-vite';

export type Extension = {
  manager?: () => void;
  preview?: Preview,
  managerObject?: PartialDeep<StorybookConfig>,
};
