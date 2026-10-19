import { theme } from '@sabinmarcu/website-theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import {
  navigationBorderColor,
  navigationBorderRadius,
  navigationBorderSize,
  navigationSpacing,
} from '@/layouts/Navigation.css';

export const searchEntrypointStyle = style({
  position: 'relative',
  display: 'flex',
  alignSelf: 'stretch',
  minInlineSize: '10rem',
});

export const searchEntrypointFieldStyle = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  minInlineSize: 0,
  background: theme.colors.background.page,
  color: theme.colors.background.text,
});

export const searchEntrypointIconStyle = style({
  display: 'flex',
  paddingInlineStart: `calc(${navigationSpacing} * 1.5)`,
  pointerEvents: 'none',
});

export const searchEntrypointInputStyle = style({
  flex: 1,
  minInlineSize: 0,
  blockSize: '100%',
  paddingBlock: `calc(${navigationSpacing} * 0.75)`,
  paddingInlineStart: navigationSpacing,
  paddingInlineEnd: `calc(${navigationSpacing} * 7)`,
  borderInlineStart: 0,
  borderInlineEnd: 0,
  borderBlockStart: 0,
  borderBlockEnd: 0,
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  outline: 0,
  '@media': {
    '(pointer: coarse) and (hover: none)': {
      paddingInlineEnd: `calc(${navigationSpacing} * 2)`,
    },
  },
});

export const searchEntrypointShortcutStyle = style({
  position: 'absolute',
  insetInlineEnd: navigationSpacing,
  insetBlockStart: '50%',
  translate: '0 -50%',
  paddingBlock: `calc(${navigationSpacing} * 0.25)`,
  paddingInline: `calc(${navigationSpacing} * 0.75)`,
  borderInlineStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderInlineEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderRadius: '999px',
  background: theme.colors.background.surface,
  color: theme.colors.primary.muted,
  fontSize: '0.7em',
  lineHeight: 1.2,
  pointerEvents: 'none',
  '@media': {
    '(pointer: coarse) and (hover: none)': {
      display: 'none',
    },
  },
});

globalStyle(`${searchEntrypointStyle}[data-focused="true"] ${searchEntrypointShortcutStyle}`, {
  opacity: 0,
  visibility: 'hidden',
});

export const searchEntrypointResultsStyle = style({
  gridColumn: '1 / -1',
  position: 'absolute',
  insetBlockStart: `calc(100% + ${navigationSpacing})`,
  insetInline: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  maxBlockSize: 'min(22rem, 60vh)',
  margin: 0,
  padding: navigationSpacing,
  overflow: 'auto',
  borderInlineStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderInlineEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockStart: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderBlockEnd: `${navigationBorderSize} solid ${navigationBorderColor}`,
  borderRadius: navigationBorderRadius,
  background: theme.colors.background.surface,
  boxShadow: `0 ${navigationSpacing} calc(${navigationSpacing} * 2) color-mix(in hsl, ${theme.colors.background.page} 60%, transparent)`,
  listStyle: 'none',
});

globalStyle(`${searchEntrypointResultsStyle} > *`, {
  maxInlineSize: '100%',
});

globalStyle(`${searchEntrypointIconStyle} svg`, {
  inlineSize: '1em',
  blockSize: '1em',
});
