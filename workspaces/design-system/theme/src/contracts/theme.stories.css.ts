import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  setupTheme,
  ThemeMetadataSymbol,
} from './theme.js';
import {
  themeDataAttribute,
  themeFamilyDataAttribute,
} from '../constants.js';

const familyDataAttribute = `data-${themeFamilyDataAttribute}`;
const variantDataAttribute = `data-${themeDataAttribute}`;

const { contract: themeContract } = setupTheme[ThemeMetadataSymbol];

export const swatchSet = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(5cqw, 10cqw) auto',
  selectors: {
    [`&[${familyDataAttribute}]::after`]: {
      gridRow: 2,
      gridColumn: '1/3',
      content: `"[${familyDataAttribute}="attr(${familyDataAttribute})"]"`,
      display: 'grid',
      placeItems: 'end',
      opacity: 0.3,
    },
    [`&[${variantDataAttribute}]::before`]: {
      gridRow: 2,
      gridColumn: '1/3',
      content: `"[${variantDataAttribute}="attr(${variantDataAttribute})"]"`,
      display: 'grid',
      placeItems: 'end',
      opacity: 0.3,
    },
  },
});

globalStyle(`${swatchSet} > *:first-child`, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  textTransform: 'uppercase',
});

export const wrapper = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: themeContract.grid.m,
});
