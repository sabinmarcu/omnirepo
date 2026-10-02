import type { Meta } from '@storybook/react';
import React from 'react';
import {
  themeFamilyDataAttribute,
} from '@sabinmarcu/theme';
import { themes } from '../config/themes.js';
import {
  ThemeShowcase,
} from './theme.stories.component.js';
import {
  swatchSet,
  wrapper,
} from './theme.stories.css.js';
import Swatch from './Swatch.js';

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Theme Family',
  tags: ['autodocs', '!dev'],
  component: ThemeShowcase,
  args: {
    theme: themes.themes.base,
  },
  parameters: {
    controls: {
      disable: true,
      exclude: ['theme'],
    },
  },
};

export const Default = {};

export const ElementLevelFamilyOverride = {
  render: () => (
    <section className={wrapper}>
      {themes.families.map((family) => {
        const dataAttribute = {
          [`data-${themeFamilyDataAttribute}`]: family,
        };
        return (
          <article className={swatchSet} key={family} {...dataAttribute}>
            <h4>{family}</h4>
            <Swatch colors={themes.themes[family].colors.primary} />
          </article>
        );
      })}
    </section>
  ),
};

export default meta;
