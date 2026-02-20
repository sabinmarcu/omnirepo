import { theme } from '@sabinmarcu/theme';
import {
  globalStyle,
  style,
} from '@vanilla-extract/css';

export const snippetCardThumbnailStyle = style({
  aspectRatio: '3/2',
  maxInlineSize: '100cqw',
  containerType: 'size',
  overflow: 'hidden',
  display: 'grid',
  placeItems: 'center',
  // pointerEvents: 'none',
  background: theme.colors.background.depressed,
});

globalStyle(`${snippetCardThumbnailStyle} > div`, {
  maxInlineSize: '100cqw',
  maxBlockSize: '100cqh',
});
