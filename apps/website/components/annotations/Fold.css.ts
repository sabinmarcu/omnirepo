import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const foldStyle = style({
  display: 'inline',
});

export const foldToggleStyle = style({
  position: 'absolute',
  inlineSize: '1px',
  blockSize: '1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

export const foldSummaryStyle = style({
  display: 'inline-block',
  cursor: 'pointer',
  font: 'inherit',
  lineHeight: 'inherit',
  color: 'inherit',
  background: `color-mix(in hsl, ${theme.colors.primary.muted} 16%, transparent)`,
  borderInlineStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderInlineEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockStart: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderBlockEnd: `1px solid color-mix(in hsl, ${theme.colors.primary.muted} 45%, transparent)`,
  borderRadius: '2px',
  paddingBlock: 0,
  paddingInline: theme.grid.xs,
  selectors: {
    '&:hover': {
      background: `color-mix(in hsl, ${theme.colors.primary.muted} 30%, transparent)`,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.primary.base}`,
      outlineOffset: '2px',
    },
  },
});

export const foldContentStyle = style({
  display: 'none',
});

globalStyle(`${foldToggleStyle}:checked ~ ${foldSummaryStyle}`, {
  display: 'none',
});

globalStyle(`${foldToggleStyle}:checked ~ ${foldContentStyle}`, {
  display: 'inline',
});

globalStyle(`${foldToggleStyle}:focus-visible ~ ${foldSummaryStyle}`, {
  outline: `2px solid ${theme.colors.primary.base}`,
  outlineOffset: '2px',
});
