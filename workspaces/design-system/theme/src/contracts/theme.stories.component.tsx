/* eslint-disable import/no-named-as-default */
import {
  memo,
  useMemo,
} from 'react';
import Swatch from '../storybook/Swatch.js';
import {
  swatchSet,
  wrapper,
} from './theme.stories.css.js';
import { createThemeFamily } from '../family.js';
import { ThemeMetadataSymbol } from './theme.js';

export const root = createThemeFamily('does', 'not', 'matter');

export const ThemeShowcase = memo(({
  theme,
}: {
  theme: typeof root['base']
}) => {
  const contract = useMemo(
    () => theme[ThemeMetadataSymbol].contract,
    [theme],
  );
  return (
    <section className={wrapper}>
      {Object.entries(contract.colors).map(([key, variables]) => (
        <article className={swatchSet} key={key}>
          <h4>{key}</h4>
          <Swatch colors={variables} />
        </article>
      ))}
    </section>
  );
});
