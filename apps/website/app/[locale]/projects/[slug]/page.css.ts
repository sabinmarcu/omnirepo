import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { iconStyle } from '@/components/Icon.css';

export const projectResourceLinksStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.grid.m,
  marginBlock: theme.grid.s,
});

export const projectResourceLinkStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
});

globalStyle(`${projectResourceLinkStyle} > ${iconStyle}`, {
  marginInlineEnd: theme.grid.s,
});

export const projectDatesStyle = style({
  color: theme.colors.background.text,
  marginBlock: 0,
  opacity: 0.7,
});
