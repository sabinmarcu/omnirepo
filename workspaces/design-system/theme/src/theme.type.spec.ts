import {
  assignVars,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { createThemeSetup } from '@sabinmarcu/theme-core';
import {
  theme,
  themeDefinition,
} from './index.js';

const primary: 'var(--theme-colors-primary-base)' = theme.colors.primary.base;
const background: 'var(--theme-colors-background-page)' = theme.colors.background.page;
const spacing: 'var(--theme-grid-m)' = theme.grid.m;
const consumer = style({
  color: fallbackVar(primary, 'black'),
  padding: spacing,
});
const variables = assignVars(theme.colors.primary, {
  base: 'red',
  contrast: 'white',
  muted: 'pink',
  emphasis: 'darkred',
});
const inline = assignInlineVars(theme.grid, {
  m: '1rem',
  s: '0.5rem',
  l: '1.5rem',
  xs: '0.25rem',
  xl: '2rem',
  xxs: '0.125rem',
  xxl: '2.5rem',
});
const setup = createThemeSetup(themeDefinition, { id: 'typed-concrete' });
const returned = setup({
  colors: { primary: { light: 'red' } },
  grid: 16,
});
const stable: typeof theme = returned;
// @ts-expect-error Concrete shared tokens no longer contain application breakpoints.
const sharedBreakpoint = theme.breakpoint;
// @ts-expect-error Generated palette outputs cannot enter source updates.
setup.update({ colors: { primary: { contrast: 'white' } } });
// @ts-expect-error Breakpoints are not mutable setup inputs.
setup.update({ breakpoint: { mobile: 700 } });

export const concreteAssertions = {
  primary,
  background,
  spacing,
  consumer,
  variables,
  inline,
  stable,
  sharedBreakpoint,
};
