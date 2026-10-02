import type { Meta } from '@storybook/react';
import React, { useLayoutEffect } from 'react';
import {
  paletteStoryRenderer,
  paletteStoryTheme,
} from './nativeTheme.js';
import Swatch from './Swatch.js';

const PaletteShowcase = ({ color }: { color: string }) => {
  useLayoutEffect(() => {
    const renderer = paletteStoryRenderer.mount(document);
    renderer({
      colors: {
        palette: color,
      },
    });
  }, [color]);

  return <Swatch colors={paletteStoryTheme.contract.colors.palette} />;
};

const meta: Meta<typeof PaletteShowcase> = {
  title: 'Palette Generation/Palette',
  tags: ['autodocs', '!dev'],
  args: {
    color: '#0cf',
  },
  component: PaletteShowcase,
};

export const Azure = {
  args: {
    color: '#0cf',
  },
};

export const Red = {
  args: {
    color: '#f20',
  },
};

export const Yellow = {
  args: {
    color: '#fc0',
  },
};

export const Green = {
  args: {
    color: '#0f2',
  },
};

export default meta;
