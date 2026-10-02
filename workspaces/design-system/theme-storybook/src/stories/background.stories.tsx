import type { Meta } from '@storybook/react';
import React, { useLayoutEffect } from 'react';
import {
  backgroundStoryRenderer,
  backgroundStoryTheme,
} from './nativeTheme.js';
import Swatch from './Swatch.js';

const BackgroundShowcase = ({ color }: { color: string }) => {
  useLayoutEffect(() => {
    const renderer = backgroundStoryRenderer.mount(document);
    renderer({
      colors: {
        background: color,
      },
    });
  }, [color]);

  return <Swatch colors={backgroundStoryTheme.contract.colors.background} />;
};

const meta: Meta<typeof BackgroundShowcase> = {
  title: 'Palette Generation/Background',
  tags: ['autodocs', '!dev'],
  component: BackgroundShowcase,
};

export const Dark = {
  args: {
    color: '#222',
  },
};

export const Light = {
  args: {
    color: '#e0e0e0',
  },
};

export const Red = {
  args: {
    color: '#f20',
  },
};

export const Azure = {
  args: {
    color: '#0cf',
  },
};

export default meta;
