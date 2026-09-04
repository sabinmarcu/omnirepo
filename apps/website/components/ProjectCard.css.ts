import { theme } from '@sabinmarcu/theme';
import { style } from '@vanilla-extract/css';
import { iconSize } from './Icon.css';

export const projectCardHeaderStyle = style({
  position: 'relative',
});

export const projectCardTitleStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  alignItems: 'center',
  gap: theme.grid.s,
  paddingInlineEnd: `calc(${theme.grid.m} * 3)`,
  lineHeight: 0.8,
  marginBlockStart: theme.grid.s,
  marginBlockEnd: theme.grid.m,
});

export const projectCardStatusStyle = style({
  color: theme.colors.success.base,
  insetBlockStart: theme.grid.m,
  insetInlineEnd: theme.grid.m,
  position: 'absolute',
  vars: {
    [iconSize]: `calc(${theme.grid.m} * 1.5)`,
  },
});

export const projectCardRepoStyle = style({
  color: theme.colors.background.text,
  insetBlockStart: theme.grid.m,
  insetInlineEnd: `calc(${theme.grid.m} * 3)`,
  position: 'absolute',
  vars: {
    [iconSize]: `calc(${theme.grid.m} * 1.25)`,
  },
});

export const projectCardMetaStyle = style({
  color: theme.colors.background.text,
  opacity: 0.7,
  paddingInline: theme.grid.m,
});

export const projectCardUpdatedStyle = style({
  color: theme.colors.background.text,
  fontSize: theme.grid.m,
  marginBlock: 0,
  opacity: 0.3,
  flex: '100%',
});

export const projectCardKindStyle = style({
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

export const projectCardTagsStyle = style({
  display: 'flex',
  flexFlow: 'row wrap',
  gap: theme.grid.s,
  color: theme.colors.background.text,
  opacity: 0.7,
  borderBlockStart: `1px solid ${theme.colors.primary.muted}`,
  marginBlockStart: theme.grid.s,
  paddingBlock: theme.grid.m,
  paddingInline: theme.grid.m,
});
