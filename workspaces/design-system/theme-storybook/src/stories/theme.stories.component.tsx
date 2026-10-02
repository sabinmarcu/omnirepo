import React, {
  memo,
  useMemo,
} from 'react';
import type { themes } from '../config/themes.js';
import Swatch from './Swatch.js';
import {
  swatchSet,
  wrapper,
} from './theme.stories.css.js';

export const ThemeShowcase = memo(({
  theme,
}: {
  theme: typeof themes.themes.base
}) => {
  const colors = useMemo(() => Object.entries(theme.colors), [theme]);
  return (
    <section className={wrapper}>
      {colors.map(([key, variables]) => (
        <article className={swatchSet} key={key}>
          <h4>{key}</h4>
          <Swatch colors={variables} />
        </article>
      ))}
    </section>
  );
});
