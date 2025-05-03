import type { Meta } from '@storybook/react';
import {
  root,
  ThemeShowcase,
} from './theme.stories.component.js';

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Theme',
  tags: ['autodocs', '!dev'],
  component: ThemeShowcase,
  args: {
    theme: root.base,
  },
  parameters: {
    controls: {
      disable: true,
      exclude: ['theme'],
    },
  },
};

export const Default = {};

export default meta;
