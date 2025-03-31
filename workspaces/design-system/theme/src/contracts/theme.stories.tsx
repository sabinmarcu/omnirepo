/* eslint-disable import/no-named-as-default */
import type { Meta } from '@storybook/react';
import Swatch from '../storybook/Swatch.js';
import {
  swatchSet,
  wrapper,
} from './theme.stories.css.js';
import {
  themeRaw,
} from './theme.js';
import { extractContracts } from '../utils/themeContract.js';

const ThemeShowcase = () => {
  const contracts = extractContracts(themeRaw);
  return (
    <section className={wrapper}>
      {contracts.map(([contract,,key]) => (
        <article className={swatchSet} key={key}>
          <h4>{key}</h4>
          <Swatch colors={contract} />
        </article>
      ))}
    </section>
  );
};

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Theme',
  tags: ['autodocs', '!dev'],
  component: ThemeShowcase,
};

export const Default = {};

export default meta;
