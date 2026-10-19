import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const contentCardHeaderStyle = style({
  position: 'relative',
});

export const contentCardTitleStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  gap: theme.grid.s,
  paddingInlineEnd: `calc(${theme.grid.m} * 3)`,
  lineHeight: 0.8,
  marginBlockStart: theme.grid.s,
  marginBlockEnd: theme.grid.m,
});

export const contentCardMetaStyle = style({
  color: theme.colors.background.text,
  opacity: 0.7,
  paddingInline: theme.grid.m,
});

export const contentCardUpdatedStyle = style({
  color: theme.colors.background.text,
  fontSize: theme.grid.m,
  marginBlock: 0,
  opacity: 0.5,
  flex: '100%',
});

export const contentCardKindStyle = style({
  display: 'inline-block',
  fontSize: theme.grid.m,
  borderInlineStart: `1px solid ${theme.colors.primary.muted}`,
  borderInlineEnd: `1px solid ${theme.colors.primary.muted}`,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  borderStartStartRadius: '999px',
  borderStartEndRadius: '999px',
  borderEndEndRadius: '999px',
  borderEndStartRadius: '999px',
  background: `color-mix(in hsl, ${theme.colors.primary.muted} 15%, transparent)`,
  paddingBlock: theme.grid.xs,
  paddingInline: theme.grid.s,
});

export const contentCardSectionStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  flex: '100%',
  gap: theme.grid.s,
  color: theme.colors.background.text,
  opacity: 0.7,
  fontSize: theme.grid.m,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  borderBlockEnd: `1px solid ${theme.colors.primary.muted}`,
  marginBlock: theme.grid.s,
  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
});

globalStyle(`${contentCardSectionStyle} + ${contentCardSectionStyle}`, {
  borderBlockStart: 'none',
  marginBlockStart: 0,
});
globalStyle(`${contentCardSectionStyle}:has(+ ${contentCardSectionStyle})`, {
  marginBlockEnd: 0,
});

export const contentCardTagsListStyle = style([
  contentCardSectionStyle,
  {
    gap: theme.grid.m,
    borderBlockEnd: 'none',
    marginBlockEnd: 0,
    paddingBlock: theme.grid.m,
  },
]);
