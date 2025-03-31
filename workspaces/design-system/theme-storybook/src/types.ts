import type { Preview } from '@storybook/react';

export type Extension = {
  manager?: () => void;
  preview?: Preview,
};
