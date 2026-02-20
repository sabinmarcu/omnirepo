import {
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { theme } from '@sabinmarcu/theme';
import { zIndexLayers } from '@/constants/layers';
import { navigationOffset } from './Navigation.css';

export const showcaseLayoutStyles = style({
  containerName: 'showcase',
  containerType: 'size',
  inlineSize: '100cqw',
  blockSize: `calc(100cqh - ${navigationOffset})`,
  background: theme.colors.background.depressed,
  position: 'relative',
});

globalStyle(`${showcaseLayoutStyles} > [data-root]`, {
  position: 'absolute',
  inset: 0,
  zIndex: zIndexLayers.showcase,
});
