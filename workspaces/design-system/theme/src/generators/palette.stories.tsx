/* eslint-disable import/no-named-as-default */
import type { Meta } from '@storybook/react';
import Swatch from '../storybook/Swatch.js';
import { paletteGenerator } from './palette.js';

const PaletteShowcase = ({ color }: { color: string }) => {
  const colors = paletteGenerator(color);
  return (
    <Swatch colors={colors} />
  );
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
