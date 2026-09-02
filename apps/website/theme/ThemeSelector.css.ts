import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  theme,
  variantSelector,
} from '@sabinmarcu/website-theme';
import { themeSelectionOrder } from './ThemeSelector.constants';

export const selectionDataAttribute = 'data-selection';

export const themeSelectorStyles = style({
  display: 'grid',
  gridTemplateColumns: `repeat(${themeSelectionOrder.length}, 1fr)`,
  inlineSize: '100%',
  margin: 0,
  padding: '2px',
  borderInlineStart: 0,
  borderInlineEnd: 0,
  borderBlockStart: 0,
  borderBlockEnd: 0,
  borderRadius: '2px',
  background: theme.colors.background.page,
});

export const themeSelectorOptionStyle = style({
  display: 'grid',
  placeItems: 'center',
  inlineSize: '100%',
  blockSize: '100%',
  minBlockSize: '2.5rem',
  paddingInline: theme.grid.s,
  paddingBlock: theme.grid.s,
  borderInlineStart: 0,
  borderInlineEnd: 0,
  borderBlockStart: 0,
  borderBlockEnd: 0,
  background: 'transparent',
  color: theme.colors.background.text,
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      background: theme.colors.background.elevated,
    },
  },
});

for (const selection of themeSelectionOrder) {
  globalStyle(`[${variantSelector}=${selection}] ${themeSelectorOptionStyle}[${selectionDataAttribute}=${selection}]`, {
    background: theme.colors.primary.base,
  });
}
