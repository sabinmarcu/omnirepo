import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import {
  experienceItemStyles,
  grids,
} from './Experience.item.css';

export const experienceListStyles = style({
  display: 'flex',
  flexFlow: 'column nowrap',
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}`, {
  paddingBlock: theme.grid.l,
  borderBlockEnd: `dashed 2px ${theme.colors.background.elevated}`,
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}:first-of-type`, {
  paddingBlockStart: 0,
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}:last-of-type`, {
  borderBlockEnd: 'none',
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}:has(> [data-grid=${grids.content}]:empty)`, {
  borderBlockEnd: 'none',
  paddingBlockEnd: 0,
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}:has(> [data-grid=${grids.content}]:empty) + ${experienceItemStyles}`, {
  paddingBlockStart: 0,
});

globalStyle(`${experienceListStyles} ${experienceItemStyles}:has(> [data-grid=${grids.content}]:empty) + ${experienceItemStyles} [data-grid=${grids.title}] span:last-of-type:not(:only-child)`, {
  display: 'none',
});
