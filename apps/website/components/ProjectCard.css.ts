import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { iconSize } from './Icon.css';
import type { ProjectStatus } from '@/models/ProjectResource';

export const projectCardStyle = recipe({
  variants: {
    status: {
      active: {},
      deprecated: {
        opacity: 0.5,
      },
      archived: {
        opacity: 0.5,
      },
      planned: {},
      wip: {},
    } satisfies { [key in ProjectStatus]?: Parameters<typeof recipe>[0]['base'] },
  },
});

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
  opacity: 0.5,
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

export const projectCardSectionStyle = style({
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

globalStyle(`${projectCardSectionStyle} + ${projectCardSectionStyle}`, {
  borderBlockStart: 'none',
  marginBlockStart: 0,
});
globalStyle(`${projectCardSectionStyle}:has(+ ${projectCardSectionStyle})`, {
  marginBlockEnd: 0,
});

export const projectCardTagsListStyle = style([
  projectCardSectionStyle,
  {
    borderBlockEnd: 'none',
    marginBlockEnd: 0,
    paddingBlock: theme.grid.m,
  },
]);
