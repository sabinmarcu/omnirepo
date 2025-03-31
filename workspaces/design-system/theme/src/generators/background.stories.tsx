/* eslint-disable import/no-named-as-default */
import type { Meta } from '@storybook/react';
import { backgroundGenerator } from './background.js';
import Swatch from '../storybook/Swatch.js';

const BackgroundShowcase = ({ color }: { color: string }) => {
  const colors = backgroundGenerator(color);
  return (
    <Swatch colors={colors} />
  );
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
