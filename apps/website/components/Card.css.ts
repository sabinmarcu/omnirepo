import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const cardWrapperStyle = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  containerType: 'inline-size',

  overflow: 'hidden',
  borderStartStartRadius: '2px',
  borderStartEndRadius: '2px',
  borderEndEndRadius: '2px',
  borderEndStartRadius: '2px',

  background: theme.colors.background.surface,
});

export const cardTitleStyle = style({
  fontSize: `calc(${theme.grid.xl} * 1.5)`,

  paddingBlock: theme.grid.s,
  paddingInline: theme.grid.m,
});
export const cardThumbnailStyle = style({
  aspectRatio: '3/2',
  maxInlineSize: '100cqw',
  containerType: 'size',
  overflow: 'hidden',
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
  // pointerEvents: 'none',
  background: theme.colors.background.depressed,
});

globalStyle(`${cardThumbnailStyle} > div`, {
  maxInlineSize: '100cqw',
  maxBlockSize: '100cqh',
  opacity: 0.4,
});

globalStyle(`${cardThumbnailStyle}:hover > div`, {
  opacity: 0.8,
});
